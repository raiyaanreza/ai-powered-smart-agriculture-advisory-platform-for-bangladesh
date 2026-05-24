"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogIn, Leaf, Zap, BookOpen, MessageSquare, ShoppingCart, Search, LayoutDashboard, ShieldCheck, User, Bell, History, Info, AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const staticLinks = [
  { name: "Diagnosis", href: "/diagnose", icon: Zap },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Advisory", href: "/advisory", icon: MessageSquare },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "bn">("en");
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const notificationChannelKey = useRef(`schema-db-changes-${Math.random().toString(36).slice(2)}`);

  const [notifications, setNotifications] = useState<any[]>([]);
  const userRole = profile?.role || user?.user_metadata?.role || "user";

  const navLinks = [
    ...(userRole === "farmer" ? [
      { name: "Dashboard", href: "/farmer", icon: LayoutDashboard },
      { name: "History", href: "/farmer/history", icon: History }
    ] : []),
    ...(userRole === "admin" ? [{ name: "Admin Portal", href: "http://localhost:3001", icon: ShieldCheck }] : []),
    ...staticLinks,
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();
    const channel = supabase
      .channel(`${notificationChannelKey.current}-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          toast.info(`New Alert: ${payload.new.title}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, userRole]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`target_role.eq.all,target_role.eq.${userRole}`)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotifications(data);
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "py-2 bg-white/95 dark:bg-[#0A0F0D]/95 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 shadow-sm" 
          : "py-4 bg-white/50 dark:bg-[#0A0F0D]/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/40"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="AgriVision Home">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-earth-700 to-earth-500 flex items-center justify-center shadow-lg shadow-green-900/10 group-hover:rotate-6 transition-transform duration-300">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              Agri<span className="text-earth-700 dark:text-emerald-400">Vision</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/60 dark:border-slate-800/50 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-[12px] font-black transition-all duration-300 flex items-center gap-2 ${isActive
                      ? "bg-white dark:bg-emerald-950 text-earth-700 dark:text-emerald-400 shadow-sm ring-1 ring-slate-200 dark:ring-emerald-900"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                >
                  <link.icon className={`h-3.5 w-3.5 ${isActive ? "text-earth-700 dark:text-emerald-400" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button 
              onClick={() => {
                const newLang = lang === "en" ? "bn" : "en";
                setLang(newLang);
                document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
                window.location.reload();
              }}
              className="h-11 px-3 rounded-full flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              aria-label={`Switch language to ${lang === "en" ? "Bengali" : "English"}`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">{lang === "en" ? "BN" : "EN"}</span>
            </button>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            <ThemeToggle />
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {user && (
              <div className="relative">
                <button
                  onClick={() => { setUserMenuOpen(false); setNotificationOpen(!notificationOpen); }}
                  className="h-11 w-11 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all relative"
                  aria-label={`Notifications${notifications.length > 0 ? `, ${notifications.length} unread` : ""}`}
                  aria-expanded={notificationOpen}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center px-1">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-card border border-slate-100 dark:border-border rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none py-4 z-50 overflow-hidden"
                    >
                      <div className="px-6 pb-4 border-b border-slate-50 dark:border-border flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-foreground uppercase tracking-widest">Alert Center</span>
                        <span className="text-[10px] font-black text-earth-700 dark:text-emerald-400 uppercase tracking-widest cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="max-h-100 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 text-[10px] font-bold">No active alerts.</div>
                        ) : (
                          notifications.map((n) => (
                            <NotificationItem
                              key={n.id}
                              title={n.title}
                              msg={n.message}
                              type={n.type}
                              time={new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                          ))
                        )}
                      </div>
                      <div className="px-6 pt-4 border-t border-slate-50 dark:border-border">
                        <button className="w-full py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-900 dark:hover:text-slate-200 transition-colors">View All History</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setNotificationOpen(false); setUserMenuOpen(!userMenuOpen); }}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-earth-700/20 dark:focus:ring-emerald-400/20"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="h-8 w-8 rounded-full bg-green-950 flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] font-black text-slate-900 dark:text-foreground leading-none tracking-tight">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] font-black text-earth-700 dark:text-emerald-400 uppercase tracking-widest leading-none mt-1">
                      {userRole}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-card border border-slate-100 dark:border-border rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none py-2 z-50"
                    >
                      <Link href="/premium" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[12px] font-black text-slate-900 dark:text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Premium Services</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Unlock satellite tools</div>
                        </div>
                      </Link>
                      <div className="h-px bg-slate-100 dark:bg-border my-1" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-[12px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="h-9 px-5 rounded-full bg-green-950 text-white text-[12px] font-black flex items-center gap-2 hover:bg-green-900 transition-all shadow-lg shadow-green-950/20 active:scale-95"
              >
                <LogIn className="h-4 w-4 text-white" />
                <span className="text-white">Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#0A0F0D] border-b border-slate-100 dark:border-slate-850 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    <link.icon className="h-5 w-5 text-earth-700 dark:text-emerald-400" />
                  </div>
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <button 
                    onClick={() => {
                      const newLang = lang === "en" ? "bn" : "en";
                      setLang(newLang);
                      document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
                      window.location.reload();
                    }}
                    className="flex-1 h-12 rounded-2xl bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 font-bold"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">{lang === "en" ? "BN" : "EN"}</span>
                  </button>
                  <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-850 h-12 w-12 rounded-2xl">
                    <ThemeToggle />
                  </div>
                </div>
                {user ? (
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-full h-12 rounded-2xl bg-green-950 dark:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-950/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-5 w-5 text-white" />
                    <span className="text-white">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NotificationItem({ title, msg, type, time }: { title: string, msg: string, type: 'info' | 'warning' | 'critical', time: string }) {
  const config = {
    info: { color: "text-blue-500", bg: "bg-blue-50", icon: Info, label: "Info" },
    warning: { color: "text-amber-500", bg: "bg-amber-50", icon: AlertTriangle, label: "Warning" },
    critical: { color: "text-red-500", bg: "bg-red-50", icon: AlertCircle, label: "Critical" }
  };
  const { color, bg, icon: Icon, label } = config[type];

  return (
    <div className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-50 dark:border-border last:border-0 group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-full ${bg} flex items-center justify-center`}>
            <Icon className={`h-3.5 w-3.5 ${color}`} />
          </div>
          <span className="text-[11px] font-black text-slate-900 dark:text-foreground uppercase tracking-tight group-hover:text-earth-700 dark:group-hover:text-emerald-400 transition-colors">{title}</span>
          <span className={`text-[8px] font-bold uppercase tracking-wider ${color} px-1.5 py-0.5 rounded ${bg}`}>{label}</span>
        </div>
        <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">{time}</span>
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        {msg}
      </p>
    </div>
  );
}

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const footerSections = [
    {
      title: "Resources",
      links: [
        { label: "Disease Library", href: "/library" },
        { label: "Expert Advisory", href: "/advisory" },
        { label: "Impact Reports", href: "/impact" },
      ]
    },
    {
      title: "Platform",
      links: [
        { label: "Start Diagnosis", href: "/diagnose" },
        { label: "Agri Marketplace", href: "/marketplace" },
        { label: "Gov Portal", href: "/government" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
      ]
    }
  ];

  return (
    <footer className="bg-green-950 text-white pt-16 sm:pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-80 sm:w-125 h-80 sm:h-125 bg-green-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16 sm:mb-20">
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-xl bg-earth-700 flex items-center justify-center">
                <Leaf className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tighter">
                Agri<span className="text-green-400">Vision</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              National AI Infrastructure for smart farming. Empowering 16 million farmers across Bangladesh.
            </p>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                ● Sustainable
              </span>
              <span className="text-slate-500 text-xs">v0.1.0 Stable</span>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              {/* Desktop: always visible */}
              <h4 className="hidden md:block text-sm font-bold mb-4 sm:mb-6 text-white">{section.title}</h4>
              <ul className="hidden md:block space-y-3 sm:space-y-4 text-slate-400 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-green-400 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>

              {/* Mobile: accordion */}
              <div className="md:hidden">
                <button
                  onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  className="w-full flex items-center justify-between py-3 text-sm font-bold text-white"
                  aria-expanded={openSection === section.title}
                >
                  {section.title}
                  <ChevronRight className={`h-4 w-4 transition-transform ${openSection === section.title ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {openSection === section.title && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-3 text-slate-400 text-sm pb-3"
                    >
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="hover:text-green-400 transition-colors">{link.label}</Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 sm:pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} AgriVision Bangladesh. A Government Partnered AI Initiative.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer">Ministry of Agriculture</span>
            <span className="hover:text-slate-400 cursor-pointer">Digital Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}