#include <string>
#include <vector>
#include <queue>
using namespace std;

struct ACNode {
    int next[26] = {};
    int fail = 0;
    vector<string> out;
};

struct ACAutomaton {
    vector<ACNode> trie;

    ACAutomaton(const vector<string>& patterns) {
        trie.resize(1);
        for (const string& p : patterns) insert(p);
        buildFail();
    }

    void insert(const string& s) {
        int cur = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (!trie[cur].next[c]) {
                trie[cur].next[c] = trie.size();
                trie.emplace_back();
            }
            cur = trie[cur].next[c];
        }
        trie[cur].out.push_back(s);
    }

    void buildFail() {
        queue<int> q;
        for (int c = 0; c < 26; c++) {
            int v = trie[0].next[c];
            if (v) { trie[v].fail = 0; q.push(v); }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int c = 0; c < 26; c++) {
                int v = trie[u].next[c];
                if (!v) { trie[u].next[c] = trie[trie[u].fail].next[c]; continue; }
                trie[v].fail = trie[trie[u].fail].next[c];
                for (const auto& w : trie[trie[v].fail].out)
                    trie[v].out.push_back(w);
                q.push(v);
            }
        }
    }

    vector<pair<int, string>> search(const string& text) {
        int cur = 0;
        vector<pair<int, string>> result;
        for (int i = 0; i < (int)text.size(); i++) {
            cur = trie[cur].next[text[i] - 'a'];
            for (const auto& w : trie[cur].out)
                result.emplace_back(i - (int)w.size() + 1, w);
        }
        return result;
    }
};
