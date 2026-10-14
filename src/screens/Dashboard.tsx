import type { Screen } from "../App";

interface Props {
  navigate: (s: Screen) => void;
  user: { name: string; role: string; email: string };
}

const shortcuts = [
  { label: "Notas", icon: "chart", screen: "notas" as Screen },
  { label: "Frequência", icon: "check", screen: "frequencia" as Screen },
  { label: "Horários", icon: "clock", screen: "horario" as Screen },
  { label: "Disciplinas", icon: "book", screen: "disciplinas" as Screen },
  { label: "Documentos", icon: "file", screen: "documentos" as Screen },
  { label: "Rematrícula", icon: "refresh", screen: "rematricula" as Screen },
];

const grade: Record<number, { disciplina: string; horario: string; sala: string; professor: string }[]> = {
  1: [{ disciplina: "Banco de Dados", horario: "19h00 – 20h40", sala: "Lab 3", professor: "Prof. Ricardo Alves" }, { disciplina: "Estruturas de Dados", horario: "20h50 – 22h30", sala: "Lab 2", professor: "Profa. Marina Costa" }],
  2: [{ disciplina: "Estatística Aplicada", horario: "19h00 – 20h40", sala: "Sala 12", professor: "Profa. Ana Lima" }, { disciplina: "Engenharia de Software", horario: "20h50 – 22h30", sala: "Sala 8", professor: "Prof. Bruno Souza" }],
  3: [{ disciplina: "Banco de Dados", horario: "19h00 – 20h40", sala: "Lab 3", professor: "Prof. Ricardo Alves" }],
  4: [{ disciplina: "Estruturas de Dados", horario: "19h00 – 20h40", sala: "Lab 2", professor: "Profa. Marina Costa" }],
  5: [{ disciplina: "Engenharia de Software", horario: "19h00 – 20h40", sala: "Sala 8", professor: "Prof. Bruno Souza" }],
};

const avisos = [
  { prazo: new Date("2026-09-15T23:59:59"), texto: "Atualização de dados acadêmicos até 15/09/2026", screen: "perfil" as Screen },
  { prazo: new Date("2026-09-30T23:59:59"), texto: "Solicitação de exame especial até 30/09/2026", screen: "documentos" as Screen },
];

export default function Dashboard({ navigate, user }: Props) {
  const agora = new Date();
  const hora = agora.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const aulasHoje = grade[agora.getDay()] ?? [];
  const avisosAtivos = avisos.filter(a => a.prazo.getTime() >= agora.getTime());
  const dataAtual = agora.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", weekday: "long" });

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>{saudacao}, {user.name}</h2>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold capitalize" style={{ background: "var(--primary)", color: "#fff" }}>@{user.role}</span>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Análise e Desenvolvimento de Sistemas · 3º semestre · Noturno · FATEC Santana de Parnaíba</p>
        </div>
        <div className="hidden md:block text-right text-xs" style={{ color: "var(--muted-foreground)" }}><div className="font-medium capitalize" style={{ color: "var(--foreground)" }}>{dataAtual}</div><div>Informações acadêmicas atualizadas</div></div>
      </div>

      {avisosAtivos.length > 0 && <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#fed7aa", background: "#fff7ed" }}>
        <div className="px-4 py-2.5 border-b" style={{ borderColor: "#fed7aa", background: "#ffedd5" }}><span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "#c2410c" }}>Atenção — Prazos importantes</span></div>
        <div className="divide-y" style={{ borderColor: "#fed7aa" }}>{avisosAtivos.map(a => <div key={a.texto} className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-sm" style={{ color: "#9a3412" }}>{a.texto}</span><button onClick={() => navigate(a.screen)} className="text-xs font-medium shrink-0" style={{ color: "#c2410c" }}>Ver detalhes</button></div>)}</div>
      </div>}

      <div><h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Acesso rápido</h3><div className="grid grid-cols-3 md:grid-cols-6 gap-3">{shortcuts.map(({ label, icon, screen }) => <button key={label} onClick={() => navigate(screen)} className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl border bg-white transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}><SimpleIcon name={icon} /><span className="text-xs font-medium" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>{label}</span></button>)}</div></div>

      <div className="bg-white rounded-xl border overflow-hidden p-5" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Aulas de hoje</h3>
        {aulasHoje.length === 0 ? <div className="text-sm py-6 text-center" style={{ color: "var(--muted-foreground)" }}>Você não possui aulas programadas para hoje.</div> : <div className="space-y-3">{aulasHoje.map(a => <div key={a.disciplina} className="flex items-center justify-between gap-4 p-3 rounded-lg border" style={{ borderColor: "var(--border)", background: "var(--background)" }}><div><div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{a.disciplina}</div><div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{a.horario} · {a.sala} · {a.professor}</div></div><span className="text-xs px-2 py-1 rounded font-medium" style={{ background: "#dcfce7", color: "#15803d" }}>Hoje</span></div>)}</div>}
      </div>
    </div>
  );
}

function SimpleIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, React.ReactNode> = { chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>, check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21"/></>, file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/></>, refresh: <><path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.8 4L21 14"/></> };
  return <svg {...common}>{icons[name]}</svg>;
}
