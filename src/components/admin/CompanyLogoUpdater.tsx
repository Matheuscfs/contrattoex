'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Upload, Save, Eye } from 'lucide-react'
import Image from 'next/image'

interface Company {
  id: string
  name: string
  full_name: string
  email: string
  avatar_url: string | null
  description: string | null
  website: string | null
}

const COMPANY_LOGOS = {
  'Grupo UNUS': '/logos/grupo-unus.png',
  'Transdesk': '/logos/transdesk.png', 
  'BR Center Truck': '/logos/br-center-truck.png',
  'TDK Corretora de Seguros': '/logos/tdk-seguros.png',
  'TK Soluções': '/logos/tk.png'
}

export function CompanyLogoUpdater() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, full_name, email, avatar_url, description, website')
        .in('role', ['business', 'company'])
        .order('created_at')

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyLogo = async (companyId: string, logoUrl: string, companyName: string) => {
    try {
      setUpdating(companyId)
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: logoUrl,
          full_name: companyName,
          name: companyName,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)

      if (error) throw error

      toast.success(`Logo da ${companyName} atualizada com sucesso!`)
      loadCompanies()
    } catch (error) {
      console.error('Erro ao atualizar logo:', error)
      toast.error('Erro ao atualizar logo da empresa')
    } finally {
      setUpdating(null)
    }
  }

  const updateAllLogos = async () => {
    try {
      setUpdating('all')
      
      const updates = Object.entries(COMPANY_LOGOS).map(async ([companyName, logoUrl], index) => {
        if (companies[index]) {
          return supabase
            .from('profiles')
            .update({
              avatar_url: logoUrl,
              full_name: companyName,
              name: companyName,
              updated_at: new Date().toISOString()
            })
            .eq('id', companies[index].id)
        }
      })

      await Promise.all(updates.filter(Boolean))
      
      toast.success('Todas as logos foram atualizadas!')
      loadCompanies()
    } catch (error) {
      console.error('Erro ao atualizar todas as logos:', error)
      toast.error('Erro ao atualizar logos')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando empresas...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Atualizar Logos das Empresas
            <Button 
              onClick={updateAllLogos}
              disabled={updating === 'all'}
              className="ml-4"
            >
              {updating === 'all' ? 'Atualizando...' : 'Atualizar Todas'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {Object.entries(COMPANY_LOGOS).map(([companyName, logoUrl], index) => {
              const company = companies[index]
              
              return (
                <div key={companyName} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 relative border rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={logoUrl}
                        alt={companyName}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-company.jpg'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{companyName}</h3>
                    <p className="text-sm text-gray-500">
                      {company ? `Atual: ${company.full_name || company.name}` : 'Empresa não encontrada'}
                    </p>
                    <p className="text-xs text-gray-400">{logoUrl}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(logoUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {company && (
                      <Button
                        size="sm"
                        onClick={() => updateCompanyLogo(company.id, logoUrl, companyName)}
                        disabled={updating === company.id}
                      >
                        {updating === company.id ? (
                          'Atualizando...'
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Atualizar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 relative border rounded-lg overflow-hidden bg-gray-50">
                  {company.avatar_url ? (
                    <Image
                      src={company.avatar_url}
                      alt={company.full_name || company.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-company.jpg'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sem logo
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{company.full_name || company.name}</h4>
                  <p className="text-sm text-gray-500">{company.email}</p>
                  {company.description && (
                    <p className="text-xs text-gray-400 mt-1">{company.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 