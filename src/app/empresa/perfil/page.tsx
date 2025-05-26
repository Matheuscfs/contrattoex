'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard'
import { ReviewsSection } from '@/components/dashboard/ReviewsSection'
import { QuotesSection } from '@/components/dashboard/QuotesSection'

interface BusinessProfile {
  name: string
  description: string
  phone: string
  address: string
  avatar_url?: string
}

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

interface Quote {
  id: string
  client_name: string
  service_name: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  estimated_value?: number
}

export default function BusinessProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<BusinessProfile>({
    name: user?.user_metadata?.name || '',
    description: user?.user_metadata?.description || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    avatar_url: user?.user_metadata?.avatar_url
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    revenue: [],
    appointments: [],
    reviews: [],
    labels: []
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    if (!user) return

    try {
      // Carregar dados de analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(7)

      if (analyticsError) throw analyticsError

      // Carregar reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })

      if (reviewsError) throw reviewsError

      // Carregar orçamentos
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('business_id', user.id)
        .order('created_at', { ascending: false })

      if (quotesError) throw quotesError

      // Processar dados de analytics
      const processedAnalytics = {
        revenue: analyticsData.map(d => d.revenue) || [],
        appointments: analyticsData.map(d => d.appointments) || [],
        reviews: analyticsData.map(d => d.reviews) || [],
        labels: analyticsData.map(d => new Date(d.date).toLocaleDateString('pt-BR')) || []
      }

      setAnalyticsData(processedAnalytics)
      setReviews(reviewsData || [])
      setQuotes(quotesData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados. Tente novamente.')
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      const { error } = await supabase.auth.updateUser({
        data: profile
      })

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleApproveQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'approved' })
        .eq('id', quoteId)

      if (error) throw error

      toast.success('Orçamento aprovado com sucesso!')
      loadData()
    } catch (error) {
      console.error('Erro ao aprovar orçamento:', error)
      toast.error('Erro ao aprovar orçamento. Tente novamente.')
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId)

      if (error) throw error

      toast.success('Orçamento rejeitado com sucesso!')
      loadData()
    } catch (error) {
      console.error('Erro ao rejeitar orçamento:', error)
      toast.error('Erro ao rejeitar orçamento. Tente novamente.')
    }
  }

  if (!user) return null

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Perfil da Empresa</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              disabled={!isEditing}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <AnalyticsDashboard data={analyticsData} />
      </div>

      <div className="mt-10">
        <ReviewsSection reviews={reviews} />
      </div>

      <div className="mt-10">
        <QuotesSection
          quotes={quotes}
          onApprove={handleApproveQuote}
          onReject={handleRejectQuote}
        />
      </div>
    </div>
  )
} 