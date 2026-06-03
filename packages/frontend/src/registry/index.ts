import type { AlgorithmModule } from '@vsa/shared'

// import.meta.glob 自动发现所有算法模块，零手动注册
const moduleFiles = import.meta.glob<{ default: AlgorithmModule }>(
  '../algorithms/**/index.ts',
  { eager: true }
)

export const registry: AlgorithmModule[] = Object.values(moduleFiles).map(m => m.default)
