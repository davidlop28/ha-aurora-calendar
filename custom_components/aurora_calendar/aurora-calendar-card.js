/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$2=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$1=t=>t,s$1=t$2.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const CONFIG_DEFAULTS = {
    week_start: "sunday",
    height_mode: "auto",
    fixed_height: "640px",
    dim_past_events: true,
    show_event_time: true,
    time_format: "12h",
    visible_start_hour: 6,
    visible_end_hour: 22,
    event_font_size: 14,
    event_font_family: "inherit",
    show_calendar_grid_lines: true,
    keep_all_day_events_visible: false,
    glass_background: false,
    card_opacity: 100,
    background_media: null,
    background_image: "",
    background_image_opacity: 35,
    background_blur: 0,
    show_weather: true,
    weather_icon_style: "static",
};

const TRANSLATIONS = {
    en: {
        allDay: "all-day",
        animated: "Animated",
        appearance: "Appearance",
        backgroundBlur: "Background blur",
        backgroundImage: "Background image URL",
        backgroundImageHelper: "Optional. Example: /local/family-background.jpg",
        backgroundImageOpacity: "Background image opacity",
        backgroundMedia: "Background image",
        backgroundMediaHelper: "Choose an image from Home Assistant media. Manual URL below remains available as a fallback.",
        background: "Background",
        calendarFilters: "Calendar filters",
        calendarGridLines: "Calendar grid lines",
        calendarGridLinesDesc: "Show dividers in Month, Week, and Biweek views.",
        calendarNavigation: "Calendar navigation",
        calendarView: "Calendar view",
        close: "Close",
        cleanDashboard: "Clean dashboard",
        date: "Date",
        default: "Default",
        description: "Description",
        dimPastEvents: "Dim past events",
        dimPastEventsDesc: "Reduces opacity once an event has ended.",
        eventFont: "Event font",
        eventFontSize: "Event font size",
        eventDisplay: "Event display",
        extraLarge: "Extra large",
        features: "Features",
        filters: "Filters",
        friendlyRounded: "Friendly rounded",
        general: "General",
        fixedHeight: "Fixed calendar height",
        fixedHeightHelper: "Use any CSS height, for example 640px, 70vh, or 42rem.",
        heightAuto: "Auto fit screen",
        heightFixed: "Fixed height",
        heightHomeAssistant: "Home Assistant layout",
        heightMode: "Height mode",
        heightNatural: "Natural height",
        hi: "HI",
        integration: "Integration",
        integrationHelper: "Domain of your Aurora Calendar integration (usually aurora_calendar)",
        jumpTo: "Jump To",
        keepAllDayEventsVisible: "Keep all-day events visible",
        keepAllDayEventsVisibleDesc: "Always keep all-day events pinned at the top instead of hiding them when active events reach them.",
        large: "Large",
        loading: "Loading...",
        lo: "LO",
        medium: "Medium",
        monday: "Monday",
        next: "Next",
        nextWeek: "Next Week",
        openWeatherForecast: "Open weather forecast",
        previous: "Previous",
        removeBackgroundImage: "Remove selected image",
        serif: "Serif",
        showCalendars: "Show calendars",
        showEventTimes: "Show event times",
        showEventTimesDesc: "Display start time on event chips.",
        scheduleWindow: "Schedule window",
        small: "Small",
        static: "Static",
        sunday: "Sunday",
        timeFormat: "Time format",
        time: "Time",
        today: "Today",
        twelveHour: "12 hour",
        twentyFourHour: "24 hour",
        unconfigured: "Open Settings -> Integrations -> Aurora Calendar -> Configure to add your calendars.",
        viewBiweek: "Biweek",
        viewMonth: "Month",
        viewNext7Days: "Next 7 Days",
        viewToday: "Today",
        viewWeek: "Week",
        calendar: "Calendar",
        addEvent: "Add event",
        allDayLabel: "All day",
        cardOpacity: "Card opacity",
        cancel: "Cancel",
        createEvent: "Create event",
        deleteEvent: "Delete event",
        deleteEventConfirm: "Delete this event?",
        deleteEventUnavailable: "This calendar event cannot be deleted from Aurora.",
        editEvent: "Edit event",
        end: "End",
        glassBackground: "Glass background",
        glassBackgroundDesc: "Adds a soft translucent surface so dashboard backgrounds or images can show through.",
        location: "Location",
        noWritableCalendars: "No configured calendars currently report event creation support.",
        save: "Save",
        start: "Start",
        title: "Title",
        updateEvent: "Update event",
        visibleEndHour: "Visible end hour",
        visibleEndHourHelper: "Exclusive end; 22:00 shows through 9:59 PM.",
        visibleStartHour: "Visible start hour",
        weatherForecast: "Weather forecast",
        weatherForecastDesc: "Show daily condition icon and temperature on each day cell.",
        weatherIconStyle: "Weather icon style",
        weekStartsOn: "Week starts on",
        visualBehavior: "Visual behavior",
    },
    es: {
        allDay: "todo el dia",
        animated: "Animado",
        appearance: "Apariencia",
        backgroundBlur: "Desenfoque del fondo",
        backgroundImage: "URL de imagen de fondo",
        backgroundImageHelper: "Opcional. Ejemplo: /local/family-background.jpg",
        backgroundImageOpacity: "Opacidad de imagen de fondo",
        backgroundMedia: "Imagen de fondo",
        backgroundMediaHelper: "Elige una imagen desde medios de Home Assistant. La URL manual queda disponible como respaldo.",
        background: "Fondo",
        calendarFilters: "Filtros del calendario",
        calendarGridLines: "Lineas del calendario",
        calendarGridLinesDesc: "Mostrar divisores en las vistas Mes, Semana y Quincena.",
        calendarNavigation: "Navegacion del calendario",
        calendarView: "Vista del calendario",
        cleanDashboard: "Panel limpio",
        default: "Predeterminado",
        dimPastEvents: "Atenuar eventos pasados",
        dimPastEventsDesc: "Reduce la opacidad cuando un evento ha terminado.",
        eventFont: "Fuente de eventos",
        eventFontSize: "Tamano de fuente de eventos",
        eventDisplay: "Visualizacion de eventos",
        extraLarge: "Extra grande",
        features: "Funciones",
        filters: "Filtros",
        friendlyRounded: "Redondeada amigable",
        general: "General",
        fixedHeight: "Altura fija del calendario",
        fixedHeightHelper: "Usa cualquier altura CSS, por ejemplo 640px, 70vh o 42rem.",
        heightAuto: "Ajustar a la pantalla",
        heightFixed: "Altura fija",
        heightHomeAssistant: "Diseno de Home Assistant",
        heightMode: "Modo de altura",
        heightNatural: "Altura natural",
        hi: "MAX",
        integration: "Integracion",
        integrationHelper: "Dominio de tu integracion Aurora Calendar (normalmente aurora_calendar)",
        jumpTo: "Ir a",
        keepAllDayEventsVisible: "Mantener visibles los eventos de todo el dia",
        keepAllDayEventsVisibleDesc: "Mantiene los eventos de todo el dia fijos arriba en vez de ocultarlos cuando llegan eventos activos.",
        large: "Grande",
        loading: "Cargando...",
        lo: "MIN",
        medium: "Mediano",
        monday: "Lunes",
        next: "Siguiente",
        nextWeek: "Proxima semana",
        openWeatherForecast: "Abrir pronostico del tiempo",
        previous: "Anterior",
        removeBackgroundImage: "Quitar imagen seleccionada",
        serif: "Serif",
        showCalendars: "Mostrar calendarios",
        showEventTimes: "Mostrar horas de eventos",
        showEventTimesDesc: "Muestra la hora de inicio en las tarjetas de eventos.",
        scheduleWindow: "Horario visible",
        small: "Pequeno",
        static: "Estatico",
        sunday: "Domingo",
        timeFormat: "Formato de hora",
        today: "Hoy",
        twelveHour: "12 horas",
        twentyFourHour: "24 horas",
        unconfigured: "Abre Ajustes -> Integraciones -> Aurora Calendar -> Configurar para agregar tus calendarios.",
        viewBiweek: "Quincena",
        viewMonth: "Mes",
        viewNext7Days: "Proximos 7 dias",
        viewToday: "Hoy",
        viewWeek: "Semana",
        cardOpacity: "Opacidad de la tarjeta",
        glassBackground: "Fondo tipo cristal",
        glassBackgroundDesc: "Agrega una superficie translucida para mostrar fondos o imagenes del panel.",
        visibleEndHour: "Hora final visible",
        visibleEndHourHelper: "Fin exclusivo; 22:00 muestra hasta las 9:59 PM.",
        visibleStartHour: "Hora inicial visible",
        weatherForecast: "Pronostico del tiempo",
        weatherForecastDesc: "Muestra condicion diaria y temperatura en cada dia.",
        weatherIconStyle: "Estilo de icono del tiempo",
        weekStartsOn: "La semana empieza el",
        visualBehavior: "Comportamiento visual",
    },
    de: {
        allDay: "ganztagig",
        animated: "Animiert",
        appearance: "Darstellung",
        calendarFilters: "Kalenderfilter",
        calendarGridLines: "Kalender-Rasterlinien",
        calendarGridLinesDesc: "Trennlinien in Monats-, Wochen- und Zweiwochenansicht anzeigen.",
        calendarNavigation: "Kalendernavigation",
        calendarView: "Kalenderansicht",
        cleanDashboard: "Klares Dashboard",
        default: "Standard",
        dimPastEvents: "Vergangene Ereignisse abdunkeln",
        dimPastEventsDesc: "Verringert die Deckkraft, sobald ein Ereignis beendet ist.",
        eventFont: "Ereignisschrift",
        eventFontSize: "Ereignis-Schriftgroesse",
        extraLarge: "Extra gross",
        features: "Funktionen",
        filters: "Filter",
        friendlyRounded: "Freundlich gerundet",
        general: "Allgemein",
        hi: "MAX",
        integration: "Integration",
        integrationHelper: "Domain deiner Aurora Calendar Integration (normalerweise aurora_calendar)",
        jumpTo: "Springen zu",
        large: "Gross",
        loading: "Wird geladen...",
        lo: "MIN",
        medium: "Mittel",
        monday: "Montag",
        next: "Weiter",
        nextWeek: "Naechste Woche",
        openWeatherForecast: "Wettervorhersage oeffnen",
        previous: "Zurueck",
        serif: "Serif",
        showCalendars: "Kalender anzeigen",
        showEventTimes: "Ereigniszeiten anzeigen",
        showEventTimesDesc: "Startzeit auf Ereignis-Chips anzeigen.",
        small: "Klein",
        static: "Statisch",
        sunday: "Sonntag",
        timeFormat: "Zeitformat",
        today: "Heute",
        twelveHour: "12 Stunden",
        twentyFourHour: "24 Stunden",
        unconfigured: "Oeffne Einstellungen -> Integrationen -> Aurora Calendar -> Konfigurieren, um deine Kalender hinzuzufuegen.",
        viewBiweek: "Zwei Wochen",
        viewMonth: "Monat",
        viewNext7Days: "Naechste 7 Tage",
        viewToday: "Heute",
        viewWeek: "Woche",
        visibleEndHour: "Sichtbare Endstunde",
        visibleEndHourHelper: "Exklusives Ende; 22:00 zeigt bis 21:59.",
        visibleStartHour: "Sichtbare Startstunde",
        weatherForecast: "Wettervorhersage",
        weatherForecastDesc: "Taegliches Wettersymbol und Temperatur in jeder Tageszelle anzeigen.",
        weatherIconStyle: "Wettericon-Stil",
        weekStartsOn: "Woche beginnt am",
    },
    fr: {
        allDay: "toute la journee",
        animated: "Anime",
        appearance: "Apparence",
        calendarFilters: "Filtres du calendrier",
        calendarGridLines: "Lignes de grille du calendrier",
        calendarGridLinesDesc: "Afficher les separateurs dans les vues Mois, Semaine et Deux semaines.",
        calendarNavigation: "Navigation du calendrier",
        calendarView: "Vue du calendrier",
        cleanDashboard: "Tableau de bord epure",
        default: "Par defaut",
        dimPastEvents: "Attenuer les evenements passes",
        dimPastEventsDesc: "Reduit l'opacite lorsqu'un evenement est termine.",
        eventFont: "Police des evenements",
        eventFontSize: "Taille de police des evenements",
        extraLarge: "Tres grand",
        features: "Fonctionnalites",
        filters: "Filtres",
        friendlyRounded: "Arrondie conviviale",
        general: "General",
        hi: "MAX",
        integration: "Integration",
        integrationHelper: "Domaine de votre integration Aurora Calendar (generalement aurora_calendar)",
        jumpTo: "Aller a",
        large: "Grand",
        loading: "Chargement...",
        lo: "MIN",
        medium: "Moyen",
        monday: "Lundi",
        next: "Suivant",
        nextWeek: "Semaine suivante",
        openWeatherForecast: "Ouvrir les previsions meteo",
        previous: "Precedent",
        serif: "Serif",
        showCalendars: "Afficher les calendriers",
        showEventTimes: "Afficher les heures des evenements",
        showEventTimesDesc: "Afficher l'heure de debut sur les cartes d'evenement.",
        small: "Petit",
        static: "Statique",
        sunday: "Dimanche",
        timeFormat: "Format de l'heure",
        today: "Aujourd'hui",
        twelveHour: "12 heures",
        twentyFourHour: "24 heures",
        unconfigured: "Ouvrez Parametres -> Integrations -> Aurora Calendar -> Configurer pour ajouter vos calendriers.",
        viewBiweek: "Deux semaines",
        viewMonth: "Mois",
        viewNext7Days: "7 prochains jours",
        viewToday: "Aujourd'hui",
        viewWeek: "Semaine",
        visibleEndHour: "Heure de fin visible",
        visibleEndHourHelper: "Fin exclusive; 22:00 affiche jusqu'a 21:59.",
        visibleStartHour: "Heure de debut visible",
        weatherForecast: "Previsions meteo",
        weatherForecastDesc: "Afficher l'icone de condition quotidienne et la temperature sur chaque jour.",
        weatherIconStyle: "Style d'icone meteo",
        weekStartsOn: "La semaine commence le",
    },
    it: {
        allDay: "tutto il giorno",
        animated: "Animato",
        appearance: "Aspetto",
        calendarFilters: "Filtri calendario",
        calendarGridLines: "Linee griglia calendario",
        calendarGridLinesDesc: "Mostra divisori nelle viste Mese, Settimana e Bisettimanale.",
        calendarNavigation: "Navigazione calendario",
        calendarView: "Vista calendario",
        cleanDashboard: "Dashboard pulita",
        default: "Predefinito",
        dimPastEvents: "Attenua eventi passati",
        dimPastEventsDesc: "Riduce l'opacita quando un evento e terminato.",
        eventFont: "Carattere eventi",
        eventFontSize: "Dimensione carattere eventi",
        extraLarge: "Molto grande",
        features: "Funzioni",
        filters: "Filtri",
        friendlyRounded: "Arrotondato amichevole",
        general: "Generale",
        hi: "MAX",
        integration: "Integrazione",
        integrationHelper: "Dominio della tua integrazione Aurora Calendar (di solito aurora_calendar)",
        jumpTo: "Vai a",
        large: "Grande",
        loading: "Caricamento...",
        lo: "MIN",
        medium: "Medio",
        monday: "Lunedi",
        next: "Avanti",
        nextWeek: "Prossima settimana",
        openWeatherForecast: "Apri previsioni meteo",
        previous: "Indietro",
        serif: "Serif",
        showCalendars: "Mostra calendari",
        showEventTimes: "Mostra orari eventi",
        showEventTimesDesc: "Mostra l'ora di inizio sulle schede evento.",
        small: "Piccolo",
        static: "Statico",
        sunday: "Domenica",
        timeFormat: "Formato ora",
        today: "Oggi",
        twelveHour: "12 ore",
        twentyFourHour: "24 ore",
        unconfigured: "Apri Impostazioni -> Integrazioni -> Aurora Calendar -> Configura per aggiungere i calendari.",
        viewBiweek: "Due settimane",
        viewMonth: "Mese",
        viewNext7Days: "Prossimi 7 giorni",
        viewToday: "Oggi",
        viewWeek: "Settimana",
        visibleEndHour: "Ora finale visibile",
        visibleEndHourHelper: "Fine esclusiva; 22:00 mostra fino alle 21:59.",
        visibleStartHour: "Ora iniziale visibile",
        weatherForecast: "Previsioni meteo",
        weatherForecastDesc: "Mostra icona condizione giornaliera e temperatura in ogni giorno.",
        weatherIconStyle: "Stile icona meteo",
        weekStartsOn: "La settimana inizia di",
    },
    nl: {
        allDay: "hele dag",
        animated: "Geanimeerd",
        appearance: "Uiterlijk",
        calendarFilters: "Kalenderfilters",
        calendarGridLines: "Kalenderrasterlijnen",
        calendarGridLinesDesc: "Toon scheidingslijnen in maand-, week- en tweewekenweergave.",
        calendarNavigation: "Kalendernavigatie",
        calendarView: "Kalenderweergave",
        cleanDashboard: "Strak dashboard",
        default: "Standaard",
        dimPastEvents: "Afgelopen gebeurtenissen dimmen",
        dimPastEventsDesc: "Vermindert de dekking zodra een gebeurtenis is afgelopen.",
        eventFont: "Lettertype gebeurtenissen",
        eventFontSize: "Lettergrootte gebeurtenissen",
        extraLarge: "Extra groot",
        features: "Functies",
        filters: "Filters",
        friendlyRounded: "Vriendelijk afgerond",
        general: "Algemeen",
        hi: "MAX",
        integration: "Integratie",
        integrationHelper: "Domein van je Aurora Calendar-integratie (meestal aurora_calendar)",
        jumpTo: "Ga naar",
        large: "Groot",
        loading: "Laden...",
        lo: "MIN",
        medium: "Gemiddeld",
        monday: "Maandag",
        next: "Volgende",
        nextWeek: "Volgende week",
        openWeatherForecast: "Weersverwachting openen",
        previous: "Vorige",
        serif: "Serif",
        showCalendars: "Kalenders tonen",
        showEventTimes: "Tijden van gebeurtenissen tonen",
        showEventTimesDesc: "Starttijd op gebeurteniskaarten tonen.",
        small: "Klein",
        static: "Statisch",
        sunday: "Zondag",
        timeFormat: "Tijdnotatie",
        today: "Vandaag",
        twelveHour: "12 uur",
        twentyFourHour: "24 uur",
        unconfigured: "Open Instellingen -> Integraties -> Aurora Calendar -> Configureren om je kalenders toe te voegen.",
        viewBiweek: "Twee weken",
        viewMonth: "Maand",
        viewNext7Days: "Volgende 7 dagen",
        viewToday: "Vandaag",
        viewWeek: "Week",
        visibleEndHour: "Zichtbare eindtijd",
        visibleEndHourHelper: "Exclusief einde; 22:00 toont tot 21:59.",
        visibleStartHour: "Zichtbare starttijd",
        weatherForecast: "Weersverwachting",
        weatherForecastDesc: "Toon dagelijkse conditie-icoon en temperatuur in elke dagcel.",
        weatherIconStyle: "Stijl weericoon",
        weekStartsOn: "Week begint op",
    },
    pt: {
        allDay: "dia inteiro",
        animated: "Animado",
        appearance: "Aparencia",
        calendarFilters: "Filtros do calendario",
        calendarGridLines: "Linhas da grelha do calendario",
        calendarGridLinesDesc: "Mostrar divisorias nas vistas Mes, Semana e Quinzenal.",
        calendarNavigation: "Navegacao do calendario",
        calendarView: "Vista do calendario",
        cleanDashboard: "Painel limpo",
        default: "Predefinido",
        dimPastEvents: "Atenuar eventos passados",
        dimPastEventsDesc: "Reduz a opacidade quando um evento termina.",
        eventFont: "Tipo de letra dos eventos",
        eventFontSize: "Tamanho do texto dos eventos",
        extraLarge: "Extra grande",
        features: "Funcionalidades",
        filters: "Filtros",
        friendlyRounded: "Arredondado amigavel",
        general: "Geral",
        hi: "MAX",
        integration: "Integracao",
        integrationHelper: "Dominio da integracao Aurora Calendar (normalmente aurora_calendar)",
        jumpTo: "Ir para",
        large: "Grande",
        loading: "A carregar...",
        lo: "MIN",
        medium: "Medio",
        monday: "Segunda-feira",
        next: "Seguinte",
        nextWeek: "Proxima semana",
        openWeatherForecast: "Abrir previsao meteorologica",
        previous: "Anterior",
        serif: "Serif",
        showCalendars: "Mostrar calendarios",
        showEventTimes: "Mostrar horas dos eventos",
        showEventTimesDesc: "Mostra a hora de inicio nos cartoes de evento.",
        small: "Pequeno",
        static: "Estatico",
        sunday: "Domingo",
        timeFormat: "Formato da hora",
        today: "Hoje",
        twelveHour: "12 horas",
        twentyFourHour: "24 horas",
        unconfigured: "Abra Definicoes -> Integracoes -> Aurora Calendar -> Configurar para adicionar os calendarios.",
        viewBiweek: "Quinzenal",
        viewMonth: "Mes",
        viewNext7Days: "Proximos 7 dias",
        viewToday: "Hoje",
        viewWeek: "Semana",
        visibleEndHour: "Hora final visivel",
        visibleEndHourHelper: "Fim exclusivo; 22:00 mostra ate 21:59.",
        visibleStartHour: "Hora inicial visivel",
        weatherForecast: "Previsao meteorologica",
        weatherForecastDesc: "Mostrar icone da condicao diaria e temperatura em cada dia.",
        weatherIconStyle: "Estilo do icone meteorologico",
        weekStartsOn: "A semana comeca em",
    },
    "pt-BR": {
        allDay: "dia inteiro",
        animated: "Animado",
        appearance: "Aparencia",
        calendarFilters: "Filtros do calendario",
        calendarGridLines: "Linhas do calendario",
        calendarGridLinesDesc: "Mostrar divisorias nas visualizacoes Mes, Semana e Quinzenal.",
        calendarNavigation: "Navegacao do calendario",
        calendarView: "Visualizacao do calendario",
        cleanDashboard: "Painel limpo",
        default: "Padrao",
        dimPastEvents: "Escurecer eventos passados",
        dimPastEventsDesc: "Reduz a opacidade quando um evento termina.",
        eventFont: "Fonte dos eventos",
        eventFontSize: "Tamanho da fonte dos eventos",
        extraLarge: "Extra grande",
        features: "Recursos",
        filters: "Filtros",
        friendlyRounded: "Arredondada amigavel",
        general: "Geral",
        hi: "MAX",
        integration: "Integracao",
        integrationHelper: "Dominio da integracao Aurora Calendar (normalmente aurora_calendar)",
        jumpTo: "Ir para",
        large: "Grande",
        loading: "Carregando...",
        lo: "MIN",
        medium: "Medio",
        monday: "Segunda-feira",
        next: "Proximo",
        nextWeek: "Proxima semana",
        openWeatherForecast: "Abrir previsao do tempo",
        previous: "Anterior",
        serif: "Serif",
        showCalendars: "Mostrar calendarios",
        showEventTimes: "Mostrar horarios dos eventos",
        showEventTimesDesc: "Mostra o horario de inicio nos cartoes de evento.",
        small: "Pequeno",
        static: "Estatico",
        sunday: "Domingo",
        timeFormat: "Formato de hora",
        today: "Hoje",
        twelveHour: "12 horas",
        twentyFourHour: "24 horas",
        unconfigured: "Abra Configuracoes -> Integracoes -> Aurora Calendar -> Configurar para adicionar seus calendarios.",
        viewBiweek: "Quinzenal",
        viewMonth: "Mes",
        viewNext7Days: "Proximos 7 dias",
        viewToday: "Hoje",
        viewWeek: "Semana",
        visibleEndHour: "Hora final visivel",
        visibleEndHourHelper: "Fim exclusivo; 22:00 mostra ate 21:59.",
        visibleStartHour: "Hora inicial visivel",
        weatherForecast: "Previsao do tempo",
        weatherForecastDesc: "Mostra icone da condicao diaria e temperatura em cada dia.",
        weatherIconStyle: "Estilo do icone do tempo",
        weekStartsOn: "A semana comeca em",
    },
    pl: {
        allDay: "caly dzien",
        animated: "Animowana",
        appearance: "Wyglad",
        calendarFilters: "Filtry kalendarza",
        calendarGridLines: "Linie siatki kalendarza",
        calendarGridLinesDesc: "Pokazuj linie w widokach miesiaca, tygodnia i dwoch tygodni.",
        calendarNavigation: "Nawigacja kalendarza",
        calendarView: "Widok kalendarza",
        cleanDashboard: "Czysty pulpit",
        default: "Domyslne",
        dimPastEvents: "Przyciemnij minione wydarzenia",
        dimPastEventsDesc: "Zmniejsza krycie po zakonczeniu wydarzenia.",
        eventFont: "Czcionka wydarzen",
        eventFontSize: "Rozmiar czcionki wydarzen",
        extraLarge: "Bardzo duzy",
        features: "Funkcje",
        filters: "Filtry",
        friendlyRounded: "Przyjaznie zaokraglona",
        general: "Ogolne",
        hi: "MAX",
        integration: "Integracja",
        integrationHelper: "Domena integracji Aurora Calendar (zwykle aurora_calendar)",
        jumpTo: "Przejdz do",
        large: "Duzy",
        loading: "Ladowanie...",
        lo: "MIN",
        medium: "Sredni",
        monday: "Poniedzialek",
        next: "Nastepny",
        nextWeek: "Nastepny tydzien",
        openWeatherForecast: "Otworz prognoze pogody",
        previous: "Poprzedni",
        serif: "Szeryfowa",
        showCalendars: "Pokaz kalendarze",
        showEventTimes: "Pokaz godziny wydarzen",
        showEventTimesDesc: "Pokazuj czas rozpoczecia na kartach wydarzen.",
        small: "Maly",
        static: "Statyczna",
        sunday: "Niedziela",
        timeFormat: "Format czasu",
        today: "Dzisiaj",
        twelveHour: "12-godzinny",
        twentyFourHour: "24-godzinny",
        unconfigured: "Otworz Ustawienia -> Integracje -> Aurora Calendar -> Konfiguruj, aby dodac kalendarze.",
        viewBiweek: "Dwa tygodnie",
        viewMonth: "Miesiac",
        viewNext7Days: "Nastepne 7 dni",
        viewToday: "Dzisiaj",
        viewWeek: "Tydzien",
        visibleEndHour: "Widoczna godzina koncowa",
        visibleEndHourHelper: "Koniec wylaczny; 22:00 pokazuje do 21:59.",
        visibleStartHour: "Widoczna godzina poczatkowa",
        weatherForecast: "Prognoza pogody",
        weatherForecastDesc: "Pokazuj ikone warunkow i temperature w kazdej komorce dnia.",
        weatherIconStyle: "Styl ikony pogody",
        weekStartsOn: "Tydzien zaczyna sie w",
    },
    sv: {
        allDay: "hela dagen",
        animated: "Animerad",
        appearance: "Utseende",
        calendarFilters: "Kalenderfilter",
        calendarGridLines: "Kalenderrutnat",
        calendarGridLinesDesc: "Visa avdelare i manads-, vecko- och tvaveckorsvyer.",
        calendarNavigation: "Kalendernavigering",
        calendarView: "Kalendervy",
        cleanDashboard: "Ren instrumentpanel",
        default: "Standard",
        dimPastEvents: "Tona ned tidigare handelser",
        dimPastEventsDesc: "Minskar opaciteten nar en handelse har slutat.",
        eventFont: "Handelsetypsnitt",
        eventFontSize: "Textstorlek for handelser",
        extraLarge: "Extra stor",
        features: "Funktioner",
        filters: "Filter",
        friendlyRounded: "Vanligt rundad",
        general: "Allmant",
        hi: "MAX",
        integration: "Integration",
        integrationHelper: "Doman for din Aurora Calendar-integration (vanligtvis aurora_calendar)",
        jumpTo: "Ga till",
        large: "Stor",
        loading: "Laddar...",
        lo: "MIN",
        medium: "Medium",
        monday: "Mandag",
        next: "Nasta",
        nextWeek: "Nasta vecka",
        openWeatherForecast: "Oppna vaderprognos",
        previous: "Foregaende",
        serif: "Serif",
        showCalendars: "Visa kalendrar",
        showEventTimes: "Visa tider for handelser",
        showEventTimesDesc: "Visa starttid pa handelsekort.",
        small: "Liten",
        static: "Statisk",
        sunday: "Sondag",
        timeFormat: "Tidsformat",
        today: "Idag",
        twelveHour: "12 timmar",
        twentyFourHour: "24 timmar",
        unconfigured: "Oppna Installningar -> Integrationer -> Aurora Calendar -> Konfigurera for att lagga till dina kalendrar.",
        viewBiweek: "Tva veckor",
        viewMonth: "Manad",
        viewNext7Days: "Nasta 7 dagarna",
        viewToday: "Idag",
        viewWeek: "Vecka",
        visibleEndHour: "Synlig sluttimme",
        visibleEndHourHelper: "Exklusivt slut; 22:00 visar till 21:59.",
        visibleStartHour: "Synlig starttimme",
        weatherForecast: "Vaderprognos",
        weatherForecastDesc: "Visa daglig vaderikon och temperatur i varje dagruta.",
        weatherIconStyle: "Stil for vaderikon",
        weekStartsOn: "Veckan borjar pa",
    },
};
const VIEW_LABEL_KEYS = {
    Month: "viewMonth",
    Week: "viewWeek",
    Biweek: "viewBiweek",
    Today: "viewToday",
    "Next 7 Days": "viewNext7Days",
};
function localeFromHass(hass) {
    return (hass?.locale?.language ||
        navigator.languages?.[0] ||
        navigator.language ||
        "en");
}
function t(locale, key) {
    const normalized = normalizeLocale(locale);
    return (TRANSLATIONS[normalized]?.[key] ||
        TRANSLATIONS[baseLocale(normalized)]?.[key] ||
        TRANSLATIONS.en[key] || key);
}
function viewModeLabel(locale, mode) {
    return t(locale, VIEW_LABEL_KEYS[mode]);
}
function formatWeekday(locale, date, width = "short") {
    return new Intl.DateTimeFormat(locale, { weekday: width }).format(date);
}
function formatMonth(locale, date, width = "short") {
    return new Intl.DateTimeFormat(locale, { month: width }).format(date);
}
function formatMonthTitle(locale, date) {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}
function formatTodayTitle(locale, date) {
    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(date);
}
function formatRangeTitle(locale, start, end) {
    const s = formatMonthDay(locale, start);
    const e = sameMonth(start, end)
        ? new Intl.DateTimeFormat(locale, { day: "numeric" }).format(end)
        : formatMonthDay(locale, end);
    return `${s} - ${e}`;
}
function formatFullWeekRange(locale, start, end) {
    const s = formatMonthDay(locale, start, "long");
    const e = sameMonth(start, end)
        ? new Intl.DateTimeFormat(locale, { day: "numeric" }).format(end)
        : formatMonthDay(locale, end, "long");
    return `${s} - ${e}`;
}
function formatMonthDay(locale, date, month = "short") {
    return new Intl.DateTimeFormat(locale, { month, day: "numeric" }).format(date);
}
function sameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
function normalizeLocale(locale) {
    let canonical = "en";
    try {
        canonical = Intl.getCanonicalLocales(locale || "en")[0] || "en";
    }
    catch {
        canonical = "en";
    }
    if (canonical.toLowerCase() === "pt-br")
        return "pt-BR";
    return baseLocale(canonical);
}
function baseLocale(locale) {
    return locale.split("-")[0];
}

