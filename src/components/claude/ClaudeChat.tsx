'use client';

import React, { useState } from 'react';
import { useClaudeChat, useClaude } from '@/hooks/use-claude';
import { CLAUDE_MODELS } from '@/lib/claude-vertex';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Trash2, Bot, User, Code, BarChart3 } from 'lucide-react';

export function ClaudeChat() {
  const chat = useClaudeChat();
  const claude = useClaude();
  const [inputMessage, setInputMessage] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [codeDescription, setCodeDescription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [selectedModel, setSelectedModel] = useState(CLAUDE_MODELS.SONNET_4);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    await chat.sendMessage(inputMessage, { model: selectedModel });
    setInputMessage('');
  };

  const handleAnalyzeText = async (type: 'sentiment' | 'summary' | 'keywords' | 'classification') => {
    if (!analysisText.trim()) return;
    
    await claude.analyzeText(analysisText, type, { model: selectedModel });
  };

  const handleGenerateCode = async () => {
    if (!codeDescription.trim()) return;
    
    await claude.generateCode(codeDescription, selectedLanguage, { model: selectedModel });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Claude AI - Powered by Google Cloud Vertex AI
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Modelo:</span>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLAUDE_MODELS.OPUS_4}>Claude Opus 4</SelectItem>
                  <SelectItem value={CLAUDE_MODELS.SONNET_4}>Claude Sonnet 4</SelectItem>
                  <SelectItem value={CLAUDE_MODELS.HAIKU}>Claude Haiku</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline">
              {selectedModel === CLAUDE_MODELS.OPUS_4 ? 'Mais Poderoso' : 
               selectedModel === CLAUDE_MODELS.SONNET_4 ? 'Balanceado' : 'Rápido'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Código
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversa com Claude</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Área de mensagens */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                {chat.messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Inicie uma conversa com Claude!
                  </div>
                ) : (
                  chat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Bot className="h-6 w-6 text-blue-500 mt-1" />
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans">
                          {message.content}
                        </pre>
                      </div>
                      {message.role === 'user' && (
                        <User className="h-6 w-6 text-gray-500 mt-1" />
                      )}
                    </div>
                  ))
                )}
                {chat.loading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Claude está pensando...
                  </div>
                )}
              </div>

              {/* Input de mensagem */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={chat.loading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={chat.loading || !inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={chat.clearChat}
                  disabled={chat.loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {chat.error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  {chat.error}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Texto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                placeholder="Cole o texto que deseja analisar..."
                rows={6}
              />
              
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => handleAnalyzeText('sentiment')}
                  disabled={claude.loading || !analysisText.trim()}
                  variant="outline"
                >
                  Sentimento
                </Button>
                <Button 
                  onClick={() => handleAnalyzeText('summary')}
                  disabled={claude.loading || !analysisText.trim()}
                  variant="outline"
                >
                  Resumo
                </Button>
                <Button 
                  onClick={() => handleAnalyzeText('keywords')}
                  disabled={claude.loading || !analysisText.trim()}
                  variant="outline"
                >
                  Palavras-chave
                </Button>
                <Button 
                  onClick={() => handleAnalyzeText('classification')}
                  disabled={claude.loading || !analysisText.trim()}
                  variant="outline"
                >
                  Classificação
                </Button>
              </div>

              {claude.loading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analisando texto...
                </div>
              )}

              {claude.response && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultado da Análise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap font-sans">
                      {claude.response.content}
                    </pre>
                    {claude.response.usage && (
                      <div className="mt-4 text-sm text-gray-500">
                        Tokens: {claude.response.usage.totalTokens} 
                        (entrada: {claude.response.usage.inputTokens}, 
                        saída: {claude.response.usage.outputTokens})
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {claude.error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  {claude.error}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geração de Código</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Descrição do código:</label>
                  <Textarea
                    value={codeDescription}
                    onChange={(e) => setCodeDescription(e.target.value)}
                    placeholder="Descreva o código que você quer gerar..."
                    rows={4}
                  />
                </div>
                <div className="w-48">
                  <label className="text-sm font-medium">Linguagem:</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateCode}
                disabled={claude.loading || !codeDescription.trim()}
                className="w-full"
              >
                {claude.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Gerando código...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    Gerar Código
                  </>
                )}
              </Button>

              {claude.response && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Código Gerado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{claude.response.content}</code>
                    </pre>
                    {claude.response.usage && (
                      <div className="mt-4 text-sm text-gray-500">
                        Tokens: {claude.response.usage.totalTokens}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {claude.error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  {claude.error}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 