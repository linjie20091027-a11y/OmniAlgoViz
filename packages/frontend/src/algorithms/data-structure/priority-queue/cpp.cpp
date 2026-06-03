#include <queue>

class PriorityQueue {
private:
    priority_queue<int, vector<int>, greater<int>> pq; // 最小堆

public:
    void enqueue(int priority) { pq.push(priority); }

    int dequeue() {
        if (pq.empty()) return -1;
        int top = pq.top();
        pq.pop();
        return top;
    }

    int peek() { return pq.empty() ? -1 : pq.top(); }
    bool isEmpty() const { return pq.empty(); }
    int size() const { return pq.size(); }
};
