import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Construction } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Construction size={64} className="mx-auto text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Esta página está sendo desenvolvida</p>
        </div>
      </div>
    </DashboardLayout>
  );
}