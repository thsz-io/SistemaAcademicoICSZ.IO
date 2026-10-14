import { useState } from "react";
import type { UserData } from "./Login";

type Step = 1 | 2 | 3;
type TabOption = 'rematricula' | 'ajuste';

const disciplinasDisponiveis = [
  { id: 1, nome: "Banco de Dados II", professor: "Prof. Ricardo Alves", horario: "Seg 19h00 – 20h40", creditos: 4, obrigatoria: true },
  { id: 2, nome: "Programação Web", professor: "Profa. Fernanda Costa", horario: "Ter 19h00 – 20h40", creditos: 4, obrigatoria: true },
  { id: 3, nome: "Computação em Nuvem", professor: "Prof. Carlos Mendes", horario: "Qua 19h00 – 20h40", creditos: 4, obrigatoria: false },
  { id: 4, nome: "Inteligência Artificial", professor: "Prof. João Pereira", horario: "Qui 19h00 – 20h40", creditos: 4, obrigatoria: true },
  { id: 5, nome: "Gestão de Projetos", professor: "Profa. Ana Lima", horario: "Sex 19h00 – 20h40", creditos: 2, obrigatoria: false },
  { id: 6, nome: "Segurança da Informação", professor: "Prof. Marcos Silva", horario: "Ter 20h50 – 22h30", creditos: 4, obrigatoria: false },
  { id: 7, nome: "DevOps e CI/CD", professor: "Prof. Carlos Mendes", horario: "Qua 20h50 – 22h30", creditos: 2, obrigatoria: false },
];

function conflictoHorario(selecionadas: number[], nova: number): boolean {
  const s = disciplinasDisponiveis.find(d => d.id === nova);
  if (!s) return false;
  const selObjs = disciplinasDisponiveis.filter(d => selecionadas.includes(d.id));
  return selObjs.some(d => {
    const diaA = d.horario.split(" ")[0];
    const diaB = s.horario.split(" ")[0];
    const hA = d.horario.split(" ")[1];
    const hB = s.horario.split(" ")[1];
    return diaA === diaB && hA === hB && d.id !== nova;
  });
}

const stepLabels = ["Disciplinas", "Horários", "Revisão"];

interface Props { user: UserData; }

