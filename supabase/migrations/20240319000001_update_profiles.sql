-- Adicionar campos específicos para empresas e profissionais
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS document TEXT, -- CPF ou CNPJ
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS specialties TEXT[],
ADD COLUMN IF NOT EXISTS business_hours JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Função para validar documento (CPF/CNPJ)
CREATE OR REPLACE FUNCTION validate_document()
RETURNS TRIGGER AS $$
BEGIN
    -- Aqui você pode adicionar a lógica de validação de CPF/CNPJ
    -- Por enquanto, apenas verifica se não está vazio
    IF NEW.document IS NOT NULL AND LENGTH(NEW.document) < 11 THEN
        RAISE EXCEPTION 'Documento inválido';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar documento
CREATE TRIGGER validate_document_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_document();

-- Atualizar a função de criação de perfil para incluir role específico
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        name,
        role,
        document,
        phone,
        status
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NEW.raw_user_meta_data->>'document',
        NEW.raw_user_meta_data->>'phone',
        CASE 
            WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN 'approved'
            ELSE 'pending'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 