import { useState } from "react";

const documentosPrincipais = [
  { nome: "Histórico Escolar", desc: "Parcial · 1º sem 2026", icon: "Declaração", disponivel: true },
  { nome: "Grade Curricular", desc: "ADS · 3 anos", icon: "Data", disponivel: true },
  { nome: "Atestado de Frequência", desc: "Atual", icon: "Concluído", disponivel: true },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  concluida: { bg: "#dcfce7", color: "#15803d" },
  andamento: { bg: "#eff6ff", color: "#1d4ed8" },
  pendente: { bg: "#fff7ed", color: "#c2410c" },
};

type NovaStep = 1 | 2 | 3;

const tiposDoc = [
  "Segunda via do Histórico Escolar",
  "Declaração de Matrícula",
  "Declaração para Estágio",
  "Declaração para FIES/ProUni",
  "Atestado de Frequência",
  "Revisão de Nota",
  "Outro",
];

export default function Documentos() {
  const [novaModal, setNovaModal] = useState(false);
  const [step, setStep] = useState<NovaStep>(1);
  const [tipo, setTipo] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Estado para controlar o dropdown de declarações
  const [showDeclaracoes, setShowDeclaracoes] = useState(false);

  // Estado para visualização de documentos (Botão "Ver")
  const [viewDocModal, setViewDocModal] = useState<{ id: string, tipo: string } | null>(null);

  // Estado inicial das solicitações agora é dinâmico
  const [solicitacoes, setSolicitacoes] = useState([
    { id: "#2026-081", tipo: "Segunda via do Histórico", data: "12/08/2026", status: "concluida", statusLabel: "Concluída" },
    { id: "#2026-074", tipo: "Declaração para FIES", data: "05/08/2026", status: "andamento", statusLabel: "Em andamento" },
    { id: "#2026-059", tipo: "Revisão de nota — Estatística", data: "28/07/2026", status: "pendente", statusLabel: "Pendente documentação" },
  ]);

  function handleEnviar() {
    setSuccess(true);
    
    // Adiciona a nova solicitação instantaneamente na lista
    const novaSolicitacao = {
      id: `#2026-${Math.floor(100 + Math.random() * 900)}`,
      tipo: tipo,
      data: new Date().toLocaleDateString('pt-BR'),
      status: "andamento",
      statusLabel: "Em andamento"
    };

    setTimeout(() => { 
      setSolicitacoes([novaSolicitacao, ...solicitacoes]);
      setSuccess(false); 
      setNovaModal(false); 
      setStep(1); 
      setTipo(""); 
      setJustificativa(""); 
    }, 2000);
  }

  function handleDownloadDecl(tipo: string) {
    alert(`Gerando PDF da Declaração de ${tipo}...`);
    setShowDeclaracoes(false);
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Documentos & Solicitações</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>Documentos acadêmicos e acompanhamento de solicitações</p>
        </div>
        <button onClick={() => setNovaModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 shadow-sm" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Nova solicitação
        </button>
      </div>

      {/* Documentos disponíveis */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>Documentos disponíveis</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 relative">
          
          {/* Botão Agrupado de Declarações (Dropdown) */}
          <div className="relative">
            <button 
              onClick={() => setShowDeclaracoes(!showDeclaracoes)} 
              className="w-full flex items-start gap-3 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-sm hover:-translate-y-0.5" 
              style={{ borderColor: showDeclaracoes ? "var(--primary)" : "var(--border)" }}
            >
              <span className="text-xl">Documento</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif", color: showDeclaracoes ? "var(--primary)" : "inherit" }}>Declarações</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Múltiplos tipos</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)", transform: showDeclaracoes ? "rotate(180deg)" : "none" }} className="shrink-0 mt-0.5 transition-transform">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Options */}
            {showDeclaracoes && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-10 overflow-hidden" style={{ borderColor: "var(--border)" }}>
                {['Matrícula', 'Vínculo', 'Estágio'].map(d => (
                  <button key={d} onClick={() => handleDownloadDecl(d)} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors border-b last:border-0" style={{ borderColor: "var(--border)", fontFamily: "Inter, sans-serif" }}>
                    Declaração de {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outros Documentos */}
          {documentosPrincipais.map((d, i) => (
            <button key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-sm hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}>
              <span className="text-xl">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{d.desc}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--muted-foreground)", shrink: 0 }} className="shrink-0 mt-0.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Solicitações em andamento */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>Minhas Solicitações</h3>
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {solicitacoes.map((s, i) => {
              const st = statusStyle[s.status];
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{s.tipo}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{s.id} · Enviada em {s.data}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 text-center" style={{ background: st.bg, color: st.color, fontFamily: "Outfit, sans-serif", minWidth: "120px" }}>
                      {s.statusLabel}
                    </span>
                    {/* Botão VER Ativo */}
                    <button 
                      onClick={() => setViewDocModal({ id: s.id, tipo: s.tipo })}
                      className="text-xs shrink-0 font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors" 
                      style={{ color: "var(--primary)", fontFamily: "Inter, sans-serif" }}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Visualização da Solicitação ("Ver") */}
      {viewDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={e => e.target === e.currentTarget && setViewDocModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-6" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Detalhes da Solicitação</h3>
            <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>Protocolo {viewDocModal.id}</p>
            
            <div className="p-4 rounded-xl mb-6" style={{ background: "var(--background)" }}>
               <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Tipo</div>
               <div className="text-sm font-medium mb-3">{viewDocModal.tipo}</div>
               <div className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Atualização</div>
               <div className="text-sm">Seu pedido foi recebido e está na fila de análise da secretaria acadêmica. O prazo médio de resposta é de 3 dias úteis.</div>
            </div>

            <button onClick={() => setViewDocModal(null)} className="w-full py-2.5 rounded-lg font-semibold text-sm" style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Nova Solicitação */}
      {novaModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={e => e.target === e.currentTarget && setNovaModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {success ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#dcfce7" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Solicitação enviada!</h3>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Você receberá uma notificação sobre o andamento.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>Nova solicitação</h3>
                  <button onClick={() => setNovaModal(false)} style={{ color: "var(--muted-foreground)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                <div className="flex gap-1 px-6 pt-4">
                  {[1, 2, 3].map(s => (
                    <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: step >= s ? "var(--primary)" : "var(--border)" }} />
                  ))}
                </div>
                <div className="text-xs px-6 pt-1 pb-4" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>
                  Etapa {step} de 3 — {step === 1 ? "Tipo de solicitação" : step === 2 ? "Detalhes" : "Revisão"}
                </div>

                <div className="px-6 pb-6 space-y-4">
                  {step === 1 && (
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      {tiposDoc.map(t => (
                        <button key={t} onClick={() => setTipo(t)} className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all" style={{
                          borderColor: tipo === t ? "var(--primary)" : "var(--border)",
                          background: tipo === t ? "#eff6ff" : "#fff",
                          fontFamily: "Inter, sans-serif",
                          color: "var(--foreground)",
                        }}>
                          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: tipo === t ? "var(--primary)" : "var(--border)" }}>
                            {tipo === t && <div className="w-2 h-2 rounded-full" style={{ background: "var(--primary)" }} />}
                          </div>
                          {t}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="px-4 py-3 rounded-lg" style={{ background: "var(--background)" }}>
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Tipo</span>
                        <div className="font-medium text-sm mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{tipo}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Justificativa <span style={{ color: "var(--muted-foreground)" }}>(opcional)</span></label>
                        <textarea
                          className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none outline-none"
                          rows={4}
                          placeholder="Descreva o motivo da solicitação..."
                          value={justificativa}
                          onChange={e => setJustificativa(e.target.value)}
                          style={{ borderColor: "var(--border)", fontFamily: "Inter, sans-serif" }}
                        />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <div className="px-4 py-4 rounded-xl" style={{ background: "var(--background)" }}>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex"><span className="w-24 text-xs" style={{ color: "var(--muted-foreground)" }}>Tipo</span><span style={{ fontFamily: "Outfit, sans-serif" }}>{tipo}</span></div>
                          {justificativa && <div className="flex flex-col gap-1 mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}><span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Justificativa</span><span className="text-xs" style={{ fontFamily: "Inter, sans-serif" }}>{justificativa}</span></div>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button onClick={() => step > 1 ? setStep(s => (s - 1) as NovaStep) : setNovaModal(false)} className="text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>
                      {step === 1 ? "Cancelar" : "← Voltar"}
                    </button>
                    <button
                      onClick={() => step < 3 ? (tipo && setStep(s => (s + 1) as NovaStep)) : handleEnviar()}
                      disabled={step === 1 && !tipo}
                      className="px-5 py-2 rounded-lg font-semibold text-sm"
                      style={{ background: step === 1 && !tipo ? "var(--border)" : step === 3 ? "#16a34a" : "var(--primary)", color: step === 1 && !tipo ? "var(--muted-foreground)" : "#fff", fontFamily: "Outfit, sans-serif" }}
                    >
                      {step === 3 ? "Enviar solicitação" : "Continuar →"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
