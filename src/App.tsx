
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Modalities from "./pages/Modalities";
import Scoring from "./pages/Scoring";
import Scoreboard from "./pages/Scoreboard";
import Statistics from "./pages/Statistics";
import { ROUTES } from "./services/navigationService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Index />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.TEAMS} element={<Teams />} />
          <Route path={`${ROUTES.TEAMS}/:id`} element={<TeamDetail />} />
          <Route path={ROUTES.MODALITIES} element={<Modalities />} />
          <Route path={ROUTES.SCORING} element={<Scoring />} />
          <Route path={ROUTES.SCOREBOARD} element={<Scoreboard />} />
          <Route path={ROUTES.STATISTICS} element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
