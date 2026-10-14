import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const disciplinas = [
  { nome: "Banco de Dados", abrev: "BD", media: 8.4, p1: 8.0, p2: 8.8, trab: 8.5, faltas: 4, totalAulas: 40, mediaMinima: 6, faltasMaximas: 10, situacao: "ok" },
  { nome: "Estatística Aplicada", abrev: "Est", media: 5.2, p1: 4.5, p2: 5.9, trab: 5.2, faltas: 9, totalAulas: 40, mediaMinima: 6, faltasMaximas: 10, situacao: "atencao" },
  { nome: "Python Avançado", abrev: "Py", media: 9.1, p1: 9.5, p2: 8.7, trab: 9.1, faltas: 2, totalAulas: 60, mediaMinima: 6, faltasMaximas: 15, situacao: "ok" },
  { nome: "Engenharia de Software", abrev: "ES", media: 7.8, p1: 7.5, p2: 8.1, trab: 7.8, faltas: 6, totalAulas: 60, mediaMinima: 6, faltasMaximas: 15, situacao: "ok" },
  { nome: "Redes de Computadores", abrev: "Redes", media: 6.0, p1: 5.5, p2: 6.5, trab: 6.0, faltas: 8, totalAulas: 60, mediaMinima: 6, faltasMaximas: 15, situacao: "atencao" },
];

const radarData = disciplinas.map(d => ({ subject: d.abrev, nota: d.media, max: 10 }));

function situacaoColor(s: string) {
  if (s === "ok") return "#16a34a";
  if (s === "atencao") return "#f97316";
  return "#ef4444";
}

function situacaoLabel(d: typeof disciplinas[0]) {
  if (d.media >= d.mediaMinima && d.faltas < d.faltasMaximas) return { label: "Em andamento", color: "#16a34a", bg: "#dcfce7" };
  if (d.media < d.mediaMinima) return { label: "Atenção — Nota", color: "#c2410c", bg: "#fff7ed" };
  return { label: "Atenção — Faltas", color: "#b91c1c", bg: "#fef2f2" };
}

export default function Notas() {
  const [tab, setTab] = useState<"notas" | "frequencia">("notas");

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Notas & Frequência</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>1º semestre 2026 · Atualizado em 18/08/2026</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--border)" }}>
        {(["notas", "frequencia"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize" style={{
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? "var(--primary)" : "var(--muted-foreground)",
            fontFamily: "Outfit, sans-serif",
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
          }}>
            {t === "notas" ? "Notas" : "Frequência"}
          </button>
        ))}
      </div>

      {tab === "notas" && (
        <>
          {/* Radar chart */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Desempenho geral</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div style={{ width: "100%", maxWidth: 280, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: "Outfit, sans-serif", fill: "#64748b" }} />
                    <Radar name="Nota" dataKey="nota" stroke="#0f3460" fill="#0f3460" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#0f3460" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disciplinas.map(d => ({ name: d.abrev, media: d.media, minima: 6 }))} barSize={32}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Outfit, sans-serif", fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                      {disciplinas.map((d, i) => <Cell key={i} fill={d.situacao === "atencao" ? "#f97316" : "#0f3460"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Detalhamento por disciplina</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--background)" }}>
                    {["Disciplina", "P1", "P2", "Trab.", "Média", "Situação"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {disciplinas.map((d, i) => {
                    const s = situacaoLabel(d);
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-xs" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</td>
                        <td className="px-5 py-3.5 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{d.p1}</td>
                        <td className="px-5 py-3.5 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{d.p2}</td>
                        <td className="px-5 py-3.5 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{d.trab}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-sm" style={{ fontFamily: "Outfit, sans-serif", color: situacaoColor(d.situacao) }}>{d.media}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color, fontFamily: "Outfit, sans-serif" }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "frequencia" && (
        <div className="flex flex-col gap-4">
          {disciplinas.map((d, i) => {
            const pct = Math.round(((d.totalAulas - d.faltas) / d.totalAulas) * 100);
            const faltasRestantes = d.faltasMaximas - d.faltas;
            const critico = faltasRestantes <= 2;
            return (
              <div key={i} className="bg-white rounded-xl border p-5" style={{ borderColor: critico ? "#fecaca" : "var(--border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{d.faltas} faltas de {d.totalAulas} aulas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: pct < 75 ? "#ef4444" : pct < 85 ? "#f97316" : "#16a34a" }}>{pct}%</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>frequência</div>
                  </div>
                </div>

                <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct < 75 ? "#ef4444" : pct < 85 ? "#f97316" : "#0f3460" }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--muted-foreground)" }}>
                    {faltasRestantes > 0 ? `Ainda pode faltar ${faltasRestantes}x` : "Limite de faltas atingido"}
                  </span>
                  {critico && (
                    <span className="flex items-center gap-1 font-medium" style={{ color: "#b91c1c" }}>
                      Atenção — {faltasRestantes <= 0 ? "Reprovado por falta" : "limite próximo"}
                    </span>
                  )}
                  {!critico && pct >= 85 && (
                    <span className="font-medium" style={{ color: "#16a34a" }}>✓ Situação regular</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
