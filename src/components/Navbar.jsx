import { useState, useEffect, useRef } from 'react';
import { LogOut, User, CheckSquare, Settings, Calendar, Mail, ChevronDown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const dropdownRef = useRef(null);
  const profileModalRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Récupérer le profil utilisateur
  const fetchUserProfile = async () => {
    if (userProfile) return; // Ne pas refetch si déjà récupéré
    
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileClick = () => {
    fetchUserProfile();
    setIsProfileOpen(!isProfileOpen);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : 'US';
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et titre */}
            <div className="flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                  TaskManager
                </span>
                <div className="text-xs text-slate-500 font-medium">
                  Productivité maximale
                </div>
              </div>
            </div>
            
            {/* Menu utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Profil utilisateur */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="group flex items-center space-x-3 px-4 py-2 bg-white/50 hover:bg-white/70 rounded-2xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {getInitials(user?.username)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-semibold text-slate-700">
                      {user?.username || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-slate-500">
                      Mon profil
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden z-50 animate-in slide-in-from-top-2">
                    <div className="p-6">
                      {profileLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : userProfile ? (
                        <div className="space-y-6">
                          {/* Header du profil */}
                          <div className="text-center pb-4 border-b border-slate-200/50">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                              {getInitials(userProfile.username)}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">
                              {userProfile.username}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Membre depuis {formatDate(userProfile.createdAt).split(' à')[0]}
                            </p>
                          </div>

                          {/* Informations détaillées */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                              <div className="p-2 bg-blue-100 rounded-xl">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800">
                                  {userProfile.username}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                              <div className="p-2 bg-green-100 rounded-xl">
                                <Mail className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 break-all">
                                  {userProfile.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-slate-200/50 space-y-3">
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-medium rounded-2xl transition-all duration-300 transform">
                              <Settings className="h-4 w-4" />
                              <span>Paramètres du compte</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                logout();
                                setIsProfileOpen(false);
                              }}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-2xl transition-all duration-300 transform shadow-lg hover:shadow-xl"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Déconnexion</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <X className="h-6 w-6 text-red-500" />
                          </div>
                          <p className="text-sm text-slate-600">
                            Erreur lors du chargement du profil
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
