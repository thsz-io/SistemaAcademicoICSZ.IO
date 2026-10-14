import { useState } from "react";

interface Props {
  onLogout: () => void;
  user: { name: string; role: string; email: string };
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  themePreference: "system" | "light" | "dark";
  onThemePreferenceChange: (theme: "system" | "light" | "dark") => void;
}

export default function Perfil({ onLogout, user, fontScale, onFontScaleChange, themePreference, onThemePreferenceChange }: Props) {
  const [notifs, setNotifs] = useState(true);
  const [saved, setSaved] = useState(false);

  // Edição de contato
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("(11) 98765-4321");
  const [address, setAddress] = useState("Santana de Parnaíba, SP");
  const [personalEmail, setPersonalEmail] = useState("aluno.pessoal@email.com");

  // Modais interativos para os cards inferiores
  const [activeModal, setActiveModal] = useState<'documentos' | 'configuracoes' | 'seguranca' | null>(null);

  // Estados dos modais internos
  const [tema, setTema] = useState(themePreference);
  const [idioma, setIdioma] = useState("Português (BR)");
  const [twoFactor, setTwoFactor] = useState(true);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const senhaValida = novaSenha.length >= 8 && /[A-Za-z]/.test(novaSenha) && /\d/.test(novaSenha) && novaSenha === confirmarSenha;

  function salvarPerfil() {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  
  const iniciais = user.name ? user.name.substring(0, 2).toUpperCase() : "TH";

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto space-y-6 transition-all">
      <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Meu Perfil</h2>

      {/* Card do usuário - Corrigido o banner azul para não tampar o conteúdo */}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="h-24 relative" style={{ background: "var(--primary)" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #f97316 0%, transparent 60%)" }} />
        </div>
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6 relative z-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-md" style={{ background: "var(--accent)", color: "#fff", fontFamily: "Outfit, sans-serif" }}>
              {iniciais}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--foreground)" }}>{user.name}</h3>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold capitalize" style={{ background: "var(--primary)", color: "#fff" }}>
                  @{user.role}
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["RA", "2310456"],
              ["Curso", "ADS"],
              ["Semestre", "3º"],
              ["Turno", "Noturno"],
            ].map(([label, value]) => (
              <div key={label} className="px-3 py-3 rounded-xl border" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>{label}</div>
                <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 px-3 py-3 rounded-xl border" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)", fontFamily: "Inter, sans-serif" }}>Unidade</div>
            <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>FATEC Santana de Parnaíba</div>
          </div>
        </div>
      </div>

      {/* Dados de Contato (Editáveis) */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Dados de Contato</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-medium transition-colors"
            style={{ color: isEditing ? "var(--muted-foreground)" : "var(--primary)", fontFamily: "Outfit, sans-serif" }}
          >
            {isEditing ? "Cancelar" : "Editar dados"}
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>E-mail Pessoal</label>
              {isEditing ? (
                <input
                  type="email"
                  value={personalEmail}
                  onChange={e => setPersonalEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              ) : (
                <div className="text-sm font-medium">{personalEmail}</div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>Telefone / Celular</label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              ) : (
                <div className="text-sm font-medium">{phone}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)", fontFamily: "Outfit, sans-serif" }}>Endereço Completo</label>
            {isEditing ? (
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            ) : (
              <div className="text-sm font-medium">{address}</div>
            )}
          </div>

          {isEditing && (
            <button
              onClick={salvarPerfil}
              className="w-full mt-2 py-2.5 rounded-lg font-semibold text-sm transition-all"
              style={{ background: "var(--primary)", color: "#fff", fontFamily: "Outfit, sans-serif" }}
            >
              Salvar alterações
            </button>
          )}
        </div>
      </div>

      {/* Cards Inferiores Interativos (Documentos, Configurações, Segurança) */}
      <div className="grid sm:grid-cols-3 gap-3">
        <button onClick={() => setActiveModal('documentos')} className="flex flex-col items-start gap-2 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}>
          <span className="text-2xl text-slate-600">▱</span>
          <div>
            <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Documentos</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>RG, histórico, declarações</div>
          </div>
        </button>

        <button onClick={() => { setTema(themePreference); setActiveModal('configuracoes'); }} className="flex flex-col items-start gap-2 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}>
          <span className="text-2xl text-slate-600">⚙</span>
          <div>
            <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Configurações</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Notificações e tema</div>
          </div>
        </button>

        <button onClick={() => setActiveModal('seguranca')} className="flex flex-col items-start gap-2 p-4 bg-white rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "var(--border)" }}>
          <span className="text-2xl text-slate-600">▢</span>
          <div>
            <div className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Segurança</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Senha, autenticação 2FA</div>
          </div>
        </button>
      </div>

      {/* Acessibilidade & Preferências (Fonte Funcional) */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Acessibilidade & Preferências de Fonte</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Tamanho da fonte global</label>
              <span className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--primary)" }}>{fontScale}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>A-</span>
              <input 
                type="range" 
                min={85} 
                max={130} 
                step={5} 
                value={fontScale} 
                onChange={e => onFontScaleChange(+e.target.value)} 
                className="flex-1 accent-blue-800 cursor-pointer" 
              />
              <span className="text-base font-bold" style={{ color: "var(--muted-foreground)" }}>A+</span>
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>Arraste para ajustar o tamanho do texto de todo o sistema instantaneamente.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Notificações por e-mail</div>
              <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Avisos de prazo, notas e comunicados</div>
            </div>
            <button
              onClick={() => setNotifs(v => !v)}
              className="w-10 h-5.5 rounded-full transition-all relative"
              style={{ background: notifs ? "var(--primary)" : "var(--border)", height: 22, width: 40 }}
            >
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: notifs ? "calc(100% - 18px)" : 2 }} />
            </button>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm" style={{ background: "#dcfce7", color: "#15803d" }}>
              Preferências salvas com sucesso.
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="pb-4">
        <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: "#ef4444" }}>
          Sair da conta
        </button>
      </div>

      {/* MODAL INTERATIVO: DOCUMENTOS */}
      {activeModal === 'documentos' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setActiveModal(null)}>
          <div className="rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl" onClick={e => e.stopPropagation()} style={{ background: "var(--card)", color: "var(--foreground)" }}>
            <h3 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Gerenciar Documentos</h3>
            <p className="text-xs text-muted-foreground">Visualize e baixe seus comprovantes acadêmicos cadastrados.</p>
            <div className="space-y-2">
              {['RG e CPF Digitalizados', 'Histórico Escolar Oficial', 'Comprovante de Residência'].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border text-sm" style={{ borderColor: "var(--border)" }}>
                  <span>{doc}</span>
                  <span className="text-xs font-semibold text-blue-600 cursor-pointer">Baixar</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2 text-white rounded-lg text-sm font-semibold" style={{ background: "var(--primary)" }}>Fechar</button>
          </div>
        </div>
      )}

      {/* MODAL INTERATIVO: CONFIGURAÇÕES */}
      {activeModal === 'configuracoes' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setActiveModal(null)}>
          <div className="rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl" onClick={e => e.stopPropagation()} style={{ background: "var(--card)", color: "var(--foreground)" }}>
            <h3 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Configurações do Sistema</h3>
            
            <div>
              <label className="block text-xs font-medium mb-1">Tema da Aplicação</label>
              <select value={tema} onChange={e => setTema(e.target.value)} className="w-full p-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }}>
                <option value="system">Padrão do Sistema</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>

            <button onClick={() => { onThemePreferenceChange(tema as "system" | "light" | "dark"); setSaved(true); setTimeout(() => setSaved(false), 2000); setActiveModal(null); }} className="w-full py-2 text-white rounded-lg text-sm font-semibold" style={{ background: "var(--primary)" }}>Salvar Configurações</button>
          </div>
        </div>
      )}

      {/* MODAL INTERATIVO: SEGURANÇA */}
      {activeModal === 'seguranca' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setActiveModal(null)}>
          <div className="rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl" onClick={e => e.stopPropagation()} style={{ background: "var(--card)", color: "var(--foreground)" }}>
            <h3 className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Segurança da Conta</h3>
            
            <div>
              <label className="block text-xs font-medium mb-1">Senha Atual</label>
              <input type="password" placeholder="••••••••" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} className="w-full p-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }} />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Nova Senha</label>
              <input type="password" placeholder="••••••••" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className="w-full p-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Confirmar Nova Senha</label>
              <input type="password" placeholder="••••••••" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className="w-full p-2 border rounded-lg text-sm" style={{ borderColor: "var(--border)" }} />
              <p className="text-[11px] mt-1" style={{ color: senhaValida ? "#15803d" : "var(--muted-foreground)" }}>Use ao menos 8 caracteres, incluindo letras e números, e confirme a mesma senha.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium">Autenticação em Dois Fatores (2FA)</span>
              <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="w-4 h-4 accent-blue-600" />
            </div>

            <button disabled={!senhaValida || !senhaAtual} onClick={() => { alert("Alterações de segurança salvas com sucesso!"); setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha(""); setActiveModal(null); }} className="w-full py-2 text-white rounded-lg text-sm font-semibold mt-2 disabled:opacity-50" style={{ background: "var(--primary)" }}>Atualizar Segurança</button>
          </div>
        </div>
      )}

    </div>
  );
}
