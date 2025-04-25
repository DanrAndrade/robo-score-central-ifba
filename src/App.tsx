
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Modalities from "./pages/Modalities";
import Scoring from "./pages/Scoring";
import Scoreboard from "./pages/Scoreboard";
import Statistics from "./pages/Statistics";
import Betting from "./pages/Betting";
import { ROUTES } from "./services/navigationService";

const queryClient = new QueryClient();

// Simple route protection component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SCOREBOARD} element={<Scoreboard />} />
          <Route path={ROUTES.BETTING} element={<Betting />} />
          
          {/* Protected routes */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path={ROUTES.TEAMS} element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path={`${ROUTES.TEAMS}/:id`} element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
          <Route path={ROUTES.MODALITIES} element={<ProtectedRoute><Modalities /></ProtectedRoute>} />
          <Route path={ROUTES.SCORING} element={<ProtectedRoute><Scoring /></ProtectedRoute>} />
          <Route path={ROUTES.STATISTICS} element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
