
import { Competition, Modality, Score, ScoringMethod, Team, TeamScore, RoundScore } from "@/types/models";
import { v4 as uuidv4 } from "uuid";

// Mock data
let competitions: Competition[] = [
  {
    id: "comp-1",
    name: "IFBA Robotics Competition 2024",
    date: new Date(2024, 7, 15),
    modalities: ["mod-1", "mod-2", "mod-3"],
    active: true
  }
];

let modalities: Modality[] = [
  {
    id: "mod-1",
    name: "Sumô",
    description: "Competição de robôs lutadores de sumô",
    rounds: 3,
    minScore: 0,
    maxScore: 100,
    scoringMethod: ScoringMethod.AVERAGE_ALL
  },
  {
    id: "mod-2",
    name: "Seguidor de Linha",
    description: "Competição de robôs que seguem linhas",
    rounds: 2,
    minScore: 0,
    maxScore: 200,
    scoringMethod: ScoringMethod.TOP_THREE
  },
  {
    id: "mod-3",
    name: "Resgate",
    description: "Competição de robôs de resgate",
    rounds: 3,
    minScore: 0,
    maxScore: 150,
    scoringMethod: ScoringMethod.DISCARD_LOWEST
  }
];

let teams: Team[] = [
  {
    id: "team-1",
    name: "RoboMasters",
    institution: "IFBA Salvador",
    members: ["João Silva", "Ana Oliveira", "Pedro Santos"],
    modalityId: "mod-1"
  },
  {
    id: "team-2",
    name: "TechBots",
    institution: "IFBA Vitória da Conquista",
    members: ["Maria Souza", "Carlos Ferreira"],
    modalityId: "mod-1"
  },
  {
    id: "team-3",
    name: "CircuitBreakers",
    institution: "IFBA Barreiras",
    members: ["Luiza Costa", "Marcos Almeida", "Juliana Lima"],
    modalityId: "mod-2"
  },
  {
    id: "team-4",
    name: "ByteForce",
    institution: "IFBA Feira de Santana",
    members: ["Rafael Gomes", "Bianca Martins"],
    modalityId: "mod-2"
  },
  {
    id: "team-5",
    name: "RescueBots",
    institution: "IFBA Ilhéus",
    members: ["Felipe Rocha", "Camila Pereira", "Bruno Oliveira"],
    modalityId: "mod-3"
  }
];

let scores: Score[] = [
  {
    id: "score-1",
    teamId: "team-1",
    modalityId: "mod-1",
    round: 1,
    value: 85,
    timestamp: new Date()
  },
  {
    id: "score-2",
    teamId: "team-1",
    modalityId: "mod-1",
    round: 2,
    value: 92,
    timestamp: new Date()
  },
  {
    id: "score-3",
    teamId: "team-2",
    modalityId: "mod-1",
    round: 1,
    value: 78,
    timestamp: new Date()
  }
];

// Service methods
export const getCompetitions = (): Competition[] => {
  return competitions;
};

export const getActiveCompetition = (): Competition | undefined => {
  return competitions.find(comp => comp.active);
};

export const getModalities = (): Modality[] => {
  return modalities;
};

export const getModality = (id: string): Modality | undefined => {
  return modalities.find(mod => mod.id === id);
};

export const getTeams = (modalityId?: string): Team[] => {
  if (modalityId) {
    return teams.filter(team => team.modalityId === modalityId);
  }
  return teams;
};

export const getTeam = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};

export const getScores = (teamId?: string, modalityId?: string): Score[] => {
  let filteredScores = scores;
  
  if (teamId) {
    filteredScores = filteredScores.filter(score => score.teamId === teamId);
  }
  
  if (modalityId) {
    filteredScores = filteredScores.filter(score => score.modalityId === modalityId);
  }
  
  return filteredScores;
};

export const addTeam = (team: Omit<Team, "id">): Team => {
  const newTeam = { ...team, id: `team-${uuidv4().substring(0, 8)}` };
  teams.push(newTeam);
  return newTeam;
};

