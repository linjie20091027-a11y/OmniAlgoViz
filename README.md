# OmniAlgoViz —— 信息竞赛算法可视化平台

> **Omni**（全）+ **Algo**（Algorithm）+ **Viz**（Visualization）
> 
> 覆盖 CSP / NOIP / NOI / IOI 等信息学竞赛的核心算法，交互式可视化学习平台。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-orange)](https://pnpm.io/)

---

## 特性

- **5 种可视化引擎**——柱状图（数组）、树形图（BST/堆/线段树/Trie）、链表图（栈/队列/哈希链）、二维网格（DP表）、坐标点（几何）
- **Python + C++ 双代码**——每个算法同时提供两种语言的实现，支持实时行号同步高亮
- **逐步演示**——播放/暂停/步进/调速，每步有详细中文说明
- **算法注册系统**——`import.meta.glob` 自动扫描，添加新算法零路由配置
- **玻璃质感 UI**——毛玻璃白色主题，响应式布局

---

## 已实现算法（27 个）

### 排序算法（9）

| 算法 | ID | 复杂度 |
|------|-----|--------|
| 冒泡排序 | `bubble-sort` | O(n²) |
| 选择排序 | `selection-sort` | O(n²) |
| 插入排序 | `insertion-sort` | O(n²) |
| 归并排序 | `merge-sort` | O(n log n) |
| 快速排序 | `quick-sort` | O(n log n) |
| 堆排序 | `heap-sort` | O(n log n) |
| 希尔排序 | `shell-sort` | O(n log n) ~ O(n²) |
| 计数排序 | `counting-sort` | O(n + k) |
| 基数排序 | `radix-sort` | O(d·(n + k)) |

### 数据结构（12）

| 算法 | ID | 可视化 | 复杂度 |
|------|-----|--------|--------|
| 栈 | `stack` | 链表 | O(1) |
| 队列 | `queue` | 链表 | O(1) |
| 单调栈 | `monotonic-stack` | 链表 | O(n) |
| 链表 | `linked-list` | 链表 | O(1) / O(n) |
| 哈希表 | `hash-table` | 链表（链地址法） | O(1) avg |
| 二叉堆 | `binary-heap` | 树形 | O(log n) |
| 并查集 | `disjoint-set` | 树形 | O(α(n)) |
| 二叉搜索树 | `bst` | 树形 | O(log n) avg |
| 树状数组 | `fenwick-tree` | 树形 | O(log n) |
| 线段树 | `segment-tree` | 树形 | O(log n) |
| 字典树 | `trie` | 树形 | O(L) |
| 优先队列 | `priority-queue` | 树形 | O(log n) |

### 基础算法（6）

| 算法 | ID | 复杂度 |
|------|-----|--------|
| 二分查找 | `binary-search` | O(log n) |
| 三分查找 | `ternary-search` | O(log n) |
| 前缀和 | `prefix-sum` | O(n) |
| 双指针 | `two-pointer` | O(n) |
| 滑动窗口 | `sliding-window` | O(n) |
| 离散化 | `discretization` | O(n log n) |

---

## 技术架构

```
visual-algo/
├── packages/
│   ├── shared/          # 共享类型（Scene / SceneObject / AlgorithmMeta）
│   ├── frontend/        # React SPA
│   │   └── src/
│   │       ├── engine/      # 可视化引擎
│   │       │   ├── bar-vis.tsx     # 柱状图渲染器
│   │       │   ├── tree-vis.tsx    # 树形图渲染器
│   │       │   ├── list-vis.tsx    # 链表图渲染器
│   │       │   ├── grid-vis.tsx    # 网格渲染器
│   │       │   ├── point-vis.tsx   # 坐标点渲染器
│   │       │   ├── code-panel.tsx  # 代码面板（Shiki 高亮）
│   │       │   └── player.tsx      # 统一播放器
│   │       ├── registry/      # 算法注册（自动扫描）
│   │       ├── algorithms/    # 算法数据库（按类别分目录）
│   │       │   ├── sorting/        # 排序类
│   │       │   ├── data-structure/ # 数据结构类
│   │       │   └── fundamental/    # 基础算法类
│   │       ├── layout/        # 玻璃质感布局
│   │       └── pages/         # 路由页面
│   └── backend/          # C++ 编译服务（规划中）
├── Dockerfile            # 生产部署
├── server.js             # Express 静态服务
└── pnpm-workspace.yaml   # Monorepo 配置
```

### 核心数据流

```
用户参数 → StepGenerator() → Scene[] → Player Hook
                             ↑
                    ┌────────┴────────┐
                    ↓                 ↓
              Visualizer        Code Panel
           (Canvas 渲染)    (Shiki 行同步高亮)
```

每个算法只需 4 个文件：

| 文件 | 职责 |
|------|------|
| `meta.ts` | 元数据（名称、类别、复杂度、参数） |
| `generator.ts` | 步骤生成器（Generator 函数，产出 Scene[]） |
| `python.py` | Python 实现代码 |
| `cpp.cpp` | C++ 实现代码 |

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev              # → http://localhost:5173

# 构建生产版本
pnpm build            # → packages/frontend/dist/

# 生产模式预览
pnpm start            # → http://localhost:3000
```

## Docker 部署

```bash
docker build -t omnialgoviz .
docker run -p 3000:3000 omnialgoviz
```

---

## 添加新算法

1. 创建目录 `packages/frontend/src/algorithms/{category}/{algo-name}/`
2. 写入 4 个文件：
   - `meta.ts` — 算法元数据
   - `generator.ts` — 步骤生成器（`function*`）
   - `python.py` — Python 代码
   - `cpp.cpp` — C++ 代码
3. 注册系统自动发现，无需手动配置路由

```typescript
// meta.ts 示例
export default {
  id: 'my-algo',
  title: '我的算法',
  category: 'sorting',
  visualizerType: 'bar',  // bar | tree | list | grid | point
  difficulty: 1,
  params: [{ key: 'size', label: '数据量', type: 'number', default: 10, min: 3, max: 30 }],
  complexity: { time: 'O(n)', space: 'O(1)' },
}
```

---

## 路线图

- [x] 排序算法（9 个）
- [x] 数据结构（12 个）
- [x] 基础算法（6 个）
- [ ] 图论算法（BFS/DFS/Dijkstra/Floyd/Kruskal/Prim/网络流……）
- [ ] 动态规划（背包/LCS/LIS/编辑距离/数位DP……）
- [ ] 数学/数论（筛法/GCD/快速幂/CRT/博弈论……）
- [ ] 字符串算法（KMP/Manacher/AC自动机/后缀数组……）
- [ ] 搜索算法（DFS/BFS/A\*/IDA\*/双向搜索……）
- [ ] 计算几何（凸包/最近点对/线段相交……）
- [ ] C++/Python 在线编译运行后端
