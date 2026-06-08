import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sinan_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sinan_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('sinan_auth');
    }
  }, [user]);

  const login = (email: string, name: string) => {
    const parts = name.split(' ');
    let initials = '';
    if (parts.length > 1) {
      initials = `${parts[0][0].toUpperCase()}. ${parts[parts.length - 1][0].toUpperCase()}.`;
    } else {
      initials = `${name.substring(0, 2).toUpperCase()}`;
    }

    setUser({
      id: Date.now().toString(),
      email,
      name,
      initials
    });
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
