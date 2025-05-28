'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').max(11, 'Telefone inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido').max(11, 'WhatsApp inválido'),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
})

interface ContactFormProps {
  contact?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };
  companyId?: string;
}

export function ContactForm({ contact, companyId }: ContactFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: contact?.email || '',
      phone: contact?.phone || '',
      whatsapp: contact?.whatsapp || '',
      instagram: contact?.instagram || '',
      facebook: contact?.facebook || '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, companyId)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Contato</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 0000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="@suaempresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input placeholder="facebook.com/suaempresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar Contatos</Button>
      </form>
    </Form>
  )
} 