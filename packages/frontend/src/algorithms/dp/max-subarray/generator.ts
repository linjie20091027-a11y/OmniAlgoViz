import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* maxSubarray(params: { size: number }): Generator<Scene> {
  const n = params.size
  const nums: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 20) - 9)

  const cells: CellObject[] = []
  cells.push(mkCell(0, 0, '索引', COLORS.default))
  for (let i = 0; i < n; i++) cells.push(mkCell(0, i + 1, i, COLORS.default))
  cells.push(mkCell(1, 0, 'nums', COLORS.default))
  for (let i = 0; i < n; i++) {
    cells.push(mkCell(1, i + 1, nums[i], nums[i] < 0 ? COLORS.swapping : COLORS.default))
  }

  yield {
    objects: cells,
    codeLine: 1,
    description: `数组：[${nums.join(', ')}]，求最大子数组和`,
  }

  let curMax = nums[0]
  let globalMax = nums[0]
  let endIdx = 0

  const row2: CellObject[] = []
  row2.push(mkCell(2, 0, '当前和', COLORS.default))
  for (let i = 0; i < n; i++) row2.push(mkCell(2, i + 1, '', COLORS.default))
  const row3: CellObject[] = []
  row3.push(mkCell(3, 0, '最大和', COLORS.default))
  for (let i = 0; i < n; i++) row3.push(mkCell(3, i + 1, '', COLORS.default))

  yield {
    objects: [...cells, ...row2, ...row3],
    codeLine: 2,
    description: `初始化：curMax=${curMax}，globalMax=${globalMax}`,
  }

  for (let i = 1; i < n; i++) {
    const prevCur = curMax
    curMax = Math.max(nums[i], curMax + nums[i])

    const compareCells: CellObject[] = []
    compareCells.push(mkCell(0, 0, '索引', COLORS.default))
    for (let k = 0; k < n; k++) compareCells.push(mkCell(0, k + 1, k, COLORS.default))
    compareCells.push(mkCell(1, 0, 'nums', COLORS.default))
    for (let k = 0; k < n; k++) {
      const color = k === i ? COLORS.comparing : k < i ? COLORS.sorted : COLORS.default
      compareCells.push(mkCell(1, k + 1, nums[k], color))
    }
    compareCells.push(mkCell(2, 0, '当前和', COLORS.default))
    for (let k = 0; k < n; k++) {
      const color = k === i ? COLORS.highlight : k < i ? COLORS.pivot : COLORS.default
      compareCells.push(mkCell(2, k + 1, k === i ? curMax : k === i - 1 ? prevCur : '', color))
    }
    compareCells.push(mkCell(3, 0, '最大和', COLORS.default))
    for (let k = 0; k < n; k++) {
      compareCells.push(mkCell(3, k + 1, k <= i ? (k === i ? Math.max(globalMax, curMax) : globalMax) : '', COLORS.default))
    }

    yield {
      objects: compareCells,
      codeLine: 4,
      description: `索引 ${i}：nums[${i}]=${nums[i]}，curMax = max(${nums[i]}, ${prevCur} + ${nums[i]}) = ${curMax}`,
    }

    globalMax = Math.max(globalMax, curMax)
    if (curMax > globalMax) endIdx = i
  }

  let startIdx = 0
  let sum = 0, maxSum = globalMax
  const pathIndices: number[] = []
  for (let i = endIdx; i >= 0 && maxSum > 0; i--) {
    sum += nums[i]
    pathIndices.push(i)
    if (sum === maxSum) { startIdx = i; break }
  }

  const finalCells: CellObject[] = []
  finalCells.push(mkCell(0, 0, '索引', COLORS.default))
  for (let k = 0; k < n; k++) finalCells.push(mkCell(0, k + 1, k, COLORS.default))
  finalCells.push(mkCell(1, 0, 'nums', COLORS.default))
  for (let k = 0; k < n; k++) {
    const color = k >= startIdx && k <= endIdx ? COLORS.sorted : COLORS.default
    finalCells.push(mkCell(1, k + 1, nums[k], color))
  }
  finalCells.push(mkCell(2, 0, '结果', COLORS.highlight))
  finalCells.push(mkCell(2, 1, `区间 [${startIdx},${endIdx}]`, COLORS.highlight))
  finalCells.push(mkCell(2, 2, `和=${globalMax}`, COLORS.highlight))

  yield {
    objects: finalCells,
    codeLine: 6,
    description: `最大子数组和 = ${globalMax}，子数组：[${nums.slice(startIdx, endIdx + 1).join(', ')}]（索引 ${startIdx}-${endIdx}）`,
  }
}
