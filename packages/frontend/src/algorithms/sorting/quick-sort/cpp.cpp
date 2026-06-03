void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (arr[j] <= pivot)
            swap(arr[++i], arr[j]);
    swap(arr[++i], arr[hi]);
    quickSort(arr, lo, i - 1);
    quickSort(arr, i + 1, hi);
}
