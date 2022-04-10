! function(a) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.mexp = a()
  }
}(function() {
  return function a(b, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!b[g]) {
          var i = "function" == typeof require && require;
          if (!h && i) return i(g, !0);
          if (f) return f(g, !0);
          var j = new Error("Cannot find module '" + g + "'");
          throw j.code = "MODULE_NOT_FOUND", j
        }
        var k = c[g] = {
          exports: {}
        };
        b[g][0].call(k.exports, function(a) {
          var c = b[g][1][a];
          return e(c || a)
        }, k, k.exports, a, b, c, d)
      }
      return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
  }({
    1: [function(a, b, c) {
      var d = a("./postfix_evaluator.js");
      d.prototype.formulaEval = function() {
        "use strict";
        for (var a, b, c, d = [], e = this.value, f = 0; f < e.length; f++) 1 === e[f].type || 3 === e[f].type ? d.push({
          value: 3 === e[f].type ? e[f].show : e[f].value,
          type: 1
        }) : 13 === e[f].type ? d.push({
          value: e[f].show,
          type: 1
        }) : 0 === e[f].type ? d[d.length - 1] = {
          value: e[f].show + ("-" != e[f].show ? "(" : "") + d[d.length - 1].value + ("-" != e[f].show ? ")" : ""),
          type: 0
        } : 7 === e[f].type ? d[d.length - 1] = {
          value: (1 != d[d.length - 1].type ? "(" : "") + d[d.length - 1].value + (1 != d[d.length - 1].type ? ")" : "") + e[f].show,
          type: 7
        } : 10 === e[f].type ? (a = d.pop(), b = d.pop(), "P" === e[f].show || "C" === e[f].show ? d.push({
          value: "<sup>" + b.value + "</sup>" + e[f].show + "<sub>" + a.value + "</sub>",
          type: 10
        }) : d.push({
          value: (1 != b.type ? "(" : "") + b.value + (1 != b.type ? ")" : "") + "<sup>" + a.value + "</sup>",
          type: 1
        })) : 2 === e[f].type || 9 === e[f].type ? (a = d.pop(), b = d.pop(), d.push({
          value: (1 != b.type ? "(" : "") + b.value + (1 != b.type ? ")" : "") + e[f].show + (1 != a.type ? "(" : "") + a.value + (1 != a.type ? ")" : ""),
          type: e[f].type
        })) : 12 === e[f].type && (a = d.pop(), b = d.pop(), c = d.pop(), d.push({
          value: e[f].show + "(" + c.value + "," + b.value + "," + a.value + ")",
          type: 12
        }));
        return d[0].value
      }, b.exports = d
    }, {
      "./postfix_evaluator.js": 5
    }],
    2: [function(a, b, c) {
      "use strict";

      function d(a, b) {
        for (var c = 0; c < a.length; c++) a[c] += b;
        return a
      }

      function e(a, b, c, d) {
        for (var e = 0; e < d; e++)
          if (a[c + e] !== b[e]) return !1;
        return !0
      }

      function f(a) {
        for (var b, c, d, f = [], m = a.length, n = 0; n < m; n++)
          if (!(n < m - 1 && " " === a[n] && " " === a[n + 1])) {
            for (b = "", c = a.length - n > s.length - 2 ? s.length - 1 : a.length - n; c > 0; c--)
              if (void 0 !== s[c])
                for (d = 0; d < s[c].length; d++) e(a, s[c][d], n, c) && (b = s[c][d], d = s[c].length, c = 0);
            if (n += b.length - 1, "" === b) throw new g.Exception("Can't understand after " + a.slice(n));
            var o = h.indexOf(b);
            f.push({
              index: o,
              token: b,
              type: l[o],
              eval: j[o],
              precedence: k[l[o]],
              show: i[o]
            })
          } return f
      }
      var g = a("./math_function.js"),
        h = ["sin", "cos", "tan", "pi", "(", ")", "P", "C", " ", "asin", "acos", "atan", "7", "8", "9", "int", "cosh", "acosh", "ln", "^", "root", "4", "5", "6", "/", "!", "tanh", "atanh", "Mod", "1", "2", "3", "*", "sinh", "asinh", "e", "log", "0", ".", "+", "-", ",", "Sigma", "n", "Pi", "pow"],
        i = ["sin", "cos", "tan", "&pi;", "(", ")", "P", "C", " ", "asin", "acos", "atan", "7", "8", "9", "Int", "cosh", "acosh", " ln", "^", "root", "4", "5", "6", "&divide;", "!", "tanh", "atanh", " Mod ", "1", "2", "3", "&times;", "sinh", "asinh", "e", " log", "0", ".", "+", "-", ",", "&Sigma;", "n", "&Pi;", "pow"],
        j = [g.math.sin, g.math.cos, g.math.tan, "PI", "(", ")", g.math.P, g.math.C, " ".anchor, g.math.asin, g.math.acos, g.math.atan, "7", "8", "9", Math.floor, g.math.cosh, g.math.acosh, Math.log, Math.pow, Math.sqrt, "4", "5", "6", g.math.div, g.math.fact, g.math.tanh, g.math.atanh, g.math.mod, "1", "2", "3", g.math.mul, g.math.sinh, g.math.asinh, "E", g.math.log, "0", ".", g.math.add, g.math.sub, ",", g.math.sigma, "n", g.math.Pi, Math.pow],
        k = {
          0: 11,
          1: 0,
          2: 3,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 11,
          8: 11,
          9: 1,
          10: 10,
          11: 0,
          12: 11,
          13: 0,
          14: -1
        },
        l = [0, 0, 0, 3, 4, 5, 10, 10, 14, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 10, 0, 1, 1, 1, 2, 7, 0, 0, 2, 1, 1, 1, 2, 0, 0, 3, 0, 1, 6, 9, 9, 11, 12, 13, 12, 8],
        m = {
          0: !0,
          1: !0,
          3: !0,
          4: !0,
          6: !0,
          8: !0,
          9: !0,
          12: !0,
          13: !0,
          14: !0
        },
        n = {
          0: !0,
          1: !0,
          2: !0,
          3: !0,
          4: !0,
          5: !0,
          6: !0,
          7: !0,
          8: !0,
          9: !0,
          10: !0,
          11: !0,
          12: !0,
          13: !0
        },
        o = {
          0: !0,
          3: !0,
          4: !0,
          8: !0,
          12: !0,
          13: !0
        },
        p = {},
        q = {
          0: !0,
          1: !0,
          3: !0,
          4: !0,
          6: !0,
          8: !0,
          12: !0,
          13: !0
        },
        r = {
          1: !0
        },
        s = [
          [],
          ["1", "2", "3", "7", "8", "9", "4", "5", "6", "+", "-", "*", "/", "(", ")", "^", "!", "P", "C", "e", "0", ".", ",", "n", " "],
          ["pi", "ln", "Pi"],
          ["sin", "cos", "tan", "Del", "int", "Mod", "log", "pow"],
          ["asin", "acos", "atan", "cosh", "root", "tanh", "sinh"],
          ["acosh", "atanh", "asinh", "Sigma"]
        ];
      g.addToken = function(a) {
        for (var b = 0; b < a.length; b++) {
          var c = a[b].token.length,
            d = -1;
          s[c] = s[c] || [];
          for (var e = 0; e < s[c].length; e++)
            if (a[b].token === s[c][e]) {
              d = h.indexOf(s[c][e]);
              break
            } - 1 === d ? (h.push(a[b].token), l.push(a[b].type), s.length <= a[b].token.length && (s[a[b].token.length] = []), s[a[b].token.length].push(a[b].token), j.push(a[b].value), i.push(a[b].show)) : (h[d] = a[b].token, l[d] = a[b].type, j[d] = a[b].value, i[d] = a[b].show)
        }
      }, g.lex = function(a, b) {
        var c, e = {
            value: g.math.changeSign,
            type: 0,
            pre: 21,
            show: "-"
          },
          h = {
            value: ")",
            show: ")",
            type: 5,
            pre: 0
          },
          i = {
            value: "(",
            type: 4,
            pre: 0,
            show: "("
          },
          j = [i],
          k = [],
          l = a,
          s = m,
          t = 0,
          u = p,
          v = "";
        void 0 !== b && g.addToken(b);
        var w = {},
          x = f(l);
        for (c = 0; c < x.length; c++) {
          var y = x[c];
          if (14 !== y.type) {
            var z, A = y.token,
              B = y.type,
              C = y.eval,
              D = y.precedence,
              E = y.show,
              F = j[j.length - 1];
            for (z = k.length; z-- && 0 === k[z];)
              if (-1 !== [0, 2, 3, 4, 5, 9, 11, 12, 13].indexOf(B)) {
                if (!0 !== s[B]) throw new g.Exception(A + " is not allowed after " + v);
                j.push(h), s = n, u = q, d(k, -1).pop()
              } if (!0 !== s[B]) throw new g.Exception(A + " is not allowed after " + v);
            if (!0 === u[B] && (B = 2, C = g.math.mul, E = "&times;", D = 3, c -= 1), w = {
                value: C,
                type: B,
                pre: D,
                show: E
              }, 0 === B) s = m, u = p, d(k, 2).push(2), j.push(w), j.push(i);
            else if (1 === B) 1 === F.type ? (F.value += C, d(k, 1)) : j.push(w), s = n, u = o;
            else if (2 === B) s = m, u = p, d(k, 2), j.push(w);
            else if (3 === B) j.push(w), s = n, u = q;
            else if (4 === B) d(k, 1), t++, s = m, u = p, j.push(w);
            else if (5 === B) {
              if (!t) throw new g.Exception("Closing parenthesis are more than opening one, wait What!!!");
              t--, s = n, u = q, j.push(w), d(k, 1)
            } else if (6 === B) {
              if (F.hasDec) throw new g.Exception("Two decimals are not allowed in one number");
              1 !== F.type && (F = {
                value: 0,
                type: 1,
                pre: 0
              }, j.push(F), d(k, -1)), s = r, d(k, 1), u = p, F.value += C, F.hasDec = !0
            } else 7 === B && (s = n, u = q, d(k, 1), j.push(w));
            8 === B ? (s = m, u = p, d(k, 4).push(4), j.push(w), j.push(i)) : 9 === B ? (9 === F.type ? F.value === g.math.add ? (F.value = C, F.show = E, d(k, 1)) : F.value === g.math.sub && "-" === E && (F.value = g.math.add, F.show = "+", d(k, 1)) : 5 !== F.type && 7 !== F.type && 1 !== F.type && 3 !== F.type && 13 !== F.type ? "-" === A && (s = m, u = p, d(k, 2).push(2), j.push(e), j.push(i)) : (j.push(w), d(k, 2)), s = m, u = p) : 10 === B ? (s = m, u = p, d(k, 2), j.push(w)) : 11 === B ? (s = m, u = p, j.push(w)) : 12 === B ? (s = m, u = p, d(k, 6).push(6), j.push(w), j.push(i)) : 13 === B && (s = n, u = q, j.push(w)), d(k, -1), v = A
          } else if (c > 0 && c < x.length - 1 && 1 === x[c + 1].type && (1 === x[c - 1].type || 6 === x[c - 1].type)) throw new g.Exception("Unexpected Space")
        }
        for (z = k.length; z-- && 0 === k[z];) j.push(h), d(k, -1).pop();
        if (!0 !== s[5]) throw new g.Exception("complete the expression");
        for (; t--;) j.push(h);
        return j.push(h), new g(j)
      }, b.exports = g
    }, {
      "./math_function.js": 3
    }],
    3: [function(a, b, c) {
      "use strict";
      var d = function(a) {
        this.value = a
      };
      d.math = {
        isDegree: !0,
        acos: function(a) {
          return d.math.isDegree ? 180 / Math.PI * Math.acos(a) : Math.acos(a)
        },
        add: function(a, b) {
          return a + b
        },
        asin: function(a) {
          return d.math.isDegree ? 180 / Math.PI * Math.asin(a) : Math.asin(a)
        },
        atan: function(a) {
          return d.math.isDegree ? 180 / Math.PI * Math.atan(a) : Math.atan(a)
        },
        acosh: function(a) {
          return Math.log(a + Math.sqrt(a * a - 1))
        },
        asinh: function(a) {
          return Math.log(a + Math.sqrt(a * a + 1))
        },
        atanh: function(a) {
          return Math.log((1 + a) / (1 - a))
        },
        C: function(a, b) {
          var c = 1,
            e = a - b,
            f = b;
          f < e && (f = e, e = b);
          for (var g = f + 1; g <= a; g++) c *= g;
          return c / d.math.fact(e)
        },
        changeSign: function(a) {
          return -a
        },
        cos: function(a) {
          return d.math.isDegree && (a = d.math.toRadian(a)), Math.cos(a)
        },
        cosh: function(a) {
          return (Math.pow(Math.E, a) + Math.pow(Math.E, -1 * a)) / 2
        },
        div: function(a, b) {
          return a / b
        },
        fact: function(a) {
          if (a % 1 != 0) return "NaN";
          for (var b = 1, c = 2; c <= a; c++) b *= c;
          return b
        },
        inverse: function(a) {
          return 1 / a
        },
        log: function(a) {
          return Math.log(a) / Math.log(10)
        },
        mod: function(a, b) {
          return a % b
        },
        mul: function(a, b) {
          return a * b
        },
        P: function(a, b) {
          for (var c = 1, d = Math.floor(a) - Math.floor(b) + 1; d <= Math.floor(a); d++) c *= d;
          return c
        },
        Pi: function(a, b, c) {
          for (var d = 1, e = a; e <= b; e++) d *= Number(c.postfixEval({
            n: e
          }));
          return d
        },
        pow10x: function(a) {
          for (var b = 1; a--;) b *= 10;
          return b
        },
        sigma: function(a, b, c) {
          for (var d = 0, e = a; e <= b; e++) d += Number(c.postfixEval({
            n: e
          }));
          return d
        },
        sin: function(a) {
          return d.math.isDegree && (a = d.math.toRadian(a)), Math.sin(a)
        },
        sinh: function(a) {
          return (Math.pow(Math.E, a) - Math.pow(Math.E, -1 * a)) / 2
        },
        sub: function(a, b) {
          return a - b
        },
        tan: function(a) {
          return d.math.isDegree && (a = d.math.toRadian(a)), Math.tan(a)
        },
        tanh: function(a) {
          return d.sinha(a) / d.cosha(a)
        },
        toRadian: function(a) {
          return a * Math.PI / 180
        }
      }, d.Exception = function(a) {
        this.message = a
      }, b.exports = d
    }, {}],
    4: [function(a, b, c) {
      var d = a("./lexer.js");
      d.prototype.toPostfix = function() {
        "use strict";
        for (var a, b, c, e, f, g = [], h = [{
            value: "(",
            type: 4,
            pre: 0
          }], i = this.value, j = 1; j < i.length; j++)
          if (1 === i[j].type || 3 === i[j].type || 13 === i[j].type) 1 === i[j].type && (i[j].value = Number(i[j].value)), g.push(i[j]);
          else if (4 === i[j].type) h.push(i[j]);
        else if (5 === i[j].type)
          for (; 4 !== (b = h.pop()).type;) g.push(b);
        else if (11 === i[j].type) {
          for (; 4 !== (b = h.pop()).type;) g.push(b);
          h.push(b)
        } else {
          a = i[j], e = a.pre, f = h[h.length - 1], c = f.pre;
          var k = "Math.pow" == f.value && "Math.pow" == a.value;
          if (e > c) h.push(a);
          else {
            for (; c >= e && !k || k && e < c;) b = h.pop(), f = h[h.length - 1], g.push(b), c = f.pre, k = "Math.pow" == a.value && "Math.pow" == f.value;
            h.push(a)
          }
        }
        return new d(g)
      }, b.exports = d
    }, {
      "./lexer.js": 2
    }],
    5: [function(a, b, c) {
      var d = a("./postfix.js");
      d.prototype.postfixEval = function(a) {
        "use strict";
        a = a || {}, a.PI = Math.PI, a.E = Math.E;
        for (var b, c, e, f = [], g = this.value, h = void 0 !== a.n, i = 0; i < g.length; i++) 1 === g[i].type ? f.push({
          value: g[i].value,
          type: 1
        }) : 3 === g[i].type ? f.push({
          value: a[g[i].value],
          type: 1
        }) : 0 === g[i].type ? void 0 === f[f.length - 1].type ? f[f.length - 1].value.push(g[i]) : f[f.length - 1].value = g[i].value(f[f.length - 1].value) : 7 === g[i].type ? void 0 === f[f.length - 1].type ? f[f.length - 1].value.push(g[i]) : f[f.length - 1].value = g[i].value(f[f.length - 1].value) : 8 === g[i].type ? (b = f.pop(), c = f.pop(), f.push({
          type: 1,
          value: g[i].value(c.value, b.value)
        })) : 10 === g[i].type ? (b = f.pop(), c = f.pop(), void 0 === c.type ? (c.value = c.concat(b), c.value.push(g[i]), f.push(c)) : void 0 === b.type ? (b.unshift(c), b.push(g[i]), f.push(b)) : f.push({
          type: 1,
          value: g[i].value(c.value, b.value)
        })) : 2 === g[i].type || 9 === g[i].type ? (b = f.pop(), c = f.pop(), void 0 === c.type ? (c = c.concat(b), c.push(g[i]), f.push(c)) : void 0 === b.type ? (b.unshift(c), b.push(g[i]), f.push(b)) : f.push({
          type: 1,
          value: g[i].value(c.value, b.value)
        })) : 12 === g[i].type ? (b = f.pop(), void 0 !== b.type && (b = [b]), c = f.pop(), e = f.pop(), f.push({
          type: 1,
          value: g[i].value(e.value, c.value, new d(b))
        })) : 13 === g[i].type && (h ? f.push({
          value: a[g[i].value],
          type: 3
        }) : f.push([g[i]]));
        if (f.length > 1) throw new d.Exception("Uncaught Syntax error");
        return f[0].value > 1e15 ? "Infinity" : parseFloat(f[0].value.toFixed(15))
      }, d.eval = function(a, b, c) {
        return void 0 === b ? this.lex(a).toPostfix().postfixEval() : void 0 === c ? void 0 !== b.length ? this.lex(a, b).toPostfix().postfixEval() : this.lex(a).toPostfix().postfixEval(b) : this.lex(a, b).toPostfix().postfixEval(c)
      }, b.exports = d
    }, {
      "./postfix.js": 4
    }]
  }, {}, [1])(1)
});