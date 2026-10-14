import type { Screen } from "../App";

interface Props {
  current: Exclude<Screen, "login">;
  navigate: (s: Screen) => void;
  user: { name: string; role: string; email: string };
  unreadNotifs: number;
}

type IconName = "home" | "book" | "chart" | "check" | "clock" | "file" | "refresh" | "target" | "bell" | "user";
const menuItems: { label: string; screen: Screen; icon: IconName; badge?: string; count?: boolean }[] = [
  { label: "Início", screen: "dashboard", icon: "home" },
  { label: "Disciplinas", screen: "disciplinas", icon: "book" },
  { label: "Notas", screen: "notas", icon: "chart" },
  { label: "Frequência", screen: "frequencia", icon: "check" },
  { label: "Horários", screen: "horario", icon: "clock" },
  { label: "Documentos", screen: "documentos", icon: "file" },
  { label: "Rematrícula", screen: "rematricula", icon: "refresh", badge: "!" },
  { label: "Eventos", screen: "eventos", icon: "target" },
  { label: "Avisos", screen: "notificacoes", icon: "bell", count: true },
  { label: "Perfil", screen: "perfil", icon: "user" },
];

function MenuIcon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21"/><path d="M8 7h8"/></>,
    chart: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.8 4L21 14"/><path d="M21 20v-6h-6"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function Sidebar({ current, navigate, user, unreadNotifs }: Props) {
  const iniciais = user.name ? user.name.substring(0, 2).toUpperCase() : "US";
  return (
    <aside className="hidden md:flex flex-col w-64 border-r shrink-0" style={{ background: "var(--primary)", borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}><div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: "var(--accent)", color: "#fff" }}>S2</div><div><div className="text-white font-bold text-sm">SIGA 2.0</div><div className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>Portal Acadêmico</div></div></div>
      <div className="mx-4 my-4 p-3 rounded-xl flex items-center gap-3" style={{ background: "rgba(255,255,255,0.06)" }}><div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "var(--accent)", color: "#fff" }}>{iniciais}</div><div className="min-w-0 flex-1"><div className="text-white font-semibold text-xs truncate">{user.name}</div><div className="text-[10px] truncate capitalize" style={{ color: "rgba(255,255,255,0.6)" }}>@{user.role} · ADS · 3º sem</div></div></div>
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">{menuItems.map(item => { const active = current === item.screen; return <button key={item.screen} onClick={() => navigate(item.screen)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-left" style={{ background: active ? "rgba(255,255,255,0.12)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.7)" }}><span className="shrink-0"><MenuIcon name={item.icon}/></span><span className="flex-1 truncate">{item.label}</span>{item.badge && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#f97316", color: "#fff" }}>{item.badge}</span>}{item.count && unreadNotifs > 0 && <span className="min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#ef4444", color: "#fff" }}>{unreadNotifs}</span>}</button>})}</nav>
      <div className="p-4 border-t text-[11px]" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>FATEC Santana de Parnaíba</div>
    </aside>
  );
}