import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AdminUserType = "Aluno" | "Professor" | "Administrador";
export type Status = "Ativo" | "Inativo";
export type PermissionRole = AdminUserType;

export interface AdminUserRecord {
  id: number; name: string; email: string; type: AdminUserType; status: Status;
  cpf: string; phone: string; birth: string; ra?: string; course?: string; className?: string;
  semester?: string; shift?: string; unit?: string;
}

export interface StudentRecord extends AdminUserRecord {
  type: "Aluno"; situation: "Regular" | "Inativo"; disciplines: string[]; history: string[];
  historicalSince?: string; retentionUntil: string;
}
export interface ProfessorRecord extends AdminUserRecord {
  type: "Professor"; formation: string; area: string; disciplines: string[]; classes: string[];
}
export interface DisciplineRecord { id:number; name:string; code:string; course:string; semester:string; workload:number; professor:string; status:Status; }
export interface ClassRecord { id:number; name:string; course:string; semester:string; period:string; shift:string; year:number; disciplines:string[]; professors:string[]; students:string[]; }
export interface EventRecord { id:number; name:string; description:string; type:string; date:string; time:string; location:string; speaker:string; speakerPhoto:string; status:"Publicado"|"Rascunho"|"Encerrado"; }
export interface NoticeRecord { id:number; title:string; description:string; category:string; priority:"Urgente"|"Importante"|"Informativo"; audience:string; course:string; className:string; date:string; status:"Publicado"|"Rascunho"|"Encerrado"; }
export interface CertificateRecord { id:number; studentId:number; student:string; course:string; workload:number; date:string; code:string; status:"Emitido"; }
export interface ReenrollmentRecord { id:number; studentId:number; student:string; studentEmail?:string; ra:string; course:string; fromSemester:string; toSemester:string; disciplines:string[]; submittedAt:string; status:"Nova"|"Em análise"|"Atualizada"; }
export interface ActivityRecord { id:number; action:string; target:string; detail:string; admin:string; date:string; before?:string; after?:string; }
export interface AdminNotificationRecord { id:number; title:string; description:string; date:string; read:boolean; type:"rematricula"|"cadastro"|"aviso"|"sistema"; targetScreen:"admin-reenrollments"|"admin-students"|"admin-notices"|"admin-dashboard"; }

export type AdminScreen = "admin-dashboard"|"admin-users"|"admin-students"|"admin-reenrollments"|"admin-professors"|"admin-disciplines"|"admin-classes"|"admin-events"|"admin-notices"|"admin-certificates"|"admin-reports"|"admin-settings"|"admin-history";

export const adminPermissionLabels: Record<AdminScreen,string> = {
  "admin-dashboard":"Dashboard administrativo",
  "admin-users":"Gerenciar usuários",
  "admin-students":"Gerenciar alunos",
  "admin-reenrollments":"Gerenciar rematrículas",
  "admin-professors":"Gerenciar professores",
  "admin-disciplines":"Gerenciar disciplinas",
  "admin-classes":"Gerenciar turmas",
  "admin-events":"Gerenciar eventos",
  "admin-notices":"Gerenciar avisos e notificações",
  "admin-certificates":"Gerenciar certificados extracurriculares",
  "admin-reports":"Gerar e consultar relatórios",
  "admin-settings":"Gerenciar configurações e permissões",
  "admin-history":"Consultar histórico e atividades administrativas",
};

export type PermissionMap = Record<PermissionRole, Record<AdminScreen, boolean>>;

const defaultPermissionMap = (): PermissionMap => {
  const all: Record<AdminScreen, boolean> = Object.fromEntries((Object.keys(adminPermissionLabels) as AdminScreen[]).map(k=>[k,true])) as Record<AdminScreen,boolean>;
  return { Administrador:{...all}, Professor:{...all, "admin-users":false, "admin-students":false, "admin-reenrollments":false, "admin-certificates":false, "admin-settings":false, "admin-history":false}, Aluno:{...all, ...Object.fromEntries((Object.keys(adminPermissionLabels) as AdminScreen[]).map(k=>[k,false])), "admin-dashboard":false} };
};

