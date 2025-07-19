import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function Home() {
  const modules = [
    { name: 'Produtos', href: ROUTES.PRODUTOS, description: 'Catálogo de produtos', status: 'active' },
    { name: 'Clientes', href: ROUTES.CLIENTES, description: 'Gerencie seus clientes', status: 'development' },
    { name: 'Estoque', href: ROUTES.ESTOQUE, description: 'Controle de estoque', status: 'development' },
    { name: 'Vendas', href: ROUTES.VENDAS, description: 'Gestão de vendas', status: 'development' },
    { name: 'Financeiro', href: ROUTES.FINANCEIRO, description: 'Controle financeiro', status: 'development' },
    { name: 'Fornecedores', href: ROUTES.FORNECEDORES, description: 'Gestão de fornecedores', status: 'development' },
    { name: 'Funcionários', href: ROUTES.FUNCIONARIOS, description: 'Recursos humanos', status: 'development' },
    { name: 'Marketing', href: ROUTES.MARKETING, description: 'Campanhas e marketing', status: 'development' },
    { name: 'Agenda', href: ROUTES.AGENDA, description: 'Agenda e eventos', status: 'development' },
    { name: 'WhatsApp', href: ROUTES.WHATSAPP, description: 'Integração WhatsApp', status: 'development' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Gestão Empresarial
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie todos os aspectos do seu negócio em um só lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border relative ${
                module.status === 'active' 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              {module.status === 'active' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Ativo
                  </span>
                </div>
              )}
              {module.status === 'development' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Em desenvolvimento
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {module.name}
              </h3>
              <p className="text-gray-600">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}