"use client"

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data - em produção viria da API
const bannerSlides = [
  {
    id: 1,
    title: "Profissionais Verificados",
    description: "Encontre os melhores profissionais da sua região, todos verificados e avaliados.",
    image: "/images/banners/professionals.jpg",
    cta: {
      text: "Encontrar Profissionais",
      link: "/profissionais",
    },
    theme: "dark", // dark ou light, para ajustar as cores do texto
    imageAlt: "Grupo diverso de profissionais sorridentes usando uniformes de trabalho, representando a comunidade de prestadores de serviços verificados da plataforma"
  },
  {
    id: 2,
    title: "Promoções Exclusivas",
    description: "Aproveite descontos especiais em diversos serviços esta semana.",
    image: "/images/banners/promotions.jpg",
    cta: {
      text: "Ver Promoções",
      link: "/promocoes",
    },
    theme: "light",
    imageAlt: "Mosaico de diferentes serviços com selos de desconto, mostrando as promoções disponíveis na plataforma"
  },
  {
    id: 3,
    title: "Seja um Profissional Parceiro",
    description: "Aumente sua visibilidade e encontre novos clientes na maior plataforma de serviços do Brasil.",
    image: "/images/banners/partner.jpg",
    cta: {
      text: "Cadastre-se Agora",
      link: "/empresas/cadastro",
    },
    theme: "dark",
    imageAlt: "Profissional autônomo sorridente usando tablet, representando o sucesso dos parceiros na plataforma"
  },
];

export function HeroBanner() {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const toggleAutoplay = React.useCallback(() => {
    if (!autoplay.current) return;
    if (isAutoplayPaused) {
      autoplay.current.play();
    } else {
      autoplay.current.stop();
    }
    setIsAutoplayPaused(!isAutoplayPaused);
  }, [isAutoplayPaused]);

  // Manipulador de teclas para navegação
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        scrollPrev();
        break;
      case 'ArrowRight':
        scrollNext();
        break;
      case 'Space':
        e.preventDefault();
        toggleAutoplay();
        break;
    }
  }, [scrollPrev, scrollNext, toggleAutoplay]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div 
      className="relative overflow-hidden"
      role="region"
      aria-label="Banner principal com carrossel de destaques"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onFocus={() => {
        if (autoplay.current) autoplay.current.stop();
        setIsAutoplayPaused(true);
      }}
      onBlur={() => {
        if (autoplay.current) autoplay.current.play();
        setIsAutoplayPaused(false);
      }}
    >
      {/* Carrossel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0"
              role="tabpanel"
              aria-label={`Slide ${index + 1} de ${bannerSlides.length}`}
              aria-hidden={selectedIndex !== index}
            >
              <div className="relative h-[500px] md:h-[600px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                />
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${
                    slide.theme === "dark"
                      ? "from-black/70 to-black/30"
                      : "from-white/70 to-white/30"
                  }`}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      <h1 
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                          slide.theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {slide.title}
                      </h1>
                      <p 
                        className={`text-xl md:text-2xl mb-8 ${
                          slide.theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {slide.description}
                      </p>
                      <Link href={slide.cta.link}>
                        <Button 
                          size="lg" 
                          className="text-lg px-8 py-6"
                          aria-label={`${slide.cta.text} - ${slide.title}`}
                        >
                          {slide.cta.text}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de Navegação */}
      <div 
        className="absolute inset-x-0 bottom-4 flex justify-center gap-2"
        role="tablist"
        aria-label="Controles do carrossel"
      >
        {bannerSlides.map((slide, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Ir para slide ${index + 1}: ${slide.title}`}
            aria-selected={index === selectedIndex}
            role="tab"
          />
        ))}
      </div>

      {/* Botões Prev/Next */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 transition-colors"
        onClick={scrollPrev}
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 transition-colors"
        onClick={scrollNext}
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
      </button>

      {/* Botão de Pause/Play */}
      <button
        className="absolute top-4 right-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm"
        onClick={toggleAutoplay}
        aria-label={isAutoplayPaused ? "Retomar apresentação automática" : "Pausar apresentação automática"}
      >
        {isAutoplayPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
} 