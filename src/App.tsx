import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import SignUp from "./pages/SingUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Post from "./pages/Post";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/home">
              <h1 className="text-xl font-bold hover:text-blue-500 transition-colors">
                참외 Korean melon
              </h1>
            </Link>
            {isAuthenticated ? (
              <div className="space-x-4">
                <Link to="/home" className="text-gray-700 hover:text-blue-500">
                  홈
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-500"
                >
                  프로필
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-500"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-blue-500"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