const VIEW_MODES = [
    "Month",
    "Week",
    "Biweek",
    "Today",
    "Next 7 Days",
];
function localToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
function weekStartDay(weekStart) {
    return weekStart === "monday" ? 1 : 0;
}
function startOfWeek(date, weekStart) {
    const startDay = weekStartDay(weekStart);
    const d = new Date(date);
    const diff = (d.getDay() - startDay + 7) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}
function endOfWeek(date, weekStart) {
    const end = startOfWeek(date, weekStart);
    end.setDate(end.getDate() + 6);
    return end;
}
function getDateRange(mode, offset, weekStart = "sunday") {
    const today = localToday();
    if (mode === "Month") {
        // JS Date handles month overflow automatically (e.g. month 13 → Jan next year)
        const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        const last = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
        return [startOfWeek(first, weekStart), endOfWeek(last, weekStart)];
    }
    if (mode === "Week") {
        const start = startOfWeek(today, weekStart);
        start.setDate(start.getDate() + offset * 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return [start, end];
    }
    if (mode === "Biweek") {
        const start = startOfWeek(today, weekStart);
        start.setDate(start.getDate() + offset * 14);
        const end = new Date(start);
        end.setDate(start.getDate() + 13);
        return [start, end];
    }
    if (mode === "Today") {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return [d, new Date(d)];
    }
    // Next 7 Days
    const start = new Date(today);
    start.setDate(today.getDate() + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
}
function getViewTitle(mode, offset, start, end, locale = "en") {
    if (mode === "Month") {
        // Use offset to find the actual displayed month (start may be prior-month padding)
        const today = localToday();
        const ref = new Date(today.getFullYear(), today.getMonth() + offset, 1);
        return formatMonthTitle(locale, ref);
    }
    if (mode === "Today") {
        return formatTodayTitle(locale, start);
    }
    return formatRangeTitle(locale, start, end);
}
function loadPersistedView(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return VIEW_MODES.includes(parsed.viewMode)
            ? parsed.viewMode
            : null;
    }
    catch {
        return null;
    }
}
function persistView(key, viewMode) {
    try {
        localStorage.setItem(key, JSON.stringify({ viewMode }));
    }
    catch {
        // Storage full or unavailable — silently ignore
    }
}

function eventHasConcluded(event, now = new Date()) {
    if (event.all_day) {
        return new Date(`${event.end}T00:00:00`).getTime() <= now.getTime();
    }
    return new Date(event.end).getTime() <= now.getTime();
}
async function fetchEventsForRange(hass, calendars, start, end) {
    if (calendars.length === 0)
        return [];
    const s = encodeURIComponent(start.toISOString());
    const fetchEnd = new Date(end);
    fetchEnd.setDate(fetchEnd.getDate() + 1);
    const e = encodeURIComponent(fetchEnd.toISOString());
    const results = await Promise.all(calendars.map(async (cal) => {
        try {
            const raw = await hass.callApi("GET", `calendars/${cal.entity_id}?start=${s}&end=${e}`);
            return raw.map((ev, i) => ({
                id: ev.uid ??
                    `${cal.entity_id}:${i}:${ev.start.dateTime ?? ev.start.date ?? ""}`,
                title: ev.summary ?? "(no title)",
                start: ev.start.dateTime ?? ev.start.date ?? "",
                end: ev.end.dateTime ?? ev.end.date ?? "",
                all_day: !ev.start.dateTime,
                person: cal.person,
                color: cal.color,
                description: ev.description,
                location: ev.location,
                calendarEntity: cal.entity_id,
                calendarName: cal.person,
                uid: ev.uid,
                recurrenceId: ev.recurrence_id ?? ev.recurrenceId,
            }));
        }
        catch {
            return [];
        }
    }));
    return results.flat();
}

async function fetchDailyWeather(hass, weatherEntity) {
    if (!weatherEntity)
        return {};
    const state = hass.states[weatherEntity];
    const temperatureUnit = String(state?.attributes.temperature_unit ?? "");
    try {
        const result = await hass.callWS({
            type: "call_service",
            domain: "weather",
            service: "get_forecasts",
            service_data: { type: "daily" },
            target: { entity_id: weatherEntity },
            return_response: true,
        });
        const forecast = result.response?.[weatherEntity]?.forecast ?? [];
        return forecast.reduce((acc, item) => {
            const day = normalizeForecast(item, temperatureUnit);
            if (!day)
                return acc;
            acc[dateKey(new Date(item.datetime))] = day;
            return acc;
        }, {});
    }
    catch {
        return {};
    }
}
function normalizeForecast(forecast, temperatureUnit) {
    if (!forecast.datetime || !forecast.condition)
        return null;
    return {
        condition: forecast.condition,
        temperature: forecast.temperature,
        templow: forecast.templow,
        temperatureUnit,
    };
}
function weatherSvgUrl(condition, style = "static") {
    const icon = weatherSvgName(condition);
    return `/aurora_calendar_static/weather-icons/${style}/${icon}.svg`;
}
function weatherSvgName(condition) {
    switch (condition) {
        case "clear-night":
            return "clear-night";
        case "cloudy":
            return "cloudy";
        case "fog":
            return "fog";
        case "hail":
            return "hail";
        case "lightning":
            return "thunderstorms";
        case "lightning-rainy":
            return "scattered-thunderstorms";
        case "partlycloudy":
            return "cloudy-2-day";
        case "pouring":
            return "rainy-3";
        case "rainy":
            return "rainy-2";
        case "snowy":
            return "snowy-2";
        case "snowy-rainy":
            return "rain-and-snow-mix";
        case "sunny":
            return "clear-day";
        case "windy":
        case "windy-variant":
            return "wind";
        case "exceptional":
            return "severe-thunderstorm";
        default:
            return "cloudy";
    }
}
function weatherTempLabel(day) {
    const high = formatTemp(day.temperature, day.temperatureUnit);
    const low = formatTemp(day.templow, day.temperatureUnit);
    if (high !== "" && low !== "")
        return `${high}/${low}`;
    if (high !== "")
        return high;
    if (low !== "")
        return low;
    return "";
}
function weatherTempParts(day) {
    return {
        high: formatTemp(day.temperature, day.temperatureUnit),
        low: formatTemp(day.templow, day.temperatureUnit),
    };
}
function formatTemp(value, unit) {
    if (typeof value !== "number")
        return "";
    return `${Math.round(value)}${normalizeTempUnit(unit)}`;
}
function normalizeTempUnit(unit) {
    if (!unit)
        return "";
    if (unit === "C" || unit === "F")
        return `°${unit}`;
    return unit;
}

function hexToRgb(color) {
    const raw = color.trim().replace(/^#/, "");
    const hex = raw.length === 3
        ? raw.split("").map((char) => char + char).join("")
        : raw;
    if (!/^[0-9a-fA-F]{6}$/.test(hex))
        return null;
    const value = Number.parseInt(hex, 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
}
function toHex(value) {
    return Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0");
}
function contrastText(color) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return "var(--primary-text-color)";
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 150 ? "#1f2933" : "#ffffff";
}
function shadeColor(color, amount) {
    const rgb = hexToRgb(color);
    if (!rgb)
        return color;
    return `#${toHex(rgb.r + amount)}${toHex(rgb.g + amount)}${toHex(rgb.b + amount)}`;
}

function sameDay$2(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
function fillsFullDay$1(event, day) {
    if (event.all_day)
        return true;
    const s = new Date(event.start);
    const en = new Date(event.end);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setHours(24, 0, 0, 0);
    return s <= dayStart && en >= nextDay;
}
function fmtTime$2(d, format) {
    if (format === "24h") {
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes();
    const ap = d.getHours() >= 12 ? "pm" : "am";
    return m ? `${h}:${m.toString().padStart(2, "0")}${ap}` : `${h}${ap}`;
}
function fmtTimeRange$1(event, format, locale) {
    const s = new Date(event.start);
    const en = new Date(event.end);
    const startT = fmtTime$2(s, format);
    const endT = fmtTime$2(en, format);
    if (sameDay$2(s, en)) {
        return `${startT} - ${endT}`;
    }
    const dateOpts = { month: "numeric", day: "numeric" };
    const sD = s.toLocaleDateString(locale, dateOpts);
    const enD = en.toLocaleDateString(locale, dateOpts);
    return `${sD} ${startT} - ${enD} ${endT}`;
}
let AuroraCalendarMonth = class AuroraCalendarMonth extends i {
    constructor() {
        super(...arguments);
        this.events = [];
        this.dimOtherMonths = true;
        this.weekStart = "sunday";
        this.weatherByDate = {};
        this.weatherEntity = "";
        this.locale = "en";
        this.persons = [];
        this._autoScrollKey = "";
    }
    updated() {
        this._applyAppearanceVars();
        this._syncScrollFades();
        this._autoScrollCurrentDayEvents();
    }
    _applyAppearanceVars() {
        if (!this.config)
            return;
        this.style.setProperty("--aurora-event-font-size", `${this.config.event_font_size}px`);
        this.style.setProperty("--aurora-event-font-family", this.config.event_font_family || "inherit");
    }
    render() {
        const today = localToday();
        const days = this._days();
        const firstHeader = this.weekStart === "monday" ? 1 : 0;
        const dayHeaders = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(2026, 1, 1 + ((firstHeader + i) % 7));
            return formatWeekday(this.locale, date, "short");
        });
        return b `
      <div class="month-grid ${this.config.show_calendar_grid_lines ? "" : "no-grid"}">
        <div class="col-headers">
          ${dayHeaders.map((d) => b `<div class="col-header">${d}</div>`)}
        </div>
        <div class="cells">
          ${days.map((day) => {
            const isToday = sameDay$2(day, today);
            const isCurrent = !this.dimOtherMonths ||
                (day.getMonth() === this.currentMonth &&
                    day.getFullYear() === this.currentYear);
            const isPast = day < today && !isToday;
            const events = this._eventsOn(day);
            const grouped = this._groupEvents(events, day);
            const focusEventId = isToday ? this._focusEventId(events, day) : "";
            const weather = this.weatherByDate[dateKey(day)];
            const temps = weather ? weatherTempParts(weather) : null;
            const shouldDimOtherMonth = this.dimOtherMonths && !isCurrent;
            return b `
              <div
                class="cell
                  ${isToday ? "today" : ""}
                  ${!isCurrent ? "other-month" : ""}
                  ${isPast ? "past" : ""}"
              >
                <div class="day-meta">
                  <div class="day-num ${isToday ? "circle" : ""}">
                    ${day.getDate()}
                  </div>
                  ${weather ? b `
                    <button
                      class="weather-pill"
                      title="${weather.condition}"
                      aria-label=${t(this.locale, "openWeatherForecast")}
                      @click=${this._openWeatherMoreInfo}
                    >
                      <span class="weather-temps">
                        <span>${t(this.locale, "hi")}: ${temps?.high || "--"}</span>
                        <span>${t(this.locale, "lo")}: ${temps?.low || "--"}</span>
                      </span>
                      <img src=${weatherSvgUrl(weather.condition, this.config.weather_icon_style)} alt="${weather.condition}" />
                    </button>
                  ` : ""}
                </div>
                <div class="events-wrap">
                  <div
                    class="events-scroll"
                    data-current-day=${isToday ? "true" : "false"}
                    @scroll=${this._handleEventScroll}
                  >
                  ${grouped.allDay.length ? b `
                    <div class="all-day-stack ${focusEventId ? "yields-to-focus" : ""}">
                      <div class="all-day-label">All day</div>
                      ${grouped.allDay.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, true))}
                    </div>
                  ` : ""}
                  ${grouped.expiredTimed.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, false))}
                  ${grouped.activeTimed.map((e) => this._renderEventChip(e, focusEventId, shouldDimOtherMonth, false))}
                  </div>
                </div>
              </div>
            `;
        })}
        </div>
      </div>
    `;
    }
    _renderEventChip(e, focusEventId, shouldDimOtherMonth, asAllDay) {
        const concluded = eventHasConcluded(e);
        const dim = this.config.dim_past_events && concluded;
        const time = this.config.show_event_time && !e.all_day && !asAllDay
            ? fmtTimeRange$1(e, this.config.time_format, this.locale)
            : "";
        const textColor = contrastText(e.color);
        const avatar = this._personAvatar(e);
        return b `
      <div
        class="chip aurora-event-chip ${e.all_day ? "all-day-chip" : ""} ${dim || shouldDimOtherMonth ? "dim" : ""}"
        data-focus-event=${e.id === focusEventId ? "true" : "false"}
        data-event-concluded=${concluded ? "true" : "false"}
        @click=${() => this._openEvent(e)}
        style="--aurora-chip-bg:${e.color};--aurora-chip-border-color:${shadeColor(e.color, -32)};--aurora-chip-fg:${textColor};"
      >
        <div class="chip-title">${e.title}</div>
        ${time ? b `<div class="chip-time">${time}</div>` : ""}
        ${avatar}
      </div>
    `;
    }
    _days() {
        const days = [];
        const cur = new Date(this.start);
        while (cur <= this.end) {
            days.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
        return days;
    }
    _eventsOn(day) {
        return this.events
            .filter((e) => {
            if (e.all_day) {
                // HA all-day end is exclusive (next day midnight)
                const s = new Date(e.start + "T00:00:00");
                const en = new Date(e.end + "T00:00:00");
                return s <= day && day < en;
            }
            // Timed: show on any day the event spans (cross-midnight and multi-day)
            const s = new Date(e.start);
            const en = new Date(e.end);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            return s <= dayEnd && en > dayStart;
        })
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }
    _handleEventScroll(event) {
        this._updateScrollFade(event.currentTarget);
    }
    _syncScrollFades() {
        this.shadowRoot
            ?.querySelectorAll(".events-scroll")
            .forEach((el) => this._updateScrollFade(el));
    }
    _updateScrollFade(el) {
        const canScrollUp = el.scrollTop > 1;
        const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        el.classList.toggle("can-scroll-up", canScrollUp);
        el.classList.toggle("can-scroll-down", canScrollDown);
        this._updateAllDayStickiness(el);
        this._updateFadeOffset(el);
        this._updateUnderAllDayDimming(el);
    }
    _updateAllDayStickiness(el) {
        const stack = el.querySelector(".all-day-stack.yields-to-focus");
        const target = el.querySelector('.chip[data-focus-event="true"]');
        if (!stack || !target) {
            // Today: keep sticky (no focus event yet, or no timed events). Non-today: always static.
            if (el.dataset.currentDay === "true") {
                el.classList.remove("all-day-static");
            }
            else {
                el.classList.add("all-day-static");
            }
            el.querySelectorAll(".all-day-stack").forEach((stackEl) => {
                stackEl.style.setProperty("--all-day-shift", "0px");
                stackEl.style.setProperty("--all-day-collapse", "0px");
                stackEl.style.setProperty("--all-day-progress", "0");
                stackEl.style.pointerEvents = "auto";
            });
            return;
        }
        if (this.config.keep_all_day_events_visible) {
            el.classList.remove("all-day-static");
            stack.style.setProperty("--all-day-shift", "0px");
            stack.style.setProperty("--all-day-collapse", "0px");
            stack.style.setProperty("--all-day-progress", "0");
            stack.style.pointerEvents = "auto";
            return;
        }
        const stackHeight = Math.max(1, stack.offsetHeight);
        const targetCollisionPoint = Math.max(0, target.offsetTop - stackHeight - 1);
        const targetHasReachedAllDay = el.scrollTop >= targetCollisionPoint;
        // Size-based fallback is disabled while we validate the collision-based flow.
        const needsStaticFlow = targetHasReachedAllDay;
        if (needsStaticFlow) {
            el.classList.add("all-day-static");
            stack.style.setProperty("--all-day-shift", "0px");
            stack.style.setProperty("--all-day-collapse", "0px");
            stack.style.setProperty("--all-day-progress", "0");
            stack.style.pointerEvents = "auto";
            return;
        }
        el.classList.remove("all-day-static");
        stack.style.setProperty("--all-day-shift", "0px");
        stack.style.setProperty("--all-day-collapse", "0px");
        stack.style.setProperty("--all-day-progress", "0");
        stack.style.pointerEvents = "auto";
    }
    _updateFadeOffset(el) {
        const stack = el.querySelector(".all-day-stack");
        const rawProgress = stack ? Number(stack.style.getPropertyValue("--all-day-progress") || "0") : 1;
        const progress = Number.isFinite(rawProgress) ? rawProgress : 1;
        const offset = stack && getComputedStyle(stack).position === "sticky"
            ? Math.max(0, stack.offsetHeight * (1 - progress) - 2)
            : 0;
        el.style.setProperty("--fade-top-offset", `${offset}px`);
    }
    _updateUnderAllDayDimming(el) {
        const stack = el.querySelector(".all-day-stack");
        const stackIsSticky = stack &&
            !el.classList.contains("all-day-static") &&
            getComputedStyle(stack).position === "sticky";
        const stackHeight = stackIsSticky ? stack.offsetHeight : 0;
        el.querySelectorAll(".chip:not(.all-day-chip)").forEach((chip) => {
            const top = chip.offsetTop - el.scrollTop;
            const bottom = top + chip.offsetHeight;
            const chipHeight = Math.max(1, chip.offsetHeight);
            const fadeStartTop = stackHeight - chipHeight * 0.25;
            const fullyHiddenTop = stackHeight - chipHeight;
            if (stackHeight <= 0 || bottom <= 0 || top >= fadeStartTop) {
                chip.classList.remove("under-all-day");
                chip.classList.remove("under-all-day-hidden");
                chip.style.removeProperty("--under-all-day-opacity");
                return;
            }
            const baseOpacity = chip.classList.contains("dim") ? 0.35 : 1;
            const ratio = bottom <= stackHeight
                ? 1
                : Math.min(1, Math.max(0, (fadeStartTop - top) / Math.max(1, fadeStartTop - fullyHiddenTop)));
            const opacity = ratio >= 1 ? 0 : Math.max(0.06, baseOpacity * (1 - ratio * 0.94));
            chip.classList.add("under-all-day");
            chip.classList.toggle("under-all-day-hidden", opacity === 0);
            chip.style.setProperty("--under-all-day-opacity", opacity.toFixed(2));
        });
    }
    _autoScrollCurrentDayEvents() {
        const today = localToday();
        const events = this._eventsOn(today);
        const focusEventId = this._focusEventId(events, today);
        const key = `${dateKey(today)}|${focusEventId}|${events.map((event) => event.id).join(",")}`;
        if (!focusEventId || key === this._autoScrollKey)
            return;
        requestAnimationFrame(() => {
            const scroll = this.shadowRoot?.querySelector('.events-scroll[data-current-day="true"]');
            const target = scroll?.querySelector('.chip[data-focus-event="true"]');
            if (!scroll || !target)
                return;
            const allDayStack = scroll.querySelector(".all-day-stack");
            const shouldReserveAllDaySpace = allDayStack && !target.classList.contains("all-day-chip");
            const scrollOffset = shouldReserveAllDaySpace
                ? allDayStack.offsetHeight + 6
                : 4;
            scroll.scrollTop = Math.max(0, target.offsetTop - scrollOffset);
            this._autoScrollKey = key;
            this._updateScrollFade(scroll);
        });
    }
    _focusEventId(events, day) {
        if (events.length === 0)
            return "";
        // Exclude events rendered as all-day chips (either native all-day or spanning the full day),
        // since their offsetTop is relative to the sticky stack, not the scroll container.
        const timed = events.filter((event) => !event.all_day && !fillsFullDay$1(event, day));
        return timed.find((event) => !eventHasConcluded(event))?.id || "";
    }
    _groupEvents(events, day) {
        return {
            allDay: events.filter((event) => fillsFullDay$1(event, day)),
            expiredTimed: events.filter((event) => !fillsFullDay$1(event, day) && eventHasConcluded(event)),
            activeTimed: events.filter((event) => !fillsFullDay$1(event, day) && !eventHasConcluded(event)),
        };
    }
    _openEvent(event) {
        this.dispatchEvent(new CustomEvent("aurora-event-open", {
            detail: { event },
            bubbles: true,
            composed: true,
        }));
    }
    _personAvatar(event) {
        const person = this.persons.find((p) => p.person === event.person);
        const color = person?.color || event.color;
        const initial = (person?.person || event.person || "?").charAt(0).toUpperCase();
        return b `
      <span class="event-avatar" style="--event-avatar-color: ${color}" title="${event.person}">
        ${person?.avatar
            ? b `<img src="${person.avatar}" alt="${event.person}" />`
            : b `${initial}`}
      </span>
    `;
    }
    _openWeatherMoreInfo(event) {
        event.stopPropagation();
        if (!this.weatherEntity)
            return;
        const moreInfoEvent = new Event("hass-more-info", {
            bubbles: true,
            composed: true,
        });
        moreInfoEvent.detail = { entityId: this.weatherEntity };
        this.dispatchEvent(moreInfoEvent);
    }
};
AuroraCalendarMonth.styles = i$3 `
    :host {
      display: block;
      height: 100%;
    }

    .month-grid {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
      box-shadow:
        inset 0 -1px 0 var(--divider-color, #e0e0e0),
        inset 0 0 0 1px var(--divider-color, #e0e0e0);
    }

    .col-headers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: var(--secondary-background-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .col-header {
      text-align: center;
      padding: 8px 0 6px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .cells {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: 1fr;
      flex: 1;
      min-height: 0;
    }

    .cell {
      min-height: 72px;
      padding: 6px;
      border-right: 1px solid var(--divider-color, #e0e0e0);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .events-wrap {
      position: relative;
      flex: 1;
      min-height: 0;
    }

    .events-scroll {
      height: 100%;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      scrollbar-width: none;
      overscroll-behavior: contain;
      overflow-anchor: none;
      padding-bottom: 18px;
      --fade-top-offset: 0px;
      --fade-top-size: 12px;
      --fade-bottom-size: 22px;
    }

    .events-scroll.can-scroll-down {
      -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
      mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
    }

    .events-scroll.can-scroll-up {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
    }

    .events-scroll.can-scroll-up.can-scroll-down {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
    }

    .events-scroll::-webkit-scrollbar {
      display: none;
    }

    .all-day-stack {
      --all-day-shift: 0px;
      --all-day-collapse: 0px;
      --all-day-progress: 0;
      position: sticky;
      top: 0;
      z-index: 3;
      padding: 0 0 4px;
      margin: 0;
      margin-bottom: calc(var(--all-day-collapse, 0px) * -1);
      background: transparent;
      transform: translateY(var(--all-day-shift, 0px));
      transition: none;
      will-change: transform, margin-bottom;
    }

    .events-scroll.all-day-static .all-day-stack {
      position: relative;
      top: auto;
      z-index: 1;
      margin-bottom: 0;
      transform: none;
      will-change: auto;
    }

    .all-day-label {
      margin: 0 0 2px 2px;
      color: var(--secondary-text-color);
      font-size: 0.58rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
    }

    .cell:nth-child(7n) {
      border-right: none;
    }

    .cell.other-month .day-num {
      color: var(--disabled-text-color, #bbb);
    }

    .cell.other-month .day-meta,
    .cell.other-month .events-wrap {
      opacity: 0.48;
    }

    .day-num {
      font-size: var(--aurora-day-num-font-size, 1.7rem);
      font-weight: 800;
      width: 1.4em;
      height: 1.4em;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--primary-text-color);
      line-height: 1;
    }

    .day-meta {
      position: relative;
      min-height: 42px;
      margin-bottom: 6px;
      min-width: 0;
    }

    .day-num.circle {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 6px;
      font-weight: 700;
    }

    .chip {
      display: block;
      position: relative;
      min-height: 34px;
      padding: var(--aurora-event-padding, 4px 26px 4px 6px);
      border-radius: var(--aurora-event-radius, 7px);
      margin-bottom: 4px;
      overflow: hidden;
      line-height: 1.18;
      box-shadow: var(--aurora-event-shadow, 0 1px 2px rgba(0, 0, 0, 0.16));
      cursor: pointer;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .chip.all-day-chip {
      min-height: 0;
      height: 28px;
      padding-top: 3px;
      padding-bottom: 3px;
      margin-bottom: 2px;
      font-size: var(--aurora-allday-font-size, 13px);
      line-height: 1.05;
    }

    .all-day-stack .chip.all-day-chip:last-child {
      margin-bottom: 0;
    }

    .chip.under-all-day {
      opacity: var(--under-all-day-opacity, 0.18) !important;
      filter: saturate(0.55);
    }

    .chip.under-all-day-hidden {
      pointer-events: none;
    }

    .chip.all-day-chip .chip-title {
      font-size: 1em;
      line-height: 1.05;
    }

    .chip.all-day-chip .event-avatar {
      width: 20px;
      height: 20px;
      font-size: 0.58rem;
    }

    .chip-title,
    .chip-time {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chip-title {
      font-size: 1em;
      font-weight: 800;
    }

    .chip-time {
      margin-top: 2px;
      font-size: 0.82em;
      font-weight: 500;
      opacity: 0.82;
    }

    .chip.dim {
      opacity: 0.38;
    }

    .event-avatar {
      position: absolute;
      right: 5px;
      bottom: 4px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--event-avatar-color, var(--primary-color));
      border: 1.5px solid rgba(255, 255, 255, 0.72);
      color: #fff;
      font-size: 0.58rem;
      font-weight: 900;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .event-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .weather-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: calc(100% - 44px);
      position: absolute;
      top: 0;
      right: 0;
      height: 38px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 600;
      overflow: hidden;
      cursor: pointer;
    }

    .weather-pill img {
      width: 38px;
      height: 38px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .weather-temps {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1px;
      font-size: 0.68rem;
      font-weight: 700;
      line-height: 1;
      text-align: right;
      white-space: nowrap;
    }

    .weather-temps span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .month-grid.no-grid {
      box-shadow: none;
    }

    .month-grid.no-grid .col-headers,
    .month-grid.no-grid .cell {
      border-right-color: transparent;
      border-bottom-color: transparent;
    }

  `;
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "events", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "start", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "end", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "currentMonth", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "currentYear", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "config", void 0);
__decorate([
    n({ type: Boolean })
], AuroraCalendarMonth.prototype, "dimOtherMonths", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "weekStart", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "weatherByDate", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "weatherEntity", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "locale", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarMonth.prototype, "persons", void 0);
AuroraCalendarMonth = __decorate([
    t$1("aurora-calendar-month")
], AuroraCalendarMonth);

