// Nim 博弈 (Nim Game)
// 时间复杂度 O(n)，空间复杂度 O(n)
// 核心：计算所有堆的异或和，非零则先手必胜

#include <iostream>
#include <vector>
#include <tuple>
using namespace std;

pair<bool, vector<pair<int, int>>> nimWinner(const vector<int>& piles) {
    // 判断 Nim 博弈胜负并返回必胜走法
    // 返回: {先手是否必胜, 必胜走法列表 {堆索引, 取走数量}}
    int xorSum = 0;
    for (int p : piles) xorSum ^= p;  // 所有堆的异或和

    if (xorSum == 0) return {false, {}};  // 先手必败

    // 寻找必胜走法
    vector<pair<int, int>> moves;
    for (size_t i = 0; i < piles.size(); ++i) {
        int target = piles[i] ^ xorSum;    // 目标剩余石子数
        if (target < piles[i]) {           // 可以拿走
            moves.push_back({i, piles[i] - target});
        }
    }
    return {true, moves};
}

int main() {
    vector<int> piles = {3, 4, 5};
    auto [win, moves] = nimWinner(piles);

    int xorVal = 0;
    for (int p : piles) xorVal ^= p;

    cout << "石子堆: ";
    for (int p : piles) cout << p << " ";
    cout << endl;
    cout << "异或和 = " << xorVal << endl;

    if (win) {
        cout << "先手必胜！必胜走法：" << endl;
        for (auto [idx, take] : moves) {
            cout << "  第 " << idx + 1 << " 堆拿走 " << take
                 << " 颗，剩余 " << piles[idx] - take << " 颗" << endl;
        }
    } else {
        cout << "先手必败" << endl;
    }
    return 0;
}
