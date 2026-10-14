const dados = [
  { disciplina: "Banco de Dados", realizadas: 28, presencas: 25 },
  { disciplina: "Estatística Aplicada", realizadas: 26, presencas: 22 },
  { disciplina: "Estruturas de Dados", realizadas: 30, presencas: 27 },
  { disciplina: "Engenharia de Software", realizadas: 24, presencas: 23 },
];

export default function Frequencia() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Frequência</h2>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Acompanhe suas presenças e faltas por disciplina.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dados.map(d => {
          const percentual = Math.round((d.presencas / d.realizadas) * 100);
          return <div key={d.disciplina} className="rounded-xl border p-5 bg-white" style={{ borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>{d.disciplina}</div>
            <div className="text-3xl font-bold mt-3" style={{ color: percentual >= 75 ? "#16a34a" : "#dc2626", fontFamily: "Outfit, sans-serif" }}>{percentual}%</div>
            <div className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>{d.presencas} presenças · {d.realizadas - d.presencas} faltas</div>
            <div className="h-2 rounded-full mt-4 overflow-hidden" style={{ background: "var(--border)" }}><div className="h-full rounded-full" style={{ width: `${percentual}%`, background: percentual >= 75 ? "#16a34a" : "#dc2626" }} /></div>
          </div>
        })}
      </div>
      <div className="rounded-xl border p-5 bg-white" style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold text-sm" style={{ fontFamily: "Outfit, sans-serif" }}>Regra de acompanhamento</h3>
        <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>A situação exibida é apenas demonstrativa. Em um sistema real, os dados devem ser calculados a partir dos registros oficiais de presença.</p>
      </div>
    </div>
  );
}