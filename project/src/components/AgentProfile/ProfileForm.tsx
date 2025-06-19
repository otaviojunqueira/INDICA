import React from 'react';
import { Formik, Form, Field, FormikHelpers, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Typography,
  Divider,
  Switch,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IAgentProfile, IAddress } from '../../types';

// Esquema de validação
const validationSchema = Yup.object().shape({
  // Dados Pessoais
  dateOfBirth: Yup.date()
    .max(new Date(), 'Data de nascimento não pode ser no futuro')
    .required('Data de nascimento é obrigatória'),
  gender: Yup.string().required('Gênero é obrigatório'),
  raceEthnicity: Yup.string().required('Raça/Etnia é obrigatória'),
  education: Yup.string().required('Escolaridade é obrigatória'),

  // Endereço
  address: Yup.object().shape({
    street: Yup.string().required('Rua é obrigatória'),
    number: Yup.string().required('Número é obrigatório'),
    neighborhood: Yup.string().required('Bairro é obrigatório'),
    city: Yup.string().required('Cidade é obrigatória'),
    state: Yup.string().required('Estado é obrigatório'),
    zipCode: Yup.string()
      .matches(/^\d{5}-\d{3}$/, 'CEP inválido')
      .required('CEP é obrigatório')
  }),

  // Dados Socioeconômicos
  monthlyIncome: Yup.number()
    .min(0, 'Renda mensal não pode ser negativa')
    .required('Renda mensal é obrigatória'),
  householdIncome: Yup.number()
    .min(0, 'Renda familiar não pode ser negativa')
    .required('Renda familiar é obrigatória'),
  householdMembers: Yup.number()
    .min(1, 'Número de membros deve ser pelo menos 1')
    .required('Número de membros é obrigatório'),
  occupation: Yup.string().required('Ocupação é obrigatória'),
  workRegime: Yup.string().required('Regime de trabalho é obrigatório'),

  // Dados Culturais
  culturalArea: Yup.array()
    .min(1, 'Selecione pelo menos uma área cultural')
    .required('Área cultural é obrigatória'),
  yearsOfExperience: Yup.number()
    .min(0, 'Anos de experiência não pode ser negativo')
    .required('Anos de experiência é obrigatório'),
  biography: Yup.string()
    .max(2000, 'Biografia deve ter no máximo 2000 caracteres')
    .required('Biografia é obrigatória')
});

interface ProfileFormProps {
  initialValues: Partial<IAgentProfile>;
  onSubmit: (values: Partial<IAgentProfile>) => void;
  isLoading?: boolean;
}

// Tipo para os erros do Formik
interface FormikErrorsWithAddress extends FormikErrors<IAgentProfile> {
  address?: FormikErrors<IAddress>;
}

// Tipo para os touched fields do Formik
interface FormikTouchedWithAddress extends FormikTouched<IAgentProfile> {
  address?: FormikTouched<IAddress>;
}

const culturalAreas = [
  'Artes Visuais',
  'Música',
  'Teatro',
  'Dança',
  'Literatura',
  'Artesanato',
  'Cultura Popular',
  'Audiovisual',
  'Patrimônio Cultural',
  'Outros'
];

const educationLevels = [
  'Ensino Fundamental Incompleto',
  'Ensino Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Ensino Superior Incompleto',
  'Ensino Superior Completo',
  'Pós-graduação',
  'Mestrado',
  'Doutorado'
];

