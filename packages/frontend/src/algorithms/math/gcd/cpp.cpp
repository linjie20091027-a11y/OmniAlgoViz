// 欧几里得算法（辗转相除法）
// 时间复杂度 O(log min(a,b))，空间复杂度 O(1)

#include <iostream>
using namespace std;

int gcd(int a, int b) {
    // 迭代版：辗转相除求最大公约数
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int gcdRecursive(int a, int b) {
    // 递归版欧几里得算法
    if (b == 0) return a;
    return gcdRecursive(b, a % b);
}

int main() {
    int a, b;
    cout << "请输入整数 a: ";
    cin >> a;
    cout << "请输入整数 b: ";
    cin >> b;

    cout << "gcd(" << a << ", " << b << ") = " << gcd(a, b) << endl;
    return 0;
}
