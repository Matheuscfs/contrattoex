'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'

const serviceSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Preço inválido'),
  duration: z.string().regex(/^\d+$/, 'Duração deve ser um número inteiro'),
  category: z.string().min(1, 'Selecione uma categoria'),
  subcategory: z.string().optional(),
  images: z.array(z.string()).optional(),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  onSuccess?: () => void
  initialData?: ServiceFormData
}

export function ServiceForm({ onSuccess, initialData }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClientComponentClient()

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      subcategory: '',
      images: [],
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name')

      if (error) throw error

      setCategories(data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setLoading(true)

      const { error } = await supabase.from('services').insert([
        {
          ...data,
          price: parseFloat(data.price),
          duration: parseInt(data.duration),
          status: 'pending_approval',
        },
      ])

      if (error) throw error

      toast.success('Serviço cadastrado com sucesso!')
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error)
      toast.error('Erro ao cadastrar serviço')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Serviço</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagens</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  disabled={loading}
                  onChange={(urls) => field.onChange(urls)}
                  onRemove={(url) =>
                    field.onChange(
                      field.value?.filter((current) => current !== url)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Serviço'}
        </Button>
      </form>
    </Form>
  )
} 