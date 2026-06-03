def dlx_solve(matrix):
    """精确覆盖问题的贪心求解 (DLX 简化版)"""
    rows = len(matrix)
    cols = len(matrix[0])
    uncovered = set(range(cols))
    solution = []

    while uncovered:
        best_row = -1
        max_cover = -1
        for r in range(rows):
            if r in solution:
                continue
            cover = sum(1 for c in uncovered if matrix[r][c] == 1)
            if cover > max_cover:
                max_cover = cover
                best_row = r

        if best_row == -1:
            break

        solution.append(best_row)
        for c in range(cols):
            if matrix[best_row][c] == 1:
                uncovered.discard(c)

    return solution if not uncovered else None
