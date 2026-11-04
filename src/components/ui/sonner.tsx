import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { LIGHT_THEMES } from "@/components/app/ThemeProvider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  const toasterTheme: ToasterProps["theme"] = LIGHT_THEMES.includes(theme) ? "light" : "dark";

  return (
    <Sonner
      theme={toasterTheme}
      className="toaster group"

      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",

          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
