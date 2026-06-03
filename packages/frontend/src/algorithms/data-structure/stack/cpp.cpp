class Stack {
private:
    vector<int> data;
    int top;

public:
    Stack(int capacity) : data(capacity, 0), top(0) {}

    bool push(int val) {
        if (top >= data.size()) return false;
        data[top++] = val;
        return true;
    }

    int pop() {
        if (top == 0) return -1;
        return data[--top];
    }

    int peek() {
        if (top == 0) return -1;
        return data[top - 1];
    }

    bool isEmpty() const { return top == 0; }
    int size() const { return top; }
};
