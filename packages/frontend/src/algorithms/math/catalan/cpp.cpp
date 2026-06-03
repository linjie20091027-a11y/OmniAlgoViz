// 卡特兰数 (Catalan Numbers)
// 时间复杂度 O(n²)，空间复杂度 O(n)
// 应用：括号匹配、出栈序列、二叉树计数等

#include <iostream>
#include <vector>
using namespace std;

vector<long long> catalan(int n) {
    // 动态规划计算卡特兰数列 C[0..n]
    // 递推公式：C[0] = 1, C[n] = Σ C[i] × C[n-1-i]  (i = 0..n-1)
    vector<long long> C(n + 1, 0);
    C[0] = 1;  // 空序列只有一种方案

    for (int i = 1; i <= n; ++i) {
        long long total = 0;
        for (int j = 0; j < i; ++j) {
            total += C[j] * C[i - 1 - j];
        }
        C[i] = total;
    }
    return C;
}

int main() {
    int n;
    cout << "请输入 n: ";
    cin >> n;

    vector<long long> cats = catalan(n);
    for (int i = 0; i <= n; ++i) {
        cout << "C" << i << " = " << cats[i] << endl;
    }

    cout << "\n卡特兰数的应用示例：" << endl;
    cout << "  C" << n << " = 合法括号序列数（" << n << " 对括号）" << endl;
    cout << "  C" << n << " = " << n << " 个节点的不同二叉树数量" << endl;
    return 0;
}
