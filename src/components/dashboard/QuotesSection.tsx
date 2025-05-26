'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface Quote {
  id: string
  client_name: string
  service_name: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  estimated_value?: number
}

interface QuotesSectionProps {
  quotes: Quote[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function QuotesSection({ quotes, onApprove, onReject }: QuotesSectionProps) {
  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Rejeitado'
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Orçamentos Solicitados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum orçamento solicitado.</p>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{quote.client_name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(quote.status)}>
                    {getStatusText(quote.status)}
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="font-medium">{quote.service_name}</p>
                  <p className="text-gray-600 mt-1">{quote.description}</p>
                  {quote.estimated_value && (
                    <p className="text-sm font-medium mt-2">
                      Valor estimado: R$ {quote.estimated_value.toFixed(2)}
                    </p>
                  )}
                </div>
                {quote.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onApprove(quote.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(quote.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 