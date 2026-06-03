#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

using Point = pair<double, double>;
using Tuple = tuple<double, Point, Point>;

double dist(const Point& a, const Point& b) {
    return hypot(a.first - b.first, a.second - b.second);
}

Tuple solve(vector<Point>& pts, int l, int r) {
    if (l >= r) return {INFINITY, {}, {}};
    if (l + 1 == r) return {dist(pts[l], pts[r]), pts[l], pts[r]};

    int mid = (l + r) / 2;
    double midX = pts[mid].first;

    auto [d1, a1, b1] = solve(pts, l, mid);
    auto [d2, a2, b2] = solve(pts, mid + 1, r);

    double d = d1;
    Point pa = a1, pb = b1;
    if (d2 < d) { d = d2; pa = a2; pb = b2; }

    // 带状区域
    vector<Point> strip;
    for (int i = l; i <= r; i++)
        if (fabs(pts[i].first - midX) < d)
            strip.push_back(pts[i]);

    sort(strip.begin(), strip.end(),
         [](const Point& a, const Point& b) { return a.second < b.second; });

    for (size_t i = 0; i < strip.size(); i++)
        for (size_t j = i + 1; j < strip.size() &&
             strip[j].second - strip[i].second < d; j++) {
            double dij = dist(strip[i], strip[j]);
            if (dij < d) { d = dij; pa = strip[i]; pb = strip[j]; }
        }

    return {d, pa, pb};
}

tuple<double, Point, Point> closestPair(vector<Point> points) {
    sort(points.begin(), points.end());
    return solve(points, 0, points.size() - 1);
}
