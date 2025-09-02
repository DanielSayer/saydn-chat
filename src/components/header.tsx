import { UserButton } from "./buttons/user-button";
import { ThemeSwitcher } from "./themes/theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";

function Header() {
  return (
    <header className="pointer-events-none absolute top-0 z-50 w-full">
      <div className="flex w-full items-center justify-between px-2">
        <div className="pointer-events-auto">
          <div className="bg-background/10 flex items-center gap-2 rounded-xl p-2 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="bg-border h-4 w-px" />
          </div>
        </div>
        <div className="bg-background/10 pointer-events-auto flex items-center space-x-2 rounded-xl p-2 backdrop-blur-sm">
          <ThemeSwitcher />
          <div className="bg-border h-4 w-px" />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export { Header };
