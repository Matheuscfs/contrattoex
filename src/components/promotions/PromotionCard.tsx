import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star } from 'lucide-react';

interface PromotionCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  provider: {
    name: string;
    rating: number;
    location: string;
  };
  validUntil: string;
}

export function PromotionCard({
  id,
  title,
  description,
  image,
  originalPrice,
  discountedPrice,
  discountPercentage,
  provider,
  validUntil,
}: PromotionCardProps) {
  return (
    <Link href={`/promocoes/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <Badge 
            className="absolute top-4 right-4 bg-ifood-red text-white"
          >
            {discountPercentage}% OFF
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-ifood-yellow fill-current" />
              <span className="ml-1 text-sm">{provider.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {provider.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500 line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
              <div className="text-lg font-bold text-ifood-red">
                R$ {discountedPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              Válido até {new Date(validUntil).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 