import { useState } from "react";

const eventos = [
  {
    id: 1,
    titulo: "Semana Acadêmica FATEC 2026",
    tipo: "academico",
    data: "26 a 30/08/2026",
    horario: "19h00 – 22h30",
    local: "FATEC São Paulo — Auditório",
    descricao: "Palestras, workshops e feira de estágios com empresas parceiras. Participação obrigatória para alunos de ADS.",
    inscrito: false,
    vagas: 200,
    inscritos: 148,
  },
  {
    id: 2,
    titulo: "Workshop: Desenvolvimento com React e TypeScript",
    tipo: "workshop",
    data: "05/09/2026",
    horario: "09h00 – 17h00",
    local: "Lab 2 — FATEC São Paulo",
    descricao: "Workshop prático de desenvolvimento front-end moderno com React 19, TypeScript e Tailwind CSS.",
    inscrito: true,
    vagas: 30,
    inscritos: 28,
  },
  {
    id: 3,
    titulo: "Palestra: Inteligência Artificial no Mercado de Trabalho",
    tipo: "palestra",
    data: "12/09/2026",
    horario: "19h30 – 21h30",
    local: "Auditório Principal",
    descricao: "Especialistas do mercado debatem os impactos da IA nas profissões de tecnologia e as habilidades do futuro.",
    inscrito: false,
    vagas: 150,
    inscritos: 95,
  },
  {
    id: 4,
    titulo: "Feira de Estágios e Empregos TI 2026",
    tipo: "feira",
    data: "20/09/2026",
    horario: "10h00 – 16h00",
    local: "Ginásio — FATEC São Paulo",
    descricao: "Mais de 40 empresas participantes. Leve seu currículo e prepare-se para entrevistas no mesmo dia.",
    inscrito: false,
    vagas: 500,
    inscritos: 312,
  },
  {
    id: 5,
    titulo: "Hackathon FATEC: Soluções para a Cidade",
    tipo: "competicao",
    data: "03 e 04/10/2026",
    horario: "08h00 – 18h00",
    local: "Lab 1, Lab 2 e Lab 3",
    descricao: "48h de desenvolvimento em equipe. Tema: soluções tecnológicas para problemas urbanos. Premiação para os 3 melhores projetos.",
    inscrito: true,
    vagas: 80,
    inscritos: 72,
  },
];

const tipoStyle: Record<string, { bg: string; color: string; label: string }> = {
  academico: { bg: "#eff6ff", color: "#1d4ed8", label: "Acadêmico" },
  workshop: { bg: "#f0fdf4", color: "#15803d", label: "Workshop" },
  palestra: { bg: "#fdf4ff", color: "#7e22ce", label: "Palestra" },
  feira: { bg: "#fff7ed", color: "#c2410c", label: "Feira" },
  competicao: { bg: "#fef9c3", color: "#854d0e", label: "Competição" },
};

type Filtro = "todos" | "academico" | "workshop" | "palestra" | "feira" | "competicao";

export default function Eventos() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [inscritos, setInscritos] = useState<Set<number>>(new Set(eventos.filter(e => e.inscrito).map(e => e.id)));
  const [toast, setToast] = useState<string | null>(null);

  const filtrados = filtro === "todos" ? eventos : eventos.filter(e => e.tipo === filtro);

  function toggleInscricao(id: number, titulo: string) {
    setInscritos(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
        showToast("Inscrição cancelada.");
      } else {
        novo.add(id);
        showToast(`Concluído Inscrição confirmada em "${titulo}"`);
      }
      return novo;
    });
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Eventos & Atividades</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Eventos acadêmicos, workshops e oportunidades da FATEC
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["todos", "academico", "workshop", "palestra", "feira", "competicao"] as Filtro[]).map(f => (
          <button key={f} onClick={() => setFiltro(f)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={{
            background: filtro === f ? "var(--primary)" : "var(--border)",
            color: filtro === f ? "#fff" : "var(--muted-foreground)",
            fontFamily: "Outfit, sans-serif",
          }}>
            {f === "todos" ? "Todos" : tipoStyle[f].label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-4">
        {filtrados.map(e => {
          const inscrito = inscritos.has(e.id);
          const st = tipoStyle[e.tipo];
          const pct = Math.round((e.inscritos / e.vagas) * 100);
          const quaseEsgotado = pct >= 90;

          return (
            <div key={e.id} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: inscrito ? "var(--primary)" : "var(--border)" }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.color, fontFamily: "Outfit, sans-serif" }}>{st.label}</span>
                      {inscrito && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#dcfce7", color: "#15803d" }}>Inscrito ✓</span>}
                      {quaseEsgotado && !inscrito && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#fef2f2", color: "#b91c1c" }}>Vagas esgotando</span>}
                    </div>
                    <h3 className="font-bold text-base leading-snug" style={{ fontFamily: "Outfit, sans-serif" }}>{e.titulo}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                  <span>Data {e.data}</span>
                  <span>Horário {e.horario}</span>
                  <span>Local {e.local}</span>
                </div>

                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{e.descricao}</p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
                      <span>{e.inscritos} inscritos</span>
                      <span>{e.vagas - e.inscritos} vagas restantes</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: quaseEsgotado ? "#f97316" : "var(--primary)" }} />
                    </div>
                  </div>
                  <button
                    onClick={() => toggleInscricao(e.id, e.titulo)}
                    className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: inscrito ? "var(--background)" : "var(--primary)",
                      color: inscrito ? "var(--muted-foreground)" : "#fff",
                      border: `1px solid ${inscrito ? "var(--border)" : "var(--primary)"}`,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {inscrito ? "Cancelar inscrição" : "Inscrever-se"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
          <div className="text-3xl mb-3">Agenda</div>
          <p className="text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Nenhum evento nesta categoria.</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50 whitespace-nowrap" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
          {toast}
        </div>
      )}
    </div>
  );
}