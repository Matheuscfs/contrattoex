import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

interface SelecaoPrestadorProps {
  onSelect?: (prestadorId: string) => void
}

interface Prestador {
  id: string
  nome: string
  especialidade: string
}

export function SelecaoPrestador({ onSelect }: SelecaoPrestadorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function carregarPrestadores() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('users')
          .select('id, nome:user_metadata->nome, especialidade:user_metadata->especialidade')
          .eq('role', 'prestador')

        if (error) throw error

        setPrestadores(data as Prestador[])
      } catch (err) {
        console.error('Erro ao carregar prestadores:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarPrestadores()
  }, [supabase])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {loading
            ? 'Carregando...'
            : value
            ? prestadores.find((prestador) => prestador.id === value)?.nome
            : 'Selecione um profissional...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar profissional..." />
          <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
          <CommandGroup>
            {prestadores.map((prestador) => (
              <CommandItem
                key={prestador.id}
                value={prestador.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  onSelect?.(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === prestador.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div>
                  <p>{prestador.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {prestador.especialidade}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 