import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { RoleBasedDashboard } from '../components/Dashboard/RoleBasedDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

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
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'admin' && 'Gerencie editais, inscrições e avaliações.'}
            {user?.role === 'evaluator' && 'Avalie projetos e emita pareceres técnicos.'}
            {user?.role === 'agent' && 'Acompanhe editais e gerencie suas inscrições.'}
          </p>
        </motion.div>

        {/* Conteúdo específico para cada tipo de usuário */}
        <RoleBasedDashboard user={user} />
      </div>
    </div>
  );
};