def cross(ax, ay, bx, by, cx, cy):
    """向量 AB × AC 的叉积"""
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)

def on_segment(ax, ay, bx, by, cx, cy):
    """点 C 是否在线段 AB 上"""
    return (min(ax, bx) <= cx <= max(ax, bx) and
            min(ay, by) <= cy <= max(ay, by))

def segments_intersect(a, b, c, d):
    """判断线段 AB 和 CD 是否相交"""
    d1 = cross(c[0], c[1], d[0], d[1], a[0], a[1])
    d2 = cross(c[0], c[1], d[0], d[1], b[0], b[1])
    d3 = cross(a[0], a[1], b[0], b[1], c[0], c[1])
    d4 = cross(a[0], a[1], b[0], b[1], d[0], d[1])

    # 跨立实验
    if (d1 > 0) != (d2 > 0) and (d3 > 0) != (d4 > 0):
        return True
    # 共线情况
    if d1 == 0 and on_segment(c[0], c[1], d[0], d[1], a[0], a[1]):
        return True
    if d2 == 0 and on_segment(c[0], c[1], d[0], d[1], b[0], b[1]):
        return True
    if d3 == 0 and on_segment(a[0], a[1], b[0], b[1], c[0], c[1]):
        return True
    if d4 == 0 and on_segment(a[0], a[1], b[0], b[1], d[0], d[1]):
        return True
    return False
