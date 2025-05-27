'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
  id: string;
  name: string;
  description: string;
  price: {
    value: number;
    unit: string;
  };
  estimatedDuration: {
    value: number;
    unit: string;
  };
  category: string;
  images: string[];
}

interface CompanyServicesProps {
  services: Service[];
  empresaId: string;
}

export function CompanyServices({ services, empresaId }: CompanyServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Oferecidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link 
              key={service.id} 
              href={`/empresas/${empresaId}/servicos/${service.id}`}
              className="block group"
            >
              <div className="border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                      {service.estimatedDuration.value} {service.estimatedDuration.unit === 'hour' ? 'hora' : service.estimatedDuration.unit}
                  </span>
                </div>
                <div className="text-primary font-medium">
                    R$ {service.price.value}/{service.price.unit === 'hour' ? 'hora' : service.price.unit}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 