import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isDemoMode } from "@/lib/supabase";
import MessageService from "@/lib/messageService";
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  User,
  Menu,
  X,
  Briefcase,
  Home,
  Bell,
  Search,
  LogOut,
  Shield,
} from "lucide-react";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      description: "Main platform",
    },
    {
      href: "/assignments",
      label: "Assignments",
      icon: GraduationCap,
      description: "Find & post assignments",
    },
    {
      href: "/services",
      label: "Services",
      icon: Briefcase,
      description: "Home & hostel help",
    },
    {
      href: "/resources",
      label: "Resources",
      icon: BookOpen,
      description: "Study materials",
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      description: "Chat & discussions",
    },
  ];

  // Add admin link only for verified admin users
  const adminNavItems =
    user && isAdmin && !checkingAdmin
      ? [
          ...navItems,
          {
            href: "/admin",
            label: "Admin",
            icon: Shield,
            description: "Platform management",
          },
        ]
      : navItems;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      checkAdminStatus();
      // Set up real-time subscription for new messages
      const subscription = MessageService.subscribeToMessages(user.id, () => {
        fetchUnreadCount();
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsAdmin(false);
      setCheckingAdmin(false);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (user) {
      const { data } = await MessageService.getUnreadCount(user.id);
      setUnreadCount(data || 0);
    }
  };

  const checkAdminStatus = async () => {
    if (!user || isDemoMode) {
      // In demo mode, allow access for demonstration
      setIsAdmin(true);
      setCheckingAdmin(false);
      return;
    }

    try {
      console.log("Checking admin status for user:", user.id);

      const { data: profile, error } = await supabase!
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      console.log("Admin check result:", { profile, error });

      if (error) {
        console.error("Supabase error details:");
        console.error("- Message:", error.message);
        console.error("- Code:", error.code);
        console.error("- Details:", error.details);
        console.error("- Hint:", error.hint);
        console.error("- Full error:", JSON.stringify(error, null, 2));

        // If column doesn't exist or table doesn't exist, assume not admin
        if (
          error.code === "PGRST116" ||
          error.code === "42P01" ||
          error.message?.includes("column") ||
          error.message?.includes("does not exist") ||
          error.message?.includes("relation") ||
          error.message?.includes("profiles")
        ) {
          console.warn(
            "Profiles table or is_admin column issue, treating as non-admin",
          );
          setIsAdmin(false);
        } else {
          setIsAdmin(false);
        }
      } else {
        console.log("Profile data:", profile);
        setIsAdmin(profile?.is_admin || false);
      }
    } catch (error: any) {
      console.error("JavaScript error in checkAdminStatus:");
      console.error("- Error name:", error?.name);
      console.error("- Error message:", error?.message);
      console.error("- Error stack:", error?.stack);
      console.error("- Full error object:", error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-student-beige-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">StudyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-student"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.href === "/messages" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-student-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-student-orange-500 rounded-full border-2 border-background"></div>
                </Button>
              </>
            )}

            {!loading &&
              (user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="btn-primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 animate-slide-up">
            <div className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-student"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">
                        {item.description}
                      </div>
                    </div>
                    {item.href === "/messages" && unreadCount > 0 && (
                      <span className="bg-student-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              {!loading && (
                <div className="pt-4 border-t border-border/40 space-y-2">
                  {user ? (
                    <>
                      <Link to="/dashboard">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        className="w-full justify-start"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button
                          className="w-full btn-primary"
                          size="sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
