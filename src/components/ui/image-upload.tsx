'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Trash } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string[]) => void
  onRemove: (value: string) => void
  value: string[]
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files
      if (!files) return

      const newImages: string[] = []

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `services/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        if (urlData) {
          newImages.push(urlData.publicUrl)
        }
      }

      onChange([...value, ...newImages])
      toast.success('Imagens enviadas com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload das imagens')
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-lg overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <ImagePlus className="h-4 w-4" />
          Adicionar Imagem
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onUpload}
          disabled={disabled}
        />
      </div>
    </div>
  )
} 