export default function Rematricula({ user }: Props) {
  const [activeTab, setActiveTab] = useState<TabOption>('rematricula');
  const [step, setStep] = useState<Step>(1);
  const [selecionadas, setSelecionadas] = useState<number[]>([1, 2, 4]);
  const [confirmed, setConfirmed] = useState(false);
  const [protocol, setProtocol] = useState("");
  
  // Estado para modais de Ajuste de Grade
  const [ajusteModal, setAjusteModal] = useState<{ tipo: 'cancelar' | 'trancar', id?: number } | null>(null);

  function toggle(id: number) {
    if (selecionadas.includes(id)) {
      setSelecionadas(s => s.filter(x => x !== id));
    } else {
      setSelecionadas(s => [...s, id]);
    }
  }

  function handleConfirmarAjuste() {
    if (ajusteModal?.tipo === 'cancelar' && ajusteModal.id) {
      setSelecionadas(s => s.filter(x => x !== ajusteModal.id));
    } else if (ajusteModal?.tipo === 'trancar') {
      setSelecionadas([]); // Zera a grade em caso de trancamento
    }
    setAjusteModal(null);
    alert("Solicitação de ajuste enviada para análise da secretaria!");
  }

  const totalCreditos = disciplinasDisponiveis.filter(d => selecionadas.includes(d.id)).reduce((a, d) => a + d.creditos, 0);
  const selecionadasObjs = disciplinasDisponiveis.filter(d => selecionadas.includes(d.id));

  function handleConfirmarRematricula() {
    const id = Date.now();
    const protocolValue = `#2026-${new Date().toLocaleDateString("pt-BR").replaceAll("/", "")}-${String(id).slice(-5)}`;
    const submittedAt = new Date().toLocaleString("pt-BR");
    const payload = {
      id,
      studentId: 0,
      student: user.name,
      studentEmail: user.email,
      ra: "",
      course: "ADS",
      fromSemester: "4º",
      toSemester: "5º",
      disciplines: selecionadasObjs.map(d => d.nome),
      submittedAt,
      status: "Nova",
      protocol: protocolValue,
    };

    try {
      const current = JSON.parse(localStorage.getItem("siga-rematriculas-submetidas") || "[]");
      const withoutSameStudent = current.filter((item: any) => item.studentEmail !== user.email);
      localStorage.setItem("siga-rematriculas-submetidas", JSON.stringify([payload, ...withoutSameStudent]));
    } catch {
      localStorage.setItem("siga-rematriculas-submetidas", JSON.stringify([payload]));
    }

    localStorage.setItem("siga-last-reenrollment-submission", JSON.stringify(payload));
    setProtocol(protocolValue);
    setConfirmed(true);
  }

  // TELA DE SUCESSO DA REMATRÍCULA
  if (confirmed && activeTab === 'rematricula') {
    return (
      <div className="px-4 md:px-8 py-12 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#dcfce7" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Rematrícula confirmada!</h2>
        <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>Sua rematrícula para o 2º semestre de 2026 foi realizada com sucesso.</p>
        <p className="text-xs mb-8" style={{ color: "var(--muted-foreground)" }}>Protocolo: {protocol || "—"} · {selecionadas.length} disciplinas · {totalCreditos} créditos</p>
        <div className="bg-white rounded-xl border p-5 text-left mb-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Disciplinas matriculadas</h3>
          <div className="flex flex-col gap-2">
            {selecionadasObjs.map(d => (
              <div key={d.id} className="flex items-center gap-3 text-sm">
                <span style={{ color: "#16a34a" }}>✓</span>
                <span style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</span>
                <span className="ml-auto text-xs" style={{ color: "var(--muted-foreground)" }}>{d.creditos}cr</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => { setStep(1); setConfirmed(false); setActiveTab('ajuste'); }} className="text-sm font-medium px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors" style={{ borderColor: "var(--border)", fontFamily: "Outfit, sans-serif" }}>
          Ir para Ajuste de Grade
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-6 relative">
      {/* Header com Abas */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Gestão de Matrícula</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "#fef9c3", color: "#854d0e" }}>Prazo de Ajuste: 30/08/2026</span>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>Próximo período letivo · 3º semestre ADS</p>

        {/* Custom Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-sm">
          <button onClick={() => setActiveTab('rematricula')} className="flex-1 py-1.5 text-sm font-semibold rounded-md transition-all" style={{ background: activeTab === 'rematricula' ? "#fff" : "transparent", color: activeTab === 'rematricula' ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: activeTab === 'rematricula' ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            Fazer Rematrícula
          </button>
          <button onClick={() => setActiveTab('ajuste')} className="flex-1 py-1.5 text-sm font-semibold rounded-md transition-all" style={{ background: activeTab === 'ajuste' ? "#fff" : "transparent", color: activeTab === 'ajuste' ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: activeTab === 'ajuste' ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
            Ajuste de Grade
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA: REMATRÍCULA (Original Flow) */}
      {activeTab === 'rematricula' && (
        <>
          {/* Stepper */}
          <div className="flex items-center gap-0">
            {stepLabels.map((label, i) => {
              const s = (i + 1) as Step;
              const done = step > s;
              const active = step === s;
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{
                      background: done ? "#16a34a" : active ? "var(--primary)" : "var(--border)",
                      color: done || active ? "#fff" : "var(--muted-foreground)",
                      fontFamily: "Outfit, sans-serif",
                    }}>
                      {done ? "✓" : s}
                    </div>
                    <span className="text-xs whitespace-nowrap hidden md:block" style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", fontFamily: "Outfit, sans-serif", fontWeight: active ? 600 : 400 }}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && <div className="flex-1 h-0.5 mx-1" style={{ background: done ? "#16a34a" : "var(--border)" }} />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Selecionar disciplinas */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Selecione as disciplinas para o próximo semestre.</p>
                <span className="text-xs font-medium" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>{totalCreditos}cr selecionados</span>
              </div>
              {disciplinasDisponiveis.map(d => {
                const sel = selecionadas.includes(d.id);
                const conflict = sel ? false : conflictoHorario(selecionadas, d.id);
                return (
                  <button key={d.id} onClick={() => !conflict && toggle(d.id)} className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-xl border text-left transition-all" style={{
                    borderColor: sel ? "var(--primary)" : conflict ? "#fecaca" : "var(--border)",
                    opacity: conflict ? 0.5 : 1,
                    background: sel ? "#eff6ff" : "#fff",
                  }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all" style={{
                      background: sel ? "var(--primary)" : "#fff",
                      border: `2px solid ${sel ? "var(--primary)" : "var(--border)"}`,
                    }}>
                      {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</span>
                        {d.obrigatoria && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--secondary)", color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>Obrigatória</span>}
                        {conflict && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#fef2f2", color: "#b91c1c" }}>Conflito de horário</span>}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{d.professor} · {d.horario}</div>
                    </div>
                    <span className="text-xs font-medium shrink-0" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>{d.creditos}cr</span>
                  </button>
                );
              })}
              <div className="flex justify-end pt-2">
                <button onClick={() => setStep(2)} disabled={selecionadas.length === 0} className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all" style={{ background: selecionadas.length > 0 ? "var(--primary)" : "var(--border)", color: selecionadas.length > 0 ? "#fff" : "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>
                  Confirmar seleção →
                </button>
              </div>
            </div>
          )}

          {/* Etapas 2 e 3 */}
          {(step === 2 || step === 3) && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {step === 2 ? "Horários selecionados" : "Revisão final"}
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {selecionadasObjs.map(d => (
                    <div key={d.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--primary)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{d.horario} · {d.professor}</div>
                      </div>
                      <span className="text-xs font-medium shrink-0" style={{ color: "var(--muted-foreground)" }}>{d.creditos}cr</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)", background: "var(--background)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Total</span>
                    <span className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--primary)" }}>{selecionadas.length} disciplinas · {totalCreditos} créditos</span>
                  </div>
                </div>
              </div>

              {step === 3 && (
                <div className="px-4 py-3 rounded-lg border flex items-start gap-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-xs" style={{ color: "#15803d", fontFamily: "Inter, sans-serif" }}>
                    Ao confirmar, você concorda com as disciplinas selecionadas e a carga horária de {totalCreditos} créditos para o 2º semestre de 2026. Esta ação poderá ser revisada enquanto o período de rematrícula estiver aberto.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setStep(s => (s - 1) as Step)} className="text-sm font-medium" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>
                  ← Voltar
                </button>
                <button
                  onClick={() => step < 3 ? setStep(s => (s + 1) as Step) : handleConfirmarRematricula()}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm"
                  style={{ background: step === 3 ? "#16a34a" : "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}
                >
                  {step === 3 ? "Confirmar rematrícula" : "Continuar →"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* CONTEÚDO DA ABA: AJUSTE DE GRADE */}
      {activeTab === 'ajuste' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border)", background: "#fafafa" }}>
              <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Disciplinas em curso ({selecionadasObjs.length})</h3>
            </div>
            
            {selecionadasObjs.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>Nenhuma disciplina selecionada.</div>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {selecionadasObjs.map(d => (
                  <div key={d.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{d.nome}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{d.horario} · {d.professor}</div>
                    </div>
                    <button 
                      onClick={() => setAjusteModal({ tipo: 'cancelar', id: d.id })}
                      className="text-xs font-semibold px-3 py-1.5 rounded border bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      style={{ color: "#b91c1c", borderColor: "var(--border)", fontFamily: "Inter, sans-serif" }}
                    >
                      Cancelar Matéria
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#fef2f2] rounded-xl border border-red-200 p-5 flex flex-col sm:flex-row gap-4 items-start justify-between">
            <div>
              <h4 className="font-bold text-sm" style={{ color: "#991b1b", fontFamily: "Outfit, sans-serif" }}>Pausa / Trancamento de Semestre</h4>
              <p className="text-xs mt-1" style={{ color: "#b91c1c", fontFamily: "Inter, sans-serif" }}>Não poderá cursar este semestre? Solicite o trancamento total da sua matrícula. Esta ação requer avaliação da secretaria.</p>
            </div>
            <button 
              onClick={() => setAjusteModal({ tipo: 'trancar' })}
              className="text-xs font-bold px-4 py-2 rounded shrink-0 transition-colors"
              style={{ background: "#ef4444", color: "#fff", fontFamily: "Inter, sans-serif" }}
            >
              Trancar Semestre
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE AJUSTE (CANCELAMENTO / TRANCAMENTO) */}
      {ajusteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fef2f2" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              {ajusteModal.tipo === 'cancelar' ? "Cancelar Matéria?" : "Trancar Semestre?"}
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              {ajusteModal.tipo === 'cancelar' 
                ? "Você está prestes a solicitar o cancelamento desta disciplina. Isso removerá a matéria da sua grade atual." 
                : "O trancamento total irá pausar seus estudos. Você precisará solicitar o destrancamento no próximo semestre."}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setAjusteModal(null)} 
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "Outfit, sans-serif" }}
              >
                Voltar
              </button>
              <button 
                onClick={handleConfirmarAjuste}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "#ef4444", color: "#fff", fontFamily: "Outfit, sans-serif" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
