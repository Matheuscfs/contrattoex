import { Metadata } from 'next'
import { DashboardMetrics } from '@/components/analytics/DashboardMetrics'
import { ServiceMetrics } from '@/components/analytics/ServiceMetrics'
import { CustomerMetrics } from '@/components/analytics/CustomerMetrics'
import { RevenueChart } from '@/components/analytics/RevenueChart'

export const metadata: Metadata = {
  title: 'Analytics - iServiços',
  description: 'Análise detalhada do desempenho do seu negócio.',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Análise detalhada do desempenho do seu negócio.
        </p>
      </div>

      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-2">
        <ServiceMetrics />
        <CustomerMetrics />
      </div>

      <RevenueChart />
    </div>
  )
} 