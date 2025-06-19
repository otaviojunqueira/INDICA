import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isPublicPage = location.pathname === '/';
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const publicNavigation = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Benefícios', href: '#benefits' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Contato', href: '#contact' },
  ];
  
  const agentNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Editais', href: '/notices' },
    { name: 'Inscrições', href: '/applications' },
    { name: 'Meu Perfil', href: '/agent-profile' },
    { name: 'Coletivos Culturais', href: '/cultural-group' },
  ];
  
  const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Gestão de Editais', href: '/admin/notices' },
    { name: 'Inscrições', href: '/admin/applications' },
    { name: 'Avaliadores', href: '/admin/evaluators' },
    { name: 'Relatórios', href: '/admin/reports' },
  ];
  
  const evaluatorNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projetos para Avaliar', href: '/evaluator/projects' },
    { name: 'Histórico', href: '/evaluator/history' },
    { name: 'Recursos', href: '/evaluator/appeals' },
  ];

  // Determinar qual menu mostrar com base no papel do usuário
  let navigation = publicNavigation;
  
  if (isAuthenticated && !isPublicPage) {
    if (user?.role === 'admin') {
      navigation = adminNavigation;
    } else if (user?.role === 'evaluator') {
      navigation = evaluatorNavigation;
    } else {
      navigation = agentNavigation;
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
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500">Conectado como</p>
                        <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role === 'admin' ? 'Administrador' : 
                           user?.role === 'evaluator' ? 'Avaliador' : 
                           'Agente Cultural'}
                        </p>
                      </div>
                      
                      <Link 
                        to="/agent-profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Meu Perfil
                      </Link>
                      
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Configurações
                      </Link>
                      
                      <Link 
                        to="/help" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Ajuda
                      </Link>
                      
                      <div className="border-t border-gray-200 my-1"></div>
                      
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              // Se for uma rota com âncora, usa como href, senão usa Link do React Router
              if (item.href.startsWith('#')) {
                return (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
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
                    className={`${
                      location.pathname === item.href 
                        ? 'text-purple-600 font-semibold' 
                        : 'text-gray-700 hover:text-purple-600'
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
            
            {isAuthenticated ? (
              <>
                {/* Seções adicionais no menu mobile para usuário autenticado */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role === 'admin' ? 'Administrador' : 
                           user?.role === 'evaluator' ? 'Avaliador' : 
                           'Agente Cultural'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/agent-profile"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  
                  <Link
                    to="/notifications"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notificações
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-800 text-base font-medium"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700 transition-colors mx-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};