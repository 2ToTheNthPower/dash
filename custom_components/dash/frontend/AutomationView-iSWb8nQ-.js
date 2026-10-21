import { d as e, f as t, l as n, n as r, o as i, r as a, s as o, t as s, u as c } from "./Icon-BC1Wv-SJ.js";
//#region node_modules/yaml/browser/dist/nodes/identity.js
var l = /* @__PURE__ */ t(c(), 1), u = Symbol.for("yaml.alias"), d = Symbol.for("yaml.document"), f = Symbol.for("yaml.map"), p = Symbol.for("yaml.pair"), m = Symbol.for("yaml.scalar"), h = Symbol.for("yaml.seq"), g = Symbol.for("yaml.node.type"), _ = (e) => !!e && typeof e == "object" && e[g] === u, v = (e) => !!e && typeof e == "object" && e[g] === d, y = (e) => !!e && typeof e == "object" && e[g] === f, b = (e) => !!e && typeof e == "object" && e[g] === p, x = (e) => !!e && typeof e == "object" && e[g] === m, S = (e) => !!e && typeof e == "object" && e[g] === h;
function C(e) {
	if (e && typeof e == "object") switch (e[g]) {
		case f:
		case h: return !0;
	}
	return !1;
}
function w(e) {
	if (e && typeof e == "object") switch (e[g]) {
		case u:
		case f:
		case m:
		case h: return !0;
	}
	return !1;
}
var T = (e) => (x(e) || C(e)) && !!e.anchor, E = Symbol("break visit"), D = Symbol("skip children"), O = Symbol("remove node");
function k(e, t) {
	let n = j(t);
	v(e) ? A(null, e.contents, n, Object.freeze([e])) === O && (e.contents = null) : A(null, e, n, Object.freeze([]));
}
k.BREAK = E, k.SKIP = D, k.REMOVE = O;
function A(e, t, n, r) {
	let i = M(e, t, n, r);
	if (w(i) || b(i)) return N(e, r, i), A(e, i, n, r);
	if (typeof i != "symbol") {
		if (C(t)) {
			r = Object.freeze(r.concat(t));
			for (let e = 0; e < t.items.length; ++e) {
				let i = A(e, t.items[e], n, r);
				if (typeof i == "number") e = i - 1;
				else if (i === E) return E;
				else i === O && (t.items.splice(e, 1), --e);
			}
		} else if (b(t)) {
			r = Object.freeze(r.concat(t));
			let e = A("key", t.key, n, r);
			if (e === E) return E;
			e === O && (t.key = null);
			let i = A("value", t.value, n, r);
			if (i === E) return E;
			i === O && (t.value = null);
		}
	}
	return i;
}
function j(e) {
	return typeof e == "object" && (e.Collection || e.Node || e.Value) ? Object.assign({
		Alias: e.Node,
		Map: e.Node,
		Scalar: e.Node,
		Seq: e.Node
	}, e.Value && {
		Map: e.Value,
		Scalar: e.Value,
		Seq: e.Value
	}, e.Collection && {
		Map: e.Collection,
		Seq: e.Collection
	}, e) : e;
}
function M(e, t, n, r) {
	if (typeof n == "function") return n(e, t, r);
	if (y(t)) return n.Map?.(e, t, r);
	if (S(t)) return n.Seq?.(e, t, r);
	if (b(t)) return n.Pair?.(e, t, r);
	if (x(t)) return n.Scalar?.(e, t, r);
	if (_(t)) return n.Alias?.(e, t, r);
}
function N(e, t, n) {
	let r = t[t.length - 1];
	if (C(r)) r.items[e] = n;
	else if (b(r)) e === "key" ? r.key = n : r.value = n;
	else if (v(r)) r.contents = n;
	else {
		let e = _(r) ? "alias" : "scalar";
		throw Error(`Cannot replace node with ${e} parent`);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/directives.js
var P = {
	"!": "%21",
	",": "%2C",
	"[": "%5B",
	"]": "%5D",
	"{": "%7B",
	"}": "%7D"
}, ee = (e) => e.replace(/[!,[\]{}]/g, (e) => P[e]), F = class e {
	constructor(t, n) {
		this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, e.defaultYaml, t), this.tags = Object.assign({}, e.defaultTags, n);
	}
	clone() {
		let t = new e(this.yaml, this.tags);
		return t.docStart = this.docStart, t;
	}
	atDocument() {
		let t = new e(this.yaml, this.tags);
		switch (this.yaml.version) {
			case "1.1":
				this.atNextDocument = !0;
				break;
			case "1.2": this.atNextDocument = !1, this.yaml = {
				explicit: e.defaultYaml.explicit,
				version: "1.2"
			}, this.tags = Object.assign({}, e.defaultTags);
		}
		return t;
	}
	add(t, n) {
		this.atNextDocument &&= (this.yaml = {
			explicit: e.defaultYaml.explicit,
			version: "1.1"
		}, this.tags = Object.assign({}, e.defaultTags), !1);
		let r = t.trim().split(/[ \t]+/), i = r.shift();
		switch (i) {
			case "%TAG": {
				if (r.length !== 2 && (n(0, "%TAG directive should contain exactly two parts"), r.length < 2)) return !1;
				let [e, t] = r;
				return this.tags[e] = t, !0;
			}
			case "%YAML": {
				if (this.yaml.explicit = !0, r.length !== 1) return n(0, "%YAML directive should contain exactly one part"), !1;
				let [e] = r;
				if (e === "1.1" || e === "1.2") return this.yaml.version = e, !0;
				{
					let t = /^\d+\.\d+$/.test(e);
					return n(6, `Unsupported YAML version ${e}`, t), !1;
				}
			}
			default: return n(0, `Unknown directive ${i}`, !0), !1;
		}
	}
	tagName(e, t) {
		if (e === "!") return "!";
		if (e[0] !== "!") return t(`Not a valid tag: ${e}`), null;
		if (e[1] === "<") {
			let n = e.slice(2, -1);
			return n === "!" || n === "!!" ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), n);
		}
		let [, n, r] = e.match(/^(.*!)([^!]*)$/s);
		r || t(`The ${e} tag has no suffix`);
		let i = this.tags[n];
		if (i) try {
			return i + decodeURIComponent(r);
		} catch (e) {
			return t(String(e)), null;
		}
		return n === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
	}
	tagString(e) {
		for (let [t, n] of Object.entries(this.tags)) if (e.startsWith(n)) return t + ee(e.substring(n.length));
		return e[0] === "!" ? e : `!<${e}>`;
	}
	toString(e) {
		let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags), r;
		if (e && n.length > 0 && w(e.contents)) {
			let t = {};
			k(e.contents, (e, n) => {
				w(n) && n.tag && (t[n.tag] = !0);
			}), r = Object.keys(t);
		} else r = [];
		for (let [i, a] of n) (i !== "!!" || a !== "tag:yaml.org,2002:") && (!e || r.some((e) => e.startsWith(a))) && t.push(`%TAG ${i} ${a}`);
		return t.join("\n");
	}
};
F.defaultYaml = {
	explicit: !1,
	version: "1.2"
}, F.defaultTags = { "!!": "tag:yaml.org,2002:" };
//#endregion
//#region node_modules/yaml/browser/dist/doc/anchors.js
function I(e) {
	if (/[\x00-\x19\s,[\]{}]/.test(e)) {
		let t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
		throw Error(t);
	}
	return !0;
}
function L(e) {
	let t = /* @__PURE__ */ new Set();
	return k(e, { Value(e, n) {
		n.anchor && t.add(n.anchor);
	} }), t;
}
function R(e, t) {
	for (let n = 1;; ++n) {
		let r = `${e}${n}`;
		if (!t.has(r)) return r;
	}
}
function z(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = null;
	return {
		onAnchor: (r) => {
			n.push(r), i ??= L(e);
			let a = R(t, i);
			return i.add(a), a;
		},
		setAnchors: () => {
			for (let e of n) {
				let t = r.get(e);
				if (typeof t == "object" && t.anchor && (x(t.node) || C(t.node))) t.node.anchor = t.anchor;
				else {
					let t = /* @__PURE__ */ Error("Failed to resolve repeated object (this should not happen)");
					throw t.source = e, t;
				}
			}
		},
		sourceObjects: r
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/applyReviver.js
function B(e, t, n, r) {
	if (r && typeof r == "object") {
		if (Array.isArray(r)) for (let t = 0, n = r.length; t < n; ++t) {
			let n = r[t], i = B(e, r, String(t), n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
		else if (r instanceof Map) for (let t of Array.from(r.keys())) {
			let n = r.get(t), i = B(e, r, t, n);
			i === void 0 ? r.delete(t) : i !== n && r.set(t, i);
		}
		else if (r instanceof Set) for (let t of Array.from(r)) {
			let n = B(e, r, t, t);
			n === void 0 ? r.delete(t) : n !== t && (r.delete(t), r.add(n));
		}
		else for (let [t, n] of Object.entries(r)) {
			let i = B(e, r, t, n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
	}
	return e.call(t, n, r);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/toJS.js
function V(e, t, n) {
	if (Array.isArray(e)) return e.map((e, t) => V(e, String(t), n));
	if (e && typeof e.toJSON == "function") {
		if (!n || !T(e)) return e.toJSON(t, n);
		let r = {
			aliasCount: 0,
			count: 1,
			res: void 0
		};
		n.anchors.set(e, r), n.onCreate = (e) => {
			r.res = e, delete n.onCreate;
		};
		let i = e.toJSON(t, n);
		return n.onCreate && n.onCreate(i), i;
	}
	return typeof e == "bigint" && !n?.keep ? Number(e) : e;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Node.js
var H = class {
	constructor(e) {
		Object.defineProperty(this, g, { value: e });
	}
	clone() {
		let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return this.range && (e.range = this.range.slice()), e;
	}
	toJS(e, { mapAsMap: t, maxAliasCount: n, onAnchor: r, reviver: i } = {}) {
		if (!v(e)) throw TypeError("A document argument is required");
		let a = {
			anchors: /* @__PURE__ */ new Map(),
			doc: e,
			keep: !0,
			mapAsMap: t === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof n == "number" ? n : 100
		}, o = V(this, "", a);
		if (typeof r == "function") for (let { count: e, res: t } of a.anchors.values()) r(t, e);
		return typeof i == "function" ? B(i, { "": o }, "", o) : o;
	}
}, U = class extends H {
	constructor(e) {
		super(u), this.source = e, Object.defineProperty(this, "tag", { set() {
			throw Error("Alias nodes cannot have tags");
		} });
	}
	resolve(e, t) {
		if (t?.maxAliasCount === 0) throw ReferenceError("Alias resolution is disabled");
		let n;
		t?.aliasResolveCache ? n = t.aliasResolveCache : (n = [], k(e, { Node: (e, t) => {
			(_(t) || T(t)) && n.push(t);
		} }), t && (t.aliasResolveCache = n));
		let r;
		for (let e of n) {
			if (e === this) break;
			e.anchor === this.source && (r = e);
		}
		if (r && t) {
			let { anchors: e, doc: n, maxAliasCount: i } = t, a = e.get(r);
			/* istanbul ignore if */
			if (a ||= (V(r, null, t), e.get(r)), a?.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = W(n, r, e)), a.count * a.aliasCount > i)) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack");
		}
		return r;
	}
	toJSON(e, t) {
		if (!t) return { source: this.source };
		let n = this.resolve(t.doc, t);
		if (!n) {
			let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
			throw ReferenceError(e);
		}
		return t.anchors.get(n).res;
	}
	toString(e, t, n) {
		let r = `*${this.source}`;
		if (e) {
			if (I(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
				let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw Error(e);
			}
			if (e.implicitKey) return `${r} `;
		}
		return r;
	}
};
function W(e, t, n) {
	if (_(t)) {
		let r = t.resolve(e), i = n && r && n.get(r);
		return i ? i.count * i.aliasCount : 0;
	}
	if (C(t)) {
		let r = 0;
		for (let i of t.items) {
			let t = W(e, i, n);
			t > r && (r = t);
		}
		return r;
	}
	if (b(t)) {
		let r = W(e, t.key, n), i = W(e, t.value, n);
		return Math.max(r, i);
	}
	return 1;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Scalar.js
var te = (e) => !e || typeof e != "function" && typeof e != "object", G = class extends H {
	constructor(e) {
		super(m), this.value = e;
	}
	toJSON(e, t) {
		return t?.keep ? this.value : V(this.value, e, t);
	}
	toString() {
		return String(this.value);
	}
};
G.BLOCK_FOLDED = "BLOCK_FOLDED", G.BLOCK_LITERAL = "BLOCK_LITERAL", G.PLAIN = "PLAIN", G.QUOTE_DOUBLE = "QUOTE_DOUBLE", G.QUOTE_SINGLE = "QUOTE_SINGLE";
//#endregion
//#region node_modules/yaml/browser/dist/doc/createNode.js
var ne = "tag:yaml.org,2002:";
function re(e, t, n) {
	if (t) {
		let e = n.filter((e) => e.tag === t), r = e.find((e) => !e.format) ?? e[0];
		if (!r) throw Error(`Tag ${t} not found`);
		return r;
	}
	return n.find((t) => t.identify?.(e) && !t.format);
}
function ie(e, t, n) {
	if (v(e) && (e = e.contents), w(e)) return e;
	if (b(e)) {
		let t = n.schema[f].createNode?.(n.schema, null, n);
		return t.items.push(e), t;
	}
	(e instanceof String || e instanceof Number || e instanceof Boolean || typeof BigInt < "u" && e instanceof BigInt) && (e = e.valueOf());
	let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: a, schema: o, sourceObjects: s } = n, c;
	if (r && e && typeof e == "object") {
		if (c = s.get(e), c) return c.anchor ?? (c.anchor = i(e)), new U(c.anchor);
		c = {
			anchor: null,
			node: null
		}, s.set(e, c);
	}
	t?.startsWith("!!") && (t = ne + t.slice(2));
	let l = re(e, t, o.tags);
	if (!l) {
		if (e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object") {
			let t = new G(e);
			return c && (c.node = t), t;
		}
		l = e instanceof Map ? o[f] : Symbol.iterator in Object(e) ? o[h] : o[f];
	}
	a && (a(l), delete n.onTagObj);
	let u = l?.createNode ? l.createNode(n.schema, e, n) : typeof l?.nodeClass?.from == "function" ? l.nodeClass.from(n.schema, e, n) : new G(e);
	return t ? u.tag = t : l.default || (u.tag = l.tag), c && (c.node = u), u;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Collection.js
function ae(e, t, n) {
	let r = n;
	for (let e = t.length - 1; e >= 0; --e) {
		let n = t[e];
		if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
			let e = [];
			e[n] = r, r = e;
		} else r = /* @__PURE__ */ new Map([[n, r]]);
	}
	return ie(r, void 0, {
		aliasDuplicateObjects: !1,
		keepUndefined: !1,
		onAnchor: () => {
			throw Error("This should not happen, please report a bug.");
		},
		schema: e,
		sourceObjects: /* @__PURE__ */ new Map()
	});
}
var oe = (e) => e == null || typeof e == "object" && !!e[Symbol.iterator]().next().done, se = class extends H {
	constructor(e, t) {
		super(e), Object.defineProperty(this, "schema", {
			value: t,
			configurable: !0,
			enumerable: !1,
			writable: !0
		});
	}
	clone(e) {
		let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return e && (t.schema = e), t.items = t.items.map((t) => w(t) || b(t) ? t.clone(e) : t), this.range && (t.range = this.range.slice()), t;
	}
	addIn(e, t) {
		if (oe(e)) this.add(t);
		else {
			let [n, ...r] = e, i = this.get(n, !0);
			if (C(i)) i.addIn(r, t);
			else if (i === void 0 && this.schema) this.set(n, ae(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
	deleteIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.delete(t);
		let r = this.get(t, !0);
		if (C(r)) return r.deleteIn(n);
		throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`);
	}
	getIn(e, t) {
		let [n, ...r] = e, i = this.get(n, !0);
		return r.length === 0 ? !t && x(i) ? i.value : i : C(i) ? i.getIn(r, t) : void 0;
	}
	hasAllNullValues(e) {
		return this.items.every((t) => {
			if (!b(t)) return !1;
			let n = t.value;
			return n == null || e && x(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
		});
	}
	hasIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.has(t);
		let r = this.get(t, !0);
		return C(r) ? r.hasIn(n) : !1;
	}
	setIn(e, t) {
		let [n, ...r] = e;
		if (r.length === 0) this.set(n, t);
		else {
			let e = this.get(n, !0);
			if (C(e)) e.setIn(r, t);
			else if (e === void 0 && this.schema) this.set(n, ae(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
}, ce = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
function le(e, t) {
	return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
}
var ue = (e, t, n) => e.endsWith("\n") ? le(n, t) : n.includes("\n") ? "\n" + le(n, t) : (e.endsWith(" ") ? "" : " ") + n, de = "flow", fe = "block", pe = "quoted";
function me(e, t, n = "flow", { indentAtStart: r, lineWidth: i = 80, minContentWidth: a = 20, onFold: o, onOverflow: s } = {}) {
	if (!i || i < 0) return e;
	i < a && (a = 0);
	let c = Math.max(1 + a, 1 + i - t.length);
	if (e.length <= c) return e;
	let l = [], u = {}, d = i - t.length;
	typeof r == "number" && (r > i - Math.max(2, a) ? l.push(0) : d = i - r);
	let f, p, m = !1, h = -1, g = -1, _ = -1;
	n === "block" && (h = he(e, h, t.length), h !== -1 && (d = h + c));
	for (let r; r = e[h += 1];) {
		if (n === "quoted" && r === "\\") {
			switch (g = h, e[h + 1]) {
				case "x":
					h += 3;
					break;
				case "u":
					h += 5;
					break;
				case "U":
					h += 9;
					break;
				default: h += 1;
			}
			_ = h;
		}
		if (r === "\n") n === "block" && (h = he(e, h, t.length)), d = h + t.length + c, f = void 0;
		else {
			if (r === " " && p && p !== " " && p !== "\n" && p !== "	") {
				let t = e[h + 1];
				t && t !== " " && t !== "\n" && t !== "	" && (f = h);
			}
			if (h >= d) {
				if (f) l.push(f), d = f + c, f = void 0;
				else if (n === "quoted") {
					for (; p === " " || p === "	";) p = r, r = e[h += 1], m = !0;
					let t = h > _ + 1 ? h - 2 : g - 1;
					if (u[t]) return e;
					l.push(t), u[t] = !0, d = t + c, f = void 0;
				} else m = !0;
			}
		}
		p = r;
	}
	if (m && s && s(), l.length === 0) return e;
	o && o();
	let v = e.slice(0, l[0]);
	for (let r = 0; r < l.length; ++r) {
		let i = l[r], a = l[r + 1] || e.length;
		i === 0 ? v = `\n${t}${e.slice(0, a)}` : (n === "quoted" && u[i] && (v += `${e[i]}\\`), v += `\n${t}${e.slice(i + 1, a)}`);
	}
	return v;
}
function he(e, t, n) {
	let r = t, i = t + 1, a = e[i];
	for (; a === " " || a === "	";) if (t < i + n) a = e[++t];
	else {
		do
			a = e[++t];
		while (a && a !== "\n");
		r = t, i = t + 1, a = e[i];
	}
	return r;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyString.js
var ge = (e, t) => ({
	indentAtStart: t ? e.indent.length : e.indentAtStart,
	lineWidth: e.options.lineWidth,
	minContentWidth: e.options.minContentWidth
}), _e = (e) => /^(%|---|\.\.\.)/m.test(e);
function ve(e, t, n) {
	if (!t || t < 0) return !1;
	let r = t - n, i = e.length;
	if (i <= r) return !1;
	for (let t = 0, n = 0; t < i; ++t) if (e[t] === "\n") {
		if (t - n > r) return !0;
		if (n = t + 1, i - n <= r) return !1;
	}
	return !0;
}
function ye(e, t) {
	let n = JSON.stringify(e);
	if (t.options.doubleQuotedAsJSON) return n;
	let { implicitKey: r } = t, i = t.options.doubleQuotedMinMultiLineLength, a = t.indent || (_e(e) ? "  " : ""), o = "", s = 0;
	for (let e = 0, t = n[e]; t; t = n[++e]) if (t === " " && n[e + 1] === "\\" && n[e + 2] === "n" && (o += n.slice(s, e) + "\\ ", e += 1, s = e, t = "\\"), t === "\\") switch (n[e + 1]) {
		case "u":
			{
				o += n.slice(s, e);
				let t = n.substr(e + 2, 4);
				switch (t) {
					case "0000":
						o += "\\0";
						break;
					case "0007":
						o += "\\a";
						break;
					case "000b":
						o += "\\v";
						break;
					case "001b":
						o += "\\e";
						break;
					case "0085":
						o += "\\N";
						break;
					case "00a0":
						o += "\\_";
						break;
					case "2028":
						o += "\\L";
						break;
					case "2029":
						o += "\\P";
						break;
					default: t.substr(0, 2) === "00" ? o += "\\x" + t.substr(2) : o += n.substr(e, 6);
				}
				e += 5, s = e + 1;
			}
			break;
		case "n":
			if (r || n[e + 2] === "\"" || n.length < i) e += 1;
			else {
				for (o += n.slice(s, e) + "\n\n"; n[e + 2] === "\\" && n[e + 3] === "n" && n[e + 4] !== "\"";) o += "\n", e += 2;
				o += a, n[e + 2] === " " && (o += "\\"), e += 1, s = e + 1;
			}
			break;
		default: e += 1;
	}
	return o = s ? o + n.slice(s) : n, r ? o : me(o, a, pe, ge(t, !1));
}
function be(e, t) {
	if (t.options.singleQuote === !1 || t.implicitKey && e.includes("\n") || /[ \t]\n|\n[ \t]/.test(e)) return ye(e, t);
	let n = t.indent || (_e(e) ? "  " : ""), r = "'" + e.replace(/'/g, "''").replace(/\n+/g, `$&\n${n}`) + "'";
	return t.implicitKey ? r : me(r, n, de, ge(t, !1));
}
function xe(e, t) {
	let { singleQuote: n } = t.options, r;
	if (n === !1) r = ye;
	else {
		let t = e.includes("\""), i = e.includes("'");
		r = t && !i ? be : i && !t ? ye : n ? be : ye;
	}
	return r(e, t);
}
var Se;
try {
	Se = /* @__PURE__ */ RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
	Se = /\n+(?!\n|$)/g;
}
function Ce({ comment: e, type: t, value: n }, r, i, a) {
	let { blockQuote: o, commentString: s, lineWidth: c } = r.options;
	if (!o || /\n[\t ]+$/.test(n)) return xe(n, r);
	let l = r.indent || (r.forceBlockIndent || _e(n) ? "  " : ""), u = o === "literal" ? !0 : o === "folded" || t === G.BLOCK_FOLDED ? !1 : t === G.BLOCK_LITERAL || !ve(n, c, l.length);
	if (!n) return u ? "|\n" : ">\n";
	let d, f;
	for (f = n.length; f > 0; --f) {
		let e = n[f - 1];
		if (e !== "\n" && e !== "	" && e !== " ") break;
	}
	let p = n.substring(f), m = p.indexOf("\n");
	m === -1 ? d = "-" : n === p || m !== p.length - 1 ? (d = "+", a && a()) : d = "", p &&= (n = n.slice(0, -p.length), p[p.length - 1] === "\n" && (p = p.slice(0, -1)), p.replace(Se, `$&${l}`));
	let h = !1, g, _ = -1;
	for (g = 0; g < n.length; ++g) {
		let e = n[g];
		if (e === " ") h = !0;
		else if (e === "\n") _ = g;
		else break;
	}
	let v = n.substring(0, _ < g ? _ + 1 : g);
	v &&= (n = n.substring(v.length), v.replace(/\n+/g, `$&${l}`));
	let y = (h ? l ? "2" : "1" : "") + d;
	if (e && (y += " " + s(e.replace(/ ?[\r\n]+/g, " ")), i && i()), !u) {
		let e = n.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${l}`), i = !1, a = ge(r, !0);
		o !== "folded" && t !== G.BLOCK_FOLDED && (a.onOverflow = () => {
			i = !0;
		});
		let s = me(`${v}${e}${p}`, l, fe, a);
		if (!i) return `>${y}\n${l}${s}`;
	}
	return n = n.replace(/\n+/g, `$&${l}`), `|${y}\n${l}${v}${n}${p}`;
}
function we(e, t, n, r) {
	let { type: i, value: a } = e, { actualString: o, implicitKey: s, indent: c, indentStep: l, inFlow: u } = t;
	if (s && a.includes("\n") || u && /[[\]{},]/.test(a)) return xe(a, t);
	if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)) return s || u || !a.includes("\n") ? xe(a, t) : Ce(e, t, n, r);
	if (!s && !u && i !== G.PLAIN && a.includes("\n")) return Ce(e, t, n, r);
	if (_e(a)) {
		if (c === "") return t.forceBlockIndent = !0, Ce(e, t, n, r);
		if (s && c === l) return xe(a, t);
	}
	let d = a.replace(/\n+/g, `$&\n${c}`);
	if (o) {
		let e = (e) => e.default && e.tag !== "tag:yaml.org,2002:str" && e.test?.test(d), { compat: n, tags: r } = t.doc.schema;
		if (r.some(e) || n?.some(e)) return xe(a, t);
	}
	return s ? d : me(d, c, de, ge(t, !1));
}
function Te(e, t, n, r) {
	let { implicitKey: i, inFlow: a } = t, o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }), { type: s } = e;
	s !== G.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (s = G.QUOTE_DOUBLE);
	let c = (e) => {
		switch (e) {
			case G.BLOCK_FOLDED:
			case G.BLOCK_LITERAL: return i || a ? xe(o.value, t) : Ce(o, t, n, r);
			case G.QUOTE_DOUBLE: return ye(o.value, t);
			case G.QUOTE_SINGLE: return be(o.value, t);
			case G.PLAIN: return we(o, t, n, r);
			default: return null;
		}
	}, l = c(s);
	if (l === null) {
		let { defaultKeyType: e, defaultStringType: n } = t.options, r = i && e || n;
		if (l = c(r), l === null) throw Error(`Unsupported default string type ${r}`);
	}
	return l;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringify.js
function Ee(e, t) {
	let n = Object.assign({
		blockQuote: !0,
		commentString: ce,
		defaultKeyType: null,
		defaultStringType: "PLAIN",
		directives: null,
		doubleQuotedAsJSON: !1,
		doubleQuotedMinMultiLineLength: 40,
		falseStr: "false",
		flowCollectionPadding: !0,
		indentSeq: !0,
		lineWidth: 80,
		minContentWidth: 20,
		nullStr: "null",
		simpleKeys: !1,
		singleQuote: null,
		trailingComma: !1,
		trueStr: "true",
		verifyAliasOrder: !0
	}, e.schema.toStringOptions, t), r;
	switch (n.collectionStyle) {
		case "block":
			r = !1;
			break;
		case "flow":
			r = !0;
			break;
		default: r = null;
	}
	return {
		anchors: /* @__PURE__ */ new Set(),
		doc: e,
		flowCollectionPadding: n.flowCollectionPadding ? " " : "",
		indent: "",
		indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
		inFlow: r,
		options: n
	};
}
function De(e, t) {
	if (t.tag) {
		let n = e.filter((e) => e.tag === t.tag);
		if (n.length > 0) return n.find((e) => e.format === t.format) ?? n[0];
	}
	let n, r;
	if (x(t)) {
		r = t.value;
		let i = e.filter((e) => e.identify?.(r));
		if (i.length > 1) {
			let e = i.filter((e) => e.test);
			e.length > 0 && (i = e);
		}
		n = i.find((e) => e.format === t.format) ?? i.find((e) => !e.format);
	} else r = t, n = e.find((e) => e.nodeClass && r instanceof e.nodeClass);
	if (!n) {
		let e = r?.constructor?.name ?? (r === null ? "null" : typeof r);
		throw Error(`Tag not resolved for ${e} value`);
	}
	return n;
}
function Oe(e, t, { anchors: n, doc: r }) {
	if (!r.directives) return "";
	let i = [], a = (x(e) || C(e)) && e.anchor;
	a && I(a) && (n.add(a), i.push(`&${a}`));
	let o = e.tag ?? (t.default ? null : t.tag);
	return o && i.push(r.directives.tagString(o)), i.join(" ");
}
function ke(e, t, n, r) {
	if (b(e)) return e.toString(t, n, r);
	if (_(e)) {
		if (t.doc.directives) return e.toString(t);
		if (t.resolvedAliases?.has(e)) throw TypeError("Cannot stringify circular structure without alias nodes");
		t.resolvedAliases ? t.resolvedAliases.add(e) : t.resolvedAliases = /* @__PURE__ */ new Set([e]), e = e.resolve(t.doc);
	}
	let i, a = w(e) ? e : t.doc.createNode(e, { onTagObj: (e) => i = e });
	i ??= De(t.doc.schema.tags, a);
	let o = Oe(a, i, t);
	o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
	let s = typeof i.stringify == "function" ? i.stringify(a, t, n, r) : x(a) ? Te(a, t, n, r) : a.toString(t, n, r);
	return o ? x(a) || s[0] === "{" || s[0] === "[" ? `${o} ${s}` : `${o}\n${t.indent}${s}` : s;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyPair.js
function Ae({ key: e, value: t }, n, r, i) {
	let { allNullValues: a, doc: o, indent: s, indentStep: c, options: { commentString: l, indentSeq: u, simpleKeys: d } } = n, f = w(e) && e.comment || null;
	if (d) {
		if (f) throw Error("With simple keys, key nodes cannot have comments");
		if (C(e) || !w(e) && typeof e == "object") throw Error("With simple keys, collection cannot be used as a key value");
	}
	let p = !d && (!e || f && t == null && !n.inFlow || C(e) || (x(e) ? e.type === G.BLOCK_FOLDED || e.type === G.BLOCK_LITERAL : typeof e == "object"));
	n = Object.assign({}, n, {
		allNullValues: !1,
		implicitKey: !p && (d || !a),
		indent: s + c
	});
	let m = !1, h = !1, g = ke(e, n, () => m = !0, () => h = !0);
	if (!p && !n.inFlow && g.length > 1024) {
		if (d) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
		p = !0;
	}
	if (n.inFlow) {
		if (a || t == null) return m && r && r(), g === "" ? "?" : p ? `? ${g}` : g;
	} else if (a && !d || t == null && p) return g = `? ${g}`, f && !m ? g += ue(g, n.indent, l(f)) : h && i && i(), g;
	m && (f = null), p ? (f && (g += ue(g, n.indent, l(f))), g = `? ${g}\n${s}:`) : (g = `${g}:`, f && (g += ue(g, n.indent, l(f))));
	let _, v, y;
	w(t) ? (_ = !!t.spaceBefore, v = t.commentBefore, y = t.comment) : (_ = !1, v = null, y = null, t && typeof t == "object" && (t = o.createNode(t))), n.implicitKey = !1, !p && !f && x(t) && (n.indentAtStart = g.length + 1), h = !1, !u && c.length >= 2 && !n.inFlow && !p && S(t) && !t.flow && !t.tag && !t.anchor && (n.indent = n.indent.substring(2));
	let b = !1, T = ke(t, n, () => b = !0, () => h = !0), E = " ";
	if (f || _ || v) {
		if (E = _ ? "\n" : "", v) {
			let e = l(v);
			E += `\n${le(e, n.indent)}`;
		}
		T === "" && !n.inFlow ? E === "\n" && y && (E = "\n\n") : E += `\n${n.indent}`;
	} else if (!p && C(t)) {
		let e = T[0], r = T.indexOf("\n"), i = r !== -1, a = n.inFlow ?? t.flow ?? t.items.length === 0;
		if (i || !a) {
			let t = !1;
			if (i && (e === "&" || e === "!")) {
				let n = T.indexOf(" ");
				e === "&" && n !== -1 && n < r && T[n + 1] === "!" && (n = T.indexOf(" ", n + 1)), (n === -1 || r < n) && (t = !0);
			}
			t || (E = `\n${n.indent}`);
		}
	} else (T === "" || T[0] === "\n") && (E = "");
	return g += E + T, n.inFlow ? b && r && r() : y && !b ? g += ue(g, n.indent, l(y)) : h && i && i(), g;
}
//#endregion
//#region node_modules/yaml/browser/dist/log.js
function je(e, t) {
	(e === "debug" || e === "warn") && console.warn(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var Me = "<<", Ne = {
	identify: (e) => e === Me || typeof e == "symbol" && e.description === Me,
	default: "key",
	tag: "tag:yaml.org,2002:merge",
	test: /^<<$/,
	resolve: () => Object.assign(new G(Symbol(Me)), { addToJSMap: Fe }),
	stringify: () => Me
}, Pe = (e, t) => (Ne.identify(t) || x(t) && (!t.type || t.type === G.PLAIN) && Ne.identify(t.value)) && e?.doc.schema.tags.some((e) => e.tag === Ne.tag && e.default);
function Fe(e, t, n) {
	let r = Le(e, n);
	if (S(r)) for (let n of r.items) Ie(e, t, n);
	else if (Array.isArray(r)) for (let n of r) Ie(e, t, n);
	else Ie(e, t, r);
}
function Ie(e, t, n) {
	let r = Le(e, n);
	if (!y(r)) throw Error("Merge sources must be maps or map aliases");
	let i = r.toJSON(null, e, Map);
	for (let [e, n] of i) t instanceof Map ? t.has(e) || t.set(e, n) : t instanceof Set ? t.add(e) : Object.prototype.hasOwnProperty.call(t, e) || Object.defineProperty(t, e, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
	return t;
}
function Le(e, t) {
	return e && _(t) ? t.resolve(e.doc, e) : t;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function Re(e, t, { key: n, value: r }) {
	if (w(n) && n.addToJSMap) n.addToJSMap(e, t, r);
	else if (Pe(e, n)) Fe(e, t, r);
	else {
		let i = V(n, "", e);
		if (t instanceof Map) t.set(i, V(r, i, e));
		else if (t instanceof Set) t.add(i);
		else {
			let a = ze(n, i, e), o = V(r, a, e);
			a in t ? Object.defineProperty(t, a, {
				value: o,
				writable: !0,
				enumerable: !0,
				configurable: !0
			}) : t[a] = o;
		}
	}
	return t;
}
function ze(e, t, n) {
	if (t === null) return "";
	if (typeof t != "object") return String(t);
	if (w(e) && n?.doc) {
		let t = Ee(n.doc, {});
		t.anchors = /* @__PURE__ */ new Set();
		for (let e of n.anchors.keys()) t.anchors.add(e.anchor);
		t.inFlow = !0, t.inStringifyKey = !0;
		let r = e.toString(t);
		if (!n.mapKeyWarned) {
			let e = JSON.stringify(r);
			e.length > 40 && (e = e.substring(0, 36) + "...\""), je(n.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`), n.mapKeyWarned = !0;
		}
		return r;
	}
	return JSON.stringify(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Pair.js
function Be(e, t, n) {
	return new Ve(ie(e, void 0, n), ie(t, void 0, n));
}
var Ve = class e {
	constructor(e, t = null) {
		Object.defineProperty(this, g, { value: p }), this.key = e, this.value = t;
	}
	clone(t) {
		let { key: n, value: r } = this;
		return w(n) && (n = n.clone(t)), w(r) && (r = r.clone(t)), new e(n, r);
	}
	toJSON(e, t) {
		return Re(t, t?.mapAsMap ? /* @__PURE__ */ new Map() : {}, this);
	}
	toString(e, t, n) {
		return e?.doc ? Ae(this, e, t, n) : JSON.stringify(this);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function He(e, t, n) {
	return (t.inFlow ?? e.flow ? We : Ue)(e, t, n);
}
function Ue({ comment: e, items: t }, n, { blockItemPrefix: r, flowChars: i, itemIndent: a, onChompKeep: o, onComment: s }) {
	let { indent: c, options: { commentString: l } } = n, u = Object.assign({}, n, {
		indent: a,
		type: null
	}), d = !1, f = [];
	for (let e = 0; e < t.length; ++e) {
		let i = t[e], o = null;
		if (w(i)) !d && i.spaceBefore && f.push(""), Ge(n, f, i.commentBefore, d), i.comment && (o = i.comment);
		else if (b(i)) {
			let e = w(i.key) ? i.key : null;
			e && (!d && e.spaceBefore && f.push(""), Ge(n, f, e.commentBefore, d));
		}
		d = !1;
		let s = ke(i, u, () => o = null, () => d = !0);
		o && (s += ue(s, a, l(o))), d && o && (d = !1), f.push(r + s);
	}
	let p;
	if (f.length === 0) p = i.start + i.end;
	else {
		p = f[0];
		for (let e = 1; e < f.length; ++e) {
			let t = f[e];
			p += t ? `\n${c}${t}` : "\n";
		}
	}
	return e ? (p += "\n" + le(l(e), c), s && s()) : d && o && o(), p;
}
function We({ items: e }, t, { flowChars: n, itemIndent: r }) {
	let { indent: i, indentStep: a, flowCollectionPadding: o, options: { commentString: s } } = t;
	r += a;
	let c = Object.assign({}, t, {
		indent: r,
		inFlow: !0,
		type: null
	}), l = !1, u = 0, d = [];
	for (let n = 0; n < e.length; ++n) {
		let i = e[n], a = null;
		if (w(i)) i.spaceBefore && d.push(""), Ge(t, d, i.commentBefore, !1), i.comment && (a = i.comment);
		else if (b(i)) {
			let e = w(i.key) ? i.key : null;
			e && (e.spaceBefore && d.push(""), Ge(t, d, e.commentBefore, !1), e.comment && (l = !0));
			let n = w(i.value) ? i.value : null;
			n ? (n.comment && (a = n.comment), n.commentBefore && (l = !0)) : i.value == null && e?.comment && (a = e.comment);
		}
		a && (l = !0);
		let o = ke(i, c, () => a = null);
		l ||= d.length > u || o.includes("\n"), n < e.length - 1 ? o += "," : t.options.trailingComma && (t.options.lineWidth > 0 && (l ||= d.reduce((e, t) => e + t.length + 2, 2) + (o.length + 2) > t.options.lineWidth), l && (o += ",")), a && (o += ue(o, r, s(a))), d.push(o), u = d.length;
	}
	let { start: f, end: p } = n;
	if (d.length === 0) return f + p;
	if (!l) {
		let e = d.reduce((e, t) => e + t.length + 2, 2);
		l = t.options.lineWidth > 0 && e > t.options.lineWidth;
	}
	if (l) {
		let e = f;
		for (let t of d) e += t ? `\n${a}${i}${t}` : "\n";
		return `${e}\n${i}${p}`;
	}
	return `${f}${o}${d.join(" ")}${o}${p}`;
}
function Ge({ indent: e, options: { commentString: t } }, n, r, i) {
	if (r && i && (r = r.replace(/^\n+/, "")), r) {
		let i = le(t(r), e);
		n.push(i.trimStart());
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/YAMLMap.js
function Ke(e, t) {
	let n = x(t) ? t.value : t;
	for (let r of e) if (b(r) && (r.key === t || r.key === n || x(r.key) && r.key.value === n)) return r;
}
var qe = class extends se {
	static get tagName() {
		return "tag:yaml.org,2002:map";
	}
	constructor(e) {
		super(f, e), this.items = [];
	}
	static from(e, t, n) {
		let { keepUndefined: r, replacer: i } = n, a = new this(e), o = (e, o) => {
			if (typeof i == "function") o = i.call(t, e, o);
			else if (Array.isArray(i) && !i.includes(e)) return;
			(o !== void 0 || r) && a.items.push(Be(e, o, n));
		};
		if (t instanceof Map) for (let [e, n] of t) o(e, n);
		else if (t && typeof t == "object") for (let e of Object.keys(t)) o(e, t[e]);
		return typeof e.sortMapEntries == "function" && a.items.sort(e.sortMapEntries), a;
	}
	add(e, t) {
		let n;
		n = b(e) ? e : !e || typeof e != "object" || !("key" in e) ? new Ve(e, e?.value) : new Ve(e.key, e.value);
		let r = Ke(this.items, n.key), i = this.schema?.sortMapEntries;
		if (r) {
			if (!t) throw Error(`Key ${n.key} already set`);
			x(r.value) && te(n.value) ? r.value.value = n.value : r.value = n.value;
		} else if (i) {
			let e = this.items.findIndex((e) => i(n, e) < 0);
			e === -1 ? this.items.push(n) : this.items.splice(e, 0, n);
		} else this.items.push(n);
	}
	delete(e) {
		let t = Ke(this.items, e);
		return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
	}
	get(e, t) {
		let n = Ke(this.items, e)?.value;
		return (!t && x(n) ? n.value : n) ?? void 0;
	}
	has(e) {
		return !!Ke(this.items, e);
	}
	set(e, t) {
		this.add(new Ve(e, t), !0);
	}
	toJSON(e, t, n) {
		let r = n ? new n() : t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
		t?.onCreate && t.onCreate(r);
		for (let e of this.items) Re(t, r, e);
		return r;
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		for (let e of this.items) if (!b(e)) throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);
		return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), He(this, e, {
			blockItemPrefix: "",
			flowChars: {
				start: "{",
				end: "}"
			},
			itemIndent: e.indent || "",
			onChompKeep: n,
			onComment: t
		});
	}
}, Je = {
	collection: "map",
	default: !0,
	nodeClass: qe,
	tag: "tag:yaml.org,2002:map",
	resolve(e, t) {
		return y(e) || t("Expected a mapping for this tag"), e;
	},
	createNode: (e, t, n) => qe.from(e, t, n)
}, Ye = class extends se {
	static get tagName() {
		return "tag:yaml.org,2002:seq";
	}
	constructor(e) {
		super(h, e), this.items = [];
	}
	add(e) {
		this.items.push(e);
	}
	delete(e) {
		let t = Xe(e);
		return typeof t == "number" && this.items.splice(t, 1).length > 0;
	}
	get(e, t) {
		let n = Xe(e);
		if (typeof n != "number") return;
		let r = this.items[n];
		return !t && x(r) ? r.value : r;
	}
	has(e) {
		let t = Xe(e);
		return typeof t == "number" && t < this.items.length;
	}
	set(e, t) {
		let n = Xe(e);
		if (typeof n != "number") throw Error(`Expected a valid index, not ${e}.`);
		let r = this.items[n];
		x(r) && te(t) ? r.value = t : this.items[n] = t;
	}
	toJSON(e, t) {
		let n = [];
		t?.onCreate && t.onCreate(n);
		let r = 0;
		for (let e of this.items) n.push(V(e, String(r++), t));
		return n;
	}
	toString(e, t, n) {
		return e ? He(this, e, {
			blockItemPrefix: "- ",
			flowChars: {
				start: "[",
				end: "]"
			},
			itemIndent: (e.indent || "") + "  ",
			onChompKeep: n,
			onComment: t
		}) : JSON.stringify(this);
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) {
			let e = 0;
			for (let a of t) {
				if (typeof r == "function") {
					let n = t instanceof Set ? a : String(e++);
					a = r.call(t, n, a);
				}
				i.items.push(ie(a, void 0, n));
			}
		}
		return i;
	}
};
function Xe(e) {
	let t = x(e) ? e.value : e;
	return t && typeof t == "string" && (t = Number(t)), typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/common/seq.js
var Ze = {
	collection: "seq",
	default: !0,
	nodeClass: Ye,
	tag: "tag:yaml.org,2002:seq",
	resolve(e, t) {
		return S(e) || t("Expected a sequence for this tag"), e;
	},
	createNode: (e, t, n) => Ye.from(e, t, n)
}, Qe = {
	identify: (e) => typeof e == "string",
	default: !0,
	tag: "tag:yaml.org,2002:str",
	resolve: (e) => e,
	stringify(e, t, n, r) {
		return t = Object.assign({ actualString: !0 }, t), Te(e, t, n, r);
	}
}, $e = {
	identify: (e) => e == null,
	createNode: () => new G(null),
	default: !0,
	tag: "tag:yaml.org,2002:null",
	test: /^(?:~|[Nn]ull|NULL)?$/,
	resolve: () => new G(null),
	stringify: ({ source: e }, t) => typeof e == "string" && $e.test.test(e) ? e : t.options.nullStr
}, et = {
	identify: (e) => typeof e == "boolean",
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
	resolve: (e) => new G(e[0] === "t" || e[0] === "T"),
	stringify({ source: e, value: t }, n) {
		return e && et.test.test(e) && t === (e[0] === "t" || e[0] === "T") ? e : t ? n.options.trueStr : n.options.falseStr;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function tt({ format: e, minFractionDigits: t, tag: n, value: r }) {
	if (typeof r == "bigint") return String(r);
	let i = typeof r == "number" ? r : Number(r);
	if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
	let a = Object.is(r, -0) ? "-0" : JSON.stringify(r);
	if (!e && t && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(a) && !a.includes("e")) {
		let e = a.indexOf(".");
		e < 0 && (e = a.length, a += ".");
		let n = t - (a.length - e - 1);
		for (; n-- > 0;) a += "0";
	}
	return a;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/core/float.js
var nt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: tt
}, rt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : tt(e);
	}
}, it = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
	resolve(e) {
		let t = new G(parseFloat(e)), n = e.indexOf(".");
		return n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t;
	},
	stringify: tt
}, at = (e) => typeof e == "bigint" || Number.isInteger(e), ot = (e, t, n, { intAsBigInt: r }) => r ? BigInt(e) : parseInt(e.substring(t), n);
function st(e, t, n) {
	let { value: r } = e;
	return at(r) && r >= 0 ? n + r.toString(t) : tt(e);
}
var ct = {
	identify: (e) => at(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^0o[0-7]+$/,
	resolve: (e, t, n) => ot(e, 2, 8, n),
	stringify: (e) => st(e, 8, "0o")
}, lt = {
	identify: at,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9]+$/,
	resolve: (e, t, n) => ot(e, 0, 10, n),
	stringify: tt
}, ut = {
	identify: (e) => at(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^0x[0-9a-fA-F]+$/,
	resolve: (e, t, n) => ot(e, 2, 16, n),
	stringify: (e) => st(e, 16, "0x")
}, dt = [
	Je,
	Ze,
	Qe,
	$e,
	et,
	ct,
	lt,
	ut,
	nt,
	rt,
	it
];
//#endregion
//#region node_modules/yaml/browser/dist/schema/json/schema.js
function ft(e) {
	return typeof e == "bigint" || Number.isInteger(e);
}
var pt = ({ value: e }) => JSON.stringify(e), mt = [
	{
		identify: (e) => typeof e == "string",
		default: !0,
		tag: "tag:yaml.org,2002:str",
		resolve: (e) => e,
		stringify: pt
	},
	{
		identify: (e) => e == null,
		createNode: () => new G(null),
		default: !0,
		tag: "tag:yaml.org,2002:null",
		test: /^null$/,
		resolve: () => null,
		stringify: pt
	},
	{
		identify: (e) => typeof e == "boolean",
		default: !0,
		tag: "tag:yaml.org,2002:bool",
		test: /^true$|^false$/,
		resolve: (e) => e === "true",
		stringify: pt
	},
	{
		identify: ft,
		default: !0,
		tag: "tag:yaml.org,2002:int",
		test: /^-?(?:0|[1-9][0-9]*)$/,
		resolve: (e, t, { intAsBigInt: n }) => n ? BigInt(e) : parseInt(e, 10),
		stringify: ({ value: e }) => ft(e) ? e.toString() : JSON.stringify(e)
	},
	{
		identify: (e) => typeof e == "number",
		default: !0,
		tag: "tag:yaml.org,2002:float",
		test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
		resolve: (e) => parseFloat(e),
		stringify: pt
	}
], ht = [Je, Ze].concat(mt, {
	default: !0,
	tag: "",
	test: /^/,
	resolve(e, t) {
		return t(`Unresolved plain scalar ${JSON.stringify(e)}`), e;
	}
}), gt = {
	identify: (e) => e instanceof Uint8Array,
	default: !1,
	tag: "tag:yaml.org,2002:binary",
	resolve(e, t) {
		if (typeof atob == "function") {
			let t = atob(e.replace(/[\n\r]/g, "")), n = new Uint8Array(t.length);
			for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
			return n;
		}
		return t("This environment does not support reading binary tags; either Buffer or atob is required"), e;
	},
	stringify({ comment: e, type: t, value: n }, r, i, a) {
		if (!n) return "";
		let o = n, s;
		if (typeof btoa == "function") {
			let e = "";
			for (let t = 0; t < o.length; ++t) e += String.fromCharCode(o[t]);
			s = btoa(e);
		} else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
		if (t ??= G.BLOCK_LITERAL, t !== G.QUOTE_DOUBLE) {
			let e = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth), n = Math.ceil(s.length / e), i = Array(n);
			for (let t = 0, r = 0; t < n; ++t, r += e) i[t] = s.substr(r, e);
			s = i.join(t === G.BLOCK_LITERAL ? "\n" : " ");
		}
		return Te({
			comment: e,
			type: t,
			value: s
		}, r, i, a);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function _t(e, t) {
	if (S(e)) for (let n = 0; n < e.items.length; ++n) {
		let r = e.items[n];
		if (!b(r)) {
			if (y(r)) {
				r.items.length > 1 && t("Each pair must have its own sequence indicator");
				let e = r.items[0] || new Ve(new G(null));
				if (r.commentBefore && (e.key.commentBefore = e.key.commentBefore ? `${r.commentBefore}\n${e.key.commentBefore}` : r.commentBefore), r.comment) {
					let t = e.value ?? e.key;
					t.comment = t.comment ? `${r.comment}\n${t.comment}` : r.comment;
				}
				r = e;
			}
			e.items[n] = b(r) ? r : new Ve(r);
		}
	}
	else t("Expected a sequence for this tag");
	return e;
}
function vt(e, t, n) {
	let { replacer: r } = n, i = new Ye(e);
	i.tag = "tag:yaml.org,2002:pairs";
	let a = 0;
	if (t && Symbol.iterator in Object(t)) for (let e of t) {
		typeof r == "function" && (e = r.call(t, String(a++), e));
		let o, s;
		if (Array.isArray(e)) {
			if (e.length === 2) o = e[0], s = e[1];
			else throw TypeError(`Expected [key, value] tuple: ${e}`);
		} else if (e && e instanceof Object) {
			let t = Object.keys(e);
			if (t.length === 1) o = t[0], s = e[o];
			else throw TypeError(`Expected tuple with one key, not ${t.length} keys`);
		} else o = e;
		i.items.push(Be(o, s, n));
	}
	return i;
}
var yt = {
	collection: "seq",
	default: !1,
	tag: "tag:yaml.org,2002:pairs",
	resolve: _t,
	createNode: vt
}, bt = class e extends Ye {
	constructor() {
		super(), this.add = qe.prototype.add.bind(this), this.delete = qe.prototype.delete.bind(this), this.get = qe.prototype.get.bind(this), this.has = qe.prototype.has.bind(this), this.set = qe.prototype.set.bind(this), this.tag = e.tag;
	}
	toJSON(e, t) {
		if (!t) return super.toJSON(e);
		let n = /* @__PURE__ */ new Map();
		t?.onCreate && t.onCreate(n);
		for (let e of this.items) {
			let r, i;
			if (b(e) ? (r = V(e.key, "", t), i = V(e.value, r, t)) : r = V(e, "", t), n.has(r)) throw Error("Ordered maps must not include duplicate keys");
			n.set(r, i);
		}
		return n;
	}
	static from(e, t, n) {
		let r = vt(e, t, n), i = new this();
		return i.items = r.items, i;
	}
};
bt.tag = "tag:yaml.org,2002:omap";
var xt = {
	collection: "seq",
	identify: (e) => e instanceof Map,
	nodeClass: bt,
	default: !1,
	tag: "tag:yaml.org,2002:omap",
	resolve(e, t) {
		let n = _t(e, t), r = [];
		for (let { key: e } of n.items) x(e) && (r.includes(e.value) ? t(`Ordered maps must not include duplicate keys: ${e.value}`) : r.push(e.value));
		return Object.assign(new bt(), n);
	},
	createNode: (e, t, n) => bt.from(e, t, n)
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function St({ value: e, source: t }, n) {
	return t && (e ? Ct : wt).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
}
var Ct = {
	identify: (e) => e === !0,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
	resolve: () => new G(!0),
	stringify: St
}, wt = {
	identify: (e) => e === !1,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
	resolve: () => new G(!1),
	stringify: St
}, Tt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: tt
}, Et = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e.replace(/_/g, "")),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : tt(e);
	}
}, Dt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
	resolve(e) {
		let t = new G(parseFloat(e.replace(/_/g, ""))), n = e.indexOf(".");
		if (n !== -1) {
			let r = e.substring(n + 1).replace(/_/g, "");
			r[r.length - 1] === "0" && (t.minFractionDigits = r.length);
		}
		return t;
	},
	stringify: tt
}, Ot = (e) => typeof e == "bigint" || Number.isInteger(e);
function kt(e, t, n, { intAsBigInt: r }) {
	let i = e[0];
	if ((i === "-" || i === "+") && (t += 1), e = e.substring(t).replace(/_/g, ""), r) {
		switch (n) {
			case 2:
				e = `0b${e}`;
				break;
			case 8:
				e = `0o${e}`;
				break;
			case 16: e = `0x${e}`;
		}
		let t = BigInt(e);
		return i === "-" ? BigInt(-1) * t : t;
	}
	let a = parseInt(e, n);
	return i === "-" ? -1 * a : a;
}
function At(e, t, n) {
	let { value: r } = e;
	if (Ot(r)) {
		let e = r.toString(t);
		return r < 0 ? "-" + n + e.substr(1) : n + e;
	}
	return tt(e);
}
var jt = {
	identify: Ot,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "BIN",
	test: /^[-+]?0b[0-1_]+$/,
	resolve: (e, t, n) => kt(e, 2, 2, n),
	stringify: (e) => At(e, 2, "0b")
}, Mt = {
	identify: Ot,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^[-+]?0[0-7_]+$/,
	resolve: (e, t, n) => kt(e, 1, 8, n),
	stringify: (e) => At(e, 8, "0")
}, Nt = {
	identify: Ot,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9][0-9_]*$/,
	resolve: (e, t, n) => kt(e, 0, 10, n),
	stringify: tt
}, Pt = {
	identify: Ot,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^[-+]?0x[0-9a-fA-F_]+$/,
	resolve: (e, t, n) => kt(e, 2, 16, n),
	stringify: (e) => At(e, 16, "0x")
}, Ft = class e extends qe {
	constructor(t) {
		super(t), this.tag = e.tag;
	}
	add(e) {
		let t;
		t = b(e) ? e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? new Ve(e.key, null) : new Ve(e, null), Ke(this.items, t.key) || this.items.push(t);
	}
	get(e, t) {
		let n = Ke(this.items, e);
		return !t && b(n) ? x(n.key) ? n.key.value : n.key : n;
	}
	set(e, t) {
		if (typeof t != "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
		let n = Ke(this.items, e);
		n && !t ? this.items.splice(this.items.indexOf(n), 1) : !n && t && this.items.push(new Ve(e));
	}
	toJSON(e, t) {
		return super.toJSON(e, t, Set);
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, n);
		throw Error("Set items must all have null values");
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) for (let e of t) typeof r == "function" && (e = r.call(t, e, e)), i.items.push(Be(e, null, n));
		return i;
	}
};
Ft.tag = "tag:yaml.org,2002:set";
var It = {
	collection: "map",
	identify: (e) => e instanceof Set,
	nodeClass: Ft,
	default: !1,
	tag: "tag:yaml.org,2002:set",
	createNode: (e, t, n) => Ft.from(e, t, n),
	resolve(e, t) {
		if (y(e)) {
			if (e.hasAllNullValues(!0)) return Object.assign(new Ft(), e);
			t("Set items must all have null values");
		} else t("Expected a mapping for this tag");
		return e;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function Lt(e, t) {
	let n = e[0], r = n === "-" || n === "+" ? e.substring(1) : e, i = (e) => t ? BigInt(e) : Number(e), a = r.replace(/_/g, "").split(":").reduce((e, t) => e * i(60) + i(t), i(0));
	return n === "-" ? i(-1) * a : a;
}
function Rt(e) {
	let { value: t } = e, n = (e) => e;
	if (typeof t == "bigint") n = (e) => BigInt(e);
	else if (isNaN(t) || !isFinite(t)) return tt(e);
	let r = "";
	t < 0 && (r = "-", t *= n(-1));
	let i = n(60), a = [t % i];
	return t < 60 ? a.unshift(0) : (t = (t - a[0]) / i, a.unshift(t % i), t >= 60 && (t = (t - a[0]) / i, a.unshift(t))), r + a.map((e) => String(e).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var zt = {
	identify: (e) => typeof e == "bigint" || Number.isInteger(e),
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
	resolve: (e, t, { intAsBigInt: n }) => Lt(e, n),
	stringify: Rt
}, Bt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
	resolve: (e) => Lt(e, !1),
	stringify: Rt
}, Vt = {
	identify: (e) => e instanceof Date,
	default: !0,
	tag: "tag:yaml.org,2002:timestamp",
	test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
	resolve(e) {
		let t = e.match(Vt.test);
		if (!t) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
		let [, n, r, i, a, o, s] = t.map(Number), c = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0, l = Date.UTC(n, r - 1, i, a || 0, o || 0, s || 0, c), u = t[8];
		if (u && u !== "Z") {
			let e = Lt(u, !1);
			Math.abs(e) < 30 && (e *= 60), l -= 6e4 * e;
		}
		return new Date(l);
	},
	stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, Ht = [
	Je,
	Ze,
	Qe,
	$e,
	Ct,
	wt,
	jt,
	Mt,
	Nt,
	Pt,
	Tt,
	Et,
	Dt,
	gt,
	Ne,
	xt,
	yt,
	It,
	zt,
	Bt,
	Vt
], Ut = /* @__PURE__ */ new Map([
	["core", dt],
	["failsafe", [
		Je,
		Ze,
		Qe
	]],
	["json", ht],
	["yaml11", Ht],
	["yaml-1.1", Ht]
]), Wt = {
	binary: gt,
	bool: et,
	float: it,
	floatExp: rt,
	floatNaN: nt,
	floatTime: Bt,
	int: lt,
	intHex: ut,
	intOct: ct,
	intTime: zt,
	map: Je,
	merge: Ne,
	null: $e,
	omap: xt,
	pairs: yt,
	seq: Ze,
	set: It,
	timestamp: Vt
}, Gt = {
	"tag:yaml.org,2002:binary": gt,
	"tag:yaml.org,2002:merge": Ne,
	"tag:yaml.org,2002:omap": xt,
	"tag:yaml.org,2002:pairs": yt,
	"tag:yaml.org,2002:set": It,
	"tag:yaml.org,2002:timestamp": Vt
};
function Kt(e, t, n) {
	let r = Ut.get(t);
	if (r && !e) return n && !r.includes(Ne) ? r.concat(Ne) : r.slice();
	let i = r;
	if (!i) {
		if (Array.isArray(e)) i = [];
		else {
			let e = Array.from(Ut.keys()).filter((e) => e !== "yaml11").map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`);
		}
	}
	if (Array.isArray(e)) for (let t of e) i = i.concat(t);
	else typeof e == "function" && (i = e(i.slice()));
	return n && (i = i.concat(Ne)), i.reduce((e, t) => {
		let n = typeof t == "string" ? Wt[t] : t;
		if (!n) {
			let e = JSON.stringify(t), n = Object.keys(Wt).map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown custom tag ${e}; use one of ${n}`);
		}
		return e.includes(n) || e.push(n), e;
	}, []);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/Schema.js
var qt = (e, t) => e.key < t.key ? -1 : +(e.key > t.key), Jt = class e {
	constructor({ compat: e, customTags: t, merge: n, resolveKnownTags: r, schema: i, sortMapEntries: a, toStringDefaults: o }) {
		this.compat = Array.isArray(e) ? Kt(e, "compat") : e ? Kt(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = r ? Gt : {}, this.tags = Kt(t, this.name, n), this.toStringOptions = o ?? null, Object.defineProperty(this, f, { value: Je }), Object.defineProperty(this, m, { value: Qe }), Object.defineProperty(this, h, { value: Ze }), this.sortMapEntries = typeof a == "function" ? a : a === !0 ? qt : null;
	}
	clone() {
		let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
		return t.tags = this.tags.slice(), t;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function Yt(e, t) {
	let n = [], r = t.directives === !0;
	if (t.directives !== !1 && e.directives) {
		let t = e.directives.toString(e);
		t ? (n.push(t), r = !0) : e.directives.docStart && (r = !0);
	}
	r && n.push("---");
	let i = Ee(e, t), { commentString: a } = i.options;
	if (e.commentBefore) {
		n.length !== 1 && n.unshift("");
		let t = a(e.commentBefore);
		n.unshift(le(t, ""));
	}
	let o = !1, s = null;
	if (e.contents) {
		if (w(e.contents)) {
			if (e.contents.spaceBefore && r && n.push(""), e.contents.commentBefore) {
				let t = a(e.contents.commentBefore);
				n.push(le(t, ""));
			}
			i.forceBlockIndent = !!e.comment, s = e.contents.comment;
		}
		let t = s ? void 0 : () => o = !0, c = ke(e.contents, i, () => s = null, t);
		s && (c += ue(c, "", a(s))), (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? n[n.length - 1] = `--- ${c}` : n.push(c);
	} else n.push(ke(e.contents, i));
	if (e.directives?.docEnd) {
		if (e.comment) {
			let t = a(e.comment);
			t.includes("\n") ? (n.push("..."), n.push(le(t, ""))) : n.push(`... ${t}`);
		} else n.push("...");
	} else {
		let t = e.comment;
		t && o && (t = t.replace(/^\n+/, "")), t && ((!o || s) && n[n.length - 1] !== "" && n.push(""), n.push(le(a(t), "")));
	}
	return n.join("\n") + "\n";
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/Document.js
var Xt = class e {
	constructor(e, t, n) {
		this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, g, { value: d });
		let r = null;
		typeof t == "function" || Array.isArray(t) ? r = t : n === void 0 && t && (n = t, t = void 0);
		let i = Object.assign({
			intAsBigInt: !1,
			keepSourceTokens: !1,
			logLevel: "warn",
			prettyErrors: !0,
			strict: !0,
			stringKeys: !1,
			uniqueKeys: !0,
			version: "1.2"
		}, n);
		this.options = i;
		let { version: a } = i;
		n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (a = this.directives.yaml.version)) : this.directives = new F({ version: a }), this.setSchema(a, n), this.contents = e === void 0 ? null : this.createNode(e, r, n);
	}
	clone() {
		let t = Object.create(e.prototype, { [g]: { value: d } });
		return t.commentBefore = this.commentBefore, t.comment = this.comment, t.errors = this.errors.slice(), t.warnings = this.warnings.slice(), t.options = Object.assign({}, this.options), this.directives && (t.directives = this.directives.clone()), t.schema = this.schema.clone(), t.contents = w(this.contents) ? this.contents.clone(t.schema) : this.contents, this.range && (t.range = this.range.slice()), t;
	}
	add(e) {
		Zt(this.contents) && this.contents.add(e);
	}
	addIn(e, t) {
		Zt(this.contents) && this.contents.addIn(e, t);
	}
	createAlias(e, t) {
		if (!e.anchor) {
			let n = L(this);
			e.anchor = !t || n.has(t) ? R(t || "a", n) : t;
		}
		return new U(e.anchor);
	}
	createNode(e, t, n) {
		let r;
		if (typeof t == "function") e = t.call({ "": e }, "", e), r = t;
		else if (Array.isArray(t)) {
			let e = t.filter((e) => typeof e == "number" || e instanceof String || e instanceof Number).map(String);
			e.length > 0 && (t = t.concat(e)), r = t;
		} else n === void 0 && t && (n = t, t = void 0);
		let { aliasDuplicateObjects: i, anchorPrefix: a, flow: o, keepUndefined: s, onTagObj: c, tag: l } = n ?? {}, { onAnchor: u, setAnchors: d, sourceObjects: f } = z(this, a || "a"), p = {
			aliasDuplicateObjects: i ?? !0,
			keepUndefined: s ?? !1,
			onAnchor: u,
			onTagObj: c,
			replacer: r,
			schema: this.schema,
			sourceObjects: f
		}, m = ie(e, l, p);
		return o && C(m) && (m.flow = !0), d(), m;
	}
	createPair(e, t, n = {}) {
		return new Ve(this.createNode(e, null, n), this.createNode(t, null, n));
	}
	delete(e) {
		return Zt(this.contents) ? this.contents.delete(e) : !1;
	}
	deleteIn(e) {
		return oe(e) ? this.contents != null && (this.contents = null, !0) : Zt(this.contents) ? this.contents.deleteIn(e) : !1;
	}
	get(e, t) {
		return C(this.contents) ? this.contents.get(e, t) : void 0;
	}
	getIn(e, t) {
		return oe(e) ? !t && x(this.contents) ? this.contents.value : this.contents : C(this.contents) ? this.contents.getIn(e, t) : void 0;
	}
	has(e) {
		return C(this.contents) ? this.contents.has(e) : !1;
	}
	hasIn(e) {
		return oe(e) ? this.contents !== void 0 : C(this.contents) ? this.contents.hasIn(e) : !1;
	}
	set(e, t) {
		this.contents == null ? this.contents = ae(this.schema, [e], t) : Zt(this.contents) && this.contents.set(e, t);
	}
	setIn(e, t) {
		oe(e) ? this.contents = t : this.contents == null ? this.contents = ae(this.schema, Array.from(e), t) : Zt(this.contents) && this.contents.setIn(e, t);
	}
	setSchema(e, t = {}) {
		typeof e == "number" && (e = String(e));
		let n;
		switch (e) {
			case "1.1":
				this.directives ? this.directives.yaml.version = "1.1" : this.directives = new F({ version: "1.1" }), n = {
					resolveKnownTags: !1,
					schema: "yaml-1.1"
				};
				break;
			case "1.2":
			case "next":
				this.directives ? this.directives.yaml.version = e : this.directives = new F({ version: e }), n = {
					resolveKnownTags: !0,
					schema: "core"
				};
				break;
			case null:
				this.directives && delete this.directives, n = null;
				break;
			default: {
				let t = JSON.stringify(e);
				throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`);
			}
		}
		if (t.schema instanceof Object) this.schema = t.schema;
		else if (n) this.schema = new Jt(Object.assign(n, t));
		else throw Error("With a null YAML version, the { schema: Schema } option is required");
	}
	toJS({ json: e, jsonArg: t, mapAsMap: n, maxAliasCount: r, onAnchor: i, reviver: a } = {}) {
		let o = {
			anchors: /* @__PURE__ */ new Map(),
			doc: this,
			keep: !e,
			mapAsMap: n === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof r == "number" ? r : 100
		}, s = V(this.contents, t ?? "", o);
		if (typeof i == "function") for (let { count: e, res: t } of o.anchors.values()) i(t, e);
		return typeof a == "function" ? B(a, { "": s }, "", s) : s;
	}
	toJSON(e, t) {
		return this.toJS({
			json: !0,
			jsonArg: e,
			mapAsMap: !1,
			onAnchor: t
		});
	}
	toString(e = {}) {
		if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
		if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
			let t = JSON.stringify(e.indent);
			throw Error(`"indent" option must be a positive integer, not ${t}`);
		}
		return Yt(this, e);
	}
};
function Zt(e) {
	if (C(e)) return !0;
	throw Error("Expected a YAML collection as document contents");
}
//#endregion
//#region node_modules/yaml/browser/dist/parse/cst-visit.js
var Qt = Symbol("break visit"), $t = Symbol("skip children"), en = Symbol("remove item");
function tn(e, t) {
	"type" in e && e.type === "document" && (e = {
		start: e.start,
		value: e.value
	}), nn(Object.freeze([]), e, t);
}
tn.BREAK = Qt, tn.SKIP = $t, tn.REMOVE = en, tn.itemAtPath = (e, t) => {
	let n = e;
	for (let [e, r] of t) {
		let t = n?.[e];
		if (t && "items" in t) n = t.items[r];
		else return;
	}
	return n;
}, tn.parentCollection = (e, t) => {
	let n = tn.itemAtPath(e, t.slice(0, -1)), r = t[t.length - 1][0], i = n?.[r];
	if (i && "items" in i) return i;
	throw Error("Parent collection not found");
};
function nn(e, t, n) {
	let r = n(t, e);
	if (typeof r == "symbol") return r;
	for (let i of ["key", "value"]) {
		let a = t[i];
		if (a && "items" in a) {
			for (let t = 0; t < a.items.length; ++t) {
				let r = nn(Object.freeze(e.concat([[i, t]])), a.items[t], n);
				if (typeof r == "number") t = r - 1;
				else if (r === Qt) return Qt;
				else r === en && (a.items.splice(t, 1), --t);
			}
			typeof r == "function" && i === "key" && (r = r(t, e));
		}
	}
	return typeof r == "function" ? r(t, e) : r;
}
//#endregion
//#region node_modules/yaml/browser/dist/public-api.js
function rn(e, t, n) {
	let r = null;
	if (typeof t == "function" || Array.isArray(t) ? r = t : n === void 0 && t && (n = t), typeof n == "string" && (n = n.length), typeof n == "number") {
		let e = Math.round(n);
		n = e < 1 ? void 0 : e > 8 ? { indent: 8 } : { indent: e };
	}
	if (e === void 0) {
		let { keepUndefined: e } = n ?? t ?? {};
		if (!e) return;
	}
	return v(e) && !r ? e.toString(n) : new Xt(e, r, n).toString(n);
}
//#endregion
//#region src/automation/graph.ts
var an = "light.turn_on", on = "scene.turn_on", sn = "notify.notify";
function cn(e, t, n = {}) {
	let r = {};
	if (e === "trigger") {
		let e = n.triggerType ?? "state";
		r.triggerType = e, e === "state" ? (r.entityId = "binary_sensor.hallway_motion", r.to = "on") : e === "time" ? r.at = "07:00:00" : (r.sunEvent = "sunrise", r.offset = "-00:30:00");
	}
	if (e === "condition") {
		let e = n.conditionType ?? "state";
		r.conditionType = e, e === "state" ? (r.entityId = "sun.sun", r.state = "below_horizon") : (r.after = "22:00:00", r.before = "06:00:00");
	}
	if (e === "action") {
		let e = n.actionType ?? "service";
		r.actionType = e, e === "scene" ? (r.service = on, r.entityId = "scene.movie_night") : e === "notify" ? (r.service = sn, r.message = "Someone is at the door") : (r.service = an, r.entityId = "light.living_room");
	}
	return e === "delay" && (r.duration = 3, r.unit = "minutes"), {
		id: a("node"),
		kind: e,
		label: ln(e, r),
		x: t.x,
		y: t.y,
		config: r
	};
}
function ln(e, t) {
	return e === "trigger" ? t.triggerType === "time" ? "Time schedule" : t.triggerType === "sun" ? "Sun event" : "State change" : e === "condition" ? t.conditionType === "time" ? "Time window" : "Entity state" : e === "action" ? t.actionType === "scene" ? "Run scene" : t.actionType === "notify" ? "Notification" : "Call service" : "Delay";
}
function un(e) {
	return e ? o(e) : "Entity";
}
function dn(e) {
	let t = e.config;
	if (e.kind === "trigger") {
		if (t.triggerType === "time") return t.at ? `At ${t.at}` : "At a set time";
		if (t.triggerType === "sun") {
			let e = t.sunEvent ?? "sunrise";
			return t.offset ? `${e} (${t.offset})` : e;
		}
		let e = un(t.entityId);
		return t.from && t.to ? `${e}: ${t.from} → ${t.to}` : t.to ? `${e} becomes ${t.to}` : t.from ? `${e} leaves ${t.from}` : `${e} changes`;
	}
	if (e.kind === "condition") return t.conditionType === "time" ? t.after && t.before ? `${t.after} – ${t.before}` : t.after ? `After ${t.after}` : t.before ? `Before ${t.before}` : "A time window" : `${un(t.entityId)} is ${t.state ?? "…"}`;
	if (e.kind === "action") {
		if (t.actionType === "scene") return `Activate ${un(t.entityId)}`;
		if (t.actionType === "notify") return t.message || "Send a notification";
		let e = t.entityId ? ` · ${un(t.entityId)}` : "";
		return `${t.service ?? an}${e}`;
	}
	let n = t.unit ?? "minutes";
	return `Wait ${t.duration ?? 1} ${n}`;
}
function fn(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = new Map(e.map((e) => [e.id, 0])), i = new Map(e.map((e) => [e.id, []]));
	for (let e of t) n.has(e.source) && n.has(e.target) && e.source !== e.target && (i.get(e.source)?.push(e.target), r.set(e.target, (r.get(e.target) ?? 0) + 1));
	let a = (e, t) => e.x - t.x || e.y - t.y || e.id.localeCompare(t.id), o = e.filter((e) => r.get(e.id) === 0).sort(a), s = [];
	for (; o.length > 0;) {
		let e = o.shift();
		if (!e) break;
		s.push(e.id);
		for (let t of i.get(e.id) ?? []) {
			let e = (r.get(t) ?? 1) - 1;
			if (r.set(t, e), e === 0) {
				let e = n.get(t);
				e && (o.push(e), o.sort(a));
			}
		}
	}
	let c = e.filter((e) => !s.includes(e.id)).sort(a);
	return [...s, ...c.map((e) => e.id)];
}
function pn(e, t, n) {
	let r = [t], i = /* @__PURE__ */ new Set();
	for (; r.length > 0;) {
		let t = r.pop();
		if (t && !i.has(t)) {
			if (t === n) return !0;
			i.add(t);
			for (let n of e) n.source === t && r.push(n.target);
		}
	}
	return !1;
}
function mn(e, t, n, r) {
	return n === r ? {
		edges: [...t],
		error: "A node cannot connect to itself."
	} : !e.some((e) => e.id === n) || !e.some((e) => e.id === r) ? {
		edges: [...t],
		error: "Both nodes must exist."
	} : t.some((e) => e.source === n && e.target === r) ? {
		edges: [...t],
		error: "Those nodes are already connected."
	} : pn(t, r, n) ? {
		edges: [...t],
		error: "That connection would create a loop."
	} : {
		edges: [...t, {
			id: a("edge"),
			source: n,
			target: r
		}],
		error: null
	};
}
function hn(e) {
	let t = [], n = e.nodes.filter((e) => e.kind === "trigger"), r = e.nodes.filter((e) => e.kind === "action" || e.kind === "delay");
	n.length === 0 && t.push("Add at least one trigger."), r.length === 0 && t.push("Add at least one action.");
	for (let n of e.nodes) {
		let e = n.config;
		n.kind === "trigger" && (e.triggerType === "time" && !e.at && t.push(`"${n.label}" needs a time.`), e.triggerType === "sun" && !e.sunEvent && t.push(`"${n.label}" needs a sun event.`), (e.triggerType ?? "state") === "state" && !e.entityId && t.push(`"${n.label}" needs an entity.`)), n.kind === "condition" && ((e.conditionType ?? "state") === "state" ? (e.entityId || t.push(`"${n.label}" needs an entity.`), e.state || t.push(`"${n.label}" needs a state.`)) : !e.after && !e.before && t.push(`"${n.label}" needs an after or before time.`)), n.kind === "action" && (e.actionType === "scene" && !e.entityId && t.push(`"${n.label}" needs a scene entity.`), e.actionType === "notify" && !e.message && t.push(`"${n.label}" needs a message.`), (e.actionType ?? "service") === "service" && (!e.service || !/^[a-z0-9_]+\.[a-z0-9_]+$/.test(e.service)) && t.push(`"${n.label}" needs a service such as light.turn_on.`)), n.kind === "delay" && (!e.duration || e.duration <= 0) && t.push(`"${n.label}" needs a duration above zero.`);
	}
	return t;
}
function gn(e) {
	let t = e.config;
	return t.triggerType === "time" ? {
		platform: "time",
		at: t.at
	} : t.triggerType === "sun" ? {
		platform: "sun",
		event: t.sunEvent ?? "sunrise",
		...t.offset ? { offset: t.offset } : {}
	} : {
		platform: "state",
		entity_id: t.entityId,
		...t.from ? { from: t.from } : {},
		...t.to ? { to: t.to } : {}
	};
}
function _n(e) {
	let t = e.config;
	return t.conditionType === "time" ? {
		condition: "time",
		...t.after ? { after: t.after } : {},
		...t.before ? { before: t.before } : {}
	} : {
		condition: "state",
		entity_id: t.entityId,
		state: t.state
	};
}
function vn(e) {
	let t = e.config;
	return e.kind === "delay" ? { delay: { [t.unit ?? "minutes"]: t.duration ?? 1 } } : t.actionType === "scene" ? {
		service: on,
		target: { entity_id: t.entityId }
	} : t.actionType === "notify" ? {
		service: t.service || sn,
		data: { message: t.message ?? "" }
	} : {
		service: t.service,
		...t.entityId ? { target: { entity_id: t.entityId } } : {}
	};
}
function yn(e) {
	let t = hn(e);
	if (t.length > 0) throw Error(t.join(" "));
	let n = new Map(e.nodes.map((e) => [e.id, e])), r = fn(e.nodes, e.edges).map((e) => n.get(e)).filter((e) => e !== void 0), i = r.filter((e) => e.kind === "trigger"), a = r.filter((e) => e.kind === "condition"), o = r.filter((e) => e.kind === "action" || e.kind === "delay");
	return {
		id: e.id,
		alias: e.name.trim() || "Untitled automation",
		...e.description.trim() ? { description: e.description.trim() } : {},
		mode: e.mode,
		trigger: i.map(gn),
		...a.length > 0 ? { condition: a.map(_n) } : {},
		action: o.map(vn)
	};
}
function bn(e) {
	return rn(yn(e), { lineWidth: 0 });
}
//#endregion
//#region src/automation/demo.ts
function xn() {
	return {
		id: "demo-motion-lights",
		name: "Hallway lights on motion",
		description: "Turn the living room lights on after sunset and off a few minutes later.",
		mode: "single",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		nodes: [
			{
				id: "motion-trigger",
				kind: "trigger",
				label: "Motion detected",
				x: 40,
				y: 70,
				config: {
					triggerType: "state",
					entityId: "binary_sensor.hallway_motion",
					to: "on"
				}
			},
			{
				id: "after-sunset",
				kind: "condition",
				label: "After sunset",
				x: 300,
				y: 70,
				config: {
					conditionType: "state",
					entityId: "sun.sun",
					state: "below_horizon"
				}
			},
			{
				id: "lights-on",
				kind: "action",
				label: "Turn on lights",
				x: 560,
				y: 70,
				config: {
					actionType: "service",
					service: "light.turn_on",
					entityId: "light.living_room"
				}
			},
			{
				id: "wait-a-bit",
				kind: "delay",
				label: "Wait 3 minutes",
				x: 560,
				y: 290,
				config: {
					duration: 3,
					unit: "minutes"
				}
			},
			{
				id: "lights-off",
				kind: "action",
				label: "Turn off lights",
				x: 300,
				y: 290,
				config: {
					actionType: "service",
					service: "light.turn_off",
					entityId: "light.living_room"
				}
			}
		],
		edges: [
			{
				id: "edge-motion-sunset",
				source: "motion-trigger",
				target: "after-sunset"
			},
			{
				id: "edge-sunset-on",
				source: "after-sunset",
				target: "lights-on"
			},
			{
				id: "edge-on-delay",
				source: "lights-on",
				target: "wait-a-bit"
			},
			{
				id: "edge-delay-off",
				source: "wait-a-bit",
				target: "lights-off"
			}
		]
	};
}
function Sn(e = "New automation") {
	let t = cn("trigger", {
		x: 60,
		y: 180
	}), n = cn("action", {
		x: 380,
		y: 180
	});
	return {
		id: a("automation"),
		name: e,
		description: "",
		mode: "single",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		nodes: [t, n],
		edges: [{
			id: a("edge"),
			source: t.id,
			target: n.id
		}]
	};
}
function Cn() {
	let e = xn();
	return {
		version: 1,
		automations: [e],
		activeId: e.id
	};
}
function wn(e) {
	let t = /* @__PURE__ */ new Map(), n = e.nodes.map((e) => {
		let n = a("node");
		return t.set(e.id, n), {
			...e,
			id: n,
			x: e.x + 40,
			y: e.y + 40
		};
	}), r = e.edges.flatMap((e) => {
		let n = t.get(e.source), r = t.get(e.target);
		return !n || !r ? [] : [{
			id: a("edge"),
			source: n,
			target: r
		}];
	});
	return {
		...e,
		id: a("automation"),
		name: `${e.name} copy`,
		nodes: n,
		edges: r,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
//#endregion
//#region src/automation/types.ts
var Tn = [
	"trigger",
	"condition",
	"action",
	"delay"
], En = [
	"state",
	"time",
	"sun"
], Dn = ["state", "time"], On = [
	"service",
	"scene",
	"notify"
], kn = [
	"seconds",
	"minutes",
	"hours"
], An = [
	"single",
	"restart",
	"queued",
	"parallel"
], jn = "dash.automations.v1";
function Mn(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Nn(e, t, n) {
	return typeof e == "string" ? e.slice(0, n) : t;
}
function Pn(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function Fn(e, t) {
	return typeof e != "number" || !Number.isFinite(e) ? t : Math.min(1e4, Math.max(-2e3, e));
}
function In(e) {
	if (!Mn(e)) return {};
	let t = {};
	e.triggerType !== void 0 && (t.triggerType = Pn(e.triggerType, En, "state")), e.conditionType !== void 0 && (t.conditionType = Pn(e.conditionType, Dn, "state")), e.actionType !== void 0 && (t.actionType = Pn(e.actionType, On, "service")), typeof e.entityId == "string" && e.entityId.trim() && (t.entityId = e.entityId.trim().slice(0, 120));
	for (let n of [
		"from",
		"to",
		"state",
		"at",
		"offset",
		"after",
		"before",
		"service",
		"message"
	]) typeof e[n] == "string" && (t[n] = e[n].slice(0, 300));
	return (e.sunEvent === "sunrise" || e.sunEvent === "sunset") && (t.sunEvent = e.sunEvent), typeof e.duration == "number" && Number.isFinite(e.duration) && (t.duration = Math.min(86400, Math.max(0, e.duration))), e.unit !== void 0 && (t.unit = Pn(e.unit, kn, "minutes")), t;
}
function Ln(e, t) {
	if (!Mn(e)) return null;
	let n = Pn(e.kind, Tn, "action"), r = typeof e.id == "string" && e.id.trim() ? e.id.trim().slice(0, 80) : a("node");
	return t.has(r) && (r = a("node")), t.add(r), {
		id: r,
		kind: n,
		label: Nn(e.label, "", 80),
		x: Fn(e.x, 0),
		y: Fn(e.y, 0),
		config: In(e.config)
	};
}
function Rn(e, t) {
	if (!Mn(e)) return null;
	let n = /* @__PURE__ */ new Set(), r = (Array.isArray(e.nodes) ? e.nodes.slice(0, 200) : []).map((e) => Ln(e, n)).filter((e) => e !== null), i = new Set(r.map((e) => e.id)), o = /* @__PURE__ */ new Set(), s = [], c = Array.isArray(e.edges) ? e.edges.slice(0, 400) : [];
	for (let e of c) {
		if (!Mn(e)) continue;
		let t = typeof e.source == "string" ? e.source : "", n = typeof e.target == "string" ? e.target : "";
		if (!i.has(t) || !i.has(n) || t === n) continue;
		let r = `${t}\u0000${n}`;
		o.has(r) || (o.add(r), s.push({
			id: a("edge"),
			source: t,
			target: n
		}));
	}
	return {
		id: typeof e.id == "string" && e.id.trim() ? e.id.trim().slice(0, 80) : a("automation"),
		name: Nn(e.name, `Automation ${t + 1}`, 80).trim() || `Automation ${t + 1}`,
		description: Nn(e.description, "", 300),
		mode: Pn(e.mode, An, "single"),
		nodes: r,
		edges: s,
		updatedAt: typeof e.updatedAt == "string" ? e.updatedAt.slice(0, 40) : (/* @__PURE__ */ new Date()).toISOString()
	};
}
function zn(e) {
	if (!Mn(e) || !Array.isArray(e.automations)) return Cn();
	let t = /* @__PURE__ */ new Set(), n = e.automations.slice(0, 50).map((e, n) => {
		let r = Rn(e, n);
		return r ? (t.has(r.id) && (r.id = a("automation")), t.add(r.id), r) : null;
	}).filter((e) => e !== null);
	return n.length === 0 ? Cn() : {
		version: 1,
		automations: n,
		activeId: typeof e.activeId == "string" && n.some((t) => t.id === e.activeId) ? e.activeId : n[0].id
	};
}
function Bn() {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}
function Vn(e = Bn()) {
	if (!e) return Cn();
	try {
		let t = e.getItem(jn);
		return t ? zn(JSON.parse(t)) : Cn();
	} catch {
		return Cn();
	}
}
function Hn(e, t = Bn()) {
	if (t) try {
		t.setItem(jn, JSON.stringify(e));
	} catch {}
}
//#endregion
//#region node_modules/classcat/index.js
var K = r();
function q(e) {
	if (typeof e == "string" || typeof e == "number") return "" + e;
	let t = "";
	if (Array.isArray(e)) for (let n = 0, r; n < e.length; n++) (r = q(e[n])) !== "" && (t += (t && " ") + r);
	else for (let n in e) e[n] && (t += (t && " ") + n);
	return t;
}
//#endregion
//#region node_modules/d3-dispatch/src/dispatch.js
var Un = { value: () => {} };
function Wn() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new Gn(n);
}
function Gn(e) {
	this._ = e;
}
function Kn(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
Gn.prototype = Wn.prototype = {
	constructor: Gn,
	on: function(e, t) {
		var n = this._, r = Kn(e + "", n), i, a = -1, o = r.length;
		if (arguments.length < 2) {
			for (; ++a < o;) if ((i = (e = r[a]).type) && (i = qn(n[i], e.name))) return i;
		} else {
			if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
			for (; ++a < o;) if (i = (e = r[a]).type) n[i] = Jn(n[i], e.name, t);
			else if (t == null) for (i in n) n[i] = Jn(n[i], e.name, null);
			return this;
		}
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new Gn(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function qn(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function Jn(e, t, n) {
	for (var r = 0, i = e.length; r < i; ++r) if (e[r].name === t) {
		e[r] = Un, e = e.slice(0, r).concat(e.slice(r + 1));
		break;
	}
	return n != null && e.push({
		name: t,
		value: n
	}), e;
}
var Yn = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region node_modules/d3-selection/src/namespace.js
function Xn(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Yn.hasOwnProperty(t) ? {
		space: Yn[t],
		local: e
	} : e;
}
//#endregion
//#region node_modules/d3-selection/src/creator.js
function Zn(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function Qn(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function $n(e) {
	var t = Xn(e);
	return (t.local ? Qn : Zn)(t);
}
//#endregion
//#region node_modules/d3-selection/src/selector.js
function er() {}
function tr(e) {
	return e == null ? er : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/select.js
function nr(e) {
	typeof e != "function" && (e = tr(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new J(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/array.js
function rr(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selectorAll.js
function ir() {
	return [];
}
function ar(e) {
	return e == null ? ir : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectAll.js
function or(e) {
	return function() {
		return rr(e.apply(this, arguments));
	};
}
function sr(e) {
	e = typeof e == "function" ? or(e) : ar(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new J(r, i);
}
//#endregion
//#region node_modules/d3-selection/src/matcher.js
function cr(e) {
	return function() {
		return this.matches(e);
	};
}
function lr(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChild.js
var ur = Array.prototype.find;
function dr(e) {
	return function() {
		return ur.call(this.children, e);
	};
}
function fr() {
	return this.firstElementChild;
}
function pr(e) {
	return this.select(e == null ? fr : dr(typeof e == "function" ? e : lr(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/selectChildren.js
var mr = Array.prototype.filter;
function hr() {
	return Array.from(this.children);
}
function gr(e) {
	return function() {
		return mr.call(this.children, e);
	};
}
function _r(e) {
	return this.selectAll(e == null ? hr : gr(typeof e == "function" ? e : lr(e)));
}
//#endregion
//#region node_modules/d3-selection/src/selection/filter.js
function vr(e) {
	typeof e != "function" && (e = cr(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new J(r, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/sparse.js
function yr(e) {
	return Array(e.length);
}
//#endregion
//#region node_modules/d3-selection/src/selection/enter.js
function br() {
	return new J(this._enter || this._groups.map(yr), this._parents);
}
function xr(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
xr.prototype = {
	constructor: xr,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region node_modules/d3-selection/src/constant.js
function Sr(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/d3-selection/src/selection/data.js
function Cr(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new xr(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function wr(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new xr(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function Tr(e) {
	return e.__data__;
}
function Er(e, t) {
	if (!arguments.length) return Array.from(this, Tr);
	var n = t ? wr : Cr, r = this._parents, i = this._groups;
	typeof e != "function" && (e = Sr(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = Dr(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new J(o, r), o._enter = s, o._exit = c, o;
}
function Dr(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region node_modules/d3-selection/src/selection/exit.js
function Or() {
	return new J(this._exit || this._groups.map(yr), this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/join.js
function kr(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region node_modules/d3-selection/src/selection/merge.js
function Ar(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new J(s, this._parents);
}
//#endregion
//#region node_modules/d3-selection/src/selection/order.js
function jr() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/sort.js
function Mr(e) {
	e ||= Nr;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new J(i, this._parents).order();
}
function Nr(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region node_modules/d3-selection/src/selection/call.js
function Pr() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/nodes.js
function Fr() {
	return Array.from(this);
}
//#endregion
//#region node_modules/d3-selection/src/selection/node.js
function Ir() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region node_modules/d3-selection/src/selection/size.js
function Lr() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/selection/empty.js
function Rr() {
	return !this.node();
}
//#endregion
//#region node_modules/d3-selection/src/selection/each.js
function zr(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region node_modules/d3-selection/src/selection/attr.js
function Br(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function Vr(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function Hr(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function Ur(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function Wr(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function Gr(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function Kr(e, t) {
	var n = Xn(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? Vr : Br : typeof t == "function" ? n.local ? Gr : Wr : n.local ? Ur : Hr)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/window.js
function qr(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region node_modules/d3-selection/src/selection/style.js
function Jr(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Yr(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function Xr(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function Zr(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? Jr : typeof t == "function" ? Xr : Yr)(e, t, n ?? "")) : Qr(this.node(), e);
}
function Qr(e, t) {
	return e.style.getPropertyValue(t) || qr(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region node_modules/d3-selection/src/selection/property.js
function $r(e) {
	return function() {
		delete this[e];
	};
}
function ei(e, t) {
	return function() {
		this[e] = t;
	};
}
function ti(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function ni(e, t) {
	return arguments.length > 1 ? this.each((t == null ? $r : typeof t == "function" ? ti : ei)(e, t)) : this.node()[e];
}
//#endregion
//#region node_modules/d3-selection/src/selection/classed.js
function ri(e) {
	return e.trim().split(/^|\s+/);
}
function ii(e) {
	return e.classList || new ai(e);
}
function ai(e) {
	this._node = e, this._names = ri(e.getAttribute("class") || "");
}
ai.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function oi(e, t) {
	for (var n = ii(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function si(e, t) {
	for (var n = ii(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function ci(e) {
	return function() {
		oi(this, e);
	};
}
function li(e) {
	return function() {
		si(this, e);
	};
}
function ui(e, t) {
	return function() {
		(t.apply(this, arguments) ? oi : si)(this, e);
	};
}
function di(e, t) {
	var n = ri(e + "");
	if (arguments.length < 2) {
		for (var r = ii(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? ui : t ? ci : li)(n, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/text.js
function fi() {
	this.textContent = "";
}
function pi(e) {
	return function() {
		this.textContent = e;
	};
}
function mi(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function hi(e) {
	return arguments.length ? this.each(e == null ? fi : (typeof e == "function" ? mi : pi)(e)) : this.node().textContent;
}
//#endregion
//#region node_modules/d3-selection/src/selection/html.js
function gi() {
	this.innerHTML = "";
}
function _i(e) {
	return function() {
		this.innerHTML = e;
	};
}
function vi(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function yi(e) {
	return arguments.length ? this.each(e == null ? gi : (typeof e == "function" ? vi : _i)(e)) : this.node().innerHTML;
}
//#endregion
//#region node_modules/d3-selection/src/selection/raise.js
function bi() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function xi() {
	return this.each(bi);
}
//#endregion
//#region node_modules/d3-selection/src/selection/lower.js
function Si() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Ci() {
	return this.each(Si);
}
//#endregion
//#region node_modules/d3-selection/src/selection/append.js
function wi(e) {
	var t = typeof e == "function" ? e : $n(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/insert.js
function Ti() {
	return null;
}
function Ei(e, t) {
	var n = typeof e == "function" ? e : $n(e), r = t == null ? Ti : typeof t == "function" ? t : tr(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region node_modules/d3-selection/src/selection/remove.js
function Di() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function Oi() {
	return this.each(Di);
}
//#endregion
//#region node_modules/d3-selection/src/selection/clone.js
function ki() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ai() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function ji(e) {
	return this.select(e ? Ai : ki);
}
//#endregion
//#region node_modules/d3-selection/src/selection/datum.js
function Mi(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region node_modules/d3-selection/src/selection/on.js
function Ni(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function Pi(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function Fi(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function Ii(e, t, n) {
	return function() {
		var r = this.__on, i, a = Ni(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function Li(e, t, n) {
	var r = Pi(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
	} else {
		for (s = t ? Ii : Fi, i = 0; i < a; ++i) this.each(s(r[i], t, n));
		return this;
	}
}
//#endregion
//#region node_modules/d3-selection/src/selection/dispatch.js
function Ri(e, t, n) {
	var r = qr(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function zi(e, t) {
	return function() {
		return Ri(this, e, t);
	};
}
function Bi(e, t) {
	return function() {
		return Ri(this, e, t.apply(this, arguments));
	};
}
function Vi(e, t) {
	return this.each((typeof t == "function" ? Bi : zi)(e, t));
}
//#endregion
//#region node_modules/d3-selection/src/selection/iterator.js
function* Hi() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region node_modules/d3-selection/src/selection/index.js
var Ui = [null];
function J(e, t) {
	this._groups = e, this._parents = t;
}
function Wi() {
	return new J([[document.documentElement]], Ui);
}
function Gi() {
	return this;
}
J.prototype = Wi.prototype = {
	constructor: J,
	select: nr,
	selectAll: sr,
	selectChild: pr,
	selectChildren: _r,
	filter: vr,
	data: Er,
	enter: br,
	exit: Or,
	join: kr,
	merge: Ar,
	selection: Gi,
	order: jr,
	sort: Mr,
	call: Pr,
	nodes: Fr,
	node: Ir,
	size: Lr,
	empty: Rr,
	each: zr,
	attr: Kr,
	style: Zr,
	property: ni,
	classed: di,
	text: hi,
	html: yi,
	raise: xi,
	lower: Ci,
	append: wi,
	insert: Ei,
	remove: Oi,
	clone: ji,
	datum: Mi,
	on: Li,
	dispatch: Vi,
	[Symbol.iterator]: Hi
};
//#endregion
//#region node_modules/d3-selection/src/select.js
function Ki(e) {
	return typeof e == "string" ? new J([[document.querySelector(e)]], [document.documentElement]) : new J([[e]], Ui);
}
//#endregion
//#region node_modules/d3-selection/src/sourceEvent.js
function qi(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region node_modules/d3-selection/src/pointer.js
function Ji(e, t) {
	if (e = qi(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
//#endregion
//#region node_modules/d3-drag/src/noevent.js
var Yi = { passive: !1 }, Xi = {
	capture: !0,
	passive: !1
};
function Zi(e) {
	e.stopImmediatePropagation();
}
function Qi(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-drag/src/nodrag.js
function $i(e) {
	var t = e.document.documentElement, n = Ki(e).on("dragstart.drag", Qi, Xi);
	"onselectstart" in t ? n.on("selectstart.drag", Qi, Xi) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function ea(e, t) {
	var n = e.document.documentElement, r = Ki(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Qi, Xi), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region node_modules/d3-drag/src/constant.js
var ta = (e) => () => e;
//#endregion
//#region node_modules/d3-drag/src/event.js
function na(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		subject: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		identifier: {
			value: i,
			enumerable: !0,
			configurable: !0
		},
		active: {
			value: a,
			enumerable: !0,
			configurable: !0
		},
		x: {
			value: o,
			enumerable: !0,
			configurable: !0
		},
		y: {
			value: s,
			enumerable: !0,
			configurable: !0
		},
		dx: {
			value: c,
			enumerable: !0,
			configurable: !0
		},
		dy: {
			value: l,
			enumerable: !0,
			configurable: !0
		},
		_: { value: u }
	});
}
na.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region node_modules/d3-drag/src/drag.js
function ra(e) {
	return !e.ctrlKey && !e.button;
}
function ia() {
	return this.parentNode;
}
function aa(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function oa() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function sa() {
	var e = ra, t = ia, n = aa, r = oa, i = {}, a = Wn("start", "drag", "end"), o = 0, s, c, l, u, d = 0;
	function f(e) {
		e.on("mousedown.drag", p).filter(r).on("touchstart.drag", g).on("touchmove.drag", _, Yi).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function p(n, r) {
		if (!u && e.call(this, n, r)) {
			var i = y(this, t.call(this, n, r), n, r, "mouse");
			i && (Ki(n.view).on("mousemove.drag", m, Xi).on("mouseup.drag", h, Xi), $i(n.view), Zi(n), l = !1, s = n.clientX, c = n.clientY, i("start", n));
		}
	}
	function m(e) {
		if (Qi(e), !l) {
			var t = e.clientX - s, n = e.clientY - c;
			l = t * t + n * n > d;
		}
		i.mouse("drag", e);
	}
	function h(e) {
		Ki(e.view).on("mousemove.drag mouseup.drag", null), ea(e.view, l), Qi(e), i.mouse("end", e);
	}
	function g(n, r) {
		if (e.call(this, n, r)) for (var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s = 0, c; s < o; ++s) (c = y(this, a, n, r, i[s].identifier, i[s])) && (Zi(n), c("start", n, i[s]));
	}
	function _(e) {
		for (var t = e.changedTouches, n = t.length, r = 0, a; r < n; ++r) (a = i[t[r].identifier]) && (Qi(e), a("drag", e, t[r]));
	}
	function v(e) {
		var t = e.changedTouches, n = t.length, r, a;
		for (u && clearTimeout(u), u = setTimeout(function() {
			u = null;
		}, 500), r = 0; r < n; ++r) (a = i[t[r].identifier]) && (Zi(e), a("end", e, t[r]));
	}
	function y(e, t, r, s, c, l) {
		var u = a.copy(), d = Ji(l || r, t), p, m, h;
		if ((h = n.call(e, new na("beforestart", {
			sourceEvent: r,
			target: f,
			identifier: c,
			active: o,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), s)) != null) return p = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, a, l) {
			var g = d, _;
			switch (r) {
				case "start":
					i[c] = n, _ = o++;
					break;
				case "end": delete i[c], --o;
				case "drag": d = Ji(l || a, t), _ = o;
			}
			u.call(r, e, new na(r, {
				sourceEvent: a,
				subject: h,
				target: f,
				identifier: c,
				active: _,
				x: d[0] + p,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), s);
		};
	}
	return f.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : ta(!!t), f) : e;
	}, f.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : ta(e), f) : t;
	}, f.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : ta(e), f) : n;
	}, f.touchable = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : ta(!!e), f) : r;
	}, f.on = function() {
		var e = a.on.apply(a, arguments);
		return e === a ? f : e;
	}, f.clickDistance = function(e) {
		return arguments.length ? (d = (e = +e) * e, f) : Math.sqrt(d);
	}, f;
}
//#endregion
//#region node_modules/d3-color/src/define.js
function ca(e, t, n) {
	e.prototype = t.prototype = n, n.constructor = e;
}
function la(e, t) {
	var n = Object.create(e.prototype);
	for (var r in t) n[r] = t[r];
	return n;
}
//#endregion
//#region node_modules/d3-color/src/color.js
function ua() {}
var da = .7, fa = 1 / da, pa = "\\s*([+-]?\\d+)\\s*", ma = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ha = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", ga = /^#([0-9a-f]{3,8})$/, _a = RegExp(`^rgb\\(${pa},${pa},${pa}\\)$`), va = RegExp(`^rgb\\(${ha},${ha},${ha}\\)$`), ya = RegExp(`^rgba\\(${pa},${pa},${pa},${ma}\\)$`), ba = RegExp(`^rgba\\(${ha},${ha},${ha},${ma}\\)$`), xa = RegExp(`^hsl\\(${ma},${ha},${ha}\\)$`), Sa = RegExp(`^hsla\\(${ma},${ha},${ha},${ma}\\)$`), Ca = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
};
ca(ua, Oa, {
	copy(e) {
		return Object.assign(new this.constructor(), this, e);
	},
	displayable() {
		return this.rgb().displayable();
	},
	hex: wa,
	formatHex: wa,
	formatHex8: Ta,
	formatHsl: Ea,
	formatRgb: Da,
	toString: Da
});
function wa() {
	return this.rgb().formatHex();
}
function Ta() {
	return this.rgb().formatHex8();
}
function Ea() {
	return Ba(this).formatHsl();
}
function Da() {
	return this.rgb().formatRgb();
}
function Oa(e) {
	var t, n;
	return e = (e + "").trim().toLowerCase(), (t = ga.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? ka(t) : n === 3 ? new Y(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Aa(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Aa(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = _a.exec(e)) ? new Y(t[1], t[2], t[3], 1) : (t = va.exec(e)) ? new Y(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = ya.exec(e)) ? Aa(t[1], t[2], t[3], t[4]) : (t = ba.exec(e)) ? Aa(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = xa.exec(e)) ? za(t[1], t[2] / 100, t[3] / 100, 1) : (t = Sa.exec(e)) ? za(t[1], t[2] / 100, t[3] / 100, t[4]) : Ca.hasOwnProperty(e) ? ka(Ca[e]) : e === "transparent" ? new Y(NaN, NaN, NaN, 0) : null;
}
function ka(e) {
	return new Y(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Aa(e, t, n, r) {
	return r <= 0 && (e = t = n = NaN), new Y(e, t, n, r);
}
function ja(e) {
	return e instanceof ua || (e = Oa(e)), e ? (e = e.rgb(), new Y(e.r, e.g, e.b, e.opacity)) : new Y();
}
function Ma(e, t, n, r) {
	return arguments.length === 1 ? ja(e) : new Y(e, t, n, r ?? 1);
}
function Y(e, t, n, r) {
	this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
ca(Y, Ma, la(ua, {
	brighter(e) {
		return e = e == null ? fa : fa ** +e, new Y(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? da : da ** +e, new Y(this.r * e, this.g * e, this.b * e, this.opacity);
	},
	rgb() {
		return this;
	},
	clamp() {
		return new Y(La(this.r), La(this.g), La(this.b), Ia(this.opacity));
	},
	displayable() {
		return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
	},
	hex: Na,
	formatHex: Na,
	formatHex8: Pa,
	formatRgb: Fa,
	toString: Fa
}));
function Na() {
	return `#${Ra(this.r)}${Ra(this.g)}${Ra(this.b)}`;
}
function Pa() {
	return `#${Ra(this.r)}${Ra(this.g)}${Ra(this.b)}${Ra((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Fa() {
	let e = Ia(this.opacity);
	return `${e === 1 ? "rgb(" : "rgba("}${La(this.r)}, ${La(this.g)}, ${La(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Ia(e) {
	return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function La(e) {
	return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ra(e) {
	return e = La(e), (e < 16 ? "0" : "") + e.toString(16);
}
function za(e, t, n, r) {
	return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ha(e, t, n, r);
}
function Ba(e) {
	if (e instanceof Ha) return new Ha(e.h, e.s, e.l, e.opacity);
	if (e instanceof ua || (e = Oa(e)), !e) return new Ha();
	if (e instanceof Ha) return e;
	e = e.rgb();
	var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), a = Math.max(t, n, r), o = NaN, s = a - i, c = (a + i) / 2;
	return s ? (o = t === a ? (n - r) / s + (n < r) * 6 : n === a ? (r - t) / s + 2 : (t - n) / s + 4, s /= c < .5 ? a + i : 2 - a - i, o *= 60) : s = c > 0 && c < 1 ? 0 : o, new Ha(o, s, c, e.opacity);
}
function Va(e, t, n, r) {
	return arguments.length === 1 ? Ba(e) : new Ha(e, t, n, r ?? 1);
}
function Ha(e, t, n, r) {
	this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
ca(Ha, Va, la(ua, {
	brighter(e) {
		return e = e == null ? fa : fa ** +e, new Ha(this.h, this.s, this.l * e, this.opacity);
	},
	darker(e) {
		return e = e == null ? da : da ** +e, new Ha(this.h, this.s, this.l * e, this.opacity);
	},
	rgb() {
		var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < .5 ? n : 1 - n) * t, i = 2 * n - r;
		return new Y(Ga(e >= 240 ? e - 240 : e + 120, i, r), Ga(e, i, r), Ga(e < 120 ? e + 240 : e - 120, i, r), this.opacity);
	},
	clamp() {
		return new Ha(Ua(this.h), Wa(this.s), Wa(this.l), Ia(this.opacity));
	},
	displayable() {
		return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
	},
	formatHsl() {
		let e = Ia(this.opacity);
		return `${e === 1 ? "hsl(" : "hsla("}${Ua(this.h)}, ${Wa(this.s) * 100}%, ${Wa(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
	}
}));
function Ua(e) {
	return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Wa(e) {
	return Math.max(0, Math.min(1, e || 0));
}
function Ga(e, t, n) {
	return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
//#endregion
//#region node_modules/d3-interpolate/src/constant.js
var Ka = (e) => () => e;
//#endregion
//#region node_modules/d3-interpolate/src/color.js
function qa(e, t) {
	return function(n) {
		return e + n * t;
	};
}
function Ja(e, t, n) {
	return e **= +n, t = t ** +n - e, n = 1 / n, function(r) {
		return (e + r * t) ** +n;
	};
}
function Ya(e) {
	return (e = +e) == 1 ? Xa : function(t, n) {
		return n - t ? Ja(t, n, e) : Ka(isNaN(t) ? n : t);
	};
}
function Xa(e, t) {
	var n = t - e;
	return n ? qa(e, n) : Ka(isNaN(e) ? t : e);
}
//#endregion
//#region node_modules/d3-interpolate/src/rgb.js
var Za = (function e(t) {
	var n = Ya(t);
	function r(e, t) {
		var r = n((e = Ma(e)).r, (t = Ma(t)).r), i = n(e.g, t.g), a = n(e.b, t.b), o = Xa(e.opacity, t.opacity);
		return function(t) {
			return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + "";
		};
	}
	return r.gamma = e, r;
})(1);
//#endregion
//#region node_modules/d3-interpolate/src/numberArray.js
function Qa(e, t) {
	t ||= [];
	var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
	return function(a) {
		for (i = 0; i < n; ++i) r[i] = e[i] * (1 - a) + t[i] * a;
		return r;
	};
}
function $a(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
//#endregion
//#region node_modules/d3-interpolate/src/array.js
function eo(e, t) {
	for (var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = Array(r), a = Array(n), o = 0; o < r; ++o) i[o] = lo(e[o], t[o]);
	for (; o < n; ++o) a[o] = t[o];
	return function(e) {
		for (o = 0; o < r; ++o) a[o] = i[o](e);
		return a;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/date.js
function to(e, t) {
	var n = /* @__PURE__ */ new Date();
	return e = +e, t = +t, function(r) {
		return n.setTime(e * (1 - r) + t * r), n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/number.js
function no(e, t) {
	return e = +e, t = +t, function(n) {
		return e * (1 - n) + t * n;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/object.js
function ro(e, t) {
	var n = {}, r = {}, i;
	for (i in (typeof e != "object" || !e) && (e = {}), (typeof t != "object" || !t) && (t = {}), t) i in e ? n[i] = lo(e[i], t[i]) : r[i] = t[i];
	return function(e) {
		for (i in n) r[i] = n[i](e);
		return r;
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/string.js
var io = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ao = new RegExp(io.source, "g");
function oo(e) {
	return function() {
		return e;
	};
}
function so(e) {
	return function(t) {
		return e(t) + "";
	};
}
function co(e, t) {
	var n = io.lastIndex = ao.lastIndex = 0, r, i, a, o = -1, s = [], c = [];
	for (e += "", t += ""; (r = io.exec(e)) && (i = ao.exec(t));) (a = i.index) > n && (a = t.slice(n, a), s[o] ? s[o] += a : s[++o] = a), (r = r[0]) === (i = i[0]) ? s[o] ? s[o] += i : s[++o] = i : (s[++o] = null, c.push({
		i: o,
		x: no(r, i)
	})), n = ao.lastIndex;
	return n < t.length && (a = t.slice(n), s[o] ? s[o] += a : s[++o] = a), s.length < 2 ? c[0] ? so(c[0].x) : oo(t) : (t = c.length, function(e) {
		for (var n = 0, r; n < t; ++n) s[(r = c[n]).i] = r.x(e);
		return s.join("");
	});
}
//#endregion
//#region node_modules/d3-interpolate/src/value.js
function lo(e, t) {
	var n = typeof t, r;
	return t == null || n === "boolean" ? Ka(t) : (n === "number" ? no : n === "string" ? (r = Oa(t)) ? (t = r, Za) : co : t instanceof Oa ? Za : t instanceof Date ? to : $a(t) ? Qa : Array.isArray(t) ? eo : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? ro : no)(e, t);
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/decompose.js
var uo = 180 / Math.PI, fo = {
	translateX: 0,
	translateY: 0,
	rotate: 0,
	skewX: 0,
	scaleX: 1,
	scaleY: 1
};
function po(e, t, n, r, i, a) {
	var o, s, c;
	return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (c = e * n + t * r) && (n -= e * c, r -= t * c), (s = Math.sqrt(n * n + r * r)) && (n /= s, r /= s, c /= s), e * r < t * n && (e = -e, t = -t, c = -c, o = -o), {
		translateX: i,
		translateY: a,
		rotate: Math.atan2(t, e) * uo,
		skewX: Math.atan(c) * uo,
		scaleX: o,
		scaleY: s
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/parse.js
var mo;
function ho(e) {
	let t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
	return t.isIdentity ? fo : po(t.a, t.b, t.c, t.d, t.e, t.f);
}
function go(e) {
	return e == null || (mo ||= document.createElementNS("http://www.w3.org/2000/svg", "g"), mo.setAttribute("transform", e), !(e = mo.transform.baseVal.consolidate())) ? fo : (e = e.matrix, po(e.a, e.b, e.c, e.d, e.e, e.f));
}
//#endregion
//#region node_modules/d3-interpolate/src/transform/index.js
function _o(e, t, n, r) {
	function i(e) {
		return e.length ? e.pop() + " " : "";
	}
	function a(e, r, i, a, o, s) {
		if (e !== i || r !== a) {
			var c = o.push("translate(", null, t, null, n);
			s.push({
				i: c - 4,
				x: no(e, i)
			}, {
				i: c - 2,
				x: no(r, a)
			});
		} else (i || a) && o.push("translate(" + i + t + a + n);
	}
	function o(e, t, n, a) {
		e === t ? t && n.push(i(n) + "rotate(" + t + r) : (e - t > 180 ? t += 360 : t - e > 180 && (e += 360), a.push({
			i: n.push(i(n) + "rotate(", null, r) - 2,
			x: no(e, t)
		}));
	}
	function s(e, t, n, a) {
		e === t ? t && n.push(i(n) + "skewX(" + t + r) : a.push({
			i: n.push(i(n) + "skewX(", null, r) - 2,
			x: no(e, t)
		});
	}
	function c(e, t, n, r, a, o) {
		if (e !== n || t !== r) {
			var s = a.push(i(a) + "scale(", null, ",", null, ")");
			o.push({
				i: s - 4,
				x: no(e, n)
			}, {
				i: s - 2,
				x: no(t, r)
			});
		} else (n !== 1 || r !== 1) && a.push(i(a) + "scale(" + n + "," + r + ")");
	}
	return function(t, n) {
		var r = [], i = [];
		return t = e(t), n = e(n), a(t.translateX, t.translateY, n.translateX, n.translateY, r, i), o(t.rotate, n.rotate, r, i), s(t.skewX, n.skewX, r, i), c(t.scaleX, t.scaleY, n.scaleX, n.scaleY, r, i), t = n = null, function(e) {
			for (var t = -1, n = i.length, a; ++t < n;) r[(a = i[t]).i] = a.x(e);
			return r.join("");
		};
	};
}
var vo = _o(ho, "px, ", "px)", "deg)"), yo = _o(go, ", ", ")", ")"), bo = 1e-12;
function xo(e) {
	return ((e = Math.exp(e)) + 1 / e) / 2;
}
function So(e) {
	return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Co(e) {
	return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
var wo = (function e(t, n, r) {
	function i(e, i) {
		var a = e[0], o = e[1], s = e[2], c = i[0], l = i[1], u = i[2], d = c - a, f = l - o, p = d * d + f * f, m, h;
		if (p < bo) h = Math.log(u / s) / t, m = function(e) {
			return [
				a + e * d,
				o + e * f,
				s * Math.exp(t * e * h)
			];
		};
		else {
			var g = Math.sqrt(p), _ = (u * u - s * s + r * p) / (2 * s * n * g), v = (u * u - s * s - r * p) / (2 * u * n * g), y = Math.log(Math.sqrt(_ * _ + 1) - _);
			h = (Math.log(Math.sqrt(v * v + 1) - v) - y) / t, m = function(e) {
				var r = e * h, i = xo(y), c = s / (n * g) * (i * Co(t * r + y) - So(y));
				return [
					a + c * d,
					o + c * f,
					s * i / xo(t * r + y)
				];
			};
		}
		return m.duration = h * 1e3 * t / Math.SQRT2, m;
	}
	return i.rho = function(t) {
		var n = Math.max(.001, +t), r = n * n;
		return e(n, r, r * r);
	}, i;
})(Math.SQRT2, 2, 4), To = 0, Eo = 0, Do = 0, Oo = 1e3, ko, Ao, jo = 0, Mo = 0, No = 0, Po = typeof performance == "object" && performance.now ? performance : Date, Fo = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
	setTimeout(e, 17);
};
function Io() {
	return Mo ||= (Fo(Lo), Po.now() + No);
}
function Lo() {
	Mo = 0;
}
function Ro() {
	this._call = this._time = this._next = null;
}
Ro.prototype = zo.prototype = {
	constructor: Ro,
	restart: function(e, t, n) {
		if (typeof e != "function") throw TypeError("callback is not a function");
		n = (n == null ? Io() : +n) + (t == null ? 0 : +t), !this._next && Ao !== this && (Ao ? Ao._next = this : ko = this, Ao = this), this._call = e, this._time = n, Wo();
	},
	stop: function() {
		this._call && (this._call = null, this._time = Infinity, Wo());
	}
};
function zo(e, t, n) {
	var r = new Ro();
	return r.restart(e, t, n), r;
}
function Bo() {
	Io(), ++To;
	for (var e = ko, t; e;) (t = Mo - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
	--To;
}
function Vo() {
	Mo = (jo = Po.now()) + No, To = Eo = 0;
	try {
		Bo();
	} finally {
		To = 0, Uo(), Mo = 0;
	}
}
function Ho() {
	var e = Po.now(), t = e - jo;
	t > Oo && (No -= t, jo = e);
}
function Uo() {
	for (var e, t = ko, n, r = Infinity; t;) t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : ko = n);
	Ao = e, Wo(r);
}
function Wo(e) {
	To || (Eo &&= clearTimeout(Eo), e - Mo > 24 ? (e < Infinity && (Eo = setTimeout(Vo, e - Po.now() - No)), Do &&= clearInterval(Do)) : (Do ||= (jo = Po.now(), setInterval(Ho, Oo)), To = 1, Fo(Vo)));
}
//#endregion
//#region node_modules/d3-timer/src/timeout.js
function Go(e, t, n) {
	var r = new Ro();
	return t = t == null ? 0 : +t, r.restart((n) => {
		r.stop(), e(n + t);
	}, t, n), r;
}
//#endregion
//#region node_modules/d3-transition/src/transition/schedule.js
var Ko = Wn("start", "end", "cancel", "interrupt"), qo = [];
function Jo(e, t, n, r, i, a) {
	var o = e.__transition;
	if (!o) e.__transition = {};
	else if (n in o) return;
	Qo(e, n, {
		name: t,
		index: r,
		group: i,
		on: Ko,
		tween: qo,
		time: a.time,
		delay: a.delay,
		duration: a.duration,
		ease: a.ease,
		timer: null,
		state: 0
	});
}
function Yo(e, t) {
	var n = Zo(e, t);
	if (n.state > 0) throw Error("too late; already scheduled");
	return n;
}
function Xo(e, t) {
	var n = Zo(e, t);
	if (n.state > 3) throw Error("too late; already running");
	return n;
}
function Zo(e, t) {
	var n = e.__transition;
	if (!n || !(n = n[t])) throw Error("transition not found");
	return n;
}
function Qo(e, t, n) {
	var r = e.__transition, i;
	r[t] = n, n.timer = zo(a, 0, n.time);
	function a(e) {
		n.state = 1, n.timer.restart(o, n.delay, n.time), n.delay <= e && o(e - n.delay);
	}
	function o(a) {
		var l, u, d, f;
		if (n.state !== 1) return c();
		for (l in r) if (f = r[l], f.name === n.name) {
			if (f.state === 3) return Go(o);
			f.state === 4 ? (f.state = 6, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete r[l]) : +l < t && (f.state = 6, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete r[l]);
		}
		if (Go(function() {
			n.state === 3 && (n.state = 4, n.timer.restart(s, n.delay, n.time), s(a));
		}), n.state = 2, n.on.call("start", e, e.__data__, n.index, n.group), n.state === 2) {
			for (n.state = 3, i = Array(d = n.tween.length), l = 0, u = -1; l < d; ++l) (f = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = f);
			i.length = u + 1;
		}
	}
	function s(t) {
		for (var r = t < n.duration ? n.ease.call(null, t / n.duration) : (n.timer.restart(c), n.state = 5, 1), a = -1, o = i.length; ++a < o;) i[a].call(e, r);
		n.state === 5 && (n.on.call("end", e, e.__data__, n.index, n.group), c());
	}
	function c() {
		for (var i in n.state = 6, n.timer.stop(), delete r[t], r) return;
		delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/interrupt.js
function $o(e, t) {
	var n = e.__transition, r, i, a = !0, o;
	if (n) {
		for (o in t = t == null ? null : t + "", n) (r = n[o]).name === t ? (i = r.state > 2 && r.state < 5, r.state = 6, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[o]) : a = !1;
		a && delete e.__transition;
	}
}
//#endregion
//#region node_modules/d3-transition/src/selection/interrupt.js
function es(e) {
	return this.each(function() {
		$o(this, e);
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/tween.js
function ts(e, t) {
	var n, r;
	return function() {
		var i = Xo(this, e), a = i.tween;
		if (a !== n) {
			r = n = a;
			for (var o = 0, s = r.length; o < s; ++o) if (r[o].name === t) {
				r = r.slice(), r.splice(o, 1);
				break;
			}
		}
		i.tween = r;
	};
}
function ns(e, t, n) {
	var r, i;
	if (typeof n != "function") throw Error();
	return function() {
		var a = Xo(this, e), o = a.tween;
		if (o !== r) {
			i = (r = o).slice();
			for (var s = {
				name: t,
				value: n
			}, c = 0, l = i.length; c < l; ++c) if (i[c].name === t) {
				i[c] = s;
				break;
			}
			c === l && i.push(s);
		}
		a.tween = i;
	};
}
function rs(e, t) {
	var n = this._id;
	if (e += "", arguments.length < 2) {
		for (var r = Zo(this.node(), n).tween, i = 0, a = r.length, o; i < a; ++i) if ((o = r[i]).name === e) return o.value;
		return null;
	}
	return this.each((t == null ? ts : ns)(n, e, t));
}
function is(e, t, n) {
	var r = e._id;
	return e.each(function() {
		var e = Xo(this, r);
		(e.value ||= {})[t] = n.apply(this, arguments);
	}), function(e) {
		return Zo(e, r).value[t];
	};
}
//#endregion
//#region node_modules/d3-transition/src/transition/interpolate.js
function as(e, t) {
	var n;
	return (typeof t == "number" ? no : t instanceof Oa ? Za : (n = Oa(t)) ? (t = n, Za) : co)(e, t);
}
//#endregion
//#region node_modules/d3-transition/src/transition/attr.js
function os(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function ss(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function cs(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttribute(e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function ls(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = this.getAttributeNS(e.space, e.local);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function us(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttribute(e) : (o = this.getAttribute(e), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function ds(e, t, n) {
	var r, i, a;
	return function() {
		var o, s = n(this), c;
		return s == null ? void this.removeAttributeNS(e.space, e.local) : (o = this.getAttributeNS(e.space, e.local), c = s + "", o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s)));
	};
}
function fs(e, t) {
	var n = Xn(e), r = n === "transform" ? yo : as;
	return this.attrTween(e, typeof t == "function" ? (n.local ? ds : us)(n, r, is(this, "attr." + e, t)) : t == null ? (n.local ? ss : os)(n) : (n.local ? ls : cs)(n, r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/attrTween.js
function ps(e, t) {
	return function(n) {
		this.setAttribute(e, t.call(this, n));
	};
}
function ms(e, t) {
	return function(n) {
		this.setAttributeNS(e.space, e.local, t.call(this, n));
	};
}
function hs(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ms(e, i)), n;
	}
	return i._value = t, i;
}
function gs(e, t) {
	var n, r;
	function i() {
		var i = t.apply(this, arguments);
		return i !== r && (n = (r = i) && ps(e, i)), n;
	}
	return i._value = t, i;
}
function _s(e, t) {
	var n = "attr." + e;
	if (arguments.length < 2) return (n = this.tween(n)) && n._value;
	if (t == null) return this.tween(n, null);
	if (typeof t != "function") throw Error();
	var r = Xn(e);
	return this.tween(n, (r.local ? hs : gs)(r, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/delay.js
function vs(e, t) {
	return function() {
		Yo(this, e).delay = +t.apply(this, arguments);
	};
}
function ys(e, t) {
	return t = +t, function() {
		Yo(this, e).delay = t;
	};
}
function bs(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? vs : ys)(t, e)) : Zo(this.node(), t).delay;
}
//#endregion
//#region node_modules/d3-transition/src/transition/duration.js
function xs(e, t) {
	return function() {
		Xo(this, e).duration = +t.apply(this, arguments);
	};
}
function Ss(e, t) {
	return t = +t, function() {
		Xo(this, e).duration = t;
	};
}
function Cs(e) {
	var t = this._id;
	return arguments.length ? this.each((typeof e == "function" ? xs : Ss)(t, e)) : Zo(this.node(), t).duration;
}
//#endregion
//#region node_modules/d3-transition/src/transition/ease.js
function ws(e, t) {
	if (typeof t != "function") throw Error();
	return function() {
		Xo(this, e).ease = t;
	};
}
function Ts(e) {
	var t = this._id;
	return arguments.length ? this.each(ws(t, e)) : Zo(this.node(), t).ease;
}
//#endregion
//#region node_modules/d3-transition/src/transition/easeVarying.js
function Es(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		if (typeof n != "function") throw Error();
		Xo(this, e).ease = n;
	};
}
function Ds(e) {
	if (typeof e != "function") throw Error();
	return this.each(Es(this._id, e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/filter.js
function Os(e) {
	typeof e != "function" && (e = cr(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new rc(r, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/merge.js
function ks(e) {
	if (e._id !== this._id) throw Error();
	for (var t = this._groups, n = e._groups, r = t.length, i = n.length, a = Math.min(r, i), o = Array(r), s = 0; s < a; ++s) for (var c = t[s], l = n[s], u = c.length, d = o[s] = Array(u), f, p = 0; p < u; ++p) (f = c[p] || l[p]) && (d[p] = f);
	for (; s < r; ++s) o[s] = t[s];
	return new rc(o, this._parents, this._name, this._id);
}
//#endregion
//#region node_modules/d3-transition/src/transition/on.js
function As(e) {
	return (e + "").trim().split(/^|\s+/).every(function(e) {
		var t = e.indexOf(".");
		return t >= 0 && (e = e.slice(0, t)), !e || e === "start";
	});
}
function js(e, t, n) {
	var r, i, a = As(t) ? Yo : Xo;
	return function() {
		var o = a(this, e), s = o.on;
		s !== r && (i = (r = s).copy()).on(t, n), o.on = i;
	};
}
function Ms(e, t) {
	var n = this._id;
	return arguments.length < 2 ? Zo(this.node(), n).on.on(e) : this.each(js(n, e, t));
}
//#endregion
//#region node_modules/d3-transition/src/transition/remove.js
function Ns(e) {
	return function() {
		var t = this.parentNode;
		for (var n in this.__transition) if (+n !== e) return;
		t && t.removeChild(this);
	};
}
function Ps() {
	return this.on("end.remove", Ns(this._id));
}
//#endregion
//#region node_modules/d3-transition/src/transition/select.js
function Fs(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = tr(e));
	for (var r = this._groups, i = r.length, a = Array(i), o = 0; o < i; ++o) for (var s = r[o], c = s.length, l = a[o] = Array(c), u, d, f = 0; f < c; ++f) (u = s[f]) && (d = e.call(u, u.__data__, f, s)) && ("__data__" in u && (d.__data__ = u.__data__), l[f] = d, Jo(l[f], t, n, f, l, Zo(u, n)));
	return new rc(a, this._parents, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selectAll.js
function Is(e) {
	var t = this._name, n = this._id;
	typeof e != "function" && (e = ar(e));
	for (var r = this._groups, i = r.length, a = [], o = [], s = 0; s < i; ++s) for (var c = r[s], l = c.length, u, d = 0; d < l; ++d) if (u = c[d]) {
		for (var f = e.call(u, u.__data__, d, c), p, m = Zo(u, n), h = 0, g = f.length; h < g; ++h) (p = f[h]) && Jo(p, t, n, h, f, m);
		a.push(f), o.push(u);
	}
	return new rc(a, o, t, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/selection.js
var Ls = Wi.prototype.constructor;
function Rs() {
	return new Ls(this._groups, this._parents);
}
//#endregion
//#region node_modules/d3-transition/src/transition/style.js
function zs(e, t) {
	var n, r, i;
	return function() {
		var a = Qr(this, e), o = (this.style.removeProperty(e), Qr(this, e));
		return a === o ? null : a === n && o === r ? i : i = t(n = a, r = o);
	};
}
function Bs(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function Vs(e, t, n) {
	var r, i = n + "", a;
	return function() {
		var o = Qr(this, e);
		return o === i ? null : o === r ? a : a = t(r = o, n);
	};
}
function Hs(e, t, n) {
	var r, i, a;
	return function() {
		var o = Qr(this, e), s = n(this), c = s + "";
		return s ?? (c = s = (this.style.removeProperty(e), Qr(this, e))), o === c ? null : o === r && c === i ? a : (i = c, a = t(r = o, s));
	};
}
function Us(e, t) {
	var n, r, i, a = "style." + t, o = "end." + a, s;
	return function() {
		var c = Xo(this, e), l = c.on, u = c.value[a] == null ? s ||= Bs(t) : void 0;
		(l !== n || i !== u) && (r = (n = l).copy()).on(o, i = u), c.on = r;
	};
}
function Ws(e, t, n) {
	var r = (e += "") == "transform" ? vo : as;
	return t == null ? this.styleTween(e, zs(e, r)).on("end.style." + e, Bs(e)) : typeof t == "function" ? this.styleTween(e, Hs(e, r, is(this, "style." + e, t))).each(Us(this._id, e)) : this.styleTween(e, Vs(e, r, t), n).on("end.style." + e, null);
}
//#endregion
//#region node_modules/d3-transition/src/transition/styleTween.js
function Gs(e, t, n) {
	return function(r) {
		this.style.setProperty(e, t.call(this, r), n);
	};
}
function Ks(e, t, n) {
	var r, i;
	function a() {
		var a = t.apply(this, arguments);
		return a !== i && (r = (i = a) && Gs(e, a, n)), r;
	}
	return a._value = t, a;
}
function qs(e, t, n) {
	var r = "style." + (e += "");
	if (arguments.length < 2) return (r = this.tween(r)) && r._value;
	if (t == null) return this.tween(r, null);
	if (typeof t != "function") throw Error();
	return this.tween(r, Ks(e, t, n ?? ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/text.js
function Js(e) {
	return function() {
		this.textContent = e;
	};
}
function Ys(e) {
	return function() {
		var t = e(this);
		this.textContent = t ?? "";
	};
}
function Xs(e) {
	return this.tween("text", typeof e == "function" ? Ys(is(this, "text", e)) : Js(e == null ? "" : e + ""));
}
//#endregion
//#region node_modules/d3-transition/src/transition/textTween.js
function Zs(e) {
	return function(t) {
		this.textContent = e.call(this, t);
	};
}
function Qs(e) {
	var t, n;
	function r() {
		var r = e.apply(this, arguments);
		return r !== n && (t = (n = r) && Zs(r)), t;
	}
	return r._value = e, r;
}
function $s(e) {
	var t = "text";
	if (arguments.length < 1) return (t = this.tween(t)) && t._value;
	if (e == null) return this.tween(t, null);
	if (typeof e != "function") throw Error();
	return this.tween(t, Qs(e));
}
//#endregion
//#region node_modules/d3-transition/src/transition/transition.js
function ec() {
	for (var e = this._name, t = this._id, n = ic(), r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) if (c = o[l]) {
		var u = Zo(c, t);
		Jo(c, e, n, l, o, {
			time: u.time + u.delay + u.duration,
			delay: 0,
			duration: u.duration,
			ease: u.ease
		});
	}
	return new rc(r, this._parents, e, n);
}
//#endregion
//#region node_modules/d3-transition/src/transition/end.js
function tc() {
	var e, t, n = this, r = n._id, i = n.size();
	return new Promise(function(a, o) {
		var s = { value: o }, c = { value: function() {
			--i === 0 && a();
		} };
		n.each(function() {
			var n = Xo(this, r), i = n.on;
			i !== e && (t = (e = i).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(c)), n.on = t;
		}), i === 0 && a();
	});
}
//#endregion
//#region node_modules/d3-transition/src/transition/index.js
var nc = 0;
function rc(e, t, n, r) {
	this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function ic() {
	return ++nc;
}
var ac = Wi.prototype;
rc.prototype = {
	constructor: rc,
	select: Fs,
	selectAll: Is,
	selectChild: ac.selectChild,
	selectChildren: ac.selectChildren,
	filter: Os,
	merge: ks,
	selection: Rs,
	transition: ec,
	call: ac.call,
	nodes: ac.nodes,
	node: ac.node,
	size: ac.size,
	empty: ac.empty,
	each: ac.each,
	on: Ms,
	attr: fs,
	attrTween: _s,
	style: Ws,
	styleTween: qs,
	text: Xs,
	textTween: $s,
	remove: Ps,
	tween: rs,
	delay: bs,
	duration: Cs,
	ease: Ts,
	easeVarying: Ds,
	end: tc,
	[Symbol.iterator]: ac[Symbol.iterator]
};
//#endregion
//#region node_modules/d3-ease/src/cubic.js
function oc(e) {
	return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
//#endregion
//#region node_modules/d3-transition/src/selection/transition.js
var sc = {
	time: null,
	delay: 0,
	duration: 250,
	ease: oc
};
function cc(e, t) {
	for (var n; !(n = e.__transition) || !(n = n[t]);) if (!(e = e.parentNode)) throw Error(`transition ${t} not found`);
	return n;
}
function lc(e) {
	var t, n;
	e instanceof rc ? (t = e._id, e = e._name) : (t = ic(), (n = sc).time = Io(), e = e == null ? null : e + "");
	for (var r = this._groups, i = r.length, a = 0; a < i; ++a) for (var o = r[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && Jo(c, e, t, l, o, n || cc(c, t));
	return new rc(r, this._parents, e, t);
}
Wi.prototype.interrupt = es, Wi.prototype.transition = lc;
//#endregion
//#region node_modules/d3-zoom/src/constant.js
var uc = (e) => () => e;
//#endregion
//#region node_modules/d3-zoom/src/event.js
function dc(e, { sourceEvent: t, target: n, transform: r, dispatch: i }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		transform: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		_: { value: i }
	});
}
//#endregion
//#region node_modules/d3-zoom/src/transform.js
function fc(e, t, n) {
	this.k = e, this.x = t, this.y = n;
}
fc.prototype = {
	constructor: fc,
	scale: function(e) {
		return e === 1 ? this : new fc(this.k * e, this.x, this.y);
	},
	translate: function(e, t) {
		return e === 0 & t === 0 ? this : new fc(this.k, this.x + this.k * e, this.y + this.k * t);
	},
	apply: function(e) {
		return [e[0] * this.k + this.x, e[1] * this.k + this.y];
	},
	applyX: function(e) {
		return e * this.k + this.x;
	},
	applyY: function(e) {
		return e * this.k + this.y;
	},
	invert: function(e) {
		return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
	},
	invertX: function(e) {
		return (e - this.x) / this.k;
	},
	invertY: function(e) {
		return (e - this.y) / this.k;
	},
	rescaleX: function(e) {
		return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
	},
	rescaleY: function(e) {
		return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
	},
	toString: function() {
		return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
	}
};
var pc = new fc(1, 0, 0);
mc.prototype = fc.prototype;
function mc(e) {
	for (; !e.__zoom;) if (!(e = e.parentNode)) return pc;
	return e.__zoom;
}
//#endregion
//#region node_modules/d3-zoom/src/noevent.js
function hc(e) {
	e.stopImmediatePropagation();
}
function gc(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region node_modules/d3-zoom/src/zoom.js
function _c(e) {
	return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function vc() {
	var e = this;
	return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function yc() {
	return this.__zoom || pc;
}
function bc(e) {
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * (e.ctrlKey ? 10 : 1);
}
function xc() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Sc(e, t, n) {
	var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], o = e.invertY(t[1][1]) - n[1][1];
	return e.translate(i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i), o > a ? (a + o) / 2 : Math.min(0, a) || Math.max(0, o));
}
function Cc() {
	var e = _c, t = vc, n = Sc, r = bc, i = xc, a = [0, Infinity], o = [[-Infinity, -Infinity], [Infinity, Infinity]], s = 250, c = wo, l = Wn("start", "zoom", "end"), u, d, f, p = 500, m = 150, h = 0, g = 10;
	function _(e) {
		e.property("__zoom", yc).on("wheel.zoom", w, { passive: !1 }).on("mousedown.zoom", T).on("dblclick.zoom", E).filter(i).on("touchstart.zoom", D).on("touchmove.zoom", O).on("touchend.zoom touchcancel.zoom", k).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	_.transform = function(e, t, n, r) {
		var i = e.selection ? e.selection() : e;
		i.property("__zoom", yc), e === i ? i.interrupt().each(function() {
			S(this, arguments).event(r).start().zoom(null, typeof t == "function" ? t.apply(this, arguments) : t).end();
		}) : x(e, t, n, r);
	}, _.scaleBy = function(e, t, n, r) {
		_.scaleTo(e, function() {
			return this.__zoom.k * (typeof t == "function" ? t.apply(this, arguments) : t);
		}, n, r);
	}, _.scaleTo = function(e, r, i, a) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), a = this.__zoom, s = i == null ? b(e) : typeof i == "function" ? i.apply(this, arguments) : i, c = a.invert(s), l = typeof r == "function" ? r.apply(this, arguments) : r;
			return n(y(v(a, l), s, c), e, o);
		}, i, a);
	}, _.translateBy = function(e, r, i, a) {
		_.transform(e, function() {
			return n(this.__zoom.translate(typeof r == "function" ? r.apply(this, arguments) : r, typeof i == "function" ? i.apply(this, arguments) : i), t.apply(this, arguments), o);
		}, null, a);
	}, _.translateTo = function(e, r, i, a, s) {
		_.transform(e, function() {
			var e = t.apply(this, arguments), s = this.__zoom, c = a == null ? b(e) : typeof a == "function" ? a.apply(this, arguments) : a;
			return n(pc.translate(c[0], c[1]).scale(s.k).translate(typeof r == "function" ? -r.apply(this, arguments) : -r, typeof i == "function" ? -i.apply(this, arguments) : -i), e, o);
		}, a, s);
	};
	function v(e, t) {
		return t = Math.max(a[0], Math.min(a[1], t)), t === e.k ? e : new fc(t, e.x, e.y);
	}
	function y(e, t, n) {
		var r = t[0] - n[0] * e.k, i = t[1] - n[1] * e.k;
		return r === e.x && i === e.y ? e : new fc(e.k, r, i);
	}
	function b(e) {
		return [(+e[0][0] + +e[1][0]) / 2, (+e[0][1] + +e[1][1]) / 2];
	}
	function x(e, n, r, i) {
		e.on("start.zoom", function() {
			S(this, arguments).event(i).start();
		}).on("interrupt.zoom end.zoom", function() {
			S(this, arguments).event(i).end();
		}).tween("zoom", function() {
			var e = this, a = arguments, o = S(e, a).event(i), s = t.apply(e, a), l = r == null ? b(s) : typeof r == "function" ? r.apply(e, a) : r, u = Math.max(s[1][0] - s[0][0], s[1][1] - s[0][1]), d = e.__zoom, f = typeof n == "function" ? n.apply(e, a) : n, p = c(d.invert(l).concat(u / d.k), f.invert(l).concat(u / f.k));
			return function(e) {
				if (e === 1) e = f;
				else {
					var t = p(e), n = u / t[2];
					e = new fc(n, l[0] - t[0] * n, l[1] - t[1] * n);
				}
				o.zoom(null, e);
			};
		});
	}
	function S(e, t, n) {
		return !n && e.__zooming || new C(e, t);
	}
	function C(e, n) {
		this.that = e, this.args = n, this.active = 0, this.sourceEvent = null, this.extent = t.apply(e, n), this.taps = 0;
	}
	C.prototype = {
		event: function(e) {
			return e && (this.sourceEvent = e), this;
		},
		start: function() {
			return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
		},
		zoom: function(e, t) {
			return this.mouse && e !== "mouse" && (this.mouse[1] = t.invert(this.mouse[0])), this.touch0 && e !== "touch" && (this.touch0[1] = t.invert(this.touch0[0])), this.touch1 && e !== "touch" && (this.touch1[1] = t.invert(this.touch1[0])), this.that.__zoom = t, this.emit("zoom"), this;
		},
		end: function() {
			return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
		},
		emit: function(e) {
			var t = Ki(this.that).datum();
			l.call(e, this.that, new dc(e, {
				sourceEvent: this.sourceEvent,
				target: _,
				type: e,
				transform: this.that.__zoom,
				dispatch: l
			}), t);
		}
	};
	function w(t, ...i) {
		if (!e.apply(this, arguments)) return;
		var s = S(this, i).event(t), c = this.__zoom, l = Math.max(a[0], Math.min(a[1], c.k * 2 ** r.apply(this, arguments))), u = Ji(t);
		if (s.wheel) (s.mouse[0][0] !== u[0] || s.mouse[0][1] !== u[1]) && (s.mouse[1] = c.invert(s.mouse[0] = u)), clearTimeout(s.wheel);
		else if (c.k === l) return;
		else s.mouse = [u, c.invert(u)], $o(this), s.start();
		gc(t), s.wheel = setTimeout(d, m), s.zoom("mouse", n(y(v(c, l), s.mouse[0], s.mouse[1]), s.extent, o));
		function d() {
			s.wheel = null, s.end();
		}
	}
	function T(t, ...r) {
		if (f || !e.apply(this, arguments)) return;
		var i = t.currentTarget, a = S(this, r, !0).event(t), s = Ki(t.view).on("mousemove.zoom", d, !0).on("mouseup.zoom", p, !0), c = Ji(t, i), l = t.clientX, u = t.clientY;
		$i(t.view), hc(t), a.mouse = [c, this.__zoom.invert(c)], $o(this), a.start();
		function d(e) {
			if (gc(e), !a.moved) {
				var t = e.clientX - l, r = e.clientY - u;
				a.moved = t * t + r * r > h;
			}
			a.event(e).zoom("mouse", n(y(a.that.__zoom, a.mouse[0] = Ji(e, i), a.mouse[1]), a.extent, o));
		}
		function p(e) {
			s.on("mousemove.zoom mouseup.zoom", null), ea(e.view, a.moved), gc(e), a.event(e).end();
		}
	}
	function E(r, ...i) {
		if (e.apply(this, arguments)) {
			var a = this.__zoom, c = Ji(r.changedTouches ? r.changedTouches[0] : r, this), l = a.invert(c), u = a.k * (r.shiftKey ? .5 : 2), d = n(y(v(a, u), c, l), t.apply(this, i), o);
			gc(r), s > 0 ? Ki(this).transition().duration(s).call(x, d, c, r) : Ki(this).call(_.transform, d, c, r);
		}
	}
	function D(t, ...n) {
		if (e.apply(this, arguments)) {
			var r = t.touches, i = r.length, a = S(this, n, t.changedTouches.length === i).event(t), o, s, c, l;
			for (hc(t), s = 0; s < i; ++s) c = r[s], l = Ji(c, this), l = [
				l,
				this.__zoom.invert(l),
				c.identifier
			], a.touch0 ? !a.touch1 && a.touch0[2] !== l[2] && (a.touch1 = l, a.taps = 0) : (a.touch0 = l, o = !0, a.taps = 1 + !!u);
			u &&= clearTimeout(u), o && (a.taps < 2 && (d = l[0], u = setTimeout(function() {
				u = null;
			}, p)), $o(this), a.start());
		}
	}
	function O(e, ...t) {
		if (this.__zooming) {
			var r = S(this, t).event(e), i = e.changedTouches, a = i.length, s, c, l, u;
			for (gc(e), s = 0; s < a; ++s) c = i[s], l = Ji(c, this), r.touch0 && r.touch0[2] === c.identifier ? r.touch0[0] = l : r.touch1 && r.touch1[2] === c.identifier && (r.touch1[0] = l);
			if (c = r.that.__zoom, r.touch1) {
				var d = r.touch0[0], f = r.touch0[1], p = r.touch1[0], m = r.touch1[1], h = (h = p[0] - d[0]) * h + (h = p[1] - d[1]) * h, g = (g = m[0] - f[0]) * g + (g = m[1] - f[1]) * g;
				c = v(c, Math.sqrt(h / g)), l = [(d[0] + p[0]) / 2, (d[1] + p[1]) / 2], u = [(f[0] + m[0]) / 2, (f[1] + m[1]) / 2];
			} else if (r.touch0) l = r.touch0[0], u = r.touch0[1];
			else return;
			r.zoom("touch", n(y(c, l, u), r.extent, o));
		}
	}
	function k(e, ...t) {
		if (this.__zooming) {
			var n = S(this, t).event(e), r = e.changedTouches, i = r.length, a, o;
			for (hc(e), f && clearTimeout(f), f = setTimeout(function() {
				f = null;
			}, p), a = 0; a < i; ++a) o = r[a], n.touch0 && n.touch0[2] === o.identifier ? delete n.touch0 : n.touch1 && n.touch1[2] === o.identifier && delete n.touch1;
			if (n.touch1 && !n.touch0 && (n.touch0 = n.touch1, delete n.touch1), n.touch0) n.touch0[1] = this.__zoom.invert(n.touch0[0]);
			else if (n.end(), n.taps === 2 && (o = Ji(o, this), Math.hypot(d[0] - o[0], d[1] - o[1]) < g)) {
				var s = Ki(this).on("dblclick.zoom");
				s && s.apply(this, arguments);
			}
		}
	}
	return _.wheelDelta = function(e) {
		return arguments.length ? (r = typeof e == "function" ? e : uc(+e), _) : r;
	}, _.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : uc(!!t), _) : e;
	}, _.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : uc(!!e), _) : i;
	}, _.extent = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : uc([[+e[0][0], +e[0][1]], [+e[1][0], +e[1][1]]]), _) : t;
	}, _.scaleExtent = function(e) {
		return arguments.length ? (a[0] = +e[0], a[1] = +e[1], _) : [a[0], a[1]];
	}, _.translateExtent = function(e) {
		return arguments.length ? (o[0][0] = +e[0][0], o[1][0] = +e[1][0], o[0][1] = +e[0][1], o[1][1] = +e[1][1], _) : [[o[0][0], o[0][1]], [o[1][0], o[1][1]]];
	}, _.constrain = function(e) {
		return arguments.length ? (n = e, _) : n;
	}, _.duration = function(e) {
		return arguments.length ? (s = +e, _) : s;
	}, _.interpolate = function(e) {
		return arguments.length ? (c = e, _) : c;
	}, _.on = function() {
		var e = l.on.apply(l, arguments);
		return e === l ? _ : e;
	}, _.clickDistance = function(e) {
		return arguments.length ? (h = (e = +e) * e, _) : Math.sqrt(h);
	}, _.tapDistance = function(e) {
		return arguments.length ? (g = +e, _) : g;
	}, _;
}
//#endregion
//#region node_modules/@xyflow/system/dist/esm/index.js
var wc = {
	error001: (e = "react") => `Seems like you have not used ${e === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${e}flow.dev/error#001`,
	error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
	error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
	error004: () => "The parent container needs a width and a height to render the graph.",
	error005: () => "Only child nodes can use a parent extent.",
	error006: () => "Can't create edge. An edge needs a source and a target.",
	error007: (e) => `The old edge with id=${e} does not exist.`,
	error009: (e) => `Marker type "${e}" doesn't exist.`,
	error008: (e, { id: t, sourceHandle: n, targetHandle: r }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : r}", edge id: ${t}.`,
	error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
	error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
	error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
	error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
	error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
	error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
	error016: (e) => `Edge with id "${e}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
}, Tc = [[-Infinity, -Infinity], [Infinity, Infinity]], Ec = [
	"Enter",
	" ",
	"Escape"
], Dc = {
	"node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
	"node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
	"node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
	"edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
	"controls.ariaLabel": "Control Panel",
	"controls.zoomIn.ariaLabel": "Zoom In",
	"controls.zoomOut.ariaLabel": "Zoom Out",
	"controls.fitView.ariaLabel": "Fit View",
	"controls.interactive.ariaLabel": "Toggle Interactivity",
	"minimap.ariaLabel": "Mini Map",
	"handle.ariaLabel": "Handle"
}, Oc;
(function(e) {
	e.Strict = "strict", e.Loose = "loose";
})(Oc ||= {});
var kc;
(function(e) {
	e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(kc ||= {});
var Ac;
(function(e) {
	e.Partial = "partial", e.Full = "full";
})(Ac ||= {});
var jc = {
	inProgress: !1,
	isValid: null,
	from: null,
	fromHandle: null,
	fromPosition: null,
	fromNode: null,
	to: null,
	toHandle: null,
	toPosition: null,
	toNode: null,
	pointer: null
}, Mc;
(function(e) {
	e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Mc ||= {});
var Nc;
(function(e) {
	e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Nc ||= {});
var X;
(function(e) {
	e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(X ||= {});
var Pc = {
	[X.Left]: X.Right,
	[X.Right]: X.Left,
	[X.Top]: X.Bottom,
	[X.Bottom]: X.Top
}, Fc = (e) => !!e && typeof e == "object" && "id" in e && "source" in e && "target" in e, Ic = (e) => !!e && typeof e == "object" && "id" in e && "position" in e && !("source" in e) && !("target" in e), Lc = (e) => !!e && typeof e == "object" && "id" in e && "internals" in e && !("source" in e) && !("target" in e), Rc = (e, t = [0, 0]) => {
	let { width: n, height: r } = vl(e), i = e.origin ?? t, a = n * i[0], o = r * i[1];
	return {
		x: e.position.x - a,
		y: e.position.y - o
	};
}, zc = (e, t = { nodeOrigin: [0, 0] }) => {
	if (e.length === 0) return {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	let n = !1, r = e.reduce((e, r) => {
		let i = typeof r == "string", a = !t.nodeLookup && !i ? r : void 0;
		return t.nodeLookup && (a = i ? t.nodeLookup.get(r) : Lc(r) ? r : t.nodeLookup.get(r.id)), a ? (n = !0, Qc(e, nl(a, t.nodeOrigin))) : e;
	}, {
		x: Infinity,
		y: Infinity,
		x2: -Infinity,
		y2: -Infinity
	});
	return n ? el(r) : {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
}, Bc = (e, t = {}) => {
	let n = {
		x: Infinity,
		y: Infinity,
		x2: -Infinity,
		y2: -Infinity
	}, r = !1;
	return e.forEach((e) => {
		(t.filter === void 0 || t.filter(e)) && (n = Qc(n, nl(e)), r = !0);
	}), r ? el(n) : {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
}, Vc = (e, t, [n, r, i] = [
	0,
	0,
	1
], a = !1, o = !1) => {
	let s = (t.x - n) / i, c = (t.y - r) / i, l = t.width / i, u = t.height / i, d = [];
	for (let t of e.values()) {
		let { measured: e, selectable: n = !0, hidden: r = !1 } = t;
		if (o && !n || r) continue;
		let i = e.width ?? t.width ?? t.initialWidth ?? 0, f = e.height ?? t.height ?? t.initialHeight ?? 0, { x: p, y: m } = t.internals.positionAbsolute, h = il(s, c, l, u, p, m, i, f), g = i * f, _ = a && h > 0;
		(!t.internals.handleBounds || _ || h >= g || t.dragging) && d.push(t);
	}
	return d;
}, Hc = (e, t) => {
	let n = /* @__PURE__ */ new Set();
	return e.forEach((e) => {
		n.add(e.id);
	}), t.filter((e) => n.has(e.source) || n.has(e.target));
};
function Uc(e, t) {
	let n = /* @__PURE__ */ new Map(), r = t?.nodes ? new Set(t.nodes.map((e) => e.id)) : null;
	return e.forEach((e) => {
		let i;
		if (t?.includeHiddenNodes) {
			let { width: t, height: n } = vl(e);
			i = t > 0 && n > 0;
		} else i = !!(e.measured.width && e.measured.height && !e.hidden);
		i && (!r || r.has(e.id)) && n.set(e.id, e);
	}), n;
}
async function Wc({ nodes: e, width: t, height: n, panZoom: r, minZoom: i, maxZoom: a }, o) {
	if (e.size === 0) return !0;
	let s = hl(Bc(Uc(e, o)), t, n, o?.minZoom ?? i, o?.maxZoom ?? a, o?.padding ?? .1);
	return await r.setViewport(s, {
		duration: o?.duration,
		ease: o?.ease,
		interpolate: o?.interpolate
	}), !0;
}
function Gc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: i, onError: a }) {
	let o = n.get(e), s = o.parentId ? n.get(o.parentId) : void 0, { x: c, y: l } = s ? s.internals.positionAbsolute : {
		x: 0,
		y: 0
	}, u = o.origin ?? r, d = o.extent || i;
	if (o.extent === "parent" && !o.expandParent) {
		if (!s) a?.("005", wc.error005());
		else {
			let { width: e, height: t } = vl(s);
			e && t && (d = [[c, l], [c + e, l + t]]);
		}
	} else s && _l(o.extent) && (d = [[o.extent[0][0] + c, o.extent[0][1] + l], [o.extent[1][0] + c, o.extent[1][1] + l]]);
	let f = _l(d) ? Jc(t, d, o.measured) : t;
	return (o.measured.width === void 0 || o.measured.height === void 0) && a?.("015", wc.error015()), {
		position: {
			x: f.x - c + (o.measured.width ?? 0) * u[0],
			y: f.y - l + (o.measured.height ?? 0) * u[1]
		},
		positionAbsolute: f
	};
}
async function Kc({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: i }) {
	let a = new Set(e.map((e) => e.id)), o = [];
	for (let e of n) {
		if (e.deletable === !1) continue;
		let t = a.has(e.id), n = !t && e.parentId && o.find((t) => t.id === e.parentId);
		(t || n) && o.push(e);
	}
	let s = new Set(t.map((e) => e.id)), c = r.filter((e) => e.deletable !== !1), l = Hc(o, c);
	for (let e of c) s.has(e.id) && !l.find((t) => t.id === e.id) && l.push(e);
	if (!i) return {
		edges: l,
		nodes: o
	};
	let u = await i({
		nodes: o,
		edges: l
	});
	return typeof u == "boolean" ? u ? {
		edges: l,
		nodes: o
	} : {
		edges: [],
		nodes: []
	} : u;
}
var qc = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), Jc = (e = {
	x: 0,
	y: 0
}, t, n) => ({
	x: qc(e.x, t[0][0], t[1][0] - (n?.width ?? 0)),
	y: qc(e.y, t[0][1], t[1][1] - (n?.height ?? 0))
});
function Yc(e, t, n) {
	let { width: r, height: i } = vl(n), { x: a, y: o } = n.internals.positionAbsolute;
	return Jc(e, [[a, o], [a + r, o + i]], t);
}
var Xc = (e, t, n) => e < t ? qc(Math.abs(e - t), 1, t) / t : e > n ? -qc(Math.abs(e - n), 1, t) / t : 0, Zc = (e, t, n = 15, r = 40) => [Xc(e.x, r, t.width - r) * n, Xc(e.y, r, t.height - r) * n], Qc = (e, t) => ({
	x: Math.min(e.x, t.x),
	y: Math.min(e.y, t.y),
	x2: Math.max(e.x2, t.x2),
	y2: Math.max(e.y2, t.y2)
}), $c = ({ x: e, y: t, width: n, height: r }) => ({
	x: e,
	y: t,
	x2: e + n,
	y2: t + r
}), el = ({ x: e, y: t, x2: n, y2: r }) => ({
	x: e,
	y: t,
	width: n - e,
	height: r - t
}), tl = (e, t = [0, 0]) => {
	let { x: n, y: r } = Lc(e) ? e.internals.positionAbsolute : Rc(e, t);
	return {
		x: n,
		y: r,
		width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
		height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
	};
}, nl = (e, t = [0, 0]) => {
	let { x: n, y: r } = Lc(e) ? e.internals.positionAbsolute : Rc(e, t);
	return {
		x: n,
		y: r,
		x2: n + (e.measured?.width ?? e.width ?? e.initialWidth ?? 0),
		y2: r + (e.measured?.height ?? e.height ?? e.initialHeight ?? 0)
	};
}, rl = (e, t) => el(Qc($c(e), $c(t))), il = (e, t, n, r, i, a, o, s) => {
	let c = Math.max(0, Math.min(e + n, i + o) - Math.max(e, i)), l = Math.max(0, Math.min(t + r, a + s) - Math.max(t, a));
	return Math.ceil(c * l);
}, al = (e, t) => il(e.x, e.y, e.width, e.height, t.x, t.y, t.width, t.height), ol = (e) => sl(e.width) && sl(e.height) && sl(e.x) && sl(e.y), sl = (e) => !isNaN(e) && isFinite(e), cl = (e, t) => (e, t) => {}, ll = (e, t = [1, 1]) => ({
	x: t[0] * Math.round(e.x / t[0]),
	y: t[1] * Math.round(e.y / t[1])
}), ul = ({ x: e, y: t }, [n, r, i], a = !1, o = [1, 1]) => {
	let s = {
		x: (e - n) / i,
		y: (t - r) / i
	};
	return a ? ll(s, o) : s;
}, dl = ({ x: e, y: t }, [n, r, i]) => ({
	x: e * i + n,
	y: t * i + r
});
function fl(e, t) {
	if (typeof e == "number") return Math.floor((t - t / (1 + e)) * .5);
	if (typeof e == "string" && e.endsWith("px")) {
		let t = parseFloat(e);
		if (!Number.isNaN(t)) return Math.floor(t);
	}
	if (typeof e == "string" && e.endsWith("%")) {
		let n = parseFloat(e);
		if (!Number.isNaN(n)) return Math.floor(t * n * .01);
	}
	return console.error(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function pl(e, t, n) {
	if (typeof e == "string" || typeof e == "number") {
		let r = fl(e, n), i = fl(e, t);
		return {
			top: r,
			right: i,
			bottom: r,
			left: i,
			x: i * 2,
			y: r * 2
		};
	}
	if (typeof e == "object") {
		let r = fl(e.top ?? e.y ?? 0, n), i = fl(e.bottom ?? e.y ?? 0, n), a = fl(e.left ?? e.x ?? 0, t), o = fl(e.right ?? e.x ?? 0, t);
		return {
			top: r,
			right: o,
			bottom: i,
			left: a,
			x: a + o,
			y: r + i
		};
	}
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		x: 0,
		y: 0
	};
}
function ml(e, t, n, r, i, a) {
	let { x: o, y: s } = dl(e, [
		t,
		n,
		r
	]), { x: c, y: l } = dl({
		x: e.x + e.width,
		y: e.y + e.height
	}, [
		t,
		n,
		r
	]), u = i - c, d = a - l;
	return {
		left: Math.floor(o),
		top: Math.floor(s),
		right: Math.floor(u),
		bottom: Math.floor(d)
	};
}
var hl = (e, t, n, r, i, a) => {
	let o = pl(a, t, n), s = (t - o.x) / e.width, c = (n - o.y) / e.height, l = qc(Math.min(s, c), r, i), u = e.x + e.width / 2, d = e.y + e.height / 2, f = t / 2 - u * l, p = n / 2 - d * l, m = ml(e, f, p, l, t, n), h = {
		left: Math.min(m.left - o.left, 0),
		top: Math.min(m.top - o.top, 0),
		right: Math.min(m.right - o.right, 0),
		bottom: Math.min(m.bottom - o.bottom, 0)
	};
	return {
		x: f - h.left + h.right,
		y: p - h.top + h.bottom,
		zoom: l
	};
}, gl = () => typeof navigator < "u" && navigator?.userAgent?.indexOf("Mac") >= 0;
function _l(e) {
	return e != null && e !== "parent";
}
function vl(e) {
	return {
		width: e.measured?.width ?? e.width ?? e.initialWidth ?? 0,
		height: e.measured?.height ?? e.height ?? e.initialHeight ?? 0
	};
}
function yl(e) {
	return (e.measured?.width ?? e.width ?? e.initialWidth) !== void 0 && (e.measured?.height ?? e.height ?? e.initialHeight) !== void 0;
}
function bl(e, t = {
	width: 0,
	height: 0
}, n, r, i) {
	let a = { ...e }, o = r.get(n);
	if (o) {
		let e = o.origin || i;
		a.x += o.internals.positionAbsolute.x - (t.width ?? 0) * e[0], a.y += o.internals.positionAbsolute.y - (t.height ?? 0) * e[1];
	}
	return a;
}
function xl(e, t) {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
}
function Sl() {
	let e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
function Cl(e) {
	return {
		...Dc,
		...e || {}
	};
}
function wl(e) {
	return e === null ? null : e ? "valid" : "invalid";
}
function Tl(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: i }) {
	let { x: a, y: o } = jl(e), s = ul({
		x: a - (i?.left ?? 0),
		y: o - (i?.top ?? 0)
	}, r), { x: c, y: l } = n ? ll(s, t) : s;
	return {
		xSnapped: c,
		ySnapped: l,
		...s
	};
}
var El = (e) => ({
	width: e.offsetWidth,
	height: e.offsetHeight
}), Dl = (e) => e?.getRootNode?.() || window?.document, Ol = [
	"INPUT",
	"SELECT",
	"TEXTAREA"
];
function kl(e) {
	let t = e.composedPath?.()?.[0] || e.target;
	return t?.nodeType === 1 ? Ol.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey") : !1;
}
var Al = (e) => "clientX" in e, jl = (e, t) => {
	let n = Al(e), r = n ? e.clientX : e.touches?.[0].clientX, i = n ? e.clientY : e.touches?.[0].clientY;
	return {
		x: r - (t?.left ?? 0),
		y: i - (t?.top ?? 0)
	};
}, Ml = (e, t, n, r, i) => {
	let a = t.querySelectorAll(`.${e}`);
	return !a || !a.length ? null : Array.from(a).map((t) => {
		let a = t.getBoundingClientRect();
		return {
			id: t.getAttribute("data-handleid"),
			type: e,
			nodeId: i,
			position: t.getAttribute("data-handlepos"),
			x: (a.left - n.left) / r,
			y: (a.top - n.top) / r,
			...El(t)
		};
	});
};
function Nl({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: i, sourceControlY: a, targetControlX: o, targetControlY: s }) {
	let c = e * .125 + i * .375 + o * .375 + n * .125, l = t * .125 + a * .375 + s * .375 + r * .125;
	return [
		c,
		l,
		Math.abs(c - e),
		Math.abs(l - t)
	];
}
function Pl(e, t) {
	return e >= 0 ? .5 * e : t * 25 * Math.sqrt(-e);
}
function Fl({ pos: e, x1: t, y1: n, x2: r, y2: i, c: a }) {
	switch (e) {
		case X.Left: return [t - Pl(t - r, a), n];
		case X.Right: return [t + Pl(r - t, a), n];
		case X.Top: return [t, n - Pl(n - i, a)];
		case X.Bottom: return [t, n + Pl(i - n, a)];
	}
}
function Il({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: i, targetPosition: a = X.Top, curvature: o = .25 }) {
	let [s, c] = Fl({
		pos: n,
		x1: e,
		y1: t,
		x2: r,
		y2: i,
		c: o
	}), [l, u] = Fl({
		pos: a,
		x1: r,
		y1: i,
		x2: e,
		y2: t,
		c: o
	}), [d, f, p, m] = Nl({
		sourceX: e,
		sourceY: t,
		targetX: r,
		targetY: i,
		sourceControlX: s,
		sourceControlY: c,
		targetControlX: l,
		targetControlY: u
	});
	return [
		`M${e},${t} C${s},${c} ${l},${u} ${r},${i}`,
		d,
		f,
		p,
		m
	];
}
function Ll({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
	let i = Math.abs(n - e) / 2, a = n < e ? n + i : n - i, o = Math.abs(r - t) / 2;
	return [
		a,
		r < t ? r + o : r - o,
		i,
		o
	];
}
function Rl({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r = 0, elevateOnSelect: i = !1, zIndexMode: a = "basic" }) {
	return a === "manual" ? r : (i && n ? r + 1e3 : r) + Math.max(e.parentId || i && e.selected ? e.internals.z : 0, t.parentId || i && t.selected ? t.internals.z : 0);
}
function zl({ sourceNode: e, targetNode: t, width: n, height: r, transform: i }) {
	let a = Qc(nl(e), nl(t));
	return a.x === a.x2 && (a.x2 += 1), a.y === a.y2 && (a.y2 += 1), al({
		x: -i[0] / i[2],
		y: -i[1] / i[2],
		width: n / i[2],
		height: r / i[2]
	}, el(a)) > 0;
}
var Bl = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Vl = (e, t) => t.some((t) => t.source === e.source && t.target === e.target && (t.sourceHandle === e.sourceHandle || !t.sourceHandle && !e.sourceHandle) && (t.targetHandle === e.targetHandle || !t.targetHandle && !e.targetHandle)), Hl = (e, t, n = {}) => {
	if (!e.source || !e.target) return n.onError?.("006", wc.error006()), t;
	let r = n.getEdgeId || Bl, i;
	return i = Fc(e) ? { ...e } : {
		...e,
		id: r(e)
	}, Vl(i, t) ? t : (i.sourceHandle === null && delete i.sourceHandle, i.targetHandle === null && delete i.targetHandle, t.concat(i));
};
function Ul({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
	let [i, a, o, s] = Ll({
		sourceX: e,
		sourceY: t,
		targetX: n,
		targetY: r
	});
	return [
		`M ${e},${t}L ${n},${r}`,
		i,
		a,
		o,
		s
	];
}
var Wl = {
	[X.Left]: {
		x: -1,
		y: 0
	},
	[X.Right]: {
		x: 1,
		y: 0
	},
	[X.Top]: {
		x: 0,
		y: -1
	},
	[X.Bottom]: {
		x: 0,
		y: 1
	}
}, Gl = ({ source: e, sourcePosition: t = X.Bottom, target: n }) => t === X.Left || t === X.Right ? e.x < n.x ? {
	x: 1,
	y: 0
} : {
	x: -1,
	y: 0
} : e.y < n.y ? {
	x: 0,
	y: 1
} : {
	x: 0,
	y: -1
}, Kl = (e, t) => Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
function ql({ source: e, sourcePosition: t = X.Bottom, target: n, targetPosition: r = X.Top, center: i, offset: a, stepPosition: o }) {
	let s = Wl[t], c = Wl[r], l = {
		x: e.x + s.x * a,
		y: e.y + s.y * a
	}, u = {
		x: n.x + c.x * a,
		y: n.y + c.y * a
	}, d = Gl({
		source: l,
		sourcePosition: t,
		target: u
	}), f = d.x === 0 ? "y" : "x", p = d[f], m = [], h, g, _ = {
		x: 0,
		y: 0
	}, v = {
		x: 0,
		y: 0
	}, [, , y, b] = Ll({
		sourceX: e.x,
		sourceY: e.y,
		targetX: n.x,
		targetY: n.y
	});
	if (s[f] * c[f] === -1) {
		f === "x" ? (h = i.x ?? l.x + (u.x - l.x) * o, g = i.y ?? (l.y + u.y) / 2) : (h = i.x ?? (l.x + u.x) / 2, g = i.y ?? l.y + (u.y - l.y) * o);
		let e = [{
			x: h,
			y: l.y
		}, {
			x: h,
			y: u.y
		}], t = [{
			x: l.x,
			y: g
		}, {
			x: u.x,
			y: g
		}];
		m = s[f] === p ? f === "x" ? e : t : f === "x" ? t : e;
	} else {
		let i = [{
			x: l.x,
			y: u.y
		}], o = [{
			x: u.x,
			y: l.y
		}];
		if (m = f === "x" ? s.x === p ? o : i : s.y === p ? i : o, t === r) {
			let t = Math.abs(e[f] - n[f]);
			if (t <= a) {
				let r = Math.min(a - 1, a - t);
				s[f] === p ? _[f] = (l[f] > e[f] ? -1 : 1) * r : v[f] = (u[f] > n[f] ? -1 : 1) * r;
			}
		}
		if (t !== r) {
			let e = f === "x" ? "y" : "x", t = s[f] === c[e], n = l[e] > u[e], r = l[e] < u[e];
			(s[f] === 1 && (!t && n || t && r) || s[f] !== 1 && (!t && r || t && n)) && (m = f === "x" ? i : o);
		}
		let d = {
			x: l.x + _.x,
			y: l.y + _.y
		}, y = {
			x: u.x + v.x,
			y: u.y + v.y
		};
		Math.max(Math.abs(d.x - m[0].x), Math.abs(y.x - m[0].x)) >= Math.max(Math.abs(d.y - m[0].y), Math.abs(y.y - m[0].y)) ? (h = (d.x + y.x) / 2, g = m[0].y) : (h = m[0].x, g = (d.y + y.y) / 2);
	}
	let x = {
		x: l.x + _.x,
		y: l.y + _.y
	}, S = {
		x: u.x + v.x,
		y: u.y + v.y
	};
	return [
		[
			e,
			...x.x !== m[0].x || x.y !== m[0].y ? [x] : [],
			...m,
			...S.x !== m[m.length - 1].x || S.y !== m[m.length - 1].y ? [S] : [],
			n
		],
		h,
		g,
		y,
		b
	];
}
function Jl(e, t, n, r) {
	let i = Math.min(Kl(e, t) / 2, Kl(t, n) / 2, r), { x: a, y: o } = t;
	if (e.x === a && a === n.x || e.y === o && o === n.y) return `L${a} ${o}`;
	if (e.y === o) {
		let t = e.x < n.x ? -1 : 1, r = e.y < n.y ? 1 : -1;
		return `L ${a + i * t},${o}Q ${a},${o} ${a},${o + i * r}`;
	}
	let s = e.x < n.x ? 1 : -1;
	return `L ${a},${o + i * (e.y < n.y ? -1 : 1)}Q ${a},${o} ${a + i * s},${o}`;
}
function Yl({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: i, targetPosition: a = X.Top, borderRadius: o = 5, centerX: s, centerY: c, offset: l = 20, stepPosition: u = .5 }) {
	let [d, f, p, m, h] = ql({
		source: {
			x: e,
			y: t
		},
		sourcePosition: n,
		target: {
			x: r,
			y: i
		},
		targetPosition: a,
		center: {
			x: s,
			y: c
		},
		offset: l,
		stepPosition: u
	}), g = `M${d[0].x} ${d[0].y}`;
	for (let e = 1; e < d.length - 1; e++) g += Jl(d[e - 1], d[e], d[e + 1], o);
	return g += `L${d[d.length - 1].x} ${d[d.length - 1].y}`, [
		g,
		f,
		p,
		m,
		h
	];
}
function Xl(e) {
	return e && !!(e.internals.handleBounds || e.handles?.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Zl(e) {
	let { sourceNode: t, targetNode: n } = e;
	if (!Xl(t) || !Xl(n)) return null;
	let r = t.internals.handleBounds || Ql(t.handles), i = n.internals.handleBounds || Ql(n.handles), a = eu(r?.source ?? [], e.sourceHandle), o = eu(e.connectionMode === Oc.Strict ? i?.target ?? [] : (i?.target ?? []).concat(i?.source ?? []), e.targetHandle);
	if (!a || !o) return e.onError?.("008", wc.error008(a ? "target" : "source", {
		id: e.id,
		sourceHandle: e.sourceHandle,
		targetHandle: e.targetHandle
	})), null;
	let s = a?.position || X.Bottom, c = o?.position || X.Top, l = $l(t, a, s), u = $l(n, o, c);
	return {
		sourceX: l.x,
		sourceY: l.y,
		targetX: u.x,
		targetY: u.y,
		sourcePosition: s,
		targetPosition: c
	};
}
function Ql(e) {
	if (!e) return null;
	let t = [], n = [];
	for (let r of e) r.width = r.width ?? 1, r.height = r.height ?? 1, r.type === "source" ? t.push(r) : r.type === "target" && n.push(r);
	return {
		source: t,
		target: n
	};
}
function $l(e, t, n = X.Left, r = !1) {
	let i = (t?.x ?? 0) + e.internals.positionAbsolute.x, a = (t?.y ?? 0) + e.internals.positionAbsolute.y, { width: o, height: s } = t ?? vl(e);
	if (r) return {
		x: i + o / 2,
		y: a + s / 2
	};
	switch (t?.position ?? n) {
		case X.Top: return {
			x: i + o / 2,
			y: a
		};
		case X.Right: return {
			x: i + o,
			y: a + s / 2
		};
		case X.Bottom: return {
			x: i + o / 2,
			y: a + s
		};
		case X.Left: return {
			x: i,
			y: a + s / 2
		};
	}
}
function eu(e, t) {
	return e && (t ? e.find((e) => e.id === t) : e[0]) || null;
}
function tu(e, t) {
	return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((t) => `${t}=${e[t]}`).join("&")}` : "";
}
function nu(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: i }) {
	let a = /* @__PURE__ */ new Set();
	return e.reduce((e, o) => ([o.markerStart || r, o.markerEnd || i].forEach((r) => {
		if (r && typeof r == "object") {
			let i = tu(r, t);
			a.has(i) || (e.push({
				id: i,
				color: r.color || n,
				...r
			}), a.add(i));
		}
	}), e), []).sort((e, t) => e.id.localeCompare(t.id));
}
var ru = 1e3, iu = 10, au = {
	nodeOrigin: [0, 0],
	nodeExtent: Tc,
	elevateNodesOnSelect: !0,
	zIndexMode: "basic",
	defaults: {}
}, ou = {
	...au,
	checkEquality: !0
};
function su(e, t) {
	let n = { ...e };
	for (let e in t) t[e] !== void 0 && (n[e] = t[e]);
	return n;
}
function cu(e, t, n) {
	let r = su(au, n);
	for (let n of e.values()) if (n.parentId) pu(n, e, t, r);
	else {
		let e = Jc(Rc(n, r.nodeOrigin), _l(n.extent) ? n.extent : r.nodeExtent, vl(n));
		n.internals.positionAbsolute = e;
	}
}
function lu(e, t) {
	if (!e.handles) return e.measured ? t?.internals.handleBounds : void 0;
	let n = [], r = [];
	for (let t of e.handles) {
		let i = {
			id: t.id,
			width: t.width ?? 1,
			height: t.height ?? 1,
			nodeId: e.id,
			x: t.x,
			y: t.y,
			position: t.position,
			type: t.type
		};
		t.type === "source" ? n.push(i) : t.type === "target" && r.push(i);
	}
	return {
		source: n,
		target: r
	};
}
function uu(e) {
	return e === "manual";
}
function du(e, t, n, r = {}) {
	let i = su(ou, r), a = { i: 0 }, o = new Map(t), s = i?.elevateNodesOnSelect && !uu(i.zIndexMode) ? ru : 0, c = e.length > 0, l = !1;
	t.clear(), n.clear();
	for (let u of e) {
		let e = o.get(u.id);
		if (i.checkEquality && u === e?.internals.userNode) t.set(u.id, e);
		else {
			let n = Jc(Rc(u, i.nodeOrigin), _l(u.extent) ? u.extent : i.nodeExtent, vl(u));
			e = {
				...i.defaults,
				...u,
				measured: {
					width: u.measured?.width,
					height: u.measured?.height
				},
				internals: {
					positionAbsolute: n,
					handleBounds: lu(u, e),
					z: mu(u, s, i.zIndexMode),
					userNode: u
				}
			}, t.set(u.id, e);
		}
		(e.measured === void 0 || e.measured.width === void 0 || e.measured.height === void 0) && !e.hidden && (c = !1), u.parentId && pu(e, t, n, r, a), l ||= u.selected ?? !1;
	}
	return {
		nodesInitialized: c,
		hasSelectedNodes: l
	};
}
function fu(e, t) {
	if (!e.parentId) return;
	let n = t.get(e.parentId);
	n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function pu(e, t, n, r, i) {
	let { elevateNodesOnSelect: a, nodeOrigin: o, nodeExtent: s, zIndexMode: c } = su(au, r), l = e.parentId, u = t.get(l);
	if (!u) {
		console.warn(`Parent node ${l} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
		return;
	}
	fu(e, n), i && !u.parentId && u.internals.rootParentIndex === void 0 && c === "auto" && (u.internals.rootParentIndex = ++i.i, u.internals.z = u.internals.z + i.i * iu), i && u.internals.rootParentIndex !== void 0 && (i.i = u.internals.rootParentIndex);
	let { x: d, y: f, z: p } = hu(e, u, o, s, a && !uu(c) ? ru : 0, c), { positionAbsolute: m } = e.internals, h = d !== m.x || f !== m.y;
	(h || p !== e.internals.z) && t.set(e.id, {
		...e,
		internals: {
			...e.internals,
			positionAbsolute: h ? {
				x: d,
				y: f
			} : m,
			z: p
		}
	});
}
function mu(e, t, n) {
	let r = sl(e.zIndex) ? e.zIndex : 0;
	return uu(n) ? r : r + (e.selected ? t : 0);
}
function hu(e, t, n, r, i, a) {
	let { x: o, y: s } = t.internals.positionAbsolute, c = vl(e), l = Rc(e, n), u = _l(e.extent) ? Jc(l, e.extent, c) : l, d = Jc({
		x: o + u.x,
		y: s + u.y
	}, r, c);
	e.extent === "parent" && (d = Yc(d, c, t));
	let f = mu(e, i, a), p = t.internals.z ?? 0;
	return {
		x: d.x,
		y: d.y,
		z: p >= f ? p + 1 : f
	};
}
function gu(e, t, n, r = [0, 0]) {
	let i = [], a = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.parentId);
		if (!e) continue;
		let r = rl(a.get(n.parentId)?.expandedRect ?? tl(e), n.rect);
		a.set(n.parentId, {
			expandedRect: r,
			parent: e
		});
	}
	return a.size > 0 && a.forEach(({ expandedRect: t, parent: a }, o) => {
		let s = a.internals.positionAbsolute, c = vl(a), l = a.origin ?? r, u = t.x < s.x ? Math.round(Math.abs(s.x - t.x)) : 0, d = t.y < s.y ? Math.round(Math.abs(s.y - t.y)) : 0, f = Math.max(c.width, Math.round(t.width)), p = Math.max(c.height, Math.round(t.height)), m = (f - c.width) * l[0], h = (p - c.height) * l[1];
		(u > 0 || d > 0 || m || h) && (i.push({
			id: o,
			type: "position",
			position: {
				x: a.position.x - u + m,
				y: a.position.y - d + h
			}
		}), n.get(o)?.forEach((t) => {
			e.some((e) => e.id === t.id) || i.push({
				id: t.id,
				type: "position",
				position: {
					x: t.position.x + u,
					y: t.position.y + d
				}
			});
		})), (c.width < t.width || c.height < t.height || u || d) && i.push({
			id: o,
			type: "dimensions",
			setAttributes: !0,
			dimensions: {
				width: f + (u ? l[0] * u - m : 0),
				height: p + (d ? l[1] * d - h : 0)
			}
		});
	}), i;
}
function _u(e, t, n, r, i, a, o) {
	let s = r?.querySelector(".xyflow__viewport"), c = !1;
	if (!s) return {
		changes: [],
		updatedInternals: c
	};
	let l = [], u = window.getComputedStyle(s), { m22: d } = new window.DOMMatrixReadOnly(u.transform), f = [];
	for (let r of e.values()) {
		let e = t.get(r.id);
		if (!e) continue;
		if (e.hidden) {
			t.set(e.id, {
				...e,
				internals: {
					...e.internals,
					handleBounds: void 0
				}
			}), c = !0;
			continue;
		}
		let s = El(r.nodeElement), u = e.measured.width !== s.width || e.measured.height !== s.height;
		if (s.width && s.height && (u || !e.internals.handleBounds || r.force)) {
			let p = r.nodeElement.getBoundingClientRect(), m = _l(e.extent) ? e.extent : a, { positionAbsolute: h } = e.internals;
			if (e.parentId && e.extent === "parent") {
				let n = t.get(e.parentId);
				n && (h = Yc(h, s, n));
			} else m && (h = Jc(h, m, s));
			let g = {
				...e,
				measured: s,
				internals: {
					...e.internals,
					positionAbsolute: h,
					handleBounds: {
						source: Ml("source", r.nodeElement, p, d, e.id),
						target: Ml("target", r.nodeElement, p, d, e.id)
					}
				}
			};
			t.set(e.id, g), e.parentId && pu(g, t, n, {
				nodeOrigin: i,
				zIndexMode: o
			}), c = !0, u && (l.push({
				id: e.id,
				type: "dimensions",
				dimensions: s
			}), e.expandParent && e.parentId && f.push({
				id: e.id,
				parentId: e.parentId,
				rect: tl(g, i)
			}));
		}
	}
	if (f.length > 0) {
		let e = gu(f, t, n, i);
		l.push(...e);
	}
	return {
		changes: l,
		updatedInternals: c
	};
}
async function vu({ delta: e, panZoom: t, transform: n, translateExtent: r, width: i, height: a }) {
	if (!t || !e.x && !e.y) return !1;
	let o = await t.setViewportConstrained({
		x: n[0] + e.x,
		y: n[1] + e.y,
		zoom: n[2]
	}, [[0, 0], [i, a]], r);
	return !!o && (o.x !== n[0] || o.y !== n[1] || o.k !== n[2]);
}
function yu(e, t, n, r, i, a) {
	let o = i, s = r.get(o) || /* @__PURE__ */ new Map();
	r.set(o, s.set(n, t)), o = `${i}-${e}`;
	let c = r.get(o) || /* @__PURE__ */ new Map();
	if (r.set(o, c.set(n, t)), a) {
		o = `${i}-${e}-${a}`;
		let s = r.get(o) || /* @__PURE__ */ new Map();
		r.set(o, s.set(n, t));
	}
}
function bu(e, t, n) {
	e.clear(), t.clear();
	for (let r of n) {
		let { source: n, target: i, sourceHandle: a = null, targetHandle: o = null } = r, s = {
			edgeId: r.id,
			source: n,
			target: i,
			sourceHandle: a,
			targetHandle: o
		}, c = `${n}-${a}--${i}-${o}`;
		yu("source", s, `${i}-${o}--${n}-${a}`, e, n, a), yu("target", s, c, e, i, o), t.set(r.id, r);
	}
}
function xu(e, t) {
	if (!e.parentId) return !1;
	let n = t.get(e.parentId);
	return n ? n.selected ? !0 : xu(n, t) : !1;
}
function Su(e, t, n) {
	let r = e;
	do {
		if (r?.matches?.(t)) return !0;
		if (r === n) return !1;
		r = r?.parentElement;
	} while (r);
	return !1;
}
function Cu(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let [a, o] of e) if ((o.selected || o.id === r) && (!o.parentId || !xu(o, e)) && (o.draggable || t && o.draggable === void 0)) {
		let t = e.get(a);
		t && i.set(a, {
			id: a,
			position: t.position || {
				x: 0,
				y: 0
			},
			distance: {
				x: n.x - t.internals.positionAbsolute.x,
				y: n.y - t.internals.positionAbsolute.y
			},
			extent: t.extent,
			parentId: t.parentId,
			origin: t.origin,
			expandParent: t.expandParent,
			internals: { positionAbsolute: t.internals.positionAbsolute || {
				x: 0,
				y: 0
			} },
			measured: {
				width: t.measured.width ?? 0,
				height: t.measured.height ?? 0
			}
		});
	}
	return i;
}
function wu({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
	let i = [];
	for (let [e, a] of t) {
		let t = n.get(e)?.internals.userNode;
		t && i.push({
			...t,
			position: a.position,
			dragging: r
		});
	}
	if (!e) return [i[0], i];
	let a = n.get(e)?.internals.userNode;
	return [a ? {
		...a,
		position: t.get(e)?.position || a.position,
		dragging: r
	} : i[0], i];
}
function Tu({ dragItems: e, snapGrid: t, x: n, y: r }) {
	let i = e.values().next().value;
	if (!i) return null;
	let a = {
		x: n - i.distance.x,
		y: r - i.distance.y
	}, o = ll(a, t);
	return {
		x: o.x - a.x,
		y: o.y - a.y
	};
}
function Eu({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: i }) {
	let a = {
		x: null,
		y: null
	}, o = 0, s = /* @__PURE__ */ new Map(), c = !1, l = {
		x: 0,
		y: 0
	}, u = null, d = !1, f = null, p = !1, m = !1, h = null;
	function g({ noDragClassName: g, handleSelector: _, domNode: v, isSelectable: y, nodeId: b, nodeClickDistance: x = 0 }) {
		f = Ki(v);
		function S({ x: e, y: n }) {
			let { nodeLookup: i, nodeExtent: o, snapGrid: c, snapToGrid: l, nodeOrigin: u, onNodeDrag: d, onSelectionDrag: f, onError: p, updateNodePositions: g } = t();
			a = {
				x: e,
				y: n
			};
			let _ = !1, v = s.size > 1, y = v && o ? $c(Bc(s)) : null, x = v && l ? Tu({
				dragItems: s,
				snapGrid: c,
				x: e,
				y: n
			}) : null;
			for (let [t, r] of s) {
				if (!i.has(t)) continue;
				let a = {
					x: e - r.distance.x,
					y: n - r.distance.y
				};
				l && (a = x ? {
					x: Math.round(a.x + x.x),
					y: Math.round(a.y + x.y)
				} : ll(a, c));
				let s = null;
				if (v && o && !r.extent && y) {
					let { positionAbsolute: e } = r.internals, t = e.x - y.x + o[0][0], n = e.x + r.measured.width - y.x2 + o[1][0], i = e.y - y.y + o[0][1], a = e.y + r.measured.height - y.y2 + o[1][1];
					s = [[t, i], [n, a]];
				}
				let { position: d, positionAbsolute: f } = Gc({
					nodeId: t,
					nextPosition: a,
					nodeLookup: i,
					nodeExtent: s || o,
					nodeOrigin: u,
					onError: p
				});
				_ = _ || r.position.x !== d.x || r.position.y !== d.y, r.position = d, r.internals.positionAbsolute = f;
			}
			if (m ||= _, _ && (g(s, !0), h && (r || d || !b && f))) {
				let [e, t] = wu({
					nodeId: b,
					dragItems: s,
					nodeLookup: i
				});
				r?.(h, s, e, t), d?.(h, e, t), b || f?.(h, t);
			}
		}
		async function C() {
			if (!u) return;
			let { transform: e, panBy: n, autoPanSpeed: r, autoPanOnNodeDrag: i } = t();
			if (!i) {
				c = !1, cancelAnimationFrame(o);
				return;
			}
			let [s, d] = Zc(l, u, r);
			(s !== 0 || d !== 0) && (a.x = (a.x ?? 0) - s / e[2], a.y = (a.y ?? 0) - d / e[2], await n({
				x: s,
				y: d
			}) && S(a)), o = requestAnimationFrame(C);
		}
		function w(r) {
			let { nodeLookup: i, multiSelectionActive: o, nodesDraggable: c, transform: l, snapGrid: f, snapToGrid: p, selectNodesOnDrag: m, onNodeDragStart: h, onSelectionDragStart: g, unselectNodesAndEdges: _ } = t();
			d = !0, (!m || !y) && !o && b && (i.get(b)?.selected || _()), y && m && b && e?.(b);
			let v = Tl(r.sourceEvent, {
				transform: l,
				snapGrid: f,
				snapToGrid: p,
				containerBounds: u
			});
			if (a = v, s = Cu(i, c, v, b), s.size > 0 && (n || h || !b && g)) {
				let [e, t] = wu({
					nodeId: b,
					dragItems: s,
					nodeLookup: i
				});
				n?.(r.sourceEvent, s, e, t), h?.(r.sourceEvent, e, t), b || g?.(r.sourceEvent, t);
			}
		}
		let T = sa().clickDistance(x).on("start", (e) => {
			let { domNode: n, nodeDragThreshold: r, transform: i, snapGrid: o, snapToGrid: s } = t();
			u = n?.getBoundingClientRect() || null, p = !1, m = !1, h = e.sourceEvent, r === 0 && w(e), a = Tl(e.sourceEvent, {
				transform: i,
				snapGrid: o,
				snapToGrid: s,
				containerBounds: u
			}), l = jl(e.sourceEvent, u);
		}).on("drag", (e) => {
			let { autoPanOnNodeDrag: n, transform: r, snapGrid: i, snapToGrid: o, nodeDragThreshold: f, nodeLookup: m } = t(), g = Tl(e.sourceEvent, {
				transform: r,
				snapGrid: i,
				snapToGrid: o,
				containerBounds: u
			});
			if (h = e.sourceEvent, (e.sourceEvent.type === "touchmove" && e.sourceEvent.touches.length > 1 || b && !m.has(b)) && (p = !0), !p) {
				if (!c && n && d && (c = !0, C()), !d) {
					let t = jl(e.sourceEvent, u), n = t.x - l.x, r = t.y - l.y;
					Math.sqrt(n * n + r * r) > f && w(e);
				}
				(a.x !== g.xSnapped || a.y !== g.ySnapped) && s && d && (l = jl(e.sourceEvent, u), S(g));
			}
		}).on("end", (e) => {
			if (!d || p) p && s.size > 0 && t().updateNodePositions(s, !1);
			else if (c = !1, d = !1, cancelAnimationFrame(o), s.size > 0) {
				let { nodeLookup: n, updateNodePositions: r, onNodeDragStop: a, onSelectionDragStop: o } = t();
				if (m &&= (r(s, !1), !1), i || a || !b && o) {
					let [t, r] = wu({
						nodeId: b,
						dragItems: s,
						nodeLookup: n,
						dragging: !1
					});
					i?.(e.sourceEvent, s, t, r), a?.(e.sourceEvent, t, r), b || o?.(e.sourceEvent, r);
				}
			}
		}).filter((e) => {
			let t = e.target;
			return !e.button && (!g || !Su(t, `.${g}`, v)) && (!_ || Su(t, _, v));
		});
		f.call(T);
	}
	function _() {
		f?.on(".drag", null);
	}
	return {
		update: g,
		destroy: _
	};
}
function Du(e, t, n) {
	let r = [], i = {
		x: e.x - n,
		y: e.y - n,
		width: n * 2,
		height: n * 2
	};
	for (let e of t.values()) al(i, tl(e)) > 0 && r.push(e);
	return r;
}
var Ou = 250;
function ku(e, t, n, r) {
	let i = [], a = Infinity, o = Du(e, n, t + Ou);
	for (let n of o) {
		let o = [...n.internals.handleBounds?.source ?? [], ...n.internals.handleBounds?.target ?? []];
		for (let s of o) {
			if (r.nodeId === s.nodeId && r.type === s.type && r.id === s.id) continue;
			let { x: o, y: c } = $l(n, s, s.position, !0), l = Math.sqrt((o - e.x) ** 2 + (c - e.y) ** 2);
			l > t || (l < a ? (i = [{
				...s,
				x: o,
				y: c
			}], a = l) : l === a && i.push({
				...s,
				x: o,
				y: c
			}));
		}
	}
	if (!i.length) return null;
	if (i.length > 1) {
		let e = r.type === "source" ? "target" : "source";
		return i.find((t) => t.type === e) ?? i[0];
	}
	return i[0];
}
function Au(e, t, n, r, i, a = !1) {
	let o = r.get(e);
	if (!o) return null;
	let s = i === "strict" ? o.internals.handleBounds?.[t] : [...o.internals.handleBounds?.source ?? [], ...o.internals.handleBounds?.target ?? []], c = (n ? s?.find((e) => e.id === n) : s?.[0]) ?? null;
	return c && a ? {
		...c,
		...$l(o, c, c.position, !0)
	} : c;
}
function ju(e, t) {
	return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Mu(e, t) {
	let n = null;
	return t ? n = !0 : e && !t && (n = !1), n;
}
var Nu = () => !0;
function Pu(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: i, edgeUpdaterType: a, isTarget: o, domNode: s, nodeLookup: c, lib: l, autoPanOnConnect: u, flowId: d, panBy: f, cancelConnection: p, onConnectStart: m, onConnect: h, onConnectEnd: g, isValidConnection: _ = Nu, onReconnectEnd: v, updateConnection: y, getTransform: b, getFromHandle: x, autoPanSpeed: S, dragThreshold: C = 1, handleDomNode: w }) {
	let T = Dl(e.target), E = 0, D, { x: O, y: k } = jl(e), A = ju(a, w), j = s?.getBoundingClientRect(), M = !1;
	if (!j || !A) return;
	let N = Au(i, A, r, c, t);
	if (!N) return;
	let P = jl(e, j), ee = !1, F = null, I = !1, L = null;
	function R() {
		if (!u || !j) return;
		let [e, t] = Zc(P, j, S);
		f({
			x: e,
			y: t
		}), E = requestAnimationFrame(R);
	}
	let z = {
		...N,
		nodeId: i,
		type: A,
		position: N.position
	}, B = c.get(i), V = {
		inProgress: !0,
		isValid: null,
		from: $l(B, z, X.Left, !0),
		fromHandle: z,
		fromPosition: z.position,
		fromNode: B,
		to: P,
		toHandle: null,
		toPosition: Pc[z.position],
		toNode: null,
		pointer: P
	};
	function H() {
		M = !0, y(V), m?.(e, {
			nodeId: i,
			handleId: r,
			handleType: A
		});
	}
	C === 0 && H();
	function U(e) {
		if (!M) {
			let { x: t, y: n } = jl(e), r = t - O, i = n - k;
			if (!(r * r + i * i > C * C)) return;
			H();
		}
		if (!x() || !z) {
			W(e);
			return;
		}
		let a = b();
		P = jl(e, j), D = ku(ul(P, a, !1, [1, 1]), n, c, z), ee ||= (R(), !0);
		let s = Fu(e, {
			handle: D,
			connectionMode: t,
			fromNodeId: i,
			fromHandleId: r,
			fromType: o ? "target" : "source",
			isValidConnection: _,
			doc: T,
			lib: l,
			flowId: d,
			nodeLookup: c
		});
		L = s.handleDomNode, F = s.connection, I = Mu(!!D, s.isValid);
		let u = c.get(i), f = u ? $l(u, z, X.Left, !0) : V.from, p = {
			...V,
			from: f,
			isValid: I,
			to: s.toHandle && I ? dl({
				x: s.toHandle.x,
				y: s.toHandle.y
			}, a) : P,
			toHandle: s.toHandle,
			toPosition: I && s.toHandle ? s.toHandle.position : Pc[z.position],
			toNode: s.toHandle ? c.get(s.toHandle.nodeId) : null,
			pointer: P
		};
		y(p), V = p;
	}
	function W(e) {
		if (!("touches" in e && e.touches.length > 0)) {
			if (M) {
				(D || L) && F && I && h?.(F);
				let { inProgress: t, ...n } = V, r = {
					...n,
					toPosition: V.toHandle ? V.toPosition : null
				};
				g?.(e, r), a && v?.(e, r);
			}
			p(), cancelAnimationFrame(E), ee = !1, I = !1, F = null, L = null, T.removeEventListener("mousemove", U), T.removeEventListener("mouseup", W), T.removeEventListener("touchmove", U), T.removeEventListener("touchend", W);
		}
	}
	T.addEventListener("mousemove", U), T.addEventListener("mouseup", W), T.addEventListener("touchmove", U), T.addEventListener("touchend", W);
}
function Fu(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: i, fromType: a, doc: o, lib: s, flowId: c, isValidConnection: l = Nu, nodeLookup: u }) {
	let d = a === "target", f = t ? o.querySelector(`.${s}-flow__handle[data-id="${c}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: p, y: m } = jl(e), h = o.elementFromPoint(p, m), g = h?.classList.contains(`${s}-flow__handle`) ? h : f, _ = {
		handleDomNode: g,
		isValid: !1,
		connection: null,
		toHandle: null
	};
	if (g) {
		let e = ju(void 0, g), t = g.getAttribute("data-nodeid"), a = g.getAttribute("data-handleid"), o = g.classList.contains("connectable"), s = g.classList.contains("connectableend");
		if (!t || !e) return _;
		let c = {
			source: d ? t : r,
			sourceHandle: d ? a : i,
			target: d ? r : t,
			targetHandle: d ? i : a
		};
		_.connection = c, _.isValid = o && s && (n === Oc.Strict ? d && e === "source" || !d && e === "target" : t !== r || a !== i) && l(c), _.toHandle = Au(t, e, a, u, n, !0);
	}
	return _;
}
var Iu = {
	onPointerDown: Pu,
	isValid: Fu
};
function Lu({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
	let i = Ki(e);
	function a({ translateExtent: e, width: a, height: o, zoomStep: s = 1, pannable: c = !0, zoomable: l = !0, inversePan: u = !1 }) {
		let d = (e) => {
			if (e.sourceEvent.type !== "wheel" || !t) return;
			let r = n(), i = e.sourceEvent.ctrlKey && gl() ? 10 : 1, a = -e.sourceEvent.deltaY * (e.sourceEvent.deltaMode === 1 ? .05 : e.sourceEvent.deltaMode ? 1 : .002) * s, o = r[2] * 2 ** (a * i);
			t.scaleTo(o);
		}, f = [0, 0], p = Cc().on("start", (e) => {
			(e.sourceEvent.type === "mousedown" || e.sourceEvent.type === "touchstart") && (f = [e.sourceEvent.clientX ?? e.sourceEvent.touches[0].clientX, e.sourceEvent.clientY ?? e.sourceEvent.touches[0].clientY]);
		}).on("zoom", c ? (i) => {
			let s = n();
			if (i.sourceEvent.type !== "mousemove" && i.sourceEvent.type !== "touchmove" || !t) return;
			let c = [i.sourceEvent.clientX ?? i.sourceEvent.touches[0].clientX, i.sourceEvent.clientY ?? i.sourceEvent.touches[0].clientY], l = [c[0] - f[0], c[1] - f[1]];
			f = c;
			let d = r() * Math.max(s[2], Math.log(s[2])) * (u ? -1 : 1), p = {
				x: s[0] - l[0] * d,
				y: s[1] - l[1] * d
			}, m = [[0, 0], [a, o]];
			t.setViewportConstrained({
				x: p.x,
				y: p.y,
				zoom: s[2]
			}, m, e);
		} : null).on("zoom.wheel", l ? d : null);
		i.call(p, {});
	}
	function o() {
		i.on("zoom", null);
	}
	return {
		update: a,
		destroy: o,
		pointer: Ji
	};
}
var Ru = (e) => ({
	x: e.x,
	y: e.y,
	zoom: e.k
}), zu = ({ x: e, y: t, zoom: n }) => pc.translate(e, t).scale(n), Bu = (e, t) => e.target.closest(`.${t}`), Vu = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), Hu = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Uu = (e, t = 0, n = Hu, r = () => {}) => {
	let i = typeof t == "number" && t > 0;
	return i || r(), i ? e.transition().duration(t).ease(n).on("end", r) : e;
}, Wu = (e) => {
	let t = e.ctrlKey && gl() ? 10 : 1;
	return -e.deltaY * (e.deltaMode === 1 ? .05 : e.deltaMode ? 1 : .002) * t;
};
function Gu({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: i, panOnScrollSpeed: a, zoomOnPinch: o, onPanZoomStart: s, onPanZoom: c, onPanZoomEnd: l }) {
	return (u) => {
		if (Bu(u, t)) return u.ctrlKey && u.preventDefault(), !1;
		u.preventDefault(), u.stopImmediatePropagation();
		let d = n.property("__zoom").k || 1;
		if (u.ctrlKey && o) {
			let e = Ji(u), t = d * 2 ** Wu(u);
			r.scaleTo(n, t, e, u);
			return;
		}
		let f = u.deltaMode === 1 ? 20 : 1, p = i === kc.Vertical ? 0 : u.deltaX * f, m = i === kc.Horizontal ? 0 : u.deltaY * f;
		!gl() && u.shiftKey && i !== kc.Vertical && (p = u.deltaY * f, m = 0), r.translateBy(n, -(p / d) * a, -(m / d) * a, { internal: !0 });
		let h = Ru(n.property("__zoom"));
		clearTimeout(e.panScrollTimeout), e.isPanScrolling ? c?.(u, h) : (e.isPanScrolling = !0, s?.(u, h)), e.panScrollTimeout = setTimeout(() => {
			l?.(u, h), e.isPanScrolling = !1;
		}, 150);
	};
}
function Ku({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
	return function(r, i) {
		let a = r.type === "wheel", o = !t && a && !r.ctrlKey, s = Bu(r, e);
		if (r.ctrlKey && a && s && r.preventDefault(), o || s) return null;
		r.preventDefault(), n.call(this, r, i);
	};
}
function qu({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
	return (r) => {
		if (r.sourceEvent?.internal) return;
		let i = Ru(r.transform);
		e.mouseButton = r.sourceEvent?.button || 0, e.isZoomingOrPanning = !0, e.prevViewport = i, r.sourceEvent?.type === "mousedown" && t(!0), n && n?.(r.sourceEvent, i);
	};
}
function Ju({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: i }) {
	return (a) => {
		e.usedRightMouseButton = !!(n && Vu(t, e.mouseButton ?? 0)), a.sourceEvent?.sync || r([
			a.transform.x,
			a.transform.y,
			a.transform.k
		]), i && !a.sourceEvent?.internal && i?.(a.sourceEvent, Ru(a.transform));
	};
}
function Yu({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: i, onPaneContextMenu: a }) {
	return (o) => {
		if (!o.sourceEvent?.internal && (e.isZoomingOrPanning = !1, a && Vu(t, e.mouseButton ?? 0) && !e.usedRightMouseButton && o.sourceEvent && a(o.sourceEvent), e.usedRightMouseButton = !1, r(!1), i)) {
			let t = Ru(o.transform);
			e.prevViewport = t, clearTimeout(e.timerId), e.timerId = setTimeout(() => {
				i?.(o.sourceEvent, t);
			}, n ? 150 : 0);
		}
	};
}
function Xu({ panActivationKeyPressed: e, zoomActivationKeyPressed: t, zoomOnScroll: n, zoomOnPinch: r, panOnDrag: i, panOnScroll: a, zoomOnDoubleClick: o, userSelectionActive: s, noWheelClassName: c, noPanClassName: l, lib: u, connectionInProgress: d }) {
	return (f) => {
		let p = t || n, m = r && f.ctrlKey, h = f.type === "wheel";
		if (f.button === 1 && f.type === "mousedown" && (Bu(f, `${u}-flow__node`) || Bu(f, `${u}-flow__edge`) || Bu(f, `${u}-flow__selection`) || Bu(f, `${u}-flow__nodesselection`))) return !0;
		if (!i && !p && !a && !o && !r || s || d && !h || Bu(f, c) && h || Bu(f, l) && (!h || a && h && !t) || !r && f.ctrlKey && h) return !1;
		if (!r && f.type === "touchstart" && f.touches?.length > 1) return f.preventDefault(), !1;
		if (!p && !a && !m && h || !i && (f.type === "mousedown" || f.type === "touchstart") || Array.isArray(i) && !i.includes(f.button) && f.type === "mousedown") return !1;
		let g = Array.isArray(i) && i.includes(f.button) || !f.button || f.button <= 1;
		return (!f.ctrlKey || h || e) && g;
	};
}
function Zu({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: i, onPanZoom: a, onPanZoomStart: o, onPanZoomEnd: s, onDraggingChange: c }) {
	let l = {
		isZoomingOrPanning: !1,
		usedRightMouseButton: !1,
		prevViewport: {},
		mouseButton: 0,
		timerId: void 0,
		panScrollTimeout: void 0,
		isPanScrolling: !1
	}, u = e.getBoundingClientRect(), d = [[0, 0], [u.width, u.height]];
	(typeof ResizeObserver < "u" ? new ResizeObserver((e) => {
		let t = e[0];
		t && (d = [[0, 0], [t.contentRect.width, t.contentRect.height]]);
	}) : null)?.observe(e);
	let f = Cc().extent(() => d).scaleExtent([t, n]).translateExtent(r), p = Ki(e).call(f);
	y({
		x: i.x,
		y: i.y,
		zoom: qc(i.zoom, t, n)
	}, [[0, 0], [u.width, u.height]], r);
	let m = p.on("wheel.zoom"), h = p.on("dblclick.zoom");
	f.wheelDelta(Wu);
	async function g(e, t) {
		return p ? new Promise((n) => {
			f?.interpolate(t?.interpolate === "linear" ? lo : wo).transform(Uu(p, t?.duration, t?.ease, () => n(!0)), e);
		}) : !1;
	}
	function _({ noWheelClassName: e, noPanClassName: t, onPaneContextMenu: n, userSelectionActive: r, panOnScroll: i, panOnDrag: u, panOnScrollMode: d, panOnScrollSpeed: g, preventScrolling: _, zoomOnPinch: y, zoomOnScroll: b, zoomOnDoubleClick: x, panActivationKeyPressed: S = !1, zoomActivationKeyPressed: C, lib: w, onTransformChange: T, connectionInProgress: E, paneClickDistance: D, selectionOnDrag: O }) {
		r && !l.isZoomingOrPanning && v();
		let k = i && !C && !r;
		f.clickDistance(O ? Infinity : !sl(D) || D < 0 ? 0 : D);
		let A = k ? Gu({
			zoomPanValues: l,
			noWheelClassName: e,
			d3Selection: p,
			d3Zoom: f,
			panOnScrollMode: d,
			panOnScrollSpeed: g,
			zoomOnPinch: y,
			onPanZoomStart: o,
			onPanZoom: a,
			onPanZoomEnd: s
		}) : Ku({
			noWheelClassName: e,
			preventScrolling: _,
			d3ZoomHandler: m
		});
		p.on("wheel.zoom", A, { passive: !1 });
		let j = qu({
			zoomPanValues: l,
			onDraggingChange: c,
			onPanZoomStart: o
		});
		f.on("start", j);
		let M = Ju({
			zoomPanValues: l,
			panOnDrag: u,
			onPaneContextMenu: !!n,
			onPanZoom: a,
			onTransformChange: T
		});
		f.on("zoom", M);
		let N = Yu({
			zoomPanValues: l,
			panOnDrag: u,
			panOnScroll: i,
			onPaneContextMenu: n,
			onPanZoomEnd: s,
			onDraggingChange: c
		});
		f.on("end", N);
		let P = Xu({
			panActivationKeyPressed: S,
			zoomActivationKeyPressed: C,
			panOnDrag: u,
			zoomOnScroll: b,
			panOnScroll: i,
			zoomOnDoubleClick: x,
			zoomOnPinch: y,
			userSelectionActive: r,
			noPanClassName: t,
			noWheelClassName: e,
			lib: w,
			connectionInProgress: E
		});
		f.filter(P), x ? p.on("dblclick.zoom", h) : p.on("dblclick.zoom", null);
	}
	function v() {
		f.on("zoom", null);
	}
	async function y(e, t, n) {
		let r = zu(e), i = f?.constrain()(r, t, n);
		return i && await g(i), i;
	}
	async function b(e, t) {
		let n = zu(e);
		return await g(n, t), n;
	}
	function x(e) {
		if (p) {
			let t = zu(e), n = p.property("__zoom");
			(n.k !== e.zoom || n.x !== e.x || n.y !== e.y) && f?.transform(p, t, null, { sync: !0 });
		}
	}
	function S() {
		let e = p ? mc(p.node()) : {
			x: 0,
			y: 0,
			k: 1
		};
		return {
			x: e.x,
			y: e.y,
			zoom: e.k
		};
	}
	async function C(e, t) {
		return p ? new Promise((n) => {
			f?.interpolate(t?.interpolate === "linear" ? lo : wo).scaleTo(Uu(p, t?.duration, t?.ease, () => n(!0)), e);
		}) : !1;
	}
	async function w(e, t) {
		return p ? new Promise((n) => {
			f?.interpolate(t?.interpolate === "linear" ? lo : wo).scaleBy(Uu(p, t?.duration, t?.ease, () => n(!0)), e);
		}) : !1;
	}
	function T(e) {
		f?.scaleExtent(e);
	}
	function E(e) {
		f?.translateExtent(e);
	}
	function D(e) {
		let t = !sl(e) || e < 0 ? 0 : e;
		f?.clickDistance(t);
	}
	return {
		update: _,
		destroy: v,
		setViewport: b,
		setViewportConstrained: y,
		getViewport: S,
		scaleTo: C,
		scaleBy: w,
		setScaleExtent: T,
		setTranslateExtent: E,
		syncViewport: x,
		setClickDistance: D
	};
}
var Qu;
(function(e) {
	e.Line = "line", e.Handle = "handle";
})(Qu ||= {});
function $u({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: i, affectsY: a }) {
	let o = e - t, s = n - r, c = [o > 0 ? 1 : o < 0 ? -1 : 0, s > 0 ? 1 : s < 0 ? -1 : 0];
	return o && i && (c[0] *= -1), s && a && (c[1] *= -1), c;
}
function ed(e) {
	return {
		isHorizontal: e.includes("right") || e.includes("left"),
		isVertical: e.includes("bottom") || e.includes("top"),
		affectsX: e.includes("left"),
		affectsY: e.includes("top")
	};
}
function td(e, t) {
	return Math.max(0, t - e);
}
function nd(e, t) {
	return Math.max(0, e - t);
}
function rd(e, t, n) {
	return Math.max(0, t - e, e - n);
}
function id(e, t) {
	return e ? !t : t;
}
function ad(e, t, n, r, i, a, o, s) {
	let { affectsX: c, affectsY: l } = t, { isHorizontal: u, isVertical: d } = t, f = u && d, { xSnapped: p, ySnapped: m } = n, { minWidth: h, maxWidth: g, minHeight: _, maxHeight: v } = r, { x: y, y: b, width: x, height: S, aspectRatio: C } = e, w = Math.floor(u ? p - e.pointerX : 0), T = Math.floor(d ? m - e.pointerY : 0), E = x + (c ? -w : w), D = S + (l ? -T : T), O = -a[0] * x, k = -a[1] * S, A = rd(E, h, g), j = rd(D, _, v);
	if (o) {
		let e = 0, t = 0;
		c && w < 0 ? e = td(y + w + O, o[0][0]) : !c && w > 0 && (e = nd(y + E + O, o[1][0])), l && T < 0 ? t = td(b + T + k, o[0][1]) : !l && T > 0 && (t = nd(b + D + k, o[1][1])), A = Math.max(A, e), j = Math.max(j, t);
	}
	if (s) {
		let e = 0, t = 0;
		c && w > 0 ? e = nd(y + w, s[0][0]) : !c && w < 0 && (e = td(y + E, s[1][0])), l && T > 0 ? t = nd(b + T, s[0][1]) : !l && T < 0 && (t = td(b + D, s[1][1])), A = Math.max(A, e), j = Math.max(j, t);
	}
	if (i) {
		if (u) {
			let e = rd(E / C, _, v) * C;
			if (A = Math.max(A, e), o) {
				let e = 0;
				e = !c && !l || c && !l && f ? nd(b + k + E / C, o[1][1]) * C : td(b + k + (c ? w : -w) / C, o[0][1]) * C, A = Math.max(A, e);
			}
			if (s) {
				let e = 0;
				e = !c && !l || c && !l && f ? td(b + E / C, s[1][1]) * C : nd(b + (c ? w : -w) / C, s[0][1]) * C, A = Math.max(A, e);
			}
		}
		if (d) {
			let e = rd(D * C, h, g) / C;
			if (j = Math.max(j, e), o) {
				let e = 0;
				e = !c && !l || l && !c && f ? nd(y + D * C + O, o[1][0]) / C : td(y + (l ? T : -T) * C + O, o[0][0]) / C, j = Math.max(j, e);
			}
			if (s) {
				let e = 0;
				e = !c && !l || l && !c && f ? td(y + D * C, s[1][0]) / C : nd(y + (l ? T : -T) * C, s[0][0]) / C, j = Math.max(j, e);
			}
		}
	}
	T += T < 0 ? j : -j, w += w < 0 ? A : -A, i && (f ? E > D * C ? T = (id(c, l) ? -w : w) / C : w = (id(c, l) ? -T : T) * C : u ? (T = w / C, l = c) : (w = T * C, c = l));
	let M = c ? y + w : y, N = l ? b + T : b;
	return {
		width: x + (c ? -w : w),
		height: S + (l ? -T : T),
		x: a[0] * w * (c ? -1 : 1) + M,
		y: a[1] * T * (l ? -1 : 1) + N
	};
}
var od = {
	width: 0,
	height: 0,
	x: 0,
	y: 0
}, sd = {
	...od,
	pointerX: 0,
	pointerY: 0,
	aspectRatio: 1
};
function cd(e, t, n) {
	let r = t.position.x + e.position.x, i = t.position.y + e.position.y, a = e.measured.width ?? 0, o = e.measured.height ?? 0, s = n[0] * a, c = n[1] * o;
	return [[r - s, i - c], [r + a - s, i + o - c]];
}
function ld({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: i }) {
	let a = Ki(e), o = {
		controlDirection: ed("bottom-right"),
		boundaries: {
			minWidth: 0,
			minHeight: 0,
			maxWidth: Number.MAX_VALUE,
			maxHeight: Number.MAX_VALUE
		},
		resizeDirection: void 0,
		keepAspectRatio: !1
	};
	function s({ controlPosition: e, boundaries: s, keepAspectRatio: c, resizeDirection: l, onResizeStart: u, onResize: d, onResizeEnd: f, shouldResize: p }) {
		let m = { ...od }, h = { ...sd };
		o = {
			boundaries: s,
			resizeDirection: l,
			keepAspectRatio: c,
			controlDirection: ed(e)
		};
		let g, _ = null, v = [], y, b, x, S = sa().on("start", (e) => {
			let { nodeLookup: r, transform: i, snapGrid: a, snapToGrid: o, nodeOrigin: s, paneDomNode: c } = n();
			if (g = r.get(t), !g) return;
			_ = c?.getBoundingClientRect() ?? null;
			let { xSnapped: l, ySnapped: d } = Tl(e.sourceEvent, {
				transform: i,
				snapGrid: a,
				snapToGrid: o,
				containerBounds: _
			});
			m = {
				width: g.measured.width ?? 0,
				height: g.measured.height ?? 0,
				x: g.position.x ?? 0,
				y: g.position.y ?? 0
			}, h = {
				...m,
				pointerX: l,
				pointerY: d,
				aspectRatio: m.width / m.height
			}, y = void 0, b = _l(g.extent) ? g.extent : void 0, g.parentId && (g.extent === "parent" || g.expandParent) && (y = r.get(g.parentId)), y && g.extent === "parent" && (b = [[0, 0], [y.measured.width, y.measured.height]]), v = [], x = void 0;
			for (let [e, n] of r) if (n.parentId === t && (v.push({
				id: e,
				position: { ...n.position },
				extent: n.extent
			}), n.extent === "parent" || n.expandParent)) {
				let e = cd(n, g, n.origin ?? s);
				x = x ? [[Math.min(e[0][0], x[0][0]), Math.min(e[0][1], x[0][1])], [Math.max(e[1][0], x[1][0]), Math.max(e[1][1], x[1][1])]] : e;
			}
			u?.(e, { ...m });
		}).on("drag", (e) => {
			let { transform: t, snapGrid: i, snapToGrid: a, nodeOrigin: s } = n(), c = Tl(e.sourceEvent, {
				transform: t,
				snapGrid: i,
				snapToGrid: a,
				containerBounds: _
			}), l = [];
			if (!g) return;
			let { x: u, y: f, width: S, height: C } = m, w = {}, T = g.origin ?? s, { width: E, height: D, x: O, y: k } = ad(h, o.controlDirection, c, o.boundaries, o.keepAspectRatio, T, b, x), A = E !== S, j = D !== C, M = O !== u && A, N = k !== f && j;
			if (!M && !N && !A && !j) return;
			let P = {
				prevValues: { ...m },
				startX: h.x,
				startY: h.y,
				childNodes: v.map((e) => ({
					...e,
					position: { ...e.position }
				}))
			};
			if ((M || N || T[0] === 1 || T[1] === 1) && (w.x = M ? O : m.x, w.y = N ? k : m.y, m.x = w.x, m.y = w.y, v.length > 0)) {
				let e = O - u, t = k - f;
				for (let n of v) n.position = {
					x: n.position.x - e + T[0] * (E - S),
					y: n.position.y - t + T[1] * (D - C)
				}, l.push(n);
			}
			if ((A || j) && (w.width = A && (!o.resizeDirection || o.resizeDirection === "horizontal") ? E : m.width, w.height = j && (!o.resizeDirection || o.resizeDirection === "vertical") ? D : m.height, m.width = w.width, m.height = w.height), y && g.expandParent) {
				let e = T[0] * (w.width ?? 0);
				w.x && w.x < e && (m.x = e, h.x -= w.x - e);
				let t = T[1] * (w.height ?? 0);
				w.y && w.y < t && (m.y = t, h.y -= w.y - t);
			}
			let ee = $u({
				width: m.width,
				prevWidth: S,
				height: m.height,
				prevHeight: C,
				affectsX: o.controlDirection.affectsX,
				affectsY: o.controlDirection.affectsY
			}), F = {
				...m,
				direction: ee
			};
			p?.(e, F) === !1 ? (m = P.prevValues, h.x = P.startX, h.y = P.startY, v.forEach((e, t) => {
				e.position = P.childNodes[t].position;
			})) : (d?.(e, F), r(w, l));
		}).on("end", (e) => {
			f?.(e, { ...m }), i?.({ ...m });
		});
		a.call(S);
	}
	function c() {
		a.on(".drag", null);
	}
	return {
		update: s,
		destroy: c
	};
}
//#endregion
//#region node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var ud = /* @__PURE__ */ e(((e) => {
	var t = c();
	function n(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var r = typeof Object.is == "function" ? Object.is : n, i = t.useState, a = t.useEffect, o = t.useLayoutEffect, s = t.useDebugValue;
	function l(e, t) {
		var n = t(), r = i({ inst: {
			value: n,
			getSnapshot: t
		} }), c = r[0].inst, l = r[1];
		return o(function() {
			c.value = n, c.getSnapshot = t, u(c) && l({ inst: c });
		}, [
			e,
			n,
			t
		]), a(function() {
			return u(c) && l({ inst: c }), e(function() {
				u(c) && l({ inst: c });
			});
		}, [e]), s(n), n;
	}
	function u(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !r(e, n);
		} catch {
			return !0;
		}
	}
	function d(e, t) {
		return t();
	}
	var f = typeof window > "u" || window.document === void 0 || window.document.createElement === void 0 ? d : l;
	e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore;
})), dd = /* @__PURE__ */ e(((e, t) => {
	t.exports = ud();
})), fd = /* @__PURE__ */ e(((e) => {
	var t = c(), n = dd();
	function r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var i = typeof Object.is == "function" ? Object.is : r, a = n.useSyncExternalStore, o = t.useRef, s = t.useEffect, l = t.useMemo, u = t.useDebugValue;
	e.useSyncExternalStoreWithSelector = function(e, t, n, r, c) {
		var d = o(null);
		if (d.current === null) {
			var f = {
				hasValue: !1,
				value: null
			};
			d.current = f;
		} else f = d.current;
		d = l(function() {
			function e(e) {
				if (!a) {
					if (a = !0, o = e, e = r(e), c !== void 0 && f.hasValue) {
						var t = f.value;
						if (c(t, e)) return s = t;
					}
					return s = e;
				}
				if (t = s, i(o, e)) return t;
				var n = r(e);
				return c !== void 0 && c(t, n) ? (o = e, t) : (o = e, s = n);
			}
			var a = !1, o, s, l = n === void 0 ? null : n;
			return [function() {
				return e(t());
			}, l === null ? void 0 : function() {
				return e(l());
			}];
		}, [
			t,
			n,
			r,
			c
		]);
		var p = a(e, d[0], d[1]);
		return s(function() {
			f.hasValue = !0, f.value = p;
		}, [p]), u(p), p;
	};
})), pd = /* @__PURE__ */ t((/* @__PURE__ */ e(((e, t) => {
	t.exports = fd();
})))(), 1), md = (e) => {
	let t, n = /* @__PURE__ */ new Set(), r = (e, r) => {
		let i = typeof e == "function" ? e(t) : e;
		if (!Object.is(i, t)) {
			let e = t;
			t = r ?? (typeof i != "object" || !i) ? i : Object.assign({}, t, i), n.forEach((n) => n(t, e));
		}
	}, i = () => t, a = {
		setState: r,
		getState: i,
		getInitialState: () => o,
		subscribe: (e) => (n.add(e), () => n.delete(e)),
		destroy: () => {
			n.clear();
		}
	}, o = t = e(r, i, a);
	return a;
}, hd = (e) => e ? md(e) : md, { useDebugValue: gd } = l.default, { useSyncExternalStoreWithSelector: _d } = pd.default, vd = (e) => e;
function yd(e, t = vd, n) {
	let r = _d(e.subscribe, e.getState, e.getServerState || e.getInitialState, t, n);
	return gd(r), r;
}
var bd = (e, t) => {
	let n = hd(e), r = (e, r = t) => yd(n, e, r);
	return Object.assign(r, n), r;
}, xd = (e, t) => e ? bd(e, t) : bd;
//#endregion
//#region node_modules/zustand/esm/shallow.mjs
function Z(e, t) {
	if (Object.is(e, t)) return !0;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
	if (e instanceof Map && t instanceof Map) {
		if (e.size !== t.size) return !1;
		for (let [n, r] of e) if (!Object.is(r, t.get(n))) return !1;
		return !0;
	}
	if (e instanceof Set && t instanceof Set) {
		if (e.size !== t.size) return !1;
		for (let n of e) if (!t.has(n)) return !1;
		return !0;
	}
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.prototype.hasOwnProperty.call(t, r) || !Object.is(e[r], t[r])) return !1;
	return !0;
}
n();
var Sd = (0, l.createContext)(null), Cd = Sd.Provider, wd = wc.error001("react");
function Q(e, t) {
	let n = (0, l.useContext)(Sd);
	if (n === null) throw Error(wd);
	return yd(n, e, t);
}
function $() {
	let e = (0, l.useContext)(Sd);
	if (e === null) throw Error(wd);
	return (0, l.useMemo)(() => ({
		getState: e.getState,
		setState: e.setState,
		subscribe: e.subscribe
	}), [e]);
}
var Td = { display: "none" }, Ed = {
	position: "absolute",
	width: 1,
	height: 1,
	margin: -1,
	border: 0,
	padding: 0,
	overflow: "hidden",
	clip: "rect(0px, 0px, 0px, 0px)",
	clipPath: "inset(100%)"
}, Dd = "react-flow__node-desc", Od = "react-flow__edge-desc", kd = "react-flow__aria-live", Ad = (e) => e.ariaLiveMessage, jd = (e) => e.ariaLabelConfig;
function Md({ rfId: e }) {
	let t = Q(Ad);
	return (0, K.jsx)("div", {
		id: `${kd}-${e}`,
		"aria-live": "assertive",
		"aria-atomic": "true",
		style: Ed,
		children: t
	});
}
function Nd({ rfId: e, disableKeyboardA11y: t }) {
	let n = Q(jd);
	return (0, K.jsxs)(K.Fragment, { children: [
		(0, K.jsx)("div", {
			id: `${Dd}-${e}`,
			style: Td,
			children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"]
		}),
		(0, K.jsx)("div", {
			id: `${Od}-${e}`,
			style: Td,
			children: n["edge.a11yDescription.default"]
		}),
		!t && (0, K.jsx)(Md, { rfId: e })
	] });
}
var Pd = (0, l.forwardRef)(({ position: e = "top-left", children: t, className: n, style: r, ...i }, a) => {
	let o = `${e}`.split("-");
	return (0, K.jsx)("div", {
		className: q([
			"react-flow__panel",
			n,
			...o
		]),
		style: r,
		ref: a,
		...i,
		children: t
	});
});
Pd.displayName = "Panel";
var Fd = "https://reactflow.dev?utm_source=attribution";
function Id({ proOptions: e, position: t = "bottom-right" }) {
	return (0, l.useEffect)(() => {}, []), e?.hideAttribution ? null : (0, K.jsx)(Pd, {
		position: t,
		className: "react-flow__attribution",
		"data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${Fd}`,
		children: (0, K.jsx)("a", {
			href: Fd,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": "React Flow attribution",
			children: "React Flow"
		})
	});
}
var Ld = (e) => {
	let t = [], n = [];
	for (let [, n] of e.nodeLookup) n.selected && t.push(n.internals.userNode);
	for (let [, t] of e.edgeLookup) t.selected && n.push(t);
	return {
		selectedNodes: t,
		selectedEdges: n
	};
}, Rd = (e) => e.id;
function zd(e, t) {
	return Z(e.selectedNodes.map(Rd), t.selectedNodes.map(Rd)) && Z(e.selectedEdges.map(Rd), t.selectedEdges.map(Rd));
}
function Bd({ onSelectionChange: e }) {
	let t = $(), { selectedNodes: n, selectedEdges: r } = Q(Ld, zd);
	return (0, l.useEffect)(() => {
		let i = {
			nodes: n,
			edges: r
		};
		e?.(i), t.getState().onSelectionChangeHandlers.forEach((e) => e(i));
	}, [
		n,
		r,
		e
	]), null;
}
var Vd = (e) => !!e.onSelectionChangeHandlers;
function Hd({ onSelectionChange: e }) {
	let t = Q(Vd);
	return e || t ? (0, K.jsx)(Bd, { onSelectionChange: e }) : null;
}
var Ud = [0, 0], Wd = {
	x: 0,
	y: 0,
	zoom: 1
}, Gd = [.../* @__PURE__ */ "nodes.edges.defaultNodes.defaultEdges.onConnect.onConnectStart.onConnectEnd.onClickConnectStart.onClickConnectEnd.nodesDraggable.autoPanOnNodeFocus.nodesConnectable.nodesFocusable.edgesFocusable.edgesReconnectable.elevateNodesOnSelect.elevateEdgesOnSelect.minZoom.maxZoom.nodeExtent.onNodesChange.onEdgesChange.elementsSelectable.connectionMode.snapGrid.snapToGrid.translateExtent.connectOnClick.defaultEdgeOptions.fitView.fitViewOptions.onNodesDelete.onEdgesDelete.onDelete.onNodeDrag.onNodeDragStart.onNodeDragStop.onSelectionDrag.onSelectionDragStart.onSelectionDragStop.onMoveStart.onMove.onMoveEnd.noPanClassName.nodeOrigin.autoPanOnConnect.autoPanOnNodeDrag.onError.connectionRadius.isValidConnection.selectNodesOnDrag.nodeDragThreshold.connectionDragThreshold.onBeforeDelete.debug.autoPanSpeed.ariaLabelConfig.zIndexMode".split("."), "rfId"], Kd = (e) => ({
	setNodes: e.setNodes,
	setEdges: e.setEdges,
	setMinZoom: e.setMinZoom,
	setMaxZoom: e.setMaxZoom,
	setTranslateExtent: e.setTranslateExtent,
	setNodeExtent: e.setNodeExtent,
	reset: e.reset,
	setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), qd = {
	translateExtent: Tc,
	nodeOrigin: Ud,
	minZoom: .5,
	maxZoom: 2,
	elementsSelectable: !0,
	noPanClassName: "nopan",
	rfId: "1"
};
function Jd(e) {
	let { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: i, setTranslateExtent: a, setNodeExtent: o, reset: s, setDefaultNodesAndEdges: c } = Q(Kd, Z), u = $();
	(0, l.useEffect)(() => (c(e.defaultNodes, e.defaultEdges), () => {
		d.current = qd, s();
	}), []);
	let d = (0, l.useRef)(qd);
	return (0, l.useEffect)(() => {
		for (let s of Gd) {
			let c = e[s];
			c !== d.current[s] && e[s] !== void 0 && (s === "nodes" ? t(c) : s === "edges" ? n(c) : s === "minZoom" ? r(c) : s === "maxZoom" ? i(c) : s === "translateExtent" ? a(c) : s === "nodeExtent" ? o(c) : s === "ariaLabelConfig" ? u.setState({ ariaLabelConfig: Cl(c) }) : s === "fitView" ? u.setState({ fitViewQueued: c }) : s === "fitViewOptions" ? u.setState({ fitViewOptions: c }) : u.setState({ [s]: c }));
		}
		d.current = e;
	}, Gd.map((t) => e[t])), null;
}
function Yd() {
	return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function Xd(e) {
	let [t, n] = (0, l.useState)(e === "system" ? null : e);
	return (0, l.useEffect)(() => {
		if (e !== "system") {
			n(e);
			return;
		}
		let t = Yd(), r = () => n(t?.matches ? "dark" : "light");
		return r(), t?.addEventListener("change", r), () => {
			t?.removeEventListener("change", r);
		};
	}, [e]), t === null ? Yd()?.matches ? "dark" : "light" : t;
}
var Zd = typeof document < "u" ? document : null;
function Qd(e = null, t = {
	target: Zd,
	actInsideInputWithModifier: !0
}) {
	let [n, r] = (0, l.useState)(!1), i = (0, l.useRef)(!1), a = (0, l.useRef)(/* @__PURE__ */ new Set([])), [o, s] = (0, l.useMemo)(() => {
		if (e !== null) {
			let t = (Array.isArray(e) ? e : [e]).filter((e) => typeof e == "string").map((e) => e.replace(/\+/g, "\n").replace("\n\n", "\n+").split("\n"));
			return [t, t.reduce((e, t) => e.concat(...t), [])];
		}
		return [[], []];
	}, [e]);
	return (0, l.useEffect)(() => {
		let n = t?.target ?? Zd, c = t?.actInsideInputWithModifier ?? !0;
		if (e !== null) {
			let e = (e) => {
				if (i.current = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey, (!i.current || i.current && !c) && kl(e)) return !1;
				let n = ef(e.code, s);
				if (a.current.add(e[n]), $d(o, a.current, !1)) {
					let n = e.composedPath?.()?.[0] || e.target, a = n?.nodeName === "BUTTON" || n?.nodeName === "A";
					t.preventDefault !== !1 && (i.current || !a) && e.preventDefault(), r(!0);
				}
			}, l = (e) => {
				let t = ef(e.code, s);
				$d(o, a.current, !0) ? (r(!1), a.current.clear()) : a.current.delete(e[t]), e.key === "Meta" && a.current.clear(), i.current = !1;
			}, u = () => {
				a.current.clear(), r(!1);
			};
			return n?.addEventListener("keydown", e), n?.addEventListener("keyup", l), window.addEventListener("blur", u), window.addEventListener("contextmenu", u), () => {
				n?.removeEventListener("keydown", e), n?.removeEventListener("keyup", l), window.removeEventListener("blur", u), window.removeEventListener("contextmenu", u);
			};
		}
	}, [e, r]), n;
}
function $d(e, t, n) {
	return e.filter((e) => n || e.length === t.size).some((e) => e.every((e) => t.has(e)));
}
function ef(e, t) {
	return t.includes(e) ? "code" : "key";
}
var tf = () => {
	let e = $();
	return (0, l.useMemo)(() => ({
		zoomIn: async (t) => {
			let { panZoom: n } = e.getState();
			return n ? n.scaleBy(1.2, t) : !1;
		},
		zoomOut: async (t) => {
			let { panZoom: n } = e.getState();
			return n ? n.scaleBy(1 / 1.2, t) : !1;
		},
		zoomTo: async (t, n) => {
			let { panZoom: r } = e.getState();
			return r ? r.scaleTo(t, n) : !1;
		},
		getZoom: () => e.getState().transform[2],
		setViewport: async (t, n) => {
			let { transform: [r, i, a], panZoom: o } = e.getState();
			return o ? (await o.setViewport({
				x: t.x ?? r,
				y: t.y ?? i,
				zoom: t.zoom ?? a
			}, n), !0) : !1;
		},
		getViewport: () => {
			let [t, n, r] = e.getState().transform;
			return {
				x: t,
				y: n,
				zoom: r
			};
		},
		setCenter: async (t, n, r) => e.getState().setCenter(t, n, r),
		fitBounds: async (t, n) => {
			let { width: r, height: i, minZoom: a, maxZoom: o, panZoom: s } = e.getState(), c = hl(t, r, i, a, o, n?.padding ?? .1);
			return s ? (await s.setViewport(c, {
				duration: n?.duration,
				ease: n?.ease,
				interpolate: n?.interpolate
			}), !0) : !1;
		},
		screenToFlowPosition: (t, n = {}) => {
			let { transform: r, snapGrid: i, snapToGrid: a, domNode: o } = e.getState();
			if (!o) return t;
			let { x: s, y: c } = o.getBoundingClientRect(), l = {
				x: t.x - s,
				y: t.y - c
			}, u = n.snapGrid ?? i;
			return ul(l, r, n.snapToGrid ?? a, u);
		},
		flowToScreenPosition: (t) => {
			let { transform: n, domNode: r } = e.getState();
			if (!r) return t;
			let { x: i, y: a } = r.getBoundingClientRect(), o = dl(t, n);
			return {
				x: o.x + i,
				y: o.y + a
			};
		}
	}), []);
};
function nf(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) if (t.type === "add") {
		i.push(t);
		continue;
	} else if (t.type === "remove" || t.type === "replace") r.set(t.id, [t]);
	else {
		let e = r.get(t.id);
		e ? e.push(t) : r.set(t.id, [t]);
	}
	for (let e of t) {
		let t = r.get(e.id);
		if (!t) {
			n.push(e);
			continue;
		}
		if (t[0].type === "remove") continue;
		if (t[0].type === "replace") {
			n.push({ ...t[0].item });
			continue;
		}
		let i = { ...e };
		for (let e of t) rf(e, i);
		n.push(i);
	}
	return i.length && i.forEach((e) => {
		e.index === void 0 ? n.push({ ...e.item }) : n.splice(e.index, 0, { ...e.item });
	}), n;
}
function rf(e, t) {
	switch (e.type) {
		case "select":
			t.selected = e.selected;
			break;
		case "position":
			e.position !== void 0 && (t.position = e.position), e.dragging !== void 0 && (t.dragging = e.dragging);
			break;
		case "dimensions": e.dimensions !== void 0 && (t.measured = { ...e.dimensions }, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
	}
}
function af(e, t) {
	return nf(e, t);
}
function of(e, t) {
	return nf(e, t);
}
function sf(e, t) {
	return {
		id: e,
		type: "select",
		selected: t
	};
}
function cf(e, t = /* @__PURE__ */ new Set(), n = !1) {
	let r = [];
	for (let [i, a] of e) {
		let e = t.has(i);
		(a.selected !== void 0 || e) && a.selected !== e && (n && (a.selected = e), r.push(sf(a.id, e)));
	}
	return r;
}
function lf({ items: e = [], lookup: t }) {
	let n = [], r = new Map(e.map((e) => [e.id, e]));
	for (let [r, i] of e.entries()) {
		let e = t.get(i.id), a = e?.internals?.userNode ?? e;
		a !== void 0 && a !== i && n.push({
			id: i.id,
			item: i,
			type: "replace"
		}), a === void 0 && n.push({
			item: i,
			type: "add",
			index: r
		});
	}
	for (let [e] of t) r.get(e) === void 0 && n.push({
		id: e,
		type: "remove"
	});
	return n;
}
function uf(e) {
	return {
		id: e.id,
		type: "remove"
	};
}
var df = cl("React Flow", "https://reactflow.dev/");
function ff(e, t, n = {}) {
	return Hl(e, t, {
		...n,
		onError: n.onError ?? df
	});
}
var pf = (e) => Ic(e), mf = (e) => Fc(e);
function hf(e) {
	return (0, l.forwardRef)(e);
}
var gf = typeof window < "u" ? l.useLayoutEffect : l.useEffect;
function _f(e) {
	let [t, n] = (0, l.useState)(BigInt(0)), [r] = (0, l.useState)(() => vf(() => n((e) => e + BigInt(1))));
	return gf(() => {
		let t = r.get();
		t.length && (e(t), r.reset());
	}, [t]), r;
}
function vf(e) {
	let t = [];
	return {
		get: () => t,
		reset: () => {
			t = [];
		},
		push: (n) => {
			t.push(n), e();
		}
	};
}
var yf = (0, l.createContext)(null);
function bf({ children: e }) {
	let t = $(), n = _f((0, l.useCallback)((e) => {
		let { nodes: n = [], setNodes: r, hasDefaultNodes: i, onNodesChange: a, nodeLookup: o, fitViewQueued: s, onNodesChangeMiddlewareMap: c } = t.getState(), l = n;
		for (let t of e) l = typeof t == "function" ? t(l) : t;
		let u = lf({
			items: l,
			lookup: o
		});
		for (let e of c.values()) u = e(u);
		i && r(l), u.length > 0 ? a?.(u) : s && window.requestAnimationFrame(() => {
			let { fitViewQueued: e, nodes: n, setNodes: r } = t.getState();
			e && r(n);
		});
	}, [])), r = _f((0, l.useCallback)((e) => {
		let { edges: n = [], setEdges: r, hasDefaultEdges: i, onEdgesChange: a, edgeLookup: o } = t.getState(), s = n;
		for (let t of e) s = typeof t == "function" ? t(s) : t;
		i ? r(s) : a && a(lf({
			items: s,
			lookup: o
		}));
	}, [])), i = (0, l.useMemo)(() => ({
		nodeQueue: n,
		edgeQueue: r
	}), []);
	return (0, K.jsx)(yf.Provider, {
		value: i,
		children: e
	});
}
function xf() {
	let e = (0, l.useContext)(yf);
	if (!e) throw Error("useBatchContext must be used within a BatchProvider");
	return e;
}
var Sf = (e) => !!e.panZoom;
function Cf() {
	let e = tf(), t = $(), n = xf(), r = Q(Sf), i = (0, l.useMemo)(() => {
		let e = (e) => t.getState().nodeLookup.get(e), r = (e) => {
			n.nodeQueue.push(e);
		}, i = (e) => {
			n.edgeQueue.push(e);
		}, a = (e) => {
			let { nodeLookup: n, nodeOrigin: r } = t.getState(), i = pf(e) ? e : n.get(e.id), a = i.parentId ? bl(i.position, i.measured, i.parentId, n, r) : i.position;
			return tl({
				...i,
				position: a,
				width: i.measured?.width ?? i.width,
				height: i.measured?.height ?? i.height
			});
		}, o = (e, t, n = { replace: !1 }) => {
			r((r) => r.map((r) => {
				if (r.id === e) {
					let e = typeof t == "function" ? t(r) : t;
					return n.replace && pf(e) ? e : {
						...r,
						...e
					};
				}
				return r;
			}));
		}, s = (e, t, n = { replace: !1 }) => {
			i((r) => r.map((r) => {
				if (r.id === e) {
					let e = typeof t == "function" ? t(r) : t;
					return n.replace && mf(e) ? e : {
						...r,
						...e
					};
				}
				return r;
			}));
		};
		return {
			getNodes: () => t.getState().nodes.map((e) => ({ ...e })),
			getNode: (t) => e(t)?.internals.userNode,
			getInternalNode: e,
			getEdges: () => {
				let { edges: e = [] } = t.getState();
				return e.map((e) => ({ ...e }));
			},
			getEdge: (e) => t.getState().edgeLookup.get(e),
			setNodes: r,
			setEdges: i,
			addNodes: (e) => {
				let t = Array.isArray(e) ? e : [e];
				n.nodeQueue.push((e) => [...e, ...t]);
			},
			addEdges: (e) => {
				let t = Array.isArray(e) ? e : [e];
				n.edgeQueue.push((e) => [...e, ...t]);
			},
			toObject: () => {
				let { nodes: e = [], edges: n = [], transform: r } = t.getState(), [i, a, o] = r;
				return {
					nodes: e.map((e) => ({ ...e })),
					edges: n.map((e) => ({ ...e })),
					viewport: {
						x: i,
						y: a,
						zoom: o
					}
				};
			},
			deleteElements: async ({ nodes: e = [], edges: n = [] }) => {
				let { nodes: r, edges: i, onNodesDelete: a, onEdgesDelete: o, triggerNodeChanges: s, triggerEdgeChanges: c, onDelete: l, onBeforeDelete: u } = t.getState(), { nodes: d, edges: f } = await Kc({
					nodesToRemove: e,
					edgesToRemove: n,
					nodes: r,
					edges: i,
					onBeforeDelete: u
				}), p = f.length > 0, m = d.length > 0;
				if (p) {
					let e = f.map(uf);
					o?.(f), c(e);
				}
				if (m) {
					let e = d.map(uf);
					a?.(d), s(e);
				}
				return (m || p) && l?.({
					nodes: d,
					edges: f
				}), {
					deletedNodes: d,
					deletedEdges: f
				};
			},
			getIntersectingNodes: (e, n = !0, r) => {
				let i = ol(e), o = i ? e : a(e), s = r !== void 0;
				return o ? (r || t.getState().nodes).filter((r) => {
					let a = t.getState().nodeLookup.get(r.id);
					if (a && !i && (r.id === e.id || !a.internals.positionAbsolute)) return !1;
					let c = tl(s ? r : a), l = al(c, o);
					return n && l > 0 || l >= c.width * c.height || l >= o.width * o.height;
				}) : [];
			},
			isNodeIntersecting: (e, t, n = !0) => {
				let r = ol(e) ? e : a(e);
				if (!r) return !1;
				let i = al(r, t);
				return n && i > 0 || i >= t.width * t.height || i >= r.width * r.height;
			},
			updateNode: o,
			updateNodeData: (e, t, n = { replace: !1 }) => {
				o(e, (e) => {
					let r = typeof t == "function" ? t(e) : t;
					return n.replace ? {
						...e,
						data: r
					} : {
						...e,
						data: {
							...e.data,
							...r
						}
					};
				}, n);
			},
			updateEdge: s,
			updateEdgeData: (e, t, n = { replace: !1 }) => {
				s(e, (e) => {
					let r = typeof t == "function" ? t(e) : t;
					return n.replace ? {
						...e,
						data: r
					} : {
						...e,
						data: {
							...e.data,
							...r
						}
					};
				}, n);
			},
			getNodesBounds: (e) => {
				let { nodeLookup: n, nodeOrigin: r } = t.getState();
				return zc(e, {
					nodeLookup: n,
					nodeOrigin: r
				});
			},
			getHandleConnections: ({ type: e, id: n, nodeId: r }) => Array.from(t.getState().connectionLookup.get(`${r}-${e}${n ? `-${n}` : ""}`)?.values() ?? []),
			getNodeConnections: ({ type: e, handleId: n, nodeId: r }) => Array.from(t.getState().connectionLookup.get(`${r}${e ? n ? `-${e}-${n}` : `-${e}` : ""}`)?.values() ?? []),
			fitView: async (e) => {
				let r = t.getState().fitViewResolver ?? Sl();
				return t.setState({
					fitViewQueued: !0,
					fitViewOptions: e,
					fitViewResolver: r
				}), n.nodeQueue.push((e) => [...e]), r.promise;
			}
		};
	}, []);
	return (0, l.useMemo)(() => ({
		...i,
		...e,
		viewportInitialized: r
	}), [r]);
}
var wf = (e) => e.selected, Tf = typeof window < "u" ? window : void 0;
function Ef({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
	let n = $(), { deleteElements: r } = Cf(), i = Qd(e, { actInsideInputWithModifier: !1 }), a = Qd(t, { target: Tf });
	(0, l.useEffect)(() => {
		if (i) {
			let { edges: e, nodes: t } = n.getState();
			r({
				nodes: t.filter(wf),
				edges: e.filter(wf)
			}), n.setState({ nodesSelectionActive: !1 });
		}
	}, [i]), (0, l.useEffect)(() => {
		n.setState({ multiSelectionActive: a });
	}, [a]);
}
function Df(e) {
	let t = $();
	(0, l.useEffect)(() => {
		let n = () => {
			if (!e.current || !(e.current.checkVisibility?.() ?? !0)) return !1;
			let n = El(e.current);
			(n.height === 0 || n.width === 0) && t.getState().onError?.("004", wc.error004()), t.setState({
				width: n.width || 500,
				height: n.height || 500
			});
		};
		if (e.current) {
			n(), window.addEventListener("resize", n);
			let t = new ResizeObserver(() => n());
			return t.observe(e.current), () => {
				window.removeEventListener("resize", n), t && e.current && t.unobserve(e.current);
			};
		}
	}, []);
}
var Of = {
	position: "absolute",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0
}, kf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	lib: e.lib,
	connectionInProgress: e.connection.inProgress
});
function Af({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panActivationKeyPressed: i, panOnScrollSpeed: a = .5, panOnScrollMode: o = kc.Free, zoomOnDoubleClick: s = !0, panOnDrag: c = !0, defaultViewport: u, translateExtent: d, minZoom: f, maxZoom: p, zoomActivationKeyCode: m, preventScrolling: h = !0, children: g, noWheelClassName: _, noPanClassName: v, onViewportChange: y, isControlledViewport: b, paneClickDistance: x, selectionOnDrag: S }) {
	let C = $(), w = (0, l.useRef)(null), { userSelectionActive: T, lib: E, connectionInProgress: D } = Q(kf, Z), O = Qd(m), k = (0, l.useRef)();
	Df(w);
	let A = (0, l.useCallback)((e) => {
		y?.({
			x: e[0],
			y: e[1],
			zoom: e[2]
		}), b || C.setState({ transform: e });
	}, [y, b]);
	return (0, l.useEffect)(() => {
		if (w.current) {
			k.current = Zu({
				domNode: w.current,
				minZoom: f,
				maxZoom: p,
				translateExtent: d,
				viewport: u,
				onDraggingChange: (e) => C.setState((t) => t.paneDragging === e ? t : { paneDragging: e }),
				onPanZoomStart: (e, t) => {
					let { onViewportChangeStart: n, onMoveStart: r } = C.getState();
					r?.(e, t), n?.(t);
				},
				onPanZoom: (e, t) => {
					let { onViewportChange: n, onMove: r } = C.getState();
					r?.(e, t), n?.(t);
				},
				onPanZoomEnd: (e, t) => {
					let { onViewportChangeEnd: n, onMoveEnd: r } = C.getState();
					r?.(e, t), n?.(t);
				}
			});
			let { x: e, y: t, zoom: n } = k.current.getViewport();
			return C.setState({
				panZoom: k.current,
				transform: [
					e,
					t,
					n
				],
				domNode: w.current.closest(".react-flow")
			}), () => {
				k.current?.destroy();
			};
		}
	}, []), (0, l.useEffect)(() => {
		k.current?.update({
			onPaneContextMenu: e,
			zoomOnScroll: t,
			zoomOnPinch: n,
			panOnScroll: r,
			panActivationKeyPressed: i,
			panOnScrollSpeed: a,
			panOnScrollMode: o,
			zoomOnDoubleClick: s,
			panOnDrag: c,
			zoomActivationKeyPressed: O,
			preventScrolling: h,
			noPanClassName: v,
			userSelectionActive: T,
			noWheelClassName: _,
			lib: E,
			onTransformChange: A,
			connectionInProgress: D,
			selectionOnDrag: S,
			paneClickDistance: x
		});
	}, [
		e,
		t,
		n,
		r,
		i,
		a,
		o,
		s,
		c,
		O,
		h,
		v,
		T,
		_,
		E,
		A,
		D,
		S,
		x
	]), (0, K.jsx)("div", {
		className: "react-flow__renderer",
		ref: w,
		style: Of,
		children: g
	});
}
var jf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	userSelectionRect: e.userSelectionRect
});
function Mf() {
	let { userSelectionActive: e, userSelectionRect: t } = Q(jf, Z);
	return e && t ? (0, K.jsx)("div", {
		className: "react-flow__selection react-flow__container",
		style: {
			width: t.width,
			height: t.height,
			transform: `translate(${t.x}px, ${t.y}px)`
		}
	}) : null;
}
var Nf = (e, t) => (n) => {
	n.target === t.current && e?.(n);
}, Pf = (e) => ({
	userSelectionActive: e.userSelectionActive,
	elementsSelectable: e.elementsSelectable,
	dragging: e.paneDragging,
	panBy: e.panBy,
	autoPanSpeed: e.autoPanSpeed
});
function Ff({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Ac.Full, panOnDrag: r, autoPanOnSelection: i, paneClickDistance: a, selectionOnDrag: o, onSelectionStart: s, onSelectionEnd: c, onPaneClick: u, onPaneContextMenu: d, onPaneScroll: f, onPaneMouseEnter: p, onPaneMouseMove: m, onPaneMouseLeave: h, children: g }) {
	let _ = (0, l.useRef)(0), v = $(), { userSelectionActive: y, elementsSelectable: b, dragging: x, panBy: S, autoPanSpeed: C } = Q(Pf, Z), w = b && (e || y), T = (0, l.useRef)(null), E = (0, l.useRef)(), D = (0, l.useRef)(/* @__PURE__ */ new Set()), O = (0, l.useRef)(/* @__PURE__ */ new Set()), k = (0, l.useRef)(!1), A = (0, l.useRef)(!1), j = (0, l.useRef)({
		x: 0,
		y: 0
	}), M = (0, l.useRef)(!1), N = (e) => {
		A.current || k.current || v.getState().connection.inProgress ? (A.current = !1, k.current = !1) : (u?.(e), v.getState().resetSelectedElements(), v.setState({ nodesSelectionActive: !1 }));
	}, P = (e) => {
		Array.isArray(r) && r?.includes(2) ? e.preventDefault() : d?.(e);
	}, ee = f ? (e) => f(e) : void 0, F = (e) => {
		A.current &&= (e.stopPropagation(), !1);
	}, I = (n) => {
		if (n.pointerType === "touch" && r !== !1 && !t) return;
		let { domNode: i, transform: a } = v.getState();
		if (E.current = i?.getBoundingClientRect(), !E.current) return;
		let s = n.target === T.current;
		if (!s && n.target.closest(".nokey") || !e || !(o && s || t) || n.button !== 0 || !n.isPrimary) return;
		n.target?.setPointerCapture?.(n.pointerId), A.current = !1;
		let { x: c, y: l } = jl(n.nativeEvent, E.current), u = ul({
			x: c,
			y: l
		}, a);
		v.setState({ userSelectionRect: {
			width: 0,
			height: 0,
			startX: u.x,
			startY: u.y,
			x: c,
			y: l
		} }), s || (n.stopPropagation(), n.preventDefault());
	};
	function L(e, t) {
		let { userSelectionRect: r } = v.getState();
		if (!r) return;
		let { transform: i, nodeLookup: a, edgeLookup: o, connectionLookup: s, triggerNodeChanges: c, triggerEdgeChanges: l, defaultEdgeOptions: u } = v.getState(), d = {
			x: r.startX,
			y: r.startY
		}, { x: f, y: p } = dl(d, i), m = {
			startX: d.x,
			startY: d.y,
			x: e < f ? e : f,
			y: t < p ? t : p,
			width: Math.abs(e - f),
			height: Math.abs(t - p)
		}, h = D.current, g = O.current;
		D.current = new Set(Vc(a, m, i, n === Ac.Partial, !0).map((e) => e.id)), O.current = /* @__PURE__ */ new Set();
		let _ = u?.selectable ?? !0;
		for (let e of D.current) {
			let t = s.get(e);
			if (t) for (let { edgeId: e } of t.values()) {
				let t = o.get(e);
				t && (t.selectable ?? _) && O.current.add(e);
			}
		}
		xl(h, D.current) || c(cf(a, D.current, !0)), xl(g, O.current) || l(cf(o, O.current)), v.setState({
			userSelectionRect: m,
			userSelectionActive: !0,
			nodesSelectionActive: !1
		});
	}
	function R() {
		if (!i || !E.current) return;
		let [e, t] = Zc(j.current, E.current, C);
		S({
			x: e,
			y: t
		}).then((e) => {
			if (!A.current || !e) {
				_.current = requestAnimationFrame(R);
				return;
			}
			let { x: t, y: n } = j.current;
			L(t, n), _.current = requestAnimationFrame(R);
		});
	}
	let z = () => {
		cancelAnimationFrame(_.current), _.current = 0, M.current = !1;
	};
	(0, l.useEffect)(() => () => z(), []);
	let B = (e) => {
		let { userSelectionRect: n, transform: r, resetSelectedElements: i } = v.getState();
		if (!E.current || !n) return;
		let { x: o, y: c } = jl(e.nativeEvent, E.current);
		j.current = {
			x: o,
			y: c
		};
		let l = dl({
			x: n.startX,
			y: n.startY
		}, r);
		if (!A.current) {
			let n = t ? 0 : a;
			if (Math.hypot(o - l.x, c - l.y) <= n) return;
			i(), s?.(e);
		}
		A.current = !0, M.current ||= (R(), !0), L(o, c);
	}, V = (e) => {
		w ? e.button === 0 && (e.target?.releasePointerCapture?.(e.pointerId), !y && e.target === T.current && v.getState().userSelectionRect && N?.(e), v.setState({
			userSelectionActive: !1,
			userSelectionRect: null
		}), A.current && (c?.(e), v.setState({ nodesSelectionActive: D.current.size > 0 })), z()) : e.target === T.current && v.getState().connection.inProgress && (k.current = !0);
	}, H = (e) => {
		e.target?.releasePointerCapture?.(e.pointerId), z();
	}, U = r === !0 || Array.isArray(r) && r.includes(0);
	return (0, K.jsxs)("div", {
		className: q(["react-flow__pane", {
			draggable: U,
			dragging: x,
			selection: e
		}]),
		onClick: w ? void 0 : Nf(N, T),
		onContextMenu: Nf(P, T),
		onWheel: Nf(ee, T),
		onPointerEnter: w ? void 0 : p,
		onPointerMove: w ? B : m,
		onPointerUp: V,
		onPointerCancel: w ? H : void 0,
		onPointerDownCapture: w ? I : void 0,
		onClickCapture: w ? F : void 0,
		onPointerLeave: h,
		ref: T,
		style: Of,
		children: [g, (0, K.jsx)(Mf, {})]
	});
}
function If({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
	let { addSelectedNodes: i, unselectNodesAndEdges: a, multiSelectionActive: o, nodeLookup: s, onError: c } = t.getState(), l = s.get(e);
	l ? (t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && o) && (a({
		nodes: [l],
		edges: []
	}), requestAnimationFrame(() => r?.current?.blur())) : i([e])) : c?.("012", wc.error012(e));
}
function Lf({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: i, isSelectable: a, nodeClickDistance: o }) {
	let s = $(), [c, u] = (0, l.useState)(!1), d = (0, l.useRef)();
	return (0, l.useEffect)(() => {
		if (!t) return d.current = Eu({
			getStoreItems: () => s.getState(),
			onNodeMouseDown: (t) => {
				If({
					id: t,
					store: s,
					nodeRef: e
				});
			},
			onDragStart: () => {
				u(!0);
			},
			onDragStop: () => {
				u(!1);
			}
		}), () => {
			d.current?.destroy(), d.current = void 0;
		};
	}, [
		t,
		s,
		e
	]), (0, l.useEffect)(() => {
		!t && e.current && d.current && d.current.update({
			noDragClassName: n,
			handleSelector: r,
			domNode: e.current,
			isSelectable: a,
			nodeId: i,
			nodeClickDistance: o
		});
	}, [
		n,
		r,
		t,
		a,
		e,
		i,
		o
	]), c;
}
var Rf = (e) => (t) => t.selected && (t.draggable || e && t.draggable === void 0);
function zf() {
	let e = $();
	return (0, l.useCallback)((t) => {
		let { nodeExtent: n, snapToGrid: r, snapGrid: i, nodesDraggable: a, onError: o, updateNodePositions: s, nodeLookup: c, nodeOrigin: l } = e.getState(), u = /* @__PURE__ */ new Map(), d = Rf(a), f = r ? i[0] : 5, p = r ? i[1] : 5, m = t.direction.x * f * t.factor, h = t.direction.y * p * t.factor;
		for (let [, e] of c) {
			if (!d(e)) continue;
			let t = {
				x: e.internals.positionAbsolute.x + m,
				y: e.internals.positionAbsolute.y + h
			};
			r && (t = ll(t, i));
			let { position: a, positionAbsolute: s } = Gc({
				nodeId: e.id,
				nextPosition: t,
				nodeLookup: c,
				nodeExtent: n,
				nodeOrigin: l,
				onError: o
			});
			e.position = a, e.internals.positionAbsolute = s, u.set(e.id, e);
		}
		s(u);
	}, []);
}
var Bf = (0, l.createContext)(null), Vf = Bf.Provider;
Bf.Consumer;
var Hf = () => (0, l.useContext)(Bf), Uf = (e) => ({
	connectOnClick: e.connectOnClick,
	noPanClassName: e.noPanClassName,
	rfId: e.rfId
}), Wf = (0, l.createContext)(null);
function Gf({ children: e }) {
	let t = Q(Uf, Z);
	return (0, K.jsx)(Wf.Provider, {
		value: t,
		children: e
	});
}
function Kf() {
	let e = (0, l.useContext)(Wf);
	if (!e) throw Error("useHandleConfig must be used within a HandleConfigProvider");
	return e;
}
var qf = {
	connectingFrom: !1,
	connectingTo: !1,
	clickConnecting: !1,
	isPossibleEndHandle: !0,
	connectionInProcess: !1,
	clickConnectionInProcess: !1,
	valid: !1
}, Jf = (e, t, n) => (r) => {
	let { connectionClickStartHandle: i, connectionMode: a, connection: o } = r, { fromHandle: s, toHandle: c, isValid: l } = o;
	if (!s && !i) return qf;
	let u = c?.nodeId === e && c?.id === t && c?.type === n;
	return {
		connectingFrom: s?.nodeId === e && s?.id === t && s?.type === n,
		connectingTo: u,
		clickConnecting: i?.nodeId === e && i?.id === t && i?.type === n,
		isPossibleEndHandle: a === Oc.Strict ? s?.type !== n : e !== s?.nodeId || t !== s?.id,
		connectionInProcess: !!s,
		clickConnectionInProcess: !!i,
		valid: u && l
	};
};
function Yf({ type: e = "source", position: t = X.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: i = !0, isConnectableEnd: a = !0, id: o, onConnect: s, children: c, className: l, onMouseDown: u, onTouchStart: d, ...f }, p) {
	let m = o || null, h = e === "target", g = $(), _ = Hf(), { connectOnClick: v, noPanClassName: y, rfId: b } = Kf(), { connectingFrom: x, connectingTo: S, clickConnecting: C, isPossibleEndHandle: w, connectionInProcess: T, clickConnectionInProcess: E, valid: D } = Q(Jf(_, m, e), Z);
	_ || g.getState().onError?.("010", wc.error010());
	let O = (e) => {
		let { defaultEdgeOptions: t, onConnect: n, hasDefaultEdges: r } = g.getState(), i = {
			...t,
			...e
		};
		if (r) {
			let { edges: e, setEdges: t, onError: n } = g.getState();
			t(ff(i, e, { onError: n }));
		}
		n?.(i), s?.(i);
	}, k = (e) => {
		if (!_) return;
		let t = Al(e.nativeEvent);
		if (i && (t && e.button === 0 || !t)) {
			let t = g.getState();
			Iu.onPointerDown(e.nativeEvent, {
				handleDomNode: e.currentTarget,
				autoPanOnConnect: t.autoPanOnConnect,
				connectionMode: t.connectionMode,
				connectionRadius: t.connectionRadius,
				domNode: t.domNode,
				nodeLookup: t.nodeLookup,
				lib: t.lib,
				isTarget: h,
				handleId: m,
				nodeId: _,
				flowId: t.rfId,
				panBy: t.panBy,
				cancelConnection: t.cancelConnection,
				onConnectStart: t.onConnectStart,
				onConnectEnd: (...e) => g.getState().onConnectEnd?.(...e),
				updateConnection: t.updateConnection,
				onConnect: O,
				isValidConnection: n || ((...e) => g.getState().isValidConnection?.(...e) ?? !0),
				getTransform: () => g.getState().transform,
				getFromHandle: () => g.getState().connection.fromHandle,
				autoPanSpeed: t.autoPanSpeed,
				dragThreshold: t.connectionDragThreshold
			});
		}
		t ? u?.(e) : d?.(e);
	};
	return (0, K.jsx)("div", {
		"data-handleid": m,
		"data-nodeid": _,
		"data-handlepos": t,
		"data-id": `${b}-${_}-${m}-${e}`,
		className: q([
			"react-flow__handle",
			`react-flow__handle-${t}`,
			"nodrag",
			y,
			l,
			{
				source: !h,
				target: h,
				connectable: r,
				connectablestart: i,
				connectableend: a,
				clickconnecting: C,
				connectingfrom: x,
				connectingto: S,
				valid: D,
				connectionindicator: r && (!T || w) && (T || E ? a : i)
			}
		]),
		onMouseDown: k,
		onTouchStart: k,
		onClick: v ? (t) => {
			let { onClickConnectStart: r, onClickConnectEnd: a, connectionClickStartHandle: o, connectionMode: s, isValidConnection: c, lib: l, rfId: u, nodeLookup: d, connection: f } = g.getState();
			if (!_ || !o && !i) return;
			if (!o) {
				r?.(t.nativeEvent, {
					nodeId: _,
					handleId: m,
					handleType: e
				}), g.setState({ connectionClickStartHandle: {
					nodeId: _,
					type: e,
					id: m
				} });
				return;
			}
			let p = Dl(t.target), h = n || c, { connection: v, isValid: y } = Iu.isValid(t.nativeEvent, {
				handle: {
					nodeId: _,
					id: m,
					type: e
				},
				connectionMode: s,
				fromNodeId: o.nodeId,
				fromHandleId: o.id || null,
				fromType: o.type,
				isValidConnection: h,
				flowId: u,
				doc: p,
				lib: l,
				nodeLookup: d
			});
			y && v && O(v);
			let b = structuredClone(f);
			delete b.inProgress, b.toPosition = b.toHandle ? b.toHandle.position : null, a?.(t, b), g.setState({ connectionClickStartHandle: null });
		} : void 0,
		ref: p,
		...f,
		children: c
	});
}
var Xf = (0, l.memo)(hf(Yf));
function Zf({ data: e, isConnectable: t, sourcePosition: n = X.Bottom }) {
	return (0, K.jsxs)(K.Fragment, { children: [e?.label, (0, K.jsx)(Xf, {
		type: "source",
		position: n,
		isConnectable: t
	})] });
}
function Qf({ data: e, isConnectable: t, targetPosition: n = X.Top, sourcePosition: r = X.Bottom }) {
	return (0, K.jsxs)(K.Fragment, { children: [
		(0, K.jsx)(Xf, {
			type: "target",
			position: n,
			isConnectable: t
		}),
		e?.label,
		(0, K.jsx)(Xf, {
			type: "source",
			position: r,
			isConnectable: t
		})
	] });
}
function $f() {
	return null;
}
function ep({ data: e, isConnectable: t, targetPosition: n = X.Top }) {
	return (0, K.jsxs)(K.Fragment, { children: [(0, K.jsx)(Xf, {
		type: "target",
		position: n,
		isConnectable: t
	}), e?.label] });
}
var tp = {
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
}, np = {
	input: Zf,
	default: Qf,
	output: ep,
	group: $f
};
function rp(e) {
	return e.internals.handleBounds === void 0 ? {
		width: e.width ?? e.initialWidth ?? e.style?.width,
		height: e.height ?? e.initialHeight ?? e.style?.height
	} : {
		width: e.width ?? e.style?.width,
		height: e.height ?? e.style?.height
	};
}
var ip = (e) => {
	let { width: t, height: n, x: r, y: i } = Bc(e.nodeLookup, { filter: (e) => !!e.selected });
	return {
		width: sl(t) ? t : null,
		height: sl(n) ? n : null,
		userSelectionActive: e.userSelectionActive,
		transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${i}px)`
	};
};
function ap({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
	let r = $(), { width: i, height: a, transformString: o, userSelectionActive: s } = Q(ip, Z), c = zf(), u = (0, l.useRef)(null);
	(0, l.useEffect)(() => {
		n || u.current?.focus({ preventScroll: !0 });
	}, [n]);
	let d = !s && i !== null && a !== null;
	if (Lf({
		nodeRef: u,
		disabled: !d
	}), !d) return null;
	let f = e ? (t) => {
		e(t, r.getState().nodes.filter((e) => e.selected));
	} : void 0;
	return (0, K.jsx)("div", {
		className: q([
			"react-flow__nodesselection",
			"react-flow__container",
			t
		]),
		style: { transform: o },
		children: (0, K.jsx)("div", {
			ref: u,
			className: "react-flow__nodesselection-rect",
			onContextMenu: f,
			tabIndex: n ? void 0 : -1,
			onKeyDown: n ? void 0 : (e) => {
				Object.prototype.hasOwnProperty.call(tp, e.key) && (e.preventDefault(), c({
					direction: tp[e.key],
					factor: e.shiftKey ? 4 : 1
				}));
			},
			style: {
				width: i,
				height: a
			}
		})
	});
}
var op = typeof window < "u" ? window : void 0, sp = (e) => ({
	nodesSelectionActive: e.nodesSelectionActive,
	userSelectionActive: e.userSelectionActive
});
function cp({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: i, onPaneContextMenu: a, onPaneScroll: o, paneClickDistance: s, deleteKeyCode: c, selectionKeyCode: l, selectionOnDrag: u, selectionMode: d, onSelectionStart: f, onSelectionEnd: p, multiSelectionKeyCode: m, panActivationKeyCode: h, zoomActivationKeyCode: g, elementsSelectable: _, zoomOnScroll: v, zoomOnPinch: y, panOnScroll: b, panOnScrollSpeed: x, panOnScrollMode: S, zoomOnDoubleClick: C, panOnDrag: w, autoPanOnSelection: T, defaultViewport: E, translateExtent: D, minZoom: O, maxZoom: k, preventScrolling: A, onSelectionContextMenu: j, noWheelClassName: M, noPanClassName: N, disableKeyboardA11y: P, onViewportChange: ee, isControlledViewport: F }) {
	let { nodesSelectionActive: I, userSelectionActive: L } = Q(sp, Z), R = Qd(l, { target: op }), z = Qd(h, { target: op }), B = z || w, V = z || b, H = u && B !== !0, U = R || L || H;
	return Ef({
		deleteKeyCode: c,
		multiSelectionKeyCode: m
	}), (0, K.jsx)(Af, {
		onPaneContextMenu: a,
		elementsSelectable: _,
		zoomOnScroll: v,
		zoomOnPinch: y,
		panOnScroll: V,
		panActivationKeyPressed: z,
		panOnScrollSpeed: x,
		panOnScrollMode: S,
		zoomOnDoubleClick: C,
		panOnDrag: !R && B,
		defaultViewport: E,
		translateExtent: D,
		minZoom: O,
		maxZoom: k,
		zoomActivationKeyCode: g,
		preventScrolling: A,
		noWheelClassName: M,
		noPanClassName: N,
		onViewportChange: ee,
		isControlledViewport: F,
		paneClickDistance: s,
		selectionOnDrag: H,
		children: (0, K.jsxs)(Ff, {
			onSelectionStart: f,
			onSelectionEnd: p,
			onPaneClick: t,
			onPaneMouseEnter: n,
			onPaneMouseMove: r,
			onPaneMouseLeave: i,
			onPaneContextMenu: a,
			onPaneScroll: o,
			panOnDrag: B,
			autoPanOnSelection: T,
			isSelecting: !!U,
			selectionMode: d,
			selectionKeyPressed: R,
			paneClickDistance: s,
			selectionOnDrag: H,
			children: [e, I && (0, K.jsx)(ap, {
				onSelectionContextMenu: j,
				noPanClassName: N,
				disableKeyboardA11y: P
			})]
		})
	});
}
cp.displayName = "FlowRenderer";
var lp = (0, l.memo)(cp), up = (e) => (t) => e ? Vc(t.nodeLookup, {
	x: 0,
	y: 0,
	width: t.width,
	height: t.height
}, t.transform, !0).map((e) => e.id) : Array.from(t.nodeLookup.keys());
function dp(e) {
	return Q((0, l.useCallback)(up(e), [e]), Z);
}
var fp = (e) => e.updateNodeInternals;
function pp() {
	let e = Q(fp), [t] = (0, l.useState)(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((t) => {
		let n = /* @__PURE__ */ new Map();
		t.forEach((e) => {
			let t = e.target.getAttribute("data-id");
			n.set(t, {
				id: t,
				nodeElement: e.target,
				force: !0
			});
		}), e(n);
	}));
	return (0, l.useEffect)(() => () => {
		t?.disconnect();
	}, [t]), t;
}
function mp({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
	let i = $(), a = (0, l.useRef)(null), o = (0, l.useRef)(null), s = (0, l.useRef)(e.sourcePosition), c = (0, l.useRef)(e.targetPosition), u = (0, l.useRef)(t), d = n && !!e.internals.handleBounds;
	return (0, l.useEffect)(() => {
		a.current && !e.hidden && (!d || o.current !== a.current) && (o.current && r?.unobserve(o.current), r?.observe(a.current), o.current = a.current);
	}, [d, e.hidden]), (0, l.useEffect)(() => () => {
		o.current &&= (r?.unobserve(o.current), null);
	}, []), (0, l.useEffect)(() => {
		if (a.current) {
			let n = u.current !== t, r = s.current !== e.sourcePosition, o = c.current !== e.targetPosition;
			(n || r || o) && (u.current = t, s.current = e.sourcePosition, c.current = e.targetPosition, i.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, {
				id: e.id,
				nodeElement: a.current,
				force: !0
			}]])));
		}
	}, [
		e.id,
		t,
		e.sourcePosition,
		e.targetPosition
	]), a;
}
function hp({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: i, onContextMenu: a, onDoubleClick: o, nodesDraggable: s, elementsSelectable: c, nodesConnectable: l, nodesFocusable: u, resizeObserver: d, noDragClassName: f, noPanClassName: p, disableKeyboardA11y: m, rfId: h, nodeTypes: g, nodeClickDistance: _, onError: v }) {
	let { node: y, internals: b, isParent: x } = Q((t) => {
		let n = t.nodeLookup.get(e), r = t.parentLookup.has(e);
		return {
			node: n,
			internals: n.internals,
			isParent: r
		};
	}, Z), S = y.type || "default", C = g?.[S] || np[S];
	C === void 0 && (v?.("003", wc.error003(S)), S = "default", C = g?.default || np.default);
	let w = !!(y.draggable || s && y.draggable === void 0), T = !!(y.selectable || c && y.selectable === void 0), E = !!(y.connectable || l && y.connectable === void 0), D = !!(y.focusable || u && y.focusable === void 0), O = $(), k = yl(y), A = mp({
		node: y,
		nodeType: S,
		hasDimensions: k,
		resizeObserver: d
	}), j = Lf({
		nodeRef: A,
		disabled: y.hidden || !w,
		noDragClassName: f,
		handleSelector: y.dragHandle,
		nodeId: e,
		isSelectable: T,
		nodeClickDistance: _
	}), M = zf();
	if (y.hidden) return null;
	let N = vl(y), P = rp(y), ee = T || w || t || n || r || i, F = n ? (e) => n(e, { ...b.userNode }) : void 0, I = r ? (e) => r(e, { ...b.userNode }) : void 0, L = i ? (e) => i(e, { ...b.userNode }) : void 0, R = a ? (e) => a(e, { ...b.userNode }) : void 0, z = o ? (e) => o(e, { ...b.userNode }) : void 0, B = (n) => {
		let { selectNodesOnDrag: r, nodeDragThreshold: i } = O.getState();
		T && (!r || !w || i > 0) && If({
			id: e,
			store: O,
			nodeRef: A
		}), t && t(n, { ...b.userNode });
	}, V = (t) => {
		if (!(kl(t.nativeEvent) || m)) {
			if (Ec.includes(t.key) && T) {
				let n = t.key === "Escape";
				If({
					id: e,
					store: O,
					unselect: n,
					nodeRef: A
				});
			} else if (w && y.selected && Object.prototype.hasOwnProperty.call(tp, t.key)) {
				t.preventDefault();
				let { ariaLabelConfig: e } = O.getState();
				O.setState({ ariaLiveMessage: e["node.a11yDescription.ariaLiveMessage"]({
					direction: t.key.replace("Arrow", "").toLowerCase(),
					x: ~~b.positionAbsolute.x,
					y: ~~b.positionAbsolute.y
				}) }), M({
					direction: tp[t.key],
					factor: t.shiftKey ? 4 : 1
				});
			}
		}
	}, H = () => {
		if (m || !A.current?.matches(":focus-visible")) return;
		let { transform: t, width: n, height: r, autoPanOnNodeFocus: i, setCenter: a } = O.getState();
		i && (Vc(/* @__PURE__ */ new Map([[e, y]]), {
			x: 0,
			y: 0,
			width: n,
			height: r
		}, t, !0).length > 0 || a(y.position.x + N.width / 2, y.position.y + N.height / 2, { zoom: t[2] }));
	};
	return (0, K.jsx)("div", {
		className: q([
			"react-flow__node",
			`react-flow__node-${S}`,
			{ [p]: w },
			y.className,
			{
				selected: y.selected,
				selectable: T,
				parent: x,
				draggable: w,
				dragging: j
			}
		]),
		ref: A,
		style: {
			zIndex: b.z,
			transform: `translate(${b.positionAbsolute.x}px,${b.positionAbsolute.y}px)`,
			pointerEvents: ee ? "all" : "none",
			visibility: k ? "visible" : "hidden",
			...y.style,
			...P
		},
		"data-id": e,
		"data-testid": `rf__node-${e}`,
		onMouseEnter: F,
		onMouseMove: I,
		onMouseLeave: L,
		onContextMenu: R,
		onClick: B,
		onDoubleClick: z,
		onKeyDown: D ? V : void 0,
		tabIndex: D ? 0 : void 0,
		onFocus: D ? H : void 0,
		role: y.ariaRole ?? (D ? "group" : void 0),
		"aria-roledescription": "node",
		"aria-describedby": m ? void 0 : `${Dd}-${h}`,
		"aria-label": y.ariaLabel,
		...y.domAttributes,
		children: (0, K.jsx)(Vf, {
			value: e,
			children: (0, K.jsx)(C, {
				id: e,
				data: y.data,
				type: S,
				positionAbsoluteX: b.positionAbsolute.x,
				positionAbsoluteY: b.positionAbsolute.y,
				selected: y.selected ?? !1,
				selectable: T,
				draggable: w,
				deletable: y.deletable ?? !0,
				isConnectable: E,
				sourcePosition: y.sourcePosition,
				targetPosition: y.targetPosition,
				dragging: j,
				dragHandle: y.dragHandle,
				zIndex: b.z,
				parentId: y.parentId,
				...N
			})
		})
	});
}
var gp = (0, l.memo)(hp), _p = (e) => ({
	nodesConnectable: e.nodesConnectable,
	nodesFocusable: e.nodesFocusable,
	elementsSelectable: e.elementsSelectable,
	onError: e.onError
});
function vp(e) {
	let { nodesConnectable: t, nodesFocusable: n, elementsSelectable: r, onError: i } = Q(_p, Z), a = dp(e.onlyRenderVisibleElements), o = pp();
	return (0, K.jsx)("div", {
		className: "react-flow__nodes",
		style: Of,
		children: a.map((a) => (0, K.jsx)(gp, {
			id: a,
			nodeTypes: e.nodeTypes,
			nodeExtent: e.nodeExtent,
			onClick: e.onNodeClick,
			onMouseEnter: e.onNodeMouseEnter,
			onMouseMove: e.onNodeMouseMove,
			onMouseLeave: e.onNodeMouseLeave,
			onContextMenu: e.onNodeContextMenu,
			onDoubleClick: e.onNodeDoubleClick,
			noDragClassName: e.noDragClassName,
			noPanClassName: e.noPanClassName,
			rfId: e.rfId,
			disableKeyboardA11y: e.disableKeyboardA11y,
			resizeObserver: o,
			nodesDraggable: e.nodesDraggable ?? !0,
			nodesConnectable: t,
			nodesFocusable: n,
			elementsSelectable: r,
			nodeClickDistance: e.nodeClickDistance,
			onError: i
		}, a))
	});
}
vp.displayName = "NodeRenderer";
var yp = (0, l.memo)(vp);
function bp(e) {
	return Q((0, l.useCallback)((t) => {
		if (!e) return t.edges.map((e) => e.id);
		let n = [];
		if (t.width && t.height) for (let e of t.edges) {
			let r = t.nodeLookup.get(e.source), i = t.nodeLookup.get(e.target);
			r && i && zl({
				sourceNode: r,
				targetNode: i,
				width: t.width,
				height: t.height,
				transform: t.transform
			}) && n.push(e.id);
		}
		return n;
	}, [e]), Z);
}
var xp = ({ color: e = "none", strokeWidth: t = 1 }) => {
	let n = {
		strokeWidth: t,
		...e && { stroke: e }
	};
	return (0, K.jsx)("polyline", {
		className: "arrow",
		style: n,
		strokeLinecap: "round",
		fill: "none",
		strokeLinejoin: "round",
		points: "-5,-4 0,0 -5,4"
	});
}, Sp = ({ color: e = "none", strokeWidth: t = 1 }) => {
	let n = {
		strokeWidth: t,
		...e && {
			stroke: e,
			fill: e
		}
	};
	return (0, K.jsx)("polyline", {
		className: "arrowclosed",
		style: n,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		points: "-5,-4 0,0 -5,4 -5,-4"
	});
}, Cp = {
	[Nc.Arrow]: xp,
	[Nc.ArrowClosed]: Sp
};
function wp(e) {
	let t = $();
	return (0, l.useMemo)(() => Object.prototype.hasOwnProperty.call(Cp, e) ? Cp[e] : (t.getState().onError?.("009", wc.error009(e)), null), [e]);
}
var Tp = ({ id: e, type: t, color: n, width: r = 12.5, height: i = 12.5, markerUnits: a = "strokeWidth", strokeWidth: o, orient: s = "auto-start-reverse" }) => {
	let c = wp(t);
	return c ? (0, K.jsx)("marker", {
		className: "react-flow__arrowhead",
		id: e,
		markerWidth: `${r}`,
		markerHeight: `${i}`,
		viewBox: "-10 -10 20 20",
		markerUnits: a,
		orient: s,
		refX: "0",
		refY: "0",
		children: (0, K.jsx)(c, {
			color: n,
			strokeWidth: o
		})
	}) : null;
}, Ep = ({ defaultColor: e, rfId: t }) => {
	let n = Q((e) => e.edges), r = Q((e) => e.defaultEdgeOptions), i = (0, l.useMemo)(() => nu(n, {
		id: t,
		defaultColor: e,
		defaultMarkerStart: r?.markerStart,
		defaultMarkerEnd: r?.markerEnd
	}), [
		n,
		r,
		t,
		e
	]);
	return i.length ? (0, K.jsx)("svg", {
		className: "react-flow__marker",
		"aria-hidden": "true",
		children: (0, K.jsx)("defs", { children: i.map((e) => (0, K.jsx)(Tp, {
			id: e.id,
			type: e.type,
			color: e.color,
			width: e.width,
			height: e.height,
			markerUnits: e.markerUnits,
			strokeWidth: e.strokeWidth,
			orient: e.orient
		}, e.id)) })
	}) : null;
};
Ep.displayName = "MarkerDefinitions";
var Dp = (0, l.memo)(Ep);
function Op({ x: e, y: t, label: n, labelStyle: r, labelShowBg: i = !0, labelBgStyle: a, labelBgPadding: o = [2, 4], labelBgBorderRadius: s = 2, children: c, className: u, ...d }) {
	let [f, p] = (0, l.useState)({
		x: 1,
		y: 0,
		width: 0,
		height: 0
	}), m = q(["react-flow__edge-textwrapper", u]), h = (0, l.useRef)(null);
	return (0, l.useEffect)(() => {
		if (h.current) {
			let e = h.current.getBBox();
			p({
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height
			});
		}
	}, [n]), n ? (0, K.jsxs)("g", {
		transform: `translate(${e - f.width / 2} ${t - f.height / 2})`,
		className: m,
		visibility: f.width ? "visible" : "hidden",
		...d,
		children: [
			i && (0, K.jsx)("rect", {
				width: f.width + 2 * o[0],
				x: -o[0],
				y: -o[1],
				height: f.height + 2 * o[1],
				className: "react-flow__edge-textbg",
				style: a,
				rx: s,
				ry: s
			}),
			(0, K.jsx)("text", {
				className: "react-flow__edge-text",
				y: f.height / 2,
				dy: "0.3em",
				ref: h,
				style: r,
				children: n
			}),
			c
		]
	}) : null;
}
Op.displayName = "EdgeText";
var kp = (0, l.memo)(Op);
function Ap({ path: e, labelX: t, labelY: n, label: r, labelStyle: i, labelShowBg: a, labelBgStyle: o, labelBgPadding: s, labelBgBorderRadius: c, interactionWidth: l = 20, ...u }) {
	return (0, K.jsxs)(K.Fragment, { children: [
		(0, K.jsx)("path", {
			...u,
			d: e,
			fill: "none",
			className: q(["react-flow__edge-path", u.className])
		}),
		l ? (0, K.jsx)("path", {
			d: e,
			fill: "none",
			strokeOpacity: 0,
			strokeWidth: l,
			className: "react-flow__edge-interaction"
		}) : null,
		r && sl(t) && sl(n) ? (0, K.jsx)(kp, {
			x: t,
			y: n,
			label: r,
			labelStyle: i,
			labelShowBg: a,
			labelBgStyle: o,
			labelBgPadding: s,
			labelBgBorderRadius: c
		}) : null
	] });
}
function jp({ pos: e, x1: t, y1: n, x2: r, y2: i }) {
	return e === X.Left || e === X.Right ? [.5 * (t + r), n] : [t, .5 * (n + i)];
}
function Mp({ sourceX: e, sourceY: t, sourcePosition: n = X.Bottom, targetX: r, targetY: i, targetPosition: a = X.Top }) {
	let [o, s] = jp({
		pos: n,
		x1: e,
		y1: t,
		x2: r,
		y2: i
	}), [c, l] = jp({
		pos: a,
		x1: r,
		y1: i,
		x2: e,
		y2: t
	}), [u, d, f, p] = Nl({
		sourceX: e,
		sourceY: t,
		targetX: r,
		targetY: i,
		sourceControlX: o,
		sourceControlY: s,
		targetControlX: c,
		targetControlY: l
	});
	return [
		`M${e},${t} C${o},${s} ${c},${l} ${r},${i}`,
		u,
		d,
		f,
		p
	];
}
function Np(e) {
	return (0, l.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, sourcePosition: o, targetPosition: s, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: p, style: m, markerEnd: h, markerStart: g, interactionWidth: _ }) => {
		let [v, y, b] = Mp({
			sourceX: n,
			sourceY: r,
			sourcePosition: o,
			targetX: i,
			targetY: a,
			targetPosition: s
		}), x = e.isInternal ? void 0 : t;
		return (0, K.jsx)(Ap, {
			id: x,
			path: v,
			labelX: y,
			labelY: b,
			label: c,
			labelStyle: l,
			labelShowBg: u,
			labelBgStyle: d,
			labelBgPadding: f,
			labelBgBorderRadius: p,
			style: m,
			markerEnd: h,
			markerStart: g,
			interactionWidth: _
		});
	});
}
var Pp = Np({ isInternal: !1 }), Fp = Np({ isInternal: !0 });
Pp.displayName = "SimpleBezierEdge", Fp.displayName = "SimpleBezierEdgeInternal";
function Ip(e) {
	return (0, l.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, label: o, labelStyle: s, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: d, style: f, sourcePosition: p = X.Bottom, targetPosition: m = X.Top, markerEnd: h, markerStart: g, pathOptions: _, interactionWidth: v }) => {
		let [y, b, x] = Yl({
			sourceX: n,
			sourceY: r,
			sourcePosition: p,
			targetX: i,
			targetY: a,
			targetPosition: m,
			borderRadius: _?.borderRadius,
			offset: _?.offset,
			stepPosition: _?.stepPosition
		}), S = e.isInternal ? void 0 : t;
		return (0, K.jsx)(Ap, {
			id: S,
			path: y,
			labelX: b,
			labelY: x,
			label: o,
			labelStyle: s,
			labelShowBg: c,
			labelBgStyle: l,
			labelBgPadding: u,
			labelBgBorderRadius: d,
			style: f,
			markerEnd: h,
			markerStart: g,
			interactionWidth: v
		});
	});
}
var Lp = Ip({ isInternal: !1 }), Rp = Ip({ isInternal: !0 });
Lp.displayName = "SmoothStepEdge", Rp.displayName = "SmoothStepEdgeInternal";
function zp(e) {
	return (0, l.memo)(({ id: t, ...n }) => {
		let r = e.isInternal ? void 0 : t;
		return (0, K.jsx)(Lp, {
			...n,
			id: r,
			pathOptions: (0, l.useMemo)(() => ({
				borderRadius: 0,
				offset: n.pathOptions?.offset
			}), [n.pathOptions?.offset])
		});
	});
}
var Bp = zp({ isInternal: !1 }), Vp = zp({ isInternal: !0 });
Bp.displayName = "StepEdge", Vp.displayName = "StepEdgeInternal";
function Hp(e) {
	return (0, l.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, label: o, labelStyle: s, labelShowBg: c, labelBgStyle: l, labelBgPadding: u, labelBgBorderRadius: d, style: f, markerEnd: p, markerStart: m, interactionWidth: h }) => {
		let [g, _, v] = Ul({
			sourceX: n,
			sourceY: r,
			targetX: i,
			targetY: a
		}), y = e.isInternal ? void 0 : t;
		return (0, K.jsx)(Ap, {
			id: y,
			path: g,
			labelX: _,
			labelY: v,
			label: o,
			labelStyle: s,
			labelShowBg: c,
			labelBgStyle: l,
			labelBgPadding: u,
			labelBgBorderRadius: d,
			style: f,
			markerEnd: p,
			markerStart: m,
			interactionWidth: h
		});
	});
}
var Up = Hp({ isInternal: !1 }), Wp = Hp({ isInternal: !0 });
Up.displayName = "StraightEdge", Wp.displayName = "StraightEdgeInternal";
function Gp(e) {
	return (0, l.memo)(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: a, sourcePosition: o = X.Bottom, targetPosition: s = X.Top, label: c, labelStyle: l, labelShowBg: u, labelBgStyle: d, labelBgPadding: f, labelBgBorderRadius: p, style: m, markerEnd: h, markerStart: g, pathOptions: _, interactionWidth: v }) => {
		let [y, b, x] = Il({
			sourceX: n,
			sourceY: r,
			sourcePosition: o,
			targetX: i,
			targetY: a,
			targetPosition: s,
			curvature: _?.curvature
		}), S = e.isInternal ? void 0 : t;
		return (0, K.jsx)(Ap, {
			id: S,
			path: y,
			labelX: b,
			labelY: x,
			label: c,
			labelStyle: l,
			labelShowBg: u,
			labelBgStyle: d,
			labelBgPadding: f,
			labelBgBorderRadius: p,
			style: m,
			markerEnd: h,
			markerStart: g,
			interactionWidth: v
		});
	});
}
var Kp = Gp({ isInternal: !1 }), qp = Gp({ isInternal: !0 });
Kp.displayName = "BezierEdge", qp.displayName = "BezierEdgeInternal";
var Jp = {
	default: qp,
	straight: Wp,
	step: Vp,
	smoothstep: Rp,
	simplebezier: Fp
}, Yp = {
	sourceX: null,
	sourceY: null,
	targetX: null,
	targetY: null,
	sourcePosition: null,
	targetPosition: null,
	zIndex: void 0
}, Xp = (e, t, n) => n === X.Left ? e - t : n === X.Right ? e + t : e, Zp = (e, t, n) => n === X.Top ? e - t : n === X.Bottom ? e + t : e, Qp = "react-flow__edgeupdater";
function $p({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: i, onMouseEnter: a, onMouseOut: o, type: s }) {
	return (0, K.jsx)("circle", {
		onMouseDown: i,
		onMouseEnter: a,
		onMouseOut: o,
		className: q([Qp, `${Qp}-${s}`]),
		cx: Xp(t, r, e),
		cy: Zp(n, r, e),
		r,
		stroke: "transparent",
		fill: "transparent"
	});
}
function em({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: i, targetX: a, targetY: o, sourcePosition: s, targetPosition: c, onReconnect: l, onReconnectStart: u, onReconnectEnd: d, setReconnecting: f, setUpdateHover: p }) {
	let m = $(), h = (e, t) => {
		if (e.button !== 0) return;
		let { autoPanOnConnect: r, domNode: i, connectionMode: a, connectionRadius: o, lib: s, onConnectStart: c, cancelConnection: p, nodeLookup: h, rfId: g, panBy: _, updateConnection: v } = m.getState(), y = t.type === "target";
		Iu.onPointerDown(e.nativeEvent, {
			autoPanOnConnect: r,
			connectionMode: a,
			connectionRadius: o,
			domNode: i,
			handleId: t.id,
			nodeId: t.nodeId,
			nodeLookup: h,
			isTarget: y,
			edgeUpdaterType: t.type,
			lib: s,
			flowId: g,
			cancelConnection: p,
			panBy: _,
			isValidConnection: (...e) => m.getState().isValidConnection?.(...e) ?? !0,
			onConnect: (e) => l?.(n, e),
			onConnectStart: (r, i) => {
				f(!0), u?.(e, n, t.type), c?.(r, i);
			},
			onConnectEnd: (...e) => m.getState().onConnectEnd?.(...e),
			onReconnectEnd: (e, r) => {
				f(!1), d?.(e, n, t.type, r);
			},
			updateConnection: v,
			getTransform: () => m.getState().transform,
			getFromHandle: () => m.getState().connection.fromHandle,
			dragThreshold: m.getState().connectionDragThreshold,
			handleDomNode: e.currentTarget
		});
	}, g = (e) => h(e, {
		nodeId: n.target,
		id: n.targetHandle ?? null,
		type: "target"
	}), _ = (e) => h(e, {
		nodeId: n.source,
		id: n.sourceHandle ?? null,
		type: "source"
	}), v = () => p(!0), y = () => p(!1);
	return (0, K.jsxs)(K.Fragment, { children: [(e === !0 || e === "source") && (0, K.jsx)($p, {
		position: s,
		centerX: r,
		centerY: i,
		radius: t,
		onMouseDown: g,
		onMouseEnter: v,
		onMouseOut: y,
		type: "source"
	}), (e === !0 || e === "target") && (0, K.jsx)($p, {
		position: c,
		centerX: a,
		centerY: o,
		radius: t,
		onMouseDown: _,
		onMouseEnter: v,
		onMouseOut: y,
		type: "target"
	})] });
}
function tm({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: i, onDoubleClick: a, onContextMenu: o, onMouseEnter: s, onMouseMove: c, onMouseLeave: u, reconnectRadius: d, onReconnect: f, onReconnectStart: p, onReconnectEnd: m, rfId: h, edgeTypes: g, noPanClassName: _, onError: v, disableKeyboardA11y: y }) {
	let b = Q((t) => t.edgeLookup.get(e)), x = Q((e) => e.defaultEdgeOptions);
	b = x ? {
		...x,
		...b
	} : b;
	let S = b.type || "default", C = g?.[S] || Jp[S];
	C === void 0 && (v?.("011", wc.error011(S)), S = "default", C = g?.default || Jp.default);
	let w = !!(b.focusable || t && b.focusable === void 0), T = f !== void 0 && (b.reconnectable || n && b.reconnectable === void 0), E = !!(b.selectable || r && b.selectable === void 0), D = (0, l.useRef)(null), [O, k] = (0, l.useState)(!1), [A, j] = (0, l.useState)(!1), M = $(), { zIndex: N = b.zIndex, sourceX: P, sourceY: ee, targetX: F, targetY: I, sourcePosition: L, targetPosition: R } = Q((0, l.useCallback)((t) => {
		let n = t.nodeLookup.get(b.source), r = t.nodeLookup.get(b.target);
		if (!n || !r) return Yp;
		let i = Zl({
			id: e,
			sourceNode: n,
			targetNode: r,
			sourceHandle: b.sourceHandle || null,
			targetHandle: b.targetHandle || null,
			connectionMode: t.connectionMode,
			onError: v
		}), a = Rl({
			selected: b.selected,
			zIndex: b.zIndex,
			sourceNode: n,
			targetNode: r,
			elevateOnSelect: t.elevateEdgesOnSelect,
			zIndexMode: t.zIndexMode
		});
		return {
			...i || Yp,
			zIndex: a
		};
	}, [
		b.source,
		b.target,
		b.sourceHandle,
		b.targetHandle,
		b.selected,
		b.zIndex,
		v
	]), Z), z = (0, l.useMemo)(() => b.markerStart ? `url('#${tu(b.markerStart, h)}')` : void 0, [b.markerStart, h]), B = (0, l.useMemo)(() => b.markerEnd ? `url('#${tu(b.markerEnd, h)}')` : void 0, [b.markerEnd, h]);
	if (b.hidden || P === null || ee === null || F === null || I === null) return null;
	let V = (t) => {
		let { addSelectedEdges: n, unselectNodesAndEdges: r, multiSelectionActive: a } = M.getState();
		E && (M.setState({ nodesSelectionActive: !1 }), b.selected && a ? (r({
			nodes: [],
			edges: [b]
		}), D.current?.blur()) : n([e])), i && i(t, b);
	}, H = a ? (e) => {
		a(e, { ...b });
	} : void 0, U = o ? (e) => {
		o(e, { ...b });
	} : void 0, W = s ? (e) => {
		s(e, { ...b });
	} : void 0, te = c ? (e) => {
		c(e, { ...b });
	} : void 0, G = u ? (e) => {
		u(e, { ...b });
	} : void 0;
	return (0, K.jsx)("svg", {
		style: { zIndex: N },
		children: (0, K.jsxs)("g", {
			className: q([
				"react-flow__edge",
				`react-flow__edge-${S}`,
				b.className,
				_,
				{
					selected: b.selected,
					animated: b.animated,
					inactive: !E && !i,
					updating: O,
					selectable: E
				}
			]),
			onClick: V,
			onDoubleClick: H,
			onContextMenu: U,
			onMouseEnter: W,
			onMouseMove: te,
			onMouseLeave: G,
			onKeyDown: w ? (t) => {
				if (!y && Ec.includes(t.key) && E) {
					let { unselectNodesAndEdges: n, addSelectedEdges: r } = M.getState();
					t.key === "Escape" ? (D.current?.blur(), n({ edges: [b] })) : r([e]);
				}
			} : void 0,
			tabIndex: w ? 0 : void 0,
			role: b.ariaRole ?? (w ? "group" : "img"),
			"aria-roledescription": "edge",
			"data-id": e,
			"data-testid": `rf__edge-${e}`,
			"aria-label": b.ariaLabel === null ? void 0 : b.ariaLabel || `Edge from ${b.source} to ${b.target}`,
			"aria-describedby": w ? `${Od}-${h}` : void 0,
			ref: D,
			...b.domAttributes,
			children: [!A && (0, K.jsx)(C, {
				id: e,
				source: b.source,
				target: b.target,
				type: b.type,
				selected: b.selected,
				animated: b.animated,
				selectable: E,
				deletable: b.deletable ?? !0,
				label: b.label,
				labelStyle: b.labelStyle,
				labelShowBg: b.labelShowBg,
				labelBgStyle: b.labelBgStyle,
				labelBgPadding: b.labelBgPadding,
				labelBgBorderRadius: b.labelBgBorderRadius,
				sourceX: P,
				sourceY: ee,
				targetX: F,
				targetY: I,
				sourcePosition: L,
				targetPosition: R,
				data: b.data,
				style: b.style,
				sourceHandleId: b.sourceHandle,
				targetHandleId: b.targetHandle,
				markerStart: z,
				markerEnd: B,
				pathOptions: "pathOptions" in b ? b.pathOptions : void 0,
				interactionWidth: b.interactionWidth
			}), T && (0, K.jsx)(em, {
				edge: b,
				isReconnectable: T,
				reconnectRadius: d,
				onReconnect: f,
				onReconnectStart: p,
				onReconnectEnd: m,
				sourceX: P,
				sourceY: ee,
				targetX: F,
				targetY: I,
				sourcePosition: L,
				targetPosition: R,
				setUpdateHover: k,
				setReconnecting: j
			})]
		})
	});
}
var nm = (0, l.memo)(tm), rm = (e) => ({
	edgesFocusable: e.edgesFocusable,
	edgesReconnectable: e.edgesReconnectable,
	elementsSelectable: e.elementsSelectable,
	connectionMode: e.connectionMode,
	onError: e.onError
});
function im({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: i, onReconnect: a, onEdgeContextMenu: o, onEdgeMouseEnter: s, onEdgeMouseMove: c, onEdgeMouseLeave: l, onEdgeClick: u, reconnectRadius: d, onEdgeDoubleClick: f, onReconnectStart: p, onReconnectEnd: m, disableKeyboardA11y: h }) {
	let { edgesFocusable: g, edgesReconnectable: _, elementsSelectable: v, onError: y } = Q(rm, Z), b = bp(t);
	return (0, K.jsxs)("div", {
		className: "react-flow__edges",
		children: [(0, K.jsx)(Dp, {
			defaultColor: e,
			rfId: n
		}), b.map((e) => (0, K.jsx)(nm, {
			id: e,
			edgesFocusable: g,
			edgesReconnectable: _,
			elementsSelectable: v,
			noPanClassName: i,
			onReconnect: a,
			onContextMenu: o,
			onMouseEnter: s,
			onMouseMove: c,
			onMouseLeave: l,
			onClick: u,
			reconnectRadius: d,
			onDoubleClick: f,
			onReconnectStart: p,
			onReconnectEnd: m,
			rfId: n,
			onError: y,
			edgeTypes: r,
			disableKeyboardA11y: h
		}, e))]
	});
}
im.displayName = "EdgeRenderer";
var am = (0, l.memo)(im), om = (e) => `translate(${e[0]}px,${e[1]}px) scale(${e[2]})`;
function sm({ children: e }) {
	let t = $(), n = (0, l.useRef)(null), [r] = (0, l.useState)(() => t.getState().transform);
	return gf(() => {
		let e = null, r = () => {
			let r = t.getState().transform;
			e && r[0] === e[0] && r[1] === e[1] && r[2] === e[2] || (e = r, n.current && (n.current.style.transform = om(r)));
		};
		return r(), t.subscribe(r);
	}, [t]), (0, K.jsx)("div", {
		ref: n,
		className: "react-flow__viewport xyflow__viewport react-flow__container",
		style: { transform: om(r) },
		children: e
	});
}
function cm(e) {
	let t = Cf(), n = (0, l.useRef)(!1);
	(0, l.useEffect)(() => {
		!n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
	}, [e, t.viewportInitialized]);
}
var lm = (e) => e.panZoom?.syncViewport;
function um(e) {
	let t = Q(lm), n = $();
	return (0, l.useEffect)(() => {
		e && (t?.(e), n.setState({ transform: [
			e.x,
			e.y,
			e.zoom
		] }));
	}, [e, t]), null;
}
function dm(e) {
	return e.connection.inProgress ? {
		...e.connection,
		to: ul(e.connection.to, e.transform)
	} : { ...e.connection };
}
function fm(e) {
	return e ? (t) => e(dm(t)) : dm;
}
function pm(e) {
	return Q(fm(e), Z);
}
var mm = (e) => ({
	nodesConnectable: e.nodesConnectable,
	isValid: e.connection.isValid,
	inProgress: e.connection.inProgress,
	width: e.width,
	height: e.height
});
function hm({ containerStyle: e, style: t, type: n, component: r }) {
	let { nodesConnectable: i, width: a, height: o, isValid: s, inProgress: c } = Q(mm, Z);
	return a && i && c ? (0, K.jsx)("svg", {
		style: e,
		width: a,
		height: o,
		className: "react-flow__connectionline react-flow__container",
		children: (0, K.jsx)("g", {
			className: q(["react-flow__connection", wl(s)]),
			children: (0, K.jsx)(gm, {
				style: t,
				type: n,
				CustomComponent: r,
				isValid: s
			})
		})
	}) : null;
}
var gm = ({ style: e, type: t = Mc.Bezier, CustomComponent: n, isValid: r }) => {
	let { inProgress: i, from: a, fromNode: o, fromHandle: s, fromPosition: c, to: l, toNode: u, toHandle: d, toPosition: f, pointer: p } = pm();
	if (!i) return;
	if (n) return (0, K.jsx)(n, {
		connectionLineType: t,
		connectionLineStyle: e,
		fromNode: o,
		fromHandle: s,
		fromX: a.x,
		fromY: a.y,
		toX: l.x,
		toY: l.y,
		fromPosition: c,
		toPosition: f,
		connectionStatus: wl(r),
		toNode: u,
		toHandle: d,
		pointer: p
	});
	let m = "", h = {
		sourceX: a.x,
		sourceY: a.y,
		sourcePosition: c,
		targetX: l.x,
		targetY: l.y,
		targetPosition: f
	};
	switch (t) {
		case Mc.Bezier:
			[m] = Il(h);
			break;
		case Mc.SimpleBezier:
			[m] = Mp(h);
			break;
		case Mc.Step:
			[m] = Yl({
				...h,
				borderRadius: 0
			});
			break;
		case Mc.SmoothStep:
			[m] = Yl(h);
			break;
		default: [m] = Ul(h);
	}
	return (0, K.jsx)("path", {
		d: m,
		fill: "none",
		className: "react-flow__connection-path",
		style: e
	});
};
gm.displayName = "ConnectionLine";
var _m = {};
function vm(e = _m) {
	(0, l.useRef)(e), $(), (0, l.useEffect)(() => {}, [e]);
}
function ym() {
	$(), (0, l.useRef)(!1), (0, l.useEffect)(() => {}, []);
}
function bm({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: i, onNodeDoubleClick: a, onEdgeDoubleClick: o, onNodeMouseEnter: s, onNodeMouseMove: c, onNodeMouseLeave: l, onNodeContextMenu: u, onSelectionContextMenu: d, onSelectionStart: f, onSelectionEnd: p, connectionLineType: m, connectionLineStyle: h, connectionLineComponent: g, connectionLineContainerStyle: _, selectionKeyCode: v, selectionOnDrag: y, selectionMode: b, multiSelectionKeyCode: x, panActivationKeyCode: S, zoomActivationKeyCode: C, deleteKeyCode: w, onlyRenderVisibleElements: T, elementsSelectable: E, defaultViewport: D, translateExtent: O, minZoom: k, maxZoom: A, preventScrolling: j, defaultMarkerColor: M, zoomOnScroll: N, zoomOnPinch: P, panOnScroll: ee, panOnScrollSpeed: F, panOnScrollMode: I, zoomOnDoubleClick: L, panOnDrag: R, autoPanOnSelection: z, onPaneClick: B, onPaneMouseEnter: V, onPaneMouseMove: H, onPaneMouseLeave: U, onPaneScroll: W, onPaneContextMenu: te, paneClickDistance: G, nodeClickDistance: ne, onEdgeContextMenu: re, onEdgeMouseEnter: ie, onEdgeMouseMove: ae, onEdgeMouseLeave: oe, reconnectRadius: se, onReconnect: ce, onReconnectStart: le, onReconnectEnd: ue, noDragClassName: de, noWheelClassName: fe, noPanClassName: pe, disableKeyboardA11y: me, nodeExtent: he, rfId: ge, viewport: _e, onViewportChange: ve, nodesDraggable: ye }) {
	return vm(e), vm(t), ym(), cm(n), um(_e), (0, K.jsx)(lp, {
		onPaneClick: B,
		onPaneMouseEnter: V,
		onPaneMouseMove: H,
		onPaneMouseLeave: U,
		onPaneContextMenu: te,
		onPaneScroll: W,
		paneClickDistance: G,
		deleteKeyCode: w,
		selectionKeyCode: v,
		selectionOnDrag: y,
		selectionMode: b,
		onSelectionStart: f,
		onSelectionEnd: p,
		multiSelectionKeyCode: x,
		panActivationKeyCode: S,
		zoomActivationKeyCode: C,
		elementsSelectable: E,
		zoomOnScroll: N,
		zoomOnPinch: P,
		zoomOnDoubleClick: L,
		panOnScroll: ee,
		panOnScrollSpeed: F,
		panOnScrollMode: I,
		panOnDrag: R,
		autoPanOnSelection: z,
		defaultViewport: D,
		translateExtent: O,
		minZoom: k,
		maxZoom: A,
		onSelectionContextMenu: d,
		preventScrolling: j,
		noDragClassName: de,
		noWheelClassName: fe,
		noPanClassName: pe,
		disableKeyboardA11y: me,
		onViewportChange: ve,
		isControlledViewport: !!_e,
		children: (0, K.jsxs)(sm, { children: [
			(0, K.jsx)(am, {
				edgeTypes: t,
				onEdgeClick: i,
				onEdgeDoubleClick: o,
				onReconnect: ce,
				onReconnectStart: le,
				onReconnectEnd: ue,
				onlyRenderVisibleElements: T,
				onEdgeContextMenu: re,
				onEdgeMouseEnter: ie,
				onEdgeMouseMove: ae,
				onEdgeMouseLeave: oe,
				reconnectRadius: se,
				defaultMarkerColor: M,
				noPanClassName: pe,
				disableKeyboardA11y: me,
				rfId: ge
			}),
			(0, K.jsx)(hm, {
				style: h,
				type: m,
				component: g,
				containerStyle: _
			}),
			(0, K.jsx)("div", { className: "react-flow__edgelabel-renderer" }),
			(0, K.jsx)(yp, {
				nodeTypes: e,
				onNodeClick: r,
				onNodeDoubleClick: a,
				onNodeMouseEnter: s,
				onNodeMouseMove: c,
				onNodeMouseLeave: l,
				onNodeContextMenu: u,
				nodeClickDistance: ne,
				onlyRenderVisibleElements: T,
				noPanClassName: pe,
				noDragClassName: de,
				disableKeyboardA11y: me,
				nodeExtent: he,
				rfId: ge,
				nodesDraggable: ye
			}),
			(0, K.jsx)("div", { className: "react-flow__viewport-portal" })
		] })
	});
}
bm.displayName = "GraphView";
var xm = (0, l.memo)(bm), Sm = cl("React Flow", "https://reactflow.dev/"), Cm = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: a, fitView: o, fitViewOptions: s, minZoom: c = .5, maxZoom: l = 2, nodeOrigin: u, nodeExtent: d, zIndexMode: f = "basic" } = {}) => {
	let p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = r ?? t ?? [], v = n ?? e ?? [], y = u ?? [0, 0], b = d ?? Tc;
	bu(h, g, _);
	let { nodesInitialized: x } = du(v, p, m, {
		nodeOrigin: y,
		nodeExtent: b,
		zIndexMode: f
	}), S = [
		0,
		0,
		1
	];
	if (o && i && a) {
		let { x: e, y: t, zoom: n } = hl(Bc(p, { filter: (e) => !(!e.width && !e.initialWidth || !e.height && !e.initialHeight) }), i, a, c, l, s?.padding ?? .1);
		S = [
			e,
			t,
			n
		];
	}
	return {
		rfId: "1",
		width: i ?? 0,
		height: a ?? 0,
		transform: S,
		nodes: v,
		nodesInitialized: x,
		nodeLookup: p,
		parentLookup: m,
		edges: _,
		edgeLookup: g,
		connectionLookup: h,
		onNodesChange: null,
		onEdgesChange: null,
		hasDefaultNodes: n !== void 0,
		hasDefaultEdges: r !== void 0,
		panZoom: null,
		minZoom: c,
		maxZoom: l,
		translateExtent: Tc,
		nodeExtent: b,
		nodesSelectionActive: !1,
		userSelectionActive: !1,
		userSelectionRect: null,
		connectionMode: Oc.Strict,
		domNode: null,
		paneDragging: !1,
		noPanClassName: "nopan",
		nodeOrigin: y,
		nodeDragThreshold: 1,
		connectionDragThreshold: 1,
		snapGrid: [15, 15],
		snapToGrid: !1,
		nodesDraggable: !0,
		nodesConnectable: !0,
		nodesFocusable: !0,
		edgesFocusable: !0,
		edgesReconnectable: !0,
		elementsSelectable: !0,
		elevateNodesOnSelect: !0,
		elevateEdgesOnSelect: !0,
		selectNodesOnDrag: !0,
		multiSelectionActive: !1,
		fitViewQueued: o ?? !1,
		fitViewOptions: s,
		fitViewResolver: null,
		connection: { ...jc },
		connectionClickStartHandle: null,
		connectOnClick: !0,
		ariaLiveMessage: "",
		autoPanOnConnect: !0,
		autoPanOnNodeDrag: !0,
		autoPanOnNodeFocus: !0,
		autoPanSpeed: 15,
		connectionRadius: 20,
		onError: Sm,
		isValidConnection: void 0,
		onSelectionChangeHandlers: [],
		lib: "react",
		debug: !1,
		ariaLabelConfig: Dc,
		zIndexMode: f,
		defaultEdgeOptions: void 0,
		onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
		onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
		onNodesDelete: void 0,
		onEdgesDelete: void 0,
		onDelete: void 0,
		onBeforeDelete: void 0,
		onViewportChangeStart: void 0,
		onViewportChange: void 0,
		onViewportChangeEnd: void 0,
		onNodeDragStart: void 0,
		onNodeDrag: void 0,
		onNodeDragStop: void 0,
		onSelectionDragStart: void 0,
		onSelectionDrag: void 0,
		onSelectionDragStop: void 0,
		onMoveStart: void 0,
		onMove: void 0,
		onMoveEnd: void 0,
		onConnect: void 0,
		onConnectStart: void 0,
		onConnectEnd: void 0,
		onClickConnectStart: void 0,
		onClickConnectEnd: void 0
	};
}, wm = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: a, fitView: o, fitViewOptions: s, minZoom: c, maxZoom: l, nodeOrigin: u, nodeExtent: d, zIndexMode: f }) => xd((p, m) => {
	async function h() {
		let { nodeLookup: e, panZoom: t, fitViewOptions: n, fitViewResolver: r, width: i, height: a, minZoom: o, maxZoom: s } = m();
		t && (await Wc({
			nodes: e,
			width: i,
			height: a,
			panZoom: t,
			minZoom: o,
			maxZoom: s
		}, n), r?.resolve(!0), p({ fitViewResolver: null }));
	}
	return {
		...Cm({
			nodes: e,
			edges: t,
			width: i,
			height: a,
			fitView: o,
			fitViewOptions: s,
			minZoom: c,
			maxZoom: l,
			nodeOrigin: u,
			nodeExtent: d,
			defaultNodes: n,
			defaultEdges: r,
			zIndexMode: f
		}),
		setNodes: (e) => {
			let { nodeLookup: t, parentLookup: n, nodeOrigin: r, nodeExtent: i, elevateNodesOnSelect: a, fitViewQueued: o, zIndexMode: s, nodesSelectionActive: c } = m(), { nodesInitialized: l, hasSelectedNodes: u } = du(e, t, n, {
				nodeOrigin: r,
				nodeExtent: i,
				elevateNodesOnSelect: a,
				checkEquality: !0,
				zIndexMode: s
			}), d = c && u;
			o && l ? (h(), p({
				nodes: e,
				nodesInitialized: l,
				fitViewQueued: !1,
				fitViewOptions: void 0,
				nodesSelectionActive: d
			})) : p({
				nodes: e,
				nodesInitialized: l,
				nodesSelectionActive: d
			});
		},
		setEdges: (e) => {
			let { connectionLookup: t, edgeLookup: n } = m();
			bu(t, n, e), p({ edges: e });
		},
		setDefaultNodesAndEdges: (e, t) => {
			if (e) {
				let { setNodes: t } = m();
				t(e), p({ hasDefaultNodes: !0 });
			}
			if (t) {
				let { setEdges: e } = m();
				e(t), p({ hasDefaultEdges: !0 });
			}
		},
		updateNodeInternals: (e) => {
			let { triggerNodeChanges: t, nodeLookup: n, parentLookup: r, domNode: i, nodeOrigin: a, nodeExtent: o, debug: s, fitViewQueued: c, zIndexMode: l } = m(), { changes: u, updatedInternals: d } = _u(e, n, r, i, a, o, l);
			d && (cu(n, r, {
				nodeOrigin: a,
				nodeExtent: o,
				zIndexMode: l
			}), c ? (h(), p({
				fitViewQueued: !1,
				fitViewOptions: void 0
			})) : p({}), u?.length > 0 && (s && console.log("React Flow: trigger node changes", u), t?.(u)));
		},
		updateNodePositions: (e, t = !1) => {
			let n = [], r = [], { nodeLookup: i, triggerNodeChanges: a, connection: o, updateConnection: s, onNodesChangeMiddlewareMap: c } = m();
			for (let [a, c] of e) {
				let e = i.get(a), l = !!(e?.expandParent && e?.parentId && c?.position), u = {
					id: a,
					type: "position",
					position: l ? {
						x: Math.max(0, c.position.x),
						y: Math.max(0, c.position.y)
					} : c.position,
					dragging: t
				};
				if (e && o.inProgress && o.fromNode.id === e.id) {
					let t = $l(e, o.fromHandle, X.Left, !0);
					s({
						...o,
						from: t
					});
				}
				l && e.parentId && n.push({
					id: a,
					parentId: e.parentId,
					rect: {
						...c.internals.positionAbsolute,
						width: c.measured.width ?? 0,
						height: c.measured.height ?? 0
					}
				}), r.push(u);
			}
			if (n.length > 0) {
				let { parentLookup: e, nodeOrigin: t } = m(), a = gu(n, i, e, t);
				r.push(...a);
			}
			for (let e of c.values()) r = e(r);
			a(r);
		},
		triggerNodeChanges: (e) => {
			let { onNodesChange: t, setNodes: n, nodes: r, hasDefaultNodes: i, debug: a } = m();
			e?.length && (i && n(af(e, r)), a && console.log("React Flow: trigger node changes", e), t?.(e));
		},
		triggerEdgeChanges: (e) => {
			let { onEdgesChange: t, setEdges: n, edges: r, hasDefaultEdges: i, debug: a } = m();
			e?.length && (i && n(of(e, r)), a && console.log("React Flow: trigger edge changes", e), t?.(e));
		},
		addSelectedNodes: (e) => {
			let { multiSelectionActive: t, edgeLookup: n, nodeLookup: r, triggerNodeChanges: i, triggerEdgeChanges: a } = m();
			t ? i(e.map((e) => sf(e, !0))) : (i(cf(r, /* @__PURE__ */ new Set([...e]), !0)), a(cf(n)));
		},
		addSelectedEdges: (e) => {
			let { multiSelectionActive: t, edgeLookup: n, nodeLookup: r, triggerNodeChanges: i, triggerEdgeChanges: a } = m();
			t ? a(e.map((e) => sf(e, !0))) : (a(cf(n, /* @__PURE__ */ new Set([...e]))), i(cf(r, /* @__PURE__ */ new Set(), !0)));
		},
		unselectNodesAndEdges: ({ nodes: e, edges: t } = {}) => {
			let { edges: n, nodes: r, nodeLookup: i, triggerNodeChanges: a, triggerEdgeChanges: o } = m(), s = e || r, c = t || n, l = [];
			for (let e of s) {
				if (!e.selected) continue;
				let t = i.get(e.id);
				t && (t.selected = !1), l.push(sf(e.id, !1));
			}
			let u = [];
			for (let e of c) e.selected && u.push(sf(e.id, !1));
			a(l), o(u);
		},
		setMinZoom: (e) => {
			let { panZoom: t, maxZoom: n } = m();
			t?.setScaleExtent([e, n]), p({ minZoom: e });
		},
		setMaxZoom: (e) => {
			let { panZoom: t, minZoom: n } = m();
			t?.setScaleExtent([n, e]), p({ maxZoom: e });
		},
		setTranslateExtent: (e) => {
			m().panZoom?.setTranslateExtent(e), p({ translateExtent: e });
		},
		resetSelectedElements: () => {
			let { edges: e, nodes: t, triggerNodeChanges: n, triggerEdgeChanges: r, elementsSelectable: i } = m();
			if (!i) return;
			let a = t.reduce((e, t) => t.selected ? [...e, sf(t.id, !1)] : e, []), o = e.reduce((e, t) => t.selected ? [...e, sf(t.id, !1)] : e, []);
			n(a), r(o);
		},
		setNodeExtent: (e) => {
			let { nodes: t, nodeLookup: n, parentLookup: r, nodeOrigin: i, elevateNodesOnSelect: a, nodeExtent: o, zIndexMode: s } = m();
			(e[0][0] !== o[0][0] || e[0][1] !== o[0][1] || e[1][0] !== o[1][0] || e[1][1] !== o[1][1]) && (du(t, n, r, {
				nodeOrigin: i,
				nodeExtent: e,
				elevateNodesOnSelect: a,
				checkEquality: !1,
				zIndexMode: s
			}), p({ nodeExtent: e }));
		},
		panBy: (e) => {
			let { transform: t, width: n, height: r, panZoom: i, translateExtent: a } = m();
			return vu({
				delta: e,
				panZoom: i,
				transform: t,
				translateExtent: a,
				width: n,
				height: r
			});
		},
		setCenter: async (e, t, n) => {
			let { width: r, height: i, maxZoom: a, panZoom: o } = m();
			if (!o) return !1;
			let s = n?.zoom === void 0 ? a : n.zoom;
			return await o.setViewport({
				x: r / 2 - e * s,
				y: i / 2 - t * s,
				zoom: s
			}, {
				duration: n?.duration,
				ease: n?.ease,
				interpolate: n?.interpolate
			}), !0;
		},
		cancelConnection: () => {
			p({ connection: { ...jc } });
		},
		updateConnection: (e) => {
			p({ connection: e });
		},
		reset: () => p({ ...Cm() })
	};
}, Object.is);
function Tm({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: i, initialHeight: a, initialMinZoom: o, initialMaxZoom: s, initialFitViewOptions: c, fitView: u, nodeOrigin: d, nodeExtent: f, zIndexMode: p, children: m }) {
	let [h] = (0, l.useState)(() => wm({
		nodes: e,
		edges: t,
		defaultNodes: n,
		defaultEdges: r,
		width: i,
		height: a,
		fitView: u,
		minZoom: o,
		maxZoom: s,
		fitViewOptions: c,
		nodeOrigin: d,
		nodeExtent: f,
		zIndexMode: p
	}));
	return (0, K.jsx)(Cd, {
		value: h,
		children: (0, K.jsx)(bf, { children: (0, K.jsx)(Gf, { children: m }) })
	});
}
function Em({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: i, width: a, height: o, fitView: s, fitViewOptions: c, minZoom: u, maxZoom: d, nodeOrigin: f, nodeExtent: p, zIndexMode: m }) {
	return (0, l.useContext)(Sd) ? (0, K.jsx)(K.Fragment, { children: e }) : (0, K.jsx)(Tm, {
		initialNodes: t,
		initialEdges: n,
		defaultNodes: r,
		defaultEdges: i,
		initialWidth: a,
		initialHeight: o,
		fitView: s,
		initialFitViewOptions: c,
		initialMinZoom: u,
		initialMaxZoom: d,
		nodeOrigin: f,
		nodeExtent: p,
		zIndexMode: m,
		children: e
	});
}
var Dm = {
	width: "100%",
	height: "100%",
	overflow: "hidden",
	position: "relative",
	zIndex: 0
};
function Om({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: i, nodeTypes: a, edgeTypes: o, onNodeClick: s, onEdgeClick: c, onInit: u, onMove: d, onMoveStart: f, onMoveEnd: p, onConnect: m, onConnectStart: h, onConnectEnd: g, onClickConnectStart: _, onClickConnectEnd: v, onNodeMouseEnter: y, onNodeMouseMove: b, onNodeMouseLeave: x, onNodeContextMenu: S, onNodeDoubleClick: C, onNodeDragStart: w, onNodeDrag: T, onNodeDragStop: E, onNodesDelete: D, onEdgesDelete: O, onDelete: k, onSelectionChange: A, onSelectionDragStart: j, onSelectionDrag: M, onSelectionDragStop: N, onSelectionContextMenu: P, onSelectionStart: ee, onSelectionEnd: F, onBeforeDelete: I, connectionMode: L, connectionLineType: R = Mc.Bezier, connectionLineStyle: z, connectionLineComponent: B, connectionLineContainerStyle: V, deleteKeyCode: H = "Backspace", selectionKeyCode: U = "Shift", selectionOnDrag: W = !1, selectionMode: te = Ac.Full, panActivationKeyCode: G = "Space", multiSelectionKeyCode: ne = gl() ? "Meta" : "Control", zoomActivationKeyCode: re = gl() ? "Meta" : "Control", snapToGrid: ie, snapGrid: ae, onlyRenderVisibleElements: oe = !1, selectNodesOnDrag: se, nodesDraggable: ce, autoPanOnNodeFocus: le, nodesConnectable: ue, nodesFocusable: de, nodeOrigin: fe = Ud, edgesFocusable: pe, edgesReconnectable: me, elementsSelectable: he = !0, defaultViewport: ge = Wd, minZoom: _e = .5, maxZoom: ve = 2, translateExtent: ye = Tc, preventScrolling: be = !0, nodeExtent: xe, defaultMarkerColor: Se = "#b1b1b7", zoomOnScroll: Ce = !0, zoomOnPinch: we = !0, panOnScroll: Te = !1, panOnScrollSpeed: Ee = .5, panOnScrollMode: De = kc.Free, zoomOnDoubleClick: Oe = !0, panOnDrag: ke = !0, onPaneClick: Ae, onPaneMouseEnter: je, onPaneMouseMove: Me, onPaneMouseLeave: Ne, onPaneScroll: Pe, onPaneContextMenu: Fe, paneClickDistance: Ie = 1, nodeClickDistance: Le = 0, children: Re, onReconnect: ze, onReconnectStart: Be, onReconnectEnd: Ve, onEdgeContextMenu: He, onEdgeDoubleClick: Ue, onEdgeMouseEnter: We, onEdgeMouseMove: Ge, onEdgeMouseLeave: Ke, reconnectRadius: qe = 10, onNodesChange: Je, onEdgesChange: Ye, noDragClassName: Xe = "nodrag", noWheelClassName: Ze = "nowheel", noPanClassName: Qe = "nopan", fitView: $e, fitViewOptions: et, connectOnClick: tt, attributionPosition: nt, proOptions: rt, defaultEdgeOptions: it, elevateNodesOnSelect: at = !0, elevateEdgesOnSelect: ot = !1, disableKeyboardA11y: st = !1, autoPanOnConnect: ct, autoPanOnNodeDrag: lt, autoPanOnSelection: ut = !0, autoPanSpeed: dt, connectionRadius: ft, isValidConnection: pt, onError: mt, style: ht, id: gt, nodeDragThreshold: _t, connectionDragThreshold: vt, viewport: yt, onViewportChange: bt, width: xt, height: St, colorMode: Ct = "light", debug: wt, onScroll: Tt, ariaLabelConfig: Et, zIndexMode: Dt = "basic", ...Ot }, kt) {
	let At = gt || "1", jt = Xd(Ct), Mt = (0, l.useCallback)((e) => {
		e.currentTarget.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		}), Tt?.(e);
	}, [Tt]);
	return (0, K.jsx)("div", {
		"data-testid": "rf__wrapper",
		...Ot,
		onScroll: Mt,
		style: {
			...ht,
			...Dm
		},
		ref: kt,
		className: q([
			"react-flow",
			i,
			jt
		]),
		id: gt,
		role: "application",
		children: (0, K.jsxs)(Em, {
			nodes: e,
			edges: t,
			width: xt,
			height: St,
			fitView: $e,
			fitViewOptions: et,
			minZoom: _e,
			maxZoom: ve,
			nodeOrigin: fe,
			nodeExtent: xe,
			zIndexMode: Dt,
			children: [
				(0, K.jsx)(Jd, {
					nodes: e,
					edges: t,
					defaultNodes: n,
					defaultEdges: r,
					onConnect: m,
					onConnectStart: h,
					onConnectEnd: g,
					onClickConnectStart: _,
					onClickConnectEnd: v,
					nodesDraggable: ce,
					autoPanOnNodeFocus: le,
					nodesConnectable: ue,
					nodesFocusable: de,
					edgesFocusable: pe,
					edgesReconnectable: me,
					elementsSelectable: he,
					elevateNodesOnSelect: at,
					elevateEdgesOnSelect: ot,
					minZoom: _e,
					maxZoom: ve,
					nodeExtent: xe,
					onNodesChange: Je,
					onEdgesChange: Ye,
					snapToGrid: ie,
					snapGrid: ae,
					connectionMode: L,
					translateExtent: ye,
					connectOnClick: tt,
					defaultEdgeOptions: it,
					fitView: $e,
					fitViewOptions: et,
					onNodesDelete: D,
					onEdgesDelete: O,
					onDelete: k,
					onNodeDragStart: w,
					onNodeDrag: T,
					onNodeDragStop: E,
					onSelectionDrag: M,
					onSelectionDragStart: j,
					onSelectionDragStop: N,
					onMove: d,
					onMoveStart: f,
					onMoveEnd: p,
					noPanClassName: Qe,
					nodeOrigin: fe,
					rfId: At,
					autoPanOnConnect: ct,
					autoPanOnNodeDrag: lt,
					autoPanSpeed: dt,
					onError: mt,
					connectionRadius: ft,
					isValidConnection: pt,
					selectNodesOnDrag: se,
					nodeDragThreshold: _t,
					connectionDragThreshold: vt,
					onBeforeDelete: I,
					debug: wt,
					ariaLabelConfig: Et,
					zIndexMode: Dt
				}),
				(0, K.jsx)(xm, {
					onInit: u,
					onNodeClick: s,
					onEdgeClick: c,
					onNodeMouseEnter: y,
					onNodeMouseMove: b,
					onNodeMouseLeave: x,
					onNodeContextMenu: S,
					onNodeDoubleClick: C,
					nodeTypes: a,
					edgeTypes: o,
					connectionLineType: R,
					connectionLineStyle: z,
					connectionLineComponent: B,
					connectionLineContainerStyle: V,
					selectionKeyCode: U,
					selectionOnDrag: W,
					selectionMode: te,
					deleteKeyCode: H,
					multiSelectionKeyCode: ne,
					panActivationKeyCode: G,
					zoomActivationKeyCode: re,
					onlyRenderVisibleElements: oe,
					defaultViewport: ge,
					translateExtent: ye,
					minZoom: _e,
					maxZoom: ve,
					preventScrolling: be,
					zoomOnScroll: Ce,
					zoomOnPinch: we,
					zoomOnDoubleClick: Oe,
					panOnScroll: Te,
					panOnScrollSpeed: Ee,
					panOnScrollMode: De,
					panOnDrag: ke,
					autoPanOnSelection: ut,
					onPaneClick: Ae,
					onPaneMouseEnter: je,
					onPaneMouseMove: Me,
					onPaneMouseLeave: Ne,
					onPaneScroll: Pe,
					onPaneContextMenu: Fe,
					paneClickDistance: Ie,
					nodeClickDistance: Le,
					onSelectionContextMenu: P,
					onSelectionStart: ee,
					onSelectionEnd: F,
					onReconnect: ze,
					onReconnectStart: Be,
					onReconnectEnd: Ve,
					onEdgeContextMenu: He,
					onEdgeDoubleClick: Ue,
					onEdgeMouseEnter: We,
					onEdgeMouseMove: Ge,
					onEdgeMouseLeave: Ke,
					reconnectRadius: qe,
					defaultMarkerColor: Se,
					noDragClassName: Xe,
					noWheelClassName: Ze,
					noPanClassName: Qe,
					rfId: At,
					disableKeyboardA11y: st,
					nodeExtent: xe,
					viewport: yt,
					onViewportChange: bt,
					nodesDraggable: ce
				}),
				(0, K.jsx)(Hd, { onSelectionChange: A }),
				Re,
				(0, K.jsx)(Id, {
					proOptions: rt,
					position: nt
				}),
				(0, K.jsx)(Nd, {
					rfId: At,
					disableKeyboardA11y: st
				})
			]
		})
	});
}
var km = hf(Om);
function Am(e) {
	let [t, n] = (0, l.useState)(e);
	return [
		t,
		n,
		(0, l.useCallback)((e) => n((t) => af(e, t)), [])
	];
}
function jm(e) {
	let [t, n] = (0, l.useState)(e);
	return [
		t,
		n,
		(0, l.useCallback)((e) => n((t) => of(e, t)), [])
	];
}
wc.error014();
function Mm({ dimensions: e, lineWidth: t, variant: n, className: r }) {
	return (0, K.jsx)("path", {
		strokeWidth: t,
		d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`,
		className: q([
			"react-flow__background-pattern",
			n,
			r
		])
	});
}
function Nm({ radius: e, className: t }) {
	return (0, K.jsx)("circle", {
		cx: e,
		cy: e,
		r: e,
		className: q([
			"react-flow__background-pattern",
			"dots",
			t
		])
	});
}
var Pm;
(function(e) {
	e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(Pm ||= {});
var Fm = {
	[Pm.Dots]: 1,
	[Pm.Lines]: 1,
	[Pm.Cross]: 6
}, Im = (e) => ({
	transform: e.transform,
	patternId: `pattern-${e.rfId}`
});
function Lm({ id: e, variant: t = Pm.Dots, gap: n = 20, size: r, lineWidth: i = 1, offset: a = 0, color: o, bgColor: s, style: c, className: u, patternClassName: d }) {
	let f = (0, l.useRef)(null), { transform: p, patternId: m } = Q(Im, Z), h = r || Fm[t], g = t === Pm.Dots, _ = t === Pm.Cross, v = Array.isArray(n) ? n : [n, n], y = [v[0] * p[2] || 1, v[1] * p[2] || 1], b = h * p[2], x = Array.isArray(a) ? a : [a, a], S = _ ? [b, b] : y, C = [x[0] * p[2] + S[0] / 2, x[1] * p[2] + S[1] / 2], w = `${m}${e || ""}`;
	return (0, K.jsxs)("svg", {
		className: q(["react-flow__background", u]),
		style: {
			...c,
			...Of,
			"--xy-background-color-props": s,
			"--xy-background-pattern-color-props": o
		},
		ref: f,
		"data-testid": "rf__background",
		children: [(0, K.jsx)("pattern", {
			id: w,
			x: p[0] % y[0],
			y: p[1] % y[1],
			width: y[0],
			height: y[1],
			patternUnits: "userSpaceOnUse",
			patternTransform: `translate(-${C[0]},-${C[1]})`,
			children: g ? (0, K.jsx)(Nm, {
				radius: b / 2,
				className: d
			}) : (0, K.jsx)(Mm, {
				dimensions: S,
				lineWidth: i,
				variant: t,
				className: d
			})
		}), (0, K.jsx)("rect", {
			x: "0",
			y: "0",
			width: "100%",
			height: "100%",
			fill: `url(#${w})`
		})]
	});
}
Lm.displayName = "Background";
var Rm = (0, l.memo)(Lm);
function zm() {
	return (0, K.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 32",
		children: (0, K.jsx)("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" })
	});
}
function Bm() {
	return (0, K.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 5",
		children: (0, K.jsx)("path", { d: "M0 0h32v4.2H0z" })
	});
}
function Vm() {
	return (0, K.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 32 30",
		children: (0, K.jsx)("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" })
	});
}
function Hm() {
	return (0, K.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 25 32",
		children: (0, K.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" })
	});
}
function Um() {
	return (0, K.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 25 32",
		children: (0, K.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" })
	});
}
function Wm({ children: e, className: t, ...n }) {
	return (0, K.jsx)("button", {
		type: "button",
		className: q(["react-flow__controls-button", t]),
		...n,
		children: e
	});
}
var Gm = (e) => ({
	isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
	minZoomReached: e.transform[2] <= e.minZoom,
	maxZoomReached: e.transform[2] >= e.maxZoom,
	ariaLabelConfig: e.ariaLabelConfig
});
function Km({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: i, onZoomIn: a, onZoomOut: o, onFitView: s, onInteractiveChange: c, className: l, children: u, position: d = "bottom-left", orientation: f = "vertical", "aria-label": p }) {
	let m = $(), { isInteractive: h, minZoomReached: g, maxZoomReached: _, ariaLabelConfig: v } = Q(Gm, Z), { zoomIn: y, zoomOut: b, fitView: x } = Cf();
	return (0, K.jsxs)(Pd, {
		className: q([
			"react-flow__controls",
			f === "horizontal" ? "horizontal" : "vertical",
			l
		]),
		position: d,
		style: e,
		"data-testid": "rf__controls",
		"aria-label": p ?? v["controls.ariaLabel"],
		children: [
			t && (0, K.jsxs)(K.Fragment, { children: [(0, K.jsx)(Wm, {
				onClick: () => {
					y(), a?.();
				},
				className: "react-flow__controls-zoomin",
				title: v["controls.zoomIn.ariaLabel"],
				"aria-label": v["controls.zoomIn.ariaLabel"],
				disabled: _,
				children: (0, K.jsx)(zm, {})
			}), (0, K.jsx)(Wm, {
				onClick: () => {
					b(), o?.();
				},
				className: "react-flow__controls-zoomout",
				title: v["controls.zoomOut.ariaLabel"],
				"aria-label": v["controls.zoomOut.ariaLabel"],
				disabled: g,
				children: (0, K.jsx)(Bm, {})
			})] }),
			n && (0, K.jsx)(Wm, {
				className: "react-flow__controls-fitview",
				onClick: () => {
					x(i), s?.();
				},
				title: v["controls.fitView.ariaLabel"],
				"aria-label": v["controls.fitView.ariaLabel"],
				children: (0, K.jsx)(Vm, {})
			}),
			r && (0, K.jsx)(Wm, {
				className: "react-flow__controls-interactive",
				onClick: () => {
					m.setState({
						nodesDraggable: !h,
						nodesConnectable: !h,
						elementsSelectable: !h
					}), c?.(!h);
				},
				title: v["controls.interactive.ariaLabel"],
				"aria-label": v["controls.interactive.ariaLabel"],
				children: h ? (0, K.jsx)(Um, {}) : (0, K.jsx)(Hm, {})
			}),
			u
		]
	});
}
Km.displayName = "Controls";
var qm = (0, l.memo)(Km);
function Jm({ id: e, x: t, y: n, width: r, height: i, style: a, color: o, strokeColor: s, strokeWidth: c, className: l, borderRadius: u, shapeRendering: d, selected: f, onClick: p }) {
	let { background: m, backgroundColor: h } = a || {}, g = o || m || h;
	return (0, K.jsx)("rect", {
		className: q([
			"react-flow__minimap-node",
			{ selected: f },
			l
		]),
		x: t,
		y: n,
		rx: u,
		ry: u,
		width: r,
		height: i,
		style: {
			fill: g,
			stroke: s,
			strokeWidth: c
		},
		shapeRendering: d,
		onClick: p ? (t) => p(t, e) : void 0
	});
}
var Ym = (0, l.memo)(Jm), Xm = (e) => e.nodes.map((e) => e.id), Zm = (e) => e instanceof Function ? e : () => e;
function Qm({ nodeStrokeColor: e, nodeColor: t, nodeClassName: n = "", nodeBorderRadius: r = 5, nodeStrokeWidth: i, nodeComponent: a = Ym, onClick: o }) {
	let s = Q(Xm, Z), c = Zm(t), l = Zm(e), u = Zm(n), d = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
	return (0, K.jsx)(K.Fragment, { children: s.map((e) => (0, K.jsx)(eh, {
		id: e,
		nodeColorFunc: c,
		nodeStrokeColorFunc: l,
		nodeClassNameFunc: u,
		nodeBorderRadius: r,
		nodeStrokeWidth: i,
		NodeComponent: a,
		onClick: o,
		shapeRendering: d
	}, e)) });
}
function $m({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: i, nodeStrokeWidth: a, shapeRendering: o, NodeComponent: s, onClick: c }) {
	let { node: l, x: u, y: d, width: f, height: p } = Q((t) => {
		let n = t.nodeLookup.get(e);
		if (!n) return {
			node: void 0,
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		let r = n.internals.userNode, { x: i, y: a } = n.internals.positionAbsolute, { width: o, height: s } = vl(r);
		return {
			node: r,
			x: i,
			y: a,
			width: o,
			height: s
		};
	}, Z);
	return !l || l.hidden || !yl(l) ? null : (0, K.jsx)(s, {
		x: u,
		y: d,
		width: f,
		height: p,
		style: l.style,
		selected: !!l.selected,
		className: r(l),
		color: t(l),
		borderRadius: i,
		strokeColor: n(l),
		strokeWidth: a,
		shapeRendering: o,
		onClick: c,
		id: l.id
	});
}
var eh = (0, l.memo)($m), th = (0, l.memo)(Qm), nh = 200, rh = 150, ih = (e) => !e.hidden, ah = (e) => {
	let t = {
		x: -e.transform[0] / e.transform[2],
		y: -e.transform[1] / e.transform[2],
		width: e.width / e.transform[2],
		height: e.height / e.transform[2]
	}, n = !1;
	for (let t of e.nodeLookup.values()) if (!t.hidden) {
		n = !0;
		break;
	}
	return {
		viewBB: t,
		boundingRect: n ? rl(Bc(e.nodeLookup, { filter: ih }), t) : t,
		rfId: e.rfId,
		panZoom: e.panZoom,
		translateExtent: e.translateExtent,
		flowWidth: e.width,
		flowHeight: e.height,
		ariaLabelConfig: e.ariaLabelConfig
	};
}, oh = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, sh = (e, t) => oh(e.viewBB, t.viewBB) && oh(e.boundingRect, t.boundingRect) && e.rfId === t.rfId && e.panZoom === t.panZoom && e.translateExtent === t.translateExtent && e.flowWidth === t.flowWidth && e.flowHeight === t.flowHeight && e.ariaLabelConfig === t.ariaLabelConfig, ch = "react-flow__minimap-desc";
function lh({ style: e, className: t, nodeStrokeColor: n, nodeColor: r, nodeClassName: i = "", nodeBorderRadius: a = 5, nodeStrokeWidth: o, nodeComponent: s, bgColor: c, maskColor: u, maskStrokeColor: d, maskStrokeWidth: f, position: p = "bottom-right", onClick: m, onNodeClick: h, pannable: g = !1, zoomable: _ = !1, ariaLabel: v, inversePan: y, zoomStep: b = 1, offsetScale: x = 5 }) {
	let S = $(), C = (0, l.useRef)(null), { boundingRect: w, panZoom: T, viewBB: E, rfId: D, translateExtent: O, flowWidth: k, flowHeight: A, ariaLabelConfig: j } = Q(ah, sh), M = e?.width ?? nh, N = e?.height ?? rh, P = w.width / M, ee = w.height / N, F = Math.max(P, ee), I = F * M, L = F * N, R = x * F, z = w.x - (I - w.width) / 2 - R, B = w.y - (L - w.height) / 2 - R, V = I + R * 2, H = L + R * 2, U = `${ch}-${D}`, W = (0, l.useRef)(0), te = (0, l.useRef)();
	W.current = F, (0, l.useEffect)(() => {
		let e = S.getState().panZoom;
		if (C.current && e) return te.current = Lu({
			domNode: C.current,
			panZoom: e,
			getTransform: () => S.getState().transform,
			getViewScale: () => W.current
		}), () => {
			te.current?.destroy();
		};
	}, [T]), (0, l.useEffect)(() => {
		te.current?.update({
			translateExtent: O,
			width: k,
			height: A,
			inversePan: y,
			pannable: g,
			zoomStep: b,
			zoomable: _
		});
	}, [
		g,
		_,
		y,
		b,
		O,
		k,
		A
	]);
	let G = m ? (e) => {
		let [t, n] = te.current?.pointer(e) || [0, 0];
		m(e, {
			x: t,
			y: n
		});
	} : void 0, ne = (0, l.useCallback)((e, t) => {
		let n = S.getState().nodeLookup.get(t).internals.userNode;
		h?.(e, n);
	}, [h]), re = h ? ne : void 0, ie = v ?? j["minimap.ariaLabel"];
	return (0, K.jsx)(Pd, {
		position: p,
		style: {
			...e,
			"--xy-minimap-background-color-props": typeof c == "string" ? c : void 0,
			"--xy-minimap-mask-background-color-props": typeof u == "string" ? u : void 0,
			"--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
			"--xy-minimap-mask-stroke-width-props": typeof f == "number" ? f * F : void 0,
			"--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
			"--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
			"--xy-minimap-node-stroke-width-props": typeof o == "number" ? o : void 0
		},
		className: q(["react-flow__minimap", t]),
		"data-testid": "rf__minimap",
		children: (0, K.jsxs)("svg", {
			width: M,
			height: N,
			viewBox: `${z} ${B} ${V} ${H}`,
			className: "react-flow__minimap-svg",
			role: "img",
			"aria-labelledby": U,
			ref: C,
			onClick: G,
			children: [
				ie && (0, K.jsx)("title", {
					id: U,
					children: ie
				}),
				(0, K.jsx)(th, {
					onClick: re,
					nodeColor: r,
					nodeStrokeColor: n,
					nodeBorderRadius: a,
					nodeClassName: i,
					nodeStrokeWidth: o,
					nodeComponent: s
				}),
				(0, K.jsx)("path", {
					className: "react-flow__minimap-mask",
					d: `M${z - R},${B - R}h${V + R * 2}v${H + R * 2}h${-V - R * 2}z
        M${E.x},${E.y}h${E.width}v${E.height}h${-E.width}z`,
					fillRule: "evenodd",
					pointerEvents: "none"
				})
			]
		})
	});
}
lh.displayName = "MiniMap";
var uh = (0, l.memo)(lh), dh = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, fh = {
	[Qu.Line]: "right",
	[Qu.Handle]: "bottom-right"
};
function ph({ nodeId: e, position: t, variant: n = Qu.Handle, className: r, style: i = void 0, children: a, color: o, minWidth: s = 10, minHeight: c = 10, maxWidth: u = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: f = !1, resizeDirection: p, autoScale: m = !0, shouldResize: h, onResizeStart: g, onResize: _, onResizeEnd: v }) {
	let y = Hf(), b = typeof e == "string" ? e : y, x = $(), S = (0, l.useRef)(null), C = n === Qu.Handle, w = Q((0, l.useCallback)(dh(C && m), [C, m]), Z), T = (0, l.useRef)(null), E = t ?? fh[n];
	(0, l.useEffect)(() => {
		if (S.current && b) return T.current ||= ld({
			domNode: S.current,
			nodeId: b,
			getStoreItems: () => {
				let { nodeLookup: e, transform: t, snapGrid: n, snapToGrid: r, nodeOrigin: i, domNode: a } = x.getState();
				return {
					nodeLookup: e,
					transform: t,
					snapGrid: n,
					snapToGrid: r,
					nodeOrigin: i,
					paneDomNode: a
				};
			},
			onChange: (e, t) => {
				let { triggerNodeChanges: n, nodeLookup: r, parentLookup: i, nodeOrigin: a } = x.getState(), o = [], s = {
					x: e.x,
					y: e.y
				}, c = r.get(b);
				if (c && c.expandParent && c.parentId) {
					let t = c.origin ?? a, n = e.width ?? c.measured.width ?? 0, l = e.height ?? c.measured.height ?? 0, u = gu([{
						id: c.id,
						parentId: c.parentId,
						rect: {
							width: n,
							height: l,
							...bl({
								x: e.x ?? c.position.x,
								y: e.y ?? c.position.y
							}, {
								width: n,
								height: l
							}, c.parentId, r, t)
						}
					}], r, i, a);
					o.push(...u), s.x = e.x ? Math.max(t[0] * n, e.x) : void 0, s.y = e.y ? Math.max(t[1] * l, e.y) : void 0;
				}
				if (s.x !== void 0 && s.y !== void 0) {
					let e = {
						id: b,
						type: "position",
						position: { ...s }
					};
					o.push(e);
				}
				if (e.width !== void 0 && e.height !== void 0) {
					let t = {
						id: b,
						type: "dimensions",
						resizing: !0,
						setAttributes: p ? p === "horizontal" ? "width" : "height" : !0,
						dimensions: {
							width: e.width,
							height: e.height
						}
					};
					o.push(t);
				}
				for (let e of t) {
					let t = {
						...e,
						type: "position"
					};
					o.push(t);
				}
				n(o);
			},
			onEnd: ({ width: e, height: t }) => {
				let n = {
					id: b,
					type: "dimensions",
					resizing: !1,
					dimensions: {
						width: e,
						height: t
					}
				};
				x.getState().triggerNodeChanges([n]);
			}
		}), T.current.update({
			controlPosition: E,
			boundaries: {
				minWidth: s,
				minHeight: c,
				maxWidth: u,
				maxHeight: d
			},
			keepAspectRatio: f,
			resizeDirection: p,
			onResizeStart: g,
			onResize: _,
			onResizeEnd: v,
			shouldResize: h
		}), () => {
			T.current?.destroy();
		};
	}, [
		E,
		s,
		c,
		u,
		d,
		f,
		g,
		_,
		v,
		h
	]);
	let D = E.split("-");
	return (0, K.jsx)("div", {
		className: q([
			"react-flow__resize-control",
			"nodrag",
			...D,
			n,
			r
		]),
		ref: S,
		style: {
			...i,
			scale: w,
			...o && { [C ? "backgroundColor" : "borderColor"]: o }
		},
		children: a
	});
}
(0, l.memo)(ph);
//#endregion
//#region src/automation/NodeInspector.tsx
var mh = {
	trigger: {
		label: "Trigger",
		icon: "bolt",
		className: "kind-trigger"
	},
	condition: {
		label: "Condition",
		icon: "sliders",
		className: "kind-condition"
	},
	action: {
		label: "Action",
		icon: "play",
		className: "kind-action"
	},
	delay: {
		label: "Delay",
		icon: "clock",
		className: "kind-delay"
	}
};
function hh({ label: e, value: t, entities: n, domains: r, allowEmpty: a = !1, onChange: o }) {
	let s = (0, l.useMemo)(() => {
		let e = Object.values(n).filter((e) => !r || r.includes(e.entity_id.split(".")[0])).map((e) => e.entity_id).sort((e, t) => i(n[e], e).localeCompare(i(n[t], t)));
		return t && !e.includes(t) && e.unshift(t), e;
	}, [
		r,
		n,
		t
	]);
	return /* @__PURE__ */ (0, K.jsxs)("label", {
		className: "field",
		children: [/* @__PURE__ */ (0, K.jsx)("span", {
			className: "field-label",
			children: e
		}), /* @__PURE__ */ (0, K.jsxs)("select", {
			className: "text-input",
			value: t ?? "",
			onChange: (e) => o(e.target.value),
			children: [/* @__PURE__ */ (0, K.jsx)("option", {
				value: "",
				children: a ? "Any entity (optional)" : "Choose an entity…"
			}), s.map((e) => /* @__PURE__ */ (0, K.jsxs)("option", {
				value: e,
				children: [
					i(n[e], e),
					" · ",
					e
				]
			}, e))]
		})]
	});
}
function gh({ node: e, entities: t, onChange: n, onDuplicate: r, onDelete: i, onClose: a }) {
	let o = mh[e.kind], c = e.config, l = (t) => {
		n({
			...e,
			config: {
				...c,
				...t
			}
		});
	};
	return /* @__PURE__ */ (0, K.jsxs)("aside", {
		className: "inspector",
		"aria-label": "Node settings",
		children: [
			/* @__PURE__ */ (0, K.jsxs)("div", {
				className: "inspector-head",
				children: [/* @__PURE__ */ (0, K.jsxs)("div", {
					className: "inspector-title",
					children: [/* @__PURE__ */ (0, K.jsx)("span", {
						className: `inspector-icon ${o.className}`,
						children: /* @__PURE__ */ (0, K.jsx)(s, {
							name: o.icon,
							size: 18
						})
					}), /* @__PURE__ */ (0, K.jsxs)("div", { children: [/* @__PURE__ */ (0, K.jsx)("p", {
						className: "eyebrow",
						children: o.label
					}), /* @__PURE__ */ (0, K.jsx)("h3", { children: "Node settings" })] })]
				}), /* @__PURE__ */ (0, K.jsx)("button", {
					type: "button",
					className: "icon-button",
					onClick: a,
					"aria-label": "Close node settings",
					children: /* @__PURE__ */ (0, K.jsx)(s, {
						name: "x",
						size: 18
					})
				})]
			}),
			/* @__PURE__ */ (0, K.jsx)("p", {
				className: "inspector-summary",
				children: e.label || dn(e)
			}),
			/* @__PURE__ */ (0, K.jsxs)("div", {
				className: "inspector-body",
				children: [
					/* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Node label"
						}), /* @__PURE__ */ (0, K.jsx)("input", {
							className: "text-input",
							value: e.label,
							maxLength: 80,
							placeholder: dn(e),
							onChange: (t) => n({
								...e,
								label: t.target.value
							})
						})]
					}),
					e.kind === "trigger" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [
						/* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "Trigger type"
							}), /* @__PURE__ */ (0, K.jsxs)("select", {
								className: "text-input",
								value: c.triggerType ?? "state",
								onChange: (e) => l({ triggerType: e.target.value }),
								children: [
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "state",
										children: "State change"
									}),
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "time",
										children: "Time of day"
									}),
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "sun",
										children: "Sun event"
									})
								]
							})]
						}),
						(c.triggerType ?? "state") === "state" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsx)(hh, {
							label: "Entity",
							value: c.entityId,
							entities: t,
							onChange: (e) => l({ entityId: e })
						}), /* @__PURE__ */ (0, K.jsxs)("div", {
							className: "field-row",
							children: [/* @__PURE__ */ (0, K.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, K.jsx)("span", {
									className: "field-label",
									children: "From (optional)"
								}), /* @__PURE__ */ (0, K.jsx)("input", {
									className: "text-input",
									value: c.from ?? "",
									placeholder: "off",
									onChange: (e) => l({ from: e.target.value })
								})]
							}), /* @__PURE__ */ (0, K.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, K.jsx)("span", {
									className: "field-label",
									children: "To (optional)"
								}), /* @__PURE__ */ (0, K.jsx)("input", {
									className: "text-input",
									value: c.to ?? "",
									placeholder: "on",
									onChange: (e) => l({ to: e.target.value })
								})]
							})]
						})] }) : null,
						c.triggerType === "time" ? /* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "Time"
							}), /* @__PURE__ */ (0, K.jsx)("input", {
								className: "text-input",
								value: c.at ?? "",
								placeholder: "07:00:00",
								onChange: (e) => l({ at: e.target.value })
							})]
						}) : null,
						c.triggerType === "sun" ? /* @__PURE__ */ (0, K.jsxs)("div", {
							className: "field-row",
							children: [/* @__PURE__ */ (0, K.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, K.jsx)("span", {
									className: "field-label",
									children: "Sun event"
								}), /* @__PURE__ */ (0, K.jsxs)("select", {
									className: "text-input",
									value: c.sunEvent ?? "sunrise",
									onChange: (e) => l({ sunEvent: e.target.value }),
									children: [/* @__PURE__ */ (0, K.jsx)("option", {
										value: "sunrise",
										children: "Sunrise"
									}), /* @__PURE__ */ (0, K.jsx)("option", {
										value: "sunset",
										children: "Sunset"
									})]
								})]
							}), /* @__PURE__ */ (0, K.jsxs)("label", {
								className: "field",
								children: [/* @__PURE__ */ (0, K.jsx)("span", {
									className: "field-label",
									children: "Offset"
								}), /* @__PURE__ */ (0, K.jsx)("input", {
									className: "text-input",
									value: c.offset ?? "",
									placeholder: "-00:30:00",
									onChange: (e) => l({ offset: e.target.value })
								})]
							})]
						}) : null
					] }) : null,
					e.kind === "condition" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Condition type"
						}), /* @__PURE__ */ (0, K.jsxs)("select", {
							className: "text-input",
							value: c.conditionType ?? "state",
							onChange: (e) => l({ conditionType: e.target.value }),
							children: [/* @__PURE__ */ (0, K.jsx)("option", {
								value: "state",
								children: "Entity state"
							}), /* @__PURE__ */ (0, K.jsx)("option", {
								value: "time",
								children: "Time window"
							})]
						})]
					}), (c.conditionType ?? "state") === "state" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsx)(hh, {
						label: "Entity",
						value: c.entityId,
						entities: t,
						onChange: (e) => l({ entityId: e })
					}), /* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "State"
						}), /* @__PURE__ */ (0, K.jsx)("input", {
							className: "text-input",
							value: c.state ?? "",
							placeholder: "below_horizon",
							onChange: (e) => l({ state: e.target.value })
						})]
					})] }) : /* @__PURE__ */ (0, K.jsxs)("div", {
						className: "field-row",
						children: [/* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "After"
							}), /* @__PURE__ */ (0, K.jsx)("input", {
								className: "text-input",
								value: c.after ?? "",
								placeholder: "22:00:00",
								onChange: (e) => l({ after: e.target.value })
							})]
						}), /* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "Before"
							}), /* @__PURE__ */ (0, K.jsx)("input", {
								className: "text-input",
								value: c.before ?? "",
								placeholder: "06:00:00",
								onChange: (e) => l({ before: e.target.value })
							})]
						})]
					})] }) : null,
					e.kind === "action" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Action type"
						}), /* @__PURE__ */ (0, K.jsxs)("select", {
							className: "text-input",
							value: c.actionType ?? "service",
							onChange: (e) => {
								let t = e.target.value;
								l(t === "scene" ? {
									actionType: t,
									service: "scene.turn_on",
									entityId: c.entityId || "scene.movie_night"
								} : t === "notify" ? {
									actionType: t,
									service: c.service || "notify.notify"
								} : {
									actionType: t,
									service: c.service === "notify.notify" ? "light.turn_on" : c.service
								});
							},
							children: [
								/* @__PURE__ */ (0, K.jsx)("option", {
									value: "service",
									children: "Call service"
								}),
								/* @__PURE__ */ (0, K.jsx)("option", {
									value: "scene",
									children: "Run scene"
								}),
								/* @__PURE__ */ (0, K.jsx)("option", {
									value: "notify",
									children: "Send notification"
								})
							]
						})]
					}), c.actionType === "notify" ? /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Notify service"
						}), /* @__PURE__ */ (0, K.jsx)("input", {
							className: "text-input",
							value: c.service ?? "notify.notify",
							placeholder: "notify.notify",
							onChange: (e) => l({ service: e.target.value })
						})]
					}), /* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Message"
						}), /* @__PURE__ */ (0, K.jsx)("textarea", {
							className: "text-input",
							rows: 3,
							value: c.message ?? "",
							onChange: (e) => l({ message: e.target.value })
						})]
					})] }) : /* @__PURE__ */ (0, K.jsx)(K.Fragment, { children: c.actionType === "scene" ? /* @__PURE__ */ (0, K.jsx)(hh, {
						label: "Scene or script",
						value: c.entityId,
						entities: t,
						domains: ["scene", "script"],
						onChange: (e) => l({ entityId: e })
					}) : /* @__PURE__ */ (0, K.jsxs)(K.Fragment, { children: [/* @__PURE__ */ (0, K.jsxs)("label", {
						className: "field",
						children: [/* @__PURE__ */ (0, K.jsx)("span", {
							className: "field-label",
							children: "Service"
						}), /* @__PURE__ */ (0, K.jsx)("input", {
							className: "text-input",
							value: c.service ?? "",
							placeholder: "light.turn_on",
							onChange: (e) => l({ service: e.target.value })
						})]
					}), /* @__PURE__ */ (0, K.jsx)(hh, {
						label: "Target entity",
						value: c.entityId,
						entities: t,
						allowEmpty: !0,
						onChange: (e) => l({ entityId: e })
					})] }) })] }) : null,
					e.kind === "delay" ? /* @__PURE__ */ (0, K.jsxs)("div", {
						className: "field-row",
						children: [/* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "Duration"
							}), /* @__PURE__ */ (0, K.jsx)("input", {
								className: "text-input",
								type: "number",
								min: 1,
								value: c.duration ?? 1,
								onChange: (e) => l({ duration: Math.max(0, Number(e.target.value)) })
							})]
						}), /* @__PURE__ */ (0, K.jsxs)("label", {
							className: "field",
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "field-label",
								children: "Unit"
							}), /* @__PURE__ */ (0, K.jsxs)("select", {
								className: "text-input",
								value: c.unit ?? "minutes",
								onChange: (e) => l({ unit: e.target.value }),
								children: [
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "seconds",
										children: "Seconds"
									}),
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "minutes",
										children: "Minutes"
									}),
									/* @__PURE__ */ (0, K.jsx)("option", {
										value: "hours",
										children: "Hours"
									})
								]
							})]
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, K.jsxs)("div", {
				className: "inspector-footer",
				children: [/* @__PURE__ */ (0, K.jsxs)("button", {
					type: "button",
					className: "button ghost",
					onClick: r,
					children: [/* @__PURE__ */ (0, K.jsx)(s, {
						name: "copy",
						size: 16
					}), "Duplicate"]
				}), /* @__PURE__ */ (0, K.jsxs)("button", {
					type: "button",
					className: "button ghost danger-text",
					onClick: i,
					children: [/* @__PURE__ */ (0, K.jsx)(s, {
						name: "trash",
						size: 16
					}), "Delete node"]
				})]
			})
		]
	});
}
//#endregion
//#region src/automation/AutomationCanvas.tsx
var _h = {
	trigger: {
		label: "Trigger",
		icon: "bolt",
		className: "kind-trigger"
	},
	condition: {
		label: "Condition",
		icon: "sliders",
		className: "kind-condition"
	},
	action: {
		label: "Action",
		icon: "play",
		className: "kind-action"
	},
	delay: {
		label: "Delay",
		icon: "clock",
		className: "kind-delay"
	}
}, vh = [
	{
		id: "trigger-state",
		kind: "trigger",
		variant: { triggerType: "state" },
		label: "State change",
		hint: "Entity changes",
		icon: "bolt",
		category: "Triggers"
	},
	{
		id: "trigger-time",
		kind: "trigger",
		variant: { triggerType: "time" },
		label: "Time of day",
		hint: "At a set time",
		icon: "clock",
		category: "Triggers"
	},
	{
		id: "trigger-sun",
		kind: "trigger",
		variant: { triggerType: "sun" },
		label: "Sun event",
		hint: "Sunrise or sunset",
		icon: "sun",
		category: "Triggers"
	},
	{
		id: "condition-state",
		kind: "condition",
		variant: { conditionType: "state" },
		label: "Entity state",
		hint: "Only when…",
		icon: "sliders",
		category: "Conditions"
	},
	{
		id: "condition-time",
		kind: "condition",
		variant: { conditionType: "time" },
		label: "Time window",
		hint: "Between hours",
		icon: "clock",
		category: "Conditions"
	},
	{
		id: "action-service",
		kind: "action",
		variant: { actionType: "service" },
		label: "Call service",
		hint: "Control a device",
		icon: "play",
		category: "Actions"
	},
	{
		id: "action-scene",
		kind: "action",
		variant: { actionType: "scene" },
		label: "Run scene",
		hint: "Scene or script",
		icon: "film",
		category: "Actions"
	},
	{
		id: "action-notify",
		kind: "action",
		variant: { actionType: "notify" },
		label: "Notify",
		hint: "Send a message",
		icon: "alert",
		category: "Actions"
	},
	{
		id: "action-delay",
		kind: "delay",
		variant: {},
		label: "Delay",
		hint: "Wait a while",
		icon: "clock",
		category: "Actions"
	}
], yh = { automation: bh };
function bh({ data: e, selected: t }) {
	let n = e.node, r = _h[n.kind];
	return /* @__PURE__ */ (0, K.jsxs)("div", {
		className: `flow-node ${r.className} ${t ? "is-selected" : ""}`,
		children: [
			/* @__PURE__ */ (0, K.jsx)(Xf, {
				type: "target",
				position: X.Left,
				className: "flow-handle"
			}),
			/* @__PURE__ */ (0, K.jsxs)("div", {
				className: "flow-node-head",
				children: [/* @__PURE__ */ (0, K.jsx)("span", {
					className: "flow-node-icon",
					children: /* @__PURE__ */ (0, K.jsx)(s, {
						name: r.icon,
						size: 15
					})
				}), /* @__PURE__ */ (0, K.jsx)("span", {
					className: "flow-node-kind",
					children: r.label
				})]
			}),
			/* @__PURE__ */ (0, K.jsx)("strong", { children: n.label || dn(n) }),
			n.label ? /* @__PURE__ */ (0, K.jsx)("p", { children: dn(n) }) : null,
			/* @__PURE__ */ (0, K.jsx)(Xf, {
				type: "source",
				position: X.Right,
				className: "flow-handle"
			})
		]
	});
}
function xh(e) {
	return {
		id: e.id,
		type: "automation",
		position: {
			x: e.x,
			y: e.y
		},
		data: { node: e }
	};
}
function Sh(e) {
	return {
		id: e.id,
		source: e.source,
		target: e.target,
		type: "smoothstep",
		animated: !0,
		style: {
			stroke: "var(--accent)",
			strokeWidth: 2
		}
	};
}
function Ch(e) {
	return {
		...e.data.node,
		x: e.position.x,
		y: e.position.y
	};
}
function wh(e) {
	return {
		id: e.id,
		source: e.source,
		target: e.target
	};
}
function Th({ automation: e, entities: t, colorMode: n, onChange: r }) {
	let [i, o, c] = Am(e.nodes.map(xh)), [u, d, f] = jm(e.edges.map(Sh)), [p, m] = (0, l.useState)(null), [h, g] = (0, l.useState)(null), _ = (0, l.useRef)(null), v = (0, l.useRef)(i), y = (0, l.useRef)(u);
	v.current = i, y.current = u;
	let { screenToFlowPosition: b } = Cf(), x = (0, l.useCallback)((e, t) => {
		r({
			nodes: e.map(Ch),
			edges: t.map(wh)
		});
	}, [r]), S = (0, l.useCallback)((e, t) => {
		let n = cn(e.kind, t, e.variant), r = [...v.current.map((e) => ({
			...e,
			selected: !1
		})), {
			...xh(n),
			selected: !0
		}];
		o(r), x(r, y.current), m(n.id);
	}, [x, o]), C = (0, l.useCallback)((e) => {
		let t = _.current?.getBoundingClientRect(), n = t ? {
			x: t.left + t.width / 2,
			y: t.top + t.height / 2
		} : {
			x: 480,
			y: 320
		}, r = b(n), i = v.current.length % 4 * 26;
		S(e, {
			x: r.x - 100 + i,
			y: r.y - 40 + i
		});
	}, [S, b]), w = (e) => {
		e.preventDefault();
		let t = e.dataTransfer?.getData("application/dash-automation-node"), n = vh.find((e) => e.id === t);
		if (!n) return;
		let r = b({
			x: e.clientX,
			y: e.clientY
		});
		S(n, {
			x: r.x - 90,
			y: r.y - 30
		});
	}, T = (0, l.useCallback)((e) => {
		let t = v.current.map((t) => t.id === e.id ? {
			...t,
			position: {
				x: e.x,
				y: e.y
			},
			data: { node: e }
		} : t);
		o(t), x(t, y.current);
	}, [x, o]), E = (0, l.useCallback)((e) => {
		let t = v.current.filter((t) => t.id !== e), n = y.current.filter((t) => t.source !== e && t.target !== e);
		o(t), d(n), x(t, n), m(null);
	}, [
		x,
		d,
		o
	]), D = (0, l.useCallback)((e) => {
		let t = {
			...e,
			id: a("node"),
			label: e.label ? `${e.label} copy` : "",
			x: e.x + 40,
			y: e.y + 40,
			config: { ...e.config }
		}, n = [...v.current.map((e) => ({
			...e,
			selected: !1
		})), {
			...xh(t),
			selected: !0
		}];
		o(n), x(n, y.current), m(t.id);
	}, [x, o]), O = (0, l.useCallback)((e) => {
		if (!e.source || !e.target) return;
		let t = mn(v.current.map(Ch), y.current.map(wh), e.source, e.target);
		if (t.error) {
			g(t.error);
			return;
		}
		let n = t.edges.map(Sh);
		d(n), x(v.current, n), g(null);
	}, [x, d]), k = (0, l.useCallback)((e, t) => {
		let n = v.current.map((e) => e.id === t.id ? {
			...e,
			position: t.position,
			data: { node: {
				...e.data.node,
				x: t.position.x,
				y: t.position.y
			} }
		} : e);
		o(n), x(n, y.current);
	}, [x, o]), A = (0, l.useCallback)((e) => {
		let t = new Set(e.map((e) => e.id)), n = v.current.filter((e) => !t.has(e.id)), r = y.current.filter((e) => !t.has(e.source) && !t.has(e.target));
		o(n), d(r), x(n, r), m((e) => e && t.has(e) ? null : e);
	}, [
		x,
		d,
		o
	]), j = (0, l.useCallback)((e) => {
		let t = new Set(e.map((e) => e.id)), n = y.current.filter((e) => !t.has(e.id));
		d(n), x(v.current, n);
	}, [x, d]), M = (0, l.useMemo)(() => i.find((e) => e.id === p)?.data.node ?? null, [i, p]), N = (0, l.useMemo)(() => [
		"Triggers",
		"Conditions",
		"Actions"
	].map((e) => ({
		category: e,
		items: vh.filter((t) => t.category === e)
	})), []);
	return /* @__PURE__ */ (0, K.jsxs)("div", {
		className: "automation-workspace",
		children: [
			/* @__PURE__ */ (0, K.jsxs)("aside", {
				className: "node-palette",
				"aria-label": "Node palette",
				children: [
					/* @__PURE__ */ (0, K.jsxs)("div", {
						className: "node-palette-head",
						children: [/* @__PURE__ */ (0, K.jsx)(s, {
							name: "plus",
							size: 16
						}), /* @__PURE__ */ (0, K.jsx)("span", { children: "Add nodes" })]
					}),
					/* @__PURE__ */ (0, K.jsx)("p", {
						className: "node-palette-hint",
						children: "Drag onto the canvas, or click to add."
					}),
					N.map((e) => /* @__PURE__ */ (0, K.jsxs)("div", {
						className: "palette-group",
						children: [/* @__PURE__ */ (0, K.jsx)("h4", { children: e.category }), e.items.map((e) => /* @__PURE__ */ (0, K.jsxs)("button", {
							type: "button",
							className: "palette-item",
							draggable: !0,
							onDragStart: (t) => {
								t.dataTransfer?.setData("application/dash-automation-node", e.id), t.dataTransfer && (t.dataTransfer.effectAllowed = "copy");
							},
							onClick: () => C(e),
							children: [/* @__PURE__ */ (0, K.jsx)("span", {
								className: "palette-icon",
								children: /* @__PURE__ */ (0, K.jsx)(s, {
									name: e.icon,
									size: 15
								})
							}), /* @__PURE__ */ (0, K.jsxs)("span", {
								className: "palette-text",
								children: [/* @__PURE__ */ (0, K.jsx)("strong", { children: e.label }), /* @__PURE__ */ (0, K.jsx)("small", { children: e.hint })]
							})]
						}, e.id))]
					}, e.category))
				]
			}),
			/* @__PURE__ */ (0, K.jsxs)("div", {
				className: "flow-stage",
				ref: _,
				onDrop: w,
				onDragOver: (e) => {
					e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy");
				},
				children: [/* @__PURE__ */ (0, K.jsxs)(km, {
					nodes: i,
					edges: u,
					nodeTypes: yh,
					onNodesChange: c,
					onEdgesChange: f,
					onConnect: O,
					onNodeDragStop: k,
					onNodesDelete: A,
					onEdgesDelete: j,
					onSelectionChange: ({ nodes: e }) => m(e[0]?.id ?? null),
					colorMode: n,
					fitView: !0,
					fitViewOptions: { padding: .24 },
					minZoom: .3,
					maxZoom: 1.8,
					snapToGrid: !0,
					snapGrid: [20, 20],
					deleteKeyCode: ["Backspace", "Delete"],
					proOptions: { hideAttribution: !0 },
					children: [
						/* @__PURE__ */ (0, K.jsx)(Rm, {
							variant: Pm.Dots,
							gap: 22,
							size: 1.3,
							color: "var(--grid-line)"
						}),
						/* @__PURE__ */ (0, K.jsx)(qm, { showInteractive: !1 }),
						/* @__PURE__ */ (0, K.jsx)(uh, {
							pannable: !0,
							zoomable: !0,
							nodeColor: "var(--accent)",
							maskColor: "var(--flow-mask)",
							className: "flow-minimap"
						})
					]
				}), h ? /* @__PURE__ */ (0, K.jsxs)("div", {
					className: "canvas-toast",
					role: "alert",
					children: [
						/* @__PURE__ */ (0, K.jsx)(s, {
							name: "alert",
							size: 16
						}),
						/* @__PURE__ */ (0, K.jsx)("span", { children: h }),
						/* @__PURE__ */ (0, K.jsx)("button", {
							type: "button",
							className: "tool-button",
							onClick: () => g(null),
							"aria-label": "Dismiss message",
							children: /* @__PURE__ */ (0, K.jsx)(s, {
								name: "x",
								size: 15
							})
						})
					]
				}) : null]
			}),
			M ? /* @__PURE__ */ (0, K.jsx)(gh, {
				node: M,
				entities: t,
				onChange: T,
				onDuplicate: () => D(M),
				onDelete: () => E(M.id),
				onClose: () => {
					m(null), o((e) => e.map((e) => ({
						...e,
						selected: !1
					})));
				}
			}) : /* @__PURE__ */ (0, K.jsxs)("aside", {
				className: "inspector inspector-empty",
				children: [
					/* @__PURE__ */ (0, K.jsx)("span", {
						className: "inspector-empty-icon",
						children: /* @__PURE__ */ (0, K.jsx)(s, {
							name: "sliders",
							size: 22
						})
					}),
					/* @__PURE__ */ (0, K.jsx)("h3", { children: "Select a node" }),
					/* @__PURE__ */ (0, K.jsx)("p", { children: "Click any node to edit it. Drag from the right handle to the left handle of another node to connect them." }),
					/* @__PURE__ */ (0, K.jsxs)("ul", { children: [
						/* @__PURE__ */ (0, K.jsx)("li", { children: "Drop palette items anywhere on the canvas." }),
						/* @__PURE__ */ (0, K.jsx)("li", { children: "Press Delete to remove a selected node or connection." }),
						/* @__PURE__ */ (0, K.jsx)("li", { children: "Drag nodes to rearrange the automation." })
					] })
				]
			})
		]
	});
}
function Eh(e) {
	return /* @__PURE__ */ (0, K.jsx)(Tm, { children: /* @__PURE__ */ (0, K.jsx)(Th, { ...e }) });
}
//#endregion
//#region src/automation/AutomationView.tsx
var Dh = [
	{
		value: "single",
		label: "Single"
	},
	{
		value: "restart",
		label: "Restart"
	},
	{
		value: "queued",
		label: "Queued"
	},
	{
		value: "parallel",
		label: "Parallel"
	}
];
function Oh(e) {
	return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "automation";
}
function kh(e, t) {
	let n = new Blob([t], { type: "text/yaml;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = e, i.click(), URL.revokeObjectURL(r);
}
function Ah({ entities: e, colorMode: t, hass: n }) {
	let [r, i] = (0, l.useState)(() => Vn()), [a, o] = (0, l.useState)(null), [c, u] = (0, l.useState)(!1), d = (0, l.useMemo)(() => r.automations.find((e) => e.id === r.activeId) ?? r.automations[0], [r]);
	(0, l.useEffect)(() => {
		Hn(r);
	}, [r]);
	let f = (0, l.useCallback)((e) => {
		i((t) => ({
			...t,
			automations: t.automations.map((t) => t.id === d.id ? {
				...t,
				...e,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : t)
		}));
	}, [d.id]), p = (e) => {
		i((t) => ({
			...t,
			activeId: e
		})), o(null);
	}, m = () => {
		let e = Sn(`Automation ${r.automations.length + 1}`);
		i((t) => ({
			...t,
			automations: [...t.automations, e],
			activeId: e.id
		})), o(null);
	}, h = () => {
		let e = wn(d);
		i((t) => ({
			...t,
			automations: [...t.automations, e],
			activeId: e.id
		})), o({
			tone: "ok",
			message: "Automation duplicated."
		});
	}, g = (e) => {
		i((t) => {
			let n = t.automations.filter((t) => t.id !== e);
			if (n.length === 0) {
				let e = Sn();
				return {
					version: 1,
					automations: [e],
					activeId: e.id
				};
			}
			return {
				...t,
				automations: n,
				activeId: t.activeId === e ? n[0].id : t.activeId
			};
		}), o(null);
	}, _ = hn(d);
	return /* @__PURE__ */ (0, K.jsxs)("div", {
		className: "automation-page",
		children: [/* @__PURE__ */ (0, K.jsxs)("aside", {
			className: "automation-sidebar",
			"aria-label": "Automations",
			children: [
				/* @__PURE__ */ (0, K.jsxs)("div", {
					className: "automation-sidebar-head",
					children: [/* @__PURE__ */ (0, K.jsxs)("div", { children: [/* @__PURE__ */ (0, K.jsx)("p", {
						className: "eyebrow",
						children: "Build"
					}), /* @__PURE__ */ (0, K.jsx)("h2", { children: "Automations" })] }), /* @__PURE__ */ (0, K.jsx)("button", {
						type: "button",
						className: "icon-button",
						onClick: m,
						"aria-label": "New automation",
						title: "New automation",
						children: /* @__PURE__ */ (0, K.jsx)(s, {
							name: "plus",
							size: 18
						})
					})]
				}),
				/* @__PURE__ */ (0, K.jsx)("div", {
					className: "automation-list",
					children: r.automations.map((e) => {
						let t = e.id === d.id;
						return /* @__PURE__ */ (0, K.jsxs)("div", {
							className: `automation-list-item ${t ? "is-active" : ""}`,
							children: [/* @__PURE__ */ (0, K.jsxs)("button", {
								type: "button",
								className: "automation-list-main",
								onClick: () => p(e.id),
								"aria-current": t ? "true" : void 0,
								children: [/* @__PURE__ */ (0, K.jsx)("span", {
									className: "automation-list-name",
									children: e.name
								}), /* @__PURE__ */ (0, K.jsxs)("span", {
									className: "automation-list-meta",
									children: [
										e.nodes.length,
										" nodes · ",
										e.mode
									]
								})]
							}), /* @__PURE__ */ (0, K.jsx)("button", {
								type: "button",
								className: "tool-button danger",
								onClick: () => g(e.id),
								"aria-label": `Delete ${e.name}`,
								title: "Delete automation",
								children: /* @__PURE__ */ (0, K.jsx)(s, {
									name: "trash",
									size: 15
								})
							})]
						}, e.id);
					})
				}),
				/* @__PURE__ */ (0, K.jsxs)("div", {
					className: "automation-sidebar-footer",
					children: [/* @__PURE__ */ (0, K.jsxs)("button", {
						type: "button",
						className: "button ghost",
						onClick: m,
						children: [/* @__PURE__ */ (0, K.jsx)(s, {
							name: "plus",
							size: 16
						}), "New automation"]
					}), /* @__PURE__ */ (0, K.jsx)("p", {
						className: "hint",
						children: "Graphs are saved in this browser. Export the YAML to add an automation to Home Assistant."
					})]
				})
			]
		}), /* @__PURE__ */ (0, K.jsxs)("div", {
			className: "automation-main",
			children: [
				/* @__PURE__ */ (0, K.jsxs)("div", {
					className: "automation-top",
					children: [/* @__PURE__ */ (0, K.jsxs)("div", {
						className: "automation-head-row",
						children: [/* @__PURE__ */ (0, K.jsxs)("div", {
							className: "automation-title-block",
							children: [/* @__PURE__ */ (0, K.jsx)("p", {
								className: "eyebrow",
								children: "Automation graph"
							}), /* @__PURE__ */ (0, K.jsx)("input", {
								className: "automation-name-input",
								value: d.name,
								maxLength: 80,
								"aria-label": "Automation name",
								onChange: (e) => f({ name: e.target.value })
							})]
						}), /* @__PURE__ */ (0, K.jsxs)("div", {
							className: "automation-toolbar",
							children: [
								/* @__PURE__ */ (0, K.jsxs)("span", {
									className: `validation-badge ${_.length === 0 ? "is-valid" : "is-invalid"}`,
									title: _.join(" "),
									children: [/* @__PURE__ */ (0, K.jsx)(s, {
										name: _.length === 0 ? "check" : "alert",
										size: 14
									}), _.length === 0 ? "Ready to export" : `${_.length} to fix`]
								}),
								/* @__PURE__ */ (0, K.jsxs)("label", {
									className: "automation-mode",
									children: [/* @__PURE__ */ (0, K.jsx)("span", { children: "Mode" }), /* @__PURE__ */ (0, K.jsx)("select", {
										className: "text-input",
										value: d.mode,
										"aria-label": "Automation mode",
										onChange: (e) => f({ mode: e.target.value }),
										children: Dh.map((e) => /* @__PURE__ */ (0, K.jsx)("option", {
											value: e.value,
											children: e.label
										}, e.value))
									})]
								}),
								/* @__PURE__ */ (0, K.jsxs)("button", {
									type: "button",
									className: "button ghost",
									onClick: h,
									children: [/* @__PURE__ */ (0, K.jsx)(s, {
										name: "copy",
										size: 16
									}), "Duplicate"]
								}),
								/* @__PURE__ */ (0, K.jsxs)("button", {
									type: "button",
									className: "button ghost",
									onClick: async () => {
										try {
											let e = bn(d);
											if (!navigator.clipboard?.writeText) throw Error("Clipboard access is unavailable. Use Export YAML instead.");
											await navigator.clipboard.writeText(e), o({
												tone: "ok",
												message: "Automation YAML copied to the clipboard."
											});
										} catch (e) {
											o({
												tone: "error",
												message: e instanceof Error ? e.message : "Could not copy the YAML."
											});
										}
									},
									children: [/* @__PURE__ */ (0, K.jsx)(s, {
										name: "copy",
										size: 16
									}), "Copy YAML"]
								}),
								n?.callApi ? /* @__PURE__ */ (0, K.jsxs)("button", {
									type: "button",
									className: "button ghost",
									onClick: async () => {
										if (n?.callApi) {
											u(!0);
											try {
												let e = yn(d);
												await n.callApi("POST", `config/automation/config/${encodeURIComponent(d.id)}`, e), o({
													tone: "ok",
													message: "Saved to Home Assistant."
												});
											} catch (e) {
												o({
													tone: "error",
													message: e instanceof Error ? e.message : "Home Assistant could not save this automation."
												});
											} finally {
												u(!1);
											}
										}
									},
									disabled: c || _.length > 0,
									children: [/* @__PURE__ */ (0, K.jsx)(s, {
										name: "plug",
										size: 16
									}), c ? "Saving…" : "Save to HA"]
								}) : null,
								/* @__PURE__ */ (0, K.jsxs)("button", {
									type: "button",
									className: "button primary",
									onClick: () => {
										try {
											let e = bn(d);
											kh(`${Oh(d.name)}.yaml`, e), o({
												tone: "ok",
												message: "Automation YAML downloaded."
											});
										} catch (e) {
											o({
												tone: "error",
												message: e instanceof Error ? e.message : "Could not export this automation."
											});
										}
									},
									children: [/* @__PURE__ */ (0, K.jsx)(s, {
										name: "download",
										size: 16
									}), "Export YAML"]
								})
							]
						})]
					}), /* @__PURE__ */ (0, K.jsx)("textarea", {
						className: "automation-description-input",
						value: d.description,
						maxLength: 300,
						rows: 2,
						placeholder: "Describe what this automation does…",
						"aria-label": "Automation description",
						onChange: (e) => f({ description: e.target.value })
					})]
				}),
				a ? /* @__PURE__ */ (0, K.jsxs)("div", {
					className: `automation-notice tone-${a.tone}`,
					role: "alert",
					children: [
						/* @__PURE__ */ (0, K.jsx)(s, {
							name: a.tone === "ok" ? "check" : "alert",
							size: 16
						}),
						/* @__PURE__ */ (0, K.jsx)("span", { children: a.message }),
						/* @__PURE__ */ (0, K.jsx)("button", {
							type: "button",
							className: "tool-button",
							onClick: () => o(null),
							"aria-label": "Dismiss notice",
							children: /* @__PURE__ */ (0, K.jsx)(s, {
								name: "x",
								size: 15
							})
						})
					]
				}) : null,
				_.length > 0 ? /* @__PURE__ */ (0, K.jsxs)("div", {
					className: "automation-warning",
					role: "status",
					children: [
						/* @__PURE__ */ (0, K.jsx)(s, {
							name: "alert",
							size: 16
						}),
						/* @__PURE__ */ (0, K.jsx)("span", { children: _[0] }),
						_.length > 1 ? /* @__PURE__ */ (0, K.jsxs)("span", { children: [
							"+",
							_.length - 1,
							" more"
						] }) : null
					]
				}) : null,
				/* @__PURE__ */ (0, K.jsx)(Eh, {
					automation: d,
					entities: e,
					colorMode: t,
					onChange: (e) => f(e)
				}, d.id),
				/* @__PURE__ */ (0, K.jsxs)("footer", {
					className: "automation-footer",
					children: [/* @__PURE__ */ (0, K.jsxs)("span", { children: [
						d.nodes.length,
						" nodes · ",
						d.edges.length,
						" connections"
					] }), /* @__PURE__ */ (0, K.jsx)("span", { children: "Home Assistant automation YAML · saved locally" })]
				})
			]
		})]
	});
}
//#endregion
export { Ah as AutomationView };
