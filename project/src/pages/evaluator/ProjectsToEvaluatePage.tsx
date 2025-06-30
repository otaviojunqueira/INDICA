import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Divider, 
  TextField, 
  InputAdornment,
  CircularProgress, 
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Assignment as AssignmentIcon, 
  AssignmentTurnedIn as AssignmentTurnedInIcon, 
  FilterList as FilterListIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import evaluationService from '../../services/evaluation.service';
import applicationService from '../../services/application.service';
import noticeService from '../../services/notice.service';
import { Application } from '../../types';

interface ProjectToEvaluate {
  id: string;
  applicationId: string;
  applicationTitle: string;
  applicantName: string;
  noticeTitle: string;
  submissionDate: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  culturalArea: string;
}

const ProjectsToEvaluatePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectToEvaluate[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectToEvaluate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const projectsPerPage = 6;

  // Áreas culturais para filtro
  const culturalAreas = [
    'Música',
    'Artes Visuais',
    'Teatro',
    'Dança',
    'Literatura',
    'Audiovisual',
    'Patrimônio',
    'Artesanato',
    'Cultura Popular'
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Simular chamada à API com um atraso
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados simulados - em um ambiente real, viria da API
        const mockProjects: ProjectToEvaluate[] = [
          {
            id: '1',
            applicationId: '101',
            applicationTitle: 'Festival de Música Independente',
            applicantName: 'João Silva',
            noticeTitle: 'Edital de Fomento à Música',
            submissionDate: '2023-05-15',
            deadline: '2023-06-15',
            status: 'not_started',
            priority: 'high',
            culturalArea: 'Música'
          },
          {
            id: '2',
            applicationId: '102',
            applicationTitle: 'Exposição de Arte Contemporânea',
            applicantName: 'Maria Oliveira',
            noticeTitle: 'Edital de Artes Visuais',
            submissionDate: '2023-05-18',
            deadline: '2023-06-18',
            status: 'in_progress',
            priority: 'medium',
            culturalArea: 'Artes Visuais'
          },
          {
            id: '3',
            applicationId: '103',
            applicationTitle: 'Oficina de Teatro para Jovens',
            applicantName: 'Carlos Santos',
            noticeTitle: 'Edital de Formação Cultural',
            submissionDate: '2023-05-20',
            deadline: '2023-06-20',
            status: 'not_started',
            priority: 'low',
            culturalArea: 'Teatro'
          },
          {
            id: '4',
            applicationId: '104',
            applicationTitle: 'Documentário sobre Cultura Popular',
            applicantName: 'Ana Ferreira',
            noticeTitle: 'Edital de Audiovisual',
            submissionDate: '2023-05-22',
            deadline: '2023-06-22',
            status: 'not_started',
            priority: 'high',
            culturalArea: 'Audiovisual'
          },
          {
            id: '5',
            applicationId: '105',
            applicationTitle: 'Festival de Dança Contemporânea',
            applicantName: 'Pedro Almeida',
            noticeTitle: 'Edital de Fomento à Dança',
            submissionDate: '2023-05-25',
            deadline: '2023-06-25',
            status: 'in_progress',
            priority: 'medium',
            culturalArea: 'Dança'
          },
          {
            id: '6',
            applicationId: '106',
            applicationTitle: 'Sarau Literário',
            applicantName: 'Fernanda Lima',
            noticeTitle: 'Edital de Literatura',
            submissionDate: '2023-05-28',
            deadline: '2023-06-28',
            status: 'not_started',
            priority: 'low',
            culturalArea: 'Literatura'
          },
          {
            id: '7',
            applicationId: '107',
            applicationTitle: 'Restauração de Patrimônio Histórico',
            applicantName: 'Roberto Mendes',
            noticeTitle: 'Edital de Patrimônio Cultural',
            submissionDate: '2023-05-30',
            deadline: '2023-06-30',
            status: 'not_started',
            priority: 'high',
            culturalArea: 'Patrimônio'
          },
          {
            id: '8',
            applicationId: '108',
            applicationTitle: 'Feira de Artesanato Regional',
            applicantName: 'Lúcia Soares',
            noticeTitle: 'Edital de Economia Criativa',
            submissionDate: '2023-06-01',
            deadline: '2023-07-01',
            status: 'not_started',
            priority: 'medium',
            culturalArea: 'Artesanato'
          }
        ];
        
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        setError('Não foi possível carregar os projetos para avaliação. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Aplicar filtros quando mudar
  useEffect(() => {
    let result = [...projects];
    
    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(project => 
        project.applicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de status
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Aplicar filtro de prioridade
    if (priorityFilter !== 'all') {
      result = result.filter(project => project.priority === priorityFilter);
    }
    
    // Aplicar filtro de área cultural
    if (areaFilter !== 'all') {
      result = result.filter(project => project.culturalArea === areaFilter);
    }
    
    setFilteredProjects(result);
    setPage(1); // Resetar para a primeira página quando filtrar
  }, [searchTerm, statusFilter, priorityFilter, areaFilter, projects]);

  // Manipuladores de eventos para filtros
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  const handleAreaFilterChange = (event: SelectChangeEvent) => {
    setAreaFilter(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Função para iniciar avaliação
  const handleStartEvaluation = (projectId: string) => {
    navigate(`/evaluator/evaluation/${projectId}`);
  };

  // Função para continuar avaliação
  const handleContinueEvaluation = (projectId: string) => {
    navigate(`/evaluator/evaluation/${projectId}`);
  };

  // Função para obter cor baseada na prioridade
  const getPriorityColor = (priority: string): "error" | "warning" | "info" => {
    switch (priority) {
      case 'high': return "error";
      case 'medium': return "warning";
      case 'low': return "info";
      default: return "info";
    }
  };

  // Função para obter cor baseada no status
  const getStatusColor = (status: string): "default" | "primary" | "success" => {
    switch (status) {
      case 'not_started': return "default";
      case 'in_progress': return "primary";
      case 'completed': return "success";
      default: return "default";
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'not_started': return "Não iniciado";
      case 'in_progress': return "Em andamento";
      case 'completed': return "Concluído";
      default: return "Desconhecido";
    }
  };

  // Função para obter texto da prioridade
  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'high': return "Alta";
      case 'medium': return "Média";
      case 'low': return "Baixa";
      default: return "Desconhecida";
    }
  };

  // Calcular dias restantes até o prazo
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Paginação
  const indexOfLastProject = page * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projetos para Avaliar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas avaliações pendentes e acompanhe os prazos.
        </Typography>
      </Box>

      {/* Filtros e busca */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar projetos"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="not_started">Não iniciado</MenuItem>
                    <MenuItem value="in_progress">Em andamento</MenuItem>
                    <MenuItem value="completed">Concluído</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="priority-filter-label">Prioridade</InputLabel>
                  <Select
                    labelId="priority-filter-label"
                    value={priorityFilter}
                    label="Prioridade"
                    onChange={handlePriorityFilterChange}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                    <MenuItem value="medium">Média</MenuItem>
                    <MenuItem value="low">Baixa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="area-filter-label">Área Cultural</InputLabel>
                  <Select
                    labelId="area-filter-label"
                    value={areaFilter}
                    label="Área Cultural"
                    onChange={handleAreaFilterChange}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    {culturalAreas.map(area => (
                      <MenuItem key={area} value={area}>{area}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumo de avaliações */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total de Projetos</Typography>
                </Box>
                <Typography variant="h3" component="div" color="primary">
                  {projects.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pendentes</Typography>
                </Box>
                <Typography variant="h3" component="div" color="warning.main">
                  {projects.filter(p => p.status !== 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentTurnedInIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Concluídos</Typography>
                </Box>
                <Typography variant="h3" component="div" color="success.main">
                  {projects.filter(p => p.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Lista de projetos */}
      {filteredProjects.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum projeto encontrado com os filtros selecionados.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentProjects.map((project) => (
              <Grid item xs={12} sm={6} key={project.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={getPriorityText(project.priority)} 
                        color={getPriorityColor(project.priority)}
                        size="small"
                      />
                      <Chip 
                        label={getStatusText(project.status)} 
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {project.applicationTitle}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Proponente:</strong> {project.applicantName}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Edital:</strong> {project.noticeTitle}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Área:</strong> {project.culturalArea}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Submetido em: {new Date(project.submissionDate).toLocaleDateString('pt-BR')}
                      </Typography>
                      
                      <Chip 
                        label={`${getDaysRemaining(project.deadline)} dias restantes`}
                        color={getDaysRemaining(project.deadline) < 5 ? "error" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {project.status === 'not_started' ? (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleStartEvaluation(project.id)}
                      >
                        Iniciar Avaliação
                      </Button>
                    ) : project.status === 'in_progress' ? (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary"
                        onClick={() => handleContinueEvaluation(project.id)}
                      >
                        Continuar Avaliação
                      </Button>
                    ) : (
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        color="primary"
                        onClick={() => navigate(`/evaluator/evaluation/${project.id}`)}
                      >
                        Ver Avaliação
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Paginação */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProjectsToEvaluatePage; 