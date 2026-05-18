import DashboardShell from './components/DashboardShell'
import { getDashboardMetrics, getMonthlyData, getCategoryData } from '../lib/data'

export default async function Dashboard() {
  const [metrics, monthlyData, categoryData] = await Promise.all([
    getDashboardMetrics(),
    getMonthlyData(),
    getCategoryData(),
  ])

  return <DashboardShell metrics={metrics} monthlyData={monthlyData} categoryData={categoryData} />
}
