import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, FileText, BarChart3, Shield, CheckCircle, Calendar, ThumbsUp } from 'lucide-react';
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
      icon: Calendar
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
      icon: ThumbsUp
    }
  ];

  const stats = [
    { value: '95%', label: 'Satisfação dos usuários' },
    { value: '+3000', label: 'Agentes culturais' },
    { value: '+500', label: 'Editais gerenciados' },
    { value: '+250', label: 'Entes federativos' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-green-900 via-indigo-800 to-yellow-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/indica-logo-cut.png')] opacity-5 bg-center bg-no-repeat bg-contain"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 -translate-y-1/2 bg-indigo-500 rounded-full opacity-10 blur-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
        
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Typography 
                  variant="h2" 
                  component="h1" 
                  className="mb-6 font-bold leading-tight w-full"
                  sx={{ 
                    fontSize: { xs: '2.2rem', md: '3.5rem' },
                    background: 'linear-gradient(to right, #ffffff, #bae6fd, #a5f3fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.025em',
                    width: '100%'
                  }}
                >
                 A integração das políticas culturais.
                </Typography>
                <Typography 
                >
                ㅤ
                </Typography>
                <div className="flex flex-wrap gap-4">
                  {isAuthenticated ? (
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="primary"
                      color="secondary"
                      className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Ir para Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => navigate('/login')}
                        variant="primary"
                        color="secondary"
                        className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        Entrar
                      </Button>
                      <Button
                        onClick={() => navigate('/register')}
                        variant="outline"
                        className="px-8 py-3 text-lg font-medium bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 transition-all"
                      >
                        Cadastrar
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex justify-center px-4 md:px-0"
              >
                <div className="relative group p-4">
                  <div className="absolute inset-4 bg-gradient-to-tr from-gray-500 to-blue-700 rounded-xl opacity-30 blur-md transform rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
                  <div className="absolute inset-4 bg-gradient-to-bl from-gray-600 to-indigo-700 rounded-xl opacity-20 blur-md transform -rotate-2 group-hover:-rotate-4 transition-transform duration-700"></div>
                  <img
                    src="/indica-logo-cut.png"
                    alt="INDICA - Sistema de Gestão Cultural"
                    className="relative z-10 w-full max-w-md mx-auto h-auto rounded-xl shadow-2xl transform group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 z-0"></div>
                </div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Estatísticas */}
      <section className="py-10 md:py-14 bg-gradient-to-r from-blue-50 to-teal-50 mt-4">
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Typography 
                      variant="h3" 
                      className="font-bold mb-2"
                      sx={{ 
                        fontSize: { xs: '2.25rem', md: '3rem' },
                        background: 'linear-gradient(to right, #0e7490, #0284c7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 group-hover:text-blue-700 transition-colors">
                      {stat.label}
                    </Typography>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Benefícios */}
      <section id="benefits" className="py-16 md:py-24 relative mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white opacity-50"></div>
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Typography 
              variant="h1" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                color: 'purple.800',
                background: 'linear-gradient(to right, #0c4a6e, #0369a1, #0d9488)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Benefícios do INDICA
              
            </Typography>
            
          </motion.div>
          
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full min-h-[320px] p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden hover:border-blue-200 hover:-translate-y-1">
                    <div className="mb-6 relative group flex justify-center">
                      <div className="relative p-4 bg-gradient-to-br from-blue-100 to-teal-100 group-hover:from-blue-200 group-hover:to-teal-200 rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300">
                        <benefit.icon className="w-8 h-8 text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                      </div>
                    </div>
                    <Typography variant="h5" component="h3" className="mb-3 font-bold text-gray-800 text-center">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" className="mb-5 text-gray-600 text-center">
                      {benefit.description}
                    </Typography>
                    <ul className="space-y-3">
                      {benefit.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
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

      {/* Sobre Nós */}
      <section id="about" className="py-16 md:py-24 relative mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50 to-white opacity-50"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-400 rounded-full opacity-10 blur-3xl"></div>
        
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Typography 
              variant="h1" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                color: 'teal.800',
                background: 'linear-gradient(to right, #0c4a6e, #0369a1, #0d9488)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Sobre o INDICA
            </Typography>

               <Typography 
                variant="h4" 
                component="h4" 
                className="text-center mb-4 font-bold"
                sx={{ 
                  color: 'teal.800',
                  background: 'linear-gradient(to right, #3b3b3b, #414446, #686b6b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'absolute',
                  margin: '0 auto 1rem'
                }}
                 >
                  Uma plataforma tecnológica de gestão que integra informações e indicadores culturais, 
                  promovendo transparência e eficiência na gestão de políticas culturais.
              </Typography>
            
            
          </motion.div>
          
          <Grid container spacing={4}>
            {/* Card 1 */}
            <Grid item xs={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden">
                  <div className="mb-5 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <Typography variant="h4" component="h3" className="font-bold text-gray-800">
                      Base Legal
                    </Typography>
                  </div>
                  
                  <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                    O art. 33 da lei 14.853/2024 determina que os sistemas devem estabelecer uma base de dados comum 
                    entre os entes federados, garantindo a consolidação entre planos, conferências e outros programas.
                  </Typography>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="text-teal-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Conformidade legal
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Card 2 */}
            <Grid item xs={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden">
                  <div className="mb-5 flex items-center">
                    <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <Typography variant="h4" component="h3" className="font-bold text-gray-800">
                      Gestão Cultural
                    </Typography>
                  </div>
                  
                  <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                    Consolidação de metas setoriais e informações sobre cadeias de saberes e fazeres culturais, 
                    produzindo indicadores essenciais para o setor cultural.
                  </Typography>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="text-teal-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Métricas e indicadores
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Card 3 */}
            <Grid item xs={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden">
                  <div className="mb-5 flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                      <Shield className="w-8 h-8" />
                    </div>
                    <Typography variant="h4" component="h3" className="font-bold text-gray-800">
                      Proteção de Dados
                    </Typography>
                  </div>
                  
                  <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                    Integração de informações entre entes federados por meio de bancos de dados acessíveis, 
                    respeitando a lei geral de proteção de dados.
                  </Typography>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="text-teal-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Segurança e conformidade
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Card 4 */}
            <Grid item xs={12} md={6} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden">
                  <div className="mb-5 flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <Typography variant="h4" component="h3" className="font-bold text-gray-800">
                      Profissionalização
                    </Typography>
                  </div>
                  
                  <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                    Promoção da formalização e profissionalização das políticas de trabalho e previdência social, 
                    aprimorando toda a cadeia produtiva cultural, da criatividade burocrática até a artística.
                  </Typography>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="text-teal-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Desenvolvimento profissional
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            </Grid>
            
            {/* Card 5 */}
            <Grid item xs={12} md={6} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden">
                  <div className="mb-5 flex items-center">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <Typography variant="h4" component="h3" className="font-bold text-gray-800">
                      Transparência e Divulgação
                    </Typography>
                  </div>
                  
                  <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                    Relatórios gerados automaticamente apresentam recortes setoriais e territoriais, possibilitando 
                    prestação de contas transparente e avaliação eficiente das políticas aplicadas.
                  </Typography>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Typography variant="body2" className="text-teal-700 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Informações precisas e acessíveis
                    </Typography>
                  </div>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="p-6 border-2 border-teal-100 shadow-lg rounded-xl bg-gradient-to-r from-teal-50 to-blue-50">
              <Typography variant="h5" className="font-bold text-gray-800 mb-3">
                Sistema Nacional de Cultura
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                O INDICA cumpre uma das principais engrenagens do Sistema Nacional de Cultura brasileiro, 
                oferecendo uma solução integrada que não havia encontrado sua plena integração até agora.
              </Typography>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Como Funciona */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-teal-50 to-sky-50 relative overflow-hidden mt-4">
        <div className="absolute inset-0 bg-[url('/indica-logo-cut.png')] opacity-5 bg-center bg-no-repeat bg-contain"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300 rounded-full opacity-20 blur-3xl"></div>
        
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
           
            <Typography 
              variant="h1" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                color: 'blue.800',
                background: 'linear-gradient(to right, #0c4a6e, #0369a1, #0d9488)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Como Funciona
            </Typography>

            <Typography 
              variant="h4" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                color: 'blue.800',
                background: 'linear-gradient(to right, #3b3b3b, #414446, #686b6b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Um processo simplificado e transparente para conectar agentes culturais aos recursos disponíveis de forma eficiente e acessível.
            </Typography>
          </motion.div>
          
          <div className="relative">

            {/* Linha conectora */}
            <div className="hidden md:block absolute top-1/2 left-5 right-5 h-2 bg-gradient-to-r from-purple-500 via-yellow-400 to-blue-400 -translate-y-1/2 z-0 rounded-full"></div>
            
            <Grid container spacing={3} sx={{ mt: 4 }} justifyContent="space-around">
              {howItWorks.map((step, index) => (
                <Grid item xs={12} sm={6} md={2} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                  >
                    <div className="flex flex-col items-center mb-8 md:mb-0">
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full opacity-20 group-hover:opacity-100 blur-lg transition-all duration-500"></div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-white flex items-center justify-center mb-6 shadow-xl relative transform transition-all duration-500 group-hover:scale-105 z-10">
                          <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-lg">{step.step}</span>
                          <step.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                      <Typography variant="h6" component="h3" className="mb-3 font-bold text-gray-800 text-center">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" className="text-center text-gray-600 max-w-[200px] mx-auto">
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
      <section className="py-14 md:py-20 bg-gradient-to-br from-blue-900 via-sky-800 to-teal-800 text-white relative overflow-hidden mt-4">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDuration: '8s', animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 -translate-y-1/2 bg-sky-500 rounded-full opacity-10 blur-2xl animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
        
        <Container maxWidth="xl" className="relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Typography 
              variant="h1" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                background: 'linear-gradient(to right, #ffffff, #b9bbbd, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Pronto para simplificar a gestão cultural?
            </Typography>


            <Typography 
              variant="h4" 
              component="h2" 
              className="text-center mb-4 font-bold"
              sx={{ 
                color: 'blue.800',
                background: 'linear-gradient( #ffffff, #b9bbbd, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                margin: '0 auto 1rem'
              }}
            >
              Junte-se a vários agentes culturais e gestores públicos que já utilizam o INDICA para transformar a maneira como o acesso aos recursos culturais são distribuídos.
            </Typography>



            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 opacity-70 blur-lg rounded-lg group-hover:opacity-100 group-hover:-inset-0.5 transition-all duration-500"></div>
              <Button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                variant="primary"
                color="secondary"
                className="relative px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all rounded-lg group-hover:scale-105 duration-500"
              >
                {isAuthenticated ? 'Acessar Dashboard' : 'Quero me cadastrar'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Home;