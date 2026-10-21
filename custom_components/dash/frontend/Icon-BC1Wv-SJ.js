//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.for("react.view_transition"), m = Symbol.iterator;
	function h(e) {
		return typeof e != "object" || !e ? null : (e = m && e[m] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var g = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, _ = Object.assign, v = {};
	function y(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, y.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function b() {}
	b.prototype = y.prototype;
	function x(e, t, n) {
		this.props = e, this.context = t, this.refs = v, this.updater = n || g;
	}
	var S = x.prototype = new b();
	S.constructor = x, _(S, y.prototype), S.isPureReactComponent = !0;
	var C = Array.isArray;
	function w() {}
	var T = {
		H: null,
		A: null,
		T: null,
		S: null
	}, E = Object.prototype.hasOwnProperty;
	function D(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function O(e, t) {
		return D(e.type, t, e.props);
	}
	function k(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function A(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var j = /\/+/g;
	function M(e, t) {
		return typeof e == "object" && e && e.key != null ? A("" + e.key) : t.toString(36);
	}
	function N(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(w, w) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function P(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, P(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + M(e, 0) : a, C(o) ? (i = "", c != null && (i = c.replace(j, "$&/") + "/"), P(o, r, i, "", function(e) {
			return e;
		})) : o != null && (k(o) && (o = O(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(j, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (C(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + M(a, u), c += P(a, r, i, s, o);
		else if (u = h(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + M(a, u++), c += P(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return P(N(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function F(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return P(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function I(e) {
		if (e._status === -1) {
			var t = e._result, n = t();
			n.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t, n.status === void 0 && (n.status = "fulfilled", n.value = t));
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t, n.status === void 0 && (n.status = "rejected", n.reason = t));
			}), e._status === -1 && (e._status = 0, e._result = n);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var L = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	};
	function R(e) {
		var t = T.T, n = {};
		n.types = t === null ? null : t.types, T.T = n;
		try {
			var r = e(), i = T.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(w, L);
		} catch (e) {
			L(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), T.T = t;
		}
	}
	function z(e) {
		var t = T.T;
		if (t !== null) {
			var n = t.types;
			n === null ? t.types = [e] : n.indexOf(e) === -1 && n.push(e);
		} else R(z.bind(null, e));
	}
	var B = {
		map: F,
		forEach: function(e, t, n) {
			F(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return F(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return F(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!k(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = B, e.Component = y, e.Fragment = r, e.Profiler = a, e.PureComponent = x, e.StrictMode = i, e.Suspense = l, e.ViewTransition = p, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = T, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return T.H.useMemoCache(e);
		}
	}, e.addTransitionType = z, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = _({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !E.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return D(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) E.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return D(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = k, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: I
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = R, e.unstable_useCacheRefresh = function() {
		return T.H.useCacheRefresh();
	}, e.use = function(e) {
		return T.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return T.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return T.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return T.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return T.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return T.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return T.H.useEffectEvent(e);
	}, e.useId = function() {
		return T.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return T.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return T.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return T.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return T.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return T.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return T.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return T.H.useRef(e);
	}, e.useState = function(e) {
		return T.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return T.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return T.H.useTransition();
	}, e.version = "19.3.1";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal"), o = Symbol.for("react.recoverable"), s = Symbol.for("react.optimistic_key");
	function c(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : r === s ? s : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function d(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.browser = function(e) {
		return {
			$$typeof: o,
			_reason: e
		};
	}, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return c(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = l.T, n = i.p;
		try {
			if (l.T = null, i.p = 2, e) return e();
		} finally {
			l.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = d(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0,
						fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = d(n, t.crossOrigin);
			i.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = d(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0,
					fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return l.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return l.H.useHostTransitionStatus();
	}, e.version = "19.3.1";
})), f = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == "function") try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = d();
}));
//#endregion
//#region src/lib/format.ts
function p(e) {
	return (e.split(".")[1] ?? e).split("_").filter(Boolean).map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
}
function m(e, t = "", n = "Choose an entity") {
	let r = e?.attributes.friendly_name;
	return typeof r == "string" && r.trim() ? r : t ? p(t) : n;
}
function h(e) {
	return e.split(".")[0] ?? "";
}
function g(e) {
	return e.trim() !== "" && Number.isFinite(Number(e));
}
function _(e) {
	return e.replace(/_/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
function v(e) {
	if (!e) return { primary: "Not connected" };
	let t = h(e.entity_id), n = e.state, r = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
	if (n === "unavailable") return { primary: "Unavailable" };
	if (n === "unknown") return { primary: "Unknown" };
	switch (t) {
		case "light": {
			let t = e.attributes.brightness;
			return n === "on" && typeof t == "number" ? {
				primary: "On",
				secondary: `${Math.round(t / 255 * 100)}% brightness`
			} : { primary: _(n) };
		}
		case "lock": return { primary: n === "locked" ? "Locked" : _(n) };
		case "cover": return { primary: _(n) };
		case "scene": return {
			primary: "Ready",
			secondary: "Tap to activate"
		};
		case "script": return {
			primary: "Run",
			secondary: "Tap to activate"
		};
		case "media_player": {
			let t = e.attributes.media_title;
			return {
				primary: _(n),
				secondary: typeof t == "string" ? t : void 0
			};
		}
		case "climate": {
			let t = e.attributes.current_temperature;
			return {
				primary: _(n),
				secondary: typeof t == "number" ? `${t}° now` : void 0
			};
		}
		case "weather": {
			let t = e.attributes.temperature;
			return {
				primary: _(n),
				secondary: typeof t == "number" ? `${t}°` : void 0
			};
		}
		case "binary_sensor": return { primary: n === "on" ? "Detected" : "Clear" };
		default: return g(n) ? { primary: `${n}${r ? ` ${r}` : ""}` } : { primary: _(n) };
	}
}
function y(e) {
	if (!e) return { value: "—" };
	let t = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
	if (!g(e.state)) return {
		value: _(e.state),
		unit: t
	};
	let n = Number(e.state), r = typeof e.attributes.min == "number" ? e.attributes.min : void 0, i = typeof e.attributes.max == "number" ? e.attributes.max : void 0, a = r !== void 0 && i !== void 0 && i > r ? Math.min(1, Math.max(0, (n - r) / (i - r))) : void 0;
	return {
		value: e.state,
		unit: t,
		ratio: a
	};
}
//#endregion
//#region src/lib/id.ts
function b(e = "card") {
	return `${e}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`}`;
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var x = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), S = /* @__PURE__ */ o(((e, t) => {
	t.exports = x();
})), C = S(), w = {
	bolt: /* @__PURE__ */ (0, C.jsx)("path", { d: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z" }),
	bulb: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M9 18h6" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M10 22h4" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z" })
	] }),
	thermometer: /* @__PURE__ */ (0, C.jsx)("path", { d: "M14 14.76V4a2 2 0 1 0-4 0v10.76a4 4 0 1 0 4 0Z" }),
	droplet: /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 2.7 6.3 8.4a8 8 0 1 0 11.4 0L12 2.7Z" }),
	activity: /* @__PURE__ */ (0, C.jsx)("path", { d: "M22 12h-4l-3 8L9 4l-3 8H2" }),
	play: /* @__PURE__ */ (0, C.jsx)("path", { d: "m8 5 11 7-11 7V5Z" }),
	lock: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("rect", {
		x: "4",
		y: "11",
		width: "16",
		height: "10",
		rx: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M8 11V7a4 4 0 0 1 8 0v4" })] }),
	unlock: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("rect", {
		x: "4",
		y: "11",
		width: "16",
		height: "10",
		rx: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M8 11V7a4 4 0 0 1 7.5-2" })] }),
	blinds: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M4 4h16M4 9h16M4 14h16M4 19h16" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 4v15" })] }),
	film: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("rect", {
		x: "3",
		y: "4",
		width: "18",
		height: "16",
		rx: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4" })] }),
	wand: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "m15 4 5 5L8 21H3v-5L15 4Z" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "m13 6 5 5" })] }),
	cloud: /* @__PURE__ */ (0, C.jsx)("path", { d: "M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.6A4 4 0 0 0 7 19h10.5Z" }),
	motion: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("circle", {
		cx: "12",
		cy: "4",
		r: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "m5 22 4-7 3 3v6M15 22v-5l-4-4M9 10l3-2 4 3 3 1" })] }),
	power: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 2v10" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M18.4 6.6a9 9 0 1 1-12.8 0" })] }),
	plus: /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 5v14M5 12h14" }),
	sliders: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M4 6h16M4 12h16M4 18h16" }),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "8",
			cy: "6",
			r: "2",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "16",
			cy: "12",
			r: "2",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "10",
			cy: "18",
			r: "2",
			fill: "currentColor"
		})
	] }),
	sun: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "4"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })] }),
	moon: /* @__PURE__ */ (0, C.jsx)("path", { d: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" }),
	monitor: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("rect", {
		x: "3",
		y: "4",
		width: "18",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M8 20h8M12 16v4" })] }),
	x: /* @__PURE__ */ (0, C.jsx)("path", { d: "M18 6 6 18M6 6l12 12" }),
	trash: /* @__PURE__ */ (0, C.jsx)(C.Fragment, { children: /* @__PURE__ */ (0, C.jsx)("path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" }) }),
	edit: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 20h9" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" })] }),
	grip: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "9",
			cy: "6",
			r: "1",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "15",
			cy: "6",
			r: "1",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "9",
			cy: "12",
			r: "1",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "15",
			cy: "12",
			r: "1",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "9",
			cy: "18",
			r: "1",
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "15",
			cy: "18",
			r: "1",
			fill: "currentColor"
		})
	] }),
	"arrow-up": /* @__PURE__ */ (0, C.jsx)("path", { d: "m18 15-6-6-6 6" }),
	"arrow-down": /* @__PURE__ */ (0, C.jsx)("path", { d: "m6 9 6 6 6-6" }),
	plug: /* @__PURE__ */ (0, C.jsx)(C.Fragment, { children: /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 22v-5M9 8V2M15 8V2M6 8h12v3a6 6 0 0 1-12 0V8Z" }) }),
	home: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M9 22V12h6v10" })] }),
	check: /* @__PURE__ */ (0, C.jsx)("path", { d: "m20 6-11 11-5-5" }),
	alert: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "9"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 8v4M12 16h.01" })] }),
	note: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M14 2v6h6M8 13h8M8 17h5" })] }),
	grid: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("rect", {
			x: "3",
			y: "3",
			width: "7",
			height: "7",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, C.jsx)("rect", {
			x: "14",
			y: "3",
			width: "7",
			height: "7",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, C.jsx)("rect", {
			x: "3",
			y: "14",
			width: "7",
			height: "7",
			rx: "1.5"
		}),
		/* @__PURE__ */ (0, C.jsx)("rect", {
			x: "14",
			y: "14",
			width: "7",
			height: "7",
			rx: "1.5"
		})
	] }),
	clock: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "9"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M12 7v5l3 2" })] }),
	copy: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("rect", {
		x: "9",
		y: "9",
		width: "12",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ (0, C.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })] }),
	download: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 3v12M7 10l5 5 5-5" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M5 21h14" })] }),
	upload: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 16V4M7 9l5-5 5 5" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M5 21h14" })] }),
	refresh: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M3 12a9 9 0 0 1 15.5-6.2L21 8" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M21 3v5h-5" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M21 12a9 9 0 0 1-15.5 6.2L3 16" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M3 21v-5h5" })
	] }),
	eye: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ (0, C.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	})] }),
	gauge: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M20.5 15.5a9 9 0 1 0-17 0" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "m12 12 4-4" }),
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "1.5",
			fill: "currentColor"
		})
	] }),
	undo: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "M9 14 4 9l5-5" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M4 9h10a6 6 0 0 1 0 12h-3" })] }),
	redo: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("path", { d: "m15 14 5-5-5-5" }), /* @__PURE__ */ (0, C.jsx)("path", { d: "M20 9H10a6 6 0 0 0 0 12h3" })] }),
	help: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "9"
		}),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-.6.6-1.5 1-1.5 2" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M12 17h.01" })
	] }),
	"eye-off": /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M3 3l18 18" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M10.6 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4" }),
		/* @__PURE__ */ (0, C.jsx)("path", { d: "M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.4-.9" })
	] })
};
function T({ name: e, size: t = 20, ...n }) {
	return /* @__PURE__ */ (0, C.jsx)("svg", {
		width: t,
		height: t,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.8,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		focusable: "false",
		...n,
		children: w[e]
	});
}
//#endregion
export { h as a, y as c, o as d, c as f, v as i, f as l, S as n, m as o, b as r, p as s, T as t, u };
