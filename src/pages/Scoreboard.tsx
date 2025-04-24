import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModalities, getTeamScores } from "@/services/mockDataService";
import { Modality, TeamScore } from "@/types/models";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Scoreboard = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [selectedModalityId, setSelectedModalityId] = useState<string>("");
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);
  
  const REFRESH_INTERVAL = 5000;

  useEffect(() => {
    setModalities(getModalities());
    if (modalities.length > 0 && !selectedModalityId) {
      setSelectedModalityId(modalities[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedModalityId) {
      const modality = modalities.find(m => m.id === selectedModalityId);
      setSelectedModality(modality || null);
      
      const scores = getTeamScores(selectedModalityId);
      setTeamScores(scores);
    }
    
    const intervalId = setInterval(() => {
      if (selectedModalityId) {
        const scores = getTeamScores(selectedModalityId);
        setTeamScores(scores);
      }
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [selectedModalityId, modalities]);

  const handleModalityChange = (value: string) => {
    setSelectedModalityId(value);
  };

  const formatFinalScore = (score: number | null) => {
    if (score === null) return "N/A";
    return score.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-ifba-blue text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-robotics font-bold">RoboScore Central</h1>
                <p className="text-lg">Placar da Competição de Robótica IFBA</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Select value={selectedModalityId} onValueChange={handleModalityChange}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 w-full md:w-[240px]">
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
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {selectedModality ? (
          <>
            <Card className="mb-6">
              <CardHeader className="bg-gray-100">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedModality.name}</h2>
                    <p className="text-muted-foreground">{selectedModality.description}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right text-muted-foreground">
                    <div>Rodadas: {selectedModality.rounds}</div>
                    <div>Última atualização: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">Posição</TableHead>
                      <TableHead className="font-bold">Equipe</TableHead>
                      <TableHead className="font-bold">Instituição</TableHead>
                      {Array.from({ length: selectedModality.rounds }, (_, i) => (
                        <TableHead key={i} className="font-bold text-center">Rodada {i + 1}</TableHead>
                      ))}
                      <TableHead className="font-bold text-center">Pontuação Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamScores.length > 0 ? (
                      teamScores.map((teamScore, index) => (
                        <TableRow key={teamScore.team.id} className={index < 3 ? "bg-gray-50" : ""}>
                          <TableCell className="font-bold text-lg">
                            {index === 0 ? (
                              <div className="bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                1
                              </div>
                            ) : index === 1 ? (
                              <div className="bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                2
                              </div>
                            ) : index === 2 ? (
                              <div className="bg-amber-700 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                3
                              </div>
                            ) : (
                              index + 1
                            )}
                          </TableCell>
                          <TableCell className="font-bold">{teamScore.team.name}</TableCell>
                          <TableCell>{teamScore.team.institution}</TableCell>
                          {teamScore.scores.map((roundScore, idx) => (
                            <TableCell key={idx} className="text-center">
                              {roundScore.score !== null ? roundScore.score : "-"}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-bold text-lg">
                            <span className={`${index < 3 ? "inline-block animate-score-pulse" : ""}`}>
                              {formatFinalScore(teamScore.finalScore)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4 + selectedModality.rounds} className="text-center py-8">
                          Nenhuma equipe cadastrada para esta modalidade.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>O placar é atualizado automaticamente a cada 5 segundos.</p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Selecione uma modalidade para visualizar o placar.
            </p>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            RoboScore Central - Sistema de Placar para Competições de Robótica | IFBA © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Scoreboard;
