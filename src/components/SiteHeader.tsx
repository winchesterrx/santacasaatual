import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Phone, Clock } from "lucide-react";

const navItems = [
  { label: "História", href: "/historia" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Transparência", href: "/transparencia" },
  { label: "Ouvidoria e Contato", href: "/#ouvidoria" },
  { label: "Notícias", href: "/#noticias" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="bg-emerald text-white text-xs hidden md:block">
        <div className="container mx-auto flex items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> (17) 3292-1373
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Pronto-Socorro 24h
            </span>
          </div>
          <span className="opacity-70">CNES: 3536602080869 · Hospital Geral</span>
        </div>
      </div>

      <header className="section-white sticky top-0 z-50 border-b border-border/60 backdrop-blur-md bg-background/95">
        <div className="container mx-auto flex items-center justify-between h-20 px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Santa Casa Logo" className="w-12 h-12 object-contain" />
            <div className="leading-tight">
              <span className="text-lg font-extrabold text-navy tracking-tight">Santa Casa</span>
              <span className="block text-xs text-muted-foreground font-medium -mt-0.5">de Paulo de Faria</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-navy transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex">
            <Button variant="cta" size="lg" className="rounded-full px-7" onClick={() => document.getElementById('doacoes')?.scrollIntoView({ behavior: 'smooth' })}>
              <Heart className="w-4 h-4 mr-1" />
              Doe Agora
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-6 pb-6 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 text-xs text-muted-foreground pb-3 border-b border-border/60">
              <Phone className="w-3 h-3" /> (17) 3292-1373
              <span className="mx-1">·</span>
              <Clock className="w-3 h-3" /> 24h
            </div>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-foreground/80 hover:text-navy py-1"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button variant="cta" className="w-full rounded-full" onClick={() => { setMobileOpen(false); document.getElementById('doacoes')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Heart className="w-4 h-4 mr-1" />
              Doe Agora
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default SiteHeader;
