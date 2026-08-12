import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/auth/LoginPage";
// Player pages
import { PlayerDashboard } from "@/pages/player/PlayerDashboard";
import { PlayerEvents } from "@/pages/player/PlayerEvents";
import { PlayerEventDetail } from "@/pages/player/PlayerEventDetail";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/player" replace /> : <LoginPage />
        }
      />

      {/* Player */}
      <Route
        path="/player"
        element={
          <RequireAuth>
            <PlayerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/player/events"
        element={
          <RequireAuth>
            <PlayerEvents />
          </RequireAuth>
        }
      />
      <Route
        path="/player/events/:id"
        element={
          <RequireAuth>
            <PlayerEventDetail />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
