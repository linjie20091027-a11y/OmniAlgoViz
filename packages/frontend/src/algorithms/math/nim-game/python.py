# Nim 博弈 (Nim Game)
# 时间复杂度 O(n)，空间复杂度 O(n)
# 核心：计算所有堆的异或和，非零则先手必胜

from functools import reduce
from operator import xor


def nim_winner(piles: list[int]) -> tuple[bool, list[tuple[int, int]]]:
    """
    判断 Nim 博弈胜负并返回必胜走法
    返回: (先手是否必胜, 必胜走法列表)
    """
    xor_sum = reduce(xor, piles)      # 所有堆的异或和

    if xor_sum == 0:
        return False, []              # 先手必败

    # 寻找必胜走法：找到一堆，使得拿走石子后异或和为 0
    winning_moves = []
    for i, count in enumerate(piles):
        target = count ^ xor_sum      # 目标剩余石子数
        if target < count:            # 可以拿走
            winning_moves.append((i, count - target))

    return True, winning_moves


if __name__ == '__main__':
    piles = [3, 4, 5]
    win, moves = nim_winner(piles)
    print(f"石子堆: {piles}")
    xor_val = reduce(xor, piles)
    print(f"异或和 = {xor_val}")

    if win:
        print("先手必胜！必胜走法：")
        for idx, take in moves:
            print(f"  第 {idx+1} 堆拿走 {take} 颗，剩余 {piles[idx]-take} 颗")
    else:
        print("先手必败")
