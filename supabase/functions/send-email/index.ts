import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  template: string
  data: Record<string, string>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, template, data } = await req.json() as EmailRequest

    // Buscar template no banco de dados
    const { data: templates, error: templateError } = await req.supabaseClient
      .from('email_templates')
      .select('*')
      .eq('name', template)
      .single()

    if (templateError || !templates) {
      throw new Error('Template não encontrado')
    }

    // Substituir variáveis no template
    let subject = templates.subject
    let body = templates.body

    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      body = body.replace(regex, value)
    })

    // Enviar email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Contratto <noreply@contratto.com.br>',
      to: [to],
      subject: subject,
      html: body,
    })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 