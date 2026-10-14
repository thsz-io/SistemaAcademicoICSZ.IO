import type { AdminScreen } from "../AdminApp";
import AdminIcon from "./AdminIcons";
const items:{id:AdminScreen;label:string;icon:"dashboard"|"student"|"refresh"|"bell"|"settings"}[]=[
 {id:"admin-dashboard",label:"Início",icon:"dashboard"},{id:"admin-students",label:"Alunos",icon:"student"},{id:"admin-reenrollments",label:"Rematrícula",icon:"refresh"},{id:"admin-notices",label:"Avisos",icon:"bell"},{id:"admin-settings",label:"Config.",icon:"settings"}
];
export default function AdminBottomNav({current,navigate,onOpenMore}:{current:AdminScreen;navigate:(s:AdminScreen)=>void;onOpenMore:()=>void}){
 return <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t grid grid-cols-6" style={{borderColor:"var(--border)"}}>{items.map(i=><button key={i.id} onClick={()=>navigate(i.id)} className="py-2.5 flex flex-col items-center gap-1 text-[10px]" style={{color:current===i.id?"var(--primary)":"var(--muted-foreground)"}}><AdminIcon name={i.icon} size={18}/>{i.label}</button>)}<button onClick={onOpenMore} className="py-2.5 flex flex-col items-center gap-1 text-[10px]" style={{color:"var(--muted-foreground)"}}><span className="text-lg leading-[18px]">•••</span>Mais</button></nav>;
}