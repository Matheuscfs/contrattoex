import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="mb-4">
              A sua privacidade é importante para nós. É política do iServiços respeitar a sua privacidade
              em relação a qualquer informação sua que possamos coletar em nosso site.
            </p>
            <p className="mb-4">
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer
              um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Coleta de Informações</h2>
            <p className="mb-4">
              Coletamos as seguintes informações:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone (opcional)</li>
              <li>Informações de perfil profissional (para prestadores de serviços)</li>
              <li>Histórico de serviços</li>
              <li>Avaliações e comentários</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Uso das Informações</h2>
            <p className="mb-4">
              Usamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fornecer, operar e manter nossos serviços</li>
              <li>Melhorar e personalizar sua experiência</li>
              <li>Entender e analisar como você usa nossos serviços</li>
              <li>Desenvolver novos produtos, serviços e funcionalidades</li>
              <li>Comunicar com você sobre atualizações ou informações importantes</li>
              <li>Prevenir fraudes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Proteção de Dados</h2>
            <p className="mb-4">
              A segurança de seus dados é importante para nós. Implementamos medidas técnicas e
              organizacionais apropriadas para proteger suas informações pessoais contra acesso não
              autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
            <p className="mb-4">
              Você tem os seguintes direitos em relação aos seus dados:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Direito de acesso aos seus dados</li>
              <li>Direito de retificação dos seus dados</li>
              <li>Direito de exclusão dos seus dados</li>
              <li>Direito de restringir o processamento dos seus dados</li>
              <li>Direito de portabilidade dos dados</li>
              <li>Direito de oposição ao processamento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contato</h2>
            <p className="mb-4">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:
            </p>
            <ul className="list-none pl-6 mb-4">
              <li>Email: privacidade@iservicos.com.br</li>
              <li>Telefone: (11) 1234-5678</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 