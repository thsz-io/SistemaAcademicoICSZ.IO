import { useEffect, useState } from "react";

const notificacoes = [
  { id: 1, tipo: "urgente", titulo: "Prazo de rematrícula", texto: "O prazo para atualização da rematrícula permanece aberto até 30/09/2026. Acesse o sistema e confirme suas disciplinas.", data: "Hoje, 09h12", lida: false },
  { id: 2, tipo: "urgente", titulo: "Exame especial — Estatística Aplicada", texto: "Solicitações de exame especial devem ser enviadas até 30/09/2026. Documentação comprobatória obrigatória.", data: "Hoje, 08h00", lida: false },
  { id: 3, tipo: "academico", titulo: "Nota lançada — Banco de Dados P2", texto: "Sua nota da P2 de Banco de Dados foi lançada: 8,8. Sua média atual é 8,4.", data: "Ontem, 18h30", lida: false },
  { id: 4, tipo: "academico", titulo: "Semana Acadêmica FATEC", texto: "A Semana Acadêmica acontece de 26 a 30 de agosto. Haverá palestras, workshops e feira de estágios. Confirme presença.", data: "17/08, 14h00", lida: true },
  { id: 5, tipo: "administrativo", titulo: "Documento disponível para retirada", texto: "Sua segunda via do histórico escolar está disponível na secretaria da FATEC São Paulo. Compareça com documento de identidade.", data: "15/08, 10h22", lida: true },
  { id: 6, tipo: "administrativo", titulo: "Calendário acadêmico atualizado", texto: "O calendário acadêmico do 2º semestre de 2026 foi publicado. Consulte o portal para verificar datas de avaliações e recessos.", data: "12/08, 09h00", lida: true },
];

const tipoStyle: Record<string, { bg: string; color: string; label: string; icon: "alert" | "book" | "file" }> = {
  urgente: { icon: "alert", bg: "#fef2f2", color: "#b91c1c", label: "Urgente" },
  academico: { icon: "book", bg: "#eff6ff", color: "#1d4ed8", label: "Acadêmico" },
  administrativo: { icon: "file", bg: "#f8fafc", color: "#475569", label: "Administrativo" },
};

type Filtro = "todas" | "urgente" | "academico" | "administrativo";

interface Props {
  onUnreadChange?: (count: number) => void;
}

export default function Notificacoes({ onUnreadChange }: Props) {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [lidas, setLidas] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("siga-read-notifications");
    return saved ? new Set(JSON.parse(saved)) : new Set(notificacoes.filter(n => n.lida).map(n => n.id));
  });

  useEffect(() => {
    localStorage.setItem("siga-read-notifications", JSON.stringify([...lidas]));
  }, [lidas]);

  const filtradas = filtro === "todas" ? notificacoes : notificacoes.filter(n => n.tipo === filtro);
  const naoLidas = notificacoes.filter(n => !lidas.has(n.id)).length;

  function marcarLida(id: number) {
    const novoSet = new Set([...lidas, id]);
    setLidas(novoSet);
    const restantes = notificacoes.filter(n => !novoSet.has(n.id)).length;
    if (onUnreadChange) onUnreadChange(restantes);
  }

  function marcarTodas() {
    setLidas(new Set(notificacoes.map(n => n.id)));
    if (onUnreadChange) onUnreadChange(0);
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Avisos</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {naoLidas > 0 ? `${naoLidas} não lida${naoLidas > 1 ? "s" : ""}` : "Tudo em dia"}
          </p>
        </div>
        {naoLidas > 0 && (
          <button onClick={marcarTodas} className="text-xs font-medium hover:underline" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "urgente", "academico", "administrativo"] as Filtro[]).map(f => (
          <button key={f} onClick={() => setFiltro(f)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize" style={{
            background: filtro === f ? "var(--primary)" : "var(--border)",
            color: filtro === f ? "#fff" : "var(--muted-foreground)",
            fontFamily: "Outfit, sans-serif",
          }}>
            {f === "todas" ? "Todas" : tipoStyle[f].label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {filtradas.map(n => {
          const lida = lidas.has(n.id);
          const style = tipoStyle[n.tipo];
          return (
            <div key={n.id} className="bg-white rounded-xl border overflow-hidden transition-all" style={{ borderColor: !lida && n.tipo === "urgente" ? "#fecaca" : "var(--border)", opacity: lida ? 0.75 : 1 }}>
              <div className="flex gap-4 p-5">
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: style.bg, color: style.color }}><NotificationIcon name={style.icon} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{n.titulo}</span>
                      {!lida && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n.tipo === "urgente" ? "#ef4444" : "var(--primary)" }} />}
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{n.data}</span>
                  </div>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{n.texto}</p>
                  {!lida && (
                    <button onClick={() => marcarLida(n.id)} className="mt-3 text-xs font-medium hover:underline" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtradas.length === 0 && (
        <div className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
          <p className="text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Nenhum aviso nesta categoria.</p>
        </div>
      )}
    </div>
  );
}
function NotificationIcon({ name }: { name: "alert" | "book" | "file" }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg {...common}>{name === "alert" ? <><path d="M12 3 2 21h20z"/><path d="M12 9v5M12 17h.01"/></> : name === "book" ? <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21"/></> : <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/></>}</svg>;
}