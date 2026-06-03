#include <string>
using namespace std;

string minimumNotation(const string& s) {
    int n = s.size();
    string t = s + s;
    int i = 0, j = 1, k = 0;

    while (i < n && j < n && k < n) {
        if (t[i + k] == t[j + k]) {
            k++;
        } else if (t[i + k] > t[j + k]) {
            i += k + 1;
            if (i <= j) i = j + 1;
            k = 0;
        } else {
            j += k + 1;
            if (j <= i) j = i + 1;
            k = 0;
        }
    }

    int start = min(i, j);
    return s.substr(start) + s.substr(0, start);
}
