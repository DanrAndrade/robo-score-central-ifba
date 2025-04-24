
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/services/navigationService";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  Edit,
  Monitor,
  Menu,
  X,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  settings: <Settings className="w-5 h-5" />,
  edit: <Edit className="w-5 h-5" />,
  monitor: <Monitor className="w-5 h-5" />,
};

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "bg-white dark:bg-gray-800 border-r h-screen fixed left-0 top-0 w-64 transition-transform transform md:translate-x-0 shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-ifba-blue p-2 rounded">
              <div className="text-white font-bold">IFBA</div>
            </div>
            <div>
              <h1 className="font-bold text-lg">RoboScore</h1>
              <p className="text-xs text-muted-foreground">Centro de Pontuação</p>
            </div>
          </div>
        </div>
        
        <nav className="p-5">
          <ul className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-ifba-blue text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {iconMap[item.icon]}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Navigation;