interface AdminState {
  users: AdminUserRecord[];
  students: StudentRecord[];
  professors: ProfessorRecord[];
  disciplines: DisciplineRecord[];
  classes: ClassRecord[];
  events: EventRecord[];
  notices: NoticeRecord[];
  certificates: CertificateRecord[];
  reenrollments: ReenrollmentRecord[];
  activities: ActivityRecord[];
  adminNotifications: AdminNotificationRecord[];
  permissions: PermissionMap;
}

const initialStudents: StudentRecord[] = [
  { id:1, name:"Thays Souza", email:"thays.souza@fatec.sp.gov.br", type:"Aluno", status:"Ativo", cpf:"***.***.***-12", phone:"(11) 99999-1111", birth:"2004-05-14", ra:"202600184", course:"Análise e Desenvolvimento de Sistemas", className:"ADS-4A", semester:"4º", shift:"Noturno", unit:"FATEC Santana de Parnaíba", situation:"Regular", disciplines:["Banco de Dados","Engenharia de Software","Estatística Aplicada"], history:["ADS — 3º semestre concluído","ADS — 4º semestre em andamento"], retentionUntil:"Vínculo ativo" },
  { id:2, name:"João Silva", email:"joao.silva@fatec.sp.gov.br", type:"Aluno", status:"Ativo", cpf:"***.***.***-44", phone:"(11) 98888-2222", birth:"2003-08-20", ra:"202600211", course:"Análise e Desenvolvimento de Sistemas", className:"ADS-4A", semester:"4º", shift:"Noturno", unit:"FATEC Santana de Parnaíba", situation:"Regular", disciplines:["Banco de Dados","Redes de Computadores"], history:["ADS — 3º semestre concluído"], retentionUntil:"Vínculo ativo" },
  { id:3, name:"Maria Santos", email:"maria.santos@fatec.sp.gov.br", type:"Aluno", status:"Ativo", cpf:"***.***.***-78", phone:"(11) 97777-3333", birth:"2005-02-11", ra:"202600327", course:"Análise e Desenvolvimento de Sistemas", className:"ADS-3A", semester:"3º", shift:"Noturno", unit:"FATEC Santana de Parnaíba", situation:"Regular", disciplines:["Python Avançado","Estruturas de Dados"], history:["ADS — 2º semestre concluído"], retentionUntil:"Vínculo ativo" },
  { id:4, name:"Lucas Oliveira", email:"lucas.oliveira@fatec.sp.gov.br", type:"Aluno", status:"Inativo", cpf:"***.***.***-91", phone:"(11) 96666-4444", birth:"2002-12-01", ra:"202400092", course:"Análise e Desenvolvimento de Sistemas", className:"ADS-2B", semester:"2º", shift:"Noturno", unit:"FATEC Santana de Parnaíba", situation:"Inativo", disciplines:[], history:["ADS — 2º semestre cursado","Vínculo encerrado em 2025"], historicalSince:"23/09/2025", retentionUntil:"23/09/2027" },
];

const initialProfessors: ProfessorRecord[] = [
  { id:101, name:"Ricardo Alves", email:"ricardo.alves@fatec.sp.gov.br", type:"Professor", status:"Ativo", cpf:"***.***-15", phone:"(11) 95555-1001", birth:"1983-04-03", formation:"Mestrado em Computação", area:"Banco de Dados", disciplines:["Banco de Dados"], classes:["ADS-4A"] },
  { id:102, name:"Marina Costa", email:"marina.costa@fatec.sp.gov.br", type:"Professor", status:"Ativo", cpf:"***.***-35", phone:"(11) 95555-1002", birth:"1980-06-10", formation:"Doutorado em Computação", area:"Estruturas de Dados", disciplines:["Estruturas de Dados"], classes:["ADS-3A","ADS-4A"] },
  { id:103, name:"Ana Lima", email:"ana.lima@fatec.sp.gov.br", type:"Professor", status:"Ativo", cpf:"***.***-67", phone:"(11) 95555-1003", birth:"1987-10-08", formation:"Especialização em Estatística", area:"Estatística", disciplines:["Estatística Aplicada"], classes:["ADS-4A"] },
];

