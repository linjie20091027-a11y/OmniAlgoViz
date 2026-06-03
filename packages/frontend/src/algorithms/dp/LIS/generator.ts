import { COLORS, type Scene, type CellObject } from '@vsa/shared'

function mkCell(row: number, col: number, value: string | number, color: string): CellObject {
  return { kind: 'cell', id: `c-${row}-${col}`, row, col, value, color }
}

export default function* lisGen(params: { size: number }): Generator<Scene> {
  const n = params.size
  const nums: number[] = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1)
  const dp: number[] = new Array(n).fill(1)

  const cells: CellObject[] = []
  cells.push(mkCell(0, 0, '索引', COLORS.default))
  for (let i = 0; i < n; i++) cells.push(mkCell(0, i + 1, i, COLORS.default))
  cells.push(mkCell(1, 0, '数值', COLORS.default))
  for (let i = 0; i < n; i++) cells.push(mkCell(1, i + 1, nums[i], COLORS.default))
  cells.push(mkCell(2, 0, 'dp[]', COLORS.default))
  for (let i = 0; i < n; i++) cells.push(mkCell(2, i + 1, dp[i], COLORS.default))

  yield {
    objects: cells,
    codeLine: 1,
    description: `数组：[${nums.join(', ')}]，求最长上升子序列`,
  }

  for (let i = 0; i < n; i++) {
    const row: CellObject[] = []
    row.push(mkCell(0, 0, '索引', COLORS.default))
    for (let k = 0; k < n; k++) row.push(mkCell(0, k + 1, k, COLORS.default))
    row.push(mkCell(1, 0, '数值', COLORS.default))
    for (let k = 0; k < n; k++) row.push(mkCell(1, k + 1, nums[k], k === i ? COLORS.comparing : COLORS.default))
    row.push(mkCell(2, 0, 'dp[]', COLORS.default))
    for (let k = 0; k < n; k++) row.push(mkCell(2, k + 1, dp[k], k < i ? COLORS.sorted : COLORS.default))

    yield {
      objects: row,
      codeLine: 4,
      description: `处理索引 ${i}（值=${nums[i]}），扫描前面元素`,
    }

    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)

        const compRow: CellObject[] = []
        compRow.push(mkCell(0, 0, '索引', COLORS.default))
        for (let k = 0; k < n; k++) compRow.push(mkCell(0, k + 1, k, COLORS.default))
        compRow.push(mkCell(1, 0, '数值', COLORS.default))
        for (let k = 0; k < n; k++) {
          const color = k === i ? COLORS.comparing : k === j ? COLORS.highlight : COLORS.default
          compRow.push(mkCell(1, k + 1, nums[k], color))
        }
        compRow.push(mkCell(2, 0, 'dp[]', COLORS.default))
        for (let k = 0; k < n; k++) {
          const color = k === i || k === j ? COLORS.highlight : k < i ? COLORS.sorted : COLORS.default
          compRow.push(mkCell(2, k + 1, dp[k], color))
        }

        yield {
          objects: compRow,
          codeLine: 5,
          description: `找到更小值 nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}，更新 dp[${i}] = ${dp[i]}`,
        }
      }
    }

    const doneRow: CellObject[] = []
    doneRow.push(mkCell(0, 0, '索引', COLORS.default))
    for (let k = 0; k < n; k++) doneRow.push(mkCell(0, k + 1, k, COLORS.default))
    doneRow.push(mkCell(1, 0, '数值', COLORS.default))
    for (let k = 0; k < n; k++) doneRow.push(mkCell(1, k + 1, nums[k], k <= i ? COLORS.sorted : COLORS.default))
    doneRow.push(mkCell(2, 0, 'dp[]', COLORS.default))
    for (let k = 0; k < n; k++) doneRow.push(mkCell(2, k + 1, dp[k], k <= i ? COLORS.sorted : COLORS.default))

    yield {
      objects: doneRow,
      codeLine: 6,
      description: `索引 ${i} 处理完成，dp[${i}] = ${dp[i]}`,
    }
  }

  const maxLen = Math.max(...dp)
  const lis: number[] = []
  let cur = maxLen
  for (let i = n - 1; i >= 0 && cur > 0; i--) {
    if (dp[i] === cur) {
      lis.unshift(nums[i])
      cur--
    }
  }

  const finalRow: CellObject[] = []
  finalRow.push(mkCell(0, 0, '索引', COLORS.default))
  for (let k = 0; k < n; k++) finalRow.push(mkCell(0, k + 1, k, COLORS.default))
  finalRow.push(mkCell(1, 0, '数值', COLORS.default))
  for (let k = 0; k < n; k++) {
    const inLis = lis.includes(nums[k]) && lis.indexOf(nums[k]) === dp[k] - 1
    finalRow.push(mkCell(1, k + 1, nums[k], inLis ? COLORS.sorted : COLORS.default))
  }
  finalRow.push(mkCell(2, 0, 'dp[]', COLORS.default))
  for (let k = 0; k < n; k++) finalRow.push(mkCell(2, k + 1, dp[k], COLORS.sorted))

  yield {
    objects: finalRow,
    codeLine: 7,
    description: `最长上升子序列长度 = ${maxLen}，序列：[${lis.join(', ')}]`,
  }
}
