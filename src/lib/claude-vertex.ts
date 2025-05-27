import { VertexAI } from '@google-cloud/vertexai';
import { GoogleAuth } from 'google-auth-library';

// Configuração do Google Cloud
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

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

class ClaudeVertexAI {
  private vertexAI: VertexAI;
  private auth: GoogleAuth;

  constructor() {
    if (!PROJECT_ID) {
      throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is required');
    }

    // Inicializar autenticação
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // Inicializar Vertex AI
    this.vertexAI = new VertexAI({
      project: PROJECT_ID,
      location: LOCATION,
    });
  }

  /**
   * Gera uma resposta usando Claude via Vertex AI
   */
  async generateResponse(
    messages: ClaudeMessage[],
    config: ClaudeConfig = { model: CLAUDE_MODELS.SONNET_4 }
  ): Promise<ClaudeResponse> {
    try {
      // Configurar o modelo generativo
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: config.model,
        generationConfig: {
          maxOutputTokens: config.maxTokens || 4096,
          temperature: config.temperature || 0.7,
          topP: config.topP || 0.95,
          topK: config.topK || 40,
        },
      });

      // Converter mensagens para o formato do Vertex AI
      const prompt = this.formatMessagesForVertexAI(messages);

      // Gerar resposta
      const result = await generativeModel.generateContent(prompt);
      const response = result.response;

      return {
        content: response.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount || 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        },
        model: config.model,
      };
    } catch (error) {
      console.error('Erro ao gerar resposta do Claude:', error);
      throw new Error(`Falha na comunicação com Claude: ${error}`);
    }
  }

  /**
   * Gera uma resposta em streaming
   */
  async generateStreamResponse(
    messages: ClaudeMessage[],
    config: ClaudeConfig = { model: CLAUDE_MODELS.SONNET_4 },
    onChunk?: (chunk: string) => void
  ): Promise<ClaudeResponse> {
    try {
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: config.model,
        generationConfig: {
          maxOutputTokens: config.maxTokens || 4096,
          temperature: config.temperature || 0.7,
          topP: config.topP || 0.95,
          topK: config.topK || 40,
        },
      });

      const prompt = this.formatMessagesForVertexAI(messages);
      const streamResult = generativeModel.generateContentStream(prompt);

      let fullContent = '';
      let totalTokens = 0;

      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
        fullContent += chunkText;
        
        if (onChunk && chunkText) {
          onChunk(chunkText);
        }
      }

      const finalResult = await streamResult.response;
      
      return {
        content: fullContent,
        usage: {
          inputTokens: finalResult.usageMetadata?.promptTokenCount || 0,
          outputTokens: finalResult.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: finalResult.usageMetadata?.totalTokenCount || 0,
        },
        model: config.model,
      };
    } catch (error) {
      console.error('Erro ao gerar resposta em streaming do Claude:', error);
      throw new Error(`Falha na comunicação em streaming com Claude: ${error}`);
    }
  }

  /**
   * Analisa texto usando Claude
   */
  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'classification',
    config: ClaudeConfig = { model: CLAUDE_MODELS.SONNET_4 }
  ): Promise<ClaudeResponse> {
    const prompts = {
      sentiment: `Analise o sentimento do seguinte texto e classifique como positivo, negativo ou neutro. Forneça também uma explicação breve:\n\n${text}`,
      summary: `Faça um resumo conciso e informativo do seguinte texto:\n\n${text}`,
      keywords: `Extraia as palavras-chave mais importantes do seguinte texto:\n\n${text}`,
      classification: `Classifique o seguinte texto em categorias relevantes:\n\n${text}`,
    };

    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: prompts[analysisType],
      },
    ];

    return this.generateResponse(messages, config);
  }

  /**
   * Gera código usando Claude
   */
  async generateCode(
    description: string,
    language: string = 'typescript',
    config: ClaudeConfig = { model: CLAUDE_MODELS.OPUS_4 }
  ): Promise<ClaudeResponse> {
    const messages: ClaudeMessage[] = [
      {
        role: 'system',
        content: `Você é um assistente especializado em programação. Gere código limpo, bem documentado e seguindo as melhores práticas.`,
      },
      {
        role: 'user',
        content: `Gere código em ${language} para: ${description}`,
      },
    ];

    return this.generateResponse(messages, config);
  }

  /**
   * Converte mensagens para o formato do Vertex AI
   */
  private formatMessagesForVertexAI(messages: ClaudeMessage[]): string {
    return messages
      .map((msg) => {
        const rolePrefix = msg.role === 'user' ? 'Human: ' : 
                          msg.role === 'assistant' ? 'Assistant: ' : 
                          'System: ';
        return `${rolePrefix}${msg.content}`;
      })
      .join('\n\n');
  }

  /**
   * Verifica se a configuração está correta
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testMessages: ClaudeMessage[] = [
        {
          role: 'user',
          content: 'Responda apenas "OK" se você está funcionando corretamente.',
        },
      ];

      const response = await this.generateResponse(testMessages, {
        model: CLAUDE_MODELS.SONNET_4,
        maxTokens: 10,
      });

      return response.content.trim().toLowerCase().includes('ok');
    } catch (error) {
      console.error('Health check falhou:', error);
      return false;
    }
  }
}

// Instância singleton
let claudeInstance: ClaudeVertexAI | null = null;

export function getClaudeInstance(): ClaudeVertexAI {
  if (!claudeInstance) {
    claudeInstance = new ClaudeVertexAI();
  }
  return claudeInstance;
}

// Funções de conveniência
export async function askClaude(
  question: string,
  model: ClaudeModel = CLAUDE_MODELS.SONNET_4
): Promise<string> {
  const claude = getClaudeInstance();
  const response = await claude.generateResponse(
    [{ role: 'user', content: question }],
    { model }
  );
  return response.content;
}

export async function analyzeSentiment(text: string): Promise<string> {
  const claude = getClaudeInstance();
  const response = await claude.analyzeText(text, 'sentiment');
  return response.content;
}

export async function summarizeText(text: string): Promise<string> {
  const claude = getClaudeInstance();
  const response = await claude.analyzeText(text, 'summary');
  return response.content;
}

export async function generateCode(
  description: string,
  language: string = 'typescript'
): Promise<string> {
  const claude = getClaudeInstance();
  const response = await claude.generateCode(description, language);
  return response.content;
}

export default ClaudeVertexAI; 