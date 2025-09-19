var sn=Object.defineProperty;var on=(e,t,n)=>t in e?sn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var A=(e,t,n)=>on(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const Ct=!1;var et=Array.isArray,tt=Array.from,ln=Object.defineProperty,ie=Object.getOwnPropertyDescriptor,wt=Object.getOwnPropertyDescriptors,an=Object.prototype,fn=Array.prototype,Oe=Object.getPrototypeOf;const Et=()=>{};function un(e){return typeof(e==null?void 0:e.then)=="function"}function cn(e){return e()}function We(e){for(var t=0;t<e.length;t++)e[t]()}const Y=2,Bt=4,Ne=8,nt=16,k=32,ye=64,$e=128,ee=256,Le=512,U=1024,Q=2048,Ge=4096,X=8192,ue=16384,dn=32768,Re=65536,pn=1<<19,St=1<<20,Z=Symbol("$state"),vn=Symbol("legacy props"),gn=Symbol("");function It(e){return e===this.v}function _n(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function hn(e){return!_n(e,this.v)}function yn(e){throw new Error("effect_in_teardown")}function mn(){throw new Error("effect_in_unowned_derived")}function Pn(e){throw new Error("effect_orphan")}function bn(){throw new Error("effect_update_depth_exceeded")}function xn(){throw new Error("state_descriptors_fixed")}function Cn(){throw new Error("state_prototype_fixed")}function wn(){throw new Error("state_unsafe_local_read")}function En(){throw new Error("state_unsafe_mutation")}let Xe=!1;function Bn(){Xe=!0}function O(e){return{f:0,v:e,reactions:null,equals:It,version:0}}function de(e){return Sn(O(e))}function Te(e,t=!1){var i;const n=O(e);return t||(n.equals=hn),Xe&&x!==null&&x.l!==null&&((i=x.l).s??(i.s=[])).push(n),n}function Sn(e){return P!==null&&(P.f&Y)!==0&&(D===null?qn([e]):D.push(e)),e}function L(e,t){return P!==null&&Me()&&(P.f&(Y|nt))!==0&&(D===null||!D.includes(e))&&En(),pe(e,t)}function pe(e,t){return e.equals(t)||(e.v=t,e.version=$t(),Ot(e,Q),Me()&&m!==null&&(m.f&U)!==0&&(m.f&k)===0&&(S!==null&&S.includes(e)?(q(m,Q),qe(m)):V===null?jn([e]):V.push(e))),t}function Ot(e,t){var n=e.reactions;if(n!==null)for(var i=Me(),r=n.length,s=0;s<r;s++){var l=n[s],v=l.f;(v&Q)===0&&(!i&&l===m||(q(l,t),(v&(U|ee))!==0&&((v&Y)!==0?Ot(l,Ge):qe(l))))}}const In=1,On=2,Ln=16,Tn=8,An=1,Un=2,I=Symbol();let Yn=!1;function N(e,t=null,n){if(typeof e!="object"||e===null||Z in e)return e;const i=Oe(e);if(i!==an&&i!==fn)return e;var r=new Map,s=et(e),l=O(0);s&&r.set("length",O(e.length));var v;return new Proxy(e,{defineProperty(a,u,o){(!("value"in o)||o.configurable===!1||o.enumerable===!1||o.writable===!1)&&xn();var f=r.get(u);return f===void 0?(f=O(o.value),r.set(u,f)):L(f,N(o.value,v)),!0},deleteProperty(a,u){var o=r.get(u);if(o===void 0)u in a&&r.set(u,O(I));else{if(s&&typeof u=="string"){var f=r.get("length"),d=Number(u);Number.isInteger(d)&&d<f.v&&L(f,d)}L(o,I),ut(l)}return!0},get(a,u,o){var p;if(u===Z)return e;var f=r.get(u),d=u in a;if(f===void 0&&(!d||(p=ie(a,u))!=null&&p.writable)&&(f=O(N(d?a[u]:I,v)),r.set(u,f)),f!==void 0){var c=b(f);return c===I?void 0:c}return Reflect.get(a,u,o)},getOwnPropertyDescriptor(a,u){var o=Reflect.getOwnPropertyDescriptor(a,u);if(o&&"value"in o){var f=r.get(u);f&&(o.value=b(f))}else if(o===void 0){var d=r.get(u),c=d==null?void 0:d.v;if(d!==void 0&&c!==I)return{enumerable:!0,configurable:!0,value:c,writable:!0}}return o},has(a,u){var c;if(u===Z)return!0;var o=r.get(u),f=o!==void 0&&o.v!==I||Reflect.has(a,u);if(o!==void 0||m!==null&&(!f||(c=ie(a,u))!=null&&c.writable)){o===void 0&&(o=O(f?N(a[u],v):I),r.set(u,o));var d=b(o);if(d===I)return!1}return f},set(a,u,o,f){var w;var d=r.get(u),c=u in a;if(s&&u==="length")for(var p=o;p<d.v;p+=1){var _=r.get(p+"");_!==void 0?L(_,I):p in a&&(_=O(I),r.set(p+"",_))}d===void 0?(!c||(w=ie(a,u))!=null&&w.writable)&&(d=O(void 0),L(d,N(o,v)),r.set(u,d)):(c=d.v!==I,L(d,N(o,v)));var y=Reflect.getOwnPropertyDescriptor(a,u);if(y!=null&&y.set&&y.set.call(f,o),!c){if(s&&typeof u=="string"){var g=r.get("length"),h=Number(u);Number.isInteger(h)&&h>=g.v&&L(g,h+1)}ut(l)}return!0},ownKeys(a){b(l);var u=Reflect.ownKeys(a).filter(d=>{var c=r.get(d);return c===void 0||c.v!==I});for(var[o,f]of r)f.v!==I&&!(o in a)&&u.push(o);return u},setPrototypeOf(){Cn()}})}function ut(e,t=1){L(e,e.v+t)}var ct,Lt,Tt;function kn(){if(ct===void 0){ct=window;var e=Element.prototype,t=Node.prototype;Lt=ie(t,"firstChild").get,Tt=ie(t,"nextSibling").get,e.__click=void 0,e.__className="",e.__attributes=null,e.__styles=null,e.__e=void 0,Text.prototype.__t=void 0}}function At(e=""){return document.createTextNode(e)}function Ae(e){return Lt.call(e)}function De(e){return Tt.call(e)}function B(e,t){return Ae(e)}function Ke(e,t){{var n=Ae(e);return n instanceof Comment&&n.data===""?De(n):n}}function G(e,t=1,n=!1){let i=e;for(;t--;)i=De(i);return i}function Nn(e){e.textContent=""}function Ut(e){var t=Y|Q;m===null?t|=ee:m.f|=St;var n=P!==null&&(P.f&Y)!==0?P:null;const i={children:null,ctx:x,deps:null,equals:It,f:t,fn:e,reactions:null,v:null,version:0,parent:n??m};return n!==null&&(n.children??(n.children=[])).push(i),i}function Yt(e){var t=e.children;if(t!==null){e.children=null;for(var n=0;n<t.length;n+=1){var i=t[n];(i.f&Y)!==0?rt(i):W(i)}}}function Gn(e){for(var t=e.parent;t!==null;){if((t.f&Y)===0)return t;t=t.parent}return null}function kt(e){var t,n=m;M(Gn(e));try{Yt(e),t=Kt(e)}finally{M(n)}return t}function Nt(e){var t=kt(e),n=(re||(e.f&ee)!==0)&&e.deps!==null?Ge:U;q(e,n),e.equals(t)||(e.v=t,e.version=$t())}function rt(e){Yt(e),_e(e,0),q(e,ue),e.v=e.children=e.deps=e.ctx=e.reactions=null}function Gt(e){m===null&&P===null&&Pn(),P!==null&&(P.f&ee)!==0&&mn(),ot&&yn()}function Rn(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function me(e,t,n,i=!0){var r=(e&ye)!==0,s=m,l={ctx:x,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:e|Q,first:null,fn:t,last:null,next:null,parent:r?null:s,prev:null,teardown:null,transitions:null,version:0};if(n){var v=oe;try{dt(!0),ze(l),l.f|=dn}catch(o){throw W(l),o}finally{dt(v)}}else t!==null&&qe(l);var a=n&&l.deps===null&&l.first===null&&l.nodes_start===null&&l.teardown===null&&(l.f&St)===0;if(!a&&!r&&i&&(s!==null&&Rn(l,s),P!==null&&(P.f&Y)!==0)){var u=P;(u.children??(u.children=[])).push(l)}return l}function Ue(e){Gt();var t=m!==null&&(m.f&k)!==0&&x!==null&&!x.m;if(t){var n=x;(n.e??(n.e=[])).push({fn:e,effect:m,reaction:P})}else{var i=it(e);return i}}function Xn(e){return Gt(),Rt(e)}function Dn(e){const t=me(ye,e,!0);return()=>{W(t)}}function it(e){return me(Bt,e,!1)}function Rt(e){return me(Ne,e,!0)}function ae(e){return Pe(e)}function Pe(e,t=0){return me(Ne|nt|t,e,!0)}function z(e,t=!0){return me(Ne|k,e,!0,t)}function Xt(e){var t=e.teardown;if(t!==null){const n=ot,i=P;pt(!0),H(null);try{t.call(null)}finally{pt(n),H(i)}}}function Dt(e){var t=e.deriveds;if(t!==null){e.deriveds=null;for(var n=0;n<t.length;n+=1)rt(t[n])}}function Mt(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){var i=n.next;W(n,t),n=i}}function Mn(e){for(var t=e.first;t!==null;){var n=t.next;(t.f&k)===0&&W(t),t=n}}function W(e,t=!0){var n=!1;if((t||(e.f&pn)!==0)&&e.nodes_start!==null){for(var i=e.nodes_start,r=e.nodes_end;i!==null;){var s=i===r?null:De(i);i.remove(),i=s}n=!0}Mt(e,t&&!n),Dt(e),_e(e,0),q(e,ue);var l=e.transitions;if(l!==null)for(const a of l)a.stop();Xt(e);var v=e.parent;v!==null&&v.first!==null&&Ft(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes_start=e.nodes_end=null}function Ft(e){var t=e.parent,n=e.prev,i=e.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),t!==null&&(t.first===e&&(t.first=i),t.last===e&&(t.last=n))}function se(e,t){var n=[];st(e,n,!0),zt(n,()=>{W(e),t&&t()})}function zt(e,t){var n=e.length;if(n>0){var i=()=>--n||t();for(var r of e)r.out(i)}else t()}function st(e,t,n){if((e.f&X)===0){if(e.f^=X,e.transitions!==null)for(const l of e.transitions)(l.is_global||n)&&t.push(l);for(var i=e.first;i!==null;){var r=i.next,s=(i.f&Re)!==0||(i.f&k)!==0;st(i,t,s?n:!1),i=r}}}function J(e){qt(e,!0)}function qt(e,t){if((e.f&X)!==0){be(e)&&ze(e),e.f^=X;for(var n=e.first;n!==null;){var i=n.next,r=(n.f&Re)!==0||(n.f&k)!==0;qt(n,r?t:!1),n=i}if(e.transitions!==null)for(const s of e.transitions)(s.is_global||t)&&s.in()}}let Ye=!1,Ze=[];function jt(){Ye=!1;const e=Ze.slice();Ze=[],We(e)}function Vt(e){Ye||(Ye=!0,queueMicrotask(jt)),Ze.push(e)}function Fn(){Ye&&jt()}const Ht=0,zn=1;let Se=!1,Ie=Ht,ve=!1,ge=null,oe=!1,ot=!1;function dt(e){oe=e}function pt(e){ot=e}let K=[],le=0;let P=null;function H(e){P=e}let m=null;function M(e){m=e}let D=null;function qn(e){D=e}let S=null,T=0,V=null;function jn(e){V=e}let Wt=0,re=!1,x=null;function vt(e){x=e}function $t(){return++Wt}function Me(){return!Xe||x!==null&&x.l===null}function be(e){var l,v;var t=e.f;if((t&Q)!==0)return!0;if((t&Ge)!==0){var n=e.deps,i=(t&ee)!==0;if(n!==null){var r;if((t&Le)!==0){for(r=0;r<n.length;r++)((l=n[r]).reactions??(l.reactions=[])).push(e);e.f^=Le}for(r=0;r<n.length;r++){var s=n[r];if(be(s)&&Nt(s),i&&m!==null&&!re&&!((v=s==null?void 0:s.reactions)!=null&&v.includes(e))&&(s.reactions??(s.reactions=[])).push(e),s.version>e.version)return!0}}i||q(e,U)}return!1}function Vn(e,t){for(var n=t;n!==null;){if((n.f&$e)!==0)try{n.fn(e);return}catch{n.f^=$e}n=n.parent}throw Se=!1,e}function Hn(e){return(e.f&ue)===0&&(e.parent===null||(e.parent.f&$e)===0)}function Fe(e,t,n,i){if(Se){if(n===null&&(Se=!1),Hn(t))throw e;return}n!==null&&(Se=!0);{Vn(e,t);return}}function Kt(e){var d;var t=S,n=T,i=V,r=P,s=re,l=D,v=x,a=e.f;S=null,T=0,V=null,P=(a&(k|ye))===0?e:null,re=!oe&&(a&ee)!==0,D=null,x=e.ctx;try{var u=(0,e.fn)(),o=e.deps;if(S!==null){var f;if(_e(e,T),o!==null&&T>0)for(o.length=T+S.length,f=0;f<S.length;f++)o[T+f]=S[f];else e.deps=o=S;if(!re)for(f=T;f<o.length;f++)((d=o[f]).reactions??(d.reactions=[])).push(e)}else o!==null&&T<o.length&&(_e(e,T),o.length=T);return u}finally{S=t,T=n,V=i,P=r,re=s,D=l,x=v}}function Wn(e,t){let n=t.reactions;if(n!==null){var i=n.indexOf(e);if(i!==-1){var r=n.length-1;r===0?n=t.reactions=null:(n[i]=n[r],n.pop())}}n===null&&(t.f&Y)!==0&&(S===null||!S.includes(t))&&(q(t,Ge),(t.f&(ee|Le))===0&&(t.f^=Le),_e(t,0))}function _e(e,t){var n=e.deps;if(n!==null)for(var i=t;i<n.length;i++)Wn(e,n[i])}function ze(e){var t=e.f;if((t&ue)===0){q(e,U);var n=m,i=x;m=e;try{(t&nt)!==0?Mn(e):Mt(e),Dt(e),Xt(e);var r=Kt(e);e.teardown=typeof r=="function"?r:null,e.version=Wt}catch(s){Fe(s,e,n,i||e.ctx)}finally{m=n}}}function Zt(){if(le>1e3){le=0;try{bn()}catch(e){if(ge!==null)Fe(e,ge,null);else throw e}}le++}function Jt(e){var t=e.length;if(t!==0){Zt();var n=oe;oe=!0;try{for(var i=0;i<t;i++){var r=e[i];(r.f&U)===0&&(r.f^=U);var s=[];Qt(r,s),$n(s)}}finally{oe=n}}}function $n(e){var t=e.length;if(t!==0)for(var n=0;n<t;n++){var i=e[n];if((i.f&(ue|X))===0)try{be(i)&&(ze(i),i.deps===null&&i.first===null&&i.nodes_start===null&&(i.teardown===null?Ft(i):i.fn=null))}catch(r){Fe(r,i,null,i.ctx)}}}function Kn(){if(ve=!1,le>1001)return;const e=K;K=[],Jt(e),ve||(le=0,ge=null)}function qe(e){Ie===Ht&&(ve||(ve=!0,queueMicrotask(Kn))),ge=e;for(var t=e;t.parent!==null;){t=t.parent;var n=t.f;if((n&(ye|k))!==0){if((n&U)===0)return;t.f^=U}}K.push(t)}function Qt(e,t){var n=e.first,i=[];e:for(;n!==null;){var r=n.f,s=(r&k)!==0,l=s&&(r&U)!==0,v=n.next;if(!l&&(r&X)===0)if((r&Ne)!==0){if(s)n.f^=U;else try{be(n)&&ze(n)}catch(f){Fe(f,n,null,n.ctx)}var a=n.first;if(a!==null){n=a;continue}}else(r&Bt)!==0&&i.push(n);if(v===null){let f=n.parent;for(;f!==null;){if(e===f)break e;var u=f.next;if(u!==null){n=u;continue e}f=f.parent}}n=v}for(var o=0;o<i.length;o++)a=i[o],t.push(a),Qt(a,t)}function en(e){var t=Ie,n=K;try{Zt();const r=[];Ie=zn,K=r,ve=!1,Jt(n);var i=e==null?void 0:e();return Fn(),(K.length>0||r.length>0)&&en(),le=0,ge=null,i}finally{Ie=t,K=n}}function b(e){var o;var t=e.f,n=(t&Y)!==0;if(n&&(t&ue)!==0){var i=kt(e);return rt(e),i}if(P!==null){D!==null&&D.includes(e)&&wn();var r=P.deps;S===null&&r!==null&&r[T]===e?T++:S===null?S=[e]:S.push(e),V!==null&&m!==null&&(m.f&U)!==0&&(m.f&k)===0&&V.includes(e)&&(q(m,Q),qe(m))}else if(n&&e.deps===null)for(var s=e,l=s.parent,v=s;l!==null;)if((l.f&Y)!==0){var a=l;v=a,l=a.parent}else{var u=l;(o=u.deriveds)!=null&&o.includes(v)||(u.deriveds??(u.deriveds=[])).push(v);break}return n&&(s=e,be(s)&&Nt(s)),e.v}function lt(e){const t=P;try{return P=null,e()}finally{P=t}}const Zn=-7169;function q(e,t){e.f=e.f&Zn|t}function xe(e,t=!1,n){x={p:x,c:null,e:null,m:!1,s:e,x:null,l:null},Xe&&!t&&(x.l={s:null,u:null,r1:[],r2:O(!1)})}function Ce(e){const t=x;if(t!==null){const l=t.e;if(l!==null){var n=m,i=P;t.e=null;try{for(var r=0;r<l.length;r++){var s=l[r];M(s.effect),H(s.reaction),it(s.fn)}}finally{M(n),H(i)}}x=t.p,t.m=!0}return{}}function Jn(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(Z in e)Je(e);else if(!Array.isArray(e))for(let t in e){const n=e[t];typeof n=="object"&&n&&Z in n&&Je(n)}}}function Je(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let i in e)try{Je(e[i],t)}catch{}const n=Oe(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const i=wt(n);for(let r in i){const s=i[r].get;if(s)try{s.call(e)}catch{}}}}}const Qn=new Set,gt=new Set;function we(e){var h;var t=this,n=t.ownerDocument,i=e.type,r=((h=e.composedPath)==null?void 0:h.call(e))||[],s=r[0]||e.target,l=0,v=e.__root;if(v){var a=r.indexOf(v);if(a!==-1&&(t===document||t===window)){e.__root=t;return}var u=r.indexOf(t);if(u===-1)return;a<=u&&(l=a)}if(s=r[l]||e.target,s!==t){ln(e,"currentTarget",{configurable:!0,get(){return s||n}});var o=P,f=m;H(null),M(null);try{for(var d,c=[];s!==null;){var p=s.assignedSlot||s.parentNode||s.host||null;try{var _=s["__"+i];if(_!==void 0&&!s.disabled)if(et(_)){var[y,...g]=_;y.apply(s,[e,...g])}else _.call(s,e)}catch(w){d?c.push(w):d=w}if(e.cancelBubble||p===t||p===null)break;s=p}if(d){for(let w of c)queueMicrotask(()=>{throw w});throw d}}finally{e.__root=t,delete e.currentTarget,H(o),M(f)}}}function er(e){var t=document.createElement("template");return t.innerHTML=e,t.content}function Qe(e,t){var n=m;n.nodes_start===null&&(n.nodes_start=e,n.nodes_end=t)}function $(e,t){var n=(t&An)!==0,i=(t&Un)!==0,r,s=!e.startsWith("<!>");return()=>{r===void 0&&(r=er(s?e:"<!>"+e),n||(r=Ae(r)));var l=i?document.importNode(r,!0):r.cloneNode(!0);if(n){var v=Ae(l),a=l.lastChild;Qe(v,a)}else Qe(l,l);return l}}function _t(){var e=document.createDocumentFragment(),t=document.createComment(""),n=At();return e.append(t,n),Qe(t,n),e}function R(e,t){e!==null&&e.before(t)}const tr=["touchstart","touchmove"];function nr(e){return tr.includes(e)}function fe(e,t){var n=t==null?"":typeof t=="object"?t+"":t;n!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=n,e.nodeValue=n==null?"":n+"")}function rr(e,t){return ir(e,t)}const ne=new Map;function ir(e,{target:t,anchor:n,props:i={},events:r,context:s,intro:l=!0}){kn();var v=new Set,a=f=>{for(var d=0;d<f.length;d++){var c=f[d];if(!v.has(c)){v.add(c);var p=nr(c);t.addEventListener(c,we,{passive:p});var _=ne.get(c);_===void 0?(document.addEventListener(c,we,{passive:p}),ne.set(c,1)):ne.set(c,_+1)}}};a(tt(Qn)),gt.add(a);var u=void 0,o=Dn(()=>{var f=n??t.appendChild(At());return z(()=>{if(s){xe({});var d=x;d.c=s}r&&(i.$$events=r),u=e(f,i)||{},s&&Ce()}),()=>{var p;for(var d of v){t.removeEventListener(d,we);var c=ne.get(d);--c===0?(document.removeEventListener(d,we),ne.delete(d)):ne.set(d,c)}gt.delete(a),ht.delete(u),f!==n&&((p=f.parentNode)==null||p.removeChild(f))}});return ht.set(u,o),u}let ht=new WeakMap;const Ve=0,Ee=1,He=2;function sr(e,t,n,i,r){var s=e,l=Me(),v=x,a=I,u,o,f,d=(l?O:Te)(void 0),c=(l?O:Te)(void 0),p=!1;function _(g,h){p=!0,h&&(M(y),H(y),vt(v));try{g===Ve&&n&&(u?J(u):u=z(()=>n(s))),g===Ee&&i&&(o?J(o):o=z(()=>i(s,d))),g===He&&r&&(f?J(f):f=z(()=>r(s,c))),g!==Ve&&u&&se(u,()=>u=null),g!==Ee&&o&&se(o,()=>o=null),g!==He&&f&&se(f,()=>f=null)}finally{h&&(vt(null),H(null),M(null),en())}}var y=Pe(()=>{if(a!==(a=t())){if(un(a)){var g=a;p=!1,g.then(h=>{g===a&&(pe(d,h),_(Ee,!0))},h=>{if(g===a&&(pe(c,h),_(He,!0),!r))throw c.v}),Vt(()=>{p||_(Ve,!0)})}else pe(d,a),_(Ee,!1);return()=>a=I}})}function tn(e,t,n=!1){var i=e,r=null,s=null,l=null,v=n?Re:0,a=!1;const u=(f,d=!0)=>{a=!0,o(d,f)},o=(f,d)=>{l!==(l=f)&&(l?(r?J(r):d&&(r=z(()=>d(i))),s&&se(s,()=>{s=null})):(s?J(s):d&&(s=z(()=>d(i))),r&&se(r,()=>{r=null})))};Pe(()=>{a=!1,t(u),a||o(null,null)},v)}function or(e,t){return t}function lr(e,t,n,i){for(var r=[],s=t.length,l=0;l<s;l++)st(t[l].e,r,!0);var v=s>0&&r.length===0&&n!==null;if(v){var a=n.parentNode;Nn(a),a.append(n),i.clear(),j(e,t[0].prev,t[s-1].next)}zt(r,()=>{for(var u=0;u<s;u++){var o=t[u];v||(i.delete(o.k),j(e,o.prev,o.next)),W(o.e,!v)}})}function ar(e,t,n,i,r,s=null){var l=e,v={flags:t,items:new Map,first:null},a=null,u=!1;Pe(()=>{var o=n(),f=et(o)?o:o==null?[]:tt(o),d=f.length;if(!(u&&d===0)){u=d===0;{var c=P;fr(f,v,l,r,t,(c.f&X)!==0,i)}s!==null&&(d===0?a?J(a):a=z(()=>s(l)):a!==null&&se(a,()=>{a=null})),n()}})}function fr(e,t,n,i,r,s,l){var v=e.length,a=t.items,u=t.first,o=u,f,d=null,c=[],p=[],_,y,g,h;for(h=0;h<v;h+=1){if(_=e[h],y=l(_,h),g=a.get(y),g===void 0){var w=o?o.e.nodes_start:n;d=cr(w,t,d,d===null?t.first:d.next,_,y,h,i,r),a.set(y,d),c=[],p=[],o=d.next;continue}if(ur(g,_,h),(g.e.f&X)!==0&&J(g.e),g!==o){if(f!==void 0&&f.has(g)){if(c.length<p.length){var C=p[0],E;d=C.prev;var F=c[0],te=c[c.length-1];for(E=0;E<c.length;E+=1)yt(c[E],C,n);for(E=0;E<p.length;E+=1)f.delete(p[E]);j(t,F.prev,te.next),j(t,d,F),j(t,te,C),o=C,d=te,h-=1,c=[],p=[]}else f.delete(g),yt(g,o,n),j(t,g.prev,g.next),j(t,g,d===null?t.first:d.next),j(t,d,g),d=g;continue}for(c=[],p=[];o!==null&&o.k!==y;)(s||(o.e.f&X)===0)&&(f??(f=new Set)).add(o),p.push(o),o=o.next;if(o===null)continue;g=o}c.push(g),d=g,o=g.next}if(o!==null||f!==void 0){for(var ce=f===void 0?[]:tt(f);o!==null;)(s||(o.e.f&X)===0)&&ce.push(o),o=o.next;var je=ce.length;if(je>0){var rn=null;lr(t,ce,rn,a)}}m.first=t.first&&t.first.e,m.last=d&&d.e}function ur(e,t,n,i){pe(e.v,t),e.i=n}function cr(e,t,n,i,r,s,l,v,a){var u=(a&In)!==0,o=(a&Ln)===0,f=u?o?Te(r):O(r):r,d=(a&On)===0?l:O(l),c={i:d,v:f,k:s,a:null,e:null,prev:n,next:i};try{return c.e=z(()=>v(e,f,d),Yn),c.e.prev=n&&n.e,c.e.next=i&&i.e,n===null?t.first=c:(n.next=c,n.e.next=c.e),i!==null&&(i.prev=c,i.e.prev=c.e),c}finally{}}function yt(e,t,n){for(var i=e.next?e.next.e.nodes_start:n,r=t?t.e.nodes_start:n,s=e.e.nodes_start;s!==i;){var l=De(s);r.before(s),s=l}}function j(e,t,n){t===null?e.first=n:(t.next=n,t.e.next=n&&n.e),n!==null&&(n.prev=t,n.e.prev=t&&t.e)}function dr(e,t,...n){var i=e,r=Et,s;Pe(()=>{r!==(r=t())&&(s&&(W(s),s=null),s=z(()=>r(i,...n)))},Re)}function mt(e,t,n,i){var r=e.__attributes??(e.__attributes={});r[t]!==(r[t]=n)&&(t==="style"&&"__styles"in e&&(e.__styles={}),t==="loading"&&(e[gn]=n),n==null?e.removeAttribute(t):typeof n!="string"&&pr(e).includes(t)?e[t]=n:e.setAttribute(t,n))}var Pt=new Map;function pr(e){var t=Pt.get(e.nodeName);if(t)return t;Pt.set(e.nodeName,t=[]);for(var n,i=Oe(e),r=Element.prototype;r!==i;){n=wt(i);for(var s in n)n[s].set&&t.push(s);i=Oe(i)}return t}function bt(e,t){return e===t||(e==null?void 0:e[Z])===t}function vr(e={},t,n,i){return it(()=>{var r,s;return Rt(()=>{r=s,s=[],lt(()=>{e!==n(...s)&&(t(e,...s),r&&bt(n(...r),e)&&t(null,...r))})}),()=>{Vt(()=>{s&&bt(n(...s),e)&&t(null,...s)})}}),e}function gr(e=!1){const t=x,n=t.l.u;if(!n)return;let i=()=>Jn(t.s);if(e){let r=0,s={};const l=Ut(()=>{let v=!1;const a=t.s;for(const u in a)a[u]!==s[u]&&(s[u]=a[u],v=!0);return v&&r++,r});i=()=>b(l)}n.b.length&&Xn(()=>{xt(t,i),We(n.b)}),Ue(()=>{const r=lt(()=>n.m.map(cn));return()=>{for(const s of r)typeof s=="function"&&s()}}),n.a.length&&Ue(()=>{xt(t,i),We(n.a)})}function xt(e,t){if(e.l.s)for(const n of e.l.s)b(n);t()}let Be=!1;function _r(e){var t=Be;try{return Be=!1,[e(),Be]}finally{Be=t}}function hr(e){for(var t=m,n=m;t!==null&&(t.f&(k|ye))===0;)t=t.parent;try{return M(t),e()}finally{M(n)}}function yr(e,t,n,i){var w;var r=(n&Tn)!==0,s=!1,l;[l,s]=_r(()=>e[t]);var v=Z in e||vn in e,a=((w=ie(e,t))==null?void 0:w.set)??(v&&r&&t in e?C=>e[t]=C:void 0),u=i,o=!0,f=!1,d=()=>(f=!0,o&&(o=!1,u=i),u),c;if(c=()=>{var C=e[t];return C===void 0?d():(o=!0,f=!1,C)},a){var p=e.$$legacy;return function(C,E){return arguments.length>0?((!E||p||s)&&a(E?c():C),C):c()}}var _=!1,y=!1,g=Te(l),h=hr(()=>Ut(()=>{var C=c(),E=b(g);return _?(_=!1,y=!0,E):(y=!1,g.v=C)}));return function(C,E){if(arguments.length>0){const F=E?b(h):N(C);return h.equals(F)||(_=!0,L(g,F),f&&u!==void 0&&(u=F),lt(()=>b(h))),C}return b(h)}}const mr="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(mr);Bn();async function Pr(){if(!navigator.gpu)return Promise.reject("WebGPU is not supported on this browser");const e=await navigator.gpu.requestAdapter();return e?e.requestDevice():Promise.reject("Failed to get GPU adapter")}const ke=[[{X:50,Y:50},{X:450,Y:50},{X:450,Y:450},{X:50,Y:450},{X:50,Y:50}],[{X:150,Y:150},{X:200,Y:150},{X:200,Y:200},{X:150,Y:200},{X:150,Y:150}],[{X:300,Y:100},{X:350,Y:100},{X:350,Y:150},{X:300,Y:150},{X:300,Y:100}],[{X:100,Y:300},{X:150,Y:300},{X:150,Y:350},{X:100,Y:350},{X:100,Y:300}],[{X:300,Y:300},{X:400,Y:300},{X:400,Y:400},{X:300,Y:400},{X:300,Y:300}]];class he{constructor(t,n,i,r){A(this,"edgesBuffer");A(this,"maxIntersectionsPerSegment",32);A(this,"bindGroupLayout");A(this,"pipeline");A(this,"edgesCount");this.device=r;const s=he.convertPolygonToEdges(t),l=new Float32Array(s);this.edgesCount=s.length,this.edgesBuffer=this.device.createBuffer({size:l.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0,label:"edgesBuffer"}),new Float32Array(this.edgesBuffer.getMappedRange()).set(l),this.edgesBuffer.unmap(),this.bindGroupLayout=this.device.createBindGroupLayout({entries:n}),this.pipeline=this.device.createComputePipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),compute:{module:this.device.createShaderModule({code:i}),entryPoint:"main"}})}static convertPolygonToEdges(t){const n=[];for(const i of t)for(let r=0;r<i.length;r++){const s=i[r],l=i[(r+1)%i.length];n.push(s.X,s.Y,l.X,l.Y)}return n}static flattenPointList(t){return t.flatMap(n=>[n.X,n.Y])}}const br=`
@group(0) @binding(0) var<storage, read> lines: array<vec4f>;
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> intersectionsBuffer: array<vec3f>;
@group(0) @binding(3) var<storage, read_write> clippedLinesBuffer: array<vec4f>;

