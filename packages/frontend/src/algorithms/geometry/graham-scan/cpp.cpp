#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

using Pt = pair<int, int>;

long long cross(const Pt& o, const Pt& a, const Pt& b) {
    return 1LL * (a.first - o.first) * (b.second - o.second) -
           1LL * (a.second - o.second) * (b.first - o.first);
}

vector<Pt> grahamScan(vector<Pt> points) {
    if (points.size() <= 2) return points;

    // 找最低最左点
    Pt pivot = *min_element(points.begin(), points.end(),
        [](const Pt& a, const Pt& b) {
            return a.second < b.second ||
                   (a.second == b.second && a.first < b.first);
        });

    // 按极角排序
    sort(points.begin(), points.end(),
        [&](const Pt& a, const Pt& b) {
            long long c = cross(pivot, a, b);
            if (c != 0) return c > 0;
            return hypot(a.first - pivot.first, a.second - pivot.second) <
                   hypot(b.first - pivot.first, b.second - pivot.second);
        });

    vector<Pt> stack = {pivot, points[0], points[1]};

    for (size_t i = 2; i < points.size(); i++) {
        while (stack.size() >= 2 &&
               cross(stack[stack.size() - 2], stack.back(), points[i]) <= 0)
            stack.pop_back();
        stack.push_back(points[i]);
    }

    return stack;
}
