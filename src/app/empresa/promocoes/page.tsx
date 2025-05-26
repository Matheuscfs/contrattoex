import * as React from "react";
import { CompanyLayout } from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

// Dados mockados para desenvolvimento
const mockPromotions = [
  {
    id: 1,
    title: "Corte + Barba",
    description: "Combo especial de corte masculino com barba",
    originalPrice: 85.0,
    discountPrice: 65.0,
    startDate: "2024-03-20",
    endDate: "2024-04-20",
    status: "active" as const,
    services: ["Corte de Cabelo", "Barba"],
  },
  {
    id: 2,
    title: "Dia da Beleza",
    description: "Pacote completo com hidratação e coloração",
    originalPrice: 250.0,
    discountPrice: 180.0,
    startDate: "2024-03-25",
    endDate: "2024-04-25",
    status: "scheduled" as const,
    services: ["Coloração", "Hidratação"],
  },
  {
    id: 3,
    title: "Happy Hour Beauty",
    description: "Descontos especiais das 16h às 19h",
    originalPrice: 120.0,
    discountPrice: 90.0,
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    status: "expired" as const,
    services: ["Corte de Cabelo", "Hidratação"],
  },
];

const statusMap = {
  active: {
    label: "Ativa",
    color: "bg-green-100 text-green-800",
  },
  scheduled: {
    label: "Agendada",
    color: "bg-blue-100 text-blue-800",
  },
  expired: {
    label: "Expirada",
    color: "bg-gray-100 text-gray-800",
  },
};

export default function PromotionsPage() {
  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promoções</h1>
            <p className="text-muted-foreground">
              Gerencie as promoções do seu negócio
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Ativas
              </CardTitle>
              <CardDescription>Promoções em andamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockPromotions.filter(
                    (promotion) => promotion.status === "active"
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Desconto Médio
              </CardTitle>
              <CardDescription>Percentual médio de desconto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockPromotions.reduce(
                    (acc, promotion) =>
                      acc +
                      ((promotion.originalPrice - promotion.discountPrice) /
                        promotion.originalPrice) *
                        100,
                    0
                  ) / mockPromotions.length
                )}
                %
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Agendadas
              </CardTitle>
              <CardDescription>Promoções futuras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockPromotions.filter(
                    (promotion) => promotion.status === "scheduled"
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Promoções Expiradas
              </CardTitle>
              <CardDescription>Promoções encerradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  mockPromotions.filter(
                    (promotion) => promotion.status === "expired"
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Promoções</CardTitle>
            <CardDescription>
              Visualize e gerencie todas as promoções
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Preço Original</TableHead>
                  <TableHead>Preço Promocional</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">
                      {promotion.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {promotion.services.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>R$ {promotion.originalPrice.toFixed(2)}</TableCell>
                    <TableCell>R$ {promotion.discountPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(promotion.startDate).toLocaleDateString(
                            "pt-BR"
                          )}{" "}
                          -{" "}
                          {new Date(promotion.endDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusMap[promotion.status].color}
                      >
                        {statusMap[promotion.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CompanyLayout>
  );
} 