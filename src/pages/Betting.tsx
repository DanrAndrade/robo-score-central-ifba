
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTeams, getModalities } from "@/services/mockDataService";
import { toast } from "@/hooks/use-toast";

const Betting = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedModality, setSelectedModality] = useState("");
  const teams = getTeams();
  const modalities = getModalities();

  const handleBet = () => {
    if (!selectedTeam || !selectedModality) {
      toast({
        title: "Erro",
        description: "Selecione uma equipe e uma modalidade para apostar",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Aposta registrada!",
      description: "Sua aposta foi registrada com sucesso.",
    });

    setSelectedTeam("");
    setSelectedModality("");
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Faça sua Aposta</CardTitle>
            <CardDescription>
              Escolha a equipe que você acha que vai ganhar em cada modalidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Modalidade</label>
              <Select value={selectedModality} onValueChange={setSelectedModality}>
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
              <label className="text-sm font-medium">Equipe</label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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

            <div className="flex justify-end space-x-4">
              <Link to="/scoreboard">
                <Button variant="outline">Ver Placar</Button>
              </Link>
              <Button onClick={handleBet}>Confirmar Aposta</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Betting;
