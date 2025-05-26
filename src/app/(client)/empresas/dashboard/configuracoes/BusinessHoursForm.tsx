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
import { Checkbox } from '@/components/ui/checkbox'

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

const daySchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(timeRegex, 'Formato inválido (HH:MM)'),
  closeTime: z.string().regex(timeRegex, 'Formato inválido (HH:MM)'),
})

const formSchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
})

type FormData = z.infer<typeof formSchema>
type DayId = keyof FormData

const defaultDay = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '18:00',
}

const days: { id: DayId; label: string }[] = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

export function BusinessHoursForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monday: defaultDay,
      tuesday: defaultDay,
      wednesday: defaultDay,
      thursday: defaultDay,
      friday: defaultDay,
      saturday: { ...defaultDay, openTime: '09:00', closeTime: '13:00' },
      sunday: { ...defaultDay, isOpen: false },
    },
  })

  function onSubmit(values: FormData) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {days.map((day) => (
          <div key={day.id} className="space-y-4">
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name={`${day.id}.isOpen` as const}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {day.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {form.getValues(`${day.id}.isOpen`) && (
              <div className="flex items-center space-x-4 ml-6">
                <FormField
                  control={form.control}
                  name={`${day.id}.openTime` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abertura</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`${day.id}.closeTime` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fechamento</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        ))}
        <Button type="submit">Salvar Horários</Button>
      </form>
    </Form>
  )
} 