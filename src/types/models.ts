
export interface Team {
  id: string;
  name: string;
  institution: string;
  members: string[];
  modalityId: string;
}

export interface Modality {
  id: string;
  name: string;
  description: string;
  rounds: number;
  minScore: number;
  maxScore: number;
  scoringMethod: ScoringMethod;
}

export interface Competition {
  id: string;
  name: string;
  date: Date;
  modalities: Modality[];
  active: boolean;
}

export interface Score {
  id: string;
  teamId: string;
  modalityId: string;
  round: number;
  value: number;
  timestamp: Date;
}

export enum ScoringMethod {
  AVERAGE_ALL = "average_all",
  TOP_THREE = "top_three",
  DISCARD_LOWEST = "discard_lowest",
  SUM_ALL = "sum_all"
}

export interface RoundScore {
  round: number;
  score: number | null;
}

export interface TeamScore {
  team: Team;
  scores: RoundScore[];
  finalScore: number | null;
}
