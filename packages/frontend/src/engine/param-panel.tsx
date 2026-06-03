import type { AlgorithmParam } from '@vsa/shared'

interface Props {
  params: AlgorithmParam[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  complexity: { time: string; space: string; worst?: string }
  difficulty: number
}

export default function ParamPanel({ params, values, onChange, complexity }: Props) {
  return (
    <div className="glass-elevated rounded-2xl mx-4 mb-4 px-4 py-3 shrink-0">
      <div className="flex items-center gap-4">
        {params.map(p => (
          <div key={p.key} className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">{p.label}</label>
            {p.type === 'number' ? (
              <input
                type="number"
                value={values[p.key]}
                min={p.min}
                max={p.max}
                step={p.step ?? 1}
                onChange={e => onChange(p.key, Number(e.target.value))}
                className="w-20 px-2 py-1.5 text-sm rounded-xl glass-light font-mono
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 text-center"
              />
            ) : (
              <select
                value={values[p.key]}
                onChange={e => onChange(p.key, e.target.value)}
                className="px-2 py-1.5 text-sm rounded-xl glass-light font-mono
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              >
                {p.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}

        <div className="glass-divider w-px !h-6" />

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="text-slate-400">时间</span>
            <span className="font-mono text-slate-700">{complexity.time}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-400">空间</span>
            <span className="font-mono text-slate-700">{complexity.space}</span>
          </span>
          {complexity.worst && (
            <span className="flex items-center gap-1">
              <span className="text-slate-400">最坏</span>
              <span className="font-mono text-slate-700">{complexity.worst}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
