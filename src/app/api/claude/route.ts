import { NextRequest, NextResponse } from 'next/server';
import { getClaudeInstance } from '@/lib/claude-vertex';
import { CLAUDE_MODELS, ClaudeMessage, ClaudeModel } from '@/lib/claude-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, messages, text, analysisType, description, language, model, config } = body;

    // Validar se as variáveis de ambiente estão configuradas
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
      return NextResponse.json(
        { error: 'Google Cloud Project ID não configurado' },
        { status: 500 }
      );
    }

    const claude = getClaudeInstance();
    const selectedModel: ClaudeModel = model || CLAUDE_MODELS.SONNET_4;

    switch (action) {
      case 'chat':
        if (!messages || !Array.isArray(messages)) {
          return NextResponse.json(
            { error: 'Mensagens são obrigatórias para chat' },
            { status: 400 }
          );
        }

        const chatResponse = await claude.generateResponse(messages, {
          model: selectedModel,
          ...config,
        });

        return NextResponse.json({
          success: true,
          data: chatResponse,
        });

      case 'stream':
        if (!messages || !Array.isArray(messages)) {
          return NextResponse.json(
            { error: 'Mensagens são obrigatórias para streaming' },
            { status: 400 }
          );
        }

        // Para streaming, retornamos uma resposta especial
        const streamResponse = await claude.generateStreamResponse(
          messages,
          { model: selectedModel, ...config }
        );

        return NextResponse.json({
          success: true,
          data: streamResponse,
        });

      case 'analyze':
        if (!text || !analysisType) {
          return NextResponse.json(
            { error: 'Texto e tipo de análise são obrigatórios' },
            { status: 400 }
          );
        }

        const analysisResponse = await claude.analyzeText(text, analysisType, {
          model: selectedModel,
          ...config,
        });

        return NextResponse.json({
          success: true,
          data: analysisResponse,
        });

      case 'generate-code':
        if (!description) {
          return NextResponse.json(
            { error: 'Descrição é obrigatória para geração de código' },
            { status: 400 }
          );
        }

        const codeResponse = await claude.generateCode(
          description,
          language || 'typescript',
          { model: selectedModel, ...config }
        );

        return NextResponse.json({
          success: true,
          data: codeResponse,
        });

      case 'health-check':
        const isHealthy = await claude.healthCheck();
        
        return NextResponse.json({
          success: true,
          data: { healthy: isHealthy },
        });

      default:
        return NextResponse.json(
          { error: 'Ação não suportada' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na API do Claude:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Endpoint para verificar status e modelos disponíveis
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'models':
        return NextResponse.json({
          success: true,
          data: {
            models: CLAUDE_MODELS,
            defaultModel: CLAUDE_MODELS.SONNET_4,
          },
        });

      case 'health':
        const claude = getClaudeInstance();
        const isHealthy = await claude.healthCheck();
        
        return NextResponse.json({
          success: true,
          data: { 
            healthy: isHealthy,
            timestamp: new Date().toISOString(),
          },
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'Claude API está funcionando',
            endpoints: {
              POST: {
                chat: 'Conversa com Claude',
                stream: 'Conversa em streaming',
                analyze: 'Análise de texto',
                'generate-code': 'Geração de código',
                'health-check': 'Verificação de saúde',
              },
              GET: {
                '?action=models': 'Lista modelos disponíveis',
                '?action=health': 'Status de saúde',
              },
            },
          },
        });
    }
  } catch (error) {
    console.error('Erro no GET da API do Claude:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 