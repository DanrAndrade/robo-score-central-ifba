
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { getModalities, addModality, deleteModality } from "@/services/mockDataService";
import { Modality, ScoringMethod } from "@/types/models";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";

const Modalities = () => {
  const [modalities, setModalities] = useState<Modality[]>(getModalities());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newModality, setNewModality] = useState<Omit<Modality, "id">>({
    name: "",
    description: "",
    rounds: 3,
    minScore: 0,
    maxScore: 100,
    scoringMethod: ScoringMethod.AVERAGE_ALL
  });

  const scoringMethodOptions = [
    { value: ScoringMethod.AVERAGE_ALL, label: "Média de todas as rodadas" },
    { value: ScoringMethod.TOP_THREE, label: "Média das três melhores pontuações" },
    { value: ScoringMethod.DISCARD_LOWEST, label: "Desconsiderar menor nota" },
    { value: ScoringMethod.SUM_ALL, label: "Soma de todas as pontuações" }
  ];

  const handleAddModality = () => {
    if (!newModality.name) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "O nome da modalidade é obrigatório."
      });
      return;
    }

    try {
      const createdModality = addModality(newModality);
      setModalities([...modalities, createdModality]);
      
      toast({
        title: "Modalidade adicionada",
        description: `A modalidade ${createdModality.name} foi adicionada com sucesso.`
      });
      
      setNewModality({
        name: "",
        description: "",
        rounds: 3,
        minScore: 0,
        maxScore: 100,
        scoringMethod: ScoringMethod.AVERAGE_ALL
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar modalidade",
        description: "Ocorreu um erro ao adicionar a modalidade."
      });
    }
  };

  const handleDeleteModality = (id: string) => {
    try {
      deleteModality(id);
      setModalities(modalities.filter(modality => modality.id !== id));
      
      toast({
        title: "Modalidade removida",
        description: "A modalidade foi removida com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover modalidade",
        description: "Ocorreu um erro ao remover a modalidade."
      });
    }
  };

  const getScoringMethodLabel = (method: ScoringMethod) => {
    const option = scoringMethodOptions.find(opt => opt.value === method);
    return option ? option.label : "Desconhecido";
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Modalidades</h1>
          <p className="text-muted-foreground">
            Gerencie as modalidades da competição de robótica
          </p>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="bg-ifba-green text-white">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modalidade
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Rodadas</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Método de Cálculo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modalities.length > 0 ? (
                modalities.map((modality) => (
                  <TableRow key={modality.id}>
                    <TableCell className="font-medium">{modality.name}</TableCell>
                    <TableCell>{modality.description}</TableCell>
                    <TableCell>{modality.rounds}</TableCell>
                    <TableCell>{modality.minScore} - {modality.maxScore}</TableCell>
                    <TableCell>{getScoringMethodLabel(modality.scoringMethod)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDeleteModality(modality.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma modalidade cadastrada
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
            <DialogTitle>Adicionar Nova Modalidade</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modality-name" className="text-right">
                Nome
              </Label>
              <Input
                id="modality-name"
                value={newModality.name}
                onChange={(e) => setNewModality({ ...newModality, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={newModality.description}
                onChange={(e) => setNewModality({ ...newModality, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rounds" className="text-right">
                Rodadas
              </Label>
              <Input
                id="rounds"
                type="number"
                value={newModality.rounds}
                onChange={(e) => setNewModality({ ...newModality, rounds: parseInt(e.target.value) || 1 })}
                min={1}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minScore" className="text-right">
                Pontuação mínima
              </Label>
              <Input
                id="minScore"
                type="number"
                value={newModality.minScore}
                onChange={(e) => setNewModality({ ...newModality, minScore: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxScore" className="text-right">
                Pontuação máxima
              </Label>
              <Input
                id="maxScore"
                type="number"
                value={newModality.maxScore}
                onChange={(e) => setNewModality({ ...newModality, maxScore: parseInt(e.target.value) || 1 })}
                min={1}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scoringMethod" className="text-right">
                Método de cálculo
              </Label>
              <Select
                value={newModality.scoringMethod}
                onValueChange={(value) => setNewModality({ ...newModality, scoringMethod: value as ScoringMethod })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um método" />
                </SelectTrigger>
                <SelectContent>
                  {scoringMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddModality} className="bg-ifba-green text-white">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Modalities;
