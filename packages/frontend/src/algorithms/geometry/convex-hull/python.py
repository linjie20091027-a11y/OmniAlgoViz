def andrew_convex_hull(points):
    """Andrew 算法求凸包，返回凸包顶点列表 (逆时针)"""
    pts = sorted(points)  # 按 x 排序，x 相同按 y
    if len(pts) <= 1:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    # 下凸壳
    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    # 上凸壳
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    # 合并，去掉重复端点
    return lower[:-1] + upper[:-1]
