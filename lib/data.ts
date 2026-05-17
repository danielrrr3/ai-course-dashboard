import { supabase } from './supabase'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgOrderValue: number
  revenueChangePct: number
  ordersChangePct: number
}

export interface MonthlyData {
  month: string
  revenue: number
  expenses: number
}

export interface CategoryData {
  category: string
  total: number
}

export interface TopCustomer {
  customer_name: string
  total_orders: number
  total_revenue: number
  avg_order: number
}

export interface RecentSale {
  id: number
  date: string
  customer_name: string | null
  product: string
  category: string
  amount_sar: number
  status: string
  payment_method: string | null
}

export interface LowStockItem {
  product_id: string
  product_name: string
  category: string
  in_stock: number
  reorder_level: number
  warehouse_location: string
}

export interface FeedbackSummary {
  avgRating: number
  total: number
  pending: number
  positive: number
  negative: number
}

function monthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${names[parseInt(month) - 1]} '${year.slice(2)}`
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [salesRes, customersRes] = await Promise.all([
    supabase.from('sales').select('date, amount_sar, status'),
    supabase.from('customers').select('customer_id', { count: 'exact', head: true }),
  ])

  const all = salesRes.data ?? []
  const completed = all.filter(s => s.status === 'Completed')

  const totalRevenue = completed.reduce((sum, s) => sum + Number(s.amount_sar), 0)
  const totalOrders = all.length
  const totalCustomers = customersRes.count ?? 0
  const avgOrderValue = completed.length > 0 ? totalRevenue / completed.length : 0

  const febCompleted = completed.filter(s => s.date?.startsWith('2026-02'))
  const janCompleted = completed.filter(s => s.date?.startsWith('2026-01'))
  const febRev = febCompleted.reduce((sum, s) => sum + Number(s.amount_sar), 0)
  const janRev = janCompleted.reduce((sum, s) => sum + Number(s.amount_sar), 0)
  const revenueChangePct = janRev > 0 ? ((febRev - janRev) / janRev) * 100 : 0

  const febOrders = all.filter(s => s.date?.startsWith('2026-02')).length
  const janOrders = all.filter(s => s.date?.startsWith('2026-01')).length
  const ordersChangePct = janOrders > 0 ? ((febOrders - janOrders) / janOrders) * 100 : 0

  return {
    totalRevenue: Math.round(totalRevenue),
    totalOrders,
    totalCustomers,
    avgOrderValue: Math.round(avgOrderValue),
    revenueChangePct: Math.round(revenueChangePct * 10) / 10,
    ordersChangePct: Math.round(ordersChangePct * 10) / 10,
  }
}

export async function getMonthlyData(): Promise<MonthlyData[]> {
  const [salesRes, expensesRes] = await Promise.all([
    supabase.from('sales').select('date, amount_sar, status'),
    supabase.from('expenses').select('date, amount_sar'),
  ])

  const rev: Record<string, number> = {}
  const exp: Record<string, number> = {}

  salesRes.data?.forEach(s => {
    if (!s.date || s.status !== 'Completed') return
    const ym = s.date.slice(0, 7)
    rev[ym] = (rev[ym] ?? 0) + Number(s.amount_sar)
  })

  expensesRes.data?.forEach(e => {
    if (!e.date) return
    const ym = e.date.slice(0, 7)
    exp[ym] = (exp[ym] ?? 0) + Number(e.amount_sar)
  })

  const months = Array.from(new Set([...Object.keys(rev), ...Object.keys(exp)])).sort()

  return months.map(ym => ({
    month: monthLabel(ym),
    revenue: Math.round(rev[ym] ?? 0),
    expenses: Math.round(exp[ym] ?? 0),
  }))
}

export async function getCategoryData(): Promise<CategoryData[]> {
  const { data } = await supabase.from('sales').select('category, amount_sar, status')

  const by: Record<string, number> = {}
  data?.forEach(s => {
    if (s.status !== 'Completed') return
    by[s.category] = (by[s.category] ?? 0) + Number(s.amount_sar)
  })

  return Object.entries(by)
    .map(([category, total]) => ({ category, total: Math.round(total) }))
    .sort((a, b) => b.total - a.total)
}

export async function getTopCustomers(): Promise<TopCustomer[]> {
  const { data } = await supabase
    .from('sales')
    .select('customer_name, amount_sar, status')
    .not('customer_name', 'is', null)
    .neq('status', 'Returned')

  const map: Record<string, { revenue: number; orders: number }> = {}
  data?.forEach(s => {
    const name = s.customer_name!
    if (!map[name]) map[name] = { revenue: 0, orders: 0 }
    map[name].revenue += Number(s.amount_sar)
    map[name].orders++
  })

  return Object.entries(map)
    .map(([customer_name, { revenue, orders }]) => ({
      customer_name,
      total_revenue: Math.round(revenue),
      total_orders: orders,
      avg_order: Math.round(revenue / orders),
    }))
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 10)
}

export async function getRecentSales(limit = 12): Promise<RecentSale[]> {
  const { data } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)

  return (data ?? []).map(s => ({ ...s, amount_sar: Number(s.amount_sar) }))
}

export async function getLowStockItems(): Promise<LowStockItem[]> {
  const { data } = await supabase
    .from('inventory')
    .select('product_id, product_name, category, in_stock, reorder_level, warehouse_location')
    .order('in_stock', { ascending: true })

  return (data ?? []).filter(
    item => Number(item.in_stock) <= Number(item.reorder_level)
  )
}

export async function getFeedbackSummary(): Promise<FeedbackSummary> {
  const { data } = await supabase.from('feedback').select('rating, response_status')
  if (!data?.length) return { avgRating: 0, total: 0, pending: 0, positive: 0, negative: 0 }

  const total = data.length
  const avgRating = data.reduce((sum, r) => sum + Number(r.rating), 0) / total
  return {
    avgRating: Math.round(avgRating * 10) / 10,
    total,
    pending: data.filter(r => r.response_status === 'Pending').length,
    positive: data.filter(r => Number(r.rating) >= 4).length,
    negative: data.filter(r => Number(r.rating) <= 2).length,
  }
}