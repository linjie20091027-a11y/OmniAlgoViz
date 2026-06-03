class CircularQueue {
private:
    vector<int> data;
    int front, rear, sz, cap;

public:
    CircularQueue(int capacity) : data(capacity, 0), front(0), rear(0), sz(0), cap(capacity) {}

    bool enqueue(int val) {
        if (sz >= cap) return false;
        data[rear] = val;
        rear = (rear + 1) % cap;
        sz++;
        return true;
    }

    int dequeue() {
        if (sz == 0) return -1;
        int val = data[front];
        front = (front + 1) % cap;
        sz--;
        return val;
    }

    int peek() { return sz == 0 ? -1 : data[front]; }
    bool isEmpty() const { return sz == 0; }
    bool isFull() const { return sz == cap; }
    int size() const { return sz; }
};
