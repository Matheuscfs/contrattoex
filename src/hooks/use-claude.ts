import { useState, useCallback } from 'react';
import { ClaudeMessage, ClaudeModel, ClaudeResponse, CLAUDE_MODELS } from '@/lib/claude-types';

interface UseClaudeOptions {
  model?: ClaudeModel;
  maxTokens?: number;
  temperature?: number;
}

interface UseClaudeReturn {
  // Estados
  loading: boolean;
  error: string | null;
  response: ClaudeResponse | null;
  
  // Funções principais
  chat: (messages: ClaudeMessage[], options?: UseClaudeOptions) => Promise<ClaudeResponse | null>;
  analyzeText: (text: string, type: 'sentiment' | 'summary' | 'keywords' | 'classification', options?: UseClaudeOptions) => Promise<ClaudeResponse | null>;
  generateCode: (description: string, language?: string, options?: UseClaudeOptions) => Promise<ClaudeResponse | null>;
  
  // Funções de conveniência
  askQuestion: (question: string, options?: UseClaudeOptions) => Promise<string | null>;
  summarize: (text: string, options?: UseClaudeOptions) => Promise<string | null>;
  analyzeSentiment: (text: string, options?: UseClaudeOptions) => Promise<string | null>;
  
  // Utilitários
  clearError: () => void;
  clearResponse: () => void;
  healthCheck: () => Promise<boolean>;
}

export function useClaude(): UseClaudeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ClaudeResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  const makeRequest = useCallback(async (
    action: string,
    payload: any,
    options?: UseClaudeOptions
  ): Promise<ClaudeResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...payload,
          model: options?.model || CLAUDE_MODELS.SONNET_4,
          config: {
            maxTokens: options?.maxTokens,
            temperature: options?.temperature,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na comunicação com Claude');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      setResponse(data.data);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro no useClaude:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const chat = useCallback(async (
    messages: ClaudeMessage[],
    options?: UseClaudeOptions
  ): Promise<ClaudeResponse | null> => {
    return makeRequest('chat', { messages }, options);
  }, [makeRequest]);

  const analyzeText = useCallback(async (
    text: string,
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'classification',
    options?: UseClaudeOptions
  ): Promise<ClaudeResponse | null> => {
    return makeRequest('analyze', { text, analysisType }, options);
  }, [makeRequest]);

  const generateCode = useCallback(async (
    description: string,
    language: string = 'typescript',
    options?: UseClaudeOptions
  ): Promise<ClaudeResponse | null> => {
    return makeRequest('generate-code', { description, language }, options);
  }, [makeRequest]);

  // Funções de conveniência que retornam apenas o conteúdo
  const askQuestion = useCallback(async (
    question: string,
    options?: UseClaudeOptions
  ): Promise<string | null> => {
    const messages: ClaudeMessage[] = [
      { role: 'user', content: question }
    ];
    
    const response = await chat(messages, options);
    return response?.content || null;
  }, [chat]);

  const summarize = useCallback(async (
    text: string,
    options?: UseClaudeOptions
  ): Promise<string | null> => {
    const response = await analyzeText(text, 'summary', options);
    return response?.content || null;
  }, [analyzeText]);

  const analyzeSentiment = useCallback(async (
    text: string,
    options?: UseClaudeOptions
  ): Promise<string | null> => {
    const response = await analyzeText(text, 'sentiment', options);
    return response?.content || null;
  }, [analyzeText]);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/claude?action=health');
      const data = await response.json();
      return data.success && data.data.healthy;
    } catch (err) {
      console.error('Erro no health check:', err);
      return false;
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    response,
    
    // Funções principais
    chat,
    analyzeText,
    generateCode,
    
    // Funções de conveniência
    askQuestion,
    summarize,
    analyzeSentiment,
    
    // Utilitários
    clearError,
    clearResponse,
    healthCheck,
  };
}

// Hook especializado para chat
export function useClaudeChat() {
  const [messages, setMessages] = useState<ClaudeMessage[]>([]);
  const claude = useClaude();

  const sendMessage = useCallback(async (
    content: string,
    options?: UseClaudeOptions
  ): Promise<void> => {
    const userMessage: ClaudeMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    const response = await claude.chat(newMessages, options);
    
    if (response) {
      const assistantMessage: ClaudeMessage = {
        role: 'assistant',
        content: response.content,
      };
      setMessages([...newMessages, assistantMessage]);
    }
  }, [messages, claude]);

  const clearChat = useCallback(() => {
    setMessages([]);
    claude.clearResponse();
    claude.clearError();
  }, [claude]);

  return {
    messages,
    sendMessage,
    clearChat,
    loading: claude.loading,
    error: claude.error,
    response: claude.response,
  };
}

// Hook para análise de texto em lote
export function useClaudeAnalysis() {
  const [results, setResults] = useState<Record<string, ClaudeResponse>>({});
  const claude = useClaude();

  const analyzeMultiple = useCallback(async (
    texts: { id: string; content: string }[],
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'classification',
    options?: UseClaudeOptions
  ): Promise<void> => {
    const newResults: Record<string, ClaudeResponse> = {};

    for (const { id, content } of texts) {
      const response = await claude.analyzeText(content, analysisType, options);
      if (response) {
        newResults[id] = response;
      }
    }

    setResults(prev => ({ ...prev, ...newResults }));
  }, [claude]);

  const clearResults = useCallback(() => {
    setResults({});
  }, []);

  return {
    results,
    analyzeMultiple,
    clearResults,
    loading: claude.loading,
    error: claude.error,
  };
}

export default useClaude; 