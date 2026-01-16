(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,33525,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"warnOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},18566,(e,t,n)=>{t.exports=e.r(76562)},7543,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(18566);let i=(0,n.createContext)(void 0);function o({children:e}){let o=(0,r.useRouter)(),l=(0,r.usePathname)(),[a,u]=(0,n.useState)(null),[s,c]=(0,n.useState)(!1),[d,v]=(0,n.useState)(()=>"/register"===l||"/signup"===l?"signup":"login"),f=(0,n.useRef)(null);(0,n.useEffect)(()=>{s||v("/register"===l||"/signup"===l?"signup":"login")},[l,s]);let m=(0,n.useCallback)(e=>{s||e===d||(u("signup"===e?"left":"right"),c(!0),f.current&&clearTimeout(f.current),o.push("signup"===e?"/register":"/login"),f.current=setTimeout(()=>{v(e),c(!1),u(null)},600))},[s,d,o]);return(0,n.useEffect)(()=>()=>{f.current&&clearTimeout(f.current)},[]),(0,t.jsx)(i.Provider,{value:{direction:a,isAnimating:s,currentPage:d,navigateTo:m},children:e})}function l(){let e=(0,n.useContext)(i);if(void 0===e)throw Error("useAuthNavigation must be used within an AuthNavigationProvider");return e}e.s(["AuthNavigationProvider",()=>o,"useAuthNavigation",()=>l])},85650,e=>{"use strict";var t=e.i(43476),n=e.i(18566),r=e.i(7543),i=e.i(71645);function o(){let e=(0,i.useRef)(null),n=(0,i.useRef)({camera:null,scene:null,renderer:null,uniforms:null,animationId:null});(0,i.useEffect)(()=>{let t=document.createElement("script");return t.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js",t.onload=()=>{e.current&&window.THREE&&r()},document.head.appendChild(t),()=>{n.current.animationId&&cancelAnimationFrame(n.current.animationId),n.current.renderer&&n.current.renderer.dispose(),document.head.contains(t)&&document.head.removeChild(t)}},[]);let r=()=>{if(!e.current||!window.THREE)return;let t=window.THREE,r=e.current;r.innerHTML="";let i=new t.Camera;i.position.z=1;let o=new t.Scene,l=new t.PlaneBufferGeometry(2,2),a={time:{type:"f",value:1},resolution:{type:"v2",value:new t.Vector2}},u=`
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `,s=`
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      varying vec2 vUv;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
          }
        }

        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `,c=new t.ShaderMaterial({uniforms:a,vertexShader:u,fragmentShader:s}),d=new t.Mesh(l,c);o.add(d);let v=new t.WebGLRenderer;v.setPixelRatio(window.devicePixelRatio),r.appendChild(v.domElement),n.current={camera:i,scene:o,renderer:v,uniforms:a,animationId:null};let f=()=>{let e=r.getBoundingClientRect();v.setSize(e.width,e.height),a.resolution.value.x=v.domElement.width,a.resolution.value.y=v.domElement.height};f(),window.addEventListener("resize",f,!1);let m=()=>{n.current.animationId=requestAnimationFrame(m),a.time.value+=.05,v.render(o,i)};m()};return(0,t.jsx)("div",{ref:e,className:"w-full h-full absolute"})}function l({className:e=""}){let{direction:n,isAnimating:i,currentPage:l}=(0,r.useAuthNavigation)();return(0,t.jsx)("div",{className:`
        auth-shader-overlay
        absolute inset-0 w-full h-full z-20 pointer-events-none
        hidden md:block
        ${e}
      `,children:(0,t.jsx)("div",{className:`
          auth-shader-slider
          absolute inset-0 w-1/2 h-full
          transition-transform duration-[600ms] ease-in-out
          ${i&&n?"left"===n?"translate-x-0":"translate-x-full":"signup"===l?"translate-x-0":"translate-x-full"}
        `,children:(0,t.jsx)("div",{className:"absolute inset-0 overflow-hidden",children:(0,t.jsx)(o,{})})})})}function a({children:e}){let i=(0,n.usePathname)();return"/login"!==i&&"/register"!==i?(0,t.jsx)(t.Fragment,{children:e}):(0,t.jsx)(r.AuthNavigationProvider,{children:(0,t.jsxs)("div",{className:"relative",children:[e,(0,t.jsx)(l,{})]})})}e.s(["AuthLayoutWrapper",()=>a],85650)}]);