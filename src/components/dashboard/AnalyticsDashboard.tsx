'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

interface AnalyticsData {
  revenue: number[]
  appointments: number[]
  reviews: number[]
  labels: string[]
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const revenueData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Faturamento',
        data: data.revenue,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const appointmentsData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Agendamentos',
        data: data.appointments,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Faturamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={revenueData} options={options} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={appointmentsData} options={options} />
        </CardContent>
      </Card>
    </div>
  )
} 