// 组合数 / 杨辉三角 (Pascal's Triangle)
// 时间复杂度 O(n²)，空间复杂度 O(n²) 或 O(n)
// C(n,k) = C(n-1,k-1) + C(n-1,k)

#include <iostream>
#include <vector>
using namespace std;

vector<vector<long long>> pascalTriangle(int n) {
    // 生成杨辉三角前 n 行
    // triangle[i][j] = C(i, j) = 二项式系数
    vector<vector<long long>> triangle(1, {1});  // 第 0 行

    for (int i = 1; i < n; ++i) {
        vector<long long> row = {1};              // 每行开头是 1
        const auto& prev = triangle[i - 1];

        for (int j = 1; j < i; ++j) {
            // C(i, j) = C(i-1, j-1) + C(i-1, j)
            row.push_back(prev[j - 1] + prev[j]);
        }

        row.push_back(1);                          // 每行结尾是 1
        triangle.push_back(row);
    }
    return triangle;
}

long long combination(int n, int k) {
    // 计算单个组合数 C(n, k)，使用递推公式（空间 O(k)）
    if (k < 0 || k > n) return 0;

    vector<long long> row = {1};                  // 初始行
    for (int i = 1; i <= n; ++i) {
        vector<long long> newRow = {1};
        for (int j = 1; j < i; ++j) {
            newRow.push_back(row[j - 1] + row[j]);
        }
        newRow.push_back(1);
        row = newRow;
    }
    return row[k];
}

int main() {
    int n;
    cout << "请输入行数 n: ";
    cin >> n;

    auto triangle = pascalTriangle(n);
    cout << "杨辉三角（组合数表）：" << endl;
    for (int i = 0; i < n; ++i) {
        cout << "  第 " << i << " 行: ";
        for (long long val : triangle[i]) cout << val << " ";
        cout << endl;
    }

    cout << "\n示例：C(5,2) = " << combination(5, 2) << endl;
    return 0;
}
