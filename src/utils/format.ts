export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica se é celular (9 dígitos) ou fixo (8 dígitos)
  const isCellphone = numbers.length === 11;
  const areaCode = numbers.slice(0, 2);
  const prefix = isCellphone ? numbers.slice(2, 7) : numbers.slice(2, 6);
  const suffix = isCellphone ? numbers.slice(7) : numbers.slice(6);

  // Formata o número
  return `(${areaCode}) ${prefix}-${suffix}`;
}

export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '');
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  return time.padStart(5, '0'); // Garante o formato HH:mm
}

export function formatDuration(duration: number, unit: 'minutes' | 'hours' | 'days'): string {
  switch (unit) {
    case 'minutes':
      if (duration < 60) return `${duration} minutos`;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h${minutes}min` : `${hours}h`;
    case 'hours':
      return duration === 1 ? '1 hora' : `${duration} horas`;
    case 'days':
      return duration === 1 ? '1 dia' : `${duration} dias`;
    default:
      return `${duration} ${unit}`;
  }
} 