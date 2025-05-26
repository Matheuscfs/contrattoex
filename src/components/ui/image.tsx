"use client"

import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ImageProps extends NextImageProps {
  containerClassName?: string
}

export function Image({ containerClassName, className, onLoad, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <div className={containerClassName}>
      <div className="relative">
        {isLoading && (
          <Skeleton 
            className={`absolute inset-0 ${className}`}
            aria-hidden="true"
          />
        )}
        <NextImage
          className={className}
          onLoad={(e) => {
            setIsLoading(false)
            onLoad?.(e)
          }}
          {...props}
        />
      </div>
    </div>
  )
} 