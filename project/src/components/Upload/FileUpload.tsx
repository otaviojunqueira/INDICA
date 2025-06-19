import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { styled } from '@mui/material/styles';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string;
  multiple?: boolean;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 5,
  maxSize = 5,
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  multiple = true
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

        setError(null);
    
    // Verificar quantidade máxima de arquivos
    if (files.length + fileList.length > maxFiles) {
      setError(`Você pode enviar no máximo ${maxFiles} arquivo(s).`);
      return;
    }

    const newFiles: File[] = [];
    
    // Processar cada arquivo
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Verificar tamanho do arquivo
      if (file.size > maxSize * 1024 * 1024) {
        setError(`O arquivo "${file.name}" excede o tamanho máximo de ${maxSize}MB.`);
        continue;
      }
      
      // Verificar se já existe um arquivo com mesmo nome
      if (files.some(f => f.name === file.name)) {
        setError(`Um arquivo chamado "${file.name}" já foi selecionado.`);
        continue;
      }
      
      newFiles.push(file);
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
    }
    
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        border: '2px dashed #ccc', 
        borderRadius: 2, 
        p: 4, 
        mb: 2, 
          textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple={multiple}
        />
        
        <CloudUploadIcon sx={{ fontSize: 60, mb: 1, color: 'primary.main' }} />
        
        <Typography variant="h6" gutterBottom>
          Arraste e solte seus arquivos aqui
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          ou
        </Typography>
        
        <Button
          component="label"
          variant="contained"
          disabled={files.length >= maxFiles || uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : null}
        >
          Selecionar Arquivo{multiple ? 's' : ''}
          <VisuallyHiddenInput 
            type="file" 
            accept={acceptedTypes}
            onChange={handleFileChange}
            multiple={multiple}
          />
        </Button>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Formatos aceitos: {acceptedTypes.replace(/\./g, '').replace(/,/g, ', ')}
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          Tamanho máximo: {maxSize}MB
        </Typography>
        </Box>
      
      {files.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List>
            <ListItem>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Arquivos Selecionados ({files.length}/{maxFiles})
              </Typography>
            </ListItem>
            <Divider />
            
            {files.map((file, index) => (
              <React.Fragment key={index}>
            <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
              <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{
                      style: { 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                  <CheckCircleIcon color="success" sx={{ ml: 1 }} />
            </ListItem>
                {index < files.length - 1 && <Divider />}
              </React.Fragment>
          ))}
        </List>
        </Paper>
      )}
      
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        * Certifique-se de que todos os documentos estejam legíveis e no formato correto.
      </Typography>
    </Box>
  );
}; 