import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/services/navigationService";

const Scoreboard = () => {
  // Mock data for demonstration
  const teams = [
    { id: "1", name: "Equipe A", score: 120 },
    { id: "2", name: "Equipe B", score: 95 },
    { id: "3", name: "Equipe C", score: 110 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Placar da Competição</h1>
            <p className="text-muted-foreground">
              Acompanhe em tempo real os resultados da competição
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={ROUTES.BETTING}>
              <Button variant="outline" className="flex items-center gap-2">
                Quero Apostar
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="secondary" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
              <p className="text-gray-700">Pontuação: {team.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
