'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, AlertCircle } from 'lucide-react';
import { type CompanyService } from '@/types';
import { formatCurrency, formatDuration } from '@/utils/format';
import { ServiceFilters } from './ServiceFilters';
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
}

export function CompanyServices({ services }: CompanyServicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Oferecidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {service.estimatedDuration.value} {service.estimatedDuration.unit}
                  </span>
                </div>
                <div className="text-primary font-medium">
                  R$ {service.price.value}/{service.price.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 