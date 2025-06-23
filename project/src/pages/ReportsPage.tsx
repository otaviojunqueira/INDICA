import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Download, 
  Filter, 
  Calendar,
  FileText
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

// Componente fictício de gráfico de barras
const BarChartComponent = () => (
  <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <BarChart3 className="w-12 h-12 text-purple-500 mb-2" />
      <p className="text-gray-500 text-sm">Gráfico de barras (simulado)</p>
    </div>
  </div>
);

// Componente fictício de gráfico de pizza
const PieChartComponent = () => (
  <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <PieChart className="w-12 h-12 text-blue-500 mb-2" />
      <p className="text-gray-500 text-sm">Gráfico de pizza (simulado)</p>
    </div>
  </div>
);

// Componente fictício de gráfico de linha
const LineChartComponent = () => (
  <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <LineChart className="w-12 h-12 text-green-500 mb-2" />
      <p className="text-gray-500 text-sm">Gráfico de linha (simulado)</p>
    </div>
  </div>
);

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'applications', name: 'Inscrições', icon: FileText },
    { id: 'funding', name: 'Financiamento', icon: PieChart },
    { id: 'performance', name: 'Desempenho', icon: LineChart },
  ];

  const dateRanges = [
    { id: 'week', name: '7 dias' },
    { id: 'month', name: '30 dias' },
    { id: 'quarter', name: '3 meses' },
    { id: 'year', name: '12 meses' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Relatórios e Análises
          </h1>
          <p className="text-gray-600">
            Visualize dados e estatísticas sobre editais, inscrições e financiamentos
          </p>
        </motion.div>

        {/* Tabs e Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex overflow-x-auto pb-2 md:pb-0 space-x-2">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === type.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <type.icon className="w-4 h-4 mr-2" />
                {type.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id)}
                  className={`px-3 py-1 text-sm rounded ${
                    dateRange === range.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range.name}
                </button>
              ))}
            </div>

            <button className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
              <Calendar className="w-5 h-5" />
            </button>

            <button className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo dos Relatórios */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Estatísticas Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Editais Ativos</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-green-600">+3 este mês</p>
                    </div>
                    <div className="text-purple-500">
                      <BarChart3 className="w-10 h-10" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Total de Inscrições</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">287</p>
                      <p className="text-sm text-green-600">+42 este mês</p>
                    </div>
                    <div className="text-blue-500">
                      <FileText className="w-10 h-10" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Valor Total Financiado</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">R$ 1.2M</p>
                      <p className="text-sm text-green-600">+R$ 250K este mês</p>
                    </div>
                    <div className="text-green-500">
                      <PieChart className="w-10 h-10" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Inscrições por Edital</h3>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                  <BarChartComponent />
                </Card>

                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Distribuição por Categoria</h3>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                  <PieChartComponent />
                </Card>
              </div>

              {/* Tendências */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tendência de Inscrições</h3>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
                <LineChartComponent />
              </Card>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Relatório de Inscrições</h3>
              <p className="text-gray-600 mb-6">
                Dados detalhados sobre inscrições por edital, categoria e região.
              </p>
              <BarChartComponent />
            </div>
          )}

          {activeTab === 'funding' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Relatório de Financiamento</h3>
              <p className="text-gray-600 mb-6">
                Análise de valores financiados por categoria, região e período.
              </p>
              <PieChartComponent />
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Relatório de Desempenho</h3>
              <p className="text-gray-600 mb-6">
                Métricas de desempenho e tendências ao longo do tempo.
              </p>
              <LineChartComponent />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 

export default ReportsPage;