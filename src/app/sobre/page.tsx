import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sobre o iServiços</h1>
        
        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nossa Missão</h2>
            <p className="mb-4">
              O iServiços nasceu com uma missão clara: conectar profissionais qualificados a clientes 
              que buscam serviços de qualidade. Acreditamos que cada conexão bem-sucedida contribui 
              para fortalecer a economia local e melhorar a vida das pessoas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quem Somos</h2>
            <p className="mb-4">
              Somos uma plataforma brasileira dedicada a revolucionar a forma como as pessoas 
              encontram e contratam serviços. Nossa equipe é composta por profissionais 
              apaixonados por tecnologia e inovação, comprometidos em criar a melhor 
              experiência possível para nossos usuários.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">O que Oferecemos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Para Profissionais</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Perfil profissional personalizado</li>
                  <li>Sistema de agendamento eficiente</li>
                  <li>Gestão de clientes simplificada</li>
                  <li>Avaliações e feedback</li>
                  <li>Oportunidades de crescimento</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Para Clientes</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Busca avançada de profissionais</li>
                  <li>Sistema de avaliações confiável</li>
                  <li>Agendamento online facilitado</li>
                  <li>Chat integrado seguro</li>
                  <li>Garantia de satisfação</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Confiança</h3>
                <p>Construímos relações baseadas em transparência e segurança.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Qualidade</h3>
                <p>Promovemos a excelência em todos os serviços oferecidos.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Inovação</h3>
                <p>Buscamos constantemente melhorar nossa plataforma.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Nossa História</h2>
            <p className="mb-4">
              Fundado em 2024, o iServiços surgiu da necessidade de simplificar a 
              conexão entre prestadores de serviços e clientes. Desde então, temos 
              crescido consistentemente, sempre mantendo nosso compromisso com a 
              qualidade e satisfação dos usuários.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contato</h2>
            <p className="mb-4">
              Estamos sempre à disposição para ouvir suas sugestões e feedback:
            </p>
            <ul className="list-none pl-6 mb-4">
              <li>Email: contato@iservicos.com.br</li>
              <li>Telefone: (11) 1234-5678</li>
              <li>Horário de atendimento: Segunda a Sexta, das 9h às 18h</li>
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