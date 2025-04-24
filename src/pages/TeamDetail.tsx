
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeam, getScores, getModality, calculateFinalScore } from "@/services/mockDataService";
import { Team, Score } from "@/types/models";
import { ROUTES } from "@/services/navigationService";
import { ChevronLeft, Trophy, Star, Download, Users } from "lucide-react";
import { useToPdf } from "@/hooks/useToPdf";

const TeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [modalityName, setModalityName] = useState<string>("");
  const { toPdf, targetRef } = useToPdf("equipe");

  useEffect(() => {
    if (id) {
      const teamData = getTeam(id);
      if (teamData) {
        setTeam(teamData);
        const teamScores = getScores(id);
        setScores(teamScores);
        
        // Get modality name
        const modality = getModality(teamData.modalityId);
        if (modality) {
          setModalityName(modality.name);
        }
      }
    }
  }, [id]);

  if (!team) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p>Equipe não encontrada</p>
        </div>
      </PageLayout>
    );
  }

  const finalScore = team ? calculateFinalScore(team.id, team.modalityId) : null;

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to={ROUTES.TEAMS} className="inline-flex items-center text-ifba-blue hover:underline mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para Equipes
          </Link>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">{team.institution}</p>
        </div>
        
        <Button onClick={toPdf} className="bg-ifba-blue text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <div ref={targetRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Trophy className="w-5 h-5 mr-2" />
                Modalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{modalityName}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Star className="w-5 h-5 mr-2" />
                Pontuação Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {finalScore !== null ? finalScore.toFixed(2) : "N/A"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg font-medium">
                <Users className="w-5 h-5 mr-2" />
                Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{team.members.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {team.members.map((member, index) => (
                <li key={index} className="py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-ifba-blue text-white flex items-center justify-center mr-3">
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{member}</div>
                      <div className="text-sm text-muted-foreground">Membro {index + 1}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pontuações</CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Rodada</th>
                      <th className="text-left py-2">Pontuação</th>
                      <th className="text-left py-2">Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score) => (
                      <tr key={score.id} className="border-b">
                        <td className="py-2">Rodada {score.round}</td>
                        <td className="py-2 font-medium">{score.value}</td>
                        <td className="py-2 text-muted-foreground">
                          {new Date(score.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma pontuação registrada para esta equipe
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TeamDetail;
