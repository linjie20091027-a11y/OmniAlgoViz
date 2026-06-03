class MinHeap {
private:
    vector<int> heap;

    void bubbleUp(int idx) {
        while (idx > 0) {
            int parent = (idx - 1) / 2;
            if (heap[parent] <= heap[idx]) break;
            swap(heap[parent], heap[idx]);
            idx = parent;
        }
    }

    void bubbleDown(int idx) {
        int n = heap.size();
        while (true) {
            int smallest = idx;
            int left = 2 * idx + 1;
            int right = 2 * idx + 2;
            if (left < n && heap[left] < heap[smallest]) smallest = left;
            if (right < n && heap[right] < heap[smallest]) smallest = right;
            if (smallest == idx) break;
            swap(heap[idx], heap[smallest]);
            idx = smallest;
        }
    }

public:
    void push(int val) {
        heap.push_back(val);
        bubbleUp(heap.size() - 1);
    }

    int pop() {
        if (heap.empty()) return -1;
        if (heap.size() == 1) {
            int root = heap[0];
            heap.pop_back();
            return root;
        }
        int root = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        bubbleDown(0);
        return root;
    }

    int peek() { return heap.empty() ? -1 : heap[0]; }
    int size() const { return heap.size(); }
    bool empty() const { return heap.empty(); }
};
