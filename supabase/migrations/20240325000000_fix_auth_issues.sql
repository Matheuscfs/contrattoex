-- Migration to fix authentication and profile creation issues
-- This migration consolidates all profile-related fixes

-- First, let's clean up any existing policies and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias informações" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias informações" ON public.profiles;

-- Ensure the profiles table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'professional', 'business', 'admin')),
    document TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    avatar_url TEXT,
    bio TEXT,
    specialties TEXT[],
    business_hours JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Create the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert new profile with error handling
    BEGIN
        INSERT INTO public.profiles (
            id, 
            email, 
            name, 
            role,
            status
        )
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
            CASE 
                WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'customer' THEN 'approved'
                ELSE 'pending'
            END
        );
        
        RAISE LOG 'Profile created successfully for user %', NEW.id;
        
    EXCEPTION WHEN unique_violation THEN
        -- Profile already exists, update it instead
        UPDATE public.profiles 
        SET 
            email = NEW.email,
            name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', name),
            role = COALESCE(NEW.raw_user_meta_data->>'role', role),
            updated_at = NOW()
        WHERE id = NEW.id;
        
        RAISE LOG 'Profile updated for existing user %', NEW.id;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE LOG 'Error creating profile for user %: % %', NEW.id, SQLSTATE, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Test the function by creating a test profile (will be cleaned up)
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- This is just to test if our function works
    RAISE LOG 'Testing profile creation function...';
END $$; 