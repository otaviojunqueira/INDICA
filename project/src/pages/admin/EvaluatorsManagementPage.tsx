import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import evaluatorService, { Evaluator } from '../../services/evaluator.service';

const culturalSectors = [
  'Artes Visuais',
  'Audiovisual',
  'Circo',
  'Dança',
  'Literatura',
  'Música',
  'Teatro',
  'Patrimônio Cultural',
  'Cultura Popular',
  'Artesanato',
  'Outros'
];

const EvaluatorsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    evaluatorId: '',
    action: ''
  });

  // Carregar pareceristas
  const loadEvaluators = async () => {
    try {
      setLoading(true);
      const filters = {
        query: searchQuery || undefined,
        culturalSector: selectedSector || undefined
      };
      const data = await evaluatorService.listEvaluators(filters);
      setEvaluators(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pareceristas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluators();
  }, [searchQuery, selectedSector]);

  // Manipular mudança de status
  const handleStatusChange = async (evaluatorId: string, currentStatus: boolean) => {
    try {
      await evaluatorService.toggleEvaluatorStatus(evaluatorId, !currentStatus);
      await loadEvaluators();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao alterar status do parecerista');
    }
  };

  // Manipular mudança de setor cultural
  const handleSectorChange = (event: SelectChangeEvent<string>) => {
    setSelectedSector(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gerenciamento de Pareceristas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/evaluators/new')}
        >
          Novo Parecerista
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Buscar parecerista"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Setor Cultural</InputLabel>
            <Select
              value={selectedSector}
              onChange={handleSectorChange}
              label="Setor Cultural"
            >
              <MenuItem value="">Todos</MenuItem>
              {culturalSectors.map(sector => (
                <MenuItem key={sector} value={sector}>{sector}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Setor Cultural</TableCell>
                <TableCell>Especialidades</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Carregando...</TableCell>
                </TableRow>
              ) : evaluators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Nenhum parecerista encontrado</TableCell>
                </TableRow>
              ) : (
                evaluators.map((evaluator) => (
                  <TableRow key={evaluator.id}>
                    <TableCell>{evaluator.userId.name}</TableCell>
                    <TableCell>{evaluator.userId.email}</TableCell>
                    <TableCell>{evaluator.culturalSector}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {evaluator.specialties.map((specialty) => (
                          <Chip
                            key={specialty}
                            label={specialty}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluator.isActive ? 'Ativo' : 'Inativo'}
                        color={evaluator.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => navigate(`/admin/evaluators/edit/${evaluator.id}`)}
                        color="primary"
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleStatusChange(evaluator.id, evaluator.isActive)}
                        color={evaluator.isActive ? 'error' : 'success'}
                        title={evaluator.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {evaluator.isActive ? <CloseIcon /> : <CheckIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, evaluatorId: '', action: '' })}
      >
        <DialogTitle>
          {confirmDialog.action === 'delete' ? 'Confirmar exclusão' : 'Confirmar alteração de status'}
        </DialogTitle>
        <DialogContent>
          {confirmDialog.action === 'delete'
            ? 'Tem certeza que deseja excluir este parecerista?'
            : 'Tem certeza que deseja alterar o status deste parecerista?'}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, evaluatorId: '', action: '' })}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
            onClick={() => {
              if (confirmDialog.action === 'status') {
                const evaluator = evaluators.find(e => e.id === confirmDialog.evaluatorId);
                if (evaluator) {
                  handleStatusChange(confirmDialog.evaluatorId, evaluator.isActive);
                }
              }
              setConfirmDialog({ open: false, evaluatorId: '', action: '' });
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EvaluatorsManagementPage; 