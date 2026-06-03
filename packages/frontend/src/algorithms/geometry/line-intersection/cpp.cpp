#include <algorithm>
using namespace std;

using Pt = pair<int, int>;

long long cross(Pt a, Pt b, Pt c) {
    return 1LL * (b.first - a.first) * (c.second - a.second) -
           1LL * (b.second - a.second) * (c.first - a.first);
}

bool onSegment(Pt a, Pt b, Pt c) {
    return min(a.first, b.first) <= c.first &&
           c.first <= max(a.first, b.first) &&
           min(a.second, b.second) <= c.second &&
           c.second <= max(a.second, b.second);
}

bool segmentsIntersect(Pt a, Pt b, Pt c, Pt d) {
    long long d1 = cross(c, d, a);
    long long d2 = cross(c, d, b);
    long long d3 = cross(a, b, c);
    long long d4 = cross(a, b, d);

    if ((d1 > 0) != (d2 > 0) && (d3 > 0) != (d4 > 0)) return true;

    if (d1 == 0 && onSegment(c, d, a)) return true;
    if (d2 == 0 && onSegment(c, d, b)) return true;
    if (d3 == 0 && onSegment(a, b, c)) return true;
    if (d4 == 0 && onSegment(a, b, d)) return true;

    return false;
}
