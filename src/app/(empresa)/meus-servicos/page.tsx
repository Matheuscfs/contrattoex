import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronDown, Star, Clock, Filter } from "lucide-react";

export default function ServicosPage() {
  // Array de categorias de serviços
  const categorias = [
    "Todas as categorias",
    "Serviços Residenciais",
    "Reformas & Construção",
    "Assistência Técnica",
    "Beleza & Estética",
    "Aulas & Consultoria",
    "Serviços para Pets",
    "Design & Tecnologia",
    "Eventos & Festas",
  ];

  // Array de serviços/profissionais para exibir
  const servicos = [
    {
      id: 1,
      nome: "Eletricistas Express",
      categoria: "Eletricista",
      avaliacao: 4.8,
      numAvaliacoes: 543,
      tempoResposta: "15-30 min",
      distancia: "2.5 km",
      preco: "A partir de R$ 80,00",
      imagem: "https://ext.same-assets.com/3240701702/2590453784.jpg",
      destacado: true,
      desconto: "20% OFF",
    },
    {
      id: 2,
      nome: "Plumb Masters",
      categoria: "Encanador",
      avaliacao: 4.9,
      numAvaliacoes: 327,
      tempoResposta: "20-35 min",
      distancia: "3.2 km",
      preco: "A partir de R$ 100,00",
      imagem: "https://ext.same-assets.com/3240701702/3558780233.jpg",
      destacado: true,
      desconto: null,
    },
    {
      id: 3,
      nome: "Clean House",
      categoria: "Diarista",
      avaliacao: 4.7,
      numAvaliacoes: 412,
      tempoResposta: "Agenda para mesmo dia",
      distancia: "1.8 km",
      preco: "A partir de R$ 150,00",
      imagem: "https://ext.same-assets.com/3240701702/2334580602.jpg",
      destacado: false,
      desconto: "15% na primeira visita",
    },
    {
      id: 4,
      nome: "Design Studio",
      categoria: "Designer",
      avaliacao: 4.6,
      numAvaliacoes: 218,
      tempoResposta: "Agenda para próximo dia",
      distancia: "5.0 km",
      preco: "Orçamento personalizado",
      imagem: "https://ext.same-assets.com/3240701702/2883271795.jpg",
      destacado: false,
      desconto: null,
    },
    {
      id: 5,
      nome: "Tech Support",
      categoria: "Assistência Técnica",
      avaliacao: 4.9,
      numAvaliacoes: 632,
      tempoResposta: "30-45 min",
      distancia: "4.2 km",
      preco: "A partir de R$ 90,00",
      imagem: "https://ext.same-assets.com/3240701702/2157232683.jpg",
      destacado: true,
      desconto: "10% para novos clientes",
    },
    {
      id: 6,
      nome: "Home Services",
      categoria: "Serviços Residenciais",
      avaliacao: 4.5,
      numAvaliacoes: 321,
      tempoResposta: "25-40 min",
      distancia: "3.8 km",
      preco: "A partir de R$ 120,00",
      imagem: "https://ext.same-assets.com/3240701702/3101954873.jpg",
      destacado: false,
      desconto: null,
    },
    {
      id: 7,
      nome: "Pro Clean",
      categoria: "Limpeza",
      avaliacao: 4.7,
      numAvaliacoes: 256,
      tempoResposta: "Agenda para próximo dia",
      distancia: "2.1 km",
      preco: "A partir de R$ 180,00",
      imagem: "https://ext.same-assets.com/3240701702/2147839405.jpg",
      destacado: false,
      desconto: "5% OFF",
    },
    {
      id: 8,
      nome: "TechFix",
      categoria: "Assistência Técnica",
      avaliacao: 4.8,
      numAvaliacoes: 489,
      tempoResposta: "20-35 min",
      distancia: "1.5 km",
      preco: "A partir de R$ 85,00",
      imagem: "https://ext.same-assets.com/3240701702/3621058343.jpg",
      destacado: true,
      desconto: null,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Barra de filtros */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-6">
              {categorias.map((categoria, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex items-center text-sm py-1 px-2 whitespace-nowrap"
                >
                  {categoria}
                  {index === 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros adicionais */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-200 text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 text-sm flex items-center gap-2">
                Ordenar
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 text-sm flex items-center gap-2">
                Distância
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar serviços"
                  className="py-2 pl-10 pr-4 border rounded-md border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ifood-red focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 mt-6">
        <h1 className="text-xl font-bold mb-4">Serviços em sua região</h1>

        {/* Listagem de serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <Link href={`/servico/${servico.id}`} key={servico.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow border-gray-200">
                <div className="relative h-40 w-full">
                  <Image
                    src={servico.imagem}
                    alt={servico.nome}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {servico.desconto && (
                    <div className="absolute top-3 left-3 bg-ifood-red text-white text-xs py-1 px-2 rounded">
                      {servico.desconto}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{servico.nome}</h3>
                      <p className="text-sm text-muted-foreground">{servico.categoria}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{servico.avaliacao}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{servico.tempoResposta}</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full mx-2"></div>
                    <span>{servico.distancia}</span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className={servico.destacado ? "text-ifood-red font-medium" : ""}>
                      {servico.preco}
                    </span>
                  </div>

                  {servico.destacado && (
                    <div className="mt-2 flex items-center">
                      <span className="text-xs bg-red-50 text-ifood-red px-2 py-1 rounded">
                        Profissional parceiro
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
