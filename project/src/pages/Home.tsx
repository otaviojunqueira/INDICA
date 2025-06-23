import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, FileText, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Container, Typography } from '@mui/material';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
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
    <Container>
      <Typography variant="h4">Página Inicial</Typography>
    </Container>
  );
};

export default Home;