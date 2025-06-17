import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { noticeService, applicationService } from '../../services/api';
import DownloadIcon from '@mui/icons-material/Download';

// Interface para estatísticas gerais
interface GeneralStats {
  totalNotices: number;
  totalApplications: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  totalAmount: number;
  allocatedAmount: number;
}

// Interface para estatísticas por edital
interface NoticeStats {
  _id: string;
  title: string;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalAmount: number;
  requestedAmount: number;
  allocatedAmount: number;
}

// Interface para dados de categoria
interface CategoryData {
  name: string;
  value: number;
}

// Interface para dados de avaliação
interface EvaluationData {
  projectName: string;
  score: number;
  status: string;
}

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ReportsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para dados
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<string>('');
  const [noticeStats, setNoticeStats] = useState<NoticeStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [evaluationData, setEvaluationData] = useState<EvaluationData[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  
  // Carregar dados iniciais
  useEffect(() => {
    fetchGeneralStats();
    fetchNoticesList();
  }, []);
  
  // Carregar estatísticas gerais
  const fetchGeneralStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Aqui seria uma chamada à API para buscar estatísticas gerais
      // Por enquanto, vamos simular com dados estáticos
      setTimeout(() => {
        setGeneralStats({
          totalNotices: 12,
          totalApplications: 248,
          totalApproved: 87,
          totalRejected: 124,
          totalPending: 37,
          totalAmount: 2500000,
          allocatedAmount: 1250000
        });
        
        // Dados mensais simulados
        setMonthlyData([
          { name: 'Jan', applications: 18, approved: 7, rejected: 9 },
          { name: 'Fev', applications: 22, approved: 8, rejected: 12 },
          { name: 'Mar', applications: 30, approved: 12, rejected: 15 },
          { name: 'Abr', applications: 25, approved: 9, rejected: 14 },
          { name: 'Mai', applications: 35, approved: 14, rejected: 18 },
          { name: 'Jun', applications: 42, approved: 15, rejected: 22 },
          { name: 'Jul', applications: 28, approved: 10, rejected: 12 },
          { name: 'Ago', applications: 15, approved: 5, rejected: 8 },
          { name: 'Set', applications: 20, approved: 7, rejected: 10 },
          { name: 'Out', applications: 13, approved: 0, rejected: 4 },
          { name: 'Nov', applications: 0, approved: 0, rejected: 0 },
          { name: 'Dez', applications: 0, approved: 0, rejected: 0 }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas gerais:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao carregar os dados');
      setLoading(false);
    }
  };
  
  // Carregar lista de editais
  const fetchNoticesList = async () => {
    try {
      // Aqui seria uma chamada à API para buscar a lista de editais
      // Por enquanto, vamos simular com dados estáticos
      setTimeout(() => {
        setNoticesList([
          { _id: '1', title: 'Edital de Apoio a Festivais Culturais 2023' },
          { _id: '2', title: 'Prêmio de Reconhecimento Cultural 2023' },
          { _id: '3', title: 'Edital de Fomento à Produção Audiovisual' },
          { _id: '4', title: 'Edital de Ocupação de Espaços Culturais' }
        ]);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao carregar lista de editais:', err);
    }
  };
  
  // Carregar estatísticas de um edital específico
  const fetchNoticeStats = async (noticeId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Aqui seria uma chamada à API para buscar estatísticas do edital
      // Por enquanto, vamos simular com dados estáticos
      setTimeout(() => {
        const noticeData = {
          _id: noticeId,
          title: noticesList.find(n => n._id === noticeId)?.title || '',
          totalApplications: 65,
          approvedApplications: 22,
          rejectedApplications: 38,
          pendingApplications: 5,
          totalAmount: 500000,
          requestedAmount: 720000,
          allocatedAmount: 320000
        };
        
        setNoticeStats(noticeData);
        
        // Dados de categoria simulados
        setCategoryData([
          { name: 'Música', value: 18 },
          { name: 'Teatro', value: 12 },
          { name: 'Dança', value: 8 },
          { name: 'Artes Visuais', value: 10 },
          { name: 'Literatura', value: 7 },
          { name: 'Audiovisual', value: 10 }
        ]);
        
        // Dados de avaliação simulados
        setEvaluationData([
          { projectName: 'Festival de Jazz', score: 8.7, status: 'approved' },
          { projectName: 'Exposição de Arte Moderna', score: 9.2, status: 'approved' },
          { projectName: 'Oficina de Teatro', score: 7.8, status: 'approved' },
          { projectName: 'Concerto de Música Clássica', score: 8.5, status: 'approved' },
          { projectName: 'Mostra de Cinema Independente', score: 6.5, status: 'rejected' },
          { projectName: 'Sarau Literário', score: 5.8, status: 'rejected' },
          { projectName: 'Festival de Dança', score: 7.2, status: 'approved' },
          { projectName: 'Exposição Fotográfica', score: 6.2, status: 'rejected' },
          { projectName: 'Oficina de Escrita Criativa', score: 7.5, status: 'approved' },
          { projectName: 'Festival de Cultura Popular', score: 8.9, status: 'approved' }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas do edital:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao carregar os dados');
      setLoading(false);
    }
  };
  
  // Manipular mudança de aba
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  // Manipular seleção de edital
  const handleNoticeChange = (event: any) => {
    const noticeId = event.target.value;
    setSelectedNotice(noticeId);
    
    if (noticeId) {
      fetchNoticeStats(noticeId);
    } else {
      setNoticeStats(null);
      setCategoryData([]);
      setEvaluationData([]);
    }
  };
  
  // Função para exportar dados (simulada)
  const handleExportData = () => {
    alert('Função de exportação de dados será implementada aqui.');
  };
  
  // Renderizar conteúdo da aba de visão geral
  const renderOverviewTab = () => {
    if (!generalStats) return null;
    
    return (
      <>
        {/* Cards com estatísticas principais */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total de Editais
                </Typography>
                <Typography variant="h4" component="div">
                  {generalStats.totalNotices}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total de Inscrições
                </Typography>
                <Typography variant="h4" component="div">
                  {generalStats.totalApplications}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Valor Total Disponibilizado
                </Typography>
                <Typography variant="h4" component="div">
                  R$ {(generalStats.totalAmount / 1000000).toFixed(1)}M
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Valor Total Alocado
                </Typography>
                <Typography variant="h4" component="div">
                  R$ {(generalStats.allocatedAmount / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((generalStats.allocatedAmount / generalStats.totalAmount) * 100)}% do total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Gráfico de status das inscrições */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Status das Inscrições
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Aprovadas', value: generalStats.totalApproved },
                      { name: 'Rejeitadas', value: generalStats.totalRejected },
                      { name: 'Pendentes', value: generalStats.totalPending }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Aprovadas', value: generalStats.totalApproved },
                      { name: 'Rejeitadas', value: generalStats.totalRejected },
                      { name: 'Pendentes', value: generalStats.totalPending }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Aprovadas:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {generalStats.totalApproved} ({Math.round((generalStats.totalApproved / generalStats.totalApplications) * 100)}%)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Rejeitadas:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {generalStats.totalRejected} ({Math.round((generalStats.totalRejected / generalStats.totalApplications) * 100)}%)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Pendentes:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {generalStats.totalPending} ({Math.round((generalStats.totalPending / generalStats.totalApplications) * 100)}%)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="body1">Total:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {generalStats.totalApplications} (100%)
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Gráfico de inscrições por mês */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Inscrições por Mês
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" name="Total de Inscrições" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="approved" name="Aprovadas" stroke="#82ca9d" />
              <Line type="monotone" dataKey="rejected" name="Rejeitadas" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </>
    );
  };
  
  // Renderizar conteúdo da aba de edital específico
  const renderNoticeTab = () => {
    return (
      <>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Selecione um Edital</InputLabel>
          <Select
            value={selectedNotice}
            onChange={handleNoticeChange}
            label="Selecione um Edital"
          >
            <MenuItem value="">
              <em>Selecione um edital</em>
            </MenuItem>
            {noticesList.map((notice) => (
              <MenuItem key={notice._id} value={notice._id}>
                {notice.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {noticeStats && !loading && (
          <>
            {/* Cards com estatísticas do edital */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total de Inscrições
                    </Typography>
                    <Typography variant="h4" component="div">
                      {noticeStats.totalApplications}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Aprovadas
                    </Typography>
                    <Typography variant="h4" component="div" color="success.main">
                      {noticeStats.approvedApplications}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((noticeStats.approvedApplications / noticeStats.totalApplications) * 100)}% do total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Valor Total
                    </Typography>
                    <Typography variant="h4" component="div">
                      R$ {(noticeStats.totalAmount / 1000).toFixed(0)}K
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Valor Alocado
                    </Typography>
                    <Typography variant="h4" component="div">
                      R$ {(noticeStats.allocatedAmount / 1000).toFixed(0)}K
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((noticeStats.allocatedAmount / noticeStats.totalAmount) * 100)}% do total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Gráficos */}
            <Grid container spacing={4}>
              {/* Gráfico de categorias */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Inscrições por Categoria
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              {/* Gráfico de pontuações */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Pontuações das Inscrições
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={evaluationData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="projectName" tick={false} />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="score" 
                        name="Pontuação" 
                        fill="#8884d8"
                        minPointSize={2}
                        label={{ position: 'top' }}
                      >
                        {evaluationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.status === 'approved' ? '#00C49F' : '#FF8042'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Tabela de projetos */}
            <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Lista de Projetos
                </Typography>
                
                <Button 
                  variant="outlined" 
                  startIcon={<DownloadIcon />}
                  onClick={handleExportData}
                >
                  Exportar
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome do Projeto</TableCell>
                      <TableCell align="center">Pontuação</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evaluationData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.projectName}
                        </TableCell>
                        <TableCell align="center">{row.score.toFixed(1)}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={row.status === 'approved' ? 'Aprovado' : 'Rejeitado'} 
                            color={row.status === 'approved' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
        
        {!selectedNotice && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Selecione um edital para visualizar suas estatísticas
            </Typography>
          </Box>
        )}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatórios e Estatísticas
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="relatórios tabs">
          <Tab label="Visão Geral" />
          <Tab label="Por Edital" />
        </Tabs>
      </Box>
      
      {loading && tabIndex === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && tabIndex === 0 && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {tabIndex === 0 && !loading && renderOverviewTab()}
      {tabIndex === 1 && renderNoticeTab()}
    </Container>
  );
};

export default ReportsPage; 