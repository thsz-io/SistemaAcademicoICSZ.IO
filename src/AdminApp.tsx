import { useEffect, useMemo, useState } from "react";
import type { UserData } from "./screens/Login";
import { AdminProvider, adminPermissionLabels, type AdminScreen, useAdmin } from "./AdminContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import AdminBottomNav from "./components/AdminBottomNav";
import AdminDashboard from "./screens/AdminDashboard";
import AdminUsers from "./screens/AdminUsers";
import AdminStudents from "./screens/AdminStudents";
import AdminReenrollments from "./screens/AdminReenrollments";
import AdminProfessors from "./screens/AdminProfessors";
import AdminDisciplines from "./screens/AdminDisciplines";
import AdminClasses from "./screens/AdminClasses";
import AdminEvents from "./screens/AdminEvents";
import AdminNotices from "./screens/AdminNotices";
import AdminCertificates from "./screens/AdminCertificates";
import AdminReports from "./screens/AdminReports";
import AdminSettings from "./screens/AdminSettings";
import AdminHistory from "./screens/AdminHistory";

export type { AdminScreen } from "./AdminContext";

interface Props { user: UserData; onLogout: ()=>void; fontScale:number; onFontScaleChange:(n:number)=>void; themePreference:"system"|"light"|"dark"; onThemePreferenceChange:(v:"system"|"light"|"dark")=>void; }

const titleMap:Record<AdminScreen,string>={...adminPermissionLabels};

export default function AdminApp(props:Props){
  return <AdminProvider><AdminShell {...props}/></AdminProvider>;
}

function AdminShell(props:Props){
  const {canAccess}=useAdmin();
  const [screen,setScreen]=useState<AdminScreen>("admin-dashboard");
  const [mobileMenu,setMobileMenu]=useState(false);

  useEffect(()=>{ if(!canAccess(screen,"Administrador"))setScreen("admin-dashboard"); },[screen,canAccess]);

  const navigate=(next:AdminScreen)=>{
    if(canAccess(next,"Administrador"))setScreen(next);
    else alert(`A permissão “${titleMap[next]}” está desativada para o perfil Administrador.`);
    setMobileMenu(false);
  };

  const content=useMemo(()=>{
    switch(screen){
      case "admin-users": return <AdminUsers/>;
      case "admin-students": return <AdminStudents/>;
      case "admin-reenrollments": return <AdminReenrollments/>;
      case "admin-professors": return <AdminProfessors/>;
      case "admin-disciplines": return <AdminDisciplines/>;
      case "admin-classes": return <AdminClasses/>;
      case "admin-events": return <AdminEvents/>;
      case "admin-notices": return <AdminNotices/>;
      case "admin-certificates": return <AdminCertificates/>;
      case "admin-reports": return <AdminReports/>;
      case "admin-settings": return <AdminSettings fontScale={props.fontScale} onFontScaleChange={props.onFontScaleChange} themePreference={props.themePreference} onThemePreferenceChange={props.onThemePreferenceChange}/>;
      case "admin-history": return <AdminHistory/>;
      default: return <AdminDashboard navigate={navigate}/>;
    }
  },[screen,props.fontScale,props.themePreference]);

  return <div className="flex h-screen overflow-hidden" style={{background:"var(--background)"}}>
    <AdminSidebar current={screen} navigate={navigate} onLogout={props.onLogout} user={props.user}/>
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AdminTopBar title={titleMap[screen]} navigate={navigate} user={props.user} onLogout={props.onLogout} onOpenMenu={()=>setMobileMenu(true)}/>
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{content}</main>
    </div>
    <AdminBottomNav current={screen} navigate={navigate} onOpenMore={()=>setMobileMenu(true)}/>
    {mobileMenu&&<div className="fixed inset-0 z-[70] md:hidden bg-black/30" onClick={()=>setMobileMenu(false)}><div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4"><div><div className="text-sm font-bold" style={{fontFamily:"Outfit, sans-serif"}}>Menu administrativo</div><div className="text-xs" style={{color:"var(--muted-foreground)"}}>Funções disponíveis para o Administrador</div></div><button onClick={()=>setMobileMenu(false)} className="text-2xl" style={{color:"var(--muted-foreground)"}}>×</button></div>
      <div className="grid grid-cols-2 gap-2">{(Object.keys(titleMap) as AdminScreen[]).filter(id=>canAccess(id,"Administrador")).map(id=><button key={id} onClick={()=>navigate(id)} className="text-left px-3 py-3 rounded-xl border" style={{borderColor:screen===id?"var(--primary)":"var(--border)",background:screen===id?"var(--secondary)":"#fff",color:"var(--foreground)"}}>{titleMap[id]}</button>)}</div>
    </div></div>}
  </div>;
}
