# OmniAlgoViz —— 算法可视化学习平台 / Algorithm Visualization Platform

> **Omni**（全/All）+ **Algo**（Algorithm）+ **Viz**（Visualization）
>
> 覆盖 CSP / NOIP / NOI / IOI 信息学竞赛核心算法 | 82 algorithms · 9 categories · 5 visualization engines
>
> **Live Demo**: [omnialgoviz.up.railway.app](https://omnialgoviz.up.railway.app)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-monorepo-orange)](https://pnpm.io/)
[![Live](https://img.shields.io/badge/Live-omnialgoviz.up.railway.app-0B0D0E)](https://omnialgoviz.up.railway.app)

---

## 特性 / Features

- **5 种可视化引擎 / 5 Visualization Engines**——柱状图 Bar（数组 Array）、树形图 Tree（BST/堆 Heap/线段树 SegTree/Trie）、链表图 List（栈 Stack/队列 Queue/哈希链 Hash Chain）、二维网格 Grid（DP 表）、坐标点 Point（几何 Geometry）
- **Python + C++ 双代码 / Dual Code Support**——每个算法同时提供两种语言实现，Shiki 行号同步高亮 / Each algorithm includes Python & C++ with real-time line-sync highlighting
- **逐步演示 / Step-by-Step Playback**——播放 ▶ / 暂停 ⏸ / 步进 ⏭ / 调速 ⏩，每步有详细中文说明 / Play, pause, step, speed control with detailed descriptions
- **算法注册系统 / Auto-Registry**——`import.meta.glob` 自动扫描，添加新算法零路由配置 / Auto-discover algorithms, zero routing config
- **玻璃质感 UI / Glassmorphism UI**——浅色/暗色双模式 / Light & dark mode with glassmorphism effects
- **生产级安全 / Production Security**——Helmet CSP + CORS + Rate Limiting

---

## 已实现算法 / Implemented Algorithms （82 个）

### 排序算法 / Sorting（9）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| 冒泡排序 Bubble Sort | `bubble-sort` | O(n²) |
| 选择排序 Selection Sort | `selection-sort` | O(n²) |
| 插入排序 Insertion Sort | `insertion-sort` | O(n²) |
| 归并排序 Merge Sort | `merge-sort` | O(n log n) |
| 快速排序 Quick Sort | `quick-sort` | O(n log n) |
| 堆排序 Heap Sort | `heap-sort` | O(n log n) |
| 希尔排序 Shell Sort | `shell-sort` | O(n log n) ~ O(n²) |
| 计数排序 Counting Sort | `counting-sort` | O(n + k) |
| 基数排序 Radix Sort | `radix-sort` | O(d·(n + k)) |

### 数据结构 / Data Structures（12）

| 算法 Algorithm | ID | 可视化 Viz | 复杂度 Complexity |
|---|---|---|---|
| 栈 Stack | `stack` | list | O(1) |
| 队列 Queue | `queue` | list | O(1) |
| 单调栈 Monotonic Stack | `monotonic-stack` | list | O(n) |
| 链表 Linked List | `linked-list` | list | O(1)/O(n) |
| 哈希表 Hash Table | `hash-table` | list (chaining) | O(1) avg |
| 二叉堆 Binary Heap | `binary-heap` | tree | O(log n) |
| 并查集 DSU | `disjoint-set` | tree | O(α(n)) |
| 二叉搜索树 BST | `bst` | tree | O(log n) avg |
| 树状数组 Fenwick Tree | `fenwick-tree` | tree | O(log n) |
| 线段树 Segment Tree | `segment-tree` | tree | O(log n) |
| 字典树 Trie | `trie` | tree | O(L) |
| 优先队列 Priority Queue | `priority-queue` | tree | O(log n) |

### 基础算法 / Fundamentals（6）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| 二分查找 Binary Search | `binary-search` | O(log n) |
| 三分查找 Ternary Search | `ternary-search` | O(log n) |
| 前缀和 Prefix Sum | `prefix-sum` | O(n) |
| 双指针 Two Pointers | `two-pointer` | O(n) |
| 滑动窗口 Sliding Window | `sliding-window` | O(n) |
| 离散化 Discretization | `discretization` | O(n log n) |

### 图论算法 / Graph Theory（16）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| BFS 广度优先搜索 | `bfs` | O(V+E) |
| DFS 深度优先搜索 | `dfs` | O(V+E) |
| Dijkstra 最短路径 | `dijkstra` | O((V+E)log V) |
| Bellman-Ford 最短路径 | `bellman-ford` | O(VE) |
| Floyd-Warshall 全源最短路径 | `floyd` | O(V³) |
| Kruskal 最小生成树 | `kruskal` | O(E log E) |
| Prim 最小生成树 | `prim` | O(E log V) |
| 拓扑排序 Topological Sort | `topological-sort` | O(V+E) |
| Tarjan 强连通分量 | `tarjan-scc` | O(V+E) |
| 二分图判定 Bipartite Check | `bipartite-check` | O(V+E) |
| 匈牙利算法 Hungarian | `hungarian` | O(VE) |
| SPFA 最短路径 | `spfa` | O(VE)* |
| Dinic 最大流 | `dinic` | O(V²E) |
| 最小生成树比较 MST Comparison | `mst` | O(E log E) |
| 欧拉路径 Euler Path | `euler-path` | O(V+E) |
| 哈密顿路径 Hamiltonian | `hamiltonian` | O(V!) |

### 动态规划 / Dynamic Programming（10）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| 01 背包 0/1 Knapsack | `knapsack-01` | O(nW) |
| 最长公共子序列 LCS | `LCS` | O(nm) |
| 最长上升子序列 LIS | `LIS` | O(n log n) |
| 零钱兑换 Coin Change | `coin-change` | O(n·amount) |
| 编辑距离 Edit Distance | `edit-distance` | O(nm) |
| 最大子数组和 Max Subarray | `max-subarray` | O(n) |
| 矩阵链乘 Matrix Chain | `matrix-chain` | O(n³) |
| 石子合并 Stone Merge | `stone-merge` | O(n³) |
| 数位 DP Digit DP | `digit-dp` | O(log n) |
| 状压 DP / TSP State Compression | `state-compression` | O(2^n·n²) |

### 数学 / 数论 / Mathematics（10）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| 埃氏筛法 Sieve of Eratosthenes | `sieve` | O(n log log n) |
| 欧几里得算法 Euclidean GCD | `gcd` | O(log n) |
| 快速幂 Fast Exponentiation | `fast-pow` | O(log n) |
| 乘法逆元 Modular Inverse | `modular-inverse` | O(log mod) |
| 中国剩余定理 CRT | `CRT` | O(n log M) |
| 快速乘 Russian Peasant Multiplication | `quick-mul` | O(log n) |
| 卡特兰数 Catalan Numbers | `catalan` | O(n²) |
| Nim 博弈 Nim Game | `nim-game` | O(n) |
| Miller-Rabin 素性测试 | `prime-test` | O(k log³ n) |
| 组合数 Pascal's Triangle | `combination-num` | O(n²) |

### 字符串算法 / String（8）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| KMP 字符串匹配 | `kmp` | O(n+m) |
| Manacher 最长回文子串 | `manacher` | O(n) |
| Rabin-Karp 字符串匹配 | `rabin-karp` | O(n+m) avg |
| Z 函数 Z-Algorithm | `z-algorithm` | O(n) |
| AC 自动机 Aho-Corasick | `ac-automaton` | O(n+m+z) |
| 后缀数组 Suffix Array | `suffix-array` | O(n log n) |
| 最小表示法 Minimum Notation | `minimum-notation` | O(n) |
| 字符串哈希 String Hashing | `string-hash` | O(n) / O(1) |

### 搜索算法 / Search（6）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| BFS 搜索 BFS Search | `bfs-search` | O(b^d) |
| DFS 搜索 DFS Search | `dfs-search` | O(b^d) |
| A\* 启发式搜索 A-Star | `a-star` | O(E) |
| IDA\* 迭代加深 | `ida-star` | O(b^d) |
| 双向 BFS Bidirectional BFS | `bidirectional-bfs` | O(b^(d/2)) |
| Dancing Links / DLX | `dlx` | Exponential |

### 计算几何 / Geometry（5）

| 算法 Algorithm | ID | 复杂度 Complexity |
|---|---|---|
| Andrew 凸包 Convex Hull | `convex-hull` | O(n log n) |
| 最近点对 Closest Pair | `closest-pair` | O(n log n) |
| 线段相交 Line Intersection | `line-intersection` | O(1) |
| 点在多边形内 Point in Polygon | `point-in-polygon` | O(n) |
| Graham Scan 凸包 | `graham-scan` | O(n log n) |

---

## 技术架构 / Architecture

```
visual-algo/
├── packages/
│   ├── shared/          # 共享类型 Shared Types
│   ├── frontend/        # React SPA
│   │   └── src/
│   │       ├── engine/      # 可视化引擎 Visualization Engine
│   │       │   ├── bar-vis.tsx     # 柱状图 Bar Renderer
│   │       │   ├── tree-vis.tsx    # 树形图 Tree Renderer
│   │       │   ├── list-vis.tsx    # 链表图 List Renderer
│   │       │   ├── grid-vis.tsx    # 网格图 Grid Renderer
│   │       │   ├── point-vis.tsx   # 坐标点 Point Renderer
│   │       │   ├── code-panel.tsx  # 代码面板 Code Panel (Shiki)
│   │       │   └── player.tsx      # 统一播放器 Unified Player
│   │       ├── registry/      # 算法注册 Auto Registry
│   │       ├── algorithms/    # 算法数据库 Algorithm Database
│   │       │   ├── sorting/         # 排序
│   │       │   ├── data-structure/  # 数据结构
│   │       │   ├── fundamental/     # 基础算法
│   │       │   ├── graph/           # 图论
│   │       │   ├── dp/              # 动态规划
│   │       │   ├── math/            # 数学
│   │       │   ├── string/          # 字符串
│   │       │   ├── search/          # 搜索
│   │       │   └── geometry/        # 几何
│   │       ├── layout/        # 布局 Layout
│   │       └── pages/         # 路由 Routing
│   └── backend/          # C++ 编译服务（规划中 / Planned）
├── Dockerfile            # Docker 部署
├── server.js             # Express 生产服务
└── pnpm-workspace.yaml   # Monorepo 配置
```

### 核心数据流 / Core Data Flow

```
User Params → StepGenerator() → Scene[] → Player Hook
                             ↑
                    ┌────────┴────────┐
                    ↓                  ↓
              Visualizer         Code Panel
           (Canvas Render)   (Shiki Highlight)
```

Each algorithm requires only 4 files / 每个算法只需 4 个文件：

| 文件 File | 职责 Purpose |
|---|---|
| `meta.ts` | 元数据（名称/类别/复杂度/参数）Metadata |
| `generator.ts` | 步骤生成器 Step Generator（`function*` → `Scene[]`） |
| `python.py` | Python 实现 Python Implementation |
| `cpp.cpp` | C++ 实现 C++ Implementation |

---

## 快速开始 / Quick Start

```bash
# 安装依赖 / Install
pnpm install

# 开发模式 / Dev Server
pnpm dev              # → http://localhost:5173

# 构建 / Build
pnpm build            # → packages/frontend/dist/

# 生产预览 / Production Preview
pnpm start            # → http://localhost:3000
```

## Docker 部署 / Docker Deployment

```bash
docker build -t omnialgoviz .
docker run -p 3000:3000 omnialgoviz
```

## 在线演示 / Live Demo

**[omnialgoviz.up.railway.app](https://omnialgoviz.up.railway.app)**

---

## 添加新算法 / Adding a New Algorithm

1. Create directory / 创建目录：`packages/frontend/src/algorithms/{category}/{algo-name}/`
2. Write 4 files / 写入 4 个文件：
3. Auto-discovered by registry / 注册系统自动发现，无需配置路由

```typescript
// meta.ts
export default {
  id: 'my-algo',
  title: 'My Algorithm / 我的算法',
  category: 'sorting',
  visualizerType: 'bar',  // bar | tree | list | grid | point
  difficulty: 1,
  params: [{ key: 'size', label: 'Size', type: 'number', default: 10, min: 3, max: 30 }],
  complexity: { time: 'O(n)', space: 'O(1)' },
}
```

---

## 路线图 / Roadmap

- [x] 排序算法 / Sorting（9）
- [x] 数据结构 / Data Structures（12）
- [x] 基础算法 / Fundamentals（6）
- [x] 图论算法 / Graph Theory（16）
- [x] 动态规划 / Dynamic Programming（10）
- [x] 数学/数论 / Mathematics（10）
- [x] 字符串算法 / String（8）
- [x] 搜索算法 / Search（6）
- [x] 计算几何 / Geometry（5）
- [ ] C++ / Python 在线编译运行后端 / Online Compiler Backend

---

## 许可 / License

MIT
