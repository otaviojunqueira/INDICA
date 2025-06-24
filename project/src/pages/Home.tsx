import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, FileText, BarChart3, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Container, Typography, Grid } from '@mui/material';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
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
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-20">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" component="h1" className="mb-4 font-bold">
                  Sistema Integrado de Informações e Indicadores Culturais
                </Typography>
                <Typography variant="h6" component="p" className="mb-8">
                  Facilitando o acesso e gestão de editais culturais para agentes culturais e entes federativos.
                </Typography>
                <div className="flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="primary"
                      color="secondary"
                      className="px-8 py-3"
                    >
                      Ir para Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate('/login')}
                        variant="primary"
                        color="secondary"
                        className="px-8 py-3"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => navigate('/register')}
                        variant="outline"
                        className="px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-purple-700"
                      >
                        Cadastrar
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center"
              >
                <img
                  src="/indica.jpeg"
                  alt="INDICA - Sistema de Gestão Cultural"
                  className="max-w-full h-auto rounded-lg shadow-xl"
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Benefícios */}
      <section id="benefits" className="py-20 bg-gray-50">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className="text-center mb-12 font-semibold">
            Benefícios do INDICA
          </Typography>
          
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full p-6">
                    <div className="mb-4 p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <Typography variant="h5" component="h3" className="mb-3 font-medium">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" className="mb-4 text-gray-600">
                      {benefit.description}
                    </Typography>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Como Funciona */}
      <section id="how-it-works" className="py-20">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className="text-center mb-12 font-semibold">
            Como Funciona
          </Typography>
          
          <div className="relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-purple-200 -translate-y-1/2 z-0"></div>
            
            <Grid container spacing={4}>
              {howItWorks.map((step, index) => (
                <Grid item xs={12} md={12/howItWorks.length} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mb-4 shadow-lg">
                        <step.icon className="w-8 h-8" />
                      </div>
                      <Typography variant="h6" component="h3" className="mb-2 font-medium text-center">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" className="text-center text-gray-600">
                        {step.description}
                      </Typography>
                    </div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-700 text-white">
        <Container maxWidth="md">
          <div className="text-center">
            <Typography variant="h4" component="h2" className="mb-4 font-semibold">
              Pronto para simplificar sua gestão cultural?
            </Typography>
            <Typography variant="body1" className="mb-8">
              Junte-se a milhares de agentes culturais e gestores públicos que já utilizam o INDICA.
            </Typography>
            <Button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              variant="primary"
              color="secondary"
              className="px-8 py-3"
            >
              {isAuthenticated ? 'Acessar Dashboard' : 'Começar Agora'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;