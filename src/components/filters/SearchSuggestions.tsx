import { Clock, Star, Tag } from 'lucide-react'
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions'

interface SearchSuggestionsProps {
  searchTerm: string
  type: string
  onSelect: (term: string) => void
  className?: string
}

export function SearchSuggestions({ 
  searchTerm, 
  type, 
  onSelect,
  className = ''
}: SearchSuggestionsProps) {
  const { suggestions, loading } = useSearchSuggestions(searchTerm, type)

  if (!searchTerm || (!loading && suggestions.length === 0)) {
    return null
  }

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50 ${className}`}>
      {loading ? (
        <div className="p-4 text-center text-gray-500">
          Buscando sugestões...
        </div>
      ) : (
        <ul className="py-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.term}-${index}`}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              onClick={() => onSelect(suggestion.term)}
            >
              {suggestion.type === 'history' && (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              {suggestion.type === 'popular' && (
                <Star className="w-4 h-4 text-gray-400" />
              )}
              {suggestion.type === 'category' && (
                <Tag className="w-4 h-4 text-gray-400" />
              )}
              <span>{suggestion.term}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 