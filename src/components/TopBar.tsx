import { useState } from "react";
import type { Screen } from "../App";

const screenLabels: Record<Exclude<Screen, "login">, string> = {
  dashboard: "Início",
  disciplinas: "Disciplinas",
  notas: "Notas",
  frequencia: "Frequência",
  horario: "Horário de Aulas",
  rematricula: "Rematrícula",
  documentos: "Documentos & Solicitações",
  notificacoes: "Avisos",
  perfil: "Perfil",
  eventos: "Eventos Acadêmicos",
};

interface Props {
  current: Exclude<Screen, "login">;
  navigate: (s: Screen) => void;
  user?: { name: string; role: string; email: string };
  unreadNotifs: number;
}

export default function TopBar({ current, navigate, unreadNotifs }: Props) {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Sugestões inteligentes ou interpretação de dúvidas
  const suggestions = [
    { label: "Segunda via do histórico", screen: "documentos" },
    { label: "Notas e médias", screen: "notas" },
    { label: "Rematrícula", screen: "rematricula" },
    { label: "Frequência", screen: "frequencia" },
    { label: "Horário semanal", screen: "horario" },
    { label: "Eventos e Maratonas", screen: "eventos" },
  ].filter(s => search.length > 1 && s.label.toLowerCase().includes(search.toLowerCase()));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = search.toLowerCase().trim();
      if (query === "disciplinas") {
        navigate("disciplinas");
      } else if (query.includes("frequência") || query.includes("frequencia") || query.includes("falta")) {
        navigate("frequencia");
      } else if (query.includes("nota") || query.includes("média")) {
        navigate("notas");
      } else if (query.includes("evento") || query.includes("maratona")) {
        navigate("eventos");
      } else if (search.length > 2) {
        // Simulação de IA interpretando a dúvida do usuário
        setAiAnswer(`Resolução para "${search}": Recomendamos verificar na aba de Documentos ou contatar a secretaria acadêmica.`);
      }
      setSearch("");
      setFocused(false);
    }
  };

  return (
    <header className="shrink-0 flex items-center gap-4 px-5 py-3 border-b bg-white relative" style={{ borderColor: "var(--border)" }}>
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
          S2
        </div>
      </div>

      {/* Page title */}
      <h1 className="text-sm md:text-base font-semibold shrink-0" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>
        {screenLabels[current]}
      </h1>

      {/* Search with AI resolution */}
      <div className="relative flex-1 max-w-md mx-auto md:mx-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all" style={{
          borderColor: focused ? "var(--primary)" : "var(--border)",
          background: focused ? "#fff" : "var(--background)",
          boxShadow: focused ? "0 0 0 3px rgba(15,52,96,0.08)" : "none",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--muted-foreground)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="Pesquise ou digite sua dúvida..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            style={{ color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "var(--muted-foreground)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && focused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border shadow-lg z-50 overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {suggestions.map((s, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors" onClick={() => { navigate(s.screen as Screen); setSearch(""); }} style={{ color: "var(--foreground)", fontFamily: "Inter, sans-serif" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)" }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* AI Answer Modal Popup if triggered */}
      {aiAnswer && (
        <div className="absolute top-16 left-5 z-50 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-xl shadow-md text-xs flex items-center gap-3">
          <span>{aiAnswer}</span>
          <button aria-label="Fechar" onClick={() => setAiAnswer(null)} className="font-bold ml-auto text-blue-700">×</button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Ícone de Calendário Interativo */}
        <button 
          onClick={() => navigate("horario")} 
          className="relative shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100" 
          style={{ color: "var(--muted-foreground)" }}
          title="Ver Calendário e Horários"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        </button>

        {/* Notificações */}
        <button onClick={() => navigate("notificacoes")} className="relative shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100" style={{ color: "var(--muted-foreground)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          {unreadNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#ef4444" }}>{unreadNotifs}</span>}
        </button>
      </div>
    </header>
  );
}
