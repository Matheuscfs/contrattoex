# URLs dos Perfis das Empresas do Grupo

## BR CENTER TRUCK
- **ID:** d3ad1748-b338-4e7e-81f8-9258521eb49f
- **CNPJ:** 31.636.919/0001-08
- **URL:** http://localhost:3000/empresas/d3ad1748-b338-4e7e-81f8-9258521eb49f/perfil
- **Logo:** `/br-center-truck-logo.png`
- **Atividade:** Serviços de manutenção e reparação mecânica de veículos

## BUSINESS CONSULTORIA
- **ID:** 66864196-2cec-4321-abc3-0610a1eb4281  
- **CNPJ:** 28.922.898/0001-74
- **URL:** http://localhost:3000/empresas/66864196-2cec-4321-abc3-0610a1eb4281/perfil
- **Logo:** `/business-logo.png`
- **Atividade:** Gestão empresarial, consultoria e soluções integradas

## TRANSDESK
- **ID:** f0982363-3a7d-459b-920f-81de9d162d96
- **CNPJ:** 03.323.717/0001-62  
- **URL:** http://localhost:3000/empresas/f0982363-3a7d-459b-920f-81de9d162d96/perfil
- **Logo:** `/transdesk-logo.png`
- **Atividade:** Logística e transportes, soluções em transporte rodoviário

## UNUS HOLDING
- **ID:** 567417a7-a3b9-4eac-94c8-c94bff147dcb
- **CNPJ:** 21.975.647/0001-09
- **URL:** http://localhost:3000/empresas/567417a7-a3b9-4eac-94c8-c94bff147dcb/perfil
- **Logo:** `/unus-logo.png`
- **Atividade:** Tecnologia e inovação, desenvolvimento de software

## TDK CORRETORA
- **ID:** d0c8441b-630e-42a6-82e5-9777cfebb6e7
- **CNPJ:** 19.437.591/0001-97
- **URL:** http://localhost:3000/empresas/d0c8441b-630e-42a6-82e5-9777cfebb6e7/perfil
- **Logo:** `/tdk-logo.png` ✅ **ATUALIZADA**
- **Atividade:** Seguro de vida, Seguro residencial, Seguro Viagem, Seguro para celular, Seguro Auto Simplificado

## TK REGULADORA (Original)
- **ID:** 61e4ba9a-c074-4920-9428-9a0dd2580f36
- **CNPJ:** 22.089.428/0001-95
- **URL:** http://localhost:3000/empresas/61e4ba9a-c074-4920-9428-9a0dd2580f36/perfil
- **Logo:** `/tk-logo.png`
- **Atividade:** Locação de veículos e regulação de sinistros

---

## ✅ **ATUALIZAÇÕES REALIZADAS**

### **Páginas Atualizadas:**
1. **Página de Perfil:** `/src/app/empresas/[id]/perfil/page.tsx`
   - ✅ Função `getCompanyLogo()` implementada
   - ✅ Mapeamento de IDs para logos específicas
   - ✅ Remoção da lógica condicional antiga

2. **Página de Serviços:** `/src/app/servicos/page.tsx`
   - ✅ Função `getCompanyLogo()` implementada
   - ✅ Substituição do `empresa.logo_url` padrão

### **Logos Disponíveis:**
- ✅ `/br-center-truck-logo.png` - BR Center Truck
- ✅ `/business-logo.png` - Business Consultoria  
- ✅ `/transdesk-logo.png` - Transdesk
- ✅ `/unus-logo.png` - Unus Holding
- ✅ `/tdk-logo.png` - TDK Corretora (**NOVA**)
- ✅ `/tk-logo.png` - TK Reguladora

**Nota:** Para acessar as páginas, certifique-se de que o servidor de desenvolvimento está rodando com `npm run dev` 