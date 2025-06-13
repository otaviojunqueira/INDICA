import React from 'react';
import { 
  FileText, 
  Users, 
  Award, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  BarChart3,
  PieChart
} from 'lucide-react';
import { User } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

interface RoleBasedDashboardProps {
  user: User | null;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ user }) => {
  if (!user) return null;

  // Componente para administradores (entes federativos)
  if (user.role === 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Painel Administrativo
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Bem-vindo ao painel administrativo. Aqui você pode gerenciar editais, avaliações e usuários.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editais</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
            <p className="text-sm text-gray-600">4 ativos, 8 encerrados</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Gerenciar Editais
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inscrições</h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">287</p>
            <p className="text-sm text-gray-600">42 pendentes de avaliação</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Ver Inscrições
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pareceristas</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">15</p>
            <p className="text-sm text-gray-600">8 ativos em avaliações</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Gerenciar Pareceristas
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Editais Recentes</h3>
            <Button variant="ghost" size="sm">
              Ver Todos
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Edital de Apoio à Cultura {item}</h4>
                  <p className="text-sm text-gray-600">Inscrições até 15/12/2024</p>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Distribuição de Recursos</h3>
              <Button variant="ghost" size="sm">
                Exportar
              </Button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <PieChart className="w-12 h-12 text-blue-500 mb-2" />
                <p className="text-gray-500 text-sm">Gráfico de distribuição (simulado)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inscrições por Edital</h3>
              <Button variant="ghost" size="sm">
                Exportar
              </Button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BarChart3 className="w-12 h-12 text-purple-500 mb-2" />
                <p className="text-gray-500 text-sm">Gráfico de barras (simulado)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Componente para pareceristas (avaliadores)
  if (user.role === 'evaluator') {
    return (
      <div className="space-y-6">
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Painel do Parecerista
              </h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>Bem-vindo ao painel de parecerista. Aqui você pode gerenciar suas avaliações de projetos culturais.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
            <p className="text-sm text-gray-600">8 pendentes, 16 concluídas</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Ver Avaliações
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Prazo</h3>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">5 dias</p>
            <p className="text-sm text-gray-600">Próximo prazo de entrega</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Ver Cronograma
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editais</h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">3</p>
            <p className="text-sm text-gray-600">Editais atribuídos a você</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                Ver Editais
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Avaliações Pendentes</h3>
            <Button variant="ghost" size="sm">
              Ver Todas
            </Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Projeto Cultural {item}</h4>
                  <p className="text-sm text-gray-600">Prazo: 15/12/2024</p>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pendente
                  </span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    Avaliar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Componente para agentes culturais (padrão)
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Painel do Agente Cultural
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Bem-vindo ao seu painel. Aqui você pode gerenciar suas inscrições e acompanhar editais disponíveis.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Minhas Inscrições</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">5</p>
          <p className="text-sm text-gray-600">2 em análise, 3 finalizadas</p>
          <div className="mt-4">
            <Button size="sm" variant="outline" className="w-full">
              Ver Inscrições
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Editais Disponíveis</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
          <p className="text-sm text-gray-600">3 com inscrições abertas</p>
          <div className="mt-4">
            <Button size="sm" variant="outline" className="w-full">
              Ver Editais
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Projetos Aprovados</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
          <p className="text-sm text-gray-600">R$ 45.000 em financiamento</p>
          <div className="mt-4">
            <Button size="sm" variant="outline" className="w-full">
              Ver Projetos
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Editais com Inscrições Abertas</h3>
          <Button variant="ghost" size="sm">
            Ver Todos
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Edital de Fomento à Cultura {item}</h4>
                <p className="text-sm text-gray-600">Inscrições até 15/12/2024</p>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Aberto
                </span>
                <Button variant="ghost" size="sm" className="ml-2">
                  Inscrever-se
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Status das Inscrições</h3>
          <Button variant="ghost" size="sm">
            Ver Todas
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Projeto de Música</h4>
              <p className="text-sm text-gray-600">Edital de Apoio à Música</p>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Em Análise
              </span>
              <Button variant="ghost" size="sm" className="ml-2">
                Detalhes
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Festival Cultural</h4>
              <p className="text-sm text-gray-600">Edital de Eventos Culturais</p>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Aprovado
              </span>
              <Button variant="ghost" size="sm" className="ml-2">
                Detalhes
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Oficina de Arte</h4>
              <p className="text-sm text-gray-600">Edital de Formação Cultural</p>
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Não Aprovado
              </span>
              <Button variant="ghost" size="sm" className="ml-2">
                Detalhes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 