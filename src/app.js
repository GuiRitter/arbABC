/*!
  Form / application "onsubmit" handler, and analytics.
*/

// import { sort } from 'jsonabc';

function jsonabc_isPlainObject(val) { return Object.prototype.toString.call(val) === '[object Object]'; }
function jsonabc_sortObj(un, noarray) {
    noarray = noarray || false;
    var or = {};
    if (isArray(un)) {
        if (noarray) { or = un; } else { or = un.sort(); }
        or.forEach(function (v, i) { or[i] = jsonabc_sortObj(v, noarray); });
        if (!noarray) {
            or = or.sort(function (a, b) {
                a = JSON.stringify(a); b = JSON.stringify(b);
                return a < b ? -1 : (a > b ? 1 : 0);
            });
        }
    } else if (jsonabc_isPlainObject(un)) {
        or = {};
        Object.keys(un).sort(function (a, b) {
            if (a.replace("@","").toLowerCase() < b.replace("@","").toLowerCase()) return -1;
            if (a.replace("@","").toLowerCase() > b.replace("@","").toLowerCase()) return 1;
            return 0;
        }).forEach(function (key) { or[key] = jsonabc_sortObj(un[key], noarray); });
    } else { or = un; }
    return or;
}
function jsonabc_cleanJSON(input) {
    input = input.replace(/,[ \t\r\n]+}/g, '}');
    input = input.replace(/,[ \t\r\n]+\]/g, ']');
    return input;
}
function jsonabc_sort(inputStr, noarray) {
    var output, obj, r; if (inputStr) {
        try {
            inputStr = jsonabc_cleanJSON(inputStr);
            obj = JSON.parse(inputStr); r = jsonabc_sortObj(obj, noarray);
            output = JSON.stringify(r, null, 4);
        }
        catch (ex) {
            console.error('jsonabc: Incorrect JSON object.', [], ex);
            throw ex;
        }
    }
    return output;
}

function appSort (ev, tid) {
  var inputStr = document.getElementById(tid).value;
  var noarray = document.getElementById('noarray').checked;

  ev.preventDefault();

  try {
    var output = jsonabc_sort(inputStr, noarray);

    document.getElementById(tid).value = output;

    console.warn('jsonabc input:', JSON.parse(inputStr), noarray);
  } catch (ex) {
    console.log(ex);
    window.alert('Incorrect JSON object');
  }
}
