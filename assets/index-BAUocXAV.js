var ln=Object.defineProperty;var an=(e,t,n)=>t in e?ln(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var N=(e,t,n)=>an(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const wt=!1;var tt=Array.isArray,nt=Array.from,fn=Object.defineProperty,oe=Object.getOwnPropertyDescriptor,Bt=Object.getOwnPropertyDescriptors,un=Object.prototype,cn=Array.prototype,Ae=Object.getPrototypeOf;const St=()=>{};function dn(e){return typeof(e==null?void 0:e.then)=="function"}function pn(e){return e()}function $e(e){for(var t=0;t<e.length;t++)e[t]()}const k=2,It=4,Me=8,rt=16,R=32,me=64,Ke=128,re=256,Ue=512,A=1024,$=2048,Pe=4096,X=8192,de=16384,vn=32768,Xe=65536,gn=1<<17,_n=1<<19,Ot=1<<20,te=Symbol("$state"),hn=Symbol("legacy props"),yn=Symbol("");function Lt(e){return e===this.v}function mn(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function Tt(e){return!mn(e,this.v)}function Pn(e){throw new Error("effect_in_teardown")}function bn(){throw new Error("effect_in_unowned_derived")}function xn(e){throw new Error("effect_orphan")}function Cn(){throw new Error("effect_update_depth_exceeded")}function En(e){throw new Error("props_invalid_value")}function wn(){throw new Error("state_descriptors_fixed")}function Bn(){throw new Error("state_prototype_fixed")}function Sn(){throw new Error("state_unsafe_local_read")}function In(){throw new Error("state_unsafe_mutation")}let be=!1;function On(){be=!0}function O(e){return{f:0,v:e,reactions:null,equals:Lt,version:0}}function pe(e){return Ln(O(e))}function Ye(e,t=!1){var i;const n=O(e);return t||(n.equals=Tt),be&&C!==null&&C.l!==null&&((i=C.l).s??(i.s=[])).push(n),n}function Ln(e){return P!==null&&P.f&k&&(F===null?Kn([e]):F.push(e)),e}function L(e,t){return P!==null&&qe()&&P.f&(k|rt)&&(F===null||!F.includes(e))&&In(),ve(e,t)}function ve(e,t){return e.equals(t)||(e.v=t,e.version=Zt(),At(e,$),qe()&&m!==null&&m.f&A&&!(m.f&R)&&(B!==null&&B.includes(e)?(j(m,$),Ve(m)):W===null?Zn([e]):W.push(e))),t}function At(e,t){var n=e.reactions;if(n!==null)for(var i=qe(),r=n.length,s=0;s<r;s++){var a=n[s],v=a.f;v&$||!i&&a===m||(j(a,t),v&(A|re)&&(v&k?At(a,Pe):Ve(a)))}}const Tn=1,An=2,Un=16,Yn=1,Nn=2,kn=8,Rn=1,Gn=2,I=Symbol();let Dn=!1;function G(e,t=null,n){if(typeof e!="object"||e===null||te in e)return e;const i=Ae(e);if(i!==un&&i!==cn)return e;var r=new Map,s=tt(e),a=O(0);s&&r.set("length",O(e.length));var v;return new Proxy(e,{defineProperty(l,u,o){(!("value"in o)||o.configurable===!1||o.enumerable===!1||o.writable===!1)&&wn();var f=r.get(u);return f===void 0?(f=O(o.value),r.set(u,f)):L(f,G(o.value,v)),!0},deleteProperty(l,u){var o=r.get(u);if(o===void 0)u in l&&r.set(u,O(I));else{if(s&&typeof u=="string"){var f=r.get("length"),c=Number(u);Number.isInteger(c)&&c<f.v&&L(f,c)}L(o,I),ct(a)}return!0},get(l,u,o){var p;if(u===te)return e;var f=r.get(u),c=u in l;if(f===void 0&&(!c||(p=oe(l,u))!=null&&p.writable)&&(f=O(G(c?l[u]:I,v)),r.set(u,f)),f!==void 0){var d=b(f);return d===I?void 0:d}return Reflect.get(l,u,o)},getOwnPropertyDescriptor(l,u){var o=Reflect.getOwnPropertyDescriptor(l,u);if(o&&"value"in o){var f=r.get(u);f&&(o.value=b(f))}else if(o===void 0){var c=r.get(u),d=c==null?void 0:c.v;if(c!==void 0&&d!==I)return{enumerable:!0,configurable:!0,value:d,writable:!0}}return o},has(l,u){var d;if(u===te)return!0;var o=r.get(u),f=o!==void 0&&o.v!==I||Reflect.has(l,u);if(o!==void 0||m!==null&&(!f||(d=oe(l,u))!=null&&d.writable)){o===void 0&&(o=O(f?G(l[u],v):I),r.set(u,o));var c=b(o);if(c===I)return!1}return f},set(l,u,o,f){var E;var c=r.get(u),d=u in l;if(s&&u==="length")for(var p=o;p<c.v;p+=1){var g=r.get(p+"");g!==void 0?L(g,I):p in l&&(g=O(I),r.set(p+"",g))}c===void 0?(!d||(E=oe(l,u))!=null&&E.writable)&&(c=O(void 0),L(c,G(o,v)),r.set(u,c)):(d=c.v!==I,L(c,G(o,v)));var y=Reflect.getOwnPropertyDescriptor(l,u);if(y!=null&&y.set&&y.set.call(f,o),!d){if(s&&typeof u=="string"){var _=r.get("length"),h=Number(u);Number.isInteger(h)&&h>=_.v&&L(_,h+1)}ct(a)}return!0},ownKeys(l){b(a);var u=Reflect.ownKeys(l).filter(c=>{var d=r.get(c);return d===void 0||d.v!==I});for(var[o,f]of r)f.v!==I&&!(o in l)&&u.push(o);return u},setPrototypeOf(){Bn()}})}function ct(e,t=1){L(e,e.v+t)}var dt,Ut,Yt;function Mn(){if(dt===void 0){dt=window;var e=Element.prototype,t=Node.prototype;Ut=oe(t,"firstChild").get,Yt=oe(t,"nextSibling").get,e.__click=void 0,e.__className="",e.__attributes=null,e.__styles=null,e.__e=void 0,Text.prototype.__t=void 0}}function Nt(e=""){return document.createTextNode(e)}function Ne(e){return Ut.call(e)}function Fe(e){return Yt.call(e)}function w(e,t){return Ne(e)}function Ze(e,t){{var n=Ne(e);return n instanceof Comment&&n.data===""?Fe(n):n}}function D(e,t=1,n=!1){let i=e;for(;t--;)i=Fe(i);return i}function Xn(e){e.textContent=""}function ke(e){var t=k|$;m===null?t|=re:m.f|=Ot;var n=P!==null&&P.f&k?P:null;const i={children:null,ctx:C,deps:null,equals:Lt,f:t,fn:e,reactions:null,v:null,version:0,parent:n??m};return n!==null&&(n.children??(n.children=[])).push(i),i}function Fn(e){const t=ke(e);return t.equals=Tt,t}function kt(e){var t=e.children;if(t!==null){e.children=null;for(var n=0;n<t.length;n+=1){var i=t[n];i.f&k?it(i):Z(i)}}}function qn(e){for(var t=e.parent;t!==null;){if(!(t.f&k))return t;t=t.parent}return null}function Rt(e){var t,n=m;q(qn(e));try{kt(e),t=Jt(e)}finally{q(n)}return t}function Gt(e){var t=Rt(e),n=(se||e.f&re)&&e.deps!==null?Pe:A;j(e,n),e.equals(t)||(e.v=t,e.version=Zt())}function it(e){kt(e),he(e,0),j(e,de),e.v=e.children=e.deps=e.ctx=e.reactions=null}function Dt(e){m===null&&P===null&&xn(),P!==null&&P.f&re&&bn(),lt&&Pn()}function zn(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function xe(e,t,n,i=!0){var r=(e&me)!==0,s=m,a={ctx:C,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:e|$,first:null,fn:t,last:null,next:null,parent:r?null:s,prev:null,teardown:null,transitions:null,version:0};if(n){var v=ae;try{pt(!0),je(a),a.f|=vn}catch(o){throw Z(a),o}finally{pt(v)}}else t!==null&&Ve(a);var l=n&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&Ot)===0;if(!l&&!r&&i&&(s!==null&&zn(a,s),P!==null&&P.f&k)){var u=P;(u.children??(u.children=[])).push(a)}return a}function Re(e){Dt();var t=m!==null&&(m.f&R)!==0&&C!==null&&!C.m;if(t){var n=C;(n.e??(n.e=[])).push({fn:e,effect:m,reaction:P})}else{var i=st(e);return i}}function jn(e){return Dt(),Mt(e)}function Vn(e){const t=xe(me,e,!0);return()=>{Z(t)}}function st(e){return xe(It,e,!1)}function Mt(e){return xe(Me,e,!0)}function ue(e){return Ce(e)}function Ce(e,t=0){return xe(Me|rt|t,e,!0)}function z(e,t=!0){return xe(Me|R,e,!0,t)}function Xt(e){var t=e.teardown;if(t!==null){const n=lt,i=P;vt(!0),K(null);try{t.call(null)}finally{vt(n),K(i)}}}function Ft(e){var t=e.deriveds;if(t!==null){e.deriveds=null;for(var n=0;n<t.length;n+=1)it(t[n])}}function qt(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){var i=n.next;Z(n,t),n=i}}function Hn(e){for(var t=e.first;t!==null;){var n=t.next;t.f&R||Z(t),t=n}}function Z(e,t=!0){var n=!1;if((t||e.f&_n)&&e.nodes_start!==null){for(var i=e.nodes_start,r=e.nodes_end;i!==null;){var s=i===r?null:Fe(i);i.remove(),i=s}n=!0}qt(e,t&&!n),Ft(e),he(e,0),j(e,de);var a=e.transitions;if(a!==null)for(const l of a)l.stop();Xt(e);var v=e.parent;v!==null&&v.first!==null&&zt(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes_start=e.nodes_end=null}function zt(e){var t=e.parent,n=e.prev,i=e.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),t!==null&&(t.first===e&&(t.first=i),t.last===e&&(t.last=n))}function le(e,t){var n=[];ot(e,n,!0),jt(n,()=>{Z(e),t&&t()})}function jt(e,t){var n=e.length;if(n>0){var i=()=>--n||t();for(var r of e)r.out(i)}else t()}function ot(e,t,n){if(!(e.f&X)){if(e.f^=X,e.transitions!==null)for(const a of e.transitions)(a.is_global||n)&&t.push(a);for(var i=e.first;i!==null;){var r=i.next,s=(i.f&Xe)!==0||(i.f&R)!==0;ot(i,t,s?n:!1),i=r}}}function ne(e){Vt(e,!0)}function Vt(e,t){if(e.f&X){Ee(e)&&je(e),e.f^=X;for(var n=e.first;n!==null;){var i=n.next,r=(n.f&Xe)!==0||(n.f&R)!==0;Vt(n,r?t:!1),n=i}if(e.transitions!==null)for(const s of e.transitions)(s.is_global||t)&&s.in()}}let Ge=!1,Je=[];function Ht(){Ge=!1;const e=Je.slice();Je=[],$e(e)}function Wt(e){Ge||(Ge=!0,queueMicrotask(Ht)),Je.push(e)}function Wn(){Ge&&Ht()}const $t=0,$n=1;let Le=!1,Te=$t,ge=!1,_e=null,ae=!1,lt=!1;function pt(e){ae=e}function vt(e){lt=e}let ee=[],fe=0;let P=null;function K(e){P=e}let m=null;function q(e){m=e}let F=null;function Kn(e){F=e}let B=null,T=0,W=null;function Zn(e){W=e}let Kt=0,se=!1,C=null;function gt(e){C=e}function Zt(){return++Kt}function qe(){return!be||C!==null&&C.l===null}function Ee(e){var a,v;var t=e.f;if(t&$)return!0;if(t&Pe){var n=e.deps,i=(t&re)!==0;if(n!==null){var r;if(t&Ue){for(r=0;r<n.length;r++)((a=n[r]).reactions??(a.reactions=[])).push(e);e.f^=Ue}for(r=0;r<n.length;r++){var s=n[r];if(Ee(s)&&Gt(s),i&&m!==null&&!se&&!((v=s==null?void 0:s.reactions)!=null&&v.includes(e))&&(s.reactions??(s.reactions=[])).push(e),s.version>e.version)return!0}}i||j(e,A)}return!1}function Jn(e,t){for(var n=t;n!==null;){if(n.f&Ke)try{n.fn(e);return}catch{n.f^=Ke}n=n.parent}throw Le=!1,e}function Qn(e){return(e.f&de)===0&&(e.parent===null||(e.parent.f&Ke)===0)}function ze(e,t,n,i){if(Le){if(n===null&&(Le=!1),Qn(t))throw e;return}n!==null&&(Le=!0);{Jn(e,t);return}}function Jt(e){var c;var t=B,n=T,i=W,r=P,s=se,a=F,v=C,l=e.f;B=null,T=0,W=null,P=l&(R|me)?null:e,se=!ae&&(l&re)!==0,F=null,C=e.ctx;try{var u=(0,e.fn)(),o=e.deps;if(B!==null){var f;if(he(e,T),o!==null&&T>0)for(o.length=T+B.length,f=0;f<B.length;f++)o[T+f]=B[f];else e.deps=o=B;if(!se)for(f=T;f<o.length;f++)((c=o[f]).reactions??(c.reactions=[])).push(e)}else o!==null&&T<o.length&&(he(e,T),o.length=T);return u}finally{B=t,T=n,W=i,P=r,se=s,F=a,C=v}}function er(e,t){let n=t.reactions;if(n!==null){var i=n.indexOf(e);if(i!==-1){var r=n.length-1;r===0?n=t.reactions=null:(n[i]=n[r],n.pop())}}n===null&&t.f&k&&(B===null||!B.includes(t))&&(j(t,Pe),t.f&(re|Ue)||(t.f^=Ue),he(t,0))}function he(e,t){var n=e.deps;if(n!==null)for(var i=t;i<n.length;i++)er(e,n[i])}function je(e){var t=e.f;if(!(t&de)){j(e,A);var n=m,i=C;m=e;try{t&rt?Hn(e):qt(e),Ft(e),Xt(e);var r=Jt(e);e.teardown=typeof r=="function"?r:null,e.version=Kt}catch(s){ze(s,e,n,i||e.ctx)}finally{m=n}}}function Qt(){if(fe>1e3){fe=0;try{Cn()}catch(e){if(_e!==null)ze(e,_e,null);else throw e}}fe++}function en(e){var t=e.length;if(t!==0){Qt();var n=ae;ae=!0;try{for(var i=0;i<t;i++){var r=e[i];r.f&A||(r.f^=A);var s=[];tn(r,s),tr(s)}}finally{ae=n}}}function tr(e){var t=e.length;if(t!==0)for(var n=0;n<t;n++){var i=e[n];if(!(i.f&(de|X)))try{Ee(i)&&(je(i),i.deps===null&&i.first===null&&i.nodes_start===null&&(i.teardown===null?zt(i):i.fn=null))}catch(r){ze(r,i,null,i.ctx)}}}function nr(){if(ge=!1,fe>1001)return;const e=ee;ee=[],en(e),ge||(fe=0,_e=null)}function Ve(e){Te===$t&&(ge||(ge=!0,queueMicrotask(nr))),_e=e;for(var t=e;t.parent!==null;){t=t.parent;var n=t.f;if(n&(me|R)){if(!(n&A))return;t.f^=A}}ee.push(t)}function tn(e,t){var n=e.first,i=[];e:for(;n!==null;){var r=n.f,s=(r&R)!==0,a=s&&(r&A)!==0,v=n.next;if(!a&&!(r&X))if(r&Me){if(s)n.f^=A;else try{Ee(n)&&je(n)}catch(f){ze(f,n,null,n.ctx)}var l=n.first;if(l!==null){n=l;continue}}else r&It&&i.push(n);if(v===null){let f=n.parent;for(;f!==null;){if(e===f)break e;var u=f.next;if(u!==null){n=u;continue e}f=f.parent}}n=v}for(var o=0;o<i.length;o++)l=i[o],t.push(l),tn(l,t)}function nn(e){var t=Te,n=ee;try{Qt();const r=[];Te=$n,ee=r,ge=!1,en(n);var i=e==null?void 0:e();return Wn(),(ee.length>0||r.length>0)&&nn(),fe=0,_e=null,i}finally{Te=t,ee=n}}function b(e){var o;var t=e.f,n=(t&k)!==0;if(n&&t&de){var i=Rt(e);return it(e),i}if(P!==null){F!==null&&F.includes(e)&&Sn();var r=P.deps;B===null&&r!==null&&r[T]===e?T++:B===null?B=[e]:B.push(e),W!==null&&m!==null&&m.f&A&&!(m.f&R)&&W.includes(e)&&(j(m,$),Ve(m))}else if(n&&e.deps===null)for(var s=e,a=s.parent,v=s;a!==null;)if(a.f&k){var l=a;v=l,a=l.parent}else{var u=a;(o=u.deriveds)!=null&&o.includes(v)||(u.deriveds??(u.deriveds=[])).push(v);break}return n&&(s=e,Ee(s)&&Gt(s)),e.v}function at(e){const t=P;try{return P=null,e()}finally{P=t}}const rr=~($|Pe|A);function j(e,t){e.f=e.f&rr|t}function we(e,t=!1,n){C={p:C,c:null,e:null,m:!1,s:e,x:null,l:null},be&&!t&&(C.l={s:null,u:null,r1:[],r2:O(!1)})}function Be(e){const t=C;if(t!==null){const a=t.e;if(a!==null){var n=m,i=P;t.e=null;try{for(var r=0;r<a.length;r++){var s=a[r];q(s.effect),K(s.reaction),st(s.fn)}}finally{q(n),K(i)}}C=t.p,t.m=!0}return{}}function ir(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(te in e)Qe(e);else if(!Array.isArray(e))for(let t in e){const n=e[t];typeof n=="object"&&n&&te in n&&Qe(n)}}}function Qe(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let i in e)try{Qe(e[i],t)}catch{}const n=Ae(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const i=Bt(n);for(let r in i){const s=i[r].get;if(s)try{s.call(e)}catch{}}}}}const sr=new Set,_t=new Set;function Se(e){var h;var t=this,n=t.ownerDocument,i=e.type,r=((h=e.composedPath)==null?void 0:h.call(e))||[],s=r[0]||e.target,a=0,v=e.__root;if(v){var l=r.indexOf(v);if(l!==-1&&(t===document||t===window)){e.__root=t;return}var u=r.indexOf(t);if(u===-1)return;l<=u&&(a=l)}if(s=r[a]||e.target,s!==t){fn(e,"currentTarget",{configurable:!0,get(){return s||n}});var o=P,f=m;K(null),q(null);try{for(var c,d=[];s!==null;){var p=s.assignedSlot||s.parentNode||s.host||null;try{var g=s["__"+i];if(g!==void 0&&!s.disabled)if(tt(g)){var[y,..._]=g;y.apply(s,[e,..._])}else g.call(s,e)}catch(E){c?d.push(E):c=E}if(e.cancelBubble||p===t||p===null)break;s=p}if(c){for(let E of d)queueMicrotask(()=>{throw E});throw c}}finally{e.__root=t,delete e.currentTarget,K(o),q(f)}}}function or(e){var t=document.createElement("template");return t.innerHTML=e,t.content}function et(e,t){var n=m;n.nodes_start===null&&(n.nodes_start=e,n.nodes_end=t)}function J(e,t){var n=(t&Rn)!==0,i=(t&Gn)!==0,r,s=!e.startsWith("<!>");return()=>{r===void 0&&(r=or(s?e:"<!>"+e),n||(r=Ne(r)));var a=i?document.importNode(r,!0):r.cloneNode(!0);if(n){var v=Ne(a),l=a.lastChild;et(v,l)}else et(a,a);return a}}function ht(){var e=document.createDocumentFragment(),t=document.createComment(""),n=Nt();return e.append(t,n),et(t,n),e}function M(e,t){e!==null&&e.before(t)}const lr=["touchstart","touchmove"];function ar(e){return lr.includes(e)}function ce(e,t){var n=t==null?"":typeof t=="object"?t+"":t;n!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=n,e.nodeValue=n==null?"":n+"")}function fr(e,t){return ur(e,t)}const ie=new Map;function ur(e,{target:t,anchor:n,props:i={},events:r,context:s,intro:a=!0}){Mn();var v=new Set,l=f=>{for(var c=0;c<f.length;c++){var d=f[c];if(!v.has(d)){v.add(d);var p=ar(d);t.addEventListener(d,Se,{passive:p});var g=ie.get(d);g===void 0?(document.addEventListener(d,Se,{passive:p}),ie.set(d,1)):ie.set(d,g+1)}}};l(nt(sr)),_t.add(l);var u=void 0,o=Vn(()=>{var f=n??t.appendChild(Nt());return z(()=>{if(s){we({});var c=C;c.c=s}r&&(i.$$events=r),u=e(f,i)||{},s&&Be()}),()=>{var p;for(var c of v){t.removeEventListener(c,Se);var d=ie.get(c);--d===0?(document.removeEventListener(c,Se),ie.delete(c)):ie.set(c,d)}_t.delete(l),yt.delete(u),f!==n&&((p=f.parentNode)==null||p.removeChild(f))}});return yt.set(u,o),u}let yt=new WeakMap;const He=0,Ie=1,We=2;function cr(e,t,n,i,r){var s=e,a=qe(),v=C,l=I,u,o,f,c=(a?O:Ye)(void 0),d=(a?O:Ye)(void 0),p=!1;function g(_,h){p=!0,h&&(q(y),K(y),gt(v));try{_===He&&n&&(u?ne(u):u=z(()=>n(s))),_===Ie&&i&&(o?ne(o):o=z(()=>i(s,c))),_===We&&r&&(f?ne(f):f=z(()=>r(s,d))),_!==He&&u&&le(u,()=>u=null),_!==Ie&&o&&le(o,()=>o=null),_!==We&&f&&le(f,()=>f=null)}finally{h&&(gt(null),K(null),q(null),nn())}}var y=Ce(()=>{if(l!==(l=t())){if(dn(l)){var _=l;p=!1,_.then(h=>{_===l&&(ve(c,h),g(Ie,!0))},h=>{if(_===l&&(ve(d,h),g(We,!0),!r))throw d.v}),Wt(()=>{p||g(He,!0)})}else ve(c,l),g(Ie,!1);return()=>l=I}})}function rn(e,t,n=!1){var i=e,r=null,s=null,a=null,v=n?Xe:0,l=!1;const u=(f,c=!0)=>{l=!0,o(c,f)},o=(f,c)=>{a!==(a=f)&&(a?(r?ne(r):c&&(r=z(()=>c(i))),s&&le(s,()=>{s=null})):(s?ne(s):c&&(s=z(()=>c(i))),r&&le(r,()=>{r=null})))};Ce(()=>{l=!1,t(u),l||o(null,null)},v)}function dr(e,t){return t}function pr(e,t,n,i){for(var r=[],s=t.length,a=0;a<s;a++)ot(t[a].e,r,!0);var v=s>0&&r.length===0&&n!==null;if(v){var l=n.parentNode;Xn(l),l.append(n),i.clear(),H(e,t[0].prev,t[s-1].next)}jt(r,()=>{for(var u=0;u<s;u++){var o=t[u];v||(i.delete(o.k),H(e,o.prev,o.next)),Z(o.e,!v)}})}function vr(e,t,n,i,r,s=null){var a=e,v={flags:t,items:new Map,first:null},l=null,u=!1;Ce(()=>{var o=n(),f=tt(o)?o:o==null?[]:nt(o),c=f.length;if(!(u&&c===0)){u=c===0;{var d=P;gr(f,v,a,r,t,(d.f&X)!==0,i)}s!==null&&(c===0?l?ne(l):l=z(()=>s(a)):l!==null&&le(l,()=>{l=null})),n()}})}function gr(e,t,n,i,r,s,a){var v=e.length,l=t.items,u=t.first,o=u,f,c=null,d=[],p=[],g,y,_,h;for(h=0;h<v;h+=1){if(g=e[h],y=a(g,h),_=l.get(y),_===void 0){var E=o?o.e.nodes_start:n;c=hr(E,t,c,c===null?t.first:c.next,g,y,h,i,r),l.set(y,c),d=[],p=[],o=c.next;continue}if(_r(_,g,h),_.e.f&X&&ne(_.e),_!==o){if(f!==void 0&&f.has(_)){if(d.length<p.length){var U=p[0],S;c=U.prev;var V=d[0],x=d[d.length-1];for(S=0;S<d.length;S+=1)mt(d[S],U,n);for(S=0;S<p.length;S+=1)f.delete(p[S]);H(t,V.prev,x.next),H(t,c,V),H(t,x,U),o=U,c=x,h-=1,d=[],p=[]}else f.delete(_),mt(_,o,n),H(t,_.prev,_.next),H(t,_,c===null?t.first:c.next),H(t,c,_),c=_;continue}for(d=[],p=[];o!==null&&o.k!==y;)(s||!(o.e.f&X))&&(f??(f=new Set)).add(o),p.push(o),o=o.next;if(o===null)continue;_=o}d.push(_),c=_,o=_.next}if(o!==null||f!==void 0){for(var Y=f===void 0?[]:nt(f);o!==null;)(s||!(o.e.f&X))&&Y.push(o),o=o.next;var Q=Y.length;if(Q>0){var on=null;pr(t,Y,on,l)}}m.first=t.first&&t.first.e,m.last=c&&c.e}function _r(e,t,n,i){ve(e.v,t),e.i=n}function hr(e,t,n,i,r,s,a,v,l){var u=(l&Tn)!==0,o=(l&Un)===0,f=u?o?Ye(r):O(r):r,c=l&An?O(a):a,d={i:c,v:f,k:s,a:null,e:null,prev:n,next:i};try{return d.e=z(()=>v(e,f,c),Dn),d.e.prev=n&&n.e,d.e.next=i&&i.e,n===null?t.first=d:(n.next=d,n.e.next=d.e),i!==null&&(i.prev=d,i.e.prev=d.e),d}finally{}}function mt(e,t,n){for(var i=e.next?e.next.e.nodes_start:n,r=t?t.e.nodes_start:n,s=e.e.nodes_start;s!==i;){var a=Fe(s);r.before(s),s=a}}function H(e,t,n){t===null?e.first=n:(t.next=n,t.e.next=n&&n.e),n!==null&&(n.prev=t,n.e.prev=t&&t.e)}function yr(e,t,...n){var i=e,r=St,s;Ce(()=>{r!==(r=t())&&(s&&(Z(s),s=null),s=z(()=>r(i,...n)))},Xe)}function Pt(e,t,n,i){var r=e.__attributes??(e.__attributes={});r[t]!==(r[t]=n)&&(t==="style"&&"__styles"in e&&(e.__styles={}),t==="loading"&&(e[yn]=n),n==null?e.removeAttribute(t):typeof n!="string"&&mr(e).includes(t)?e[t]=n:e.setAttribute(t,n))}var bt=new Map;function mr(e){var t=bt.get(e.nodeName);if(t)return t;bt.set(e.nodeName,t=[]);for(var n,i=Ae(e),r=Element.prototype;r!==i;){n=Bt(i);for(var s in n)n[s].set&&t.push(s);i=Ae(i)}return t}function xt(e,t){return e===t||(e==null?void 0:e[te])===t}function Pr(e={},t,n,i){return st(()=>{var r,s;return Mt(()=>{r=s,s=[],at(()=>{e!==n(...s)&&(t(e,...s),r&&xt(n(...r),e)&&t(null,...r))})}),()=>{Wt(()=>{s&&xt(n(...s),e)&&t(null,...s)})}}),e}function br(e=!1){const t=C,n=t.l.u;if(!n)return;let i=()=>ir(t.s);if(e){let r=0,s={};const a=ke(()=>{let v=!1;const l=t.s;for(const u in l)l[u]!==s[u]&&(s[u]=l[u],v=!0);return v&&r++,r});i=()=>b(a)}n.b.length&&jn(()=>{Ct(t,i),$e(n.b)}),Re(()=>{const r=at(()=>n.m.map(pn));return()=>{for(const s of r)typeof s=="function"&&s()}}),n.a.length&&Re(()=>{Ct(t,i),$e(n.a)})}function Ct(e,t){if(e.l.s)for(const n of e.l.s)b(n);t()}let Oe=!1;function xr(e){var t=Oe;try{return Oe=!1,[e(),Oe]}finally{Oe=t}}function Et(e){for(var t=m,n=m;t!==null&&!(t.f&(R|me));)t=t.parent;try{return q(t),e()}finally{q(n)}}function Cr(e,t,n,i){var V;var r=(n&Yn)!==0,s=!be||(n&Nn)!==0,a=(n&kn)!==0,v=!1,l;[l,v]=xr(()=>e[t]);var u=te in e||hn in e,o=((V=oe(e,t))==null?void 0:V.set)??(u&&a&&t in e?x=>e[t]=x:void 0),f=i,c=!0,d=!1,p=()=>(d=!0,c&&(c=!1,f=i),f);l===void 0&&i!==void 0&&(o&&s&&En(),l=p(),o&&o(l));var g;if(s)g=()=>{var x=e[t];return x===void 0?p():(c=!0,d=!1,x)};else{var y=Et(()=>(r?ke:Fn)(()=>e[t]));y.f|=gn,g=()=>{var x=b(y);return x!==void 0&&(f=void 0),x===void 0?f:x}}if(o){var _=e.$$legacy;return function(x,Y){return arguments.length>0?((!s||!Y||_||v)&&o(Y?g():x),x):g()}}var h=!1,E=!1,U=Ye(l),S=Et(()=>ke(()=>{var x=g(),Y=b(U);return h?(h=!1,E=!0,Y):(E=!1,U.v=x)}));return function(x,Y){if(arguments.length>0){const Q=Y?b(S):s&&a?G(x):x;return S.equals(Q)||(h=!0,L(U,Q),d&&f!==void 0&&(f=Q),at(()=>b(S))),x}return b(S)}}const Er="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Er);On();async function wr(){if(!navigator.gpu)return Promise.reject("WebGPU is not supported on this browser");const e=await navigator.gpu.requestAdapter();return e?e.requestDevice():Promise.reject("Failed to get GPU adapter")}const De=[[{X:50,Y:50},{X:450,Y:50},{X:450,Y:450},{X:50,Y:450},{X:50,Y:50}],[{X:150,Y:150},{X:200,Y:150},{X:200,Y:200},{X:150,Y:200},{X:150,Y:150}],[{X:300,Y:100},{X:350,Y:100},{X:350,Y:150},{X:300,Y:150},{X:300,Y:100}],[{X:100,Y:300},{X:150,Y:300},{X:150,Y:350},{X:100,Y:350},{X:100,Y:300}],[{X:300,Y:300},{X:400,Y:300},{X:400,Y:400},{X:300,Y:400},{X:300,Y:300}]];class ye{constructor(t,n,i,r){N(this,"edgesBuffer");N(this,"maxIntersectionsPerSegment",32);N(this,"bindGroupLayout");N(this,"pipeline");N(this,"edgesCount");this.device=r;const s=ye.convertPolygonToEdges(t),a=new Float32Array(s);this.edgesCount=s.length,this.edgesBuffer=this.device.createBuffer({size:a.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0,label:"edgesBuffer"}),new Float32Array(this.edgesBuffer.getMappedRange()).set(a),this.edgesBuffer.unmap(),this.bindGroupLayout=this.device.createBindGroupLayout({entries:n}),this.pipeline=this.device.createComputePipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),compute:{module:this.device.createShaderModule({code:i}),entryPoint:"main"}})}static convertPolygonToEdges(t){const n=[];for(const i of t)for(let r=0;r<i.length;r++){const s=i[r],a=i[(r+1)%i.length];n.push(s.X,s.Y,a.X,a.Y)}return n}static flattenPointList(t){return t.flatMap(n=>[n.X,n.Y])}}const Br=`
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

