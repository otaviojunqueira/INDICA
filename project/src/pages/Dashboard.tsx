import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import RoleBasedDashboard from '../components/Dashboard/RoleBasedDashboard';

// Definição de animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <Box 
      sx={{
        background: 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)',
        minHeight: 'calc(100vh - 64px)', // Ajuste para o header
        pt: 3,
        pb: 6
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
      

        {/* Conteúdo específico para cada tipo de usuário */}
        {user && (
          <RoleBasedDashboard 
            role={user.role as 'admin' | 'agent' | 'evaluator'} 
            userName={user.name || 'Usuário'}
          />
        )}
      </motion.div>
    </Box>
  );
};

export default Dashboard;