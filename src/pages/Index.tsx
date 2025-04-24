
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/services/navigationService";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ifba-blue to-blue-900 text-white">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl md:text-7xl font-robotics font-bold mb-8">
          RoboScore<span className="text-ifba-green">Central</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Sistema de Gestão e Transmissão de Placar para Competições de Robótica do IFBA
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Pontuação em Tempo Real</h3>
            <p className="text-sm">
              Acompanhe os placares das competições de robótica com atualizações instantâneas
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Modalidades Flexíveis</h3>
            <p className="text-sm">
              Configure regras e pontuações específicas para cada tipo de competição
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Gestão Simplificada</h3>
            <p className="text-sm">
              Interface intuitiva para organizar equipes, rodadas e resultados
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-ifba-green hover:bg-green-600 text-white"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            Acessar Dashboard
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/20"
            onClick={() => navigate(ROUTES.SCOREBOARD)}
          >
            Ver Placar Público
          </Button>
        </div>

        <div className="mt-16">
          <p className="text-sm opacity-70">
            Desenvolvido para o Instituto Federal da Bahia &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
