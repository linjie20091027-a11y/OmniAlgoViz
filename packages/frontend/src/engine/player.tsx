import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { Scene, AlgorithmModule, VisualizerType } from '@vsa/shared'
import BarVisualizer from './bar-vis'
import TreeVisualizer from './tree-vis'
import ListVisualizer from './list-vis'
import GridVisualizer from './grid-vis'
import PointVisualizer from './point-vis'
import GraphVisualizer from './graph-vis'
import CodePanel from './code-panel'
import ParamPanel from './param-panel'
import ColorLegend from './color-legend'

interface PlayerProps { algorithm: AlgorithmModule }

export type PlayerState = 'idle' | 'playing' | 'paused' | 'done'

const KEY_STEPS = ['交换', 'Swapping', '交换', '松弛', '合并', '删除', '弹出', 'swap', '合并', '归位', '匹配', '覆盖']

function isKeyStep(desc: string): boolean {
  return KEY_STEPS.some(k => desc.includes(k))
}

export default function Player({ algorithm }: PlayerProps) {
  const [state, setState] = useState<PlayerState>('idle')
  const [step, setStep] = useState(0)
  const [speed, setSpeed] = useState(0.5)
  const [language, setLanguage] = useState<'python' | 'cpp'>('python')
  const [params, setParams] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {}
    algorithm.meta.params.forEach(p => { defaults[p.key] = p.default })
    return defaults
  })

  const scenesRef = useRef<Scene[]>([])
  const timerRef = useRef<number>(0)
  const pauseTimerRef = useRef<number>(0)

  const scenes = useMemo(() => {
    const gen = algorithm.generator(params)
    const result: Scene[] = []
    for (const scene of gen) result.push(scene)
    return result
  }, [algorithm, params])

  const current = scenes[step]

  useEffect(() => { scenesRef.current = scenes }, [scenes])

  const play = useCallback(() => {
    if (state === 'done') { setStep(0); setState('playing'); return }
    setState('playing')
  }, [state])

  const pause = useCallback(() => {
    setState('paused')
    window.clearInterval(timerRef.current)
    window.clearTimeout(pauseTimerRef.current)
  }, [])

  const reset = useCallback(() => {
    window.clearInterval(timerRef.current)
    window.clearTimeout(pauseTimerRef.current)
    setStep(0)
    setState('idle')
  }, [])

  const advance = useCallback(() => {
    setStep(prev => {
      if (prev >= scenesRef.current.length - 1) {
        window.clearInterval(timerRef.current)
        setState('done')
        return prev
      }
      const next = prev + 1
      const nextScene = scenesRef.current[next]
      // 关键步骤暂停 1.2 秒
      if (nextScene && isKeyStep(nextScene.description)) {
        window.clearInterval(timerRef.current)
        pauseTimerRef.current = window.setTimeout(() => {
          window.clearInterval(timerRef.current)
          const baseInterval = 800 / speed
          timerRef.current = window.setInterval(() => advanceRef.current?.(), baseInterval)
        }, 1200)
      }
      return next
    })
  }, [speed])

  const advanceRef = useRef(advance)
  advanceRef.current = advance

  useEffect(() => {
    if (state === 'playing') {
      const baseInterval = 800 / speed
      timerRef.current = window.setInterval(advance, baseInterval)
      return () => {
        window.clearInterval(timerRef.current)
        window.clearTimeout(pauseTimerRef.current)
      }
    }
  }, [state, speed, advance])

  const goToStep = useCallback((n: number) => {
    window.clearInterval(timerRef.current)
    window.clearTimeout(pauseTimerRef.current)
    const clamped = Math.max(0, Math.min(n, scenes.length - 1))
    setStep(clamped)
    if (clamped >= scenes.length - 1) setState('done')
    else if (state === 'playing') setState('paused')
  }, [scenes.length, state])

  const handleParamChange = useCallback((key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }))
    reset()
  }, [reset])

  const code = language === 'python' ? algorithm.pythonCode : algorithm.cppCode

  return (
    <div className="flex flex-col h-full">
      <div className="glass-elevated rounded-2xl mx-4 mt-4 px-4 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={reset} className="p-2 rounded-xl glass-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors" title="重置">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" /></svg>
          </button>
          {state !== 'playing' ? (
            <button onClick={play} className="p-2 rounded-xl glass-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors" title="播放">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            </button>
          ) : (
            <button onClick={pause} className="p-2 rounded-xl glass-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors" title="暂停">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75A.75.75 0 015.75 3zm8.5 0a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <button onClick={() => goToStep(step - 1)} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors" title="上一步">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
          </button>
          <span className="tabular-nums font-mono">{step + 1} / {scenes.length}</span>
          <button onClick={() => goToStep(step + 1)} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors" title="下一步">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
          </button>
        </div>

        <div className="flex-1 mx-2">
          <input type="range" min={0} max={scenes.length - 1} value={step}
            onChange={e => goToStep(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-200 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-md" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="whitespace-nowrap">速度</span>
          {[0.5, 1, 2, 4].map(s => (
            <button key={s} onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded-lg font-mono transition-colors ${speed === s ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' : 'hover:bg-white/50 dark:hover:bg-gray-700/50'}`}>
              {s}x
            </button>
          ))}
        </div>

        <div className="flex rounded-xl glass-light overflow-hidden text-xs">
          {(['python', 'cpp'] as const).map(lang => (
            <button key={lang} onClick={() => { setLanguage(lang); pause() }}
              className={`px-3 py-1.5 font-mono transition-colors ${language === lang ? 'bg-white/70 text-indigo-600 font-medium dark:bg-gray-700/70 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
              {lang === 'python' ? 'Python' : 'C++'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        <div className="flex-1 glass-elevated rounded-2xl overflow-hidden relative flex flex-col">
          <ColorLegend />
          {current && <VisualizerSwitch type={algorithm.meta.visualizerType} scene={current} />}
          {current && (
            <div className="absolute bottom-0 left-0 right-0 px-5 py-3 glass-light border-t glass-border">
              <p className="text-base text-slate-700 dark:text-slate-200">{current.description}</p>
            </div>
          )}
        </div>
        <div className="w-[420px] shrink-0 glass-elevated rounded-2xl overflow-hidden">
          <CodePanel code={code} activeLine={current?.codeLine ?? 1} language={language} />
        </div>
      </div>

      <ParamPanel params={algorithm.meta.params} values={params} onChange={handleParamChange}
        complexity={algorithm.meta.complexity} difficulty={algorithm.meta.difficulty} />
    </div>
  )
}

function VisualizerSwitch({ type, scene }: { type: VisualizerType; scene: Scene }) {
  switch (type) {
    case 'tree':  return <TreeVisualizer scene={scene} />
    case 'list':  return <ListVisualizer scene={scene} />
    case 'grid':  return <GridVisualizer scene={scene} />
    case 'point': return <PointVisualizer scene={scene} />
    case 'graph': return <GraphVisualizer scene={scene} />
    default:      return <BarVisualizer scene={scene} />
  }
}
