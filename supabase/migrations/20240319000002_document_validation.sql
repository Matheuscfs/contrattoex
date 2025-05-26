-- Função para validar CPF
CREATE OR REPLACE FUNCTION is_cpf_valid(cpf text)
RETURNS boolean AS $$
DECLARE
    nums INT[] := ARRAY[]::INT[];
    sum INT;
    i INT;
    digit1 INT;
    digit2 INT;
    cpf_clean TEXT;
BEGIN
    -- Remove caracteres não numéricos
    cpf_clean := regexp_replace(cpf, '[^0-9]', '', 'g');
    
    -- Verifica se tem 11 dígitos
    IF length(cpf_clean) != 11 THEN
        RETURN false;
    END IF;
    
    -- Verifica se todos os dígitos são iguais
    IF cpf_clean ~ '^(\d)\1*$' THEN
        RETURN false;
    END IF;
    
    -- Converte string para array de inteiros
    FOR i IN 1..11 LOOP
        nums := array_append(nums, (substr(cpf_clean, i, 1))::INT);
    END LOOP;
    
    -- Calcula primeiro dígito verificador
    sum := 0;
    FOR i IN 1..9 LOOP
        sum := sum + (nums[i] * (11 - i));
    END LOOP;
    
    digit1 := 11 - (sum % 11);
    IF digit1 >= 10 THEN
        digit1 := 0;
    END IF;
    
    IF digit1 != nums[10] THEN
        RETURN false;
    END IF;
    
    -- Calcula segundo dígito verificador
    sum := 0;
    FOR i IN 1..10 LOOP
        sum := sum + (nums[i] * (12 - i));
    END LOOP;
    
    digit2 := 11 - (sum % 11);
    IF digit2 >= 10 THEN
        digit2 := 0;
    END IF;
    
    RETURN digit2 = nums[11];
END;
$$ LANGUAGE plpgsql;

-- Função para validar CNPJ
CREATE OR REPLACE FUNCTION is_cnpj_valid(cnpj text)
RETURNS boolean AS $$
DECLARE
    nums INT[] := ARRAY[]::INT[];
    weights1 INT[] := ARRAY[5,4,3,2,9,8,7,6,5,4,3,2];
    weights2 INT[] := ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2];
    sum INT;
    i INT;
    digit1 INT;
    digit2 INT;
    cnpj_clean TEXT;
BEGIN
    -- Remove caracteres não numéricos
    cnpj_clean := regexp_replace(cnpj, '[^0-9]', '', 'g');
    
    -- Verifica se tem 14 dígitos
    IF length(cnpj_clean) != 14 THEN
        RETURN false;
    END IF;
    
    -- Verifica se todos os dígitos são iguais
    IF cnpj_clean ~ '^(\d)\1*$' THEN
        RETURN false;
    END IF;
    
    -- Converte string para array de inteiros
    FOR i IN 1..14 LOOP
        nums := array_append(nums, (substr(cnpj_clean, i, 1))::INT);
    END LOOP;
    
    -- Calcula primeiro dígito verificador
    sum := 0;
    FOR i IN 1..12 LOOP
        sum := sum + (nums[i] * weights1[i]);
    END LOOP;
    
    digit1 := 11 - (sum % 11);
    IF digit1 >= 10 THEN
        digit1 := 0;
    END IF;
    
    IF digit1 != nums[13] THEN
        RETURN false;
    END IF;
    
    -- Calcula segundo dígito verificador
    sum := 0;
    FOR i IN 1..13 LOOP
        sum := sum + (nums[i] * weights2[i]);
    END LOOP;
    
    digit2 := 11 - (sum % 11);
    IF digit2 >= 10 THEN
        digit2 := 0;
    END IF;
    
    RETURN digit2 = nums[14];
END;
$$ LANGUAGE plpgsql;

-- Atualiza a função de validação de documento
CREATE OR REPLACE FUNCTION validate_document()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'professional' AND NEW.document IS NOT NULL THEN
        IF NOT is_cpf_valid(NEW.document) THEN
            RAISE EXCEPTION 'CPF inválido';
        END IF;
    ELSIF NEW.role = 'business' AND NEW.document IS NOT NULL THEN
        IF NOT is_cnpj_valid(NEW.document) THEN
            RAISE EXCEPTION 'CNPJ inválido';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 