fn lineIntersection(p1: vec2f, p2: vec2f, p3: vec2f, p4: vec2f) -> vec3f {
  let s1 = vec2<f32>(p2.x - p1.x, p2.y - p1.y);
  let s2 = vec2<f32>(p4.x - p3.x, p4.y - p3.y);

  let denom = -s2.x * s1.y + s1.x * s2.y;
  let epsilon = 1e-6;

  if (abs(denom) < epsilon) { // Adjust epsilon as needed
    return vec3f(-1.0, -1.0, 0.0); // No intersection
  }

  let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
  let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

  if (s >= -epsilon && s <= 1.0 + epsilon && t >= -epsilon && t <= 1.0 + epsilon) {
    return vec3f(p1.x + t * s1.x, p1.y + t * s1.y, 1.0);
  }

  return vec3f(-1.0, -1.0, 0.0); // No intersection
}

fn isPointInsidePolygon(testPoint: vec2<f32>) -> bool {
  var leftNodes = 0;
  var rightNodes = 0;

  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];

    // Check if the edge crosses the Y threshold of the test point
    if ((edge.y <= testPoint.y && edge.w > testPoint.y) || 
      (edge.y > testPoint.y && edge.w <= testPoint.y)) {
      
      // Calculate the X-coordinate of the intersection
      let slope = (edge.z - edge.x) / (edge.z - edge.y);
      let intersectX = edge.x + (testPoint.y - edge.y) * slope;

      // Count nodes on the left or right side
      if (intersectX < testPoint.x) {
        leftNodes = leftNodes + 1;
      } else {
        rightNodes = rightNodes + 1;
      }
    }
  }

  // Determine if the point is inside the polygon
  return (leftNodes % 2 != 0) && (rightNodes % 2 != 0);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let lineIndex = id.x;
  if (lineIndex >= arrayLength(&lines)) {
    return;
  }

  // Calculate buffer offsets dynamically
  let totalIntersections = arrayLength(&intersectionsBuffer); // Total intersections in the buffer
  let intersectionsPerLine = totalIntersections / arrayLength(&lines);
  let baseOffset = lineIndex * intersectionsPerLine;

  // Clipped lines offset
  let clippedBaseOffset = lineIndex * intersectionsPerLine;

  var count = 0u;
  var clippedCount = 0u;

  // Process edges and find intersections
  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let result = lineIntersection(lines[lineIndex].xy, lines[lineIndex].zw, edge.xy, edge.zw);

    if (result.z == 1.0) { // check if intersection is valid
      if (count < intersectionsPerLine) {
        intersectionsBuffer[baseOffset + count] = result;
        count = count + 1u;
      }
    }
  }

  // Sort intersections directly in the buffer
  for (var i = 0u; i < count; i = i + 1u) {
    for (var j = i + 1u; j < count; j = j + 1u) {
      let d1 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + i].x, intersectionsBuffer[baseOffset + i].y),
        vec2<f32>(lines[lineIndex].x, lines[lineIndex].y)
      );
      let d2 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + j].x, intersectionsBuffer[baseOffset + j].y),
        vec2<f32>(lines[lineIndex].x, lines[lineIndex].y)
      );

      if (d2 < d1) {
        let temp = intersectionsBuffer[baseOffset + i];
        intersectionsBuffer[baseOffset + i] = intersectionsBuffer[baseOffset + j];
        intersectionsBuffer[baseOffset + j] = temp;
      }
    }
  }

  let p1 = lines[lineIndex].xy;
  let p2 = lines[lineIndex].zw;

  let p1Inside = isPointInsidePolygon(p1);
  let p2Inside = isPointInsidePolygon(p2);

  if (clippedCount == 1u) {
    if (!p1Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset].xy,
        lines[lineIndex].zw
      );
      clippedCount = clippedCount + 1u;
    } else if (!p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;
    }
  } else {
    if (!p1Inside && !p2Inside) {
      // Create clipped line segments from pairs of intersections
      for (var i = 0u; i + 1u < count; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
    } else if (p1Inside && !p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;

      for (var i = 1u; i + 1u < count; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
    } else if (!p1Inside && p2Inside) {
      for (var i = 0u; i + 1u < count - 1u; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset + count - 1u].xy,
        p2,
      );
      clippedCount = clippedCount + 1u;
    } else {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;
      
      // Create clipped line segments from pairs of intersections
      for (var i = 1u; i + 1u < count - 1; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }

      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset + count - 1].xy,
        lines[lineIndex].zw,
      );
      clippedCount = clippedCount + 1u;
    }
  }

  // Optional: Mark unused slots in buffers with a sentinel value
  for (var i = count; i < intersectionsPerLine; i = i + 1u) {
    intersectionsBuffer[baseOffset + i] = vec3f(-1.0, -1.0, 0.0);
  }
}

