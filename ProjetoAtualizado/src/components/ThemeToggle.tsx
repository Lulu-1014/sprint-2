import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { dark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`mode__tog ${dark ? "active" : ""} ${className}`.trim()}
      aria-label="Alterar tema"
      title={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={toggleTheme}
    >
      <Moon className="mode__tog-moon" size={22} strokeWidth={2.2} />
      <Sun className="mode__tog-sun" size={22} strokeWidth={2.2} />
    </button>
  );
}
