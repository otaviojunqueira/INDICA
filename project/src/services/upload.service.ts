import axios from 'axios';
import { getAuthToken } from '../utils/auth';
import { API_URL, UPLOAD_MAX_SIZE, ALLOWED_FILE_TYPES } from '../config';

const API_URL_UPLOADS = `${API_URL}/uploads`;

interface UploadResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

class UploadService {
  private readonly baseUrl = API_URL_UPLOADS;

  // Validar arquivo antes do upload
  validateFile(file: File): string | null {
    // Verificar tamanho
    if (file.size > UPLOAD_MAX_SIZE) {
      return `O arquivo é muito grande. Tamanho máximo permitido: ${UPLOAD_MAX_SIZE / 1024 / 1024}MB`;
    }

    // Verificar tipo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Tipo de arquivo não permitido';
    }

    return null;
  }

  // Upload de arquivo único
  async uploadFile(file: File): Promise<UploadResponse> {
    // Validar arquivo
    const validationError = this.validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload de múltiplos arquivos
  async uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
    // Validar todos os arquivos
    for (const file of files) {
      const validationError = this.validateFile(file);
      if (validationError) {
        throw new Error(`Erro no arquivo ${file.name}: ${validationError}`);
      }
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(`${this.baseUrl}/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Excluir arquivo
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}`, {
        data: { url: fileUrl }
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Tratamento de erros
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Erro ao processar o upload';
      return new Error(message);
    }
    return error;
  }
}

export const uploadService = new UploadService();

export const uploadServiceAgent = {
  // Upload de documento para perfil do agente
  uploadProfileDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    };

    try {
      const response = await axios.post(
        `${API_URL}/agent-profile/documents`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload do documento');
    }
  },

  // Upload de documento para coletivo cultural
  uploadGroupDocument: async (groupId: string, file: File, type: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    };

    try {
      const response = await axios.post(
        `${API_URL}/cultural-groups/${groupId}/documents`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload do documento');
    }
  },

  // Remover documento do perfil do agente
  removeProfileDocument: async (documentId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/agent-profile/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao remover documento');
    }
  },

  // Remover documento do coletivo cultural
  removeGroupDocument: async (groupId: string, documentId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cultural-groups/${groupId}/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao remover documento');
    }
  }
}; 