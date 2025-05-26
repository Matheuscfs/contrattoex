import { MapPin, Phone, Mail, Globe, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Company } from '@/types/company'

interface CompanyInfoProps {
  company: Company
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  const weekDays = {
    sunday: 'Domingo',
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado'
  }

  return (
    <div className="space-y-6">
      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {company.address.street}, {company.address.number}
            {company.address.complement && ` - ${company.address.complement}`}
            <br />
            {company.address.neighborhood}
            <br />
            {company.address.city} - {company.address.state}
            <br />
            CEP: {company.address.postal_code}
          </p>
          {/* TODO: Adicionar mapa */}
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {company.contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <a
                href={`tel:${company.contact.phone}`}
                className="text-gray-600 hover:underline"
              >
                {company.contact.phone}
              </a>
            </div>
          )}

          {company.contact.whatsapp && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <a
                href={`https://wa.me/${company.contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                WhatsApp: {company.contact.whatsapp}
              </a>
            </div>
          )}

          {company.contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <a
                href={`mailto:${company.contact.email}`}
                className="text-gray-600 hover:underline"
              >
                {company.contact.email}
              </a>
            </div>
          )}

          {company.contact.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <a
                href={company.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                {company.contact.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horário de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(company.business_hours).map(([day, hours]) => (
              <div
                key={day}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">
                  {weekDays[day as keyof typeof weekDays]}
                </span>
                <span className="font-medium">
                  {hours.is_closed
                    ? 'Fechado'
                    : `${hours.open} - ${hours.close}`}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 