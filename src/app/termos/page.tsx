import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p className="mb-4">
              Ao acessar e usar o iServiços, você concorda com estes Termos de Uso e todas as suas condições.
              Se você não concordar com qualquer parte destes termos, por favor, não use nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p className="mb-4">
              O iServiços é uma plataforma que conecta prestadores de serviços a clientes. Oferecemos:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cadastro de prestadores de serviços</li>
              <li>Busca e contratação de serviços</li>
              <li>Sistema de avaliações e comentários</li>
              <li>Gerenciamento de perfil profissional</li>
              <li>Comunicação entre prestadores e clientes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta</h2>
            <p className="mb-4">
              Para usar nossos serviços, você precisa:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter suas credenciais de acesso seguras</li>
              <li>Não compartilhar sua conta com terceiros</li>
              <li>Notificar imediatamente qualquer uso não autorizado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Responsabilidades</h2>
            <h3 className="text-xl font-semibold mb-3">4.1. Prestadores de Serviços</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Fornecer serviços com qualidade e profissionalismo</li>
              <li>Manter informações do perfil atualizadas</li>
              <li>Respeitar os horários e compromissos agendados</li>
              <li>Seguir as políticas de cancelamento e reagendamento</li>
              <li>Manter comunicação respeitosa com os clientes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2. Clientes</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Fornecer informações precisas sobre o serviço desejado</li>
              <li>Respeitar os horários agendados</li>
              <li>Realizar o pagamento conforme acordado</li>
              <li>Avaliar os serviços de forma justa e honesta</li>
              <li>Manter comunicação respeitosa com os prestadores</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Pagamentos e Taxas</h2>
            <p className="mb-4">
              O iServiços pode cobrar taxas por:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Destaque de perfil profissional</li>
              <li>Recursos premium</li>
              <li>Comissão sobre serviços realizados</li>
              <li>Serviços de processamento de pagamento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Propriedade Intelectual</h2>
            <p className="mb-4">
              Todo o conteúdo do iServiços, incluindo mas não limitado a logotipos, textos, gráficos,
              imagens, vídeos e software, é de propriedade exclusiva do iServiços ou de seus licenciadores
              e está protegido por leis de propriedade intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitação de Responsabilidade</h2>
            <p className="mb-4">
              O iServiços não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Qualidade dos serviços prestados</li>
              <li>Danos causados durante a prestação de serviços</li>
              <li>Disputas entre prestadores e clientes</li>
              <li>Informações fornecidas pelos usuários</li>
              <li>Perdas ou danos indiretos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modificações dos Termos</h2>
            <p className="mb-4">
              O iServiços se reserva o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão notificadas aos usuários. O uso continuado
              dos serviços após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Encerramento de Conta</h2>
            <p className="mb-4">
              O iServiços pode encerrar ou suspender contas que:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violem estes termos de uso</li>
              <li>Pratiquem atividades fraudulentas</li>
              <li>Causem danos a outros usuários</li>
              <li>Forneçam informações falsas</li>
              <li>Não utilizem o serviço por período prolongado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
            <p className="mb-4">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="list-none pl-6 mb-4">
              <li>Email: termos@iservicos.com.br</li>
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