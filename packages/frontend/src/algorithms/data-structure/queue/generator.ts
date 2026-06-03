import type { Scene, BarObject } from '@vsa/shared'
import { COLORS } from '@vsa/shared'

function mkBar(id: string, value: number, index: number, color: string): BarObject {
  return { kind: 'bar', id, value, index, color }
}

function toBars(arr: number[], front: number, rear: number, highlight: number | null = null): BarObject[] {
  const n = arr.length
  return arr.map((v, i) => {
    if (highlight !== null && i === highlight) return mkBar(`bar-${i}`, v, i, COLORS.highlight)
    if (i === front % n && front !== rear) return mkBar(`bar-${i}`, v, i, COLORS.pointer)
    if (i === rear % n) return mkBar(`bar-${i}`, v, i, COLORS.selected)
    return mkBar(`bar-${i}`, v, i, COLORS.inactive)
  })
}

export default function* queueGenerator(params: { size: number }): Generator<Scene> {
  const capacity = params.size
  const arr: number[] = new Array(capacity).fill(0)
  let front = 0
  let rear = 0
  let cnt = 0

  yield {
    objects: toBars(arr, front, rear),
    highlights: [],
    codeLine: 1,
    description: `初始化空队列，容量 ${capacity}，front = ${front}，rear = ${rear}`,
  }

  const values = [5, 12, 8, 23, 17, 3, 45, 9].slice(0, capacity)

  for (const val of values) {
    if (cnt >= capacity) {
      yield {
        objects: toBars(arr, front, rear),
        highlights: [],
        codeLine: 3,
        description: `队列已满！无法 enqueue(${val})`,
      }
      break
    }
    arr[rear] = val
    cnt++
    yield {
      objects: toBars(arr, front, rear, rear),
      highlights: [`bar-${rear}`],
      codeLine: 4,
      description: `enqueue(${val}) —— 元素 ${val} 入队，rear 移动到 ${(rear + 1) % capacity}`,
    }
    rear = (rear + 1) % capacity
  }

  yield {
    objects: toBars(arr, front, rear),
    highlights: [],
    codeLine: 2,
    description: `入队完成，当前队列大小 = ${cnt}`,
  }

  const deqCount = Math.min(3, cnt)
  for (let d = 0; d < deqCount; d++) {
    const val = arr[front]
    yield {
      objects: toBars(arr, front, rear, front),
      highlights: [`bar-${front}`],
      codeLine: 6,
      description: `dequeue() —— 取出队首元素 ${val}，front 从 ${front} 移动到 ${(front + 1) % capacity}`,
    }
    arr[front] = 0
    front = (front + 1) % capacity
    cnt--
  }

  yield {
    objects: toBars(arr, front, rear),
    highlights: [],
    codeLine: 7,
    description: '出队操作完成',
  }
}
