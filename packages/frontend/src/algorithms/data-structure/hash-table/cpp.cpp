class HashTable {
private:
    vector<list<int>> table;
    int size;

    int hash(int key) { return key % size; }

public:
    HashTable(int sz = 7) : size(sz), table(sz) {}

    void insert(int key) {
        int bucket = hash(key);
        for (int v : table[bucket])
            if (v == key) return;
        table[bucket].push_back(key);
    }

    bool search(int key) {
        int bucket = hash(key);
        for (int v : table[bucket])
            if (v == key) return true;
        return false;
    }

    bool remove(int key) {
        int bucket = hash(key);
        auto& chain = table[bucket];
        for (auto it = chain.begin(); it != chain.end(); ++it)
            if (*it == key) { chain.erase(it); return true; }
        return false;
    }
};
