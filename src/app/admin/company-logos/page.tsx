'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';

interface Company {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export default function CompanyLogosPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, logo_url, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyLogo = async (companyId: string, newLogoUrl: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ logo_url: newLogoUrl })
        .eq('id', companyId);

      if (error) throw error;
      
      // Atualizar estado local
      setCompanies(companies.map(company => 
        company.id === companyId 
          ? { ...company, logo_url: newLogoUrl }
          : company
      ));
      
      alert('Logo atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar logo:', error);
      alert('Erro ao atualizar logo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Logos das Empresas
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Visualize e atualize as logos das empresas cadastradas
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Logo Display */}
                    <div className="w-48 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {company.logo_url ? (
                        <Image
                          src={company.logo_url}
                          alt={`Logo da ${company.name}`}
                          width={192}
                          height={80}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-company.jpg';
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">Sem logo</div>
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Criada em: {new Date(company.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Logo URL */}
                    <div className="w-full">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        URL da Logo:
                      </label>
                      <input
                        type="text"
                        value={company.logo_url || ''}
                        onChange={(e) => {
                          const newUrl = e.target.value;
                          setCompanies(companies.map(c => 
                            c.id === company.id 
                              ? { ...c, logo_url: newUrl }
                              : c
                          ));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                        placeholder="URL da logo"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 w-full">
                      <button
                        onClick={() => updateCompanyLogo(company.id, company.logo_url)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Atualizar
                      </button>
                      <button
                        onClick={() => {
                          const logoOptions = [
                            '/logos/grupo-unus.svg',
                            '/logos/transdesk.svg',
                            '/logos/br-center-truck.svg',
                            '/logos/tdk-seguros.svg',
                            '/logos/tk.svg'
                          ];
                          const randomLogo = logoOptions[Math.floor(Math.random() * logoOptions.length)];
                          updateCompanyLogo(company.id, randomLogo);
                        }}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Logo Aleatória
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {companies.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">Nenhuma empresa encontrada</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const updates = [
                  { name: 'Grupo UNUS', logo: '/logos/grupo-unus.svg' },
                  { name: 'TRANSDESK', logo: '/logos/transdesk.svg' },
                  { name: 'BR Center Truck', logo: '/logos/br-center-truck.svg' },
                  { name: 'TDK Corretora de Seguros', logo: '/logos/tdk-seguros.svg' },
                  { name: 'TK Inteligência e Monitoramento', logo: '/logos/tk.svg' }
                ];
                
                updates.forEach(update => {
                  const company = companies.find(c => c.name === update.name);
                  if (company) {
                    updateCompanyLogo(company.id, update.logo);
                  }
                });
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Aplicar Logos Personalizadas
            </button>
            
            <button
              onClick={() => {
                companies.forEach(company => {
                  const unsplashUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=200&fit=crop&crop=center&auto=format`;
                  updateCompanyLogo(company.id, unsplashUrl);
                });
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              Aplicar Logos Unsplash
            </button>
            
            <button
              onClick={fetchCompanies}
              className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Recarregar Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 