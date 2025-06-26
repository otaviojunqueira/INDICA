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
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tab,
  Tabs,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Description as DescriptionIcon,
  VideoLibrary as VideoLibraryIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Download as DownloadIcon,
  HelpOutline as HelpOutlineIcon,
  Assignment as AssignmentIcon,
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Gavel as GavelIcon,
  LibraryBooks as LibraryBooksIcon,
  Forum as ForumIcon
} from '@mui/icons-material';

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
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
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

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'training' | 'faq';
  url: string;
  thumbnailUrl?: string;
  tags: string[];
  isFavorite: boolean;
  dateAdded: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const ResourcesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // Simular chamada à API com um atraso
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados simulados - em um ambiente real, viria da API
        const mockResources: Resource[] = [
          {
            id: '1',
            title: 'Manual do Avaliador',
            description: 'Guia completo com diretrizes e critérios para avaliação de projetos culturais.',
            type: 'document',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/150x200',
            tags: ['manual', 'avaliação', 'critérios'],
            isFavorite: true,
            dateAdded: '2023-01-15'
          },
          {
            id: '2',
            title: 'Critérios de Pontuação',
            description: 'Documento detalhando os critérios de pontuação para cada tipo de projeto cultural.',
            type: 'document',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/150x200',
            tags: ['pontuação', 'critérios', 'avaliação'],
            isFavorite: false,
            dateAdded: '2023-01-20'
          },
          {
            id: '3',
            title: 'Tutorial: Como avaliar projetos no INDICA',
            description: 'Vídeo tutorial sobre o processo de avaliação de projetos na plataforma INDICA.',
            type: 'video',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            tags: ['tutorial', 'vídeo', 'plataforma'],
            isFavorite: true,
            dateAdded: '2023-02-05'
          },
          {
            id: '4',
            title: 'Guia de Boas Práticas na Avaliação',
            description: 'Orientações sobre ética e boas práticas no processo de avaliação de projetos culturais.',
            type: 'guide',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/150x200',
            tags: ['ética', 'boas práticas', 'orientações'],
            isFavorite: false,
            dateAdded: '2023-02-12'
          },
          {
            id: '5',
            title: 'Treinamento: Avaliação de Projetos Audiovisuais',
            description: 'Curso específico sobre avaliação de projetos no setor audiovisual.',
            type: 'training',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            tags: ['treinamento', 'audiovisual', 'curso'],
            isFavorite: false,
            dateAdded: '2023-02-20'
          },
          {
            id: '6',
            title: 'Perguntas Frequentes sobre Avaliação',
            description: 'Documento com respostas para as dúvidas mais comuns sobre o processo de avaliação.',
            type: 'faq',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/150x200',
            tags: ['faq', 'dúvidas', 'perguntas'],
            isFavorite: true,
            dateAdded: '2023-03-01'
          },
          {
            id: '7',
            title: 'Legislação Cultural Aplicada',
            description: 'Compilado de leis e normas relevantes para avaliação de projetos culturais.',
            type: 'document',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/150x200',
            tags: ['legislação', 'leis', 'normas'],
            isFavorite: false,
            dateAdded: '2023-03-10'
          },
          {
            id: '8',
            title: 'Webinar: Avaliação de Impacto Cultural',
            description: 'Vídeo do webinar sobre metodologias de avaliação de impacto cultural de projetos.',
            type: 'video',
            url: '#',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            tags: ['webinar', 'impacto cultural', 'metodologias'],
            isFavorite: false,
            dateAdded: '2023-03-15'
          }
        ];
        
        const mockFaqs: FAQ[] = [
          {
            id: '1',
            question: 'Como devo proceder se identificar um conflito de interesse em uma avaliação?',
            answer: 'Se você identificar qualquer conflito de interesse (relação pessoal ou profissional com o proponente, participação no projeto, etc.), deve imediatamente declarar-se impedido através do sistema, clicando no botão "Declarar Impedimento" na página de detalhes da avaliação. O sistema automaticamente designará outro avaliador para o projeto.',
            category: 'Ética'
          },
          {
            id: '2',
            question: 'Qual o prazo médio para concluir uma avaliação?',
            answer: 'O prazo padrão é de 10 dias úteis a partir da atribuição do projeto. Projetos mais complexos podem ter prazos estendidos, que serão indicados na atribuição. É importante respeitar os prazos para não atrasar o cronograma geral do edital.',
            category: 'Prazos'
          },
          {
            id: '3',
            question: 'Como devo avaliar um projeto que está incompleto ou com documentação insuficiente?',
            answer: 'Projetos com documentação insuficiente devem ser avaliados com base nas informações disponíveis. Se a falta de documentação impedir a análise adequada de critérios específicos, você deve indicar isso nos comentários da avaliação e atribuir pontuação zero nos itens que não podem ser avaliados devido à falta de informação.',
            category: 'Procedimentos'
          },
          {
            id: '4',
            question: 'Posso solicitar informações adicionais ao proponente durante a avaliação?',
            answer: 'Não. Durante o período de avaliação, não é permitido o contato direto com proponentes. Se você precisar de esclarecimentos essenciais para a avaliação, deve utilizar a função "Solicitar Esclarecimento" no sistema, que será intermediada pela equipe gestora do edital.',
            category: 'Comunicação'
          },
          {
            id: '5',
            question: 'Como devo proceder se discordar da avaliação de outro parecerista no mesmo projeto?',
            answer: 'Em casos de avaliação colegiada, divergências são normais e saudáveis. Utilize o espaço de discussão disponível no sistema para argumentar tecnicamente seu ponto de vista. É importante manter o foco nos critérios objetivos de avaliação e evitar críticas pessoais.',
            category: 'Procedimentos'
          },
          {
            id: '6',
            question: 'O que fazer se um proponente tentar me contatar diretamente sobre sua avaliação?',
            answer: 'Qualquer tentativa de contato direto por parte de proponentes deve ser reportada imediatamente à coordenação do edital através do sistema. Não responda ao contato e preserve qualquer evidência recebida (e-mails, mensagens, etc.).',
            category: 'Ética'
          },
          {
            id: '7',
            question: 'Como justificar adequadamente uma nota baixa em um critério de avaliação?',
            answer: 'A justificativa deve ser técnica, objetiva e específica, apontando exatamente quais aspectos do projeto não atendem aos requisitos do critério. Evite comentários vagos como "projeto fraco" ou "proposta insuficiente". Sempre relacione sua análise aos parâmetros estabelecidos no edital.',
            category: 'Procedimentos'
          },
          {
            id: '8',
            question: 'É possível revisar minha avaliação após o envio?',
            answer: 'Após o envio final, a avaliação não pode ser alterada pelo próprio parecerista. Em casos excepcionais, se você identificar um erro material significativo, deve contatar a coordenação do edital em até 24 horas após o envio, justificando a necessidade de revisão.',
            category: 'Procedimentos'
          }
        ];
        
        setResources(mockResources);
        setFilteredResources(mockResources);
        setFaqs(mockFaqs);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar recursos:', err);
        setError('Não foi possível carregar os recursos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Aplicar filtros quando mudar
  useEffect(() => {
    let result = [...resources];
    
    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Aplicar filtro de tipo
    if (selectedType !== 'all') {
      result = result.filter(resource => resource.type === selectedType);
    }
    
    setFilteredResources(result);
  }, [searchTerm, selectedType, resources]);

  // Manipuladores de eventos para filtros
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Função para alternar favorito
  const handleToggleFavorite = (id: string) => {
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === id 
          ? { ...resource, isFavorite: !resource.isFavorite } 
          : resource
      )
    );
  };

  // Função para obter ícone baseado no tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <DescriptionIcon />;
      case 'video': return <VideoLibraryIcon />;
      case 'guide': return <MenuBookIcon />;
      case 'training': return <SchoolIcon />;
      case 'faq': return <HelpOutlineIcon />;
      default: return <DescriptionIcon />;
    }
  };

  // Função para obter texto do tipo
  const getTypeText = (type: string): string => {
    switch (type) {
      case 'document': return "Documento";
      case 'video': return "Vídeo";
      case 'guide': return "Guia";
      case 'training': return "Treinamento";
      case 'faq': return "FAQ";
      default: return type;
    }
  };

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
          Recursos para Avaliadores
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Acesse documentos, vídeos e guias para auxiliar no processo de avaliação de projetos.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="recursos do avaliador">
          <Tab label="Biblioteca" icon={<LibraryBooksIcon />} iconPosition="start" />
          <Tab label="Perguntas Frequentes" icon={<HelpOutlineIcon />} iconPosition="start" />
          <Tab label="Fórum de Avaliadores" icon={<ForumIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Biblioteca de recursos */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar recursos"
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
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button 
                  variant={selectedType === 'all' ? 'contained' : 'outlined'}
                  onClick={() => handleTypeFilter('all')}
                  size="small"
                >
                  Todos
                </Button>
                <Button 
                  variant={selectedType === 'document' ? 'contained' : 'outlined'}
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleTypeFilter('document')}
                  size="small"
                >
                  Documentos
                </Button>
                <Button 
                  variant={selectedType === 'video' ? 'contained' : 'outlined'}
                  startIcon={<VideoLibraryIcon />}
                  onClick={() => handleTypeFilter('video')}
                  size="small"
                >
                  Vídeos
                </Button>
                <Button 
                  variant={selectedType === 'guide' ? 'contained' : 'outlined'}
                  startIcon={<MenuBookIcon />}
                  onClick={() => handleTypeFilter('guide')}
                  size="small"
                >
                  Guias
                </Button>
                <Button 
                  variant={selectedType === 'training' ? 'contained' : 'outlined'}
                  startIcon={<SchoolIcon />}
                  onClick={() => handleTypeFilter('training')}
                  size="small"
                >
                  Treinamentos
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {filteredResources.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum recurso encontrado com os filtros selecionados.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  {resource.thumbnailUrl && (
                    <CardMedia
                      component="img"
                      height={resource.type === 'video' ? '140' : '100'}
                      image={resource.thumbnailUrl}
                      alt={resource.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip 
                        icon={getTypeIcon(resource.type)}
                        label={getTypeText(resource.type)} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleFavorite(resource.id)}
                        color={resource.isFavorite ? "warning" : "default"}
                      >
                        {resource.isFavorite ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {resource.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {resource.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<DownloadIcon />}
                      component={Link}
                      href={resource.url}
                      target="_blank"
                      fullWidth
                    >
                      Acessar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Perguntas Frequentes */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Buscar nas perguntas frequentes"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          {faqs.map((faq) => (
            <Accordion key={faq.id} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-${faq.id}-content`}
                id={`faq-${faq.id}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{faq.question}</Typography>
                  <Chip 
                    label={faq.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ ml: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Fórum de Avaliadores - Simulação */}
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <GavelIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Fórum de Avaliadores
          </Typography>
          <Typography variant="body1" paragraph>
            Este é um espaço reservado para discussões técnicas entre avaliadores.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            O acesso ao fórum requer autenticação específica para avaliadores.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<ForumIcon />}
          >
            Acessar Fórum
          </Button>
        </Paper>
      </TabPanel>

      {/* Recursos em destaque */}
      {tabValue === 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BookmarkIcon sx={{ mr: 1 }} color="primary" />
            Recursos em Destaque
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <List>
            {resources.filter(r => r.isFavorite).map((resource) => (
              <ListItem 
                key={resource.id}
                sx={{ 
                  mb: 1, 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <ListItemIcon>
                  {getTypeIcon(resource.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={resource.title} 
                  secondary={resource.description}
                />
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<DownloadIcon />}
                  href={resource.url}
                  target="_blank"
                >
                  Acessar
                </Button>
              </ListItem>
            ))}
            {resources.filter(r => r.isFavorite).length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Você não tem recursos favoritos. Marque recursos como favoritos clicando no ícone de estrela.
              </Typography>
            )}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default ResourcesPage;