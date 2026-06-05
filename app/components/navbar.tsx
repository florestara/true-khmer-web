import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Mail,
  LayoutDashboard,
  HeartHandshake,
  Calendar,
  MessagesSquare,
  House,
  BriefcaseBusiness,
  TvMinimalPlay,
} from "lucide-react";
import NotificationBellPopOver from "~/components/notification-bell-pop-over";
import { cn } from "~/lib/utils";
import type { AuthenticatedUser } from "~/lib/server/types";
import ProfileDropDown from "./profile-dropdown";

interface NavbarProps {
  user: AuthenticatedUser | null;
  loginRedirectTo?: string;
}

const navLinks = [
  { to: "/manage-post", label: "Workspace", icon: LayoutDashboard },
  { to: "/home", label: "Home", icon: House },
  // { to: "/dashboard", label: "My Journey", icon: Compass },
  { to: "/forum", label: "Forum", icon: MessagesSquare },
  // { to: "/forumv2", label: "Forum V2", icon: MessageSquare },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/volunteer", label: "Volunteer", icon: HeartHandshake },
  { to: "/launchpad", label: "Launchpad", icon: BriefcaseBusiness },
  { to: "/poc", label: "POC", icon: TvMinimalPlay },
];

export function Navbar({ user, loginRedirectTo }: NavbarProps) {
  const location = useLocation();

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#f1f5f9] bg-white shadow-sm">
        <div className="mx-auto flex h-17 w-full max-w-300 items-center justify-between px-4 lg:px-6">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/TruekhmerLogo.svg"
                alt="Logo"
                className="h-32 w-auto"
              />
            </Link>
          </div>

          {/* Center: Navigation Links (desktop only) */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to)
                ? true
                : false;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "relative flex items-center gap-1.5 text-sm text-[#344256] transition-all",
                    link.to === "/workspace" &&
                      "border-r border-[#c8d6e5] pr-6 mr-1",
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "hover:text-blue-600 hover:font-semibold",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notification icons */}
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="size-9 rounded-full border border-[#f1f5f9] bg-white text-[#344256] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                  aria-label="Messages"
                >
                  <Link to="/messages">
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
                <NotificationBellPopOver />
                {/* User dropdown */}
                <ProfileDropDown user={user} />
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to={`/login?redirectTo=${encodeURIComponent(loginRedirectTo || "/")}`}
                  >
                    Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-linear-to-r from-[#0082e1] to-[#5ab9ff] text-white hover:from-[#0078d2] hover:to-[#4aaef8]"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16 px-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-[10px] font-semibold transition-colors",
                  isActive ? "text-blue-600" : "text-gray-400",
                )}
              >
                <link.icon
                  className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "")}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
