#include <vector>
#include <unordered_set>
using namespace std;

vector<int> dlxSolve(const vector<vector<int>>& matrix) {
    int rows = matrix.size(), cols = matrix[0].size();
    unordered_set<int> uncovered;
    for (int c = 0; c < cols; c++) uncovered.insert(c);

    vector<int> solution;

    while (!uncovered.empty()) {
        int bestRow = -1, maxCover = -1;
        for (int r = 0; r < rows; r++) {
            if (find(solution.begin(), solution.end(), r) != solution.end())
                continue;
            int cover = 0;
            for (int c : uncovered)
                if (matrix[r][c] == 1) cover++;
            if (cover > maxCover) { maxCover = cover; bestRow = r; }
        }

        if (bestRow == -1) break;

        solution.push_back(bestRow);
        for (int c = 0; c < cols; c++)
            if (matrix[bestRow][c] == 1) uncovered.erase(c);
    }

    return uncovered.empty() ? solution : vector<int>{};
}