function sameDay$1(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
function fillsFullDay(event, day) {
    if (event.all_day)
        return true;
    const s = new Date(event.start);
    const en = new Date(event.end);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setHours(24, 0, 0, 0);
    return s <= dayStart && en >= nextDay;
}
function fmtTime$1(d, format) {
    if (format === "24h") {
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes();
    const ap = d.getHours() >= 12 ? "pm" : "am";
    return m ? `${h}:${m.toString().padStart(2, "0")}${ap}` : `${h}${ap}`;
}
function fmtTimeRange(event, format, locale) {
    const s = new Date(event.start);
    const en = new Date(event.end);
    const startT = fmtTime$1(s, format);
    const endT = fmtTime$1(en, format);
    if (sameDay$1(s, en)) {
        return `${startT} - ${endT}`;
    }
    const dateOpts = { month: "numeric", day: "numeric" };
    const sD = s.toLocaleDateString(locale, dateOpts);
    const enD = en.toLocaleDateString(locale, dateOpts);
    return `${sD} ${startT} - ${enD} ${endT}`;
}
let AuroraCalendarWeekBox = class AuroraCalendarWeekBox extends i {
    constructor() {
        super(...arguments);
        this.events = [];
        this.days = [];
        this.weatherByDate = {};
        this.weatherEntity = "";
        this.locale = "en";
        this.persons = [];
        this._autoScrollKey = "";
    }
    updated() {
        this._applyAppearanceVars();
        this._syncScrollFades();
        this._autoScrollCurrentDayEvents();
    }
    _applyAppearanceVars() {
        if (!this.config)
            return;
        this.style.setProperty("--aurora-event-font-size", `${this.config.event_font_size}px`);
        this.style.setProperty("--aurora-event-font-family", this.config.event_font_family || "inherit");
    }
    render() {
        const today = localToday();
        const days = this.days.slice(0, 7);
        const nextWeekLabel = this._nextWeekLabel(days);
        return b `
      <div class="week-box-grid ${this.config.show_calendar_grid_lines ? "" : "no-grid"}">
        ${days.map((day) => {
            const isToday = sameDay$1(day, today);
            const isPast = day < today && !isToday;
            const events = this._eventsOn(day);
            const grouped = this._groupEvents(events, day);
            const focusEventId = isToday ? this._focusEventId(events, day) : "";
            const weather = this.weatherByDate[dateKey(day)];
            const temps = weather ? weatherTempParts(weather) : null;
            return b `
            <div class="day-cell ${isToday ? "today" : ""} ${isPast ? "past" : ""}">
              <div class="day-heading">
                <div class="date-wrap">
                  <span class="date-num ${isToday ? "circle" : ""}">${day.getDate()}</span>
                  <span class="day-label">
                    <span class="dow">${formatWeekday(this.locale, day, "long")}</span>
                    <span class="month-lbl">${formatMonth(this.locale, day, "short")}</span>
                  </span>
                </div>
                ${weather ? b `
                  <button
                    class="weather-pill"
                    title="${weather.condition}"
                    aria-label=${t(this.locale, "openWeatherForecast")}
                    @click=${this._openWeatherMoreInfo}
                  >
                    <span class="weather-temps">
                      <span>${t(this.locale, "hi")}: ${temps?.high || "--"}</span>
                      <span>${t(this.locale, "lo")}: ${temps?.low || "--"}</span>
                    </span>
                    <img src=${weatherSvgUrl(weather.condition, this.config.weather_icon_style)} alt="${weather.condition}" />
                  </button>
                ` : ""}
              </div>
              <div class="events-wrap">
                <div
                  class="events-scroll"
                  data-current-day=${isToday ? "true" : "false"}
                  @scroll=${this._handleEventScroll}
                >
                ${grouped.allDay.length ? b `
                  <div class="all-day-stack ${focusEventId ? "yields-to-focus" : ""}">
                    <div class="all-day-label">All day</div>
                    ${grouped.allDay.map((e) => this._renderEventChip(e, focusEventId, true))}
                  </div>
                ` : ""}
                ${grouped.expiredTimed.map((e) => this._renderEventChip(e, focusEventId, false))}
                ${grouped.activeTimed.map((e) => this._renderEventChip(e, focusEventId, false))}
                </div>
              </div>
            </div>
          `;
        })}
        <button
          class="empty-action"
          type="button"
          title=${t(this.locale, "nextWeek")}
          aria-label=${t(this.locale, "nextWeek")}
          @click=${this._handleEmptyClick}
        >
          <span class="empty-title">${t(this.locale, "nextWeek")}</span>
          <span class="empty-date">${nextWeekLabel}</span>
        </button>
      </div>
    `;
    }
    _handleEmptyClick() {
        this.dispatchEvent(new CustomEvent("week-empty-click", {
            bubbles: true,
            composed: true,
        }));
    }
    _nextWeekLabel(days) {
        if (days.length === 0)
            return "";
        const start = new Date(days[0]);
        start.setDate(start.getDate() + 7);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return formatFullWeekRange(this.locale, start, end);
    }
    _eventsOn(day) {
        return this.events
            .filter((e) => {
            if (e.all_day) {
                const s = new Date(e.start + "T00:00:00");
                const en = new Date(e.end + "T00:00:00");
                return s <= day && day < en;
            }
            // Timed: show on any day the event spans (cross-midnight and multi-day)
            const s = new Date(e.start);
            const en = new Date(e.end);
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            return s <= dayEnd && en > dayStart;
        })
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }
    _renderEventChip(e, focusEventId, asAllDay) {
        const concluded = eventHasConcluded(e);
        const dim = this.config.dim_past_events && concluded;
        const time = this.config.show_event_time && !e.all_day && !asAllDay
            ? fmtTimeRange(e, this.config.time_format, this.locale)
            : "";
        const textColor = contrastText(e.color);
        const avatar = this._personAvatar(e);
        return b `
      <div
        class="chip aurora-event-chip ${e.all_day ? "all-day-chip" : ""} ${dim ? "dim" : ""}"
        data-focus-event=${e.id === focusEventId ? "true" : "false"}
        data-event-concluded=${concluded ? "true" : "false"}
        @click=${() => this._openEvent(e)}
        style="--aurora-chip-bg:${e.color};--aurora-chip-border-color:${shadeColor(e.color, -32)};--aurora-chip-fg:${textColor};"
      >
        <div class="chip-title">${e.title}</div>
        ${time ? b `<div class="chip-time">${time}</div>` : ""}
        ${avatar}
      </div>
    `;
    }
    _handleEventScroll(event) {
        this._updateScrollFade(event.currentTarget);
    }
    _syncScrollFades() {
        this.shadowRoot
            ?.querySelectorAll(".events-scroll")
            .forEach((el) => this._updateScrollFade(el));
    }
    _updateScrollFade(el) {
        const canScrollUp = el.scrollTop > 1;
        const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        el.classList.toggle("can-scroll-up", canScrollUp);
        el.classList.toggle("can-scroll-down", canScrollDown);
        this._updateAllDayStickiness(el);
        this._updateFadeOffset(el);
        this._updateUnderAllDayDimming(el);
    }
    _updateAllDayStickiness(el) {
        const stack = el.querySelector(".all-day-stack.yields-to-focus");
        const target = el.querySelector('.chip[data-focus-event="true"]');
        if (!stack || !target) {
            // Today: keep sticky (no focus event yet, or no timed events). Non-today: always static.
            if (el.dataset.currentDay === "true") {
                el.classList.remove("all-day-static");
            }
            else {
                el.classList.add("all-day-static");
            }
            el.querySelectorAll(".all-day-stack").forEach((stackEl) => {
                stackEl.style.setProperty("--all-day-shift", "0px");
                stackEl.style.setProperty("--all-day-collapse", "0px");
                stackEl.style.setProperty("--all-day-progress", "0");
                stackEl.style.pointerEvents = "auto";
            });
            return;
        }
        if (this.config.keep_all_day_events_visible) {
            el.classList.remove("all-day-static");
            stack.style.setProperty("--all-day-shift", "0px");
            stack.style.setProperty("--all-day-collapse", "0px");
            stack.style.setProperty("--all-day-progress", "0");
            stack.style.pointerEvents = "auto";
            return;
        }
        const stackHeight = Math.max(1, stack.offsetHeight);
        const targetCollisionPoint = Math.max(0, target.offsetTop - stackHeight - 1);
        const targetHasReachedAllDay = el.scrollTop >= targetCollisionPoint;
        // Size-based fallback is disabled while we validate the collision-based flow.
        const needsStaticFlow = targetHasReachedAllDay;
        if (needsStaticFlow) {
            el.classList.add("all-day-static");
            stack.style.setProperty("--all-day-shift", "0px");
            stack.style.setProperty("--all-day-collapse", "0px");
            stack.style.setProperty("--all-day-progress", "0");
            stack.style.pointerEvents = "auto";
            return;
        }
        el.classList.remove("all-day-static");
        stack.style.setProperty("--all-day-shift", "0px");
        stack.style.setProperty("--all-day-collapse", "0px");
        stack.style.setProperty("--all-day-progress", "0");
        stack.style.pointerEvents = "auto";
    }
    _updateFadeOffset(el) {
        const stack = el.querySelector(".all-day-stack");
        const rawProgress = stack ? Number(stack.style.getPropertyValue("--all-day-progress") || "0") : 1;
        const progress = Number.isFinite(rawProgress) ? rawProgress : 1;
        const offset = stack && getComputedStyle(stack).position === "sticky"
            ? Math.max(0, stack.offsetHeight * (1 - progress) - 2)
            : 0;
        el.style.setProperty("--fade-top-offset", `${offset}px`);
    }
    _updateUnderAllDayDimming(el) {
        const stack = el.querySelector(".all-day-stack");
        const stackIsSticky = stack &&
            !el.classList.contains("all-day-static") &&
            getComputedStyle(stack).position === "sticky";
        const stackHeight = stackIsSticky ? stack.offsetHeight : 0;
        el.querySelectorAll(".chip:not(.all-day-chip)").forEach((chip) => {
            const top = chip.offsetTop - el.scrollTop;
            const bottom = top + chip.offsetHeight;
            const chipHeight = Math.max(1, chip.offsetHeight);
            const fadeStartTop = stackHeight - chipHeight * 0.25;
            const fullyHiddenTop = stackHeight - chipHeight;
            if (stackHeight <= 0 || bottom <= 0 || top >= fadeStartTop) {
                chip.classList.remove("under-all-day");
                chip.classList.remove("under-all-day-hidden");
                chip.style.removeProperty("--under-all-day-opacity");
                return;
            }
            const baseOpacity = chip.classList.contains("dim") ? 0.35 : 1;
            const ratio = bottom <= stackHeight
                ? 1
                : Math.min(1, Math.max(0, (fadeStartTop - top) / Math.max(1, fadeStartTop - fullyHiddenTop)));
            const opacity = ratio >= 1 ? 0 : Math.max(0.06, baseOpacity * (1 - ratio * 0.94));
            chip.classList.add("under-all-day");
            chip.classList.toggle("under-all-day-hidden", opacity === 0);
            chip.style.setProperty("--under-all-day-opacity", opacity.toFixed(2));
        });
    }
    _autoScrollCurrentDayEvents() {
        const today = localToday();
        const events = this._eventsOn(today);
        const focusEventId = this._focusEventId(events, today);
        const key = `${dateKey(today)}|${focusEventId}|${events.map((event) => event.id).join(",")}`;
        if (!focusEventId || key === this._autoScrollKey)
            return;
        requestAnimationFrame(() => {
            const scroll = this.shadowRoot?.querySelector('.events-scroll[data-current-day="true"]');
            const target = scroll?.querySelector('.chip[data-focus-event="true"]');
            if (!scroll || !target)
                return;
            const allDayStack = scroll.querySelector(".all-day-stack");
            const shouldReserveAllDaySpace = allDayStack && !target.classList.contains("all-day-chip");
            const scrollOffset = shouldReserveAllDaySpace
                ? allDayStack.offsetHeight + 6
                : 4;
            scroll.scrollTop = Math.max(0, target.offsetTop - scrollOffset);
            this._autoScrollKey = key;
            this._updateScrollFade(scroll);
        });
    }
    _focusEventId(events, day) {
        if (events.length === 0)
            return "";
        // Exclude events rendered as all-day chips (either native all-day or spanning the full day),
        // since their offsetTop is relative to the sticky stack, not the scroll container.
        const timed = events.filter((event) => !event.all_day && !fillsFullDay(event, day));
        return timed.find((event) => !eventHasConcluded(event))?.id || "";
    }
    _groupEvents(events, day) {
        return {
            allDay: events.filter((event) => fillsFullDay(event, day)),
            expiredTimed: events.filter((event) => !fillsFullDay(event, day) && eventHasConcluded(event)),
            activeTimed: events.filter((event) => !fillsFullDay(event, day) && !eventHasConcluded(event)),
        };
    }
    _openEvent(event) {
        this.dispatchEvent(new CustomEvent("aurora-event-open", {
            detail: { event },
            bubbles: true,
            composed: true,
        }));
    }
    _personAvatar(event) {
        const person = this.persons.find((p) => p.person === event.person);
        const color = person?.color || event.color;
        const initial = (person?.person || event.person || "?").charAt(0).toUpperCase();
        return b `
      <span class="event-avatar" style="--event-avatar-color: ${color}" title="${event.person}">
        ${person?.avatar
            ? b `<img src="${person.avatar}" alt="${event.person}" />`
            : b `${initial}`}
      </span>
    `;
    }
    _openWeatherMoreInfo(event) {
        event.stopPropagation();
        if (!this.weatherEntity)
            return;
        const moreInfoEvent = new Event("hass-more-info", {
            bubbles: true,
            composed: true,
        });
        moreInfoEvent.detail = { entityId: this.weatherEntity };
        this.dispatchEvent(moreInfoEvent);
    }
};
AuroraCalendarWeekBox.styles = i$3 `
    :host {
      display: block;
      height: 100%;
    }

    .week-box-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(2, minmax(0, 1fr));
      height: 100%;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
      box-shadow:
        inset 0 -1px 0 var(--divider-color, #e0e0e0),
        inset 0 0 0 1px var(--divider-color, #e0e0e0);
    }

    .day-cell,
    .empty-action {
      min-height: 0;
      border-right: 1px solid var(--divider-color, #e0e0e0);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      box-sizing: border-box;
    }

    .day-cell:nth-child(4n),
    .empty-action {
      border-right: none;
    }

    .day-cell {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 10px;
      position: relative;
    }

    .day-heading {
      position: relative;
      min-height: 54px;
      margin-bottom: 10px;
      min-width: 0;
    }

    .date-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      padding-right: 112px;
    }

    .dow {
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      line-height: 1;
      color: var(--secondary-text-color);
    }

    .day-label {
      display: flex;
      flex-direction: column;
      gap: 0;
      min-width: 0;
    }

    .date-num {
      width: 1.3em;
      height: 1.3em;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      color: var(--primary-text-color);
      font-size: var(--aurora-day-num-font-size, 2.5rem);
      font-weight: 800;
      line-height: 1;
    }

    .date-num.circle {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 700;
    }

    .month-lbl {
      font-size: 0.88rem;
      line-height: 1.2;
      color: var(--secondary-text-color);
    }

    .events-wrap {
      position: relative;
      flex: 1;
      min-height: 0;
    }

    .events-scroll {
      height: 100%;
      overflow-y: auto;
      min-height: 0;
      scrollbar-width: none;
      overscroll-behavior: contain;
      overflow-anchor: none;
      padding-bottom: 22px;
      --fade-top-offset: 0px;
      --fade-top-size: 14px;
      --fade-bottom-size: 28px;
    }

    .events-scroll.can-scroll-down {
      -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
      mask-image: linear-gradient(to bottom, #000 calc(100% - var(--fade-bottom-size)), transparent);
    }

    .events-scroll.can-scroll-up {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 100%
      );
    }

    .events-scroll.can-scroll-up.can-scroll-down {
      -webkit-mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
      mask-image: linear-gradient(
        to bottom,
        #000 0,
        #000 var(--fade-top-offset),
        transparent var(--fade-top-offset),
        #000 calc(var(--fade-top-offset) + var(--fade-top-size)),
        #000 calc(100% - var(--fade-bottom-size)),
        transparent
      );
    }

    .events-scroll::-webkit-scrollbar {
      display: none;
    }

    .all-day-stack {
      --all-day-shift: 0px;
      --all-day-collapse: 0px;
      --all-day-progress: 0;
      position: sticky;
      top: 0;
      z-index: 3;
      padding: 0 0 4px;
      margin: 0;
      margin-bottom: calc(var(--all-day-collapse, 0px) * -1);
      background: transparent;
      transform: translateY(var(--all-day-shift, 0px));
      transition: none;
      will-change: transform, margin-bottom;
    }

    .events-scroll.all-day-static .all-day-stack {
      position: relative;
      top: auto;
      z-index: 1;
      margin-bottom: 0;
      transform: none;
      will-change: auto;
    }

    .all-day-label {
      margin: 0 0 2px 2px;
      color: var(--secondary-text-color);
      font-size: 0.62rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
    }

    .chip {
      display: block;
      position: relative;
      min-height: 40px;
      padding: var(--aurora-event-padding, 5px 30px 5px 7px);
      border-radius: var(--aurora-event-radius, 8px);
      margin-bottom: 5px;
      overflow: hidden;
      line-height: 1.18;
      box-shadow: var(--aurora-event-shadow, 0 1px 2px rgba(0, 0, 0, 0.16));
      cursor: pointer;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .chip.all-day-chip {
      min-height: 0;
      height: 30px;
      padding-top: 4px;
      padding-bottom: 4px;
      margin-bottom: 2px;
      font-size: var(--aurora-allday-font-size, 13px);
      line-height: 1.05;
    }

    .all-day-stack .chip.all-day-chip:last-child {
      margin-bottom: 0;
    }

    .chip.under-all-day {
      opacity: var(--under-all-day-opacity, 0.18) !important;
      filter: saturate(0.55);
    }

    .chip.under-all-day-hidden {
      pointer-events: none;
    }

    .chip.all-day-chip .chip-title {
      font-size: 1em;
      line-height: 1.05;
    }

    .chip.all-day-chip .event-avatar {
      width: 20px;
      height: 20px;
      font-size: 0.58rem;
    }

    .chip-title,
    .chip-time {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chip-title {
      font-size: 1em;
      font-weight: 800;
    }

    .chip-time {
      margin-top: 2px;
      font-size: 0.82em;
      font-weight: 500;
      opacity: 0.82;
    }

    .chip.dim {
      opacity: 0.38;
    }

    .event-avatar {
      position: absolute;
      right: 6px;
      bottom: 5px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--event-avatar-color, var(--primary-color));
      border: 1.5px solid rgba(255, 255, 255, 0.72);
      color: #fff;
      font-size: 0.62rem;
      font-weight: 900;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .event-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .empty-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 0;
      transition: background 0.15s, color 0.15s;
    }

    .empty-action:hover,
    .empty-action:focus-visible {
      background: transparent;
      color: var(--primary-color);
      outline: none;
    }

    .empty-title {
      color: var(--primary-text-color);
      font-size: 1.08rem;
      font-weight: 700;
    }

    .empty-date {
      color: var(--secondary-text-color);
      font-size: 0.86rem;
      font-weight: 500;
    }

    .weather-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      max-width: 130px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      height: 52px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-weight: 600;
      overflow: hidden;
      cursor: pointer;
    }

    .weather-pill img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .weather-temps {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1;
      text-align: right;
      white-space: nowrap;
    }

    .weather-temps span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .week-box-grid.no-grid {
      box-shadow: none;
    }

    .week-box-grid.no-grid .day-cell,
    .week-box-grid.no-grid .empty-action {
      border-right-color: transparent;
      border-bottom-color: transparent;
    }
  `;
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "events", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "days", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "config", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "weatherByDate", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "weatherEntity", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "locale", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarWeekBox.prototype, "persons", void 0);
AuroraCalendarWeekBox = __decorate([
    t$1("aurora-calendar-week-box")
], AuroraCalendarWeekBox);

const HOUR_H = 64; // px per hour
function sameDay(a, b) {
    return (a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate());
}
function fmtTime(d, format) {
    if (format === "24h") {
        return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes();
    const ap = d.getHours() >= 12 ? "pm" : "am";
    return m ? `${h}:${m.toString().padStart(2, "0")}${ap}` : `${h}${ap}`;
}
function fmtHour(h, format) {
    if (format === "24h") {
        return `${h.toString().padStart(2, "0")}:00`;
    }
    const hour = h % 24;
    if (hour === 0)
        return "12am";
    if (hour === 12)
        return "12pm";
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}
let AuroraCalendarTimeGrid = class AuroraCalendarTimeGrid extends i {
    constructor() {
        super(...arguments);
        this.events = [];
        this.days = [];
        this.weatherByDate = {};
        this.weatherEntity = "";
        this.locale = "en";
        this.persons = [];
        this.autoScrollToNow = false;
        this._scrollbarGutter = -1;
        this._autoScrollKey = "";
        this._drag = null;
        this._pendingMove = null;
        this._suppressClickEventId = "";
        this._handleDragPointerMove = (pointerEvent) => {
            const drag = this._drag;
            if (!drag || pointerEvent.pointerId !== drag.pointerId)
                return;
            pointerEvent.preventDefault();
            const dx = pointerEvent.clientX - drag.startX;
            const dy = pointerEvent.clientY - drag.startY;
            const moved = drag.moved || Math.hypot(dx, dy) > 6;
            const preview = this._previewFromPointer(pointerEvent.clientX, pointerEvent.clientY, drag);
            this._drag = {
                ...drag,
                currentX: pointerEvent.clientX,
                currentY: pointerEvent.clientY,
                moved,
                previewDayIndex: preview.dayIndex,
                previewStartMin: preview.startMin,
            };
            this.requestUpdate();
        };
        this._handleDragPointerUp = (pointerEvent) => {
            const drag = this._drag;
            if (!drag || pointerEvent.pointerId !== drag.pointerId)
                return;
            pointerEvent.preventDefault();
            this._teardownDragListeners(pointerEvent.pointerId);
            if (!drag.moved) {
                this._drag = null;
                return;
            }
            const preview = this._previewFromPointer(pointerEvent.clientX, pointerEvent.clientY, drag);
            const start = this._dateTimeFromPreview(preview.dayIndex, preview.startMin, drag.startHour);
            const end = new Date(start.getTime() + drag.durationMs);
            this._suppressClickEventId = drag.event.id;
            this._pendingMove = { event: drag.event, start, end };
            this._drag = null;
        };
        this._handleDragPointerCancel = (pointerEvent) => {
            const drag = this._drag;
            if (!drag || pointerEvent.pointerId !== drag.pointerId)
                return;
            this._teardownDragListeners(pointerEvent.pointerId);
            this._drag = null;
        };
        this._cancelPendingMove = () => {
            this._pendingMove = null;
        };
        this._confirmPendingMove = () => {
            const move = this._pendingMove;
            if (!move)
                return;
            this._pendingMove = null;
            this.dispatchEvent(new CustomEvent("aurora-event-move", {
                detail: {
                    event: move.event,
                    start: move.start.toISOString(),
                    end: move.end.toISOString(),
                },
                bubbles: true,
                composed: true,
            }));
        };
    }
    connectedCallback() {
        super.connectedCallback();
        // Redraw every minute so the current-time bar stays accurate
        this._timer = setInterval(() => this.requestUpdate(), 60000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._timer);
        this._scrollbarRo?.disconnect();
    }
    firstUpdated() {
        const scroll = this.shadowRoot?.querySelector(".tg-scroll");
        if (!scroll)
            return;
        this._scrollbarRo = new ResizeObserver(() => this._syncScrollbarGutter());
        this._scrollbarRo.observe(scroll);
        this._syncScrollbarGutter();
    }
    updated() {
        this._applyAppearanceVars();
        this._syncScrollbarGutter();
        this._autoScrollToCurrentTime();
    }
    _applyAppearanceVars() {
        if (!this.config)
            return;
        this.style.setProperty("--aurora-event-font-size", `${this.config.event_font_size}px`);
        this.style.setProperty("--aurora-event-font-family", this.config.event_font_family || "inherit");
    }
    _syncScrollbarGutter() {
        const scroll = this.shadowRoot?.querySelector(".tg-scroll");
        if (!scroll)
            return;
        const gutter = Math.max(0, scroll.offsetWidth - scroll.clientWidth);
        if (gutter === this._scrollbarGutter)
            return;
        this._scrollbarGutter = gutter;
        this.style.setProperty("--tg-scrollbar-gutter", `${gutter}px`);
    }
    _autoScrollToCurrentTime() {
        if (!this.autoScrollToNow || this.days.length === 0)
            return;
        const [startHour, endHour] = this._timeBounds(this.events.filter((event) => !event.all_day));
        const key = [
            this.viewMode,
            this.days.map((day) => dateKey(day)).join(","),
            startHour,
            endHour,
        ].join("|");
        if (key === this._autoScrollKey)
            return;
        this._autoScrollKey = key;
        requestAnimationFrame(() => {
            const scroll = this.shadowRoot?.querySelector(".tg-scroll");
            if (!scroll)
                return;
            const now = new Date();
            const nowMin = (now.getHours() - startHour) * 60 + now.getMinutes();
            const windowMin = (endHour - startHour) * 60;
            let target = 0;
            if (nowMin >= windowMin) {
                target = scroll.scrollHeight - scroll.clientHeight;
            }
            else if (nowMin > 0) {
                target = nowMin * (HOUR_H / 60) - scroll.clientHeight * 0.28;
            }
            scroll.scrollTop = Math.max(0, Math.min(target, scroll.scrollHeight - scroll.clientHeight));
        });
    }
    render() {
        const today = localToday();
        const allDay = this.events.filter((e) => e.all_day);
        const timed = this.events.filter((e) => !e.all_day);
        const hasAllDay = this.days.some((d) => allDay.some((e) => this._onDay(e, d)));
        const [startHour, endHour] = this._timeBounds(timed);
        const pxPerMin = HOUR_H / 60;
        const totalPx = (endHour - startHour) * HOUR_H;
        const hourCells = Array.from({ length: endHour - startHour }, (_, i) => i + startHour);
        const hourTicks = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);
        const dayCount = Math.max(1, this.days.length);
        const drag = this._drag;
        const pendingMove = this._pendingMove;
        return b `
      <div class="tg-wrapper" style="--tg-day-count: ${dayCount}">

        <!-- ── Day header ── -->
        <div class="tg-header">
          <div class="tg-gutter"></div>
          <div class="tg-day-headers">
            ${this.days.map((day) => {
            const isToday = sameDay(day, today);
            const weather = this.weatherByDate[dateKey(day)];
            return b `
                <div class="tg-day-hdr ${isToday ? "today" : ""}">
                  <span class="dow">${formatWeekday(this.locale, day, "short")}</span>
                  <span class="date-num ${isToday ? "circle" : ""}">${day.getDate()}</span>
                  <span class="month-lbl">${formatMonth(this.locale, day, "short")}</span>
                  ${weather ? b `
                    <button
                      class="weather-pill"
                      title="${weather.condition}"
                      aria-label=${t(this.locale, "openWeatherForecast")}
                      @click=${this._openWeatherMoreInfo}
                    >
                      <img src=${weatherSvgUrl(weather.condition, this.config.weather_icon_style)} alt="${weather.condition}" />
                      <span>${weatherTempLabel(weather)}</span>
                    </button>
                  ` : A}
                </div>
              `;
        })}
          </div>
        </div>

        <!-- ── All-day strip ── -->
        ${hasAllDay ? b `
          <div class="tg-allday">
            <div class="tg-gutter tg-allday-lbl">${t(this.locale, "allDay")}</div>
            <div class="tg-allday-cols">
              ${this.days.map((day) => b `
                <div class="tg-allday-col">
                  ${allDay
            .filter((e) => this._onDay(e, day))
            .map((e) => {
            const textColor = contrastText(e.color);
            const dim = this.config.dim_past_events && eventHasConcluded(e);
            const avatar = this._personAvatar(e);
            return b `
                        <div
                          class="allday-chip aurora-event-chip ${dim ? "dim" : ""}"
                          @click=${() => this._openEvent(e)}
                          style="--aurora-chip-bg:${e.color};--aurora-chip-border-color:${shadeColor(e.color, -32)};--aurora-chip-fg:${textColor};"
                          title="${e.title}"
                        >
                          <span>${e.title}</span>
                          ${avatar}
                        </div>
                      `;
        })}
                </div>
              `)}
            </div>
          </div>
        ` : A}

        <!-- ── Scrollable time body ── -->
        <div class="tg-scroll">
          <div class="tg-inner" style="height:${totalPx}px">

            <!-- Hour labels -->
            <div class="tg-gutter tg-time-gutter">
              ${hourTicks.map((h, i) => b `
                <div
                  class="hour-lbl ${i === 0 ? "first" : i === hourTicks.length - 1 ? "last" : ""}"
                  style="top:${i * HOUR_H}px"
                >${fmtHour(h, this.config.time_format)}</div>
              `)}
            </div>

            <!-- Day columns -->
            <div class="tg-cols">
              ${this.days.map((day) => {
            const isToday = sameDay(day, today);
            const isPast = day < today && !isToday;
            const placed = this._layout(timed.filter((e) => this._onDay(e, day)), day, startHour, endHour, pxPerMin);
            const nowPx = isToday ? this._nowPx(startHour, endHour, pxPerMin) : null;
            return b `
                  <div class="tg-day-col ${isToday ? "today-col" : ""} ${isPast ? "past-col" : ""}">

                    <!-- Grid lines -->
                    ${hourTicks.map((_, i) => b `
                      <div class="hline"      style="top:${i * HOUR_H}px"></div>
                    `)}
                    ${hourCells.map((_, i) => b `
                      <div class="hline half" style="top:${i * HOUR_H + HOUR_H / 2}px"></div>
                    `)}

                    <!-- Events -->
                    ${placed.map((p) => {
                const dim = this.config.dim_past_events && eventHasConcluded(p.event);
                const showT = this.config.show_event_time;
                const s = new Date(p.event.start);
                const en = new Date(p.event.end);
                const textColor = contrastText(p.event.color);
                const avatar = this._personAvatar(p.event);
                const timeStr = showT
                    ? `${fmtTime(s, this.config.time_format)} – ${fmtTime(en, this.config.time_format)}`
                    : "";
                const isDragging = drag?.event.id === p.event.id;
                return b `
                        <div
                          class="ev-block aurora-event-chip ${dim ? "dim" : ""} ${p.event.canDragEdit ? "can-drag" : ""} ${isDragging ? "drag-source" : ""}"
                          @pointerdown=${(event) => this._handleEventPointerDown(event, p.event, startHour, endHour)}
                          @click=${() => this._handleEventClick(p.event)}
                          style="top:${p.top}px;height:${p.height}px;left:calc(${p.col} / ${p.numCols} * (100% - 4px) + 2px);width:calc(1 / ${p.numCols} * (100% - 4px) - 2px);--aurora-chip-bg:${p.event.color};--aurora-chip-border-color:${shadeColor(p.event.color, -32)};--aurora-chip-fg:${textColor};"
                          title="${p.event.title}${timeStr ? "\n" + timeStr : ""}"
                        >
                          ${p.event.canDragEdit ? b `
                            <button class="drag-handle" title="Move event" aria-label="Move event" @click=${(event) => event.stopPropagation()}>
                              <ha-icon icon="mdi:drag"></ha-icon>
                            </button>
                          ` : A}
                          <div class="ev-title">${p.event.title}</div>
                          ${p.height > 38 && timeStr
                    ? b `<div class="ev-time">${timeStr}</div>`
                    : A}
                          ${avatar}
                        </div>
                      `;
            })}

                    <!-- Current-time indicator -->
                    ${nowPx !== null ? b `
                      <div class="now-bar" style="top:${nowPx}px">
                        <div class="now-dot"></div>
                      </div>
                    ` : A}

                  </div>
                `;
        })}
              ${drag ? this._renderDragPreview(drag, dayCount) : A}
            </div>
          </div>
        </div>

      </div>
      ${pendingMove ? this._renderMoveConfirm(pendingMove) : A}
    `;
    }
    // ── helpers ──────────────────────────────────────────────────────────
    _onDay(event, day) {
        if (event.all_day) {
            const s = new Date(event.start + "T00:00:00");
            const en = new Date(event.end + "T00:00:00");
            return s <= day && day < en;
        }
        // Timed: show on any day the event spans (handles cross-midnight and multi-day)
        const s = new Date(event.start);
        const en = new Date(event.end);
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);
        return s <= dayEnd && en > dayStart;
    }
    _personAvatar(event) {
        const person = this.persons.find((p) => p.person === event.person);
        const color = person?.color || event.color;
        const initial = (person?.person || event.person || "?").charAt(0).toUpperCase();
        return b `
      <span class="event-avatar" style="--event-avatar-color: ${color}" title="${event.person}">
        ${person?.avatar
            ? b `<img src="${person.avatar}" alt="${event.person}" />`
            : b `${initial}`}
      </span>
    `;
    }
    _openEvent(event) {
        this.dispatchEvent(new CustomEvent("aurora-event-open", {
            detail: { event },
            bubbles: true,
            composed: true,
        }));
    }
    _handleEventClick(event) {
        if (this._suppressClickEventId === event.id) {
            this._suppressClickEventId = "";
            return;
        }
        this._openEvent(event);
    }
    _handleEventPointerDown(pointerEvent, event, startHour, endHour) {
        if (!event.canDragEdit || event.all_day || pointerEvent.button !== 0)
            return;
        const target = pointerEvent.composedPath()[0];
        const isHandle = Boolean(target?.closest?.(".drag-handle"));
        // Drag is only initiated from the handle — clicking anywhere else opens the event details.
        if (!isHandle)
            return;
        pointerEvent.preventDefault();
        pointerEvent.stopPropagation();
        const start = new Date(event.start);
        const end = new Date(event.end);
        const durationMs = Math.max(60000, end.getTime() - start.getTime());
        const durationMin = Math.max(1, Math.round(durationMs / 60000));
        const startMin = (start.getHours() - startHour) * 60 + start.getMinutes();
        const dayIndex = Math.max(0, this.days.findIndex((day) => sameDay(day, start)));
        this._pendingMove = null;
        this._drag = {
            event,
            pointerId: pointerEvent.pointerId,
            startX: pointerEvent.clientX,
            startY: pointerEvent.clientY,
            currentX: pointerEvent.clientX,
            currentY: pointerEvent.clientY,
            startHour,
            endHour,
            durationMs,
            durationMin,
            moved: false,
            previewDayIndex: dayIndex === -1 ? 0 : dayIndex,
            previewStartMin: Math.max(0, startMin),
        };
        this.setPointerCapture(pointerEvent.pointerId);
        window.addEventListener("pointermove", this._handleDragPointerMove);
        window.addEventListener("pointerup", this._handleDragPointerUp);
        window.addEventListener("pointercancel", this._handleDragPointerCancel);
    }
    _teardownDragListeners(pointerId) {
        try {
            this.releasePointerCapture(pointerId);
        }
        catch {
            // Pointer capture may already be gone after cancellation.
        }
        window.removeEventListener("pointermove", this._handleDragPointerMove);
        window.removeEventListener("pointerup", this._handleDragPointerUp);
        window.removeEventListener("pointercancel", this._handleDragPointerCancel);
    }
    _previewFromPointer(x, y, drag) {
        const cols = Array.from(this.shadowRoot?.querySelectorAll(".tg-day-col") ?? []);
        if (cols.length === 0) {
            return { dayIndex: drag.previewDayIndex, startMin: drag.previewStartMin };
        }
        let dayIndex = cols.findIndex((col) => {
            const rect = col.getBoundingClientRect();
            return x >= rect.left && x <= rect.right;
        });
        if (dayIndex === -1) {
            const first = cols[0].getBoundingClientRect();
            const last = cols[cols.length - 1].getBoundingClientRect();
            dayIndex = x < first.left ? 0 : x > last.right ? cols.length - 1 : drag.previewDayIndex;
        }
        const colRect = cols[dayIndex].getBoundingClientRect();
        const windowMin = (drag.endHour - drag.startHour) * 60;
        const maxStartMin = Math.max(0, windowMin - drag.durationMin);
        const rawMin = ((y - colRect.top) / HOUR_H) * 60;
        const snapped = Math.round(rawMin / 15) * 15;
        return {
            dayIndex,
            startMin: Math.max(0, Math.min(maxStartMin, snapped)),
        };
    }
    _dateTimeFromPreview(dayIndex, startMin, startHour) {
        const day = this.days[Math.max(0, Math.min(this.days.length - 1, dayIndex))] || localToday();
        const date = new Date(day);
        date.setHours(startHour, 0, 0, 0);
        date.setMinutes(date.getMinutes() + startMin);
        return date;
    }
    _renderDragPreview(drag, dayCount) {
        const event = drag.event;
        const textColor = contrastText(event.color);
        const start = this._dateTimeFromPreview(drag.previewDayIndex, drag.previewStartMin, drag.startHour);
        const end = new Date(start.getTime() + drag.durationMs);
        const timeStr = `${fmtTime(start, this.config.time_format)} – ${fmtTime(end, this.config.time_format)}`;
        return b `
      <div
        class="drag-preview aurora-event-chip"
        style="--preview-day-count:${dayCount};--preview-day-index:${drag.previewDayIndex};top:${drag.previewStartMin * (HOUR_H / 60)}px;height:${Math.max(24, drag.durationMin * (HOUR_H / 60))}px;--aurora-chip-bg:${event.color};--aurora-chip-border-color:${shadeColor(event.color, -32)};--aurora-chip-fg:${textColor};"
      >
        <div class="ev-title">${event.title}</div>
        <div class="ev-time">${timeStr}</div>
      </div>
    `;
    }
    _renderMoveConfirm(move) {
        return b `
      <div class="move-confirm" style="--move-color: ${move.event.color}">
        <div>
          <strong>Move event?</strong>
          <span>${move.event.title}</span>
          <small>${this._moveTimeLabel(move.start, move.end)}</small>
        </div>
        <div class="move-actions">
          <button @click=${this._cancelPendingMove}>Cancel</button>
          <button class="confirm" @click=${this._confirmPendingMove}>Move</button>
        </div>
      </div>
    `;
    }
    _moveTimeLabel(start, end) {
        const day = new Intl.DateTimeFormat(this.locale, {
            weekday: "short",
            month: "short",
            day: "numeric",
        }).format(start);
        return `${day}, ${fmtTime(start, this.config.time_format)} - ${fmtTime(end, this.config.time_format)}`;
    }
    /** Assign columns per overlap cluster so unrelated events can use full width. */
    _layout(events, day, startHour, endHour, pxPerMin) {
        if (events.length === 0)
            return [];
        const dayMidnight = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayVisibleEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour);
        const windowMin = (endHour - startHour) * 60;
        const visibleEvents = events
            .map((event) => {
            const s = new Date(event.start);
            const en = new Date(event.end);
            // Clip to this day: events starting before this day begin at top of window;
            // events ending after visible end are clamped to bottom of window.
            const rawStartMin = s < dayMidnight ? 0 : (s.getHours() - startHour) * 60 + s.getMinutes();
            const rawEndMin = en >= dayVisibleEnd ? windowMin : (en.getHours() - startHour) * 60 + en.getMinutes();
            if (rawEndMin <= 0 || rawStartMin >= windowMin)
                return null;
            return {
                event,
                startMs: s.getTime(),
                endMs: en.getTime(),
                startMin: Math.max(0, rawStartMin),
                endMin: Math.min(windowMin, rawEndMin),
            };
        })
            .filter((event) => event !== null)
            .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
        if (visibleEvents.length === 0)
            return [];
        const positioned = [];
        let cluster = [];
        let clusterEndMs = -Infinity;
        const flushCluster = () => {
            if (cluster.length === 0)
                return;
            const colEnds = [];
            const cols = [];
            for (const item of cluster) {
                let col = colEnds.findIndex((endMs) => endMs <= item.startMs);
                if (col === -1) {
                    col = colEnds.length;
                    colEnds.push(item.endMs);
                }
                else {
                    colEnds[col] = item.endMs;
                }
                cols.push(col);
            }
            const numCols = Math.max(...cols) + 1;
            cluster.forEach((item, index) => {
                positioned.push({
                    event: item.event,
                    top: item.startMin * pxPerMin,
                    height: Math.max(24, (item.endMin - item.startMin) * pxPerMin),
                    col: cols[index],
                    numCols,
                });
            });
        };
        for (const item of visibleEvents) {
            if (cluster.length > 0 && item.startMs >= clusterEndMs) {
                flushCluster();
                cluster = [];
                clusterEndMs = -Infinity;
            }
            cluster.push(item);
            clusterEndMs = Math.max(clusterEndMs, item.endMs);
        }
        flushCluster();
        return positioned;
    }
    _nowPx(startHour, endHour, pxPerMin) {
        const now = new Date();
        const min = (now.getHours() - startHour) * 60 + now.getMinutes();
        if (min < 0 || now.getHours() >= endHour)
            return null;
        return min * pxPerMin;
    }
    _startHour() {
        return Math.min(23, Math.max(0, Math.floor(this.config.visible_start_hour)));
    }
    _endHour(startHour) {
        const endHour = Math.min(24, Math.max(1, Math.floor(this.config.visible_end_hour)));
        return Math.max(startHour + 1, endHour);
    }
    _timeBounds(events) {
        let startHour = this._startHour();
        let endHour = this._endHour(startHour);
        for (const event of events) {
            const start = new Date(event.start);
            const end = new Date(event.end);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start)
                continue;
            for (const day of this.days) {
                const dayStart = new Date(day);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayStart);
                dayEnd.setDate(dayEnd.getDate() + 1);
                if (start >= dayEnd || end <= dayStart)
                    continue;
                const segmentStart = start <= dayStart ? 0 : start.getHours() + start.getMinutes() / 60;
                const segmentEnd = end >= dayEnd ? 24 : end.getHours() + end.getMinutes() / 60;
                startHour = Math.min(startHour, Math.floor(segmentStart));
                endHour = Math.max(endHour, Math.ceil(segmentEnd));
            }
        }
        startHour = Math.max(0, Math.min(23, startHour));
        endHour = Math.max(startHour + 1, Math.min(24, endHour));
        return [startHour, endHour];
    }
    _openWeatherMoreInfo(event) {
        event.stopPropagation();
        if (!this.weatherEntity)
            return;
        const moreInfoEvent = new Event("hass-more-info", {
            bubbles: true,
            composed: true,
        });
        moreInfoEvent.detail = { entityId: this.weatherEntity };
        this.dispatchEvent(moreInfoEvent);
    }
};
// ── styles ───────────────────────────────────────────────────────────
AuroraCalendarTimeGrid.styles = i$3 `
    :host {
      --tg-scrollbar-gutter: 0px;
      position: relative;
      display: block;
      height: 100%;
    }

    .tg-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      overflow: hidden;
    }

    /* ── Shared gutter ── */
    .tg-gutter {
      width: 52px;
      flex-shrink: 0;
    }

    /* ── Header ── */
    .tg-header {
      display: flex;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color);
      flex-shrink: 0;
      padding-right: var(--tg-scrollbar-gutter);
      box-sizing: border-box;
    }

    .tg-day-headers {
      flex: 1;
      display: flex;
    }

    .tg-day-hdr {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 2px;
      border-left: 1px solid var(--divider-color, #e0e0e0);
      gap: 1px;
      min-width: 0;
    }

    .tg-day-hdr.today {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .dow {
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .date-num {
      font-size: 1.05rem;
      font-weight: 500;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-text-color);
    }

    .date-num.circle {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 6px;
      font-weight: 700;
    }

    .month-lbl {
      font-size: 0.58rem;
      color: var(--secondary-text-color);
    }

    .weather-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
    }

    .weather-pill img {
      width: 28px;
      height: 20px;
      object-fit: contain;
    }

    /* ── All-day strip ── */
    .tg-allday {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
      min-height: 26px;
      padding-right: var(--tg-scrollbar-gutter);
      box-sizing: border-box;
    }

    .tg-allday-lbl {
      font-size: 0.58rem;
      color: var(--primary-text-color);
      font-weight: 700;
      text-shadow: 0 1px 2px color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 6px;
      width: auto;
      box-sizing: border-box;
    }

    .tg-allday-cols {
      min-width: 0;
      display: grid;
      grid-template-columns: repeat(var(--tg-day-count, 1), minmax(0, 1fr));
    }

    .tg-allday-col {
      min-width: 0;
      padding: 2px;
      border-left: 1px solid var(--divider-color, #e0e0e0);
      box-sizing: border-box;
    }

    .allday-chip {
      position: relative;
      padding: var(--aurora-allday-padding, 1px 4px 1px 5px);
      border-radius: var(--aurora-event-radius, 6px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
      line-height: 1.5;
      font-weight: 700;
      cursor: pointer;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .allday-chip span:first-child {
      display: block;
      padding-right: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .allday-chip.dim {
      opacity: 0.35;
    }

    /* ── Scrollable time body ── */
    .tg-scroll {
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      /* scroll-bar tracks only within this container */
      overscroll-behavior: contain;
    }

    .tg-inner {
      display: flex;
      position: relative;
      box-shadow: inset 0 -1px 0 var(--divider-color, #e0e0e0);
    }

    /* Hour labels */
    .tg-time-gutter {
      position: relative;
      background: color-mix(
        in srgb,
        var(--secondary-background-color, transparent) var(--aurora-card-opacity, 100%),
        transparent
      );
    }

    .hour-lbl {
      position: absolute;
      right: 0;
      transform: translateY(-50%);
      padding-right: 6px;
      font-size: 0.6rem;
      color: var(--primary-text-color);
      font-weight: 700;
      text-shadow: 0 1px 2px color-mix(in srgb, var(--card-background-color, #fff) 75%, transparent);
      box-sizing: border-box;
      line-height: 1;
      text-align: right;
      width: 100%;
    }

    .hour-lbl.first {
      transform: none;
    }

    .hour-lbl.last {
      transform: translateY(-100%);
    }

    /* ── Day columns ── */
    .tg-cols {
      flex: 1;
      display: flex;
      position: relative;
    }

    .tg-day-col {
      flex: 1;
      position: relative;
      border-left: 1px solid var(--divider-color, #e0e0e0);
    }

    .tg-day-col.today-col {
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    /* Grid lines */
    .hline {
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--divider-color, #e0e0e0);
      pointer-events: none;
    }

    .hline.half {
      opacity: 0.45;
      background: repeating-linear-gradient(
        90deg,
        var(--divider-color, #ccc) 0,
        var(--divider-color, #ccc) 4px,
        transparent 4px,
        transparent 8px
      );
    }

    /* ── Event blocks ── */
    .ev-block {
      position: absolute;
      border-radius: var(--aurora-event-radius, 8px);
      overflow: hidden;
      padding: var(--aurora-event-padding, 6px 30px 6px 8px);
      box-sizing: border-box;
      cursor: pointer;
      transition: filter 0.12s;
      box-shadow: var(--aurora-event-shadow, 0 1px 2px rgba(0, 0, 0, 0.16));
      touch-action: manipulation;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .ev-block:hover {
      filter: brightness(0.9);
      z-index: 10;
    }

    .ev-block.dim {
      opacity: 0.35;
    }

    .ev-block.can-drag {
      cursor: grab;
    }

    .ev-block.can-drag:active {
      cursor: grabbing;
    }

    .ev-block.drag-source {
      opacity: 0.28;
      filter: grayscale(0.2);
    }

    .drag-handle {
      position: absolute;
      top: 4px;
      right: 5px;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.22);
      color: inherit;
      cursor: grab;
      padding: 0;
      opacity: 0.82;
    }

    .drag-handle ha-icon {
      width: 16px;
      height: 16px;
      pointer-events: none;
    }

    .drag-preview {
      position: absolute;
      z-index: 40;
      left: calc(var(--preview-day-index) / var(--preview-day-count) * 100% + 2px);
      width: calc(1 / var(--preview-day-count) * 100% - 4px);
      border-radius: var(--aurora-event-radius, 8px);
      overflow: hidden;
      padding: var(--aurora-event-padding, 6px 30px 6px 8px);
      box-sizing: border-box;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
      pointer-events: none;
      opacity: 0.92;
      background: var(--aurora-chip-bg);
      border-left: var(--aurora-event-border-width, 4px) solid var(--aurora-chip-border-color);
      color: var(--aurora-chip-fg);
      font-size: var(--aurora-event-font-size);
      font-family: var(--aurora-event-font-family);
    }

    .move-confirm {
      position: absolute;
      right: 16px;
      bottom: 16px;
      z-index: 80;
      width: min(360px, calc(100% - 32px));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px;
      border-radius: 16px;
      border: 1px solid color-mix(in srgb, var(--move-color, var(--primary-color)) 34%, var(--divider-color));
      background: color-mix(in srgb, var(--card-background-color, #fff) 94%, var(--move-color, var(--primary-color)) 6%);
      color: var(--primary-text-color);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
      box-sizing: border-box;
      animation: move-confirm-in 0.16s ease-out both;
    }

    .move-confirm > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .move-confirm strong,
    .move-confirm span,
    .move-confirm small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .move-confirm strong {
      font-size: 0.95rem;
      font-weight: 900;
    }

    .move-confirm span {
      font-size: 0.86rem;
      font-weight: 700;
    }

    .move-confirm small {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .move-actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .move-actions button {
      min-height: 38px;
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 88%, var(--move-color, var(--primary-color)) 12%);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.82rem;
      font-weight: 800;
      padding: 0 14px;
    }

    .move-actions button.confirm {
      border-color: color-mix(in srgb, var(--move-color, var(--primary-color)) 70%, var(--divider-color));
      background: var(--move-color, var(--primary-color));
      color: var(--text-primary-color, #fff);
    }

    @keyframes move-confirm-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .ev-title {
      font-size: 1em;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.15;
    }

    .ev-time {
      margin-top: 2px;
      font-size: 0.82em;
      font-weight: 500;
      opacity: 0.82;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-avatar {
      position: absolute;
      right: 6px;
      bottom: 5px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--event-avatar-color, var(--primary-color));
      border: 1.5px solid rgba(255, 255, 255, 0.72);
      color: #fff;
      font-size: 0.62rem;
      font-weight: 900;
      overflow: hidden;
      box-sizing: border-box;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }

    .event-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* ── Current-time bar ── */
    .now-bar {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--error-color, #e53935);
      z-index: 5;
      pointer-events: none;
    }

    .now-dot {
      position: absolute;
      left: -5px;
      top: -4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--error-color, #e53935);
    }
  `;
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "events", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "days", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "config", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "viewMode", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "weatherByDate", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "weatherEntity", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "locale", void 0);
__decorate([
    n({ attribute: false })
], AuroraCalendarTimeGrid.prototype, "persons", void 0);
__decorate([
    n({ type: Boolean })
], AuroraCalendarTimeGrid.prototype, "autoScrollToNow", void 0);
__decorate([
    r()
], AuroraCalendarTimeGrid.prototype, "_drag", void 0);
__decorate([
    r()
], AuroraCalendarTimeGrid.prototype, "_pendingMove", void 0);
AuroraCalendarTimeGrid = __decorate([
    t$1("aurora-calendar-time-grid")
], AuroraCalendarTimeGrid);

