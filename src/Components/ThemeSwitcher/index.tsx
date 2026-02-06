import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { Theme, useTheme } from "../../utils/Context/ThemeContext";

const themes: { value: Theme; icon: typeof SunIcon; label: string }[] = [
  { value: "light", icon: SunIcon, label: "Light" },
  { value: "dark", icon: MoonIcon, label: "Dark" },
  { value: "system", icon: ComputerDesktopIcon, label: "System" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={(e) => {
            e.stopPropagation();
            setTheme(value);
          }}
          title={label}
          className={`rounded-lg p-2 transition-colors ${
            theme === value
              ? "bg-surface-active text-heading"
              : "text-muted hover:bg-surface-hover"
          }`}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