const initialState: Omit<AdminState,"permissions"> = {
  users:[...initialStudents,...initialProfessors,{id:201,name:"Administração SIGA",email:"administracao@fatec.sp.gov.br",type:"Administrador",status:"Ativo",cpf:"***.***-00",phone:"(11) 4000-0000",birth:"1980-01-01"}],
  students:initialStudents,
  professors:initialProfessors,
  disciplines:[
    {id:1,name:"Banco de Dados",code:"BD-401",course:"ADS",semester:"4º",workload:80,professor:"Ricardo Alves",status:"Ativo"},
    {id:2,name:"Engenharia de Software",code:"ES-402",course:"ADS",semester:"4º",workload:80,professor:"Bruno Souza",status:"Ativo"},
    {id:3,name:"Estatística Aplicada",code:"EST-301",course:"ADS",semester:"4º",workload:80,professor:"Ana Lima",status:"Ativo"},
    {id:4,name:"Python Avançado",code:"PY-303",course:"ADS",semester:"3º",workload:80,professor:"Carlos Mendes",status:"Ativo"},
  ],
  classes:[
    {id:1,name:"ADS-4A",course:"Análise e Desenvolvimento de Sistemas",semester:"4º",period:"2º semestre",shift:"Noturno",year:2026,disciplines:["Banco de Dados","Engenharia de Software","Estatística Aplicada"],professors:["Ricardo Alves","Bruno Souza","Ana Lima"],students:["Thays Souza","João Silva"]},
    {id:2,name:"ADS-3A",course:"Análise e Desenvolvimento de Sistemas",semester:"3º",period:"2º semestre",shift:"Noturno",year:2026,disciplines:["Python Avançado","Estruturas de Dados"],professors:["Carlos Mendes","Marina Costa"],students:["Maria Santos"]},
  ],
  events:[
    {id:1,name:"Palestra: Inteligência Artificial no Mercado de Trabalho",description:"Especialistas discutem os impactos da IA nas profissões de tecnologia e as habilidades do futuro.",type:"Palestra",date:"28/09/2026",time:"19h30 – 21h30",location:"Auditório Principal",speaker:"Fernanda Costa",speakerPhoto:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",status:"Publicado"},
    {id:2,name:"Feira de Tecnologia FATEC 2026",description:"Apresentação de projetos acadêmicos, empresas parceiras e oportunidades de estágio.",type:"Feira",date:"05/10/2026",time:"10h00 – 17h00",location:"Ginásio da FATEC",speaker:"Comissão Organizadora",speakerPhoto:"",status:"Publicado"},
  ],
  notices:[
    {id:1,title:"Professor atrasado — Banco de Dados",description:"O professor Ricardo Alves está com previsão de chegada às 19h30. A turma ADS-4A foi notificada.",category:"Professor",priority:"Urgente",audience:"Turma",course:"ADS",className:"ADS-4A",date:"23/09/2026 18:52",status:"Publicado"},
    {id:2,title:"Atualização de dados acadêmicos",description:"Confira seus dados acadêmicos e comunique a secretaria em caso de inconsistência.",category:"Acadêmico",priority:"Importante",audience:"Todos os alunos",course:"",className:"",date:"22/09/2026 09:00",status:"Publicado"},
  ],
  certificates:[
    {id:1,studentId:1,student:"Thays Souza",course:"Workshop de Python",workload:20,date:"15/09/2026",code:"SIGA-2026-000151",status:"Emitido"},
    {id:2,studentId:2,student:"João Silva",course:"Excel Avançado",workload:16,date:"12/09/2026",code:"SIGA-2026-000152",status:"Emitido"},
  ],
  reenrollments:[
    {id:1,studentId:1,student:"Thays Souza",studentEmail:"thays.souza@fatec.sp.gov.br",ra:"202600184",course:"ADS",fromSemester:"4º",toSemester:"5º",disciplines:["Banco de Dados II","Engenharia de Software II","Cloud Computing"],submittedAt:"23/09/2026 10:18",status:"Nova"},
    {id:2,studentId:2,student:"João Silva",studentEmail:"joao.silva@fatec.sp.gov.br",ra:"202600211",course:"ADS",fromSemester:"4º",toSemester:"5º",disciplines:["Banco de Dados II","Redes II"],submittedAt:"22/09/2026 16:40",status:"Em análise"},
  ],
  activities:[
    {id:1,action:"Atualização cadastral",target:"Aluno · Thays Souza",detail:"Correção do telefone cadastrado.",admin:"Administração SIGA",date:"23/09/2026 11:42",before:"Telefone: (11) 99999-0000",after:"Telefone: (11) 99999-1111"},
    {id:2,action:"Publicação de aviso",target:"Turma ADS-4A",detail:"Aviso sobre atraso de professor.",admin:"Administração SIGA",date:"23/09/2026 10:05"},
    {id:3,action:"Certificado emitido",target:"João Silva",detail:"Excel Avançado · 16h.",admin:"Administração SIGA",date:"22/09/2026 16:20"},
  ],
  adminNotifications:[
    {id:1001,title:"Nova rematrícula",description:"Thays Souza realizou uma rematrícula e selecionou 3 disciplinas.",date:"23/09/2026 10:18",read:false,type:"rematricula",targetScreen:"admin-reenrollments"},
    {id:1002,title:"Rematrícula em análise",description:"João Silva possui uma atualização acadêmica aguardando confirmação.",date:"22/09/2026 16:40",read:false,type:"rematricula",targetScreen:"admin-reenrollments"},
  ],
};

const clone = <T,>(value:T):T => JSON.parse(JSON.stringify(value));
const parseLocal = <T,>(key:string,fallback:T):T => { try { const raw=localStorage.getItem(key); return raw?JSON.parse(raw):clone(fallback); } catch { return clone(fallback); } };
const parsePtDate = (value:string) => { const m=value.match(/(\d{2})\/(\d{2})\/(\d{4})/); if(!m)return null; return new Date(Number(m[3]),Number(m[2])-1,Number(m[1])); };
const todayPt = () => new Date().toLocaleDateString("pt-BR");
const addYears = (value:string, years:number) => { const d=parsePtDate(value)||new Date(); d.setFullYear(d.getFullYear()+years); return d.toLocaleDateString("pt-BR"); };
const stableStringify = (value:unknown) => JSON.stringify(value, null, 2);
const formatChanges = (before:Record<string,unknown>, after:Record<string,unknown>) => Object.keys(after).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])).map(k=>({field:k,before:before[k],after:after[k]}));

