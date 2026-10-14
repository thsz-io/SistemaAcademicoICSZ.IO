import type { UserData } from "../../screens/Login";
import AdminIcon, { type AdminIconName } from "./AdminIcons";
import { useAdmin, type AdminScreen } from "../AdminContext";

const items:{id:AdminScreen;label:string;icon:AdminIconName}[]=[
 {id:"admin-dashboard",label:"Dashboard",icon:"dashboard"},
 {id:"admin-users",label:"Usuários",icon:"users"},
 {id:"admin-students",label:"Alunos",icon:"student"},
 {id:"admin-reenrollments",label:"Rematrículas",icon:"refresh"},
 {id:"admin-professors",label:"Professores",icon:"teacher"},
 {id:"admin-disciplines",label:"Disciplinas",icon:"book"},
 {id:"admin-classes",label:"Turmas",icon:"class"},
 {id:"admin-events",label:"Eventos",icon:"event"},
 {id:"admin-notices",label:"Avisos",icon:"bell"},
 {id:"admin-certificates",label:"Certificados",icon:"certificate"},
 {id:"admin-reports",label:"Relatórios",icon:"report"},
 {id:"admin-settings",label:"Configurações",icon:"settings"},
 {id:"admin-history",label:"Histórico",icon:"history"},
];

export default function AdminSidebar({current,navigate,onLogout,user}:{current:AdminScreen;navigate:(s:AdminScreen)=>void;onLogout:()=>void;user:UserData}){
 const {canAccess,reenrollments,adminNotifications}=useAdmin();
 const unread=adminNotifications.filter(n=>!n.read).length;
 const pending=reenrollments.filter(r=>r.status!=="Atualizada").length;
 const initials=user.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
 return <aside className="hidden md:flex w-72 shrink-0 flex-col border-r" style={{background:"#0c2848",borderColor:"rgba(255,255,255,.08)"}}>
   <div className="p-5 border-b" style={{borderColor:"rgba(255,255,255,.08)"}}>
     <div className="flex items-center gap-3">
       <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{background:"#f97316",color:"#fff",fontFamily:"Outfit, sans-serif"}}>S2</div>
       <div><div className="font-bold text-white" style={{fontFamily:"Outfit, sans-serif"}}>SIGA 2.0</div><div className="text-[11px]" style={{color:"rgba(255,255,255,.55)"}}>Painel Administrativo</div></div>
     </div>
   </div>
   <div className="mx-4 my-4 p-3 rounded-2xl" style={{background:"rgba(255,255,255,.06)"}}>
     <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{background:"#1f5d96",color:"#fff"}}>{initials}</div><div className="min-w-0"><div className="text-white text-sm font-semibold truncate">{user.name}</div><div className="text-[11px] truncate" style={{color:"rgba(255,255,255,.55)"}}>Administrador</div></div></div>
   </div>
   <div className="px-3 text-[10px] uppercase tracking-[.16em] font-semibold mb-2" style={{color:"rgba(255,255,255,.35)"}}>Gestão SIGA</div>
   <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
     {items.filter(item=>canAccess(item.id,"Administrador")).map(item=>{const active=current===item.id;return <button key={item.id} onClick={()=>navigate(item.id)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm transition-all" style={{background:active?"rgba(255,255,255,.13)":"transparent",color:active?"#fff":"rgba(255,255,255,.7)"}}><AdminIcon name={item.icon} size={18}/><span className="flex-1">{item.label}</span>{item.id==="admin-reenrollments" && pending>0 && <span className="min-w-5 h-5 px-1 rounded-full text-[10px] flex items-center justify-center font-bold" style={{background:"#f97316",color:"#fff"}}>{pending}</span>}{item.id==="admin-dashboard" && unread>0 && <span className="min-w-5 h-5 px-1 rounded-full text-[10px] flex items-center justify-center font-bold" style={{background:"#ef4444",color:"#fff"}}>{unread}</span>}</button>})}
   </nav>
   <div className="p-3 border-t" style={{borderColor:"rgba(255,255,255,.08)"}}><button onClick={onLogout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm" style={{color:"rgba(255,255,255,.65)"}}>Sair do painel</button><div className="px-3 pt-3 text-[10px]" style={{color:"rgba(255,255,255,.35)"}}>FATEC Santana de Parnaíba</div></div>
 </aside>;
}