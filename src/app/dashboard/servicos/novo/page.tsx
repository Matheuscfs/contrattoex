'use client'

import { useRouter } from 'next/navigation'
import { ServiceForm } from '@/components/services/ServiceForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewServicePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/dashboard/servicos')
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  )
} 