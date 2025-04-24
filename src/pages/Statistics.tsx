
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModalities, getTeamScores } from "@/services/mockDataService";
import { Modality } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Statistics = () => {
  const [selectedModalityId, setSelectedModalityId] = useState<string>("");
  const modalities = getModalities();

  const teamScores = selectedModalityId ? getTeamScores(selectedModalityId) : [];
  
  // Prepare data for bar chart
  const barChartData = teamScores.map(ts => ({
    name: ts.team.name.length > 10 ? ts.team.name.substring(0, 10) + '...' : ts.team.name,
    pontuação: ts.finalScore || 0,
  }));
  
  // Prepare data for line chart (progress over rounds)
  const lineChartData = [];
  if (teamScores.length > 0) {
    const roundsCount = teamScores[0].scores.length;
    for (let round = 0; round < roundsCount; round++) {
      const roundData: any = { name: `Rodada ${round + 1}` };
      teamScores.forEach(ts => {
        const teamName = ts.team.name.length > 8 ? ts.team.name.substring(0, 8) + '...' : ts.team.name;
        roundData[teamName] = ts.scores[round].score || 0;
      });
      lineChartData.push(roundData);
    }
  }

  // Random colors for the teams in charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">
          Visualize e analise o desempenho das equipes
        </p>
      </div>

      <div className="mb-6">
        <Select value={selectedModalityId} onValueChange={setSelectedModalityId}>
          <SelectTrigger className="w-full md:w-[300px]">
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

      {selectedModalityId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Pontuação Final por Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pontuação" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Progresso das Equipes por Rodada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {teamScores.map((ts, index) => {
                      const teamName = ts.team.name.length > 8 ? ts.team.name.substring(0, 8) + '...' : ts.team.name;
                      return (
                        <Line 
                          key={ts.team.id} 
                          type="monotone" 
                          dataKey={teamName} 
                          stroke={COLORS[index % COLORS.length]} 
                          activeDot={{ r: 8 }} 
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-10 text-center">
            <p className="text-muted-foreground">
              Selecione uma modalidade para visualizar as estatísticas
            </p>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Statistics;
