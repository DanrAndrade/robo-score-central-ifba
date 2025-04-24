
import { useRef } from 'react';
import ReactToPdf from 'react-to-pdf';
import { toast } from './use-toast';

export const useToPdf = (fileName: string = 'documento') => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const toPdf = () => {
    if (targetRef.current) {
      ReactToPdf(targetRef, {
        filename: `${fileName}-${new Date().toISOString().split('T')[0]}.pdf`,
        page: {
          margin: 15
        }
      })
        .then(() => {
          toast({
            title: "PDF Gerado",
            description: "O arquivo PDF foi gerado com sucesso",
          });
        })
        .catch((error) => {
          console.error("Erro ao gerar PDF:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Houve um problema ao gerar o PDF",
          });
        });
    }
  };

  return {
    toPdf,
    targetRef
  };
};
