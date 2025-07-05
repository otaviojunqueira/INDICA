import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import entityService, { Entity, EntityUpdateData } from '../../services/entity.service';

interface FilterForm {
  name: string;
  state: string;
  status: string;
}

interface EditForm extends EntityUpdateData {
  name: string;
  email: string;
  phone: string;
  responsiblePerson: string;
  position: string;
  institutionalPhone: string;
}

const EntityManagementPage: React.FC = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<FilterForm>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm<EditForm>();

  // Carregar entes federados
  const loadEntities = async (filters?: Partial<FilterForm>) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = filters ? {
        name: filters.name,
        state: filters.state !== 'all' ? filters.state : undefined,
        isActive: filters.status !== 'all' ? filters.status === 'active' : undefined
      } : {};
      
      const data = await entityService.searchEntities(searchFilters);
      setEntities(data);
    } catch (error) {
      console.error('Erro ao carregar entes federados:', error);
      setError('Erro ao carregar entes federados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  // Filtrar entes federados
  const onFilter = async (data: FilterForm) => {
    await loadEntities(data);
  };

  // Resetar filtros
  const resetFilters = () => {
    reset({
      name: '',
      state: 'all',
      status: 'all'
    });
    loadEntities();
  };

  // Alternar status do ente federado
  const toggleEntityStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdatingStatus(id);
      await entityService.toggleEntityStatus(id, !currentStatus);
      
      setEntities(entities.map(entity => 
        entity._id === id ? { ...entity, isActive: !currentStatus } : entity
      ));
      
      toast.success(`Ente federado ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do ente federado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Abrir diálogo de edição
  const openEditDialog = (entity: Entity) => {
    setSelectedEntity(entity);
    resetEdit({
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      responsiblePerson: entity.responsiblePerson,
      position: entity.position,
      institutionalPhone: entity.institutionalPhone
    });
    setEditDialogOpen(true);
  };

  // Salvar edição
  const onSaveEdit = async (data: EditForm) => {
    if (!selectedEntity) return;

    try {
      await entityService.updateEntity(selectedEntity._id, data);
      
      setEntities(entities.map(entity =>
        entity._id === selectedEntity._id ? { ...entity, ...data } : entity
      ));
      
      toast.success('Ente federado atualizado com sucesso!');
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar ente federado:', error);
      toast.error('Erro ao atualizar ente federado');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Entes Federados
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit(onFilter)}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <TextField
              label="Buscar por nome"
              {...register('name')}
              size="small"
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                defaultValue="all"
                {...register('state')}
              >
                <MenuItem value="all">Todos</MenuItem>
                {/* Adicionar estados brasileiros aqui */}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue="all"
                {...register('status')}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="inactive">Inativos</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              type="submit"
            >
              Buscar
            </Button>

            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={resetFilters}
            >
              Limpar
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Lista de Entes Federados */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Cidade/Estado</TableCell>
                <TableCell>Responsável</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entities.map((entity) => (
                <TableRow key={entity._id}>
                  <TableCell>{entity.name}</TableCell>
                  <TableCell>
                    {entity.city?.name}/{entity.city?.state}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entity.responsiblePerson}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {entity.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entity.email}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {entity.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entity.isActive ? 'Ativo' : 'Inativo'}
                      color={entity.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(entity)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={entity.isActive ? 'Desativar' : 'Ativar'}>
                      <IconButton
                        size="small"
                        color={entity.isActive ? 'error' : 'success'}
                        onClick={() => toggleEntityStatus(entity._id, entity.isActive)}
                        disabled={updatingStatus === entity._id}
                      >
                        {updatingStatus === entity._id ? (
                          <CircularProgress size={20} />
                        ) : entity.isActive ? (
                          <InactiveIcon />
                        ) : (
                          <ActiveIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo de Edição */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Editar Ente Federado
        </DialogTitle>
        <form onSubmit={handleSubmitEdit(onSaveEdit)}>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField
                label="Nome do Órgão"
                fullWidth
                {...registerEdit('name', { required: 'Nome é obrigatório' })}
                error={!!editErrors.name}
                helperText={editErrors.name?.message}
              />
              <TextField
                label="Email"
                fullWidth
                {...registerEdit('email', { required: 'Email é obrigatório' })}
                error={!!editErrors.email}
                helperText={editErrors.email?.message}
              />
              <TextField
                label="Telefone"
                fullWidth
                {...registerEdit('phone', { required: 'Telefone é obrigatório' })}
                error={!!editErrors.phone}
                helperText={editErrors.phone?.message}
              />
              <TextField
                label="Responsável"
                fullWidth
                {...registerEdit('responsiblePerson', { required: 'Responsável é obrigatório' })}
                error={!!editErrors.responsiblePerson}
                helperText={editErrors.responsiblePerson?.message}
              />
              <TextField
                label="Cargo"
                fullWidth
                {...registerEdit('position', { required: 'Cargo é obrigatório' })}
                error={!!editErrors.position}
                helperText={editErrors.position?.message}
              />
              <TextField
                label="Telefone Institucional"
                fullWidth
                {...registerEdit('institutionalPhone', { required: 'Telefone institucional é obrigatório' })}
                error={!!editErrors.institutionalPhone}
                helperText={editErrors.institutionalPhone?.message}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default EntityManagementPage;