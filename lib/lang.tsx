'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type Lang = 'en' | 'ar'

const strings = {
  en: {
    overview: 'Overview',
    dashboard: 'Dashboard',
    liveData: (orders: number, customers: number) =>
      `Live data — ${orders} orders across ${customers} customers`,
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    customers: 'Customers',
    avgOrderValue: 'Avg Order Value',
    vsLastMonth: 'vs last month',
    totalRegistered: 'total registered',
    perCompletedSale: 'per completed sale',
    monthlyRevenueVsExpenses: 'Monthly Revenue vs Expenses',
    chartPeriod: 'Mar 2025 – Feb 2026',
    salesByCategory: 'Sales by Category',
    aiInsights: 'AI Insights',
    refresh: 'Refresh',
    analyzing: 'Analyzing…',
    couldNotLoadInsights: 'Could not load insights',
    goingWell: 'Going Well',
    watch: 'Watch',
    opportunity: 'Opportunity',
    risk: 'Risk',
    vsLastPeriod: 'vs. Last Period',
    askTheAnalyst: 'Ask the Analyst',
    poweredBy: 'Powered by live Supabase data · voice enabled',
    clear: 'Clear',
    askAboutYourBusiness: 'Ask about your business',
    queriesRunAgainst: 'Queries run against live Supabase data',
    somethingWentWrong: 'Something went wrong — please try again.',
    placeholder: 'Ask about sales, products, customers…',
    suggestions: [
      'What were total sales last month?',
      'Which product category has the highest margin?',
      'Who are the top 3 customers by spend?',
      'What items are low on inventory?',
    ],
    menu: 'Menu',
    systemOnline: 'System online',
    navDashboard: 'Dashboard',
    navAnalytics: 'Analytics',
    navReports: 'Reports',
    navDocuments: 'Documents',
    navNewEntry: 'New Entry',
    navSettings: 'Settings',
  },
  ar: {
    overview: 'نظرة عامة',
    dashboard: 'لوحة التحكم',
    liveData: (orders: number, customers: number) =>
      `بيانات مباشرة — ${orders} طلباً من ${customers} عميلاً`,
    totalRevenue: 'إجمالي الإيرادات',
    totalOrders: 'إجمالي الطلبات',
    customers: 'العملاء',
    avgOrderValue: 'متوسط قيمة الطلب',
    vsLastMonth: 'مقارنة بالشهر الماضي',
    totalRegistered: 'إجمالي المسجلين',
    perCompletedSale: 'لكل عملية بيع مكتملة',
    monthlyRevenueVsExpenses: 'الإيرادات الشهرية مقابل المصروفات',
    chartPeriod: 'Mar 2025 – Feb 2026',
    salesByCategory: 'المبيعات حسب الفئة',
    aiInsights: 'تحليلات الذكاء الاصطناعي',
    refresh: 'تحديث',
    analyzing: 'جارٍ التحليل…',
    couldNotLoadInsights: 'تعذّر تحميل التحليلات',
    goingWell: 'ما يسير جيداً',
    watch: 'تحت المراقبة',
    opportunity: 'فرصة',
    risk: 'خطر',
    vsLastPeriod: 'مقارنة بالفترة السابقة',
    askTheAnalyst: 'استشر المحلل',
    poweredBy: 'مدعوم ببيانات Supabase المباشرة · صوت مُفعَّل',
    clear: 'مسح',
    askAboutYourBusiness: 'اسأل عن عملك',
    queriesRunAgainst: 'تُشغَّل الاستعلامات على بيانات Supabase المباشرة',
    somethingWentWrong: 'حدث خطأ ما — يرجى المحاولة مرة أخرى.',
    placeholder: 'اسأل عن المبيعات والمنتجات والعملاء…',
    suggestions: [
      'ما هي إجمالي المبيعات الشهر الماضي؟',
      'أي فئة منتجات تحقق أعلى هامش ربح؟',
      'من هم أفضل 3 عملاء من حيث الإنفاق؟',
      'ما العناصر التي تنفد من المخزون؟',
    ],
    menu: 'القائمة',
    systemOnline: 'النظام متصل',
    navDashboard: 'لوحة التحكم',
    navAnalytics: 'التحليلات',
    navReports: 'التقارير',
    navDocuments: 'المستندات',
    navNewEntry: 'إدخال جديد',
    navSettings: 'الإعدادات',
  },
}

export type Strings = typeof strings.en

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  s: Strings
}

const LangContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  s: strings.en,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'ar') setLangState('ar')
  }, [])

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, s: strings[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
