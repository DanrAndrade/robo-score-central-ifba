
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  getModalities,
  getTeams,
  addTeam,
  deleteTeam
} from "@/services/mockDataService";
import { Team, Modality } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash, Eye } from "lucide-react";

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>(getTeams());
  const modalities = getModalities();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<Omit<Team, "id">>({
    name: "",
    institution: "",
    members: [""],
    modalityId: ""
  });

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.modalityId) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome da equipe e modalidade são obrigatórios."
      });
      return;
    }

    // Filter out empty member entries
    const validMembers = newTeam.members.filter(member => member.trim() !== "");
    
    try {
      const teamData = {
        ...newTeam,
        members: validMembers
      };
      const createdTeam = addTeam(teamData);
      setTeams([...teams, createdTeam]);
      
      toast({
        title: "Equipe adicionada",
        description: `A equipe ${createdTeam.name} foi adicionada com sucesso.`
      });
      
      setNewTeam({
        name: "",
        institution: "",
        members: [""],
        modalityId: ""
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar equipe",
        description: "Ocorreu um erro ao adicionar a equipe."
      });
    }
  };

  const handleDeleteTeam = (id: string) => {
    try {
      deleteTeam(id);
      setTeams(teams.filter(team => team.id !== id));
      
      toast({
        title: "Equipe removida",
        description: "A equipe foi removida com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover equipe",
        description: "Ocorreu um erro ao remover a equipe."
      });
    }
  };

  const handleAddMember = () => {
    setNewTeam({
      ...newTeam,
      members: [...newTeam.members, ""]
    });
  };

  const handleUpdateMember = (index: number, value: string) => {
    const updatedMembers = [...newTeam.members];
    updatedMembers[index] = value;
    
    setNewTeam({
      ...newTeam,
      members: updatedMembers
    });
  };

  const getModalityName = (modalityId: string) => {
    const modality = modalities.find(mod => mod.id === modalityId);
    return modality ? modality.name : "Desconhecida";
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Equipes</h1>
          <p className="text-muted-foreground">
            Gerencie as equipes participantes da competição
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="bg-ifba-green text-white">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Equipe
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Modalidade</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead className="w-[160px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.institution}</TableCell>
                    <TableCell>{getModalityName(team.modalityId)}</TableCell>
                    <TableCell>{team.members.join(", ")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link to={`/teams/${team.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-ifba-blue"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhuma equipe cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Equipe</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-name" className="text-right">
                Nome
              </Label>
              <Input
                id="team-name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="institution" className="text-right">
                Instituição
              </Label>
              <Input
                id="institution"
                value={newTeam.institution}
                onChange={(e) => setNewTeam({ ...newTeam, institution: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modality" className="text-right">
                Modalidade
              </Label>
              <Select
                value={newTeam.modalityId}
                onValueChange={(value) => setNewTeam({ ...newTeam, modalityId: value })}
              >
                <SelectTrigger className="col-span-3">
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

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Membros</Label>
              <div className="col-span-3 space-y-2">
                {newTeam.members.map((member, index) => (
                  <Input
                    key={index}
                    value={member}
                    onChange={(e) => handleUpdateMember(index, e.target.value)}
                    placeholder={`Nome do membro ${index + 1}`}
                  />
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAddMember}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Membro
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTeam} className="bg-ifba-green text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Teams;
