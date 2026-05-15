"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogIn, Leaf, Zap, BookOpen, MessageSquare, ShieldCheck, User, Bell, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "py-4 bg-white/50 backdrop-blur-sm border-b border-slate-200/50"
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#052E16] to-[#1A3A1A] flex items-center justify-center shadow-lg shadow-green-900/10 group-hover:rotate-6 transition-transform duration-300">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Agri<span className="text-[#052E16]">Admin</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-[12px] font-black transition-all duration-300 flex items-center gap-2 ${
                    isActive 
                      ? "bg-white text-[#052E16] shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <link.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#052E16]" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="h-9 px-3 rounded-full flex items-center gap-2 text-slate-600 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">BN</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200 mx-1" />
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-1 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#052E16]/20"
                >
                  <div className="h-8 w-8 rounded-full bg-[#052E16] flex items-center justify-center overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] font-black text-slate-900 leading-none tracking-tight">
                      {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] font-black text-[#052E16] uppercase tracking-widest leading-none mt-1">
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
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50"
                    >
                      <button 
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-[12px] font-black text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="http://localhost:3000/login"
                className="h-9 px-5 rounded-full bg-[#052E16] text-white text-[12px] font-black flex items-center gap-2 hover:bg-[#064E3B] transition-all shadow-lg shadow-green-950/20 active:scale-95"
              >
                <LogIn className="h-4 w-4 text-white" />
                <span className="text-white">Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-900"
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
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 transition-colors font-black text-sm"
                >
                  <link.icon className="h-5 w-5 text-slate-400" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#052E16] to-[#1A3A1A] flex items-center justify-center shadow-lg shadow-green-900/10">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">
                Agri<span className="text-[#052E16]">Admin</span>
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              The national administrative command center for disease surveillance and ecosystem management.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Command Tools</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">National Alerts</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">Disease Library</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">Farmer Verifications</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6">Security</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">Audit Logs</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">Access Policies</Link></li>
              <li><Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#052E16] transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-400">
            &copy; {new Date().getFullYear()} Ministry of Agriculture. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-[#052E16] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-bold text-slate-400 hover:text-[#052E16] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