`,xr=[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}];class at extends he{constructor({device:n,polygon:i,maxIntersectionsPerLine:r=128}){super(i,xr,br,n);A(this,"maxIntersectionsPerLine");this.maxIntersectionsPerLine=r;const s=new Float32Array(he.convertPolygonToEdges(i));this.edgesBuffer=this.device.createBuffer({size:s.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0,label:"edgesBuffer"}),new Float32Array(this.edgesBuffer.getMappedRange()).set(s),this.edgesBuffer.unmap()}async clip(n){const i=new Float32Array(at.flattenPointList(n.flat())),r=this.device.createBuffer({size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0});new Float32Array(r.getMappedRange()).set(i),r.unmap();const s=this.device.createBuffer({size:n.length*this.maxIntersectionsPerLine*4*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),l=this.device.createBuffer({size:s.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),v=3*Float32Array.BYTES_PER_ELEMENT,a=n.length*this.maxIntersectionsPerLine,u=this.device.createBuffer({size:a*v,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});(()=>{const y=new Float32Array(a*2).fill(-1);this.device.queue.writeBuffer(u,0,y)})();const f=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:this.edgesBuffer}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:s}}]}),d=this.device.createCommandEncoder(),c=d.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,f),c.dispatchWorkgroups(n.length),c.end(),d.copyBufferToBuffer(s,0,l,0,s.size),this.device.queue.submit([d.finish()]),await l.mapAsync(GPUMapMode.READ);const p=new Float32Array(l.getMappedRange()),_=[];for(let y=0;y<p.length;y+=4)_.push([{X:p[y],Y:p[y+1]},{X:p[y+2],Y:p[y+3]}]);return l.unmap(),_.filter(y=>!y.every(g=>g.X===0&&g.Y===0))}}function Cr(e,t){return`
@group(0) @binding(0) var<storage, read> vertices: array<vec4f>;
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> clippedPolylineBuffer: array<vec4f>;
@group(0) @binding(3) var<uniform> maxClippedVerticesPerSegment: u32;

