
// Define the application routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  TEAMS: "/teams",
  MODALITIES: "/modalities",
  SCOREBOARD: "/scoreboard",
  SCORING: "/scoring",
  STATISTICS: "/statistics",
  BETTING: "/betting"
};

// Define navigation items for the sidebar
export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "home"
  },
  {
    name: "Equipes",
    path: ROUTES.TEAMS,
    icon: "users"
  },
  {
    name: "Modalidades",
    path: ROUTES.MODALITIES,
    icon: "settings"
  },
  {
    name: "Inserir Pontuações",
    path: ROUTES.SCORING,
    icon: "edit"
  },
  {
    name: "Placar Público",
    path: ROUTES.SCOREBOARD,
    icon: "monitor"
  },
  {
    name: "Estatísticas",
    path: ROUTES.STATISTICS,
    icon: "bar-chart"
  },
  {
    name: "Apostas",
    path: ROUTES.BETTING,
    icon: "ticket"
  }
];
