struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root = nullptr;

    TreeNode* insertNode(TreeNode* node, int val) {
        if (!node) return new TreeNode(val);
        if (val < node->val)
            node->left = insertNode(node->left, val);
        else if (val > node->val)
            node->right = insertNode(node->right, val);
        return node;
    }

    bool searchNode(TreeNode* node, int val) {
        if (!node) return false;
        if (val == node->val) return true;
        if (val < node->val) return searchNode(node->left, val);
        return searchNode(node->right, val);
    }

    void inorder(TreeNode* node, vector<int>& result) {
        if (!node) return;
        inorder(node->left, result);
        result.push_back(node->val);
        inorder(node->right, result);
    }

public:
    void insert(int val) { root = insertNode(root, val); }
    bool search(int val) { return searchNode(root, val); }
    vector<int> traverse() {
        vector<int> result;
        inorder(root, result);
        return result;
    }
};
