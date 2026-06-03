class SegmentTree {
private:
    vector<int> tree;
    int n;

    void build(const vector<int>& arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, node * 2, l, mid);
        build(arr, node * 2 + 1, mid + 1, r);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }

public:
    SegmentTree(const vector<int>& arr) : n(arr.size()), tree(4 * arr.size(), 0) {
        build(arr, 1, 0, n - 1);
    }

    void update(int idx, int val, int node = 1, int l = 0, int r = -1) {
        if (r == -1) r = n - 1;
        if (l == r) { tree[node] = val; return; }
        int mid = (l + r) / 2;
        if (idx <= mid) update(idx, val, node * 2, l, mid);
        else update(idx, val, node * 2 + 1, mid + 1, r);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }

    int query(int ql, int qr, int node = 1, int l = 0, int r = -1) {
        if (r == -1) r = n - 1;
        if (ql <= l && r <= qr) return tree[node];
        if (qr < l || r < ql) return 0;
        int mid = (l + r) / 2;
        return query(ql, qr, node * 2, l, mid) +
               query(ql, qr, node * 2 + 1, mid + 1, r);
    }
};
