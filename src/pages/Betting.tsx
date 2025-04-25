
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { ROUTES } from "@/services/navigationService";
import { ChevronLeft, Trophy } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Faça sua Aposta</CardTitle>
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

            <div className="flex justify-between items-center pt-4">
              <Link to={ROUTES.SCOREBOARD}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Ver Placar
                </Button>
              </Link>
              <Button onClick={handleBet} className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Confirmar Aposta
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
          <Link to={ROUTES.LOGIN}>
            <Button variant="link" className="text-sm text-muted-foreground">
              Área de administração
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Betting;
