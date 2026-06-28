import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Lock, LogIn } from "lucide-react";
import { loginAdmin } from "@/services/mockApi";

const AdminLogin = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await loginAdmin(usuario, senha);
    setLoading(false);
    if (res.success) {
      sessionStorage.setItem("sc_admin_token", res.token!);
      navigate("/admin/dashboard");
    } else {
      setError(res.message || "Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Portal Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">Santa Casa de Misericórdia</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-lg border border-border/60 space-y-5">
          <div>
            <label className="text-sm font-semibold text-navy block mb-1.5">Usuário</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Seu usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1.5">Senha</label>
            <Input type="password" placeholder="••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          <Button type="submit" variant="navy-solid" size="lg" className="w-full rounded-full" disabled={loading}>
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
