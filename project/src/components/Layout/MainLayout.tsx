import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Lista de emails permitidos para super admins
const SUPER_ADMIN_EMAILS = [
  'admin1@indica.com.br',
  'admin2@indica.com.br'
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Verificar se o usuário é um super admin
  const isSuperAdmin = user?.role === 'admin' && user?.email && SUPER_ADMIN_EMAILS.includes(user.email);

  // Redirecionar super admin para a página de gerenciamento de entidades
  useEffect(() => {
    if (isSuperAdmin && location.pathname === '/dashboard') {
      navigate('/admin/entities');
    }
  }, [isSuperAdmin, location.pathname, navigate]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Definir itens de menu com base no papel do usuário
  const getMenuItems = () => {
    const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    // Itens para super admin
    if (isSuperAdmin) {
      return [
        ...menuItems,
        { text: 'Entes Federados', icon: <BusinessIcon />, path: '/admin/entities' },
        { text: 'Pareceristas', icon: <GroupIcon />, path: '/admin/evaluators' },
        { text: 'Criar Edital', icon: <DescriptionIcon />, path: '/admin/create-notice' },
        { text: 'Relatórios', icon: <AssessmentIcon />, path: '/admin/reports' },
      ];
    }

    // Itens para ente federado
    if (user?.role === 'entity') {
      return [
        ...menuItems,
        { text: 'Pareceristas', icon: <GroupIcon />, path: '/entity/evaluators' },
        { text: 'Editais', icon: <DescriptionIcon />, path: '/notices' },
        { text: 'Calendário Cultural', icon: <EventIcon />, path: '/calendar' },
      ];
    }

    // Itens para agente cultural
    if (user?.role === 'agent') {
      return [
        ...menuItems,
        { text: 'Editais', icon: <DescriptionIcon />, path: '/notices' },
        { text: 'Minhas Inscrições', icon: <DescriptionIcon />, path: '/applications' },
        { text: 'Calendário Cultural', icon: <EventIcon />, path: '/calendar' },
      ];
    }

    // Itens para parecerista
    if (user?.role === 'evaluator') {
      return [
        ...menuItems,
        { text: 'Projetos para Avaliar', icon: <DescriptionIcon />, path: '/evaluator/projects' },
        { text: 'Histórico de Avaliações', icon: <AssessmentIcon />, path: '/evaluator/history' },
      ];
    }

    return menuItems;
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/indica-logo-cut.png" alt="INDICA" style={{ height: 50 }} />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/indica-logo-cut.png" alt="INDICA" style={{ height: 40, marginRight: 10 }} />
          </RouterLink>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1, ml: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    mx: 1,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notificações">
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Box sx={{ ml: 2 }}>
              <Tooltip title={user?.name || 'Usuário'}>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  aria-label="conta do usuário"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                >
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {user?.name?.charAt(0) || <AccountCircle />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1">{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                </Box>
                <Divider />
                <MenuItem component={RouterLink} to="/profile">
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Meu Perfil
                </MenuItem>
                <MenuItem component={RouterLink} to="/settings">
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Configurações
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} INDICA - Sistema de Indicadores Culturais
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;