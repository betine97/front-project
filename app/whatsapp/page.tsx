'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ConversasList } from '../../components/whatsapp/ConversasList';
import { ChatArea } from '../../components/whatsapp/ChatArea';
import { InsightsPanel } from '../../components/whatsapp/InsightsPanel';

export default function WhatsAppPage() {
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>('1');

  return (
    <DashboardLayout>
      <div className="flex bg-gray-50 flex-1 overflow-hidden">
        {/* Lista de Conversas */}
        <ConversasList 
          conversaSelecionada={conversaSelecionada}
          onSelecionarConversa={setConversaSelecionada}
        />
        
        {/* Área do Chat */}
        <ChatArea conversaSelecionada={conversaSelecionada} />
        
        {/* Painel de Insights */}
        <InsightsPanel conversaSelecionada={conversaSelecionada} />
      </div>
    </DashboardLayout>
  );
}