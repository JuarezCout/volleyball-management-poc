import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/auth/LoginPage";
// Admin pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminEvents } from "@/pages/admin/AdminEvents";
import { AdminEventDetail } from "@/pages/admin/AdminEventDetail";
import { AdminGroups } from "@/pages/admin/AdminGroups";
import { AdminPlayers } from "@/pages/admin/AdminPlayers";
import { AdminPayments } from "@/pages/admin/AdminPayments";
import { AdminRatings } from "@/pages/admin/AdminRatings";
import { AdminCommunication } from "@/pages/admin/AdminCommunication";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminPolls } from "@/pages/admin/AdminPolls";
import { AdminFeedbacks } from "@/pages/admin/AdminFeedbacks";
// Captain pages
import { CaptainDashboard } from "@/pages/captain/CaptainDashboard";
import { CaptainEvents } from "@/pages/captain/CaptainEvents";
import { CaptainEventDetail } from "@/pages/captain/CaptainEventDetail";
// Player pages
import { PlayerDashboard } from "@/pages/player/PlayerDashboard";
import { PlayerEvents } from "@/pages/player/PlayerEvents";
import { PlayerEventDetail } from "@/pages/player/PlayerEventDetail";
import { PlayerMyGames } from "@/pages/player/PlayerMyGames";
import { PlayerRating } from "@/pages/player/PlayerRating";
import { PlayerHistory } from "@/pages/player/PlayerHistory";
import { PlayerProfile } from "@/pages/player/PlayerProfile";
import { PlayerPolls } from "@/pages/player/PlayerPolls";
import { PlayerFeedback } from "@/pages/player/PlayerFeedback";

function RequireAuth({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={`/${user.role === "admin" ? "admin" : user.role === "captain" ? "captain" : "player"}`}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/events"
        element={
          <RequireAuth role="admin">
            <AdminEvents />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/events/:id"
        element={
          <RequireAuth role="admin">
            <AdminEventDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/groups"
        element={
          <RequireAuth role="admin">
            <AdminGroups />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/players"
        element={
          <RequireAuth role="admin">
            <AdminPlayers />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/teams"
        element={
          <RequireAuth role="admin">
            <Navigate to="/admin/events/e1" replace />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <RequireAuth role="admin">
            <AdminPayments />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/ratings"
        element={
          <RequireAuth role="admin">
            <AdminRatings />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/communication"
        element={
          <RequireAuth role="admin">
            <AdminCommunication />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/polls"
        element={
          <RequireAuth role="admin">
            <AdminPolls />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/feedbacks"
        element={
          <RequireAuth role="admin">
            <AdminFeedbacks />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireAuth role="admin">
            <AdminSettings />
          </RequireAuth>
        }
      />

      {/* Captain */}
      <Route
        path="/captain"
        element={
          <RequireAuth role="captain">
            <CaptainDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/events"
        element={
          <RequireAuth role="captain">
            <CaptainEvents />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/events/:id"
        element={
          <RequireAuth role="captain">
            <CaptainEventDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/teams"
        element={
          <RequireAuth role="captain">
            <Navigate to="/captain/events/e1" replace />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/players"
        element={
          <RequireAuth role="captain">
            <AdminPlayers />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/ratings"
        element={
          <RequireAuth role="captain">
            <Navigate to="/captain/events/e1" replace />
          </RequireAuth>
        }
      />
      <Route
        path="/captain/communication"
        element={
          <RequireAuth role="captain">
            <AdminCommunication />
          </RequireAuth>
        }
      />

      {/* Player */}
      <Route
        path="/player"
        element={
          <RequireAuth role="player">
            <PlayerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/player/events"
        element={
          <RequireAuth role="player">
            <PlayerEvents />
          </RequireAuth>
        }
      />
      <Route
        path="/player/events/:id"
        element={
          <RequireAuth role="player">
            <PlayerEventDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/player/my-games"
        element={
          <RequireAuth role="player">
            <PlayerMyGames />
          </RequireAuth>
        }
      />
      <Route
        path="/player/rating"
        element={
          <RequireAuth role="player">
            <PlayerRating />
          </RequireAuth>
        }
      />
      <Route
        path="/player/history"
        element={
          <RequireAuth role="player">
            <PlayerHistory />
          </RequireAuth>
        }
      />
      <Route
        path="/player/profile"
        element={
          <RequireAuth role="player">
            <PlayerProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/player/polls"
        element={
          <RequireAuth role="player">
            <PlayerPolls />
          </RequireAuth>
        }
      />
      <Route
        path="/player/feedback"
        element={
          <RequireAuth role="player">
            <PlayerFeedback />
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
