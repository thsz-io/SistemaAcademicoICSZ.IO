export type AdminIconName = "dashboard"|"users"|"student"|"refresh"|"teacher"|"book"|"class"|"event"|"bell"|"certificate"|"report"|"settings"|"history"|"search"|"plus"|"edit"|"filter"|"check"|"clock"|"download"|"eye"|"archive"|"send"|"warning"|"calendar";
export default function AdminIcon({name,size=18}:{name:AdminIconName;size?:number}){
  const c={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  const p:Record<AdminIconName,React.ReactNode>={
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    student:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    refresh:<><path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.8 4L21 14"/><path d="M21 20v-6h-6"/></>,
    teacher:<><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="M19 8h3M21 6v4"/></>,
    book:<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5V22"/></>,
    class:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v4M16 4v4M3 10h18"/><path d="M8 14h3M13 14h3M8 17h3"/></>,
    event:<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/></>,
    certificate:<><path d="M4 4h16v12H4z"/><path d="m8 20 4-2 4 2v-4H8z"/><path d="M8 8h8M8 11h5"/></>,
    report:<><path d="M4 20V10M9 20V4M14 20v-7M19 20V7"/><path d="M2 20h20"/></>,
    settings:<><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.5v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.16 15a1.7 1.7 0 0 0-1.56-1.03H6.5v-2.5h.1A1.7 1.7 0 0 0 8.16 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.53 5.1V5h2.5v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.1v2.5h-.1A1.7 1.7 0 0 0 19.4 15z"/></>,
    history:<><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    edit:<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/></>,
    filter:<><path d="M4 5h16M7 12h10M10 19h4"/></>,
    check:<><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    download:<><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></>,
    eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    archive:<><path d="M3 7h18v4H3z"/><path d="M5 11v9h14v-9M9 15h6"/></>,
    send:<><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
    warning:<><path d="M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></>,
    calendar:<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></>,
  };
  return <svg {...c}>{p[name]}</svg>;
}
