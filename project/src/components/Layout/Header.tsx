import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { agentProfileService } from '../../services/agentProfile.service';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isPublicPage = location.pathname === '/';
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasCulturalGroup, setHasCulturalGroup] = useState(false);

  useEffect(() => {
    const checkCulturalGroupAccess = async () => {
      try {
        if (isAuthenticated && user) {
          const profile = await agentProfileService.getProfile();
          setHasCulturalGroup(profile?.hasCulturalGroup || false);
        }
      } catch (error) {
        console.error('Erro ao verificar acesso ao coletivo cultural:', error);
        setHasCulturalGroup(false);
      }
    };

    checkCulturalGroupAccess();
  }, [isAuthenticated, user, setHasCulturalGroup]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicNavigation = [
    { name: 'Início', href: '#home' },
    { name: 'Benefícios', href: '#benefits' },
    { name: 'Sobre', href: '#about' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Calendário Cultural', href: '/calendario' },
    { name: 'Contato', href: '#contact' },
  ];
  
  const getAgentNavigation = () => {
    const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Editais', href: '/notices' },
    { name: 'Inscrições', href: '/applications' },
      { name: 'Calendário Cultural', href: '/calendario' },
    { name: 'Meu Perfil', href: '/agent-profile' },
    ];

    if (hasCulturalGroup) {
      baseNavigation.push({ name: 'Coletivos Culturais', href: '/cultural-group' });
    }

    return baseNavigation;
  };
  
  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Gestão de Editais', href: '/admin/notices' },
    { name: 'Calendário Cultural', href: '/calendario' },
    { name: 'Pareceristas', href: '/admin/evaluators' },
    { name: 'Portal da Transparência', href: '/admin/entity-portals' },
    { name: 'Relatórios', href: '/admin/reports' },
  ];
  
  const evaluatorNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projetos para Avaliar', href: '/evaluator/projects' },
    { name: 'Histórico', href: '/evaluator/history' },
    { name: 'Recursos', href: '/evaluator/resources' },
  ];

  // Determinar qual menu mostrar com base no papel do usuário
  let navigation = publicNavigation;
  
  if (isAuthenticated && !isPublicPage) {
    if (user?.role === 'admin') {
      navigation = adminNavigation;
    } else if (user?.role === 'evaluator') {
      navigation = evaluatorNavigation;
    } else {
      navigation = getAgentNavigation();
    }
  }

  // Simular notificações
  const mockNotifications = [
    {
      id: '1',
      title: 'Novo edital disponível',
      message: 'Edital de incentivo à música foi publicado hoje.',
      read: false,
      date: new Date()
    },
    {
      id: '2',
      title: 'Inscrição enviada com sucesso',
      message: 'Sua inscrição para o edital de artes visuais foi recebida.',
      read: true,
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      title: 'Prazo se encerrando',
      message: 'O edital de cultura popular encerra inscrições em 2 dias.',
      read: false,
      date: new Date(Date.now() - 2 * 86400000)
    }
  ];
  
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
              <img src="/indica-logo-cut.png" alt="INDICA" className="w-13 h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              // Se for uma rota com âncora, usa como href, senão usa Link do React Router
              if (item.href.startsWith('#')) {
                return (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href 
                        ? 'text-purple-600 font-semibold' 
                        : 'text-gray-700 hover:text-purple-600'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notificações */}
                <div className="relative">
                  <button 
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                  <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700">Notificações</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map(notification => (
                          <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-gray-800">{notification.title}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link 
                          to="/notifications" 
                          className="text-sm text-purple-600 hover:text-purple-800"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          Ver todas
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Menu do Usuário */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      {user?.name?.split(' ')[0]}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/agent-profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                      <Link 
                        to="/notifications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Notificações
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            // Se for uma rota com âncora, usa como href, senão usa Link do React Router
            if (item.href.startsWith('#')) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              );
            } else {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href 
                      ? 'text-purple-600 bg-gray-50' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            }
          })}
          
          {!isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <Link 
                  to="/login"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
              </div>
              <div className="mt-3 px-3">
                <Link 
                  to="/register"
                  className="block w-full text-center bg-purple-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/agent-profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  to="/notifications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notificações
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;