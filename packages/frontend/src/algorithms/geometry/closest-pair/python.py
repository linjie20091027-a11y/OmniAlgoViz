import math

def closest_pair(points):
    """分治法求最近点对，返回 (点1, 点2, 距离)"""
    pts = sorted(points, key=lambda p: p[0])  # 按 x 排序

    def dist(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1])

    def solve(l, r):
        if l >= r:
            return float('inf'), None, None
        if l + 1 == r:
            return dist(pts[l], pts[r]), pts[l], pts[r]

        mid = (l + r) // 2
        mid_x = pts[mid][0]

        d1, a1, b1 = solve(l, mid)
        d2, a2, b2 = solve(mid + 1, r)

        d, pa, pb = (d1, a1, b1) if d1 < d2 else (d2, a2, b2)

        # 带状区域
        strip = [p for p in pts[l:r + 1] if abs(p[0] - mid_x) < d]
        strip.sort(key=lambda p: p[1])

        for i in range(len(strip)):
            for j in range(i + 1, len(strip)):
                if strip[j][1] - strip[i][1] >= d:
                    break
                dij = dist(strip[i], strip[j])
                if dij < d:
                    d, pa, pb = dij, strip[i], strip[j]

        return d, pa, pb

    return solve(0, len(pts) - 1)
