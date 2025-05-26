import Image from 'next/image'
import { Star, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Company } from '@/types/company'

interface CompanyHeaderProps {
  company: Company
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <div className="relative h-[400px]">
      {/* Banner */}
      <div className="absolute inset-0">
        <Image
          src={company.banner_url}
          alt={company.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 h-full">
        <div className="relative h-full flex flex-col justify-end pb-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-white">
              <Image
                src={company.logo_url}
                alt={company.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Informações */}
            <div className="flex-1 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{company.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{company.total_reviews} avaliações</span>
                    <span>•</span>
                    <Badge variant="secondary" className="text-sm">
                      {company.is_open ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 