`,Sr=[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}];class ft extends ye{constructor({device:n,polygon:i,maxIntersectionsPerLine:r=128}){super(i,Sr,Br,n);N(this,"maxIntersectionsPerLine");this.maxIntersectionsPerLine=r;const s=new Float32Array(ye.convertPolygonToEdges(i));this.edgesBuffer=this.device.createBuffer({size:s.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0,label:"edgesBuffer"}),new Float32Array(this.edgesBuffer.getMappedRange()).set(s),this.edgesBuffer.unmap()}async clip(n){const i=new Float32Array(ft.flattenPointList(n.flat())),r=this.device.createBuffer({size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0});new Float32Array(r.getMappedRange()).set(i),r.unmap();const s=this.device.createBuffer({size:n.length*this.maxIntersectionsPerLine*4*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),a=this.device.createBuffer({size:s.size,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),v=3*Float32Array.BYTES_PER_ELEMENT,l=n.length*this.maxIntersectionsPerLine,u=this.device.createBuffer({size:l*v,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});(()=>{const y=new Float32Array(l*2).fill(-1);this.device.queue.writeBuffer(u,0,y)})();const f=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:r}},{binding:1,resource:{buffer:this.edgesBuffer}},{binding:2,resource:{buffer:u}},{binding:3,resource:{buffer:s}}]}),c=this.device.createCommandEncoder(),d=c.beginComputePass();d.setPipeline(this.pipeline),d.setBindGroup(0,f),d.dispatchWorkgroups(n.length),d.end(),c.copyBufferToBuffer(s,0,a,0,s.size),this.device.queue.submit([c.finish()]),await a.mapAsync(GPUMapMode.READ);const p=new Float32Array(a.getMappedRange()),g=[];for(let y=0;y<p.length;y+=4)g.push([{X:p[y],Y:p[y+1]},{X:p[y+2],Y:p[y+3]}]);return a.unmap(),g.filter(y=>!y.every(_=>_.X===0&&_.Y===0))}}function Ir(e,t){return`
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
`}const Or=[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}}];class ut extends ye{constructor({device:n,polygon:i,maxIntersectionsPerSegment:r,maxClippedVerticesPerSegment:s,workgroupSize:a}){const v=a??64,l=r??64,u=s??64;super(i,Or,Ir(v,l),n);N(this,"maxClippedVerticesPerSegment");N(this,"workgroupSize");N(this,"polylinesLength",0);N(this,"verticesLength",0);N(this,"segmentsCount",0);this.maxIntersectionsPerSegment=l,this.workgroupSize=v,this.maxClippedVerticesPerSegment=u}async clip(n){performance.mark("rawClippingStart"),this.polylinesLength=n.length;const i=n.flatMap((_,h)=>_.flatMap((E,U)=>[E.X,E.Y,h,U]));this.verticesLength=i.length;const r=new Float32Array(i),s=this.device.createBuffer({size:r.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC,mappedAtCreation:!0});new Float32Array(s.getMappedRange()).set(r),s.unmap();const a=n.reduce((_,h)=>(_+=h.length>2?h.length-1:h.length,_),0);console.log(`Segments: ${a}`),this.segmentsCount=a;const v=this.maxClippedVerticesPerSegment*4,l=this.device.createBuffer({size:a*v*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),u=this.device.createBuffer({size:4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(u,0,new Uint32Array([this.maxClippedVerticesPerSegment]));const o=Math.ceil(a/this.workgroupSize),f=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:this.edgesBuffer}},{binding:2,resource:{buffer:l}},{binding:3,resource:{buffer:u}}]}),c=this.device.createCommandEncoder(),d=c.beginComputePass();d.setPipeline(this.pipeline),d.setBindGroup(0,f),d.dispatchWorkgroups(o),d.end();const p=this.device.createBuffer({size:l.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST,label:"readBuffer"});c.copyBufferToBuffer(l,0,p,0,l.size),this.device.queue.submit([c.finish()]),await p.mapAsync(GPUMapMode.READ);const g=new Float32Array(p.getMappedRange());performance.mark("rawClippingEnd"),performance.measure("rawClipping","rawClippingStart","rawClippingEnd"),console.log(`Raw clipping takes ${performance.getEntriesByName("rawClipping")[0].duration/1e3} sec`);const y=this.parseClippedPolyline(g,a);return p.unmap(),y}parseClippedPolyline(n,i){const r=[];for(let s=0;s<i;s+=1){const a=s*this.maxClippedVerticesPerSegment,v=n[a*4+3];let l=[];for(let u=0;u<v;u+=1){const o=a+u,f=n[o*4+0],c=n[o*4+1],d=n[o*4+2],p=n[o*4+3];[f,c,d,p].every(g=>g===0)||(d===-1?l.length>0&&(r.push(l),l=[]):f!==void 0&&c!==void 0&&l.push({X:f,Y:c}))}l.length>0&&r.push(l)}return r.reduce((s,a,v)=>{if(v===0)s.push(a);else{const l=s[s.length-1],u=l[l.length-1],o=a[0];ut.arePointsEqual(u,o)?l.push(...a.slice(1)):s.push(a)}return s},[])}static arePointsEqual(n,i){return Math.abs(n.X-i.X)<Number.EPSILON&&Math.abs(n.Y-i.Y)<Number.EPSILON}}var Lr=J(`<p>Clipping (instantiation, loading, clipping, and reading the
            results): <b> </b></p>`),Tr=J('<fieldset class="svelte-1ohsw66"><legend class="svelte-1ohsw66"> </legend> <div class="example svelte-1ohsw66"><div class="container svelte-1ohsw66"><canvas class="svelte-1ohsw66"></canvas> <div class="results svelte-1ohsw66"><!> <!></div></div></div></fieldset>');function sn(e,t){we(t,!0);let n=Cr(t,"canvas",15);var i=Tr(),r=w(i),s=w(r),a=D(r,2),v=w(a),l=w(v);Pr(l,d=>n(d),()=>n());var u=D(l,2),o=w(u);{var f=d=>{var p=Lr(),g=D(w(p)),y=w(g);ue(()=>ce(y,`${t.timing.toFixed(4)??""} sec`)),M(d,p)};rn(o,d=>{t.timing&&d(f)})}var c=D(o,2);yr(c,()=>t.children??St),ue(()=>{ce(s,t.title),Pt(l,"width",t.canvasSize),Pt(l,"height",t.canvasSize)}),M(e,i),Be()}var Ar=J("<span>Polygon edges: <b> </b></span> <span>Lines to clip: <b></b></span>",1);function Ur(e,t){we(t,!0);let n=pe(void 0);const i=50,r=500,s=r/i,a=new Array(i).fill(null).map((f,c)=>{const p=r;return[{X:0,Y:c*s},{X:p,Y:c*s}]});let v=pe(null);performance.mark("LineClipperStart");const l=new ft({device:t.device,polygon:De});let u=G(l.edgesCount);const o=async()=>{if(b(n)){const f=b(n).getContext("2d"),c=await l.clip(a);performance.mark("LineClipperEnd"),performance.measure("LineClipping","LineClipperStart","LineClipperEnd"),L(v,performance.getEntriesByName("LineClipping")[0].duration/1e3),f.strokeStyle="white",De.forEach(d=>{f.beginPath(),d.forEach((p,g)=>{g===0?f.moveTo(p.X,p.Y):f.lineTo(p.X,p.Y)}),f.closePath(),f.stroke()}),f.strokeStyle="rgba(255, 0, 0, 0.45)",a.forEach(d=>{d.forEach((p,g)=>{g===0?(f.beginPath(),f.moveTo(p.X,p.Y)):(f.lineTo(p.X,p.Y),f.stroke())})}),f.strokeStyle="rgba(0, 245, 0)",c.forEach(d=>{d.forEach((p,g)=>{g===0?(f.beginPath(),f.moveTo(p.X,p.Y)):(f.lineTo(p.X,p.Y),f.stroke())})})}};Re(()=>{o()}),sn(e,{title:"LineClipper",get timing(){return b(v)},canvasSize:r,get canvas(){return b(n)},set canvas(f){L(n,G(f))},children:(f,c)=>{var d=Ar(),p=Ze(d),g=D(w(p)),y=w(g),_=D(p,2),h=D(w(_));h.textContent=i,ue(()=>ce(y,u)),M(f,d)},$$slots:{default:!0}}),Be()}var Yr=J("<span> <b> </b></span>");function Nr(e,t){we(t,!0);let n=pe(void 0),i=pe(void 0);const r=500;let s=pe(null);const a=Array.from({length:10},(o,f)=>{const c=130+f*10,d=.01+f*.005,p=0,g=r,y=100,_=[];for(let h=p;h<=g;h+=(g-p)/y){const E=250+c*Math.sin(d*h);_.push({X:h,Y:E})}return _}),v=o=>{switch(o){case"edges":return"Polygon edges";case"polylines":return"Polylines to clip";case"segments":return"Polyline segments";case"vertices":return"Total vertices"}};performance.mark("PolylineClipperStart");const l=new ut({device:t.device,polygon:De}),u=async()=>{if(b(n)){const o=b(n).getContext("2d"),f=await l.clip(a);performance.mark("PolylineClipperEnd"),performance.measure("PolylineClipping","PolylineClipperStart","PolylineClipperEnd"),L(s,performance.getEntriesByName("PolylineClipping")[0].duration/1e3),o.strokeStyle="white",De.forEach(c=>{o.beginPath(),c.forEach((d,p)=>{p===0?o.moveTo(d.X,d.Y):o.lineTo(d.X,d.Y)}),o.closePath(),o.stroke()}),o.strokeStyle="rgba(255, 0, 0, 0.45)",a.forEach(c=>{c.forEach((d,p,g)=>{p===0?(o.beginPath(),o.moveTo(d.X,d.Y)):p===g.length-1?(o.lineTo(d.X,d.Y),o.stroke()):o.lineTo(d.X,d.Y)})}),o.strokeStyle="rgba(0, 245, 0)",f.forEach(c=>{c.forEach((d,p)=>{p===0?(o.beginPath(),o.moveTo(d.X,d.Y)):o.lineTo(d.X,d.Y)}),o.stroke()}),L(i,G({edges:l.edgesCount,polylines:l.polylinesLength,segments:l.segmentsCount,vertices:l.verticesLength}))}};Re(()=>{u()}),sn(e,{title:"PolylineClipper",get timing(){return b(s)},canvasSize:r,get canvas(){return b(n)},set canvas(o){L(n,G(o))},children:(o,f)=>{var c=ht(),d=Ze(c);{var p=g=>{var y=ht(),_=Ze(y);vr(_,17,()=>Object.entries(b(i)),dr,(h,E)=>{let U=()=>b(E)[0],S=()=>b(E)[1];var V=Yr(),x=w(V);ue(()=>ce(x,`${v(U())??""}: `));var Y=D(x),Q=w(Y);ue(()=>ce(Q,S())),M(h,V)}),M(g,y)};rn(d,g=>{b(i)&&g(p)})}M(o,c)},$$slots:{default:!0}}),Be()}var kr=J('<div class="content svelte-q590e0"><!> <!></div>'),Rr=J('<div class="error svelte-q590e0"><span> </span></div>'),Gr=J("<p>Loading</p>"),Dr=J('<div class="container svelte-q590e0"><header class="svelte-q590e0"><h1>Line & Polyline Clipping With WebGPU Compute Shaders</h1> <h4>Both utilities are not fully tested and might produce incorrect results</h4> <hr class="svelte-q590e0"></header> <main class="svelte-q590e0"><!></main></div>');function Mr(e,t){we(t,!1);const n=wr();br();var i=Dr(),r=D(w(i),2),s=w(r);cr(s,()=>n,a=>{var v=Gr();M(a,v)},(a,v)=>{var l=kr(),u=w(l);Ur(u,{get device(){return b(v)}});var o=D(u,2);Nr(o,{get device(){return b(v)}}),M(a,l)},(a,v)=>{var l=Rr(),u=w(l),o=w(u,!0);ue(()=>ce(o,b(v))),M(a,l)}),M(e,i),Be()}fr(Mr,{target:document.getElementById("app")});
