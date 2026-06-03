import math

def graham_scan(points):
    """Graham Scan 算法求凸包"""
    pts = list(points)
    if len(pts) <= 2:
        return pts

    # 找最低最左点 (pivot)
    pivot = min(pts, key=lambda p: (p[1], p[0]))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    # 按极角排序
    others = [p for p in pts if p != pivot]
    others.sort(key=lambda p: (
        -cross(pivot, p, (pivot[0] + 1, pivot[1]) + (100, 0)),
        # 不在同极角的点按距离排序
        math.hypot(p[0] - pivot[0], p[1] - pivot[1])
    ))

    stack = [pivot, others[0], others[1]]

    for p in others[2:]:
        while len(stack) >= 2 and cross(stack[-2], stack[-1], p) <= 0:
            stack.pop()
        stack.append(p)

    return stack
