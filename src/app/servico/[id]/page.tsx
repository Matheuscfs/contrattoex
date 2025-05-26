import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, Phone, Calendar, Share2, Heart, ChevronDown, MessageSquare } from "lucide-react";

export default function ServicoDetalhe({ params }: { params: { id: string } }) {
  // Simulando dados do serviço baseado no ID
  const servico = {
    id: parseInt(params.id),
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
    descricao: "Serviços especializados de eletricista para residências e pequenos comércios. Atendimento rápido e eficiente para instalações, reparos e manutenções elétricas.",
    endereco: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    telefone: "(11) 99999-9999",
    horario: "Segunda a Sábado, 08:00 às 18:00",
    servicos: [
      {
        id: 1,
        nome: "Instalação de Tomadas",
        descricao: "Instalação de tomadas simples ou com aterramento.",
        preco: "R$ 80,00",
        tempo: "30 min",
        imagem: "https://ext.same-assets.com/3240701702/1493022944.jpg"
      },
      {
        id: 2,
        nome: "Instalação de Lustres",
        descricao: "Instalação de lustres e luminárias no teto ou parede.",
        preco: "R$ 120,00",
        tempo: "45 min",
        imagem: "https://ext.same-assets.com/3240701702/2904193395.jpg"
      },
      {
        id: 3,
        nome: "Troca de Disjuntor",
        descricao: "Substituição de disjuntores no quadro de luz.",
        preco: "R$ 100,00",
        tempo: "30 min",
        imagem: "https://ext.same-assets.com/3240701702/3865583326.jpg"
      },
      {
        id: 4,
        nome: "Reparo de Curto-Circuito",
        descricao: "Diagnóstico e reparo de curto-circuito.",
        preco: "R$ 150,00",
        tempo: "60 min",
        imagem: "https://ext.same-assets.com/3240701702/1221583293.jpg"
      }
    ],
    avaliacoes: [
      {
        id: 1,
        usuario: "João Silva",
        nota: 5,
        comentario: "Excelente serviço, muito rápido e profissional.",
        data: "10/05/2025"
      },
      {
        id: 2,
        usuario: "Maria Oliveira",
        nota: 4,
        comentario: "Bom trabalho, mas demorou um pouco mais que o esperado.",
        data: "05/05/2025"
      },
      {
        id: 3,
        usuario: "Pedro Santos",
        nota: 5,
        comentario: "Profissional muito atencioso e caprichoso. Resolveu meu problema rapidamente.",
        data: "01/05/2025"
      }
    ]
  };

  // Renderizar placeholder se não encontrar o serviço
  if (!servico) {
    return <div className="container mx-auto px-4 py-12">Serviço não encontrado</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Cabeçalho do serviço */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagem do serviço */}
            <div className="md:w-1/3 h-64 relative rounded-lg overflow-hidden">
              <Image
                src={servico.imagem}
                alt={servico.nome}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>

            {/* Informações do serviço */}
            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{servico.nome}</h1>
                  <p className="text-muted-foreground">{servico.categoria}</p>

                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium mr-2">{servico.avaliacao}</span>
                    <span className="text-muted-foreground text-sm">({servico.numAvaliacoes} avaliações)</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{servico.tempoResposta} • {servico.distancia}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{servico.endereco}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{servico.telefone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{servico.horario}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm">{servico.descricao}</p>
              </div>

              <div className="mt-6">
                <Button className="bg-ifood-red hover:bg-red-700">
                  Solicitar serviço
                </Button>
                <Button variant="outline" className="ml-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Conversar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Serviços oferecidos */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Serviços oferecidos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servico.servicos.map((item) => (
            <Card key={item.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-40 relative">
                <Image
                  src={item.imagem}
                  alt={item.nome}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{item.nome}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.descricao}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-ifood-red">{item.preco}</span>
                  <span className="text-sm text-muted-foreground">{item.tempo}</span>
                </div>
                <Button className="w-full mt-4 bg-ifood-red hover:bg-red-700">
                  Adicionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Avaliações */}
      <div className="container mx-auto px-4 py-8 border-t">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Avaliações</h2>
          <Button variant="outline" className="flex items-center gap-2">
            Filtrar avaliações
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {servico.avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{avaliacao.usuario}</h3>
                    <span className="text-xs text-muted-foreground ml-2">{avaliacao.data}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < avaliacao.nota
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 fill-gray-300"
                        } mr-1`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm mt-3">{avaliacao.comentario}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">Ver mais avaliações</Button>
        </div>
      </div>

      {/* Profissionais similares */}
      <div className="container mx-auto px-4 py-8 border-t">
        <h2 className="text-xl font-bold mb-6">Profissionais similares</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <Link href={`/servico/${id}`} key={id}>
              <Card className="border-gray-200 hover:shadow-md transition-shadow">
                <div className="h-40 relative">
                  <Image
                    src={`https://ext.same-assets.com/3240701702/${Math.floor(Math.random() * 1000000000)}.jpg`}
                    alt="Profissional similar"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Profissional Similar {id}</h3>
                  <p className="text-sm text-muted-foreground">Eletricista</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{(4 + Math.random()).toFixed(1)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-medium">A partir de R$ {70 + (id * 10)},00</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