const workRegimes = [
  'CLT',
  'Autônomo',
  'Servidor Público',
  'Empresário',
  'Freelancer',
  'Desempregado',
  'Outro'
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => {
        // Cast dos tipos para o TSC entender a estrutura aninhada
        const formErrors = errors as FormikErrorsWithAddress;
        const formTouched = touched as FormikTouchedWithAddress;
        
        return (
          <Form>
            <Box sx={{ p: 2 }}>
              {/* Dados Pessoais */}
              <Typography variant="h6" gutterBottom>
                Dados Pessoais
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data de Nascimento"
                    value={values.dateOfBirth || null}
                    onChange={(date: Date | null) => setFieldValue('dateOfBirth', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formTouched.dateOfBirth && !!formErrors.dateOfBirth,
                        helperText: formTouched.dateOfBirth && (formErrors.dateOfBirth as string)
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gênero</FormLabel>
                    <RadioGroup
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="masculino" control={<Radio />} label="Masculino" />
                      <FormControlLabel value="feminino" control={<Radio />} label="Feminino" />
                      <FormControlLabel value="outro" control={<Radio />} label="Outro" />
                      <FormControlLabel value="naoInformar" control={<Radio />} label="Prefiro não informar" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="raceEthnicity"
                    label="Raça/Etnia"
                    value={values.raceEthnicity || ''}
                    onChange={handleChange}
                    error={formTouched.raceEthnicity && !!formErrors.raceEthnicity}
                    helperText={formTouched.raceEthnicity && (formErrors.raceEthnicity as string)}
                    select
                  >
                    <MenuItem value="branco">Branco</MenuItem>
                    <MenuItem value="preto">Preto</MenuItem>
                    <MenuItem value="pardo">Pardo</MenuItem>
                    <MenuItem value="amarelo">Amarelo</MenuItem>
                    <MenuItem value="indigena">Indígena</MenuItem>
                    <MenuItem value="naoInformar">Prefiro não informar</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="education"
                    label="Escolaridade"
                    value={values.education || ''}
                    onChange={handleChange}
                    error={formTouched.education && !!formErrors.education}
                    helperText={formTouched.education && (formErrors.education as string)}
                    select
                  >
                    {educationLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Endereço */}
              <Typography variant="h6" gutterBottom>
                Endereço
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="address.street"
                    label="Rua"
                    value={values.address?.street || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.street && !!formErrors.address?.street}
                    helperText={formTouched.address?.street && formErrors.address?.street}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="address.number"
                    label="Número"
                    value={values.address?.number || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.number && !!formErrors.address?.number}
                    helperText={formTouched.address?.number && formErrors.address?.number}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="address.complement"
                    label="Complemento"
                    value={values.address?.complement || ''}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="address.neighborhood"
                    label="Bairro"
                    value={values.address?.neighborhood || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.neighborhood && !!formErrors.address?.neighborhood}
                    helperText={formTouched.address?.neighborhood && formErrors.address?.neighborhood}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="address.city"
                    label="Cidade"
                    value={values.address?.city || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.city && !!formErrors.address?.city}
                    helperText={formTouched.address?.city && formErrors.address?.city}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="address.state"
                    label="Estado"
                    value={values.address?.state || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.state && !!formErrors.address?.state}
                    helperText={formTouched.address?.state && formErrors.address?.state}
                    select
                  >
                    {/* Lista de estados brasileiros */}
                    {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="address.zipCode"
                    label="CEP"
                    value={values.address?.zipCode || ''}
                    onChange={handleChange}
                    error={!!formTouched.address?.zipCode && !!formErrors.address?.zipCode}
                    helperText={formTouched.address?.zipCode && formErrors.address?.zipCode}
                    inputProps={{
                      maxLength: 9,
                      placeholder: '00000-000'
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Dados Socioeconômicos */}
              <Typography variant="h6" gutterBottom>
                Dados Socioeconômicos
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="monthlyIncome"
                    label="Renda Mensal Individual"
                    type="number"
                    value={values.monthlyIncome || ''}
                    onChange={handleChange}
                    error={formTouched.monthlyIncome && !!formErrors.monthlyIncome}
                    helperText={formTouched.monthlyIncome && (formErrors.monthlyIncome as string)}
                    InputProps={{
                      startAdornment: 'R$'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="householdIncome"
                    label="Renda Familiar"
                    type="number"
                    value={values.householdIncome || ''}
                    onChange={handleChange}
                    error={formTouched.householdIncome && !!formErrors.householdIncome}
                    helperText={formTouched.householdIncome && (formErrors.householdIncome as string)}
                    InputProps={{
                      startAdornment: 'R$'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="householdMembers"
                    label="Número de Membros na Família"
                    type="number"
                    value={values.householdMembers || ''}
                    onChange={handleChange}
                    error={formTouched.householdMembers && !!formErrors.householdMembers}
                    helperText={formTouched.householdMembers && (formErrors.householdMembers as string)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="occupation"
                    label="Ocupação"
                    value={values.occupation || ''}
                    onChange={handleChange}
                    error={formTouched.occupation && !!formErrors.occupation}
                    helperText={formTouched.occupation && (formErrors.occupation as string)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="workRegime"
                    label="Regime de Trabalho"
                    value={values.workRegime || ''}
                    onChange={handleChange}
                    error={formTouched.workRegime && !!formErrors.workRegime}
                    helperText={formTouched.workRegime && (formErrors.workRegime as string)}
                    select
                  >
                    {workRegimes.map((regime) => (
                      <MenuItem key={regime} value={regime}>
                        {regime}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Dados Culturais */}
              <Typography variant="h6" gutterBottom>
                Dados Culturais
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel component="legend">Áreas Culturais</FormLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {culturalAreas.map((area) => (
                        <Chip
                          key={area}
                          label={area}
                          onClick={() => {
                            const currentAreas = values.culturalArea || [];
                            const newAreas = currentAreas.includes(area)
                              ? currentAreas.filter((a: string) => a !== area)
                              : [...currentAreas, area];
                            setFieldValue('culturalArea', newAreas);
                          }}
                          color={values.culturalArea?.includes(area) ? 'primary' : 'default'}
                        />
                      ))}
                    </Box>
                    {formTouched.culturalArea && formErrors.culturalArea && (
                      <Typography color="error" variant="caption">
                        {formErrors.culturalArea as string}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="yearsOfExperience"
                    label="Anos de Experiência"
                    type="number"
                    value={values.yearsOfExperience || ''}
                    onChange={handleChange}
                    error={formTouched.yearsOfExperience && !!formErrors.yearsOfExperience}
                    helperText={formTouched.yearsOfExperience && (formErrors.yearsOfExperience as string)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="biography"
                    label="Biografia"
                    multiline
                    rows={4}
                    value={values.biography || ''}
                    onChange={handleChange}
                    error={formTouched.biography && !!formErrors.biography}
                    helperText={
                      (formTouched.biography && (formErrors.biography as string)) ||
                      `${values.biography?.length || 0}/2000 caracteres`
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Dados de Acessibilidade */}
              <Typography variant="h6" gutterBottom>
                Dados de Acessibilidade
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.hasDisability || false}
                        onChange={(e) => setFieldValue('hasDisability', e.target.checked)}
                        name="hasDisability"
                      />
                    }
                    label="Possui alguma deficiência?"
                  />
                </Grid>
                {values.hasDisability && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="disabilityDetails"
                        label="Detalhes da Deficiência"
                        multiline
                        rows={2}
                        value={values.disabilityDetails || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="accessibilityNeeds"
                        label="Necessidades de Acessibilidade"
                        multiline
                        rows={2}
                        value={values.accessibilityNeeds?.join('\n') || ''}
                        onChange={(e) => {
                          const needs = e.target.value.split('\n').filter(Boolean);
                          setFieldValue('accessibilityNeeds', needs);
                        }}
                        helperText="Digite cada necessidade em uma linha separada"
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Botões de Ação */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{ minWidth: 200 }}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}; 