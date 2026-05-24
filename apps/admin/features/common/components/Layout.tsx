"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogIn, Leaf, Zap, BookOpen, MessageSquare, ShieldCheck, User, Bell, LayoutDashboard, Settings, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();

  const userRole = profile?.role || user?.user_metadata?.role || "admin";

  const navLinks = [
    { name: "Command Center", href: "/", icon: LayoutDashboard },
    { name: "Public Site", href: "http://localhost:3000", icon: Globe },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-200 bg-card border-b border-border ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="px-4 lg:px-6">
        <nav className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-md bg-[#052E16] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Agri<span className="text-[#052E16] dark:text-emerald-400">Admin</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">Command Center</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-transparent dark:border-slate-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <link.icon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-8 w-48 pl-8 pr-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
            <button className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium">BN</span>
            </button>
            <button className="relative h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
            <ThemeToggle />
            <div className="h-5 w-px bg-slate-250 dark:bg-slate-800" />
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <div className="h-6 w-6 rounded-md bg-[#052E16] flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="User Avatar" className="h-full w-full object-cover rounded-md" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-primary font-medium leading-none mt-0.5 uppercase">
                      {userRole}
                    </span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{profile?.full_name || user.email}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
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
                className="h-8 px-4 rounded-lg bg-[#052E16] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#064E3B] transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
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
            className="lg:hidden bg-white dark:bg-[#0A0F0D] border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-sm font-medium"
                >
                  <link.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3 px-3">
                <span className="text-xs font-semibold text-slate-500">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 pt-20 pb-10 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#052E16] to-[#1A3A1A] flex items-center justify-center shadow-lg shadow-green-900/10">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                Agri<span className="text-[#052E16] dark:text-emerald-400">Admin</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
              The national administrative command center for disease surveillance and ecosystem management.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Command Tools</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">National Alerts</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Disease Library</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Farmer Verifications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Security</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Audit Logs</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Access Policies</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Ministry of Agriculture. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
