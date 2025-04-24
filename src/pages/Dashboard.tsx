
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompetitions, getModalities, getTeams } from "@/services/mockDataService";
import { Link } from "react-router-dom";
import { ROUTES } from "@/services/navigationService";

const Dashboard = () => {
  const competitions = getCompetitions();
  const activeCompetition = competitions.find(comp => comp.active);
  const modalities = getModalities();
  const teams = getTeams();

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gestão de competições de robótica
        </p>
      </div>

      {activeCompetition ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {activeCompetition.name}
            </h2>
            <p className="text-muted-foreground">
              Data: {activeCompetition.date.toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Modalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{modalities.length}</div>
                <div className="mt-2">
                  <Link 
                    to={ROUTES.MODALITIES}
                    className="text-sm text-ifba-blue hover:underline"
                  >
                    Gerenciar modalidades
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Equipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teams.length}</div>
                <div className="mt-2">
                  <Link 
                    to={ROUTES.TEAMS}
                    className="text-sm text-ifba-blue hover:underline"
                  >
                    Gerenciar equipes
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Placar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Ao vivo</div>
                <div className="mt-2">
                  <Link 
                    to={ROUTES.SCOREBOARD}
                    className="text-sm text-ifba-blue hover:underline"
                  >
                    Ver placar público
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modalidades Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {modalities.map(modality => (
                    <li key={modality.id} className="border-b pb-2">
                      <div className="font-medium">{modality.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {modality.description}
                      </div>
                      <div className="text-xs mt-1">
                        Rodadas: {modality.rounds} | Pontuação: {modality.minScore}-{modality.maxScore}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Registro de Pontuação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Utilize o sistema de pontuação para registrar os resultados das equipes em cada rodada.
                </p>
                <Link 
                  to={ROUTES.SCORING}
                  className="bg-ifba-blue hover:bg-blue-700 text-white py-2 px-4 rounded inline-block"
                >
                  Inserir Pontuações
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              Nenhuma competição ativa no momento. Configure uma competição para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Dashboard;
