'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Loader2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

interface LogoUploadProps {
  currentLogo?: string | null
  onUploadComplete: (url: string) => void
}

export function LogoUpload({ currentLogo, onUploadComplete }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentLogo || null)
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    try {
      setIsUploading(true)

      // Cria preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload para o Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const filePath = `company-logos/${fileName}`

      // Primeiro, vamos excluir o logo antigo se existir
      if (currentLogo) {
        const oldPath = currentLogo.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('public')
            .remove([`company-logos/${oldPath}`])
        }
      }

      // Upload do novo logo
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath)

      // Atualizar o logo_url nas configurações da empresa
      const { error: updateError } = await supabase
        .from('company_settings')
        .upsert({
          user_id: user?.id,
          logo_url: publicUrl
        })

      if (updateError) throw updateError

      onUploadComplete(publicUrl)
      toast.success('Logo atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error)
      toast.error('Erro ao fazer upload do logo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
        {preview ? (
          <Image
            src={preview}
            alt="Logo da empresa"
            fill
            className="object-cover"
            sizes="128px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Label
          htmlFor="logo"
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Alterar Logo'
          )}
        </Label>
        <input
          id="logo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        <p className="text-sm text-muted-foreground">
          PNG, JPG ou GIF até 5MB
        </p>
      </div>
    </div>
  )
} 