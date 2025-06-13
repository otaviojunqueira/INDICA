import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Button, Card, CardContent } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';

// Tipos para os dados do relatório
interface ReportData {
  totalNotices: number;
  totalApplications: number;
  totalUsers: number;
  applicationsByStatus: {
    name: string;
    value: number;
  }[];
  noticesByCategory: {
    name: string;
    value: number;
  }[];
  applicationsByMonth: {
    month: string;
    count: number;
  }[];
}

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [filterDates, setFilterDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('general');
  const [loading, setLoading] = useState(false);

  // Buscar dados do relatório
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports', { 
        params: {
          type: reportType,
          startDate: filterDates.startDate || undefined,
          endDate: filterDates.endDate || undefined
        }
      });
      
      // Se a API ainda não estiver implementada, use dados de exemplo
      if (!response.data) {
        // Dados de exemplo para desenvolvimento
        const mockData: ReportData = {
          totalNotices: 24,
          totalApplications: 156,
          totalUsers: 87,
          applicationsByStatus: [
            { name: 'Submetidas', value: 56 },
            { name: 'Em Análise', value: 32 },
            { name: 'Aprovadas', value: 48 },
            { name: 'Rejeitadas', value: 20 }
          ],
          noticesByCategory: [
            { name: 'Música', value: 8 },
            { name: 'Teatro', value: 5 },
            { name: 'Dança', value: 4 },
            { name: 'Artes Visuais', value: 3 },
            { name: 'Literatura', value: 2 },
            { name: 'Outros', value: 2 }
          ],
          applicationsByMonth: [
            { month: 'Jan', count: 12 },
            { month: 'Fev', count: 18 },
            { month: 'Mar', count: 15 },
            { month: 'Abr', count: 24 },
            { month: 'Mai', count: 30 },
            { month: 'Jun', count: 22 },
            { month: 'Jul', count: 16 },
            { month: 'Ago', count: 19 }
          ]
        };
        setReportData(mockData);
      } else {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
      // Use dados de exemplo em caso de erro
      const mockData: ReportData = {
        totalNotices: 24,
        totalApplications: 156,
        totalUsers: 87,
        applicationsByStatus: [
          { name: 'Submetidas', value: 56 },
          { name: 'Em Análise', value: 32 },
          { name: 'Aprovadas', value: 48 },
          { name: 'Rejeitadas', value: 20 }
        ],
        noticesByCategory: [
          { name: 'Música', value: 8 },
          { name: 'Teatro', value: 5 },
          { name: 'Dança', value: 4 },
          { name: 'Artes Visuais', value: 3 },
          { name: 'Literatura', value: 2 },
          { name: 'Outros', value: 2 }
        ],
        applicationsByMonth: [
          { month: 'Jan', count: 12 },
          { month: 'Fev', count: 18 },
          { month: 'Mar', count: 15 },
          { month: 'Abr', count: 24 },
          { month: 'Mai', count: 30 },
          { month: 'Jun', count: 22 },
          { month: 'Jul', count: 16 },
          { month: 'Ago', count: 19 }
        ]
      };
      setReportData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados iniciais ao carregar a página
  useEffect(() => {
    fetchReportData();
  }, []);

  // Lidar com alterações nos filtros
  const handleFilterChange = () => {
    fetchReportData();
  };

  if (loading) {
    return <Box p={3}><Typography>Carregando relatórios...</Typography></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Relatórios e Estatísticas</Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-type-label">Tipo de Relatório</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                label="Tipo de Relatório"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="general">Geral</MenuItem>
                <MenuItem value="notices">Editais</MenuItem>
                <MenuItem value="applications">Inscrições</MenuItem>
                <MenuItem value="users">Usuários</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Data Inicial"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterDates.startDate}
              onChange={(e) => setFilterDates({...filterDates, startDate: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Data Final"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filterDates.endDate}
              onChange={(e) => setFilterDates({...filterDates, endDate: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleFilterChange}
            >
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {reportData && (
        <>
          {/* Cards de Resumo */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total de Editais
                  </Typography>
                  <Typography variant="h3">{reportData.totalNotices}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total de Inscrições
                  </Typography>
                  <Typography variant="h3">{reportData.totalApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total de Usuários
                  </Typography>
                  <Typography variant="h3">{reportData.totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Gráficos */}
          <Grid container spacing={3}>
            {/* Gráfico de Barras - Inscrições por Mês */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>Inscrições por Mês</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                    data={reportData.applicationsByMonth}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Quantidade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Gráfico de Pizza - Inscrições por Status */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>Inscrições por Status</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={reportData.applicationsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.applicationsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Gráfico de Pizza - Editais por Categoria */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: 400 }}>
                <Typography variant="h6" gutterBottom>Editais por Categoria</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={reportData.noticesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#82ca9d"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.noticesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ReportsPage; 