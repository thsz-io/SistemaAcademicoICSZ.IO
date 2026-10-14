import { useState } from "react";

// 1. Nova interface para tipar os dados que enviaremos ao fazer login
export interface UserData {
  name: string;
  role: string;
  email: string;
}

interface Props {
  onLogin: (userData: UserData) => void; // Agora o onLogin exige os dados
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno"); // 2. Novo estado para o cargo
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) { setError("Informe seu e-mail institucional."); return; }
    if (!email.includes("@")) { setError("Use seu e-mail institucional (@fatec.sp.gov.br)."); return; }
    if (!password) { setError("Informe sua senha."); return; }
    
    setLoading(true);

    // 3. Lógica para extrair e formatar o nome
    const emailPrefix = email.split("@")[0];
    const extractedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    setTimeout(() => {
      setLoading(false);
      // 4. Disparando o onLogin passando as informações para o App.tsx
      onLogin({
        name: extractedName,
        role: role,
        email: email
      });
    }, 1000);
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Informe seu e-mail institucional."); return; }
    setForgotSent(true);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Left panel mantido igual */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)" }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: "var(--accent)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>S2</div>
            <div>
              <div className="text-white font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>SIGA 2.0</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Portal Acadêmico FATEC</div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Sua vida acadêmica,<br />organizada e acessível.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif" }}>
            Acesse notas, horários, documentos e rematrícula em um único lugar. Desenvolvido para os estudantes das FATECs do Centro Paula Souza.
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-8">
            {[["15+", "Telas redesenhadas"], ["100%", "Responsivo"], ["WCAG", "Acessível"]].map(([val, desc]) => (
              <div key={val}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{val}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>S2</div>
            <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>SIGA 2.0 · FATEC</span>
          </div>

          {!forgotMode ? (
            <>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>Entrar</h1>
              <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>Use seu e-mail e senha institucional.</p>

              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* 5. Novo componente de seleção de cargo (Role) */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground)", fontFamily: "Outfit, sans-serif" }}>Tipo de Acesso</label>
                  <div className="flex gap-2">
                    {['aluno', 'professor', 'adm'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className="flex-1 py-2 rounded-lg border text-xs font-medium transition-all capitalize"
                        style={{
                          borderColor: role === r ? "var(--primary)" : "var(--border)",
                          background: role === r ? "var(--primary)" : "transparent",
                          color: role === r ? "#fff" : "var(--foreground)"
                        }}
                      >
                        @{r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground)", fontFamily: "Outfit, sans-serif" }}>E-mail institucional</label>
                  <input
                    type="email"
                    placeholder="nome@fatec.sp.gov.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all"
                    style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "var(--primary)", e.target.style.boxShadow = "0 0 0 3px rgba(15,52,96,0.08)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)", e.target.style.boxShadow = "none")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground)", fontFamily: "Outfit, sans-serif" }}>Senha</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-all"
                      style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}
                      onFocus={e => (e.target.style.borderColor = "var(--primary)", e.target.style.boxShadow = "0 0 0 3px rgba(15,52,96,0.08)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border)", e.target.style.boxShadow = "none")}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }}>
                      {showPass
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all"
                  style={{ background: loading ? "#94a3b8" : "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>

                <button type="button" onClick={() => { setForgotMode(true); setError(""); }} className="text-xs text-center transition-colors" style={{ color: "var(--primary)", fontFamily: "Inter, sans-serif" }}>
                  Esqueci minha senha
                </button>
              </form>

              <p className="mt-8 text-xs text-center" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                Problemas de acesso? <a href="#" style={{ color: "var(--primary)" }}>Contate o suporte</a>
              </p>
            </>
          ) : forgotSent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#dcfce7" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>E-mail enviado!</h2>
              <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
              <button onClick={() => { setForgotMode(false); setForgotSent(false); }} className="text-sm font-medium" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>← Voltar ao login</button>
            </div>
          ) : (
            <>
              {/* Parte de recuperação de senha mantida igual */}
              <button onClick={() => { setForgotMode(false); setError(""); }} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                Voltar
              </button>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Recuperar senha</h1>
              <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>Informe seu e-mail institucional e enviaremos as instruções.</p>
              {error && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /></svg>
                  {error}
                </div>
              )}
              <form onSubmit={handleForgot} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--foreground)", fontFamily: "Outfit, sans-serif" }}>E-mail institucional</label>
                  <input
                    type="email"
                    placeholder="nome@fatec.sp.gov.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "var(--border)", background: "#fff", color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg font-semibold text-sm" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
                  Enviar instruções
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
