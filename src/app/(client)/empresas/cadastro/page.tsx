import { Metadata } from 'next'
import { CadastroEmpresaForm } from './CadastroEmpresaForm'

export const metadata: Metadata = {
  title: 'Cadastro de Empresa | iServiços',
  description: 'Cadastre sua empresa no iServiços e comece a receber clientes hoje mesmo'
}

export default function CadastroEmpresaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-[600px] mx-auto">
        <CadastroEmpresaForm />
      </div>
    </div>
  )
} 