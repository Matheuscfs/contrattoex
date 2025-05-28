// Modelos Claude disponíveis no Vertex AI
export const CLAUDE_MODELS = {
  OPUS_4: 'claude-3-opus@20240229',
  SONNET_4: 'claude-3-sonnet@20240229',
  HAIKU: 'claude-3-haiku@20240307'
} as const;

export type ClaudeModel = typeof CLAUDE_MODELS[keyof typeof CLAUDE_MODELS];

// Interface para configuração do Claude
export interface ClaudeConfig {
  model: ClaudeModel;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

// Interface para mensagens
export interface ClaudeMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interface para resposta do Claude
export interface ClaudeResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  model: string;
} 