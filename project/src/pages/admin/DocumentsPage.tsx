import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface LegalDocument {
  id: string;
  title: string;
  type: 'lei' | 'regulamento' | 'manual' | 'plano';
  description: string;
  fileUrl?: string;
  publishedAt: Date;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Partial<LegalDocument>>({});

  useEffect(() => {
    // TODO: Implementar chamada à API para buscar documentos
    const mockDocuments: LegalDocument[] = [
      {
        id: '1',
        title: 'Lei de Incentivo à Cultura',
        type: 'lei',
        description: 'Lei municipal que estabelece incentivos fiscais para projetos culturais',
        publishedAt: new Date('2022-01-15')
      },
      {
        id: '2',
        title: 'Plano Municipal de Cultura',
        type: 'plano',
        description: 'Documento estratégico para desenvolvimento cultural do município',
        publishedAt: new Date('2021-06-30')
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const handleAddDocument = () => {
    setCurrentDocument({});
    setOpenDialog(true);
  };

  const handleEditDocument = (doc: LegalDocument) => {
    setCurrentDocument(doc);
    setOpenDialog(true);
  };

  const handleSaveDocument = () => {
    // TODO: Implementar lógica de salvar documento
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Documentos Legais e Normativos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Lista de Documentos</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                onClick={handleAddDocument}
              >
                Adicionar Documento
              </Button>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Data de Publicação</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.publishedAt.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell align="right">
                        <Button 
                          color="primary" 
                          startIcon={<Edit />}
                          onClick={() => handleEditDocument(doc)}
                        >
                          Editar
                        </Button>
                        <Button 
                          color="error" 
                          startIcon={<Delete />}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentDocument.id ? 'Editar Documento' : 'Adicionar Documento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Documento"
                value={currentDocument.title || ''}
                onChange={(e) => setCurrentDocument(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={currentDocument.description || ''}
                onChange={(e) => setCurrentDocument(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveDocument}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DocumentsPage; 