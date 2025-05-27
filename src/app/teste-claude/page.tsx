import { ClaudeChat } from '@/components/claude/ClaudeChat';

export default function TesteClaudePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Teste do Claude AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstração da integração do Claude via Google Cloud Vertex AI.
            Experimente conversar, analisar textos e gerar código com IA.
          </p>
        </div>
        
        <ClaudeChat />
        
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">ℹ️ Informações</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-blue-600">Chat</h3>
                <p className="text-gray-600">Converse naturalmente com Claude</p>
              </div>
              <div>
                <h3 className="font-medium text-green-600">Análise</h3>
                <p className="text-gray-600">Analise sentimentos, resumos e mais</p>
              </div>
              <div>
                <h3 className="font-medium text-purple-600">Código</h3>
                <p className="text-gray-600">Gere código em várias linguagens</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 