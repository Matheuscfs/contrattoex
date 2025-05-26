import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Carreiras no iServiços</h1>
        
        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Junte-se a Nossa Equipe</h2>
            <p className="mb-4">
              No iServiços, estamos sempre em busca de talentos apaixonados por tecnologia e inovação.
              Se você é movido por desafios e quer fazer parte de uma empresa que está transformando
              o mercado de serviços no Brasil, você está no lugar certo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Por Que Trabalhar Conosco?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Benefícios</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Plano de saúde completo</li>
                  <li>Vale refeição/alimentação</li>
                  <li>Horário flexível</li>
                  <li>Home office híbrido</li>
                  <li>Gympass</li>
                  <li>Auxílio desenvolvimento</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Cultura</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Ambiente colaborativo</li>
                  <li>Crescimento acelerado</li>
                  <li>Inovação constante</li>
                  <li>Feedback contínuo</li>
                  <li>Diversidade e inclusão</li>
                  <li>Eventos de integração</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Vagas Abertas</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">Desenvolvedor(a) Full Stack Sênior</h3>
                <p className="text-gray-600 mb-3">Remoto - Brasil</p>
                <p className="mb-4">
                  Procuramos um(a) desenvolvedor(a) full stack experiente para ajudar a construir
                  e escalar nossa plataforma, trabalhando com tecnologias modernas como React,
                  Node.js e PostgreSQL.
                </p>
                <Link 
                  href="mailto:carreiras@iservicos.com.br?subject=Vaga: Desenvolvedor Full Stack Sênior"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Candidatar-se
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">Product Designer</h3>
                <p className="text-gray-600 mb-3">Remoto - Brasil</p>
                <p className="mb-4">
                  Buscamos um(a) designer apaixonado(a) por criar experiências excepcionais,
                  com foco em usabilidade e design centrado no usuário.
                </p>
                <Link 
                  href="mailto:carreiras@iservicos.com.br?subject=Vaga: Product Designer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Candidatar-se
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">Customer Success Manager</h3>
                <p className="text-gray-600 mb-3">São Paulo - Híbrido</p>
                <p className="mb-4">
                  Procuramos alguém com experiência em gestão de sucesso do cliente
                  para ajudar nossos usuários a aproveitarem ao máximo nossa plataforma.
                </p>
                <Link 
                  href="mailto:carreiras@iservicos.com.br?subject=Vaga: Customer Success Manager"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Candidatar-se
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Processo Seletivo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">1. Candidatura</h3>
                <p>Envie seu currículo e nos conte por que quer trabalhar conosco.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">2. Entrevistas</h3>
                <p>Conversas com RH e time técnico para conhecermos melhor você.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">3. Desafio</h3>
                <p>Teste prático relacionado à vaga para avaliar suas habilidades.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Não Encontrou Uma Vaga Ideal?</h2>
            <p className="mb-4">
              Estamos sempre abertos a conhecer talentos! Envie seu currículo para nosso banco
              de talentos e entraremos em contato quando surgir uma oportunidade adequada ao seu perfil.
            </p>
            <Link 
              href="mailto:carreiras@iservicos.com.br?subject=Banco de Talentos"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Banco de Talentos
            </Link>
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