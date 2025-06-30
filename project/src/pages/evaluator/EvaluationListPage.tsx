import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Button,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search, AssignmentTurnedIn, AssignmentLate } from '@mui/icons-material';
import evaluationService from '../../services/evaluation.service';
import { EvaluationInfo } from '../../types';

// Estender interface EvaluationInfo para incluir status "in_progress" para compatibilidade
interface ExtendedEvaluationInfo extends Omit<EvaluationInfo, 'status'> {
  status: 'approved' | 'rejected' | 'pending_adjustment' | 'in_progress';
}

const EvaluationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<ExtendedEvaluationInfo[]>([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const fetchedEvaluations = await evaluationService.getMyEvaluations();
        setEvaluations(fetchedEvaluations as ExtendedEvaluationInfo[]);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };

    fetchEvaluations();
  }, []);

  const getStatusColor = (status: string): 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' => {
    switch (status) {
      case 'pending_adjustment': return 'warning';
      case 'in_progress': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_adjustment': return 'Ajustes Pendentes';
      case 'in_progress': return 'Em Andamento';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Não Iniciada';
    }
  };

  // Verifica se o status é um dos que deve mostrar o botão de ação
  const shouldShowActionButton = (status: string) => {
    return status === 'pending_adjustment' || status === 'in_progress';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Minhas Avaliações
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Critério</TableCell>
                <TableCell>Pontuação</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>
                    {evaluation.criteriaScores[0]?.criteriaName || 'Sem critério'}
                  </TableCell>
                  <TableCell>
                    {evaluation.criteriaScores[0]?.score || 0} / 
                    {evaluation.criteriaScores[0]?.maxScore || 10}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(evaluation.status)}
                      color={getStatusColor(evaluation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <Grid container spacing={1} justifyContent="flex-end">
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Search />}
                          onClick={() => navigate(`/evaluator/evaluation/${evaluation.id}`)}
                        >
                          Detalhes
                        </Button>
                      </Grid>
                      {shouldShowActionButton(evaluation.status) && (
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={evaluation.status === 'pending_adjustment' ? <AssignmentLate /> : <AssignmentTurnedIn />}
                            onClick={() => navigate(`/evaluator/evaluation/${evaluation.id}`)}
                          >
                            {evaluation.status === 'pending_adjustment' ? 'Iniciar' : 'Continuar'}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default EvaluationListPage; 