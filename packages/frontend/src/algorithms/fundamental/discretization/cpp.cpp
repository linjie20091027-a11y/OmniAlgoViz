vector<int> discretize(vector<int>& arr) {
    vector<int> uniq = arr;
    sort(uniq.begin(), uniq.end());
    uniq.erase(unique(uniq.begin(), uniq.end()), uniq.end());
    unordered_map<int, int> rank;
    for (int i = 0; i < uniq.size(); i++)
        rank[uniq[i]] = i;
    vector<int> res(arr.size());
    for (int i = 0; i < arr.size(); i++)
        res[i] = rank[arr[i]];
    return res;
}
