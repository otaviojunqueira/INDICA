import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import entityPortalService, { EntityPortal, EntityPortalInput } from '../../services/entityPortal.service';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portal-tabpanel-${index}`}
      aria-labelledby={`portal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EntityPortalPage: React.FC = () => {
  const [portals, setPortals] = useState<EntityPortal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<EntityPortal | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });
  
  // Estado para o formulário
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState<EntityPortalInput>({
    entityId: '',
    title: '',
    description: '',
    logoUrl: '',
    bannerUrl: '',
    primaryColor: '',
    secondaryColor: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: ''
    }
  });
  
  // Estado para visualização de detalhes
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Carregar portais
  useEffect(() => {
    const fetchPortals = async () => {
      try {
        setLoading(true);
        const data = await entityPortalService.getAllEntityPortals({
          query: searchTerm || undefined
        });
        setPortals(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar portais');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortals();
  }, [searchTerm]);
  
  // Abrir formulário para adicionar portal
  const handleAddPortal = () => {
    setFormData({
      entityId: '',
      title: '',
      description: '',
      logoUrl: '',
      bannerUrl: '',
      primaryColor: '',
      secondaryColor: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
      }
    });
    setFormMode('add');
    setFormOpen(true);
  };
  
  // Abrir formulário para editar portal
  const handleEditPortal = (portal: EntityPortal) => {
    setFormData({
      entityId: portal.entityId,
      title: portal.title,
      description: portal.description,
      logoUrl: portal.logoUrl || '',
      bannerUrl: portal.bannerUrl || '',
      primaryColor: portal.primaryColor || '',
      secondaryColor: portal.secondaryColor || '',
      contactEmail: portal.contactEmail,
      contactPhone: portal.contactPhone || '',
      address: portal.address || '',
      socialMedia: portal.socialMedia || {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
      }
    });
    setFormMode('edit');
    setFormOpen(true);
  };
  
  // Fechar formulário
  const handleCloseForm = () => {
    setFormOpen(false);
  };
  
  // Manipular mudanças no formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      if (name.startsWith('socialMedia.')) {
        const socialMediaField = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          socialMedia: {
            ...prev.socialMedia,
            [socialMediaField]: value
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };
  
  // Enviar formulário
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormSubmitting(true);
      
      if (formMode === 'add') {
        await entityPortalService.createEntityPortal(formData);
        setNotification({
          open: true,
          message: 'Portal criado com sucesso',
          type: 'success'
        });
      } else {
        await entityPortalService.updateEntityPortal(selectedPortal!.id, formData);
        setNotification({
          open: true,
          message: 'Portal atualizado com sucesso',
          type: 'success'
        });
      }
      
      // Recarregar lista de portais
      const data = await entityPortalService.getAllEntityPortals({
        query: searchTerm || undefined
      });
      setPortals(data);
      
      setFormOpen(false);
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Erro ao salvar portal',
        type: 'error'
      });
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Alterar status do portal (ativar/desativar)
  const handleToggleStatus = async (portal: EntityPortal) => {
    try {
      await entityPortalService.updateEntityPortalStatus(portal.id, !portal.isActive);
      
      // Atualizar lista local
      setPortals(prev => 
        prev.map(p => 
          p.id === portal.id ? { ...p, isActive: !p.isActive } : p
        )
      );
      
      setNotification({
        open: true,
        message: `Portal ${!portal.isActive ? 'ativado' : 'desativado'} com sucesso`,
        type: 'success'
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Erro ao alterar status do portal',
        type: 'error'
      });
    }
  };
  
  // Excluir portal
  const handleDeletePortal = async (portalId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este portal?')) {
      return;
    }
    
    try {
      await entityPortalService.deleteEntityPortal(portalId);
      
      // Atualizar lista local
      setPortals(prev => prev.filter(portal => portal.id !== portalId));
      
      setNotification({
        open: true,
        message: 'Portal excluído com sucesso',
        type: 'success'
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir portal',
        type: 'error'
      });
    }
  };
  
  // Abrir detalhes do portal
  const handleViewDetails = (portal: EntityPortal) => {
    setSelectedPortal(portal);
    setDetailsOpen(true);
    setTabValue(0);
  };
  
  // Fechar detalhes
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPortal(null);
  };
  
  // Mudar aba nos detalhes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Portais de Transparência
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPortal}
        >
          Novo Portal
        </Button>
      </Box>
      
      {/* Busca */}
      <Box mb={4}>
        <TextField
          fullWidth
          label="Buscar portal"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
      </Box>
      
      {/* Listagem de portais */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : portals.length === 0 ? (
        <Alert severity="info">Nenhum portal encontrado</Alert>
      ) : (
        <Grid container spacing={3}>
          {portals.map((portal) => (
            <Grid item xs={12} md={6} lg={4} key={portal.id}>
              <Card 
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: portal.isActive ? 1 : 0.7
                }}
              >
                {portal.bannerUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={portal.bannerUrl}
                    alt={portal.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h2">
                      {portal.title}
                    </Typography>
                    {!portal.isActive && (
                      <Chip 
                        label="Inativo" 
                        color="error" 
                        size="small" 
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {portal.entity?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {portal.description.substring(0, 100)}
                    {portal.description.length > 100 ? '...' : ''}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(portal)}
                  >
                    Visualizar
                  </Button>
                  <Button 
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedPortal(portal);
                      handleEditPortal(portal);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small"
                    color={portal.isActive ? "error" : "success"}
                    onClick={() => handleToggleStatus(portal)}
                  >
                    {portal.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Modal de detalhes do portal */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        {selectedPortal && (
          <>
            <DialogTitle>
              {selectedPortal.title}
              {!selectedPortal.isActive && (
                <Chip 
                  label="Inativo" 
                  color="error" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </DialogTitle>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Informações Gerais" />
              <Tab label="Contato" />
              <Tab label="Redes Sociais" />
              <Tab label="Aparência" />
            </Tabs>
            <DialogContent dividers>
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Entidade</Typography>
                    <Typography variant="body1">{selectedPortal.entity?.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Descrição</Typography>
                    <Typography variant="body1">{selectedPortal.description}</Typography>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                    <Typography variant="body1">{selectedPortal.contactEmail}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Telefone</Typography>
                    <Typography variant="body1">{selectedPortal.contactPhone || 'Não informado'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">Endereço</Typography>
                    <Typography variant="body1">{selectedPortal.address || 'Não informado'}</Typography>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  {selectedPortal.socialMedia?.facebook && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Facebook</Typography>
                      <Typography variant="body1">
                        <a href={selectedPortal.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                          {selectedPortal.socialMedia.facebook}
                        </a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedPortal.socialMedia?.instagram && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Instagram</Typography>
                      <Typography variant="body1">
                        <a href={selectedPortal.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                          {selectedPortal.socialMedia.instagram}
                        </a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedPortal.socialMedia?.twitter && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">Twitter</Typography>
                      <Typography variant="body1">
                        <a href={selectedPortal.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                          {selectedPortal.socialMedia.twitter}
                        </a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedPortal.socialMedia?.youtube && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">YouTube</Typography>
                      <Typography variant="body1">
                        <a href={selectedPortal.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                          {selectedPortal.socialMedia.youtube}
                        </a>
                      </Typography>
                    </Grid>
                  )}
                  {selectedPortal.socialMedia?.linkedin && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" fontWeight="bold">LinkedIn</Typography>
                      <Typography variant="body1">
                        <a href={selectedPortal.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                          {selectedPortal.socialMedia.linkedin}
                        </a>
                      </Typography>
                    </Grid>
                  )}
                  {!selectedPortal.socialMedia?.facebook && 
                   !selectedPortal.socialMedia?.instagram && 
                   !selectedPortal.socialMedia?.twitter && 
                   !selectedPortal.socialMedia?.youtube && 
                   !selectedPortal.socialMedia?.linkedin && (
                    <Grid item xs={12}>
                      <Alert severity="info">Nenhuma rede social cadastrada</Alert>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Cor Primária</Typography>
                    <Box display="flex" alignItems="center">
                      {selectedPortal.primaryColor ? (
                        <>
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              backgroundColor: selectedPortal.primaryColor,
                              border: '1px solid #ccc',
                              mr: 1
                            }} 
                          />
                          <Typography variant="body1">{selectedPortal.primaryColor}</Typography>
                        </>
                      ) : (
                        <Typography variant="body1">Não definida</Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Cor Secundária</Typography>
                    <Box display="flex" alignItems="center">
                      {selectedPortal.secondaryColor ? (
                        <>
                          <Box 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              backgroundColor: selectedPortal.secondaryColor,
                              border: '1px solid #ccc',
                              mr: 1
                            }} 
                          />
                          <Typography variant="body1">{selectedPortal.secondaryColor}</Typography>
                        </>
                      ) : (
                        <Typography variant="body1">Não definida</Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Logo</Typography>
                    {selectedPortal.logoUrl ? (
                      <Box 
                        component="img"
                        src={selectedPortal.logoUrl}
                        alt="Logo"
                        sx={{ 
                          maxWidth: '100%', 
                          maxHeight: 100,
                          objectFit: 'contain' 
                        }}
                      />
                    ) : (
                      <Typography variant="body1">Logo não definido</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Banner</Typography>
                    {selectedPortal.bannerUrl ? (
                      <Box 
                        component="img"
                        src={selectedPortal.bannerUrl}
                        alt="Banner"
                        sx={{ 
                          maxWidth: '100%', 
                          maxHeight: 200,
                          objectFit: 'contain' 
                        }}
                      />
                    ) : (
                      <Typography variant="body1">Banner não definido</Typography>
                    )}
                  </Grid>
                </Grid>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Fechar</Button>
              <Button 
                color="primary" 
                variant="contained"
                onClick={() => {
                  handleCloseDetails();
                  handleEditPortal(selectedPortal);
                }}
              >
                Editar
              </Button>
              <Button 
                color="error" 
                variant="outlined"
                onClick={() => {
                  handleCloseDetails();
                  handleDeletePortal(selectedPortal.id);
                }}
              >
                Excluir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Formulário de adição/edição de portal */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            {formMode === 'add' ? 'Adicionar Novo Portal' : 'Editar Portal'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="entityId"
                  label="ID da Entidade"
                  value={formData.entityId}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  variant="outlined"
                  disabled={formMode === 'edit'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Título"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Descrição"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Contato</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactEmail"
                  label="Email de Contato"
                  value={formData.contactEmail}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  variant="outlined"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="contactPhone"
                  label="Telefone de Contato"
                  value={formData.contactPhone}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Endereço"
                  value={formData.address}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Redes Sociais</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="socialMedia.facebook"
                  label="Facebook"
                  value={formData.socialMedia?.facebook}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="socialMedia.instagram"
                  label="Instagram"
                  value={formData.socialMedia?.instagram}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="socialMedia.twitter"
                  label="Twitter"
                  value={formData.socialMedia?.twitter}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="socialMedia.youtube"
                  label="YouTube"
                  value={formData.socialMedia?.youtube}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="socialMedia.linkedin"
                  label="LinkedIn"
                  value={formData.socialMedia?.linkedin}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Aparência</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="primaryColor"
                  label="Cor Primária (Hex)"
                  value={formData.primaryColor}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  placeholder="#000000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="secondaryColor"
                  label="Cor Secundária (Hex)"
                  value={formData.secondaryColor}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  placeholder="#000000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="logoUrl"
                  label="URL do Logo"
                  value={formData.logoUrl}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="bannerUrl"
                  label="URL do Banner"
                  value={formData.bannerUrl}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} disabled={formSubmitting}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={formSubmitting}
            >
              {formSubmitting ? <CircularProgress size={24} /> : formMode === 'add' ? 'Adicionar' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Notificações */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EntityPortalPage; 