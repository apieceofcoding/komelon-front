import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IMAGES } from "../contants";

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: 실제 구현시에는 토큰 검증 로직 추가
    const token = localStorage.getItem("token");
    if (token) {
      // 임시 사용자 데이터
      setUser({
        id: "1",
        email: "user@example.com",
        username: "user",
        displayName: "사용자",
        profileUrl: IMAGES.LOGO,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: 실제 API 연동
    // 임시 로그인 로직
    const mockUser = {
      id: "1",
      email,
      username: "user",
      displayName: "사용자",
      profileUrl: IMAGES.LOGO,
    };
    setUser(mockUser);
    localStorage.setItem("token", "mock-token");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const signup = async (email: string, password: string, username: string) => {
    // TODO: 실제 API 연동
    // 임시 회원가입 로직
    const mockUser = {
      id: "1",
      email,
      username,
      displayName: username,
    };
    setUser(mockUser);
    localStorage.setItem("token", "mock-token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
