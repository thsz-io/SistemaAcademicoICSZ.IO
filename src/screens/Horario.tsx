import { useState } from "react";

const dias = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const diasFull = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const horarios = [
  { hora: "19h00", slots: ["Banco de Dados", "Python Avançado", "", "", ""] },
  { hora: "19h50", slots: ["Banco de Dados", "Python Avançado", "Engenharia de Software", "Redes de Computadores", ""] },
  { hora: "20h40", slots: ["", "", "Engenharia de Software", "Redes de Computadores", ""] },
  { hora: "20h50", slots: ["Estatística Aplicada", "Python Avançado", "", "", ""] },
  { hora: "21h40", slots: ["Estatística Aplicada", "Python Avançado", "Engenharia de Software", "Redes de Computadores", ""] },
  { hora: "22h30", slots: ["", "", "", "", ""] },
];

const cores: Record<string, { bg: string; color: string; border: string }> = {
  "Banco de Dados": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Estatística Aplicada": { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "Python Avançado": { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "Engenharia de Software": { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  "Redes de Computadores": { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
};

const professores: Record<string, string> = {
  "Banco de Dados": "Prof. Ricardo Alves · Lab 3",
  "Estatística Aplicada": "Profa. Ana Lima · Sala 12",
  "Python Avançado": "Prof. Carlos Mendes · Lab 2",
  "Engenharia de Software": "Profa. Fernanda Costa · Sala 8",
  "Redes de Computadores": "Prof. João Pereira · Lab 1",
};

const diaHoje = 0; // Seg

export default function Horario() {
  const [view, setView] = useState<"semana" | "hoje">("semana");

  const diasFiltrados = view === "hoje" ? [0] : [0, 1, 2, 3, 4];

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Horário de Aulas</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>1º semestre 2026 · 3º semestre ADS</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--border)" }}>
          {(["hoje", "semana"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize" style={{
              background: view === v ? "#fff" : "transparent",
              color: view === v ? "var(--primary)" : "var(--muted-foreground)",
              fontFamily: "Outfit, sans-serif",
              boxShadow: view === v ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
              {v === "hoje" ? "Hoje" : "Semana"}
            </button>
          ))}
        </div>
      </div>

      {/* Grade */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: view === "semana" ? 600 : 300 }}>
            <thead>
              <tr style={{ background: "var(--background)" }}>
                <th className="w-16 px-3 py-3 text-left text-xs font-semibold" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif", borderBottom: "1px solid var(--border)" }}>Hora</th>
                {diasFiltrados.map(di => (
                  <th key={di} className="px-3 py-3 text-left text-xs font-semibold" style={{
                    color: di === diaHoje ? "var(--primary)" : "var(--muted-foreground)",
                    fontFamily: "Outfit, sans-serif",
                    borderBottom: "1px solid var(--border)",
                    background: di === diaHoje ? "rgba(15,52,96,0.04)" : "transparent",
                  }}>
                    <span className="hidden md:block">{diasFull[di]}</span>
                    <span className="md:hidden">{dias[di]}</span>
                    {di === diaHoje && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: "var(--primary)", color: "#fff" }}>Hoje</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horarios.map((row, ri) => (
                <tr key={ri} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="px-3 py-2 text-xs font-medium align-top pt-3" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>{row.hora}</td>
                  {diasFiltrados.map(di => {
                    const disc = row.slots[di];
                    const c = disc ? cores[disc] : null;
                    return (
                      <td key={di} className="px-2 py-2" style={{ background: di === diaHoje ? "rgba(15,52,96,0.02)" : "transparent" }}>
                        {disc && (
                          <div className="rounded-lg px-2.5 py-2 text-xs border" style={{ background: c!.bg, color: c!.color, borderColor: c!.border }}>
                            <div className="font-semibold leading-snug" style={{ fontFamily: "Outfit, sans-serif" }}>{disc}</div>
                            <div className="mt-0.5 opacity-70 text-xs" style={{ fontFamily: "Inter, sans-serif", fontSize: 10 }}>{professores[disc]}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(cores).map(([nome, c]) => (
          <div key={nome} className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "Inter, sans-serif", color: "var(--muted-foreground)" }}>
            <div className="w-3 h-3 rounded" style={{ background: c.bg, border: `1px solid ${c.border}` }} />
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}