var<private> threadIndex: u32;
var<private> bufferIndex: u32;

fn lineIntersection(p1: vec2f, p2: vec2f, p3: vec2f, p4: vec2f) -> vec3f {
  let s1 = vec2<f32>(p2.x - p1.x, p2.y - p1.y);
  let s2 = vec2<f32>(p4.x - p3.x, p4.y - p3.y);

  let denom = -s2.x * s1.y + s1.x * s2.y;
  let epsilon = 1e-6;

  if (abs(denom) < epsilon) { // Adjust epsilon as needed
    return vec3f(-1.0, -1.0, 0.0); // No intersection
  }

  let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
  let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

  if (s >= -epsilon && s <= 1.0 + epsilon && t >= -epsilon && t <= 1.0 + epsilon) {
    return vec3f(p1.x + t * s1.x, p1.y + t * s1.y, 1.0);
  }

  return vec3f(-1.0, -1.0, 0.0); // No intersection
}

struct LineIntersectionsData {
  intersections: array<vec2f, ${t}>,
  intersectionCount: u32
}

fn getLineIntersectionsData(p1: vec4f, p2: vec4f) -> LineIntersectionsData {
  var intersections: array<vec2f, ${t}>;
  var intersectionCount = 0u;

  for (var j = 0u; j < arrayLength(&edges); j = j + 1u) {
    let edge = edges[j];
    let intersection = lineIntersection(p1.xy, p2.xy, edge.xy, edge.zw);

    if (intersection.z == 1.0) {
      intersections[intersectionCount] = intersection.xy;
      intersectionCount = intersectionCount + 1u;
    }
  }

  if (intersectionCount > 1u) {
    for (var k = 0u; k < intersectionCount - 1u; k = k + 1u) {
      for (var l = k + 1u; l < intersectionCount; l = l + 1u) {
        if (distance(p1.xy, intersections[l]) < distance(p1.xy, intersections[k])) {
          let temp = intersections[k];
          intersections[k] = intersections[l];
          intersections[l] = temp;
        }
      }
    }
  }

  return LineIntersectionsData(intersections, intersectionCount);
}

