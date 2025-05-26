import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceProvider {
  id: string;
  name: string;
  image: string;
  rating: number;
  totalReviews: number;
  location: string;
  phone: string;
  categories: string[];
}

interface FavoritesListProps {
  providers: ServiceProvider[];
  onRemoveFavorite: (id: string) => void;
  onScheduleService: (id: string) => void;
}

export function FavoritesList({
  providers,
  onRemoveFavorite,
  onScheduleService,
}: FavoritesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Favoritos</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={provider.image}
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{provider.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{provider.rating}</span>
                    <span className="text-muted-foreground">
                      ({provider.totalReviews} avaliações)
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFavorite(provider.id)}
                  aria-label="Remover dos favoritos"
                >
                  <Heart className="w-5 h-5 fill-current text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{provider.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{provider.phone}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {provider.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => onScheduleService(provider.id)}
              >
                Agendar Serviço
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 