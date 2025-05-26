import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Company } from '@/types/company'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface QuotationFormProps {
  company: Company
}

const formSchema = z.object({
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  description: z.string().min(10, 'Descreva seu pedido em pelo menos 10 caracteres'),
  preferred_dates: z.array(z.date()).min(1, 'Selecione pelo menos uma data preferida'),
  contact_info: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
  }),
  reference_images: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function QuotationForm({ company }: QuotationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      description: '',
      preferred_dates: [],
      contact_info: {
        name: '',
        email: '',
        phone: '',
      },
      reference_images: [],
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('quotations')
        .insert({
          company_id: company.id,
          ...data,
        })

      if (error) throw error

      router.push(`/empresas/${company.id}/orcamento/sucesso`)
    } catch (error) {
      console.error('Error submitting quotation:', error)
      // TODO: Adicionar toast de erro
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Serviços */}
        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <FormLabel>Serviços Desejados</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.services.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Card className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={field.value?.includes(service.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, service.id])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== service.id)
                                      )
                                }}
                              />
                              <div className="space-y-1">
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-gray-600">
                                  R$ {service.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Pedido</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os detalhes do seu pedido..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Datas Preferidas */}
        <FormField
          control={form.control}
          name="preferred_dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datas Preferidas</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value?.length && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.length > 0
                        ? field.value
                            .map((date) =>
                              format(date, 'PPP', { locale: ptBR })
                            )
                            .join(', ')
                        : 'Selecione as datas'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="multiple"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Informações de Contato */}
        <div className="space-y-4">
          <FormLabel>Informações de Contato</FormLabel>

          <FormField
            control={form.control}
            name="contact_info.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_info.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_info.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TODO: Upload de imagens de referência */}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Solicitar Orçamento'
          )}
        </Button>
      </form>
    </Form>
  )
} 