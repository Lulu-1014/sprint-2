import { useTheme } from "../context/ThemeContext";

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
      <img
        src="/images/moon.png"
        alt="Tema escuro"
        className="mode__tog-moon"
      />
      <img
        src="/images/sun.png"
        alt="Tema claro"
        className="mode__tog-sun"
      />
    </button>
  );
}
