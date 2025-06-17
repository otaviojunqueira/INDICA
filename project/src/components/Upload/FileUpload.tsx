import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { UPLOAD_MAX_SIZE, ALLOWED_FILE_TYPES } from '../../config';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  onDelete?: (fileUrl: string) => Promise<void>;
  maxFiles?: number;
  accept?: string[];
  uploadedFiles?: Array<{
    url: string;
    filename: string;
  }>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onDelete,
  maxFiles = 1,
  accept = ALLOWED_FILE_TYPES,
  uploadedFiles = []
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError(null);
        setUploading(true);
        setProgress(0);

        // Validar número máximo de arquivos
        if (acceptedFiles.length + uploadedFiles.length > maxFiles) {
          throw new Error(`Número máximo de arquivos permitido: ${maxFiles}`);
        }

        // Validar tamanho dos arquivos
        for (const file of acceptedFiles) {
          if (file.size > UPLOAD_MAX_SIZE) {
            throw new Error(
              `O arquivo ${file.name} é muito grande. Tamanho máximo: ${
                UPLOAD_MAX_SIZE / 1024 / 1024
              }MB`
            );
          }
        }

        // Simular progresso do upload
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        // Realizar upload
        await onUpload(acceptedFiles);

        // Finalizar progresso
        clearInterval(interval);
        setProgress(100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [maxFiles, onUpload, uploadedFiles.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles,
    disabled: uploading
  });

  const handleDelete = async (fileUrl: string) => {
    try {
      setError(null);
      if (onDelete) {
        await onDelete(fileUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir arquivo');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider'
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Solte os arquivos aqui'
            : 'Arraste e solte arquivos aqui ou clique para selecionar'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tipos permitidos: {accept.join(', ')}
          <br />
          Tamanho máximo: {UPLOAD_MAX_SIZE / 1024 / 1024}MB
          <br />
          Máximo de arquivos: {maxFiles}
        </Typography>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <List sx={{ mt: 2 }}>
          {uploadedFiles.map((file) => (
            <ListItem
              key={file.url}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1
              }}
            >
              <FileIcon sx={{ mr: 2 }} />
              <ListItemText
                primary={file.filename}
                secondary={
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit' }}
                  >
                    Visualizar arquivo
                  </a>
                }
              />
              {onDelete && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(file.url)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}; 