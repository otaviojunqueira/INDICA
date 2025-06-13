import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, FileText, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';

export const Home: React.FC = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Para Agentes Culturais',
      description: 'Acesso centralizado a editais, acompanhamento de inscrições e gestão simplificada de projetos culturais.',
      features: ['Cadastro único', 'Notificações automáticas', 'Histórico completo', 'Suporte especializado']
    },
    {
      icon: FileText,
      title: 'Para Gestores Públicos',
      description: 'Ferramenta completa para criação, gestão e acompanhamento de editais culturais com transparência total.',
      features: ['Criação de editais', 'Avaliação integrada', 'Relatórios detalhados', 'Controle de prazos']
    },
    {
      icon: BarChart3,
      title: 'Indicadores Culturais',
      description: 'Dados e métricas em tempo real para tomada de decisões estratégicas no setor cultural.',
      features: ['Dashboards interativos', 'Análises estatísticas', 'Exportação de dados', 'Comparativos regionais']
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Cadastro',
      description: 'Agentes culturais e gestores se cadastram com CPF/CNPJ',
      icon: Users
    },
    {
      step: 2,
      title: 'Publicação',
      description: 'Entes federativos publicam editais com critérios específicos',
      icon: FileText
    },
    {
      step: 3,
      title: 'Inscrição',
      description: 'Agentes culturais se inscrevem nos editais de interesse',
      icon: CheckCircle
    },
    {
      step: 4,
      title: 'Avaliação',
      description: 'Pareceristas avaliam projetos de forma transparente',
      icon: Shield
    },
    {
      step: 5,
      title: 'Acompanhamento',
      description: 'Monitoramento completo da execução dos projetos',
      icon: BarChart3
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Sistema Integrado de
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Informações Culturais
                </span>
              </h1>
              <p className="text-xl mb-8 text-purple-100 leading-relaxed">
                Facilitamos o acesso e gestão de editais culturais, conectando agentes culturais 
                e entes federativos em uma plataforma única, transparente e eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Começar Agora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-gray-500 hover:text-purple-900">
                  Saiba Mais
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">100+</div>
                    <div className="text-purple-200">Agentes Cadastrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">50+</div>
                    <div className="text-purple-200">Editais Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">10+</div>
                    <div className="text-purple-200">Cidades Parceiras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">R$ 10M</div>
                    <div className="text-purple-200">Investidos</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre Nós
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              O INDICA é uma plataforma inovadora que revoluciona a gestão de editais culturais no Brasil, 
              promovendo transparência, eficiência e democratização do acesso aos recursos culturais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Transparência Total',
                description: 'Todos os processos são auditáveis e transparentes, garantindo lisura nas seleções.'
              },
              {
                icon: Clock,
                title: 'Agilidade',
                description: 'Automatização de processos reduz tempo de tramitação e melhora a experiência.'
              },
              {
                icon: BarChart3,
                title: 'Dados Inteligentes',
                description: 'Indicadores culturais em tempo real para decisões estratégicas baseadas em dados.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-8 text-center h-full">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Benefícios para Todos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O INDICA oferece vantagens específicas para cada tipo de usuário, 
              criando um ecossistema cultural mais eficiente e conectado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card hover className="p-8 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Como Funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Um processo simples e transparente que conecta cultura e gestão pública
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
            
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-purple-600 rounded-full"></div>
                
                <div className="hidden lg:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Pronto para Transformar a Cultura?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
              Junte-se a centenas de gestores públicos  e agentes culturais que já utilizam o INDICA 
              para democratizar o acesso aos recursos culturais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                  Cadastrar-se Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue hover:text-purple-600 w-full sm:w-auto">
                Falar com Especialista
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};