import { useEffect, useState } from "react";
import Login, { UserData } from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Disciplinas from "./screens/Disciplinas";
import Notas from "./screens/Notas";
import Horario from "./screens/Horario";
import Rematricula from "./screens/Rematricula";
import Documentos from "./screens/Documentos";
import Notificacoes from "./screens/Notificacoes";
import Perfil from "./screens/Perfil";
import Eventos from "./screens/Eventos";
import Frequencia from "./screens/Frequencia";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";
import AdminApp from "./AdminApp";

export type Screen = "login"|"dashboard"|"disciplinas"|"notas"|"frequencia"|"horario"|"rematricula"|"documentos"|"notificacoes"|"perfil"|"eventos";

export default function App(){
 const[screen,setScreen]=useState<Screen>("login"); const[isLoggedIn,setIsLoggedIn]=useState(false); const[user,setUser]=useState<UserData|null>(null);
 const[unreadNotifs,setUnreadNotifs]=useState(()=>Number(localStorage.getItem("siga-unread-notifs")??3));
 const[fontScale,setFontScale]=useState(()=>Number(localStorage.getItem("siga-font-scale")??100));
 const[themePreference,setThemePreference]=useState<"system"|"light"|"dark">(()=>{const s=localStorage.getItem("siga-theme");return s==="light"||s==="dark"||s==="system"?s:"system"});
 useEffect(()=>{localStorage.setItem("siga-font-scale",String(fontScale));document.documentElement.style.fontSize=`${fontScale}%`;return()=>{document.documentElement.style.fontSize="100%"}},[fontScale]);
 useEffect(()=>{const media=window.matchMedia("(prefers-color-scheme: dark)");const apply=()=>{const resolved=themePreference==="system"?(media.matches?"dark":"light"):themePreference;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved};apply();if(themePreference==="system")media.addEventListener("change",apply);localStorage.setItem("siga-theme",themePreference);return()=>media.removeEventListener("change",apply)},[themePreference]);
 useEffect(()=>{localStorage.setItem("siga-unread-notifs",String(unreadNotifs))},[unreadNotifs]);
 function navigate(s:Screen){setScreen(s)}
 function handleLogin(userData:UserData){setUser(userData);setIsLoggedIn(true);setScreen("dashboard")}
 function handleLogout(){setUser(null);setIsLoggedIn(false);setScreen("login")}
 if(!isLoggedIn||!user)return <Login onLogin={handleLogin}/>;
 if(user.role==="adm")return <AdminApp user={user} onLogout={handleLogout} fontScale={fontScale} onFontScaleChange={setFontScale} themePreference={themePreference} onThemePreferenceChange={setThemePreference}/>;
 const screenMap:Record<Exclude<Screen,"login">,JSX.Element>={dashboard:<Dashboard navigate={navigate} user={user}/>,disciplinas:<Disciplinas/>,notas:<Notas/>,frequencia:<Frequencia/>,horario:<Horario/>,rematricula:<Rematricula user={user}/>,documentos:<Documentos/>,notificacoes:<Notificacoes onUnreadChange={setUnreadNotifs}/>,perfil:<Perfil onLogout={handleLogout} user={user} fontScale={fontScale} onFontScaleChange={setFontScale} themePreference={themePreference} onThemePreferenceChange={setThemePreference}/>,eventos:<Eventos/>};
 const studentNavigate=(s:Exclude<Screen,"login">)=>navigate(s);
 return <div className="flex h-screen overflow-hidden" style={{background:"var(--background)"}}><Sidebar current={screen as Exclude<Screen,"login">} navigate={studentNavigate} user={user} unreadNotifs={unreadNotifs}/><div className="flex-1 flex flex-col overflow-hidden"><TopBar current={screen as Exclude<Screen,"login">} navigate={studentNavigate} user={user} unreadNotifs={unreadNotifs}/><main className="flex-1 overflow-y-auto pb-20 md:pb-0">{screenMap[screen]}</main></div><BottomNav current={screen as Exclude<Screen,"login">} navigate={studentNavigate}/></div>
}
