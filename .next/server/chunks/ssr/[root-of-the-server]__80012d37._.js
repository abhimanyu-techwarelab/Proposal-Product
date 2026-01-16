module.exports=[72131,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].React},9270,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.AppRouterContext},36313,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.HooksClientContext},18341,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored.contexts.ServerInsertedHtml},18622,(a,b,c)=>{b.exports=a.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(a,b,c)=>{b.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},42602,(a,b,c)=>{"use strict";b.exports=a.r(18622)},87924,(a,b,c)=>{"use strict";b.exports=a.r(42602).vendored["react-ssr"].ReactJsxRuntime},88121,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(50944);let e=(0,c.createContext)(void 0);function f({children:a}){let f=(0,d.useRouter)(),g=(0,d.usePathname)(),[h,i]=(0,c.useState)(null),[j,k]=(0,c.useState)(!1),[l,m]=(0,c.useState)(()=>"/register"===g||"/signup"===g?"signup":"login"),n=(0,c.useRef)(null);(0,c.useEffect)(()=>{j||m("/register"===g||"/signup"===g?"signup":"login")},[g,j]);let o=(0,c.useCallback)(a=>{j||a===l||(i("signup"===a?"left":"right"),k(!0),n.current&&clearTimeout(n.current),f.push("signup"===a?"/register":"/login"),n.current=setTimeout(()=>{m(a),k(!1),i(null)},600))},[j,l,f]);return(0,c.useEffect)(()=>()=>{n.current&&clearTimeout(n.current)},[]),(0,b.jsx)(e.Provider,{value:{direction:h,isAnimating:j,currentPage:l,navigateTo:o},children:a})}function g(){let a=(0,c.useContext)(e);if(void 0===a)throw Error("useAuthNavigation must be used within an AuthNavigationProvider");return a}a.s(["AuthNavigationProvider",()=>f,"useAuthNavigation",()=>g])},54448,a=>{"use strict";var b=a.i(87924),c=a.i(50944),d=a.i(88121),e=a.i(72131);function f(){let a=(0,e.useRef)(null),c=(0,e.useRef)({camera:null,scene:null,renderer:null,uniforms:null,animationId:null});(0,e.useEffect)(()=>{let b=document.createElement("script");return b.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js",b.onload=()=>{a.current&&window.THREE&&d()},document.head.appendChild(b),()=>{c.current.animationId&&cancelAnimationFrame(c.current.animationId),c.current.renderer&&c.current.renderer.dispose(),document.head.contains(b)&&document.head.removeChild(b)}},[]);let d=()=>{if(!a.current||!window.THREE)return;let b=window.THREE,d=a.current;d.innerHTML="";let e=new b.Camera;e.position.z=1;let f=new b.Scene,g=new b.PlaneBufferGeometry(2,2),h={time:{type:"f",value:1},resolution:{type:"v2",value:new b.Vector2}},i=`
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `,j=`
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
    `,k=new b.ShaderMaterial({uniforms:h,vertexShader:i,fragmentShader:j}),l=new b.Mesh(g,k);f.add(l);let m=new b.WebGLRenderer;m.setPixelRatio(window.devicePixelRatio),d.appendChild(m.domElement),c.current={camera:e,scene:f,renderer:m,uniforms:h,animationId:null};let n=()=>{let a=d.getBoundingClientRect();m.setSize(a.width,a.height),h.resolution.value.x=m.domElement.width,h.resolution.value.y=m.domElement.height};n(),window.addEventListener("resize",n,!1);let o=()=>{c.current.animationId=requestAnimationFrame(o),h.time.value+=.05,m.render(f,e)};o()};return(0,b.jsx)("div",{ref:a,className:"w-full h-full absolute"})}function g({className:a=""}){let{direction:c,isAnimating:e,currentPage:g}=(0,d.useAuthNavigation)();return(0,b.jsx)("div",{className:`
        auth-shader-overlay
        absolute inset-0 w-full h-full z-20 pointer-events-none
        hidden md:block
        ${a}
      `,children:(0,b.jsx)("div",{className:`
          auth-shader-slider
          absolute inset-0 w-1/2 h-full
          transition-transform duration-[600ms] ease-in-out
          ${e&&c?"left"===c?"translate-x-0":"translate-x-full":"signup"===g?"translate-x-0":"translate-x-full"}
        `,children:(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden",children:(0,b.jsx)(f,{})})})})}function h({children:a}){let e=(0,c.usePathname)();return"/login"!==e&&"/register"!==e?(0,b.jsx)(b.Fragment,{children:a}):(0,b.jsx)(d.AuthNavigationProvider,{children:(0,b.jsxs)("div",{className:"relative",children:[a,(0,b.jsx)(g,{})]})})}a.s(["AuthLayoutWrapper",()=>h],54448)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__80012d37._.js.map