'use client';

import { Package, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { Produto } from '@/types/entities';
import { formatCurrency } from '@/lib/utils';
import styles from '@/app/produtos/produtos.module.css';

interface ProdutoStatsProps {
  produtos: Produto[];
}

export function ProdutoStats({ produtos }: ProdutoStatsProps) {
  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter(p => p.ativo).length;
  const totalValue = produtos.reduce((sum, p) => sum + (p.preco_venda * p.estoque), 0);
  const lowStockProducts = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;

  const stats = [
    {
      title: 'Total de Produtos',
      value: totalProdutos.toString(),
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Produtos Ativos',
      value: produtosAtivos.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Valor Total',
      value: formatCurrency(totalValue),
      icon: BarChart3,
      color: 'text-blue-600',
    },
    {
      title: 'Estoque Baixo',
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={styles.statsCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}