struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

class LinkedList {
private:
    ListNode* head = nullptr;

public:
    void insert(int val, int pos) {
        ListNode* node = new ListNode(val);
        if (pos == 0) {
            node->next = head;
            head = node;
            return;
        }
        ListNode* curr = head;
        for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
        if (curr) { node->next = curr->next; curr->next = node; }
    }

    void remove(int pos) {
        if (!head) return;
        if (pos == 0) { ListNode* t = head; head = head->next; delete t; return; }
        ListNode* curr = head;
        for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
        if (curr && curr->next) {
            ListNode* t = curr->next;
            curr->next = curr->next->next;
            delete t;
        }
    }

    int search(int val) {
        ListNode* curr = head;
        int idx = 0;
        while (curr) {
            if (curr->val == val) return idx;
            curr = curr->next;
            idx++;
        }
        return -1;
    }
};
