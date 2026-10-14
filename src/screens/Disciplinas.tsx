import { useState } from "react";

const disciplinas = [
  {
    nome: "Banco de Dados",
    professor: "Prof. Ricardo Alves",
    horario: "Seg 19h00 – 20h40",
    sala: "Lab 3",
    media: 8.4,
    frequencia: 90,
    situacao: "ok",
    avisos: [
      { titulo: "P2 - Prova Prática", data: "22/08/2026", tipo: "prova" }
    ],
    materiais: [
      { tipo: "Apostila", nome: "Apostila BD 2026.pdf", icon: "Documento" },
      { tipo: "Slides", nome: "Aula 15 – Normalização.pptx", icon: "Slides" },
      { tipo: "Exercícios", nome: "Lista 3 – SQL Avançado.pdf", icon: "Exercício" },
      { tipo: "Links", nome: "Documentação PostgreSQL", icon: "Link" },
    ],
  },
  {
    nome: "Estatística Aplicada",
    professor: "Profa. Ana Lima",
    horario: "Seg 20h50 – 22h30",
    sala: "Sala 12",
    media: 5.2,
    frequencia: 72,
    situacao: "atencao",
    avisos: [
      { titulo: "Entrega do Trabalho Final", data: "25/08/2026", tipo: "trabalho" }
    ],
    materiais: [
      { tipo: "Apostila", nome: "Estatística Descritiva.pdf", icon: "Documento" },
      { tipo: "Slides", nome: "Aula 14 – Regressão Linear.pdf", icon: "Slides" },
    ],
  },
  {
    nome: "Python Avançado",
    professor: "Prof. Carlos Mendes",
    horario: "Ter 19h00 – 22h30",
    sala: "Lab 2",
    media: 9.1,
    frequencia: 95,
    situacao: "ok",
    avisos: [],
    materiais: [
      { tipo: "Slides", nome: "Aula 12 – APIs REST.pdf", icon: "Slides" },
      { tipo: "Exercícios", nome: "Projeto Final – Especificação.pdf", icon: "Exercício" },
      { tipo: "Links", nome: "Repositório GitHub da turma", icon: "Link" },
    ],
  },
  {
    nome: "Engenharia de Software",
    professor: "Profa. Fernanda Costa",
    horario: "Qua 19h00 – 22h30",
    sala: "Sala 8",
    media: 7.8,
    frequencia: 85,
    situacao: "ok",
    avisos: [
      { titulo: "P3 - Avaliação Teórica", data: "01/09/2026", tipo: "prova" }
    ],
    materiais: [
      { tipo: "Apostila", nome: "UML e Modelagem.pdf", icon: "Documento" },
      { tipo: "Trabalhos", nome: "Entrega T2 – Diagrama de Classes.zip", icon: "Arquivo" },
    ],
  },
  {
    nome: "Redes de Computadores",
    professor: "Prof. João Pereira",
    horario: "Qui 19h00 – 22h30",
    sala: "Lab 1",
    media: 6.0,
    frequencia: 78,
    situacao: "atencao",
    avisos: [],
    materiais: [
      { tipo: "Slides", nome: "Aula 11 – Protocolo TCP-IP.pdf", icon: "Slides" },
    ],
  },
];

export default function Disciplinas() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Minhas Disciplinas</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>3º semestre · 1º semestre 2026 · 5 disciplinas</p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: "var(--secondary)", color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>
          325h/sem
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {disciplinas.map((d, i) => (
          <div key={i} className="bg-white rounded-xl border overflow-hidden transition-shadow hover:shadow-sm" style={{ borderColor: d.situacao === "atencao" ? "#fed7aa" : "var(--border)" }}>
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="shrink-0 w-2 h-10 rounded-full" style={{ background: d.situacao === "atencao" ? "#f97316" : "var(--primary)" }} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</span>
                  {d.situacao === "atencao" && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#fff7ed", color: "#c2410c" }}>Atenção</span>
                  )}
                  {/* Indicador visual rápido se houver avisos */}
                  {d.avisos.length > 0 && expanded !== i && (
                     <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} title="Você tem avaliações próximas" />
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{d.professor} · {d.horario} · {d.sala}</div>
              </div>

              <div className="hidden sm:flex items-center gap-5 shrink-0">
                <div className="text-center">
                  <div className="text-base font-bold" style={{ fontFamily: "Outfit, sans-serif", color: d.media < 5 ? "#ef4444" : d.media < 7 ? "#f97316" : "#16a34a" }}>{d.media}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Média</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold" style={{ fontFamily: "Outfit, sans-serif", color: d.frequencia < 75 ? "#ef4444" : "var(--foreground)" }}>{d.frequencia}%</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Freq.</div>
                </div>
              </div>

              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 transition-transform" style={{ color: "var(--muted-foreground)", transform: expanded === i ? "rotate(180deg)" : "rotate(0)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expanded === i && (
              <div className="border-t px-5 py-4" style={{ borderColor: "var(--border)" }}>
                
                {/* AVISOS IMPORTANTES (PROVAS/TRABALHOS) */}
                {d.avisos.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1" style={{ color: "#b91c1c", fontFamily: "Outfit, sans-serif" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      Avisos Importantes
                    </h4>
                    <div className="flex flex-col gap-2">
                      {d.avisos.map((aviso, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg border" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                           <span className="text-xs font-medium" style={{ color: "#9a3412", fontFamily: "Inter, sans-serif" }}>{aviso.titulo}</span>
                           <span className="text-xs font-bold" style={{ color: "#c2410c", fontFamily: "Outfit, sans-serif" }}>{aviso.data}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex sm:hidden gap-4 mb-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <div className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: d.media < 7 ? "#f97316" : "#16a34a" }}>{d.media}</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Média atual</div>
                  </div>
                  <div className="w-px" style={{ background: "var(--border)" }} />
                  <div>
                    <div className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: d.frequencia < 75 ? "#ef4444" : "var(--foreground)" }}>{d.frequencia}%</div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Frequência</div>
                  </div>
                  {d.frequencia < 75 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                      Atenção: limite próximo
                    </div>
                  )}
                </div>

                <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>
                   Materiais da disciplina
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {d.materiais.map((m, j) => (
                    <button key={j} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>
                      <span className="text-lg">{m.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{m.nome}</div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{m.tipo}</div>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 ml-auto" style={{ color: "var(--muted-foreground)" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
