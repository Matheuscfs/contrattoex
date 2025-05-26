"use client";

import * as React from "react";
import { Copy, Mail, Share2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SharePromotionButtonsProps {
  title: string;
  description: string;
  url: string;
}

export function SharePromotionButtons({
  title,
  description,
  url,
}: SharePromotionButtonsProps) {
  const [showCopiedTooltip, setShowCopiedTooltip] = React.useState(false);

  const handleWhatsAppShare = () => {
    const text = `${title}\n\n${description}\n\nConfira em: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\nConfira em: ${url}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Opções de compartilhamento">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleWhatsAppShare}
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageSquare className="w-4 h-4" />
        WhatsApp
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleEmailShare}
        aria-label="Compartilhar por e-mail"
      >
        <Mail className="w-4 h-4" />
        E-mail
      </Button>

      <TooltipProvider>
        <Tooltip open={showCopiedTooltip}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleCopyLink}
              aria-label="Copiar link"
            >
              <Copy className="w-4 h-4" />
              Copiar Link
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link copiado!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title,
              text: description,
              url,
            });
          }
        }}
        aria-label="Compartilhar usando o menu nativo do dispositivo"
      >
        <Share2 className="w-4 h-4" />
        Compartilhar
      </Button>
    </div>
  );
} 