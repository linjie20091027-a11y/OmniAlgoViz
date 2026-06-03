#include <vector>
#include <algorithm>
using namespace std;

using Point = pair<int, int>;

long long cross(const Point& o, const Point& a, const Point& b) {
    return 1LL * (a.first - o.first) * (b.second - o.second) -
           1LL * (a.second - o.second) * (b.first - o.first);
}

vector<Point> andrewConvexHull(vector<Point> points) {
    sort(points.begin(), points.end());
    if (points.size() <= 1) return points;

    vector<Point> lower, upper;

    for (const auto& p : points) {
        while (lower.size() >= 2 &&
               cross(lower[lower.size() - 2], lower.back(), p) <= 0)
            lower.pop_back();
        lower.push_back(p);
    }

    for (int i = points.size() - 1; i >= 0; i--) {
        const auto& p = points[i];
        while (upper.size() >= 2 &&
               cross(upper[upper.size() - 2], upper.back(), p) <= 0)
            upper.pop_back();
        upper.push_back(p);
    }

    lower.pop_back();
    upper.pop_back();
    lower.insert(lower.end(), upper.begin(), upper.end());
    return lower;
}
