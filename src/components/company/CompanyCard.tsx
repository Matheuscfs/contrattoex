import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Company } from '@/types/company'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/empresas/${company.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="relative h-48 p-0">
          <Image
            src={company.logo_url}
            alt={company.name}
            fill
            className="object-cover rounded-t-lg"
          />
          <Badge 
            variant={company.is_open ? "success" : "secondary"}
            className="absolute top-4 right-4"
          >
            {company.is_open ? 'Aberto' : 'Fechado'}
          </Badge>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2">{company.name}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{company.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {company.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {company.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {company.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{company.categories.length - 3}
              </Badge>
            )}
          </div>

          {company.distance && (
            <p className="text-sm text-gray-600 mt-3">
              {company.distance < 1 
                ? `${(company.distance * 1000).toFixed(0)}m`
                : `${company.distance.toFixed(1)}km`
              } de distância
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 