function mergeSharedReenrollments(base:ReenrollmentRecord[], students:StudentRecord[]) {
  const shared = parseLocal<ReenrollmentRecord[]>("siga-rematriculas-submetidas",[]);
  const merged=[...base];
  for(const r of shared){ if(!merged.some(x=>String(x.id)===String(r.id))){ merged.unshift(r); } }
  return merged.map(r=>{const s=students.find(st=>st.id===r.studentId || (!!r.studentEmail&&st.email===r.studentEmail) || st.name===r.student); return s?{...r,studentId:s.id,student:s.name,studentEmail:s.email,ra:s.ra||r.ra}:{...r};});
}

interface ContextValue extends AdminState {
  addActivity:(action:string,target:string,detail:string,before?:string,after?:string)=>void;
  updateStudent:(id:number,patch:Partial<StudentRecord>)=>void;
  updateUser:(id:number,patch:Partial<AdminUserRecord>)=>void;
  updateProfessor:(id:number,patch:Partial<ProfessorRecord>)=>void;
  addUser:(user:AdminUserRecord)=>void;
  addProfessor:(professor:ProfessorRecord)=>void;
  addDiscipline:(d:DisciplineRecord)=>void;
  updateDiscipline:(id:number,patch:Partial<DisciplineRecord>)=>void;
  addClass:(c:ClassRecord)=>void;
  updateClass:(id:number,patch:Partial<ClassRecord>)=>void;
  addEvent:(e:EventRecord)=>void;
  updateEvent:(id:number,patch:Partial<EventRecord>)=>void;
  addNotice:(n:NoticeRecord)=>void;
  updateNotice:(id:number,patch:Partial<NoticeRecord>)=>void;
  updateReenrollment:(id:number,status:ReenrollmentRecord["status"])=>void;
  addCertificate:(c:CertificateRecord)=>void;
  markAdminNotificationRead:(id:number)=>void;
  markAllAdminNotificationsRead:()=>void;
  refreshSharedReenrollments:()=>void;
  setPermission:(role:PermissionRole,screen:AdminScreen,value:boolean)=>void;
  resetPermissions:(role:PermissionRole)=>void;
  canAccess:(screen:AdminScreen,role?:PermissionRole)=>boolean;
}

