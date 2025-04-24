
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold mb-6 text-ifba-blue">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Página não encontrada</p>
        <p className="mb-8 text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild>
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
