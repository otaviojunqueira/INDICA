import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  DateRange as DateRangeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface EvaluationHistory {
  id: string;
  applicationId: string;
  applicationTitle: string;
  applicantName: string;
  noticeTitle: string;
  evaluationDate: string;
  completionDate: string;
  score: number;
  result: 'approved' | 'rejected' | 'pending_adjustment';
  culturalArea: string;
  comments: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<EvaluationHistory[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

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
    const fetchEvaluationHistory = async () => {
      try {
        setLoading(true);
        // Simular chamada à API com um atraso
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados simulados - em um ambiente real, viria da API
        const mockEvaluations: EvaluationHistory[] = [
          {
            id: '1',
            applicationId: '101',
            applicationTitle: 'Festival de Música Independente',
            applicantName: 'João Silva',
            noticeTitle: 'Edital de Fomento à Música',
            evaluationDate: '2023-03-10',
            completionDate: '2023-03-15',
            score: 85,
            result: 'approved',
            culturalArea: 'Música',
            comments: 'Projeto com boa estruturação e relevância cultural significativa.'
          },
          {
            id: '2',
            applicationId: '102',
            applicationTitle: 'Exposição de Arte Contemporânea',
            applicantName: 'Maria Oliveira',
            noticeTitle: 'Edital de Artes Visuais',
            evaluationDate: '2023-03-12',
            completionDate: '2023-03-18',
            score: 92,
            result: 'approved',
            culturalArea: 'Artes Visuais',
            comments: 'Proposta inovadora com forte impacto cultural e social.'
          },
          {
            id: '3',
            applicationId: '103',
            applicationTitle: 'Oficina de Teatro para Jovens',
            applicantName: 'Carlos Santos',
            noticeTitle: 'Edital de Formação Cultural',
            evaluationDate: '2023-03-15',
            completionDate: '2023-03-20',
            score: 78,
            result: 'pending_adjustment',
            culturalArea: 'Teatro',
            comments: 'Projeto interessante, mas necessita ajustes no cronograma e orçamento.'
          },
          {
            id: '4',
            applicationId: '104',
            applicationTitle: 'Documentário sobre Cultura Popular',
            applicantName: 'Ana Ferreira',
            noticeTitle: 'Edital de Audiovisual',
            evaluationDate: '2023-03-18',
            completionDate: '2023-03-25',
            score: 65,
            result: 'rejected',
            culturalArea: 'Audiovisual',
            comments: 'Proposta com falhas metodológicas e orçamento incompatível.'
          },
          {
            id: '5',
            applicationId: '105',
            applicationTitle: 'Festival de Dança Contemporânea',
            applicantName: 'Pedro Almeida',
            noticeTitle: 'Edital de Fomento à Dança',
            evaluationDate: '2023-03-20',
            completionDate: '2023-03-28',
            score: 88,
            result: 'approved',
            culturalArea: 'Dança',
            comments: 'Excelente proposta com forte potencial de impacto cultural.'
          },
          {
            id: '6',
            applicationId: '106',
            applicationTitle: 'Sarau Literário',
            applicantName: 'Fernanda Lima',
            noticeTitle: 'Edital de Literatura',
            evaluationDate: '2023-03-22',
            completionDate: '2023-03-30',
            score: 75,
            result: 'pending_adjustment',
            culturalArea: 'Literatura',
            comments: 'Projeto promissor, mas necessita melhor detalhamento da metodologia.'
          },
          {
            id: '7',
            applicationId: '107',
            applicationTitle: 'Restauração de Patrimônio Histórico',
            applicantName: 'Roberto Mendes',
            noticeTitle: 'Edital de Patrimônio Cultural',
            evaluationDate: '2023-03-25',
            completionDate: '2023-04-02',
            score: 95,
            result: 'approved',
            culturalArea: 'Patrimônio',
            comments: 'Projeto excepcional com metodologia sólida e grande relevância histórica.'
          },
          {
            id: '8',
            applicationId: '108',
            applicationTitle: 'Feira de Artesanato Regional',
            applicantName: 'Lúcia Soares',
            noticeTitle: 'Edital de Economia Criativa',
            evaluationDate: '2023-03-28',
            completionDate: '2023-04-05',
            score: 60,
            result: 'rejected',
            culturalArea: 'Artesanato',
            comments: 'Proposta com inconsistências técnicas e viabilidade questionável.'
          },
          {
            id: '9',
            applicationId: '109',
            applicationTitle: 'Festival de Cultura Popular',
            applicantName: 'Marcos Oliveira',
            noticeTitle: 'Edital de Culturas Tradicionais',
            evaluationDate: '2023-04-01',
            completionDate: '2023-04-08',
            score: 87,
            result: 'approved',
            culturalArea: 'Cultura Popular',
            comments: 'Projeto bem estruturado com forte valorização das tradições locais.'
          },
          {
            id: '10',
            applicationId: '110',
            applicationTitle: 'Concerto de Música Clássica',
            applicantName: 'Juliana Costa',
            noticeTitle: 'Edital de Fomento à Música',
            evaluationDate: '2023-04-05',
            completionDate: '2023-04-12',
            score: 90,
            result: 'approved',
            culturalArea: 'Música',
            comments: 'Excelente proposta com programação diversificada e bem fundamentada.'
          },
          {
            id: '11',
            applicationId: '111',
            applicationTitle: 'Exposição Fotográfica',
            applicantName: 'Ricardo Martins',
            noticeTitle: 'Edital de Artes Visuais',
            evaluationDate: '2023-04-08',
            completionDate: '2023-04-15',
            score: 82,
            result: 'approved',
            culturalArea: 'Artes Visuais',
            comments: 'Projeto com abordagem inovadora e boa fundamentação técnica.'
          },
          {
            id: '12',
            applicationId: '112',
            applicationTitle: 'Peça Teatral Experimental',
            applicantName: 'Camila Souza',
            noticeTitle: 'Edital de Teatro',
            evaluationDate: '2023-04-10',
            completionDate: '2023-04-18',
            score: 70,
            result: 'pending_adjustment',
            culturalArea: 'Teatro',
            comments: 'Proposta criativa, mas necessita ajustes na metodologia e cronograma.'
          }
        ];
        
        setEvaluations(mockEvaluations);
        setFilteredEvaluations(mockEvaluations);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar histórico de avaliações:', err);
        setError('Não foi possível carregar o histórico de avaliações. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationHistory();
  }, []);

  // Aplicar filtros quando mudar
  useEffect(() => {
    let result = [...evaluations];
    
    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(evaluation => 
        evaluation.applicationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de resultado
    if (resultFilter !== 'all') {
      result = result.filter(evaluation => evaluation.result === resultFilter);
    }
    
    // Aplicar filtro de área cultural
    if (areaFilter !== 'all') {
      result = result.filter(evaluation => evaluation.culturalArea === areaFilter);
    }
    
    // Aplicar filtro de data
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'last_week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'last_month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case 'last_3_months':
          filterDate.setMonth(today.getMonth() - 3);
          break;
        case 'last_6_months':
          filterDate.setMonth(today.getMonth() - 6);
          break;
        default:
          break;
      }
      
      result = result.filter(evaluation => {
        const completionDate = new Date(evaluation.completionDate);
        return completionDate >= filterDate;
      });
    }
    
    setFilteredEvaluations(result);
    setPage(0); // Resetar para a primeira página quando filtrar
  }, [searchTerm, resultFilter, areaFilter, dateFilter, evaluations]);

  // Manipuladores de eventos para filtros
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleResultFilterChange = (event: SelectChangeEvent) => {
    setResultFilter(event.target.value);
  };

  const handleAreaFilterChange = (event: SelectChangeEvent) => {
    setAreaFilter(event.target.value);
  };

  const handleDateFilterChange = (event: SelectChangeEvent) => {
    setDateFilter(event.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Função para ver detalhes da avaliação
  const handleViewEvaluation = (evaluationId: string) => {
    navigate(`/evaluator/evaluation/${evaluationId}`);
  };

  // Função para baixar relatório da avaliação (simulado)
  const handleDownloadReport = (evaluationId: string) => {
    // Em um ambiente real, isso faria uma chamada à API para gerar e baixar o relatório
    alert(`Relatório da avaliação ${evaluationId} sendo gerado para download...`);
  };

  // Função para obter cor baseada no resultado
  const getResultColor = (result: string): "success" | "error" | "warning" => {
    switch (result) {
      case 'approved': return "success";
      case 'rejected': return "error";
      case 'pending_adjustment': return "warning";
      default: return "warning";
    }
  };

  // Função para obter texto do resultado
  const getResultText = (result: string): string => {
    switch (result) {
      case 'approved': return "Aprovado";
      case 'rejected': return "Reprovado";
      case 'pending_adjustment': return "Ajustes Pendentes";
      default: return "Desconhecido";
    }
  };

  // Função para obter ícone baseado no resultado
  const getResultIcon = (result: string) => {
    switch (result) {
      case 'approved': return <ThumbUpIcon />;
      case 'rejected': return <ThumbDownIcon />;
      case 'pending_adjustment': return <AssignmentLateIcon />;
      default: return null;
    }
  };

  // Estatísticas de avaliações
  const totalEvaluations = evaluations.length;
  const approvedEvaluations = evaluations.filter(e => e.result === 'approved').length;
  const rejectedEvaluations = evaluations.filter(e => e.result === 'rejected').length;
  const pendingAdjustmentEvaluations = evaluations.filter(e => e.result === 'pending_adjustment').length;
  
  const approvedPercentage = totalEvaluations > 0 ? Math.round((approvedEvaluations / totalEvaluations) * 100) : 0;
  const rejectedPercentage = totalEvaluations > 0 ? Math.round((rejectedEvaluations / totalEvaluations) * 100) : 0;
  const pendingAdjustmentPercentage = totalEvaluations > 0 ? Math.round((pendingAdjustmentEvaluations / totalEvaluations) * 100) : 0;

  // Calcular média de pontuação
  const averageScore = evaluations.length > 0 
    ? Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length) 
    : 0;

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
          Histórico de Avaliações
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize e gerencie todas as suas avaliações anteriores.
        </Typography>
      </Box>

      {/* Estatísticas de avaliações */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total</Typography>
              </Box>
              <Typography variant="h3" component="div" color="primary">
                {totalEvaluations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avaliações realizadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ThumbUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Aprovados</Typography>
              </Box>
              <Typography variant="h3" component="div" color="success.main">
                {approvedPercentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {approvedEvaluations} projetos aprovados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ThumbDownIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Reprovados</Typography>
              </Box>
              <Typography variant="h3" component="div" color="error.main">
                {rejectedPercentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {rejectedEvaluations} projetos reprovados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.default', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BarChartIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Média</Typography>
              </Box>
              <Typography variant="h3" component="div" color="info.main">
                {averageScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pontuação média
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros e busca */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar avaliações"
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
                  <InputLabel id="result-filter-label">Resultado</InputLabel>
                  <Select
                    labelId="result-filter-label"
                    value={resultFilter}
                    label="Resultado"
                    onChange={handleResultFilterChange}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="approved">Aprovados</MenuItem>
                    <MenuItem value="rejected">Reprovados</MenuItem>
                    <MenuItem value="pending_adjustment">Ajustes Pendentes</MenuItem>
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
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="date-filter-label">Período</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    value={dateFilter}
                    label="Período"
                    onChange={handleDateFilterChange}
                  >
                    <MenuItem value="all">Todo o período</MenuItem>
                    <MenuItem value="last_week">Última semana</MenuItem>
                    <MenuItem value="last_month">Último mês</MenuItem>
                    <MenuItem value="last_3_months">Últimos 3 meses</MenuItem>
                    <MenuItem value="last_6_months">Últimos 6 meses</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de avaliações */}
      {filteredEvaluations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma avaliação encontrada com os filtros selecionados.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="tabela de histórico de avaliações">
              <TableHead>
                <TableRow>
                  <TableCell>Projeto</TableCell>
                  <TableCell>Proponente</TableCell>
                  <TableCell>Edital</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Pontuação</TableCell>
                  <TableCell align="center">Resultado</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvaluations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((evaluation) => (
                    <TableRow hover key={evaluation.id}>
                      <TableCell component="th" scope="row">
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {evaluation.applicationTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>{evaluation.applicantName}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {evaluation.noticeTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(evaluation.completionDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${evaluation.score}/100`} 
                          color={evaluation.score >= 70 ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={getResultIcon(evaluation.result)}
                          label={getResultText(evaluation.result)} 
                          color={getResultColor(evaluation.result)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Ver detalhes">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewEvaluation(evaluation.id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Baixar relatório">
                          <IconButton 
                            size="small" 
                            color="secondary"
                            onClick={() => handleDownloadReport(evaluation.id)}
                          >
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEvaluations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      )}
    </Container>
  );
};

export default HistoryPage;