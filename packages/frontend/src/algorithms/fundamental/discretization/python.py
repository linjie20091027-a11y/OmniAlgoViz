def discretize(arr):
    uniq = sorted(set(arr))
    rank = {v: i for i, v in enumerate(uniq)}
    return [rank[v] for v in arr]
