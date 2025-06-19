import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  People,
  Place,
  Phone,
  Email,
  Language,
  Instagram,
  Facebook,
  YouTube,
  Person,
  CalendarToday
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { CulturalGroup } from '../../mocks/data';

// Interface para novo coletivo
interface NewCulturalGroupData {
  name: string;
  description: string;
  foundationDate: Date | null;
  culturalArea: string[];
  cnpj: string;
}

export const CulturalGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<CulturalGroup[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newGroup, setNewGroup] = useState<NewCulturalGroupData>({
    name: '',
    description: '',
    foundationDate: null,
    culturalArea: [],
    cnpj: ''
  });
  const [selectedGroup, setSelectedGroup] = useState<CulturalGroup | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Áreas culturais disponíveis
  const culturalAreas = [
    'Música',
    'Teatro',
    'Dança',
    'Artes Visuais',
    'Literatura',
    'Audiovisual',
    'Patrimônio',
    'Artesanato',
    'Cultura Popular',
    'Circo',
    'Moda',
    'Gastronomia',
    'Design',
    'Outros'
  ];

  // Mock de coletivos culturais (temporário)
  const mockGroups: CulturalGroup[] = [
    {
      id: '1',
      name: 'Coletivo Musical Harmonia',
      description: 'Grupo dedicado à fusão de ritmos brasileiros com jazz e música eletrônica',
      foundationDate: new Date('2010-03-20'),
      culturalArea: ['musica', 'educacao'],
      cnpj: '12.345.678/0001-90',
      address: {
        street: 'Rua dos Músicos',
        number: '456',
        complement: 'Sala 12',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      contactEmail: 'contato@coletivoharmonia.com.br',
      contactPhone: '(11) 3456-7890',
      website: 'https://coletivoharmonia.com.br',
      socialMedia: {
        instagram: '@coletivoharmonia',
        facebook: 'facebook.com/coletivoharmonia',
        youtube: 'youtube.com/coletivoharmonia'
      },
      representatives: [
        {
          userId: '1',
          role: 'coordenador',
          isMainContact: true
        }
      ],
      members: [
        {
          name: 'João Silva',
          role: 'Baterista',
          joinedDate: new Date('2010-03-20')
        },
        {
          name: 'Maria Oliveira',
          role: 'Vocalista',
          joinedDate: new Date('2011-05-15')
        }
      ],
      createdAt: new Date('2023-01-16'),
      updatedAt: new Date('2023-05-20')
    },
    {
      id: '2',
      name: 'Coletivo Teatral Mascarados',
      description: 'Grupo de teatro focado em produções experimentais e teatro de rua',
      foundationDate: new Date('2015-08-12'),
      culturalArea: ['teatro', 'danca'],
      cnpj: '98.765.432/0001-10',
      address: {
        street: 'Avenida dos Artistas',
        number: '789',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05415-000'
      },
      contactEmail: 'contato@mascarados.com.br',
      contactPhone: '(11) 98765-4321',
      socialMedia: {
        instagram: '@mascarados.teatro',
        facebook: 'facebook.com/mascarados'
      },
      representatives: [
        {
          userId: '1',
          role: 'diretor',
          isMainContact: true
        }
      ],
      members: [
        {
          name: 'Carlos Pereira',
          role: 'Diretor',
          joinedDate: new Date('2015-08-12')
        },
        {
          name: 'Ana Santos',
          role: 'Atriz',
          joinedDate: new Date('2016-02-15')
        },
        {
          name: 'Paulo Mendes',
          role: 'Cenógrafo',
          joinedDate: new Date('2017-05-10')
        }
      ],
      createdAt: new Date('2023-02-10'),
      updatedAt: new Date('2023-05-15')
    }
  ];

  // Carregar grupos ao iniciar
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulação de carregamento
    const loadGroups = async () => {
      setLoading(true);
      try {
        // Aqui seria uma chamada API real
        await new Promise(resolve => setTimeout(resolve, 800));
        setGroups(mockGroups);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar coletivos:", error);
        setError("Erro ao carregar coletivos culturais. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [isAuthenticated, navigate]);

  // Manipular mudança de tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Abrir modal de criação de novo grupo
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  // Fechar modal de criação
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Criar novo grupo
  const handleCreateGroup = () => {
    // Validação simples
    if (!newGroup.name || !newGroup.description || !newGroup.cnpj || !newGroup.foundationDate || newGroup.culturalArea.length === 0) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    // Simulação de criação
    const createdGroup: CulturalGroup = {
      id: (groups.length + 1).toString(),
      name: newGroup.name,
      description: newGroup.description,
      foundationDate: newGroup.foundationDate || new Date(),
      culturalArea: newGroup.culturalArea,
      cnpj: newGroup.cnpj,
      address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      contactEmail: user?.email || '',
      contactPhone: '',
      representatives: [
        {
          userId: user?.id || '',
          role: 'coordenador',
          isMainContact: true
        }
      ],
      members: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setGroups([...groups, createdGroup]);
    setOpenCreateDialog(false);
    setNewGroup({
      name: '',
      description: '',
      foundationDate: null,
      culturalArea: [],
      cnpj: ''
    });
  };

  // Exibir detalhes do grupo selecionado
  const handleOpenGroupDetails = (group: CulturalGroup) => {
    setSelectedGroup(group);
  };

  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Renderizar os grupos do usuário
  const renderMyGroups = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (groups.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Você ainda não participa de nenhum coletivo cultural.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
          >
            Criar Novo Coletivo
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} md={6} key={group.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/featured/?${group.culturalArea[0]},art`}
                alt={group.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {group.description.length > 100 
                    ? `${group.description.substring(0, 100)}...` 
                    : group.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    Fundado em {formatDate(group.foundationDate)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {group.culturalArea.map((area) => (
                    <Chip 
                      key={area} 
                      label={area} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleOpenGroupDetails(group)}
                >
                  Ver Detalhes
                </Button>
                <Button 
                  size="small" 
                  startIcon={<People />}
                >
                  Gerenciar Membros
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Renderizar os detalhes do grupo selecionado
  const renderGroupDetails = () => {
    if (!selectedGroup) return null;

    return (
      <Dialog 
        open={!!selectedGroup} 
        onClose={() => setSelectedGroup(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedGroup.name}
            <IconButton onClick={() => setSelectedGroup(null)}>
              <Edit />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Informações Gerais</Typography>
              <Typography paragraph>
                {selectedGroup.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">CNPJ</Typography>
                <Typography>{selectedGroup.cnpj}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Fundação</Typography>
                <Typography>{formatDate(selectedGroup.foundationDate)}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Áreas de Atuação</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedGroup.culturalArea.map((area) => (
                    <Chip key={area} label={area} size="small" />
                  ))}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Contato e Endereço</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email fontSize="small" sx={{ mr: 1 }} />
                <Typography>{selectedGroup.contactEmail}</Typography>
              </Box>
              
              {selectedGroup.contactPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone fontSize="small" sx={{ mr: 1 }} />
                  <Typography>{selectedGroup.contactPhone}</Typography>
                </Box>
              )}
              
              {selectedGroup.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Language fontSize="small" sx={{ mr: 1 }} />
                  <Typography>{selectedGroup.website}</Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle2">Redes Sociais</Typography>
                {selectedGroup.socialMedia?.instagram && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Instagram fontSize="small" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.socialMedia.instagram}</Typography>
                  </Box>
                )}
                
                {selectedGroup.socialMedia?.facebook && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Facebook fontSize="small" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.socialMedia.facebook}</Typography>
                  </Box>
                )}
                
                {selectedGroup.socialMedia?.youtube && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <YouTube fontSize="small" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.socialMedia.youtube}</Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Endereço</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Place fontSize="small" sx={{ mr: 1 }} />
                  <Typography>
                    {selectedGroup.address.street}, {selectedGroup.address.number}
                    {selectedGroup.address.complement && `, ${selectedGroup.address.complement}`}
                    <br />
                    {selectedGroup.address.neighborhood}, {selectedGroup.address.city}/{selectedGroup.address.state}
                    <br />
                    CEP: {selectedGroup.address.zipCode}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Membros</Typography>
              
              <List>
                {selectedGroup.members.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={member.name} 
                      secondary={`${member.role} • Desde ${formatDate(member.joinedDate)}`} 
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  startIcon={<Add />}
                  variant="outlined"
                >
                  Adicionar Membro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGroup(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Modal de criação de novo coletivo
  const renderCreateGroupDialog = () => {
    return (
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Criar Novo Coletivo Cultural</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nome do Coletivo"
                fullWidth
                required
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                fullWidth
                required
                multiline
                rows={3}
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                helperText="Descreva o propósito, atividades e objetivos do coletivo"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="CNPJ (se houver)"
                fullWidth
                value={newGroup.cnpj}
                onChange={(e) => setNewGroup({ ...newGroup, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data de Fundação"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={newGroup.foundationDate ? new Date(newGroup.foundationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  foundationDate: e.target.value ? new Date(e.target.value) : null 
                })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Áreas de Atuação</InputLabel>
                <Select
                  multiple
                  value={newGroup.culturalArea}
                  onChange={(e) => setNewGroup({ 
                    ...newGroup, 
                    culturalArea: e.target.value as string[] 
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {culturalAreas.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancelar</Button>
          <Button onClick={handleCreateGroup} variant="contained" color="primary">
            Criar Coletivo
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Coletivos Culturais
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
        >
          Novo Coletivo
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Meus Coletivos" />
          <Tab label="Todos os Coletivos" />
          <Tab label="Convidado" />
        </Tabs>
      </Paper>
      
      {/* Conteúdo da Tab selecionada */}
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && renderMyGroups()}
        {tabValue === 1 && (
          <Typography variant="body1" align="center">
            Funcionalidade de pesquisa de coletivos será implementada em breve.
          </Typography>
        )}
        {tabValue === 2 && (
          <Typography variant="body1" align="center">
            Você não possui convites pendentes para coletivos culturais.
          </Typography>
        )}
      </Box>
      
      {renderCreateGroupDialog()}
      {renderGroupDetails()}
    </Container>
  );
}; 