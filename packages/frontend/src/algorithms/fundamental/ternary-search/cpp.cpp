int ternarySearch(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (right - left > 2) {
        int mid1 = left + (right - left) / 3;
        int mid2 = right - (right - left) / 3;
        if (arr[mid1] < arr[mid2])
            left = mid1 + 1;
        else
            right = mid2 - 1;
    }
    int best = left;
    for (int i = left + 1; i <= right; i++)
        if (arr[i] > arr[best]) best = i;
    return best;
}
