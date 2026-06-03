import { COLORS } from '@vsa/shared'

const LEGEND_ITEMS = [
  { color: COLORS.default,   label: '默认 / 未排序' },
  { color: COLORS.comparing, label: '比较中' },
  { color: COLORS.swapping,  label: '交换中' },
  { color: COLORS.sorted,    label: '已排序 / 完成' },
  { color: COLORS.pivot,     label: '基准 / 枢轴' },
  { color: COLORS.pointer,   label: '指针' },
  { color: COLORS.highlight, label: '高亮' },
]

export default function ColorLegend() {
  return (
    <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-1.5">
      {LEGEND_ITEMS.map(item => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            style={{ background: item.color }}
          />
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.label}</span>
        </span>
      ))}
    </div>
  )
}
