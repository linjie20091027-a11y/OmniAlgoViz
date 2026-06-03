class FenwickTree {
private:
    vector<int> tree;
    int n;

    int lowbit(int x) { return x & -x; }

public:
    FenwickTree(int sz) : n(sz), tree(sz + 1, 0) {}

    void build(const vector<int>& arr) {
        for (int i = 0; i < arr.size(); i++) {
            int idx = i + 1;
            while (idx <= n) {
                tree[idx] += arr[i];
                idx += idx & -idx;
            }
        }
    }

    void add(int idx, int delta) {
        while (idx <= n) {
            tree[idx] += delta;
            idx += idx & -idx;
        }
    }

    int prefixSum(int idx) {
        int sum = 0;
        while (idx > 0) {
            sum += tree[idx];
            idx -= idx & -idx;
        }
        return sum;
    }

    int rangeSum(int l, int r) {
        return prefixSum(r) - prefixSum(l - 1);
    }
};
