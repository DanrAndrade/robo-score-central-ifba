
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getModalities,
  getTeams,
  getScores,
  addScore,
  calculateFinalScore,
} from "@/services/mockDataService";
import { Modality, Score, Team } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

const Scoring = () => {
  const [selectedModalityId, setSelectedModalityId] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [scoreValue, setScoreValue] = useState<number>(0);
  
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamScores, setTeamScores] = useState<Score[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);

  // Load modalities
  useEffect(() => {
    setModalities(getModalities());
  }, []);

  // Load teams when modality changes
  useEffect(() => {
    if (selectedModalityId) {
      const modalityTeams = getTeams(selectedModalityId);
      setTeams(modalityTeams);
      
      const modality = modalities.find(m => m.id === selectedModalityId);
      setSelectedModality(modality || null);
      
      // Reset team selection
      setSelectedTeamId("");
      setSelectedRound(1);
      setTeamScores([]);
      setFinalScore(null);
    }
  }, [selectedModalityId, modalities]);

  // Load scores when team changes
  useEffect(() => {
    if (selectedTeamId && selectedModalityId) {
      const scores = getScores(selectedTeamId, selectedModalityId);
      setTeamScores(scores);
      
      const finalScore = calculateFinalScore(selectedTeamId, selectedModalityId);
      setFinalScore(finalScore);
      
      // Set initial score value to 0
      setScoreValue(0);
    }
  }, [selectedTeamId, selectedModalityId]);

  const handleModalityChange = (value: string) => {
    setSelectedModalityId(value);
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeamId(value);
  };

  const handleRoundChange = (value: string) => {
    setSelectedRound(parseInt(value));
    
    // Load existing score for this round if available
    if (selectedTeamId && selectedModalityId) {
      const roundScore = teamScores.find(score => score.round === parseInt(value));
      if (roundScore) {
        setScoreValue(roundScore.value);
      } else {
        setScoreValue(0);
      }
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    
    if (selectedModality) {
      // Clamp value between min and max score
      const clampedValue = Math.max(
        selectedModality.minScore,
        Math.min(value, selectedModality.maxScore)
      );
      
      setScoreValue(clampedValue);
    } else {
      setScoreValue(value);
    }
  };

  const handleSaveScore = () => {
    if (!selectedTeamId || !selectedModalityId) {
      toast({
        variant: "destructive",
        title: "Seleção incompleta",
        description: "Selecione uma modalidade e uma equipe."
      });
      return;
    }

    try {
      const newScore = addScore({
        teamId: selectedTeamId,
        modalityId: selectedModalityId,
        round: selectedRound,
        value: scoreValue
      });
      
      // Update the list of scores
      const updatedScores = teamScores.filter(score => score.round !== selectedRound);
      setTeamScores([...updatedScores, newScore]);
      
      // Update final score
      const updatedFinalScore = calculateFinalScore(selectedTeamId, selectedModalityId);
      setFinalScore(updatedFinalScore);
      
      toast({
        title: "Pontuação salva",
        description: `Pontuação ${scoreValue} salva para a rodada ${selectedRound}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar pontuação",
        description: "Ocorreu um erro ao salvar a pontuação."
      });
    }
  };

  const getRoundOptions = () => {
    if (!selectedModality) return [];
    
    return Array.from({ length: selectedModality.rounds }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Rodada ${i + 1}`
    }));
  };

  const formatFinalScore = (score: number | null) => {
    if (score === null) return "N/A";
    return score.toFixed(2);
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inserir Pontuações</h1>
        <p className="text-muted-foreground">
          Registre as pontuações das equipes em cada rodada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Registrar Pontuação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade</Label>
                <Select value={selectedModalityId} onValueChange={handleModalityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {modalities.map((modality) => (
                      <SelectItem key={modality.id} value={modality.id}>
                        {modality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Equipe</Label>
                <Select 
                  value={selectedTeamId} 
                  onValueChange={handleTeamChange}
                  disabled={!selectedModalityId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="round">Rodada</Label>
                <Select 
                  value={selectedRound.toString()} 
                  onValueChange={handleRoundChange}
                  disabled={!selectedTeamId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma rodada" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRoundOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="score">Pontuação</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="score"
                    type="number"
                    value={scoreValue}
                    onChange={handleScoreChange}
                    min={selectedModality?.minScore || 0}
                    max={selectedModality?.maxScore || 100}
                    disabled={!selectedTeamId}
                  />
                  <Button 
                    onClick={handleSaveScore}
                    disabled={!selectedTeamId}
                  >
                    <Check className="w-4 h-4 mr-2" /> 
                    Salvar
                  </Button>
                </div>
                {selectedModality && (
                  <p className="text-xs text-muted-foreground">
                    Pontuação deve estar entre {selectedModality.minScore} e {selectedModality.maxScore}.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTeamId ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Equipe</p>
                  <p className="font-medium">{teams.find(t => t.id === selectedTeamId)?.name}</p>
                </div>
                
                {teamScores.length > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pontuações</p>
                    <ul className="space-y-1">
                      {teamScores.sort((a, b) => a.round - b.round).map((score) => (
                        <li key={score.id} className="flex justify-between items-center text-sm">
                          <span>Rodada {score.round}</span>
                          <span className="font-medium">{score.value}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="font-semibold">Pontuação Final</span>
                      <span className="font-bold text-lg">{formatFinalScore(finalScore)}</span>
                    </div>
                    
                    {selectedModality && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Método de cálculo: 
                        {selectedModality.scoringMethod === "average_all" && " Média de todas as rodadas"}
                        {selectedModality.scoringMethod === "top_three" && " Média das três melhores pontuações"}
                        {selectedModality.scoringMethod === "discard_lowest" && " Desconsiderar menor nota"}
                        {selectedModality.scoringMethod === "sum_all" && " Soma de todas as pontuações"}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhuma pontuação registrada.</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Selecione uma modalidade e uma equipe para ver o resumo.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedModalityId && teams.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Todas as Equipes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipe</TableHead>
                  {getRoundOptions().map((option) => (
                    <TableHead key={option.value}>{option.label}</TableHead>
                  ))}
                  <TableHead>Pontuação Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => {
                  const teamScores = getScores(team.id, selectedModalityId);
                  const finalScore = calculateFinalScore(team.id, selectedModalityId);
                  
                  return (
                    <TableRow key={team.id} className={selectedTeamId === team.id ? "bg-muted/50" : ""}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      {Array.from({ length: selectedModality?.rounds || 0 }, (_, i) => {
                        const roundScore = teamScores.find(score => score.round === i + 1);
                        return (
                          <TableCell key={i}>
                            {roundScore ? roundScore.value : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="font-bold">{formatFinalScore(finalScore)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Scoring;
