import React from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from 'yup';

const eventTypes = [
  'Assistencial',
  'Cívico',
  'Comercial',
  'Cultural',
  'Empresarial',
  'Esportivo',
  'Folclórico',
  'Gastronômico',
  'Religioso',
  'Social',
  'Técnico',
  'Outros'
];

const categories = [
  'Artístico/Cultural/Folclórico',
  'Científico ou Técnico',
  'Comercial ou Promocional',
  'Ecoturismo',
  'Esportivo',
  'Gastronômico',
  'Junino',
  'Moda',
  'Religioso',
  'Rural',
  'Social/Cívico/Histórico',
  'Outro'
];

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const validationSchema = yup.object({
  title: yup.string().required('O título é obrigatório'),
  description: yup.string().required('A descrição é obrigatória'),
  startDate: yup.date().required('A data de início é obrigatória'),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'A data de término deve ser posterior à data de início')
    .required('A data de término é obrigatória'),
  city: yup.string().required('A cidade é obrigatória'),
  state: yup.string().required('O estado é obrigatório'),
  eventType: yup.string().required('O tipo de evento é obrigatório'),
  category: yup.string().required('A categoria é obrigatória'),
  address: yup.string(),
  website: yup.string().url('Digite uma URL válida'),
  contactInfo: yup.string(),
  imageUrl: yup.string().url('Digite uma URL válida'),
});

// Interface para os valores do formulário de evento
export interface EventFormValues {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  city: string;
  state: string;
  eventType: string;
  category: string;
  address: string;
  website: string;
  contactInfo: string;
  imageUrl: string;
  status?: string;
}

interface EventFormProps {
  onSubmit: (values: EventFormValues) => void;
  initialValues?: EventFormValues;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialValues }) => {
  const formik = useFormik<EventFormValues>({
    initialValues: initialValues || {
      title: '',
      description: '',
      startDate: null,
      endDate: null,
      city: '',
      state: '',
      eventType: '',
      category: '',
      address: '',
      website: '',
      contactInfo: '',
      imageUrl: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {initialValues ? 'Editar Evento' : 'Cadastrar Novo Evento'}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Título do Evento"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Descrição"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data de Início"
                value={formik.values.startDate}
                onChange={(value) => formik.setFieldValue('startDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && formik.errors.startDate as string,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data de Término"
                value={formik.values.endDate}
                onChange={(value) => formik.setFieldValue('endDate', value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && formik.errors.endDate as string,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="city"
                label="Cidade"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  label="Estado"
                >
                  {estados.map(estado => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Evento</InputLabel>
                <Select
                  name="eventType"
                  value={formik.values.eventType}
                  onChange={formik.handleChange}
                  error={formik.touched.eventType && Boolean(formik.errors.eventType)}
                  label="Tipo de Evento"
                >
                  {eventTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  label="Categoria"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Endereço"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="website"
                label="Website"
                value={formik.values.website}
                onChange={formik.handleChange}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="contactInfo"
                label="Informações de Contato"
                value={formik.values.contactInfo}
                onChange={formik.handleChange}
                error={formik.touched.contactInfo && Boolean(formik.errors.contactInfo)}
                helperText={formik.touched.contactInfo && formik.errors.contactInfo}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="imageUrl"
                label="URL da Imagem"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {initialValues ? 'Atualizar Evento' : 'Cadastrar Evento'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default EventForm;