const Ctx=createContext<ContextValue|null>(null);

export function AdminProvider({children}:{children:ReactNode}){
  const [state,setState]=useState<AdminState>(()=>{
    const saved=parseLocal<Partial<AdminState>|null>("siga-admin-data",null);
    const base=clone(initialState);
    const merged={...base,...(saved||{})};
    merged.students=(merged.students||base.students).map(s=>({...s,retentionUntil:s.status==="Ativo"&&!s.historicalSince?"Vínculo ativo":(s.retentionUntil||addYears(s.historicalSince||todayPt(),2))}));
    merged.permissions=saved?.permissions||defaultPermissionMap();
    merged.reenrollments=mergeSharedReenrollments(merged.reenrollments||base.reenrollments,merged.students);
    merged.adminNotifications=merged.adminNotifications||base.adminNotifications;
    return merged as AdminState;
  });

  useEffect(()=>{
    localStorage.setItem("siga-admin-data",JSON.stringify(state));
  },[state]);

  function addActivity(action:string,target:string,detail:string,before?:string,after?:string){
    setState(s=>({...s,activities:[{id:Date.now()+Math.random(),action,target,detail,admin:"Administração SIGA",date:new Date().toLocaleString("pt-BR"),before,after},...s.activities].slice(0,200)}));
  }

  function updateStudent(id:number,patch:Partial<StudentRecord>){
    const old=state.students.find(x=>x.id===id); if(!old)return;
    const next={...old,...patch};
    if(old.status==="Ativo" && next.status==="Inativo"){
      const leaving=todayPt(); next.historicalSince=leaving; next.retentionUntil=addYears(leaving,2); next.situation="Inativo";
      next.history=[...old.history,`Vínculo encerrado em ${leaving} · retenção histórica até ${next.retentionUntil}`];
    }
    if(old.status==="Inativo" && next.status==="Ativo") next.situation="Regular";
    const changed=formatChanges(old as unknown as Record<string,unknown>,next as unknown as Record<string,unknown>);
    setState(s=>({...s,students:s.students.map(x=>x.id===id?next:x),users:s.users.map(x=>x.id===id?{...x,...next}:x)}));
    if(changed.length)addActivity("Atualização cadastral",`Aluno · ${old.name}`,changed.map(c=>`${c.field} corrigido`).join(", "),changed.map(c=>`${c.field}: ${String(c.before??"—")}`).join("\n"),changed.map(c=>`${c.field}: ${String(c.after??"—")}`).join("\n"));
  }

  function updateUser(id:number,patch:Partial<AdminUserRecord>){
    const old=state.users.find(x=>x.id===id); if(!old)return;
    const next={...old,...patch};
    const changed=formatChanges(old as unknown as Record<string,unknown>,next as unknown as Record<string,unknown>);
    const students=state.students.map(x=>x.id===id&&old.type==="Aluno"?({...x,...patch,type:"Aluno"} as StudentRecord):x);
    const professors=state.professors.map(x=>x.id===id&&old.type==="Professor"?({...x,...patch,type:"Professor"} as ProfessorRecord):x);
    setState(s=>({...s,users:s.users.map(x=>x.id===id?next:x),students,professors}));
    addActivity("Edição de usuário",`Usuário · ${old.name}`,changed.length?changed.map(c=>`${c.field} alterado`).join(", "):"Status atualizado.",changed.length?changed.map(c=>`${c.field}: ${String(c.before??"—")}`).join("\n"):undefined,changed.length?changed.map(c=>`${c.field}: ${String(c.after??"—")}`).join("\n"):undefined);
  }

  function updateProfessor(id:number,patch:Partial<ProfessorRecord>){
    const old=state.professors.find(x=>x.id===id); if(!old)return;
    const next={...old,...patch}; const changed=formatChanges(old as unknown as Record<string,unknown>,next as unknown as Record<string,unknown>);
    setState(s=>({...s,professors:s.professors.map(x=>x.id===id?next:x),users:s.users.map(x=>x.id===id?{...x,...next}:x)}));
    addActivity("Atualização de professor",`Professor · ${old.name}`,changed.length?changed.map(c=>`${c.field} alterado`).join(", "):"Cadastro atualizado.",changed.length?changed.map(c=>`${c.field}: ${String(c.before??"—")}`).join("\n"):undefined,changed.length?changed.map(c=>`${c.field}: ${String(c.after??"—")}`).join("\n"):undefined);
  }

  const value:ContextValue=useMemo(()=>({
    ...state,
    addActivity,
    updateStudent,
    updateUser,
    updateProfessor,
    addUser:(user)=>{
      setState(s=>{
        if(user.type==="Aluno") {
          const student:StudentRecord={...user,type:"Aluno",situation:"Regular",disciplines:[],history:["Cadastro realizado no SIGA 2.0"],retentionUntil:"Vínculo ativo"};
          return {...s,users:[user,...s.users],students:[student,...s.students]};
        }
        if(user.type==="Professor") {
          const professor:ProfessorRecord={...user,type:"Professor",formation:"",area:"",disciplines:[],classes:[]};
          return {...s,users:[user,...s.users],professors:[professor,...s.professors]};
        }
        return {...s,users:[user,...s.users]};
      });
      addActivity("Usuário cadastrado",user.name,`Novo usuário ${user.type.toLowerCase()} adicionado ao SIGA.`);
    },
    addProfessor:(professor)=>{setState(s=>({...s,professors:[professor,...s.professors],users:[professor,...s.users]}));addActivity("Professor cadastrado",professor.name,"Novo professor adicionado ao SIGA.");},
    addDiscipline:(d)=>{setState(s=>({...s,disciplines:[d,...s.disciplines]}));addActivity("Disciplina cadastrada",d.name,`${d.code} · ${d.workload}h.`);},
    updateDiscipline:(id,patch)=>{const old=state.disciplines.find(x=>x.id===id);if(!old)return;const next={...old,...patch};const changes=formatChanges(old as unknown as Record<string,unknown>,next as unknown as Record<string,unknown>);setState(s=>({...s,disciplines:s.disciplines.map(x=>x.id===id?next:x)}));addActivity("Disciplina atualizada",old.name,changes.map(c=>`${c.field} alterado`).join(", ")||"Dados atualizados.",changes.map(c=>`${c.field}: ${String(c.before??"—")}`).join("\n")||undefined,changes.map(c=>`${c.field}: ${String(c.after??"—")}`).join("\n")||undefined);},
    addClass:(c)=>{setState(s=>({...s,classes:[c,...s.classes]}));addActivity("Turma cadastrada",c.name,`${c.course} · ${c.shift}.`);},
    updateClass:(id,patch)=>{const old=state.classes.find(x=>x.id===id);if(!old)return;const next={...old,...patch};setState(s=>({...s,classes:s.classes.map(x=>x.id===id?next:x)}));addActivity("Turma atualizada",old.name,"Dados da turma atualizados.",stableStringify(old),stableStringify(next));},
    addEvent:(e)=>{setState(s=>({...s,events:[e,...s.events]}));addActivity("Evento cadastrado",e.name,`${e.type} · ${e.date}.`);},
    updateEvent:(id,patch)=>{const old=state.events.find(x=>x.id===id);if(!old)return;const next={...old,...patch};setState(s=>({...s,events:s.events.map(x=>x.id===id?next:x)}));addActivity("Evento atualizado",old.name,"Informações do evento alteradas.",stableStringify(old),stableStringify(next));},
    addNotice:(n)=>{setState(s=>({...s,notices:[n,...s.notices]}));addActivity("Aviso publicado",n.title,`${n.priority} · ${n.audience}.`);},
    updateNotice:(id,patch)=>{const old=state.notices.find(x=>x.id===id);if(!old)return;const next={...old,...patch};setState(s=>({...s,notices:s.notices.map(x=>x.id===id?next:x)}));addActivity("Aviso atualizado",old.title,"Aviso editado ou encerrado.",stableStringify(old),stableStringify(next));},
    updateReenrollment:(id,status)=>{
      setState(s=>{
        const r=s.reenrollments.find(x=>x.id===id); if(!r)return s;
        let students=s.students;
        if(status==="Atualizada"){
          students=s.students.map(st=>st.id===r.studentId?{...st,semester:r.toSemester,disciplines:r.disciplines,history:[...st.history,`Rematrícula confirmada para ${r.toSemester} em ${todayPt()}`]}:st);
        }
        const next=s.reenrollments.map(x=>x.id===id?{...x,status}:x);
        const notifications=s.adminNotifications.map(n=>n.id===id?{...n,read:true}:n);
        return {...s,reenrollments:next,students,users:s.users.map(u=>u.id===r.studentId?{...u,semester:r.toSemester}:u),adminNotifications:notifications};
      });
      const r=state.reenrollments.find(x=>x.id===id); if(r)addActivity("Rematrícula atualizada",r.student,`Status alterado para ${status}.`,`Status: ${r.status}`,`Status: ${status}`);
    },
    addCertificate:(c)=>{setState(s=>({...s,certificates:[c,...s.certificates]}));addActivity("Certificado emitido",c.student,`${c.course} · ${c.workload}h · ${c.code}.`);},
    markAdminNotificationRead:(id)=>setState(s=>({...s,adminNotifications:s.adminNotifications.map(n=>n.id===id?{...n,read:true}:n)})),
    markAllAdminNotificationsRead:()=>setState(s=>({...s,adminNotifications:s.adminNotifications.map(n=>({...n,read:true}))})),
    refreshSharedReenrollments:()=>setState(s=>{
      const reenrollments=mergeSharedReenrollments(s.reenrollments,s.students);
      const fresh=reenrollments.filter(r=>!s.reenrollments.some(old=>old.id===r.id));
      const notifications=fresh.map(r=>({id:r.id,title:"Nova rematrícula",description:`${r.student} realizou uma rematrícula e selecionou ${r.disciplines.length} disciplina(s).`,date:r.submittedAt,read:false,type:"rematricula" as const,targetScreen:"admin-reenrollments" as const}));
      return fresh.length?{...s,reenrollments,adminNotifications:[...notifications,...s.adminNotifications]}:{...s,reenrollments};
    }),
    setPermission:(role,screen,value)=>setState(s=>({...s,permissions:{...s.permissions,[role]:{...s.permissions[role],[screen]:value}}})),
    resetPermissions:(role)=>setState(s=>({...s,permissions:{...s.permissions,[role]:defaultPermissionMap()[role]}})),
    canAccess:(screen,role="Administrador")=>!!state.permissions[role]?.[screen],
  }),[state]);

  useEffect(()=>{ setState(s=>{const reenrollments=mergeSharedReenrollments(s.reenrollments,s.students); const fresh=reenrollments.filter(r=>!s.reenrollments.some(old=>old.id===r.id)); if(!fresh.length)return {...s,reenrollments}; const notifications=fresh.map(r=>({id:r.id,title:"Nova rematrícula",description:`${r.student} realizou uma rematrícula e selecionou ${r.disciplines.length} disciplina(s).`,date:r.submittedAt,read:false,type:"rematricula" as const,targetScreen:"admin-reenrollments" as const})); return {...s,reenrollments,adminNotifications:[...notifications,...s.adminNotifications]};}); },[]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin(){const c=useContext(Ctx);if(!c)throw new Error("useAdmin deve ser usado dentro de AdminProvider");return c;}