const VIEW_ICONS = {
    Month: "mdi:calendar-month",
    Week: "mdi:calendar-week",
    Biweek: "mdi:calendar-week-begin",
    Today: "mdi:white-balance-sunny",
    "Next 7 Days": "mdi:calendar-range",
};
const CALENDAR_FEATURE_CREATE_EVENT = 1;
const CALENDAR_FEATURE_DELETE_EVENT = 2;
const CALENDAR_FEATURE_UPDATE_EVENT = 4;
let AuroraCalendarCard = class AuroraCalendarCard extends i {
    constructor() {
        super(...arguments);
        this._viewMode = "Month";
        this._offset = 0;
        this._events = [];
        this._weatherByDate = {};
        this._loading = false;
        this._filterMenuOpen = false;
        this._viewMenuOpen = false;
        this._jumpMenuOpen = false;
        this._selectedEvent = null;
        this._createDialogOpen = false;
        this._createDraft = null;
        this._createCalendarMenuOpen = false;
        this._editDialogOpen = false;
        this._editDraft = null;
        this._eventActionError = "";
        this._savingEvent = false;
        this._deletingEvent = false;
        this._deleteConfirmOpen = false;
        this._closingDialog = null;
        this._resolvedBackgroundImage = "";
        this._defaultViewLoaded = false;
        this._storageKey = "";
        this._lastFetchKey = "";
        this._lastWeatherFetchKey = "";
        this._pendingEventsRefresh = false;
        this._pendingWeatherRefresh = false;
        this._fetchRequestId = 0;
        this._backgroundMediaKey = "";
        this._backgroundMediaRequestId = 0;
        this._scheduleGridHeightSync = () => {
            if (this._gridHeightRaf) {
                cancelAnimationFrame(this._gridHeightRaf);
            }
            this._gridHeightRaf = requestAnimationFrame(() => {
                this._gridHeightRaf = requestAnimationFrame(() => {
                    this._gridHeightRaf = undefined;
                    this._syncGridHeightToViewport();
                });
            });
        };
        this._handleDocumentClick = (event) => {
            if (event.composedPath().includes(this))
                return;
            this._filterMenuOpen = false;
            this._viewMenuOpen = false;
            this._jumpMenuOpen = false;
        };
        this._handleStateChanged = (event) => {
            const entityId = event.data?.entity_id;
            if (!entityId || !this._config)
                return;
            if (entityId === this._configSensorEntityId) {
                this._queueRealtimeRefresh(true, true);
                return;
            }
            if (this._calendarEntityIds.has(entityId) || this._isAuroraFilterEntity(entityId)) {
                this._queueRealtimeRefresh(true, false);
                return;
            }
            if (this._config.show_weather && entityId === this._weatherEntity) {
                this._queueRealtimeRefresh(false, true);
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("resize", this._scheduleGridHeightSync);
        document.addEventListener("click", this._handleDocumentClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("resize", this._scheduleGridHeightSync);
        document.removeEventListener("click", this._handleDocumentClick);
        if (this._gridHeightRaf) {
            cancelAnimationFrame(this._gridHeightRaf);
        }
        if (this._gridHeightRetry) {
            window.clearTimeout(this._gridHeightRetry);
        }
        this._clearRealtimeRefreshTimer();
        this._clearDialogCloseTimer();
        this._teardownRealtimeSubscriptions();
    }
    firstUpdated() {
        this._scheduleGridHeightSync();
    }
    _scheduleSettledGridHeightSync() {
        this._scheduleGridHeightSync();
        if (this._gridHeightRetry) {
            window.clearTimeout(this._gridHeightRetry);
        }
        this._gridHeightRetry = window.setTimeout(() => {
            this._gridHeightRetry = undefined;
            this._scheduleGridHeightSync();
        }, 120);
    }
    _syncGridHeightToViewport() {
        const mode = this._config?.height_mode || "auto";
        if (mode === "ha") {
            this.style.removeProperty("--aurora-grid-height");
            return;
        }
        if (mode === "natural") {
            this.style.setProperty("--aurora-grid-height", "auto");
            return;
        }
        if (mode === "fixed") {
            this.style.setProperty("--aurora-grid-height", this._safeCssHeight(this._config.fixed_height));
            return;
        }
        const area = this.shadowRoot?.querySelector(".calendar-area");
        if (!area)
            return;
        const bottomGap = 16;
        const available = window.innerHeight - area.getBoundingClientRect().top - bottomGap;
        const gridH = Math.max(320, Math.floor(available));
        this.style.setProperty("--aurora-grid-height", `${gridH}px`);
    }
    // ------------------------------------------------------------------
    // HA card lifecycle
    // ------------------------------------------------------------------
    setConfig(config) {
        const integration = config.integration || "aurora_calendar";
        this._config = { ...CONFIG_DEFAULTS, ...config, integration };
        this._storageKey = `aurora-calendar-${integration}`;
    }
    getCardSize() {
        return 6;
    }
    getGridOptions() {
        return {
            columns: "full",
            min_columns: 6,
            rows: 12,
            min_rows: 6,
        };
    }
    static getConfigElement() {
        return document.createElement("aurora-calendar-card-editor");
    }
    static getStubConfig() {
        return { type: "custom:aurora-calendar-card", integration: "aurora_calendar", ...CONFIG_DEFAULTS };
    }
    // hass is set by HA on every state change — init view only once, then keep events fresh
    updated(changed) {
        this._scheduleSettledGridHeightSync();
        if (changed.has("hass") && this.hass && !this._defaultViewLoaded) {
            this._initViewMode();
            this._defaultViewLoaded = true;
        }
        if (this.hass && this._config) {
            this._syncRealtimeSubscriptions();
            this._resolveBackgroundMediaIfNeeded();
            const key = this._fetchKey;
            if (key !== this._lastFetchKey) {
                this._lastFetchKey = key;
                void this._fetchEvents();
            }
            const weatherKey = this._weatherFetchKey;
            if (weatherKey !== this._lastWeatherFetchKey) {
                this._lastWeatherFetchKey = weatherKey;
                void this._fetchWeather();
            }
        }
    }
    // ------------------------------------------------------------------
    // View mode initialisation (localStorage → HA default → "Month")
    // ------------------------------------------------------------------
    _initViewMode() {
        const persisted = loadPersistedView(this._storageKey);
        if (persisted) {
            this._viewMode = persisted;
            return;
        }
        const selectId = `select.${this._config.integration}_view_mode`;
        const haDefault = this.hass?.states[selectId]?.state;
        if (haDefault && VIEW_MODES.includes(haDefault)) {
            this._viewMode = haDefault;
        }
    }
    // ------------------------------------------------------------------
    // Derived data from HA entities
    // ------------------------------------------------------------------
    get _calendars() {
        const persons = this._persons;
        return (this._configAttrs.calendars ?? []).map((cal) => {
            const fallbackPerson = cal.entity_id
                .replace(/^calendar\./, "")
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            const person = cal.person || fallbackPerson;
            const personInfo = persons.find((p) => p.person === person);
            return {
                ...cal,
                person,
                color: personInfo?.color || cal.color || "#3B82F6",
                avatar: personInfo?.avatar || cal.avatar || "",
            };
        });
    }
    get _writableCalendars() {
        return this._calendars.filter((calendar) => this._supportsCalendarFeature(calendar.entity_id, CALENDAR_FEATURE_CREATE_EVENT));
    }
    _calendarByEntity(entityId) {
        return this._calendars.find((calendar) => calendar.entity_id === entityId);
    }
    _draftColor(draft) {
        if (!draft)
            return "var(--primary-color)";
        return this._calendarByEntity(draft.calendarEntity)?.color || "var(--primary-color)";
    }
    _personAvatarMarkup(person, color, avatarUrl) {
        const initial = (person || "?").charAt(0).toUpperCase();
        return b `
      <span class="event-dialog-avatar" style="--person-color: ${color}">
        ${avatarUrl
            ? b `<img src="${avatarUrl}" alt="${person}" />`
            : b `${initial}`}
      </span>
    `;
    }
    _eventAvatarMarkup(event) {
        const calendar = this._calendarByEntity(event.calendarEntity);
        return this._personAvatarMarkup(event.person, calendar?.color || event.color, calendar?.avatar);
    }
    get _fetchKey() {
        const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
        const cals = this._calendars.map((c) => c.entity_id).sort().join(",");
        return `${start.toISOString()}|${end.toISOString()}|${cals}`;
    }
    get _filteredEvents() {
        return this._events.filter((e) => this._filters[e.person] !== false);
    }
    get _weatherEntity() {
        return String(this._configAttrs.weather_entity ?? "");
    }
    get _weatherFetchKey() {
        const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
        return [
            this._config.show_weather ? "show" : "hide",
            this._weatherEntity,
            start.toISOString(),
            end.toISOString(),
        ].join("|");
    }
    async _fetchEvents() {
        const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
        const calendars = this._calendars;
        const requestId = ++this._fetchRequestId;
        if (calendars.length === 0) {
            this._events = [];
            this._loading = false;
            return;
        }
        this._loading = true;
        try {
            const events = await fetchEventsForRange(this.hass, calendars, start, end);
            if (requestId === this._fetchRequestId) {
                this._events = events;
            }
        }
        finally {
            if (requestId === this._fetchRequestId) {
                this._loading = false;
            }
        }
    }
    _syncRealtimeSubscriptions() {
        const connection = this.hass?.connection;
        if (!connection || connection === this._subscribedConnection)
            return;
        this._teardownRealtimeSubscriptions();
        this._subscribedConnection = connection;
        void connection
            .subscribeEvents(this._handleStateChanged, "state_changed")
            .then((unsubscribe) => {
            if (this._subscribedConnection === connection) {
                this._unsubscribeStateChanged = unsubscribe;
            }
            else {
                unsubscribe();
            }
        });
    }
    _teardownRealtimeSubscriptions() {
        this._unsubscribeStateChanged?.();
        this._unsubscribeStateChanged = undefined;
        this._subscribedConnection = undefined;
    }
    _queueRealtimeRefresh(events, weather, delay = 350) {
        this._pendingEventsRefresh || (this._pendingEventsRefresh = events);
        this._pendingWeatherRefresh || (this._pendingWeatherRefresh = weather);
        this._clearRealtimeRefreshTimer();
        this._realtimeRefreshTimer = window.setTimeout(() => {
            this._realtimeRefreshTimer = undefined;
            const refreshEvents = this._pendingEventsRefresh;
            const refreshWeather = this._pendingWeatherRefresh;
            this._pendingEventsRefresh = false;
            this._pendingWeatherRefresh = false;
            if (refreshEvents) {
                this._lastFetchKey = "";
                void this._fetchEvents();
            }
            if (refreshWeather) {
                this._lastWeatherFetchKey = "";
                void this._fetchWeather();
            }
        }, delay);
    }
    _clearRealtimeRefreshTimer() {
        if (!this._realtimeRefreshTimer)
            return;
        window.clearTimeout(this._realtimeRefreshTimer);
        this._realtimeRefreshTimer = undefined;
    }
    _clearDialogCloseTimer() {
        if (!this._dialogCloseTimer)
            return;
        window.clearTimeout(this._dialogCloseTimer);
        this._dialogCloseTimer = undefined;
    }
    _closeDialogWithTransition(kind, afterClose) {
        if (this._closingDialog)
            return;
        this._clearDialogCloseTimer();
        this._closingDialog = kind;
        this._dialogCloseTimer = window.setTimeout(() => {
            this._dialogCloseTimer = undefined;
            afterClose();
            this._closingDialog = null;
        }, 170);
    }
    get _configSensorEntityId() {
        return `sensor.${this._config.integration}_events`;
    }
    get _calendarEntityIds() {
        return new Set(this._calendars.map((calendar) => calendar.entity_id));
    }
    _isAuroraFilterEntity(entityId) {
        return entityId.startsWith(`switch.${this._config.integration}_filter_`);
    }
    async _fetchWeather() {
        if (!this._config.show_weather || !this._weatherEntity) {
            this._weatherByDate = {};
            return;
        }
        this._weatherByDate = await fetchDailyWeather(this.hass, this._weatherEntity);
    }
    _daysInRange(start, end) {
        const days = [];
        const cur = new Date(start);
        while (cur <= end) {
            days.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
        return days;
    }
    get _configAttrs() {
        const id = `sensor.${this._config.integration}_events`;
        return (this.hass?.states[id]?.attributes ?? {});
    }
    get _persons() {
        return this._configAttrs.persons ?? [];
    }
    get _filters() {
        return (this._configAttrs.filters ?? {});
    }
    get _timeGridEvents() {
        return this._filteredEvents.map((event) => ({
            ...event,
            canDragEdit: !event.all_day && !event.recurrenceId && this._canUpdateEvent(event),
        }));
    }
    // ------------------------------------------------------------------
    // User actions (all local — no HA service calls for navigation)
    // ------------------------------------------------------------------
    _navigate(dir) {
        this._offset += dir;
    }
    _resetToToday() {
        this._offset = 0;
    }
    _selectView(mode) {
        this._viewMode = mode;
        this._offset = 0;
        this._viewMenuOpen = false;
        persistView(this._storageKey, mode);
    }
    _toggleFilter(person) {
        this.hass.callService("aurora_calendar", "toggle_filter", { person });
    }
    _handleWeekEmptyClick() {
        this._navigate(1);
    }
    _toggleFilterMenu() {
        this._filterMenuOpen = !this._filterMenuOpen;
        this._viewMenuOpen = false;
        this._jumpMenuOpen = false;
    }
    _toggleViewMenu() {
        this._viewMenuOpen = !this._viewMenuOpen;
        this._filterMenuOpen = false;
        this._jumpMenuOpen = false;
    }
    _toggleJumpMenu() {
        this._jumpMenuOpen = !this._jumpMenuOpen;
        this._filterMenuOpen = false;
        this._viewMenuOpen = false;
    }
    _jumpMonthValue() {
        const today = localToday();
        const ref = new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
        return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
    }
    _jumpDateValue(start) {
        const active = this._viewMode === "Today" || this._viewMode === "Next 7 Days"
            ? start
            : localToday();
        return this._dateInputValue(active);
    }
    _handleJumpMonth(event) {
        const value = event.target.value;
        if (!value)
            return;
        const [year, month] = value.split("-").map(Number);
        if (!year || !month)
            return;
        const today = localToday();
        this._offset = (year - today.getFullYear()) * 12 + (month - 1 - today.getMonth());
        this._jumpMenuOpen = false;
    }
    _handleJumpDate(event) {
        const value = event.target.value;
        if (!value)
            return;
        const selected = new Date(`${value}T00:00:00`);
        if (Number.isNaN(selected.getTime()))
            return;
        const today = localToday();
        if (this._viewMode === "Today") {
            this._offset = this._dayDiff(today, selected);
        }
        else if (this._viewMode === "Next 7 Days") {
            this._offset = Math.trunc(this._dayDiff(today, selected) / 7);
        }
        else if (this._viewMode === "Week") {
            const currentStart = getDateRange("Week", 0, this._config.week_start)[0];
            const selectedStart = this._startOfWeek(selected);
            this._offset = Math.trunc(this._dayDiff(currentStart, selectedStart) / 7);
        }
        else if (this._viewMode === "Biweek") {
            const currentStart = getDateRange("Biweek", 0, this._config.week_start)[0];
            const selectedStart = this._startOfWeek(selected);
            this._offset = Math.trunc(this._dayDiff(currentStart, selectedStart) / 14);
        }
        this._jumpMenuOpen = false;
    }
    _handleJumpInputClick(event) {
        event.stopPropagation();
    }
    _handleEventOpen(event) {
        this._clearDialogCloseTimer();
        this._closingDialog = null;
        this._eventActionError = "";
        this._deleteConfirmOpen = false;
        this._editDialogOpen = false;
        this._editDraft = null;
        this._selectedEvent = event.detail.event;
    }
    _closeEventDialog() {
        if (this._deletingEvent)
            return;
        this._closeDialogWithTransition("event", () => {
            this._eventActionError = "";
            this._deleteConfirmOpen = false;
            this._editDialogOpen = false;
            this._editDraft = null;
            this._selectedEvent = null;
        });
    }
    _supportsCalendarFeature(entityId, feature) {
        const raw = this.hass?.states[entityId]?.attributes?.supported_features;
        const features = typeof raw === "number" ? raw : Number(raw);
        return Number.isFinite(features) && (features & feature) === feature;
    }
    _defaultCreateDate() {
        const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
        const today = localToday();
        if (today >= start && today <= end)
            return today;
        if (this._viewMode === "Month") {
            return new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
        }
        return start;
    }
    _defaultCreateTimes(baseDate) {
        const today = localToday();
        if (this._sameLocalDay(baseDate, today)) {
            const now = new Date();
            const startHour = Math.min(22, Math.max(8, now.getHours() + 1));
            return [`${String(startHour).padStart(2, "0")}:00`, `${String(startHour + 1).padStart(2, "0")}:00`];
        }
        return ["09:00", "10:00"];
    }
    _sameLocalDay(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }
    _openCreateDialog() {
        this._clearDialogCloseTimer();
        this._closingDialog = null;
        const calendar = this._writableCalendars[0] || this._calendars[0];
        const baseDate = this._defaultCreateDate();
        const [startTime, endTime] = this._defaultCreateTimes(baseDate);
        const date = this._dateInputValue(baseDate);
        this._createDraft = {
            calendarEntity: calendar?.entity_id || "",
            title: "",
            allDay: false,
            startDate: date,
            endDate: date,
            startTime,
            endTime,
            location: "",
            description: "",
        };
        this._eventActionError = "";
        this._createDialogOpen = true;
        this._filterMenuOpen = false;
        this._viewMenuOpen = false;
        this._jumpMenuOpen = false;
    }
    _closeCreateDialog() {
        if (this._savingEvent)
            return;
        this._closeDialogWithTransition("create", () => {
            this._eventActionError = "";
            this._createCalendarMenuOpen = false;
            this._createDialogOpen = false;
            this._createDraft = null;
        });
    }
    _addDays(date, days) {
        const next = new Date(date);
        next.setDate(next.getDate() + days);
        return next;
    }
    _addDaysToDateInput(value, days) {
        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime()))
            return value;
        return this._dateInputValue(this._addDays(date, days));
    }
    _normalizeAllDayDraft(draft) {
        if (!draft.allDay || !draft.startDate)
            return draft;
        if (!draft.endDate || draft.endDate < draft.startDate) {
            return { ...draft, endDate: draft.startDate };
        }
        return draft;
    }
    _updateDraft(draft, field, value) {
        const next = { ...draft, [field]: value };
        return this._normalizeAllDayDraft(next);
    }
    _updateCreateDraft(field, value) {
        if (!this._createDraft)
            return;
        this._eventActionError = "";
        this._createDraft = this._updateDraft(this._createDraft, field, value);
    }
    _updateEditDraft(field, value) {
        if (!this._editDraft)
            return;
        this._eventActionError = "";
        this._editDraft = this._updateDraft(this._editDraft, field, value);
    }
    _eventActionErrorMessage(error) {
        if (error instanceof Error && error.message)
            return error.message;
        if (typeof error === "object" && error && "message" in error) {
            return String(error.message || "Calendar action failed");
        }
        return "Calendar action failed";
    }
    _toggleCreateCalendarMenu() {
        this._createCalendarMenuOpen = !this._createCalendarMenuOpen;
    }
    _selectCreateCalendar(entityId) {
        this._updateCreateDraft("calendarEntity", entityId);
        this._createCalendarMenuOpen = false;
    }
    async _handleCreateSubmit(event) {
        event.preventDefault();
        const draft = this._createDraft;
        if (!draft || this._savingEvent)
            return;
        const summary = draft.title.trim();
        if (!summary || !draft.calendarEntity)
            return;
        const data = { summary };
        const description = draft.description.trim();
        const location = draft.location.trim();
        if (description)
            data.description = description;
        if (location)
            data.location = location;
        if (draft.allDay) {
            if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) {
                this._eventActionError = "End date must be on or after start date.";
                return;
            }
            data.start_date = draft.startDate;
            data.end_date = this._addDaysToDateInput(draft.endDate, 1);
        }
        else {
            const startDateTime = `${draft.startDate} ${draft.startTime}:00`;
            const endDateTime = `${draft.endDate} ${draft.endTime}:00`;
            if (!draft.startDate || !draft.endDate || !draft.startTime || !draft.endTime || endDateTime <= startDateTime) {
                this._eventActionError = "End time must be after start time.";
                return;
            }
            data.start_date_time = startDateTime;
            data.end_date_time = endDateTime;
        }
        this._savingEvent = true;
        this._eventActionError = "";
        try {
            await this.hass.callService("calendar", "create_event", data, {
                entity_id: draft.calendarEntity,
            });
            this._createDialogOpen = false;
            this._createDraft = null;
            this._lastFetchKey = "";
            await this._fetchEvents();
        }
        catch (error) {
            this._eventActionError = this._eventActionErrorMessage(error);
        }
        finally {
            this._savingEvent = false;
        }
    }
    _canDeleteEvent(event) {
        return Boolean(event.uid) &&
            this._supportsCalendarFeature(event.calendarEntity, CALENDAR_FEATURE_DELETE_EVENT);
    }
    _canUpdateEvent(event) {
        return Boolean(event.uid) &&
            this._supportsCalendarFeature(event.calendarEntity, CALENDAR_FEATURE_UPDATE_EVENT);
    }
    _openEditDialog() {
        const event = this._selectedEvent;
        if (!event)
            return;
        if (!this._canUpdateEvent(event)) {
            this._eventActionError = "This calendar event cannot be edited from Aurora.";
            return;
        }
        const start = this._eventDate(event.start, event.all_day);
        const end = this._eventDate(event.end, event.all_day);
        const endDateInput = event.all_day
            ? this._addDaysToDateInput(this._dateInputValue(end), -1)
            : this._dateInputValue(end);
        this._editDraft = this._normalizeAllDayDraft({
            calendarEntity: event.calendarEntity,
            title: event.title,
            allDay: event.all_day,
            startDate: this._dateInputValue(start),
            endDate: endDateInput,
            startTime: this._timeInputValue(start),
            endTime: this._timeInputValue(end),
            location: event.location || "",
            description: event.description || "",
        });
        this._eventActionError = "";
        this._deleteConfirmOpen = false;
        this._clearDialogCloseTimer();
        this._closingDialog = null;
        this._editDialogOpen = true;
    }
    _closeEditDialog() {
        if (this._savingEvent)
            return;
        this._closeDialogWithTransition("edit", () => {
            this._eventActionError = "";
            this._editDialogOpen = false;
            this._editDraft = null;
        });
    }
    _openDeleteConfirm(locale) {
        const event = this._selectedEvent;
        if (!event)
            return;
        if (!this._canDeleteEvent(event)) {
            this._eventActionError = t(locale, "deleteEventUnavailable");
            return;
        }
        this._eventActionError = "";
        this._deleteConfirmOpen = true;
    }
    _cancelDeleteConfirm() {
        if (this._deletingEvent)
            return;
        this._deleteConfirmOpen = false;
    }
    async _deleteSelectedEvent(locale) {
        const event = this._selectedEvent;
        if (!event || this._deletingEvent)
            return;
        if (!this._canDeleteEvent(event) || !event.uid) {
            this._eventActionError = t(locale, "deleteEventUnavailable");
            return;
        }
        const data = { uid: event.uid };
        if (event.recurrenceId) {
            data.recurrence_id = event.recurrenceId;
        }
        this._deletingEvent = true;
        this._eventActionError = "";
        try {
            await this.hass.callWS({
                type: "calendar/event/delete",
                entity_id: event.calendarEntity,
                ...data,
            });
            this._deleteConfirmOpen = false;
            this._selectedEvent = null;
            this._lastFetchKey = "";
            await this._fetchEvents();
        }
        catch (error) {
            this._eventActionError = this._eventActionErrorMessage(error);
        }
        finally {
            this._deletingEvent = false;
        }
    }
    async _handleEditSubmit(event) {
        event.preventDefault();
        const selected = this._selectedEvent;
        const draft = this._editDraft;
        if (!selected || !draft || !selected.uid || this._savingEvent)
            return;
        const eventPayload = this._eventPayloadFromDraft(draft, true);
        if (!eventPayload)
            return;
        eventPayload.description = draft.description.trim();
        eventPayload.location = draft.location.trim();
        const data = {
            type: "calendar/event/update",
            entity_id: selected.calendarEntity,
            uid: selected.uid,
            event: eventPayload,
        };
        if (selected.recurrenceId) {
            data.recurrence_id = selected.recurrenceId;
        }
        this._savingEvent = true;
        this._eventActionError = "";
        try {
            await this.hass.callWS(data);
            this._editDialogOpen = false;
            this._editDraft = null;
            this._selectedEvent = null;
            this._lastFetchKey = "";
            await this._fetchEvents();
        }
        catch (error) {
            this._eventActionError = this._eventActionErrorMessage(error);
        }
        finally {
            this._savingEvent = false;
        }
    }
    async _handleEventMove(event) {
        const calendarEvent = event.detail.event;
        if (!calendarEvent.uid || !this._canUpdateEvent(calendarEvent))
            return;
        const payload = {
            summary: calendarEvent.title,
            dtstart: event.detail.start,
            dtend: event.detail.end,
            description: calendarEvent.description || "",
            location: calendarEvent.location || "",
        };
        const data = {
            type: "calendar/event/update",
            entity_id: calendarEvent.calendarEntity,
            uid: calendarEvent.uid,
            event: payload,
        };
        this._loading = true;
        try {
            await this.hass.callWS(data);
            this._lastFetchKey = "";
            await this._fetchEvents();
        }
        catch (error) {
            console.error("Aurora Calendar: failed to move event", error);
        }
        finally {
            this._loading = false;
        }
    }
    _startOfWeek(date) {
        const startDay = this._config.week_start === "monday" ? 1 : 0;
        const d = new Date(date);
        const diff = (d.getDay() - startDay + 7) % 7;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    _dayDiff(start, end) {
        return Math.round((end.getTime() - start.getTime()) / 86400000);
    }
    _dateInputValue(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }
    _timeInputValue(date) {
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    _eventPayloadFromDraft(draft, useIsoSeparator = false) {
        const summary = draft.title.trim();
        if (!summary || !draft.calendarEntity)
            return null;
        const payload = { summary };
        const description = draft.description.trim();
        const location = draft.location.trim();
        if (description)
            payload.description = description;
        if (location)
            payload.location = location;
        if (draft.allDay) {
            if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) {
                this._eventActionError = "End date must be on or after start date.";
                return null;
            }
            payload.dtstart = draft.startDate;
            payload.dtend = this._addDaysToDateInput(draft.endDate, 1);
            return payload;
        }
        const separator = useIsoSeparator ? "T" : " ";
        const startDateTime = `${draft.startDate}${separator}${draft.startTime}:00`;
        const endDateTime = `${draft.endDate}${separator}${draft.endTime}:00`;
        if (!draft.startDate || !draft.endDate || !draft.startTime || !draft.endTime || endDateTime <= startDateTime) {
            this._eventActionError = "End time must be after start time.";
            return null;
        }
        payload.dtstart = startDateTime;
        payload.dtend = endDateTime;
        return payload;
    }
    _eventDateLabel(event, locale) {
        const start = this._eventDate(event.start, event.all_day);
        return new Intl.DateTimeFormat(locale, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(start);
    }
    _eventTimeLabel(event, locale) {
        if (event.all_day)
            return t(locale, "allDayLabel");
        const start = this._eventDate(event.start, false);
        const end = this._eventDate(event.end, false);
        const formatter = new Intl.DateTimeFormat(locale, {
            hour: "numeric",
            minute: "2-digit",
        });
        return `${formatter.format(start)} - ${formatter.format(end)}`;
    }
    _eventDate(value, allDay) {
        return new Date(allDay && !value.includes("T") ? `${value}T00:00:00` : value);
    }
    _renderEventDialog(locale) {
        const event = this._selectedEvent;
        if (!event)
            return A;
        const textColor = this._contrastText(event.color);
        const canDelete = this._canDeleteEvent(event);
        const canUpdate = this._canUpdateEvent(event);
        return b `
      <div class="event-dialog-backdrop ${this._closingDialog === "event" ? "closing" : ""}" @click=${this._closeEventDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${event.color}; --event-text-color: ${textColor};"
          role="dialog"
          aria-modal="true"
          aria-label=${event.title}
          @click=${(e) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-text"></ha-icon>
            <h2>${event.title}</h2>
            <button class="create-dialog-close" @click=${this._closeEventDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <div class="create-form event-view-form">
            <div class="form-notice event-owner-strip">
              ${this._eventAvatarMarkup(event)}
              <span>${event.calendarName || event.person}</span>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:calendar"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "date")}</span>
                <span class="detail-value">${this._eventDateLabel(event, locale)}</span>
              </div>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "time")}</span>
                <span class="detail-value">${this._eventTimeLabel(event, locale)}</span>
              </div>
            </div>
            <div class="detail-row">
              <ha-icon icon="mdi:calendar-account"></ha-icon>
              <div>
                <span class="detail-label">${t(locale, "calendar")}</span>
                <span class="detail-value">${event.calendarName || event.calendarEntity}</span>
              </div>
            </div>
            ${event.location ? b `
              <div class="detail-row">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon>
                <div>
                  <span class="detail-label">${t(locale, "location")}</span>
                  <span class="detail-value">${event.location}</span>
                </div>
              </div>
            ` : A}
            ${event.description ? b `
              <div class="detail-section">
                <span class="detail-label">${t(locale, "description")}</span>
                <p>${event.description}</p>
              </div>
            ` : A}
            ${this._eventActionError ? b `
              <div class="event-action-error">${this._eventActionError}</div>
            ` : A}
            ${this._deleteConfirmOpen ? b `
              <div class="delete-confirm-panel">
                <div>
                  <strong>${t(locale, "deleteEventConfirm")}</strong>
                  <span>${event.title}</span>
                </div>
                <div class="event-dialog-actions">
                  <button
                    class="secondary-action"
                    @click=${this._cancelDeleteConfirm}
                    ?disabled=${this._deletingEvent}
                  >
                    ${t(locale, "cancel")}
                  </button>
                  <button
                    class="danger-action"
                    @click=${() => this._deleteSelectedEvent(locale)}
                    ?disabled=${this._deletingEvent}
                  >
                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                    <span>${this._deletingEvent ? t(locale, "loading") : t(locale, "deleteEvent")}</span>
                  </button>
                </div>
              </div>
            ` : b `
              <div class="event-dialog-actions">
                <button
                  class="secondary-action"
                  @click=${this._openEditDialog}
                  ?disabled=${this._deletingEvent || !canUpdate}
                  title=${t(locale, "editEvent")}
                >
                  <ha-icon icon="mdi:calendar-edit"></ha-icon>
                  <span>${t(locale, "editEvent")}</span>
                </button>
                <button
                  class="danger-action"
                  @click=${() => this._openDeleteConfirm(locale)}
                  ?disabled=${this._deletingEvent || !canDelete}
                  title=${canDelete ? t(locale, "deleteEvent") : t(locale, "deleteEventUnavailable")}
                >
                  <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                  <span>${t(locale, "deleteEvent")}</span>
                </button>
              </div>
            `}
          </div>
        </section>
      </div>
    `;
    }
    _renderEditDialog(locale) {
        const selected = this._selectedEvent;
        if (!this._editDialogOpen || !this._editDraft || !selected)
            return A;
        const draft = this._editDraft;
        return b `
      <div class="event-dialog-backdrop ${this._closingDialog === "edit" ? "closing" : ""}" @click=${this._closeEditDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${selected.color}; --event-text-color: ${this._contrastText(selected.color)};"
          role="dialog"
          aria-modal="true"
          aria-label=${t(locale, "editEvent")}
          @click=${(e) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-edit"></ha-icon>
            <h2>${t(locale, "editEvent")}</h2>
            <button class="create-dialog-close" @click=${this._closeEditDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <form class="create-form" @submit=${this._handleEditSubmit}>
            <div class="form-notice event-owner-strip">
              ${this._eventAvatarMarkup(selected)}
              <span>${selected.calendarName || selected.calendarEntity}</span>
            </div>

            <label>
              <span>${t(locale, "title")}</span>
              <input
                type="text"
                .value=${draft.title}
                required
                @input=${(event) => this._updateEditDraft("title", event.target.value)}
              />
            </label>

            <label class="check-row">
              <input
                type="checkbox"
                .checked=${draft.allDay}
                @change=${(event) => this._updateEditDraft("allDay", event.target.checked)}
              />
              <span>${t(locale, "allDayLabel")}</span>
            </label>

            ${draft.allDay ? b `
              <div class="form-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    @input=${(event) => this._updateEditDraft("startDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    @input=${(event) => this._updateEditDraft("endDate", event.target.value)}
                  />
                </label>
              </div>
            ` : b `
              <div class="form-grid date-time-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    @input=${(event) => this._updateEditDraft("startDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    @input=${(event) => this._updateEditDraft("endDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="time"
                    .value=${draft.startTime}
                    required
                    @input=${(event) => this._updateEditDraft("startTime", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="time"
                    .value=${draft.endTime}
                    required
                    @input=${(event) => this._updateEditDraft("endTime", event.target.value)}
                  />
                </label>
              </div>
            `}

            <label>
              <span>${t(locale, "location")}</span>
              <input
                type="text"
                .value=${draft.location}
                @input=${(event) => this._updateEditDraft("location", event.target.value)}
              />
            </label>

            <label>
              <span>${t(locale, "description")}</span>
              <textarea
                .value=${draft.description}
                @input=${(event) => this._updateEditDraft("description", event.target.value)}
              ></textarea>
            </label>

            ${this._eventActionError ? b `
              <div class="event-action-error">${this._eventActionError}</div>
            ` : A}

            <div class="create-form-actions">
              <button type="button" class="secondary-action" @click=${this._closeEditDialog}>
                ${t(locale, "cancel")}
              </button>
              <button type="submit" class="primary-action" ?disabled=${this._savingEvent}>
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
                <span>${this._savingEvent ? t(locale, "loading") : t(locale, "updateEvent")}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    `;
    }
    _renderCreateDialog(locale) {
        if (!this._createDialogOpen || !this._createDraft)
            return A;
        const draft = this._createDraft;
        const writableCalendars = this._writableCalendars;
        const canCreate = writableCalendars.length > 0;
        return b `
      <div class="event-dialog-backdrop ${this._closingDialog === "create" ? "closing" : ""}" @click=${this._closeCreateDialog}>
        <section
          class="event-dialog create-dialog themed-dialog"
          style="--event-color: ${this._draftColor(draft)}; --event-text-color: ${this._contrastText(this._draftColor(draft))};"
          role="dialog"
          aria-modal="true"
          aria-label=${t(locale, "createEvent")}
          @click=${(e) => e.stopPropagation()}
        >
          <header class="create-dialog-header">
            <ha-icon icon="mdi:calendar-plus"></ha-icon>
            <h2>${t(locale, "createEvent")}</h2>
            <button class="create-dialog-close" @click=${this._closeCreateDialog} aria-label=${t(locale, "close")}>x</button>
          </header>

          <form class="create-form" @submit=${this._handleCreateSubmit}>
            ${canCreate ? b `
              <div class="create-calendar-picker">
                <span class="form-field-label">${t(locale, "calendar")}</span>
                <button
                  type="button"
                  class="create-calendar-trigger ${this._createCalendarMenuOpen ? "open" : ""}"
                  @click=${this._toggleCreateCalendarMenu}
                  aria-label=${t(locale, "calendar")}
                  aria-expanded=${this._createCalendarMenuOpen}
                >
                  ${(() => {
            const selected = this._calendarByEntity(draft.calendarEntity) || writableCalendars[0];
            return b `
                      <span class="option-avatar" style="--person-color: ${selected?.color || "var(--primary-color)"}">
                        ${selected?.avatar
                ? b `<img src="${selected.avatar}" alt="${selected.person}" />`
                : b `${(selected?.person || "?").charAt(0).toUpperCase()}`}
                      </span>
                      <span class="option-name">${selected?.person || selected?.entity_id || t(locale, "calendar")}</span>
                      <span class="chevron">⌄</span>
                    `;
        })()}
                </button>
                ${this._createCalendarMenuOpen ? b `
                  <div class="create-calendar-menu" role="menu">
                    ${writableCalendars.map((calendar) => b `
                      <button
                        type="button"
                        class="filter-option ${calendar.entity_id === draft.calendarEntity ? "active" : ""}"
                        style="--person-color: ${calendar.color}"
                        @click=${() => this._selectCreateCalendar(calendar.entity_id)}
                        role="menuitemradio"
                        aria-checked=${calendar.entity_id === draft.calendarEntity}
                      >
                        <span class="option-avatar">
                          ${calendar.avatar
            ? b `<img src="${calendar.avatar}" alt="${calendar.person}" />`
            : b `${(calendar.person || calendar.entity_id).charAt(0).toUpperCase()}`}
                        </span>
                        <span class="option-name">${calendar.person || calendar.entity_id}</span>
                        <span class="option-check">${calendar.entity_id === draft.calendarEntity ? "✓" : ""}</span>
                      </button>
                    `)}
                  </div>
                ` : A}
              </div>
            ` : b `
              <div class="form-notice">${t(locale, "noWritableCalendars")}</div>
            `}

            <label>
              <span>${t(locale, "title")}</span>
              <input
                type="text"
                .value=${draft.title}
                required
                ?disabled=${!canCreate}
                @input=${(event) => this._updateCreateDraft("title", event.target.value)}
              />
            </label>

            <label class="check-row">
              <input
                type="checkbox"
                .checked=${draft.allDay}
                ?disabled=${!canCreate}
                @change=${(event) => this._updateCreateDraft("allDay", event.target.checked)}
              />
              <span>${t(locale, "allDayLabel")}</span>
            </label>

            ${draft.allDay ? b `
              <div class="form-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("startDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("endDate", event.target.value)}
                  />
                </label>
              </div>
            ` : b `
              <div class="form-grid date-time-grid">
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="date"
                    .value=${draft.startDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("startDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="date"
                    .value=${draft.endDate}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("endDate", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "start")}</span>
                  <input
                    type="time"
                    .value=${draft.startTime}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("startTime", event.target.value)}
                  />
                </label>
                <label>
                  <span>${t(locale, "end")}</span>
                  <input
                    type="time"
                    .value=${draft.endTime}
                    required
                    ?disabled=${!canCreate}
                    @input=${(event) => this._updateCreateDraft("endTime", event.target.value)}
                  />
                </label>
              </div>
            `}

            <label>
              <span>${t(locale, "location")}</span>
              <input
                type="text"
                .value=${draft.location}
                ?disabled=${!canCreate}
                @input=${(event) => this._updateCreateDraft("location", event.target.value)}
              />
            </label>

            <label>
              <span>${t(locale, "description")}</span>
              <textarea
                .value=${draft.description}
                ?disabled=${!canCreate}
                @input=${(event) => this._updateCreateDraft("description", event.target.value)}
              ></textarea>
            </label>

            ${this._eventActionError ? b `
              <div class="event-action-error">${this._eventActionError}</div>
            ` : A}

            <div class="create-form-actions">
              <button type="button" class="secondary-action" @click=${this._closeCreateDialog}>
                ${t(locale, "cancel")}
              </button>
              <button type="submit" class="primary-action" ?disabled=${!canCreate || this._savingEvent}>
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
                <span>${this._savingEvent ? t(locale, "loading") : t(locale, "save")}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    `;
    }
    _contrastText(hex) {
        const c = hex.replace("#", "");
        if (c.length !== 6)
            return "#fff";
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#111827" : "#fff";
    }
    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    render() {
        if (!this._config || !this.hass)
            return b ``;
        const locale = localeFromHass(this.hass);
        const [start, end] = getDateRange(this._viewMode, this._offset, this._config.week_start);
        const title = getViewTitle(this._viewMode, this._offset, start, end, locale);
        const persons = this._persons;
        const filters = this._filters;
        const activePersons = persons.filter((p) => filters[p.person] !== false);
        const filterStack = activePersons.length ? activePersons.slice(0, 2) : [];
        const hiddenFilterCount = Math.max(0, activePersons.length - filterStack.length);
        const configured = persons.length > 0;
        const days = this._daysInRange(start, end);
        const weatherByDate = this._config.show_weather ? this._weatherByDate : {};
        const eventCountsByPerson = {};
        for (const e of this._events) {
            eventCountsByPerson[e.person] = (eventCountsByPerson[e.person] || 0) + 1;
        }
        // Reference month for the month grid (start may be prior-month padding)
        const today = localToday();
        const refDate = new Date(today.getFullYear(), today.getMonth() + this._offset, 1);
        const surfaceClasses = [
            "aurora-card",
            `height-${this._config.height_mode || "auto"}`,
            this._config.glass_background ? "glass" : "",
            this._backgroundImageSource ? "has-background-image" : "",
        ].filter(Boolean).join(" ");
        const shellClasses = `height-${this._config.height_mode || "auto"}`;
        return b `
      <ha-card class=${shellClasses}>
        <div class=${surfaceClasses} style=${this._appearanceStyle()}>

          <div class="top-toolbar">
            <div class="filter-control-wrap">
              <button
                class="filter-trigger ${this._filterMenuOpen ? "open" : ""}"
                @click=${this._toggleFilterMenu}
                aria-label=${t(locale, "calendarFilters")}
                aria-expanded=${this._filterMenuOpen}
              >
                <span class="avatar-stack">
                  ${filterStack.map((p) => b `
                    <span class="stack-avatar" style="--person-color: ${p.color}">
                      ${p.avatar
            ? b `<img src="${p.avatar}" alt="${p.person}" />`
            : b `${p.person[0].toUpperCase()}`}
                    </span>
                  `)}
                  ${hiddenFilterCount > 0 || activePersons.length === 0 ? b `
                    <span class="stack-avatar stack-more">${activePersons.length === 0 ? "0" : `+${hiddenFilterCount}`}</span>
                  ` : A}
                </span>
                <span class="filter-label">${t(locale, "filters")}</span>
                <span class="chevron">⌄</span>
              </button>

              ${this._filterMenuOpen ? b `
                <div class="filter-menu" role="menu">
                  <div class="menu-heading">${t(locale, "showCalendars")}</div>
                  ${persons.map((p) => {
            const active = filters[p.person] !== false;
            return b `
                      <button
                        class="filter-option ${active ? "active" : "inactive"}"
                        style="--person-color: ${p.color}"
                        @click=${() => this._toggleFilter(p.person)}
                        role="menuitemcheckbox"
                        aria-checked=${active}
                      >
                        <span class="option-avatar">
                          ${p.avatar
                ? b `<img src="${p.avatar}" alt="${p.person}" />`
                : b `${p.person[0].toUpperCase()}`}
                        </span>
                        <span class="option-name">${p.person}</span>
                        <span class="option-count">${eventCountsByPerson[p.person] || 0}</span>
                        <span class="option-check">${active ? "✓" : ""}</span>
                      </button>
                    `;
        })}
                </div>
              ` : A}
            </div>

            <span class="view-title">${title}</span>

            <div class="toolbar-actions">
              <div class="view-control-wrap">
                <button
                  class="view-trigger ${this._viewMenuOpen ? "open" : ""}"
                  @click=${this._toggleViewMenu}
                  aria-label=${t(locale, "calendarView")}
                  aria-expanded=${this._viewMenuOpen}
                >
                  <span>${viewModeLabel(locale, this._viewMode)}</span>
                  <span class="chevron">⌄</span>
                </button>
                ${this._viewMenuOpen ? b `
                  <div class="view-menu" role="menu">
                    ${VIEW_MODES.map((mode) => b `
                      <button
                        class="view-option ${this._viewMode === mode ? "active" : ""}"
                        @click=${() => this._selectView(mode)}
                        role="menuitemradio"
                        aria-checked=${this._viewMode === mode}
                      >
                        <ha-icon icon=${VIEW_ICONS[mode]}></ha-icon>
                        <span>${viewModeLabel(locale, mode)}</span>
                      </button>
                    `)}
                  </div>
                ` : A}
              </div>

              <div class="jump-control-wrap">
                <button
                  class="jump-trigger ${this._jumpMenuOpen ? "open" : ""}"
                  @click=${this._toggleJumpMenu}
                  aria-label=${t(locale, "jumpTo")}
                  aria-expanded=${this._jumpMenuOpen}
                >
                  <ha-icon icon="mdi:calendar-search"></ha-icon>
                  <span>${t(locale, "jumpTo")}</span>
                </button>
                ${this._jumpMenuOpen ? b `
                  <div class="jump-menu">
                    <label class="jump-field">
                      <span>${this._viewMode === "Month" ? viewModeLabel(locale, "Month") : t(locale, "jumpTo")}</span>
                      ${this._viewMode === "Month" ? b `
                        <input
                          type="month"
                          .value=${this._jumpMonthValue()}
                          @click=${this._handleJumpInputClick}
                          @change=${this._handleJumpMonth}
                        />
                      ` : b `
                        <input
                          type="date"
                          .value=${this._jumpDateValue(start)}
                          @click=${this._handleJumpInputClick}
                          @change=${this._handleJumpDate}
                        />
                      `}
                    </label>
                  </div>
                ` : A}
              </div>

              <div class="nav-controls" aria-label=${t(locale, "calendarNavigation")}>
                <button class="nav-btn" @click=${() => this._navigate(-1)} aria-label=${t(locale, "previous")}>
                  &#8249;
                </button>
                <button class="today-btn" @click=${this._resetToToday}>${t(locale, "today")}</button>
                <button class="nav-btn" @click=${() => this._navigate(1)} aria-label=${t(locale, "next")}>
                  &#8250;
                </button>
              </div>
            </div>
          </div>
          <!-- Calendar grid -->
          <div class="calendar-area">
            ${this._loading ? b `<div class="loading-badge">${t(locale, "loading")}</div>` : A}
            ${configured
            ? this._viewMode === "Month"
                ? b `
                    <aurora-calendar-month
                      .events=${this._filteredEvents}
                      .start=${start}
                      .end=${end}
                      .currentMonth=${refDate.getMonth()}
                      .currentYear=${refDate.getFullYear()}
                      .config=${this._config}
                      .dimOtherMonths=${true}
                      .weekStart=${this._config.week_start}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-month>
                  `
                : this._viewMode === "Biweek"
                    ? b `
                    <aurora-calendar-month
                      .events=${this._filteredEvents}
                      .start=${start}
                      .end=${end}
                      .currentMonth=${start.getMonth()}
                      .currentYear=${start.getFullYear()}
                      .config=${this._config}
                      .dimOtherMonths=${false}
                      .weekStart=${this._config.week_start}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-month>
                  `
                    : this._viewMode === "Week"
                        ? b `
                    <aurora-calendar-week-box
                      .events=${this._filteredEvents}
                      .days=${days}
                      .config=${this._config}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .persons=${persons}
                      @week-empty-click=${this._handleWeekEmptyClick}
                      @aurora-event-open=${this._handleEventOpen}
                    ></aurora-calendar-week-box>
                  `
                        : b `
                    <aurora-calendar-time-grid
                      .events=${this._timeGridEvents}
                      .days=${days}
                      .config=${this._config}
                      .viewMode=${this._viewMode}
                      .weatherByDate=${weatherByDate}
                      .weatherEntity=${this._weatherEntity}
                      .locale=${locale}
                      .autoScrollToNow=${this._viewMode === "Today" || this._viewMode === "Next 7 Days"}
                      .persons=${persons}
                      @aurora-event-open=${this._handleEventOpen}
                      @aurora-event-move=${this._handleEventMove}
                    ></aurora-calendar-time-grid>
                  `
            : b `
                  <div class="unconfigured">
                    <p>${t(locale, "unconfigured")}</p>
                  </div>
                `}
          </div>
          <button
            class="create-trigger floating-create-trigger"
            @click=${this._openCreateDialog}
            aria-label=${t(locale, "addEvent")}
            title=${t(locale, "addEvent")}
            ?disabled=${!configured}
          >
            <ha-icon icon="mdi:calendar-plus"></ha-icon>
          </button>
          ${this._renderEventDialog(locale)}
          ${this._renderEditDialog(locale)}
          ${this._renderCreateDialog(locale)}

        </div>
      </ha-card>
    `;
    }
    _appearanceStyle() {
        return [
            `--aurora-card-opacity: ${this._clamp(this._config.card_opacity, 0, 100)}%`,
            `--aurora-background-image: ${this._backgroundImageCss(this._backgroundImageSource)}`,
            `--aurora-background-opacity: ${this._clamp(this._config.background_image_opacity, 0, 100) / 100}`,
            `--aurora-background-blur: ${this._clamp(this._config.background_blur, 0, 20)}px`,
        ].join(";");
    }
    get _backgroundImageSource() {
        return this._resolvedBackgroundImage || this._config.background_image || "";
    }
    _resolveBackgroundMediaIfNeeded() {
        const media = this._config.background_media;
        const key = media ? `${media.media_content_id}|${media.media_content_type}` : "";
        if (key === this._backgroundMediaKey)
            return;
        this._backgroundMediaKey = key;
        this._resolvedBackgroundImage = "";
        const requestId = ++this._backgroundMediaRequestId;
        if (!media || !this.hass)
            return;
        void this.hass
            .callWS({
            type: "media_source/resolve_media",
            media_content_id: media.media_content_id,
        })
            .then((result) => {
            if (requestId !== this._backgroundMediaRequestId)
                return;
            const url = typeof result.url === "string" ? result.url : "";
            this._resolvedBackgroundImage = url.startsWith("/") && this.hass.hassUrl
                ? this.hass.hassUrl(url)
                : url;
        })
            .catch((err) => {
            console.warn("Aurora Calendar: failed to resolve background media", err);
        });
    }
    _backgroundImageCss(value) {
        const image = String(value || "").trim();
        if (!image)
            return "none";
        return `url("${image.replace(/["\\\n\r]/g, "")}")`;
    }
    _clamp(value, min, max) {
        if (typeof value !== "number" || Number.isNaN(value))
            return max;
        return Math.min(max, Math.max(min, value));
    }
    _safeCssHeight(value) {
        const height = String(value || "").trim();
        if (!height)
            return CONFIG_DEFAULTS.fixed_height;
        return CSS.supports("height", height) ? height : CONFIG_DEFAULTS.fixed_height;
    }
};
// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
AuroraCalendarCard.styles = i$3 `
    :host {
      --aurora-radius: 10px;
      --aurora-gap: 8px;
      --aurora-grid-height: 500px;
      display: block;
    }

    ha-card {
      overflow: hidden;
      background: transparent;
    }

    ha-card.height-ha {
      height: 100%;
    }

    .aurora-card {
      position: relative;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
      box-sizing: border-box;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }

    .aurora-card.height-ha {
      height: 100%;
      min-height: 0;
    }

    .aurora-card.height-natural {
      overflow: visible;
    }

    .aurora-card::before,
    .aurora-card::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .aurora-card::before {
      background-image: var(--aurora-background-image);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: var(--aurora-background-opacity);
      filter: blur(var(--aurora-background-blur));
      transform: scale(1.04);
    }

    .aurora-card::after {
      background: color-mix(
        in srgb,
        var(--card-background-color, #fff) var(--aurora-card-opacity),
        transparent
      );
    }

    .aurora-card.glass::after {
      background:
        radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--primary-color) 9%, transparent), transparent 38%),
        color-mix(in srgb, var(--card-background-color, #fff) var(--aurora-card-opacity), transparent);
      -webkit-backdrop-filter: blur(16px) saturate(1.08);
      backdrop-filter: blur(16px) saturate(1.08);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    }

    /* ---- Top toolbar ---- */
    .top-toolbar {
      position: relative;
      z-index: 30;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      grid-template-areas: "filters title actions";
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-shrink: 0;
      min-height: 40px;
    }

    .filter-control-wrap,
    .view-control-wrap,
    .jump-control-wrap {
      position: relative;
      min-width: 0;
    }

    .filter-control-wrap {
      grid-area: filters;
      justify-self: start;
    }

    .filter-trigger,
    .view-trigger,
    .jump-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      border-radius: 999px;
      border: 2px solid var(--divider-color, #ccc);
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      cursor: pointer;
      font-size: 0.88rem;
      font-weight: 800;
      color: var(--primary-text-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition: border-color 0.15s, background 0.15s, transform 0.15s;
    }

    .filter-trigger {
      gap: 10px;
      padding: 0 14px 0 7px;
      justify-self: start;
    }

    .view-trigger {
      gap: 10px;
      min-width: 142px;
      padding: 0 16px;
    }

    .filter-trigger:hover,
    .filter-trigger.open,
    .view-trigger:hover,
    .view-trigger.open,
    .jump-trigger:hover,
    .jump-trigger.open {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
    }

    .filter-trigger:active,
    .view-trigger:active,
    .jump-trigger:active {
      transform: scale(0.98);
    }

    .jump-trigger {
      gap: 8px;
      min-width: 116px;
      padding: 0 16px;
    }

    .jump-trigger ha-icon {
      width: 20px;
      height: 20px;
      color: var(--primary-color);
    }

    .avatar-stack {
      display: inline-flex;
      align-items: center;
      min-width: 60px;
      padding-left: 4px;
    }

    .stack-avatar {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -7px;
      border-radius: 50%;
      border: 2px solid var(--card-background-color, #111);
      background: var(--person-color, var(--primary-color));
      font-weight: 700;
      font-size: 0.72rem;
      color: #fff;
      overflow: hidden;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .stack-avatar:first-child {
      margin-left: 0;
    }

    .stack-avatar img,
    .option-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .stack-more {
      background: #e5e7eb;
      color: #1f2937;
      border-color: var(--card-background-color, #111);
    }

    .filter-label,
    .chevron {
      white-space: nowrap;
    }

    .chevron {
      color: var(--secondary-text-color);
      font-size: 1rem;
      line-height: 1;
      transform: translateY(-1px);
    }

    .filter-menu,
    .view-menu,
    .jump-menu {
      position: absolute;
      top: calc(100% + 10px);
      min-width: 220px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 18px;
      background: color-mix(in srgb, var(--card-background-color, #111) 96%, var(--primary-color) 4%);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.32);
      padding: 10px;
      z-index: 40;
    }

    .filter-menu {
      left: 0;
    }

    .view-menu {
      right: 0;
      min-width: 420px;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0;
      padding: 0;
      overflow: hidden;
    }

    .jump-menu {
      right: 0;
      width: 250px;
      padding: 14px;
    }

    .jump-field {
      display: flex;
      flex-direction: column;
      gap: 9px;
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .jump-field input {
      min-height: 46px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, transparent) 90%, var(--primary-color) 10%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 1rem;
      font-weight: 800;
      padding: 0 12px;
      outline: none;
      color-scheme: light dark;
    }

    .jump-field input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 20%, transparent);
    }

    .menu-heading {
      padding: 4px 8px 9px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }

    .filter-option,
    .view-option {
      width: 100%;
      min-height: 42px;
      display: flex;
      align-items: center;
      gap: 10px;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      text-align: left;
    }

    .filter-option {
      padding: 5px 8px 5px 5px;
    }

    .view-option {
      min-height: 76px;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      padding: 9px 10px;
      border-radius: 0;
      border-right: 1px solid color-mix(in srgb, var(--divider-color) 68%, transparent);
      font-size: 0.7rem;
      font-weight: 800;
      text-align: center;
    }

    .filter-option:hover,
    .filter-option.active,
    .view-option:hover,
    .view-option.active {
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .view-option:last-child {
      border-right: none;
    }

    .view-option ha-icon {
      width: 24px;
      height: 24px;
      color: var(--secondary-text-color);
    }

    .view-option.active {
      color: var(--primary-color);
    }

    .view-option.active ha-icon {
      color: var(--primary-color);
    }

    .filter-option.inactive {
      opacity: 0.58;
    }

    .option-avatar {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--person-color, var(--primary-color));
      color: #fff;
      font-size: 0.76rem;
      font-weight: 800;
      overflow: hidden;
      flex-shrink: 0;
    }

    .option-name {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
    }

    .option-count {
      min-width: 22px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.08);
      color: var(--primary-text-color);
      font-size: 0.78rem;
      font-weight: 700;
      text-align: center;
      opacity: 0.8;
    }

    .filter-option.inactive .option-count {
      opacity: 0.45;
    }

    .option-check {
      width: 20px;
      color: var(--primary-color);
      font-weight: 900;
      text-align: center;
    }

    .nav-btn {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      color: var(--primary-text-color);
      padding: 0 0 3px;
      opacity: 0.86;
      transition: border-color 0.15s, background 0.15s, opacity 0.15s, transform 0.15s;
    }
    .nav-btn:hover {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .nav-btn:active {
      transform: scale(0.96);
    }

    .create-trigger {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      border: 2px solid color-mix(in srgb, var(--primary-color) 76%, var(--divider-color));
      border-radius: 999px;
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      padding: 0;
      transition: filter 0.15s, transform 0.15s, opacity 0.15s;
    }

    .create-trigger ha-icon {
      width: 22px;
      height: 22px;
    }

    .create-trigger:hover {
      filter: brightness(1.06);
    }

    .create-trigger:active {
      transform: scale(0.96);
    }

    .create-trigger:disabled {
      cursor: default;
      opacity: 0.45;
      filter: grayscale(0.2);
    }

    .floating-create-trigger {
      position: absolute;
      right: 28px;
      bottom: 28px;
      z-index: 25;
      width: 56px;
      height: 56px;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
    }

    .floating-create-trigger ha-icon {
      width: 26px;
      height: 26px;
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-actions {
      grid-area: actions;
      display: flex;
      align-items: center;
      justify-self: end;
      gap: 8px;
      min-width: 0;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .view-title {
      grid-area: title;
      font-size: 1.42rem;
      font-weight: 800;
      color: var(--primary-text-color);
      justify-self: center;
      text-align: center;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }

    .today-btn {
      min-height: 42px;
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--primary-color) 12%);
      border: 2px solid var(--divider-color, #ccc);
      border-radius: 999px;
      padding: 0 16px;
      cursor: pointer;
      font-size: 0.86rem;
      font-weight: 600;
      color: var(--primary-text-color);
      transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
    }
    .today-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }
    .today-btn:active {
      transform: scale(0.97);
    }

    .filter-trigger:focus-visible,
    .view-trigger:focus-visible,
    .filter-option:focus-visible,
    .view-option:focus-visible,
    .nav-btn:focus-visible,
    .create-trigger:focus-visible,
    .today-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* ---- Calendar area ---- */
    .calendar-area {
      position: relative;
      z-index: 1;
      min-height: 0;
      overflow: hidden;
      height: var(--aurora-grid-height);
      padding: 0 0 1px;
      box-sizing: border-box;
    }

    .aurora-card.height-ha .calendar-area {
      flex: 1 1 auto;
      height: auto;
    }

    .aurora-card.height-natural .calendar-area {
      height: auto;
      min-height: 360px;
      overflow: visible;
    }

    .aurora-card.height-natural aurora-calendar-month,
    .aurora-card.height-natural aurora-calendar-week-box,
    .aurora-card.height-natural aurora-calendar-time-grid {
      min-height: 360px;
    }

    .loading-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      z-index: 20;
      pointer-events: none;
    }

    .unconfigured {
      height: var(--aurora-grid-height);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed var(--divider-color, #ccc);
      border-radius: var(--aurora-radius);
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .unconfigured p {
      margin: 0;
      line-height: 1.6;
    }

    .event-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.42);
      backdrop-filter: blur(5px);
      box-sizing: border-box;
      animation: aurora-backdrop-in 0.18s ease-out both;
    }

    .event-dialog-backdrop.closing {
      animation: aurora-backdrop-out 0.16s ease-in both;
    }

    .event-dialog {
      width: min(520px, 100%);
      max-height: min(720px, calc(100vh - 48px));
      overflow: hidden;
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
      border: 1px solid color-mix(in srgb, var(--event-color) 28%, var(--divider-color));
      animation: aurora-dialog-in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .event-dialog-backdrop.closing .event-dialog {
      animation: aurora-dialog-out 0.16s ease-in both;
    }

    @keyframes aurora-backdrop-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes aurora-backdrop-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    @keyframes aurora-dialog-in {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes aurora-dialog-out {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
      }
    }

    .event-dialog-header {
      position: relative;
      padding: 24px 64px 22px 24px;
      background:
        radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.32), transparent 28%),
        linear-gradient(135deg, var(--event-color), color-mix(in srgb, var(--event-color) 72%, #000 28%));
      color: var(--event-text-color);
    }

    .event-dialog-kicker {
      font-size: 0.76rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.82;
      margin-bottom: 8px;
    }

    .event-dialog-header h2 {
      margin: 0;
      font-size: clamp(1.4rem, 3vw, 2rem);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .event-dialog-person {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      font-weight: 800;
      opacity: 0.94;
    }

    .event-dialog-avatar {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--person-color, rgba(255, 255, 255, 0.22));
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
      font-weight: 900;
      overflow: hidden;
      flex-shrink: 0;
    }

    .event-dialog-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    .event-dialog-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 42px;
      height: 42px;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      color: inherit;
      cursor: pointer;
      font-size: 1.8rem;
      line-height: 1;
    }

    .event-dialog-close:hover {
      background: rgba(255, 255, 255, 0.28);
    }

    .event-dialog-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 22px 24px 24px;
      overflow-y: auto;
      max-height: calc(min(720px, 100vh - 48px) - 150px);
    }

    .detail-row {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      padding: 12px;
      border-radius: 16px;
      background: color-mix(in srgb, var(--event-color) 8%, transparent);
    }

    .detail-row ha-icon {
      color: var(--event-color);
      margin-top: 2px;
    }

    .detail-label {
      display: block;
      color: var(--secondary-text-color);
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      font-weight: 750;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .detail-section {
      padding: 14px;
      border-radius: 16px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 88%, var(--event-color) 12%);
    }

    .detail-section p {
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    .event-action-error {
      padding: 10px 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      color: var(--error-color, #db4437);
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .event-dialog-actions,
    .create-form-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }

    .delete-confirm-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 14px;
      border: 2px solid color-mix(in srgb, var(--error-color, #db4437) 34%, transparent);
      border-radius: 16px;
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, var(--card-background-color, #fff));
    }

    .delete-confirm-panel > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .delete-confirm-panel strong {
      color: var(--primary-text-color);
      font-size: 1rem;
      line-height: 1.25;
    }

    .delete-confirm-panel span {
      color: var(--secondary-text-color);
      font-size: 0.88rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .danger-action,
    .primary-action,
    .secondary-action {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 999px;
      border: 2px solid transparent;
      padding: 0 16px;
      cursor: pointer;
      font: inherit;
      font-size: 0.88rem;
      font-weight: 800;
      transition: background 0.15s, border-color 0.15s, opacity 0.15s, transform 0.15s;
    }

    .danger-action {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      border-color: color-mix(in srgb, var(--error-color, #db4437) 34%, transparent);
      color: var(--error-color, #db4437);
    }

    .primary-action {
      background: var(--event-color, var(--primary-color));
      border-color: color-mix(in srgb, var(--event-color, var(--primary-color)) 74%, var(--divider-color));
      color: var(--text-primary-color, #fff);
    }

    .secondary-action {
      background: color-mix(in srgb, var(--card-background-color, transparent) 88%, var(--event-color, var(--primary-color)) 12%);
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
    }

    .danger-action:hover,
    .primary-action:hover,
    .secondary-action:hover {
      transform: translateY(-1px);
    }

    .danger-action:disabled,
    .primary-action:disabled,
    .secondary-action:disabled {
      cursor: default;
      opacity: 0.48;
      transform: none;
    }

    .danger-action ha-icon,
    .primary-action ha-icon,
    .secondary-action ha-icon {
      width: 18px;
      height: 18px;
    }

    .create-dialog {
      border-color: color-mix(in srgb, var(--event-color, var(--primary-color)) 28%, var(--divider-color));
    }

    .create-dialog-header {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 62px 18px 22px;
      border-bottom: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      background: color-mix(in srgb, var(--event-color, var(--primary-color)) 14%, var(--card-background-color, #fff));
    }

    .create-dialog-header ha-icon {
      width: 30px;
      height: 30px;
      color: var(--event-color, var(--primary-color));
    }

    .create-dialog-header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 850;
      line-height: 1.1;
      color: var(--primary-text-color);
    }

    .create-dialog-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 40px;
      height: 40px;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 1.35rem;
      line-height: 1;
    }

    .create-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px 22px 22px;
      max-height: calc(min(720px, 100vh - 48px) - 76px);
      overflow-y: auto;
      box-sizing: border-box;
    }

    .create-calendar-picker {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .form-field-label {
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .create-calendar-trigger {
      min-height: 48px;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 12px 7px 8px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 92%, var(--event-color, var(--primary-color)) 8%);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
      text-align: left;
      box-sizing: border-box;
    }

    .create-calendar-trigger:hover,
    .create-calendar-trigger.open {
      border-color: var(--event-color, var(--primary-color));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--event-color, var(--primary-color)) 14%, transparent);
    }

    .create-calendar-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-height: 260px;
      overflow-y: auto;
      padding: 8px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 16px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 96%, var(--event-color, var(--primary-color)) 4%);
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
    }

    .create-form label {
      display: flex;
      flex-direction: column;
      gap: 7px;
      min-width: 0;
    }

    .create-form label > span {
      color: var(--secondary-text-color);
      font-size: 0.74rem;
      font-weight: 900;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .create-form input,
    .create-form select,
    .create-form textarea {
      width: 100%;
      min-height: 42px;
      border: 2px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 92%, var(--primary-color) 8%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.95rem;
      padding: 8px 10px;
      outline: none;
      box-sizing: border-box;
      color-scheme: light dark;
    }

    .create-form textarea {
      min-height: 84px;
      resize: vertical;
    }

    .create-form input:focus,
    .create-form select:focus,
    .create-form textarea:focus {
      border-color: var(--event-color, var(--primary-color));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--event-color, var(--primary-color)) 18%, transparent);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .date-time-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .check-row {
      flex-direction: row !important;
      align-items: center;
      gap: 10px !important;
      width: fit-content;
      cursor: pointer;
    }

    .check-row input {
      width: 20px;
      min-height: 20px;
      height: 20px;
      accent-color: var(--primary-color);
    }

    .check-row span {
      color: var(--primary-text-color) !important;
      font-size: 0.9rem !important;
      letter-spacing: 0 !important;
      text-transform: none !important;
    }

    .form-notice {
      padding: 12px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--event-color, var(--warning-color, #f4b400)) 16%, transparent);
      color: var(--primary-text-color);
      font-size: 0.88rem;
      font-weight: 700;
      line-height: 1.35;
    }

    .event-owner-strip {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--primary-text-color);
    }

    aurora-calendar-month,
    aurora-calendar-week-box,
    aurora-calendar-time-grid {
      display: block;
      height: 100%;
    }

    @media (max-width: 900px) {
      .top-toolbar {
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "filters actions"
          "title title";
        row-gap: 10px;
      }

      .view-title {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    @media (max-width: 620px) {
      .top-toolbar {
        grid-template-columns: 1fr;
        grid-template-areas:
          "title"
          "filters"
          "actions";
      }

      .filter-control-wrap,
      .toolbar-actions,
      .view-title {
        justify-self: center;
      }

      .toolbar-actions {
        justify-content: center;
      }

      .filter-menu {
        left: 50%;
        transform: translateX(-50%);
      }

      .view-menu,
      .jump-menu {
        right: 50%;
        transform: translateX(50%);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 430px) {
      .toolbar-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
      }

      .view-control-wrap,
      .jump-control-wrap,
      .nav-controls {
        justify-self: center;
      }

      .nav-controls {
        grid-column: 1 / -1;
      }
    }
  `;
__decorate([
    n({ attribute: false })
], AuroraCalendarCard.prototype, "hass", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_config", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_viewMode", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_offset", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_events", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_weatherByDate", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_loading", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_filterMenuOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_viewMenuOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_jumpMenuOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_selectedEvent", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_createDialogOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_createDraft", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_createCalendarMenuOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_editDialogOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_editDraft", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_eventActionError", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_savingEvent", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_deletingEvent", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_deleteConfirmOpen", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_closingDialog", void 0);
__decorate([
    r()
], AuroraCalendarCard.prototype, "_resolvedBackgroundImage", void 0);
AuroraCalendarCard = __decorate([
    t$1("aurora-calendar-card")
], AuroraCalendarCard);
// ------------------------------------------------------------------
// Visual card editor — uses native HA elements so themes and upgrades
// are handled by HA automatically (ha-switch, ha-select, ha-textfield)
// ------------------------------------------------------------------
let AuroraCalendarCardEditor = class AuroraCalendarCardEditor extends i {
    setConfig(config) {
        const integration = config.integration || "aurora_calendar";
        this._config = { ...CONFIG_DEFAULTS, ...config, integration };
    }
    _set(field, value) {
        if (!this._config)
            return;
        const config = { ...this._config, [field]: value };
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
        }));
    }
    _setBackgroundMedia(event) {
        const detail = event.detail;
        const value = detail?.value;
        if (value &&
            typeof value === "object" &&
            "media_content_id" in value &&
            "media_content_type" in value) {
            const media = value;
            if (typeof media.media_content_id === "string" &&
                typeof media.media_content_type === "string") {
                this._set("background_media", {
                    media_content_id: media.media_content_id,
                    media_content_type: media.media_content_type,
                });
                return;
            }
        }
        this._set("background_media", null);
    }
    _setBoundedNumber(field, event, min, max) {
        const value = Number(event.target.value);
        if (!Number.isFinite(value))
            return;
        this._set(field, Math.min(max, Math.max(min, Math.round(value))));
    }
    _renderNumberSlider(label, field, min, max, suffix = "") {
        const value = Math.min(max, Math.max(min, Number(this._config[field]) || 0));
        return b `
      <label class="slider-control">
        <span class="slider-header">
          <span>${label}</span>
          <output>${value}${suffix}</output>
        </span>
        <input
          type="range"
          min=${String(min)}
          max=${String(max)}
          .value=${String(value)}
          @input=${(e) => this._setBoundedNumber(field, e, min, max)}
        />
      </label>
    `;
    }
    render() {
        if (!this._config)
            return b ``;
        const locale = localeFromHass(this.hass);
        return b `
      <!-- General -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:cog"></ha-icon>
          ${t(locale, "general")}
        </div>

        <div class="panel-content">
          <label class="selector-control">
            <span>${t(locale, "weekStartsOn")}</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "sunday", label: t(locale, "sunday") },
                    { value: "monday", label: t(locale, "monday") },
                ],
            },
        }}
              .value=${this._config.week_start}
              @value-changed=${(e) => {
            const value = e.detail?.value;
            if (value === "sunday" || value === "monday") {
                this._set("week_start", value);
            }
        }}
            ></ha-selector>
          </label>
        </div>
      </ha-expansion-panel>

      <!-- Appearance -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:palette-outline"></ha-icon>
          ${t(locale, "appearance")}
        </div>

        <div class="panel-content">
          <section class="editor-section">
            <h3>${t(locale, "heightMode")}</h3>

            <label class="selector-control">
              <span>${t(locale, "heightMode")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "auto", label: t(locale, "heightAuto") },
                    { value: "ha", label: t(locale, "heightHomeAssistant") },
                    { value: "fixed", label: t(locale, "heightFixed") },
                    { value: "natural", label: t(locale, "heightNatural") },
                ],
            },
        }}
                .value=${this._config.height_mode}
                @value-changed=${(e) => {
            const value = e.detail?.value;
            if (value === "auto" || value === "ha" || value === "fixed" || value === "natural") {
                this._set("height_mode", value);
            }
        }}
              ></ha-selector>
            </label>

            ${this._config.height_mode === "fixed"
            ? b `
                  <ha-textfield
                    label=${t(locale, "fixedHeight")}
                    .value=${this._config.fixed_height}
                    helper=${t(locale, "fixedHeightHelper")}
                    @change=${(e) => this._set("fixed_height", e.target.value.trim())}
                  ></ha-textfield>
                `
            : A}
          </section>

          <section class="editor-section">
            <h3>${t(locale, "visualBehavior")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "dimPastEvents")}</span>
              <span slot="description">${t(locale, "dimPastEventsDesc")}</span>
              <ha-switch
                .checked=${this._config.dim_past_events}
                @change=${(e) => this._set("dim_past_events", e.target.checked)}
              ></ha-switch>
            </ha-settings-row>

            <ha-settings-row>
              <span slot="heading">${t(locale, "calendarGridLines")}</span>
              <span slot="description">${t(locale, "calendarGridLinesDesc")}</span>
              <ha-switch
                .checked=${this._config.show_calendar_grid_lines}
                @change=${(e) => this._set("show_calendar_grid_lines", e.target.checked)}
              ></ha-switch>
            </ha-settings-row>

            <ha-settings-row>
              <span slot="heading">${t(locale, "keepAllDayEventsVisible")}</span>
              <span slot="description">${t(locale, "keepAllDayEventsVisibleDesc")}</span>
              <ha-switch
                .checked=${this._config.keep_all_day_events_visible}
                @change=${(e) => this._set("keep_all_day_events_visible", e.target.checked)}
              ></ha-switch>
            </ha-settings-row>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "eventDisplay")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "showEventTimes")}</span>
              <span slot="description">${t(locale, "showEventTimesDesc")}</span>
              <ha-switch
                .checked=${this._config.show_event_time}
                @change=${(e) => this._set("show_event_time", e.target.checked)}
              ></ha-switch>
            </ha-settings-row>

            <label class="selector-control">
              <span>${t(locale, "timeFormat")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "12h", label: t(locale, "twelveHour") },
                    { value: "24h", label: t(locale, "twentyFourHour") },
                ],
            },
        }}
                .value=${this._config.time_format}
                @value-changed=${(e) => {
            const value = e.detail?.value;
            if (value === "12h" || value === "24h") {
                this._set("time_format", value);
            }
        }}
              ></ha-selector>
            </label>

            <div class="event-typography">
              <label class="selector-control">
                <span>${t(locale, "eventFontSize")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "12", label: t(locale, "small") },
                    { value: "14", label: t(locale, "medium") },
                    { value: "16", label: t(locale, "large") },
                    { value: "18", label: t(locale, "extraLarge") },
                ],
            },
        }}
                  .value=${String(this._config.event_font_size)}
                  @value-changed=${(e) => {
            const value = Number(e.detail?.value);
            if (Number.isInteger(value) && value >= 11 && value <= 24) {
                this._set("event_font_size", value);
            }
        }}
                ></ha-selector>
              </label>

              <label class="selector-control">
                <span>${t(locale, "eventFont")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "inherit", label: t(locale, "default") },
                    { value: '"Nunito", "Segoe UI", sans-serif', label: t(locale, "friendlyRounded") },
                    { value: '"Aptos", "Segoe UI", sans-serif', label: t(locale, "cleanDashboard") },
                    { value: '"Georgia", serif', label: t(locale, "serif") },
                ],
            },
        }}
                  .value=${this._config.event_font_family}
                  @value-changed=${(e) => {
            if (typeof e.detail?.value === "string") {
                this._set("event_font_family", e.detail.value);
            }
        }}
                ></ha-selector>
              </label>
            </div>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "scheduleWindow")}</h3>

            <div class="time-window">
              <label class="selector-control">
                <span>${t(locale, "visibleStartHour")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
            select: {
                mode: "dropdown",
                options: Array.from({ length: 24 }, (_, hour) => ({
                    value: String(hour),
                    label: `${String(hour).padStart(2, "0")}:00`,
                })),
            },
        }}
                  .value=${String(this._config.visible_start_hour)}
                  @value-changed=${(e) => {
            const value = Number(e.detail?.value);
            if (Number.isInteger(value) && value >= 0 && value <= 23) {
                this._set("visible_start_hour", value);
            }
        }}
                ></ha-selector>
              </label>

              <label class="selector-control">
                <span>${t(locale, "visibleEndHour")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{
            select: {
                mode: "dropdown",
                options: Array.from({ length: 24 }, (_, index) => ({
                    value: String(index + 1),
                    label: `${String(index + 1).padStart(2, "0")}:00`,
                })),
            },
        }}
                  .value=${String(this._config.visible_end_hour)}
                  @value-changed=${(e) => {
            const value = Number(e.detail?.value);
            if (Number.isInteger(value) && value >= 1 && value <= 24) {
                this._set("visible_end_hour", value);
            }
        }}
                ></ha-selector>
                <small class="helper-text">${t(locale, "visibleEndHourHelper")}</small>
              </label>
            </div>
          </section>

          <section class="editor-section">
            <h3>${t(locale, "background")}</h3>

            <ha-settings-row>
              <span slot="heading">${t(locale, "glassBackground")}</span>
              <span slot="description">${t(locale, "glassBackgroundDesc")}</span>
              <ha-switch
                .checked=${this._config.glass_background}
                @change=${(e) => this._set("glass_background", e.target.checked)}
              ></ha-switch>
            </ha-settings-row>

            <div class="media-picker">
              <div class="media-picker-heading">
                <div>
                  <span>${t(locale, "backgroundMedia")}</span>
                  <small>${t(locale, "backgroundMediaHelper")}</small>
                </div>
                ${this._config.background_media
            ? b `
                      <button type="button" class="text-button" @click=${() => this._set("background_media", null)}>
                        ${t(locale, "removeBackgroundImage")}
                      </button>
                    `
            : A}
              </div>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ media: { accept: ["image/*"] } }}
                .value=${this._config.background_media || undefined}
                @value-changed=${this._setBackgroundMedia}
              ></ha-selector>
            </div>

            <ha-textfield
              label=${t(locale, "backgroundImage")}
              .value=${this._config.background_image}
              helper=${t(locale, "backgroundImageHelper")}
              @change=${(e) => this._set("background_image", e.target.value.trim())}
            ></ha-textfield>

            <div class="background-controls">
              ${this._renderNumberSlider(t(locale, "cardOpacity"), "card_opacity", 0, 100, "%")}
              ${this._renderNumberSlider(t(locale, "backgroundImageOpacity"), "background_image_opacity", 0, 100, "%")}
              ${this._renderNumberSlider(t(locale, "backgroundBlur"), "background_blur", 0, 20, "px")}
            </div>
          </section>
        </div>
      </ha-expansion-panel>

      <!-- Features -->
      <ha-expansion-panel outlined .expanded=${true}>
        <div slot="header" class="panel-header">
          <ha-icon icon="mdi:lightning-bolt"></ha-icon>
          ${t(locale, "features")}
        </div>

        <div class="panel-content">
          <ha-settings-row>
            <span slot="heading">${t(locale, "weatherForecast")}</span>
            <span slot="description">${t(locale, "weatherForecastDesc")}</span>
            <ha-switch
              .checked=${this._config.show_weather}
              @change=${(e) => this._set("show_weather", e.target.checked)}
            ></ha-switch>
          </ha-settings-row>

          <label class="selector-control">
            <span>${t(locale, "weatherIconStyle")}</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{
            select: {
                mode: "dropdown",
                options: [
                    { value: "static", label: t(locale, "static") },
                    { value: "animated", label: t(locale, "animated") },
                ],
            },
        }}
              .value=${this._config.weather_icon_style}
              @value-changed=${(e) => {
            const value = e.detail?.value;
            if (value === "static" || value === "animated") {
                this._set("weather_icon_style", value);
            }
        }}
            ></ha-selector>
          </label>
        </div>
      </ha-expansion-panel>
    `;
    }
};
AuroraCalendarCardEditor.styles = i$3 `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0 8px;
    }

    ha-textfield {
      width: 100%;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .panel-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 16px 16px;
    }

    ha-select {
      width: 100%;
    }

    ha-selector {
      display: block;
      width: 100%;
    }

    .editor-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 18px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 58%, transparent);
    }

    .editor-section h3 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 0.01em;
    }

    .media-picker {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 72%, transparent);
    }

    .media-picker-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .media-picker-heading div {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .media-picker-heading span {
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .media-picker-heading small {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      line-height: 1.35;
    }

    .selector-control {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .selector-control > span {
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0 2px;
    }

    .text-button {
      border: 0;
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .slider-control {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--secondary-background-color, #f5f5f5) 76%, transparent);
    }

    .slider-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: var(--primary-text-color);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .slider-header output {
      min-width: 48px;
      padding: 3px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      color: var(--primary-color);
      font-size: 0.82rem;
      font-weight: 800;
      text-align: center;
    }

    .slider-control input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color);
      cursor: pointer;
    }

    .time-window,
    .event-typography,
    .background-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
    }

    @media (max-width: 640px) {
      .time-window,
      .event-typography,
      .background-controls {
        grid-template-columns: 1fr;
      }
    }
  `;
__decorate([
    n({ attribute: false })
], AuroraCalendarCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], AuroraCalendarCardEditor.prototype, "_config", void 0);
AuroraCalendarCardEditor = __decorate([
    t$1("aurora-calendar-card-editor")
], AuroraCalendarCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "aurora-calendar-card",
    name: "Aurora Calendar",
    description: "Family calendar with month/week/today views, weather overlay, and per-person filters.",
    preview: true,
    documentationURL: "https://github.com/davidlop28/ha-aurora-calendar",
});

export { AuroraCalendarCard, AuroraCalendarCardEditor };