fn isPointInsidePolygon(point: vec2f) -> bool {
  var leftNodes = 0;
  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let start = edge.xy;
    let end = edge.zw;
    if ((start.y <= point.y && end.y > point.y) || (start.y > point.y && end.y <= point.y)) {
      let slope = (end.x - start.x) / (end.y - start.y);
      let intersectX = start.x + (point.y - start.y) * slope;
      if (point.x < intersectX) {
        leftNodes = leftNodes + 1;
      }
    }
  }
  return (leftNodes % 2) != 0;
}

fn addPoint(point: vec2f) {
  clippedPolylineBuffer[bufferIndex] = vec4f(point, 0.0, 0.0);
  bufferIndex = bufferIndex + 1u;
  let segmentStart = threadIndex * maxClippedVerticesPerSegment;
  clippedPolylineBuffer[segmentStart].w = f32(bufferIndex - segmentStart);
}

fn addSentinel() {
  clippedPolylineBuffer[bufferIndex] = vec4f(-1.0, -1.0, -1.0, -1.0);
  bufferIndex = bufferIndex + 1u;
  let segmentStart = threadIndex * maxClippedVerticesPerSegment;
  clippedPolylineBuffer[segmentStart].w = f32(bufferIndex - segmentStart);
}

@compute @workgroup_size(${e})
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
  threadIndex = globalId.x;

  if (threadIndex == 0u || threadIndex >= arrayLength(&vertices) - 1u) {
    return; // No segment to process
  }
  
  let p1 = vertices[threadIndex - 1u];
  let p2 = vertices[threadIndex];

  if (u32(p1.z) != u32(p2.z)) {
    return; // Skip processing, p1 and p2 are from different polylines
  }

  let p1Inside = isPointInsidePolygon(p1.xy);
  let p2Inside = isPointInsidePolygon(p2.xy);

  let intersectionsData = getLineIntersectionsData(p1, p2);
  let intersections = intersectionsData.intersections;
  let intersectionCount = intersectionsData.intersectionCount;

  bufferIndex = threadIndex * maxClippedVerticesPerSegment;

  if (p1Inside && p2Inside) {
    addPoint(p1.xy);

    if (intersectionCount == 0u) {
      addPoint(p2.xy);
    } 
    else  {
      addPoint(intersections[0u]);
      addSentinel();

      for (var i = 1u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }

      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2.xy);
    }
  } else if (p1Inside && !p2Inside) {
    addPoint(p1.xy);
    addPoint(intersections[0]);
    addSentinel();

    if (intersectionCount > 1u) {
      for (var i = 1u; i < intersectionCount; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
    }
  } else if (!p1Inside && p2Inside) {
    if (intersectionCount == 1u) {
      addPoint(intersections[0]);
      addPoint(p2.xy);
    } else {
      for (var i = 0u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2.xy);
      addSentinel();
    }
  } else {
    for (var i = 0u; i + 1u < intersectionCount; i = i + 2u) {
      addPoint(intersections[i]);
      addPoint(intersections[i + 1u]);
      addSentinel();
    }
  }
}
`}const wr=[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}];class ft extends he{constructor({device:n,polygon:i,maxIntersectionsPerSegment:r,maxClippedVerticesPerSegment:s,workgroupSize:l}){const v=l??64,a=r??64,u=s??64;super(i,wr,Cr(v,a),n);A(this,"maxClippedVerticesPerSegment");A(this,"workgroupSize");A(this,"polylinesLength",0);A(this,"verticesLength",0);A(this,"segmentsCount",0);this.maxIntersectionsPerSegment=a,this.workgroupSize=v,this.maxClippedVerticesPerSegment=u}async clip(n){performance.mark("rawClippingStart"),this.polylinesLength=n.length;const i=n.flatMap((g,h)=>g.flatMap((w,C)=>[w.X,w.Y,h,C]));this.verticesLength=i.length;const r=new Float32Array(i),s=this.device.createBuffer({size:r.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0});new Float32Array(s.getMappedRange()).set(r),s.unmap();const l=n.reduce((g,h)=>(g+=h.length>2?h.length-1:h.length,g),0);console.log(`Segments: ${l}`),this.segmentsCount=l;const v=this.maxClippedVerticesPerSegment*4,a=this.device.createBuffer({size:l*v*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),u=this.device.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([this.maxClippedVerticesPerSegment]));const o=Math.ceil(l/this.workgroupSize),f=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:this.edgesBuffer}},{binding:2,resource:{buffer:a}},{binding:3,resource:{buffer:u}}]}),d=this.device.createCommandEncoder(),c=d.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,f),c.dispatchWorkgroups(o),c.end();const p=this.device.createBuffer({size:a.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST,label:"readBuffer"});d.copyBufferToBuffer(a,0,p,0,a.size),this.device.queue.submit([d.finish()]),await p.mapAsync(GPUMapMode.READ);const _=new Float32Array(p.getMappedRange());performance.mark("rawClippingEnd"),performance.measure("rawClipping","rawClippingStart","rawClippingEnd"),console.log(`Raw clipping takes ${performance.getEntriesByName("rawClipping")[0].duration/1e3} sec`);const y=this.parseClippedPolyline(_,l);return p.unmap(),y}parseClippedPolyline(n,i){const r=[];for(let s=0;s<i;s+=1){const l=s*this.maxClippedVerticesPerSegment,v=n[l*4+3];let a=[];for(let u=0;u<v;u+=1){const o=l+u,f=n[o*4+0],d=n[o*4+1],c=n[o*4+2],p=n[o*4+3];[f,d,c,p].every(_=>_===0)||(c===-1?a.length>0&&(r.push(a),a=[]):f!==void 0&&d!==void 0&&a.push({X:f,Y:d}))}a.length>0&&r.push(a)}return r.reduce((s,l,v)=>{if(v===0)s.push(l);else{const a=s[s.length-1],u=a[a.length-1],o=l[0];ft.arePointsEqual(u,o)?a.push(...l.slice(1)):s.push(l)}return s},[])}static arePointsEqual(n,i){return Math.abs(n.X-i.X)<Number.EPSILON&&Math.abs(n.Y-i.Y)<Number.EPSILON}}var Er=$(`<p>Clipping (instantiation, loading, clipping, and reading the
            results): <b> </b></p>`),Br=$('<fieldset class="svelte-1ohsw66"><legend class="svelte-1ohsw66"> </legend> <div class="example svelte-1ohsw66"><div class="container svelte-1ohsw66"><canvas class="svelte-1ohsw66"></canvas> <div class="results svelte-1ohsw66"><!> <!></div></div></div></fieldset>');function nn(e,t){xe(t,!0);let n=yr(t,"canvas",15);var i=Br(),r=B(i),s=B(r),l=G(r,2),v=B(l),a=B(v);vr(a,c=>n(c),()=>n());var u=G(a,2),o=B(u);{var f=c=>{var p=Er(),_=G(B(p)),y=B(_);ae(()=>fe(y,`${t.timing.toFixed(4)??""} sec`)),R(c,p)};tn(o,c=>{t.timing&&c(f)})}var d=G(o,2);dr(d,()=>t.children??Et),ae(()=>{fe(s,t.title),mt(a,"width",t.canvasSize),mt(a,"height",t.canvasSize)}),R(e,i),Ce()}var Sr=$("<span>Polygon edges: <b> </b></span> <span>Lines to clip: <b></b></span>",1);function Ir(e,t){xe(t,!0);let n=de(void 0);const i=50,r=500,s=r/i,l=new Array(i).fill(null).map((f,d)=>{const p=r;return[{X:0,Y:d*s},{X:p,Y:d*s}]});let v=de(null);performance.mark("LineClipperStart");const a=new at({device:t.device,polygon:ke});let u=N(a.edgesCount);const o=async()=>{if(b(n)){const f=b(n).getContext("2d"),d=await a.clip(l);performance.mark("LineClipperEnd"),performance.measure("LineClipping","LineClipperStart","LineClipperEnd"),L(v,performance.getEntriesByName("LineClipping")[0].duration/1e3),f.strokeStyle="white",ke.forEach(c=>{f.beginPath(),c.forEach((p,_)=>{_===0?f.moveTo(p.X,p.Y):f.lineTo(p.X,p.Y)}),f.closePath(),f.stroke()}),f.strokeStyle="rgba(255, 0, 0, 0.45)",l.forEach(c=>{c.forEach((p,_)=>{_===0?(f.beginPath(),f.moveTo(p.X,p.Y)):(f.lineTo(p.X,p.Y),f.stroke())})}),f.strokeStyle="rgba(0, 245, 0)",d.forEach(c=>{c.forEach((p,_)=>{_===0?(f.beginPath(),f.moveTo(p.X,p.Y)):(f.lineTo(p.X,p.Y),f.stroke())})})}};Ue(()=>{o()}),nn(e,{title:"LineClipper",get timing(){return b(v)},canvasSize:r,get canvas(){return b(n)},set canvas(f){L(n,N(f))},children:(f,d)=>{var c=Sr(),p=Ke(c),_=G(B(p)),y=B(_),g=G(p,2),h=G(B(g));h.textContent=i,ae(()=>fe(y,u)),R(f,c)},$$slots:{default:!0}}),Ce()}var Or=$("<span> <b> </b></span>");function Lr(e,t){xe(t,!0);let n=de(void 0),i=de(void 0);const r=500;let s=de(null);const l=Array.from({length:10},(o,f)=>{const d=130+f*10,c=.01+f*.005,p=0,_=r,y=100,g=[];for(let h=p;h<=_;h+=(_-p)/y){const w=250+d*Math.sin(c*h);g.push({X:h,Y:w})}return g}),v=o=>{switch(o){case"edges":return"Polygon edges";case"polylines":return"Polylines to clip";case"segments":return"Polyline segments";case"vertices":return"Total vertices"}};performance.mark("PolylineClipperStart");const a=new ft({device:t.device,polygon:ke}),u=async()=>{if(b(n)){const o=b(n).getContext("2d"),f=await a.clip(l);performance.mark("PolylineClipperEnd"),performance.measure("PolylineClipping","PolylineClipperStart","PolylineClipperEnd"),L(s,performance.getEntriesByName("PolylineClipping")[0].duration/1e3),o.strokeStyle="white",ke.forEach(d=>{o.beginPath(),d.forEach((c,p)=>{p===0?o.moveTo(c.X,c.Y):o.lineTo(c.X,c.Y)}),o.closePath(),o.stroke()}),o.strokeStyle="rgba(255, 0, 0, 0.45)",l.forEach(d=>{d.forEach((c,p,_)=>{p===0?(o.beginPath(),o.moveTo(c.X,c.Y)):p===_.length-1?(o.lineTo(c.X,c.Y),o.stroke()):o.lineTo(c.X,c.Y)})}),o.strokeStyle="rgba(0, 245, 0)",f.forEach(d=>{d.forEach((c,p)=>{p===0?(o.beginPath(),o.moveTo(c.X,c.Y)):o.lineTo(c.X,c.Y)}),o.stroke()}),L(i,N({edges:a.edgesCount,polylines:a.polylinesLength,segments:a.segmentsCount,vertices:a.verticesLength}))}};Ue(()=>{u()}),nn(e,{title:"PolylineClipper",get timing(){return b(s)},canvasSize:r,get canvas(){return b(n)},set canvas(o){L(n,N(o))},children:(o,f)=>{var d=_t(),c=Ke(d);{var p=_=>{var y=_t(),g=Ke(y);ar(g,17,()=>Object.entries(b(i)),or,(h,w)=>{let C=()=>b(w)[0],E=()=>b(w)[1];var F=Or(),te=B(F);ae(()=>fe(te,`${v(C())??""}: `));var ce=G(te),je=B(ce);ae(()=>fe(je,E())),R(h,F)}),R(_,y)};tn(c,_=>{b(i)&&_(p)})}R(o,d)},$$slots:{default:!0}}),Ce()}var Tr=$('<div class="content svelte-q590e0"><!> <!></div>'),Ar=$('<div class="error svelte-q590e0"><span> </span></div>'),Ur=$("<p>Loading</p>"),Yr=$('<div class="container svelte-q590e0"><header class="svelte-q590e0"><h1>Line & Polyline Clipping With WebGPU Compute Shaders</h1> <h4>Both utilities are not fully tested and might produce incorrect results</h4> <hr class="svelte-q590e0"></header> <main class="svelte-q590e0"><!></main></div>');function kr(e,t){xe(t,!1);const n=Pr();gr();var i=Yr(),r=G(B(i),2),s=B(r);sr(s,()=>n,l=>{var v=Ur();R(l,v)},(l,v)=>{var a=Tr(),u=B(a);Ir(u,{get device(){return b(v)}});var o=G(u,2);Lr(o,{get device(){return b(v)}}),R(l,a)},(l,v)=>{var a=Ar(),u=B(a),o=B(u);ae(()=>fe(o,b(v))),R(l,a)}),R(e,i),Ce()}rr(kr,{target:document.getElementById("app")});
