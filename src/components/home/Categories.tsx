"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
// import { useCategories } from "@/hooks/useCategories"

interface Category {
  id: string
  name: string
  icon: string
  count: number
  examples: string
}

// Dados estáticos melhorados (preparado para API)
const categories: Category[] = [
  {
    id: "servicos-gerais",
    name: "Serviços Gerais",
    icon: "/icons/maintenance.svg",
    count: 45,
    examples: "Eletricistas, Encanadores, Diaristas, Pintores"
  },
  {
    id: "beleza",
    name: "Beleza & Bem-estar",
    icon: "/icons/beauty.svg",
    count: 32,
    examples: "Cabeleireiros, Barbeiros, Esteticistas"
  },
  {
    id: "saude",
    name: "Saúde & Terapias",
    icon: "/icons/health.svg",
    count: 28,
    examples: "Fisioterapeutas, Personal Trainers"
  },
  {
    id: "construcao",
    name: "Construção & Reforma",
    icon: "/icons/construction.svg",
    count: 25,
    examples: "Construtoras, Empresas de Reforma"
  },
  {
    id: "limpeza",
    name: "Limpeza & Conservação",
    icon: "/icons/cleaning.svg",
    count: 18,
    examples: "Limpeza Residencial, Limpeza Comercial"
  }
]

export function Categories() {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault()
        setFocusedIndex((index + 1) % categories.length)
        break
      case "ArrowLeft":
        e.preventDefault()
        setFocusedIndex(index === 0 ? categories.length - 1 : index - 1)
        break
      case "Home":
        e.preventDefault()
        setFocusedIndex(0)
        break
      case "End":
        e.preventDefault()
        setFocusedIndex(categories.length - 1)
        break
    }
  }

  React.useEffect(() => {
    const element = document.getElementById(`category-${focusedIndex}`)
    if (element) {
      element.focus()
    }
  }, [focusedIndex])

  return (
    <section 
      className="py-16 bg-gray-50"
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        <h2 
          id="categories-heading" 
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Categorias de Profissionais
        </h2>
        <div 
          role="tablist" 
          aria-label="Categorias de serviços"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categorias/${category.id}`}
              id={`category-${index}`}
              role="tab"
              aria-selected={focusedIndex === index}
              tabIndex={focusedIndex === index ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              className={cn(
                "group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              <div className="relative w-12 h-12 mb-4">
                <Image
                  src={category.icon}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 
                className="font-semibold text-gray-900 group-hover:text-primary transition-colors"
                aria-label={`${category.name} - ${category.count.toLocaleString()} profissionais disponíveis`}
              >
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.count.toLocaleString()} profissionais
              </p>
              <p 
                className="text-xs text-gray-400 mt-2"
                aria-label={`Exemplos de profissionais: ${category.examples}`}
              >
                {category.examples}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 