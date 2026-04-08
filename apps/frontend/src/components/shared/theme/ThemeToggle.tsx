import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggleSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsClient(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!isClient) return null;

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const toggleTheme = () =>
    setTheme(currentTheme === "light" ? "dark" : "light");

  return (
    <button
      onClick={toggleTheme}
      className="group rounded-full bg-gray-3 p-1.25 text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-[#020D1A] dark:text-current"
    >
      <span className="sr-only">
        Switch to {currentTheme === "light" ? "dark" : "light"} mode
      </span>

      <span className="relative flex gap-2.5" aria-hidden>
        {/* INDICATOR */}
        <span
          className={`absolute size-9.5 rounded-full border border-gray-200 bg-gray-500 dark:border-none dark:bg-dark-2
          will-change-transform
          transition-transform duration-300 ease-out
          ${currentTheme === "dark"
              ? "translate-x-12 border-none bg-dark-2 dark:group-hover:bg-dark-3"
              : ""
            }`}
        />

        {/* ICONS */}
        {[
          { name: "light", Icon: Sun },
          { name: "dark", Icon: Moon },
        ].map(({ name, Icon }) => (
          <span
            key={name}
            className={`relative grid size-9.5 place-items-center rounded-full transition-colors duration-300 ${name === "dark" ? "dark:text-white" : ""
              }`}
          >
            <Icon />
          </span>
        ))}
      </span>
    </button>
  );
}