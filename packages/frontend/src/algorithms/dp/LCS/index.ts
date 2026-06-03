import type { AlgorithmModule } from '@vsa/shared'
import meta from './meta'
import generator from './generator'
import pythonCode from './python.py?raw'
import cppCode from './cpp.cpp?raw'

const mod: AlgorithmModule = { meta, generator, pythonCode, cppCode }
export default mod