export const updateTeam = (team: Team): Team => {
  const index = teams.findIndex(t => t.id === team.id);
  if (index !== -1) {
    teams[index] = team;
    return team;
  }
  throw new Error("Team not found");
};

export const deleteTeam = (id: string): boolean => {
  const initialLength = teams.length;
  teams = teams.filter(team => team.id !== id);
  return teams.length < initialLength;
};

export const addModality = (modality: Omit<Modality, "id">): Modality => {
  const newModality = { ...modality, id: `mod-${uuidv4().substring(0, 8)}` };
  modalities.push(newModality);
  return newModality;
};

export const updateModality = (modality: Modality): Modality => {
  const index = modalities.findIndex(m => m.id === modality.id);
  if (index !== -1) {
    modalities[index] = modality;
    return modality;
  }
  throw new Error("Modality not found");
};

export const deleteModality = (id: string): boolean => {
  const initialLength = modalities.length;
  modalities = modalities.filter(modality => modality.id !== id);
  return modalities.length < initialLength;
};

export const addScore = (score: Omit<Score, "id" | "timestamp">): Score => {
  const newScore = { 
    ...score, 
    id: `score-${uuidv4().substring(0, 8)}`,
    timestamp: new Date()
  };
  
  // Check if there's already a score for this team, modality, and round
  const existingScoreIndex = scores.findIndex(
    s => s.teamId === score.teamId && s.modalityId === score.modalityId && s.round === score.round
  );
  
  if (existingScoreIndex !== -1) {
    // Replace the existing score
    scores[existingScoreIndex] = newScore;
  } else {
    // Add a new score
    scores.push(newScore);
  }
  
  return newScore;
};

export const calculateFinalScore = (teamId: string, modalityId: string): number | null => {
  const teamScores = scores.filter(
    score => score.teamId === teamId && score.modalityId === modalityId
  );
  
  if (teamScores.length === 0) {
    return null;
  }
  
  const modality = modalities.find(mod => mod.id === modalityId);
  if (!modality) {
    return null;
  }
  
  const scoreValues = teamScores.map(score => score.value);
  
  switch (modality.scoringMethod) {
    case ScoringMethod.AVERAGE_ALL:
      return scoreValues.reduce((sum, val) => sum + val, 0) / scoreValues.length;
      
    case ScoringMethod.TOP_THREE:
      return scoreValues
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((sum, val) => sum + val, 0) / Math.min(3, scoreValues.length);
      
    case ScoringMethod.DISCARD_LOWEST:
      if (scoreValues.length <= 1) {
        return scoreValues[0] || null;
      }
      const filteredScores = [...scoreValues].sort((a, b) => a - b).slice(1);
      return filteredScores.reduce((sum, val) => sum + val, 0) / filteredScores.length;
      
    case ScoringMethod.SUM_ALL:
      return scoreValues.reduce((sum, val) => sum + val, 0);
      
    default:
      return null;
  }
};

export const getTeamScores = (modalityId: string): TeamScore[] => {
  const modalityTeams = teams.filter(team => team.modalityId === modalityId);
  const modality = modalities.find(mod => mod.id === modalityId);
  
  if (!modality) {
    return [];
  }
  
  return modalityTeams.map(team => {
    const teamScores = scores.filter(
      score => score.teamId === team.id && score.modalityId === modalityId
    );
    
    const roundScores: RoundScore[] = Array.from({ length: modality.rounds }, (_, i) => {
      const roundScore = teamScores.find(score => score.round === i + 1);
      return {
        round: i + 1,
        score: roundScore ? roundScore.value : null
      };
    });
    
    return {
      team,
      scores: roundScores,
      finalScore: calculateFinalScore(team.id, modalityId)
    };
  }).sort((a, b) => {
    // Sort by finalScore (descending)
    if (a.finalScore === null) return 1;
    if (b.finalScore === null) return -1;
    return b.finalScore - a.finalScore;
  });
};
