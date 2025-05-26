import { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Login | iServiços',
  description: 'Faça login na sua conta iServiços'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-[400px] mx-auto">
        <LoginForm />
      </div>
    </div>
  )
} 