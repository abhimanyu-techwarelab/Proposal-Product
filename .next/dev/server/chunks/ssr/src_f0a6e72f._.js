module.exports = [
"[project]/src/components/ui/pulse-beams.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PulseBeams",
    ()=>PulseBeams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function PulseBeams({ beams, gradientColors, className = "", width = 2400, height = 1400, baseColor = "#334155", accentColor = "#475569" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `pulse-beams-svg ${className}`,
        viewBox: `0 0 ${width} ${height}`,
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid slice",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: beams.map((beam, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].linearGradient, {
                        id: `pulse-gradient-${index}`,
                        initial: beam.gradientConfig.initial,
                        animate: beam.gradientConfig.animate,
                        transition: beam.gradientConfig.transition,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "0%",
                                stopColor: gradientColors.start,
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "30%",
                                stopColor: gradientColors.middle,
                                stopOpacity: "0.8"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "50%",
                                stopColor: gradientColors.end,
                                stopOpacity: "1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "70%",
                                stopColor: gradientColors.middle,
                                stopOpacity: "0.8"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                                lineNumber: 80,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "100%",
                                stopColor: gradientColors.start,
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        ]
                    }, `gradient-${index}`, true, {
                        fileName: "[project]/src/components/ui/pulse-beams.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/pulse-beams.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            beams.map((beam, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: beam.path,
                    stroke: baseColor,
                    strokeWidth: "1",
                    strokeOpacity: "0.3",
                    "data-pulse-beam": "base",
                    style: {
                        strokeWidth: 1
                    }
                }, `base-${index}`, false, {
                    fileName: "[project]/src/components/ui/pulse-beams.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)),
            beams.map((beam, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: beam.path,
                    stroke: `url(#pulse-gradient-${index})`,
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    "data-pulse-beam": "animated",
                    style: {
                        strokeWidth: 2
                    }
                }, `animated-${index}`, false, {
                    fileName: "[project]/src/components/ui/pulse-beams.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/pulse-beams.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/glitchy-404.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Glitchy404",
    ()=>Glitchy404
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const shakeVariants1 = {
    shake: {
        x: [
            0,
            -2,
            2,
            -1,
            1,
            0
        ],
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }
    }
};
const shakeVariants2 = {
    shake: {
        x: [
            0,
            1.5,
            -1.5,
            2,
            -2,
            0
        ],
        transition: {
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }
    }
};
const shakeVariants3 = {
    shake: {
        x: [
            0,
            -1,
            1,
            -2,
            2,
            -1,
            0
        ],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }
    }
};
const shakeVariants4 = {
    shake: {
        x: [
            0,
            2,
            -1,
            1.5,
            -2,
            0
        ],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }
    }
};
const shakeVariants5 = {
    shake: {
        x: [
            0,
            -1.5,
            1,
            -1,
            2,
            -2,
            0
        ],
        transition: {
            duration: 0.7,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
        }
    }
};
const getVariants = (index)=>{
    const variants = [
        shakeVariants1,
        shakeVariants2,
        shakeVariants3,
        shakeVariants4,
        shakeVariants5
    ];
    return variants[index % variants.length];
};
const getRandomDelay = ()=>Math.random() * 2;
const FuzzyWrapper = ({ children, baseIntensity = 0.3, className })=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const svgContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let animationFrameId;
        let isCancelled = false;
        const canvas = canvasRef.current;
        const svgContainer = svgContainerRef.current;
        if (!canvas || !svgContainer) return;
        // Clean up previous animation if it exists
        if (canvas.cleanupFuzzy) {
            canvas.cleanupFuzzy();
        }
        const init = async ()=>{
            if (isCancelled) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            // Get the SVG element
            const svgElement = svgContainer.querySelector("svg");
            if (!svgElement) return;
            // Wait for fonts and animations to be ready
            await new Promise((resolve)=>setTimeout(resolve, 100));
            // Get SVG dimensions
            const svgRect = svgElement.getBoundingClientRect();
            const svgWidth = svgRect.width || 800;
            const svgHeight = svgRect.height || 232;
            // Create offscreen canvas
            const offscreen = document.createElement("canvas");
            const offCtx = offscreen.getContext("2d");
            if (!offCtx) return;
            offscreen.width = svgWidth;
            offscreen.height = svgHeight;
            // Convert SVG to canvas
            const convertSvgToCanvas = ()=>{
                return new Promise((resolve)=>{
                    const svgData = new XMLSerializer().serializeToString(svgElement);
                    const img = new Image();
                    const svgBlob = new Blob([
                        svgData
                    ], {
                        type: "image/svg+xml;charset=utf-8"
                    });
                    const url = URL.createObjectURL(svgBlob);
                    img.onload = ()=>{
                        offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
                        offCtx.drawImage(img, 0, 0, svgWidth, svgHeight);
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.src = url;
                });
            };
            // Setup main canvas
            const horizontalMargin = 50;
            const verticalMargin = 50;
            canvas.width = svgWidth + horizontalMargin * 2;
            canvas.height = svgHeight + verticalMargin * 2;
            const fuzzRange = 20;
            const run = async ()=>{
                if (isCancelled) return;
                // Re-render SVG to capture animation changes
                await convertSvgToCanvas();
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(horizontalMargin, verticalMargin);
                // Apply fuzzy effect line by line
                for(let j = 0; j < svgHeight; j++){
                    const dx = Math.floor(baseIntensity * (Math.random() - 0.5) * fuzzRange);
                    ctx.drawImage(offscreen, 0, j, svgWidth, 1, dx, j, svgWidth, 1);
                }
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
                animationFrameId = window.requestAnimationFrame(run);
            };
            run();
            const cleanup = ()=>{
                window.cancelAnimationFrame(animationFrameId);
            };
            canvas.cleanupFuzzy = cleanup;
        };
        init();
        return ()=>{
            isCancelled = true;
            window.cancelAnimationFrame(animationFrameId);
            if (canvas && canvas.cleanupFuzzy) {
                canvas.cleanupFuzzy();
            }
        };
    }, [
        baseIntensity
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: svgContainerRef,
                className: "absolute inset-0 opacity-0 pointer-events-none",
                style: {
                    zIndex: -1
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: className,
                style: {
                    display: "block"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/glitchy-404.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function Glitchy404({ width = 860, height = 232, color = "#fff", onRepair, enableRepairMode = false }) {
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [repairProgress, setRepairProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isRepaired, setIsRepaired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hoverTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const progressIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!enableRepairMode || isRepaired) return;
        setIsHovered(true);
        // Start repair progress
        progressIntervalRef.current = setInterval(()=>{
            setRepairProgress((prev)=>{
                if (prev >= 100) {
                    if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                    }
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        // Complete repair after holding
        hoverTimerRef.current = setTimeout(()=>{
            setIsRepaired(true);
            onRepair?.();
        }, 1500);
    }, [
        enableRepairMode,
        isRepaired,
        onRepair
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!enableRepairMode || isRepaired) return;
        setIsHovered(false);
        // Clear timers
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        // Reset progress
        setRepairProgress(0);
    }, [
        enableRepairMode,
        isRepaired
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);
    // Calculate dynamic intensity based on repair state
    const currentIntensity = isRepaired ? 0 : isHovered ? Math.max(0.1, 0.4 - repairProgress / 100 * 0.3) : 0.4;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: [
            enableRepairMode && isHovered && !isRepaired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: -10
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                exit: {
                    opacity: 0
                },
                className: "absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-[#B87333] font-mono",
                children: [
                    "Repairing... ",
                    Math.round(repairProgress),
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                lineNumber: 307,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isRepaired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.8
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    className: "absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-green-400 font-mono",
                    children: "System Restored"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                    lineNumber: 320,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FuzzyWrapper, {
                baseIntensity: currentIntensity,
                className: "cursor-pointer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: width,
                        height: height,
                        viewBox: "0 0 100 29",
                        fill: "white",
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "cursor-pointer fill-current text-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(0),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M28.364 12.4511V10.8261H25.926V9.95106L23.814 10.0511V18.6511H25.926C25.926 18.6881 28.364 18.7131 28.364 18.7131V13.1511H25.926V12.4511H28.364Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(1),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M26.3093 4.62023V9.79523H23.8713V10.3082L21.7583 10.4082V6.08223L17.2083 10.6332L10.4453 10.9582L10.5453 10.8582C10.5703 10.8582 10.5703 10.6702 10.5703 10.6702H15.0583V9.79523H11.6083L14.1833 7.22023H11.0203V5.29523H18.3203V4.00723H17.4013L18.5383 2.87023H22.4013V1.88223H19.5213L19.5713 1.83223C20.1226 1.27892 20.8257 0.90175 21.5916 0.748521C22.3574 0.595292 23.1515 0.672907 23.8732 0.971528C24.595 1.27015 25.2117 1.77633 25.6454 2.4259C26.0791 3.07547 26.3102 3.83919 26.3093 4.62023Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(2),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M30.8166 20.2344V23.5344H27.9536V24.7844H26.4036V28.7964H21.8536V24.7854H5.96562C5.33949 24.7839 4.72271 24.6334 4.16627 24.3463C3.60983 24.0592 3.12972 23.6438 2.76562 23.1344H17.8536V22.2344H7.60262C7.70273 22.5113 7.8418 22.7726 8.01562 23.0104H4.30263V22.2344H2.29062C2.10958 21.7898 2.0162 21.3144 2.01562 20.8344V20.4224C2.02388 20.2379 2.04459 20.0541 2.07763 19.8724H5.61562V19.1344H2.25262C2.37715 18.7691 2.55399 18.4239 2.77762 18.1094L9.06563 18.1844L7.40263 19.8474C7.39063 19.8974 7.37762 19.9344 7.36562 19.9844H7.26562L7.01562 20.2344H21.8536V19.1344H22.0286V18.5344H23.9666V18.3594L26.4036 18.3844V20.2344H30.8166Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(3),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M12.5 10.6011L9.988 13.1141H11.813V13.7271H0V15.2141H7.888L5.138 17.9641C4.99144 18.1108 4.85762 18.2697 4.738 18.4391L11.026 18.5141L19.264 10.2761L12.5 10.6011Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 381,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 376,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(4),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M64.3244 7.02188V8.33387L59.7744 8.54688V8.45988L59.6744 8.55987L57.4614 8.65987V7.59688H54.1864L56.5614 5.23388H41.9734C41.4695 5.23388 40.9863 5.43405 40.6299 5.79037C40.2736 6.14669 40.0734 6.62996 40.0734 7.13387V9.52187L35.5234 9.73488V7.02188C35.5258 5.33848 36.1956 3.72472 37.3859 2.53438C38.5763 1.34404 40.19 0.674256 41.8734 0.671875H57.9734C59.2397 0.677349 60.4757 1.05938 61.5242 1.76935C62.5727 2.47933 63.3863 3.48516 63.8614 4.65888H57.4614V6.08388H64.2244C64.2824 6.39342 64.3159 6.70706 64.3244 7.02188Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(5),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M64.4192 19.138V22.451C64.4179 23.3345 64.2305 24.2078 63.8692 25.014H54.5972V25.826H63.4352C62.8647 26.7347 62.0732 27.4841 61.1347 28.0042C60.1962 28.5242 59.1412 28.798 58.0682 28.8H47.0302V27.214H41.1302C42.101 27.8964 43.2566 28.2669 44.4432 28.276H39.0672V27.214H37.8172C37.1302 26.6244 36.5782 25.8939 36.1986 25.072C35.819 24.2502 35.6207 23.3563 35.6172 22.451V18.5L40.1682 18.55V21.025L42.6182 18.575L48.9802 18.65L43.3972 24.239H57.9562C58.4615 24.2398 58.9466 24.0403 59.3052 23.6842C59.6637 23.3281 59.8665 22.8443 59.8692 22.339V18.789L62.1442 18.814V19.139L64.4192 19.138Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 403,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 398,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(6),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M66.377 11.9641V7.97606L61.827 8.18906V19.1141L64.102 19.1391V18.6521H66.377V13.9141H64.4V11.9641H66.377Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(7),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M93.5104 4.22761V6.89061L91.7734 6.97761V6.77761H88.9604V6.07761L88.2604 6.77761H86.3994V7.24061L81.0994 7.50261L82.0494 6.55261H80.8594V5.89061H82.7104L83.2354 5.36561H88.5104V4.65261H83.9474L86.7724 1.82761C87.3253 1.27765 88.028 0.902648 88.7926 0.749359C89.5573 0.59607 90.3502 0.671278 91.0724 0.965606C91.9519 1.33339 92.6674 2.00877 93.0854 2.86561H88.0224V4.00261H93.4604C93.4712 4.07709 93.4755 4.15237 93.4734 4.22761H93.5104Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 426,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 421,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(8),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M98.0208 23.3864V22.7234H94.8968V21.7484H96.5218V22.6364H98.2217V21.7234H98.0218V20.2354H93.6077V19.1734L89.0577 19.1234V20.2354H74.2188L75.4818 18.9604L69.5318 18.8984C69.3287 19.3814 69.2224 19.8995 69.2188 20.4234V20.8354C69.2209 21.8825 69.6377 22.8861 70.378 23.6265C71.1182 24.367 72.1217 24.7841 73.1687 24.7864H89.0577V27.2114H90.9827V27.9484H89.0577V28.7984H93.6077V24.7864H94.8968V25.1364H99.2848V23.3864H98.0208ZM89.1827 23.5364H81.6318V22.7234H89.1827V23.5364ZM92.9327 21.7484H86.4967V21.0234H92.9348L92.9327 21.7484ZM96.5198 24.5484H96.2698V23.5364H96.5198V24.5484Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 432,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(9),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M80.4 16.3271L89.5 7.23906H88.45V6.88906L83.15 7.15106L81.763 8.53906H83.225V9.96406H81.054L81.542 9.47606H75.491V10.8011H79.5L77.187 13.1141H79.238V14.7271H76.3L77.3 13.7271H74.579V15.2141H75.091L72.341 17.9641C71.9813 18.3283 71.693 18.7567 71.491 19.2271L77.441 19.2891L79.154 17.5771H77.6V16.3271H80.4Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 449,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 444,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(10),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M94.363 17.8771V18.6521H92.205V17.5771H95.567V6.53906L93.83 6.62606V7.23906H91.017V19.4521L95.567 19.5021V18.8641H97.08V17.8771H94.363Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 460,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 455,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(11),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M65.34 16.3271V17.3521H62.853V16.3271H65.34ZM59.516 8.30106V8.53906H57.566L57.7 8.40106L55.362 8.51406C55.2213 8.53483 55.0791 8.5432 54.937 8.53906L46.637 16.8391H47.8V17.1891H47.174V18.3271H45.152L44.577 18.9021L50.94 18.9771L61.728 8.20106L59.516 8.30106Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 472,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 467,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(12),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M40.5 13.5141V12.6641H38.765V13.5141H37.577V18.8271L42.127 18.8771V13.5141H40.5ZM37.575 9.37606V9.43906H39.863V10.3141H38.452V10.5011H37.577V11.9641H42.127V9.16406L37.575 9.37606Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 483,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(13),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M67.252 18.8641V19.1771L69.652 19.2021V18.8641H67.252ZM44.725 12.6641V14.1011H46.25V12.6641H44.725ZM35.2099 23.3906V25.1406H31.4219V24.5526H34.0849V23.3906H35.2099Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 490,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(14),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M88.1833 26.8047H87.3203V27.4797H88.1833V26.8047ZM69.063 24.75V25.513H64.375C64.5321 25.2698 64.6698 25.0147 64.787 24.75H69.063ZM69.6578 19.2047V19.6297H67.2578V19.1797L69.6578 19.2047Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 506,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 501,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(15),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M57.8422 8.26562L57.7052 8.40262L55.3672 8.51562V8.26562H57.8422ZM61.7266 8.20156L61.8266 8.10156V8.18956L61.7266 8.20156ZM71.7125 5.53906V6.86406H67.1625C67.0977 6.4103 66.9802 5.96563 66.8125 5.53906H71.7125Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 517,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                                variants: getVariants(16),
                                animate: "shake",
                                transition: {
                                    delay: getRandomDelay()
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M31.927 13.1141V13.7521H35.114V13.1141H31.927ZM67.254 12.6641V14.4641H71.4V12.6641H67.254ZM31.927 10.3141V11.6011H34.064V10.3141H31.927Z",
                                    fill: color
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                    lineNumber: 528,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/glitchy-404.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/glitchy-404.tsx",
                    lineNumber: 331,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/glitchy-404.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/glitchy-404.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/hidden-terminal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HiddenTerminal",
    ()=>HiddenTerminal,
    "useKonamiCode",
    ()=>useKonamiCode,
    "useTripleClick",
    ()=>useTripleClick
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.js [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
;
const TERMINAL_COMMANDS = {
    help: [
        "Available commands:",
        "  help     - Show this message",
        "  status   - Check system status",
        "  repair   - Attempt page repair",
        "  secret   - ???",
        "  clear    - Clear terminal",
        "  exit     - Close terminal"
    ],
    status: [
        "SYSTEM STATUS",
        "─────────────────────────",
        "Page Status: ERROR 404",
        "Memory: 73% utilized",
        "CPU: Nominal",
        "Network: Connected",
        "Glitch Level: CRITICAL",
        "─────────────────────────",
        "Recommendation: Try 'repair'"
    ],
    repair: [
        "Initiating repair sequence...",
        "Scanning page fragments... [OK]",
        "Reconstructing DOM tree... [OK]",
        "Restoring navigation... [OK]",
        "─────────────────────────",
        "Repair complete!",
        "Hint: Hover over the 404 to stabilize it."
    ],
    secret: [
        "╔═══════════════════════════════╗",
        "║   You found the Easter egg!   ║",
        "║                               ║",
        "║   Built with love by the      ║",
        "║   development team.           ║",
        "║                               ║",
        "║   Keep exploring! :)          ║",
        "╚═══════════════════════════════╝"
    ],
    "404": [
        "I'm already a 404 page. That's meta."
    ],
    hello: [
        "Hello, human. Welcome to the void."
    ],
    hi: [
        "Hi there! Lost? Type 'help' for assistance."
    ],
    whoami: [
        "You are a curious user exploring a 404 page."
    ],
    ls: [
        "error_log.txt  fragments/  lost_page.bak  hope.exe"
    ],
    cat: [
        "Meow? Wrong terminal, friend."
    ],
    sudo: [
        "Nice try. No root access in the void."
    ],
    hack: [
        "This isn't a movie. Type 'help' instead."
    ],
    konami: [
        "↑ ↑ ↓ ↓ ← → ← → B A",
        "...Nice try, but wrong sequence!"
    ]
};
function HiddenTerminal({ isOpen, onClose }) {
    const [lines, setLines] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            type: "output",
            content: "Welcome to the 404 Recovery Terminal"
        },
        {
            type: "output",
            content: 'Type "help" for available commands.'
        },
        {
            type: "output",
            content: ""
        }
    ]);
    const [currentInput, setCurrentInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [commandHistory, setCommandHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const terminalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-scroll to bottom
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [
        lines
    ]);
    // Focus input when terminal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [
        isOpen
    ]);
    const processCommand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((cmd)=>{
        const trimmedCmd = cmd.trim().toLowerCase();
        // Add input to display
        setLines((prev)=>[
                ...prev,
                {
                    type: "input",
                    content: `> ${cmd}`
                }
            ]);
        // Add to history
        if (trimmedCmd) {
            setCommandHistory((prev)=>[
                    ...prev,
                    trimmedCmd
                ]);
        }
        setHistoryIndex(-1);
        // Process command
        if (trimmedCmd === "clear") {
            setLines([]);
            return;
        }
        if (trimmedCmd === "exit") {
            onClose();
            return;
        }
        const response = TERMINAL_COMMANDS[trimmedCmd];
        if (response) {
            const outputLines = Array.isArray(response) ? response : [
                response
            ];
            // Add output with slight delay for effect
            outputLines.forEach((line, index)=>{
                setTimeout(()=>{
                    setLines((prev)=>[
                            ...prev,
                            {
                                type: "output",
                                content: line
                            }
                        ]);
                }, index * 50);
            });
        } else if (trimmedCmd) {
            setLines((prev)=>[
                    ...prev,
                    {
                        type: "output",
                        content: `Command not found: ${trimmedCmd}`
                    },
                    {
                        type: "output",
                        content: 'Type "help" for available commands.'
                    }
                ]);
        }
    }, [
        onClose
    ]);
    const handleKeyDown = (e)=>{
        if (e.key === "Enter") {
            processCommand(currentInput);
            setCurrentInput("");
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setCurrentInput("");
                } else {
                    setHistoryIndex(newIndex);
                    setCurrentInput(commandHistory[newIndex]);
                }
            }
        } else if (e.key === "Escape") {
            onClose();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 20,
                scale: 0.95
            },
            animate: {
                opacity: 1,
                y: 0,
                scale: 1
            },
            exit: {
                opacity: 0,
                y: 20,
                scale: 0.95
            },
            transition: {
                duration: 0.2
            },
            className: "fixed bottom-4 right-4 w-[500px] max-w-[calc(100vw-2rem)] z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-xl border border-[#B87333]/50 bg-black/95 backdrop-blur-xl shadow-2xl shadow-[#B87333]/20 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#B87333]/20 to-transparent border-b border-[#B87333]/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                        className: "w-4 h-4 text-[#B87333]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-mono text-[#DA8A67]",
                                        children: "404-recovery-terminal"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                lineNumber: 177,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-1 rounded hover:bg-[#B87333]/20 transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4 text-slate-400 hover:text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                    lineNumber: 187,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                lineNumber: 183,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                        lineNumber: 176,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: terminalRef,
                        className: "h-[300px] overflow-y-auto p-4 font-mono text-sm scrollbar-thin",
                        onClick: ()=>inputRef.current?.focus(),
                        children: [
                            lines.map((line, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${line.type === "input" ? "text-[#DA8A67]" : "text-slate-300"} whitespace-pre-wrap`,
                                    children: line.content
                                }, index, false, {
                                    fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                    lineNumber: 198,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center text-[#DA8A67]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mr-2",
                                        children: ">"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: inputRef,
                                        type: "text",
                                        value: currentInput,
                                        onChange: (e)=>setCurrentInput(e.target.value),
                                        onKeyDown: handleKeyDown,
                                        className: "flex-1 bg-transparent outline-none text-[#DA8A67] caret-[#B87333]",
                                        spellCheck: false,
                                        autoComplete: "off"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
                                        animate: {
                                            opacity: [
                                                1,
                                                0
                                            ]
                                        },
                                        transition: {
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        },
                                        className: "w-2 h-4 bg-[#B87333] ml-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                        lineNumber: 223,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                        lineNumber: 192,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-2 border-t border-[#B87333]/30 bg-slate-900/50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-slate-500 font-mono",
                            children: "Press ESC to close | Ctrl+C to copy"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                            lineNumber: 233,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                        lineNumber: 232,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/hidden-terminal.tsx",
                lineNumber: 174,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/ui/hidden-terminal.tsx",
            lineNumber: 167,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/hidden-terminal.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
function useKonamiCode(callback) {
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "KeyB",
        "KeyA"
    ];
    const [inputSequence, setInputSequence] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            const newSequence = [
                ...inputSequence,
                e.code
            ].slice(-konamiCode.length);
            setInputSequence(newSequence);
            if (newSequence.join(",") === konamiCode.join(",")) {
                callback();
                setInputSequence([]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>window.removeEventListener("keydown", handleKeyDown);
    }, [
        inputSequence,
        callback
    ]);
}
function useTripleClick(callback) {
    const clickCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const timeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        clickCountRef.current += 1;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (clickCountRef.current >= 3) {
            callback();
            clickCountRef.current = 0;
        } else {
            timeoutRef.current = setTimeout(()=>{
                clickCountRef.current = 0;
            }, 500);
        }
    }, [
        callback
    ]);
    return handleClick;
}
}),
"[project]/src/app/not-found.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotFound
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.js [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$pulse$2d$beams$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/pulse-beams.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$glitchy$2d$404$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/glitchy-404.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$hidden$2d$terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/hidden-terminal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
// Beam configuration (same as dashboard layout)
const beams = [
    {
        path: "M-400 150H1400V1600H-400V-200",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "0%",
                y1: "0%",
                y2: "10%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "10%",
                    "60%",
                    "110%"
                ]
            },
            transition: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 3,
                delay: 0
            }
        }
    },
    {
        path: "M-400 600H1200V-300H-400V1600",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "0%",
                y1: "100%",
                y2: "90%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y2: [
                    "90%",
                    "40%",
                    "-10%"
                ]
            },
            transition: {
                duration: 16,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 2
            }
        }
    },
    {
        path: "M300 -300V600H2600V1600H-200",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "10%",
                y1: "0%",
                y2: "0%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "10%",
                    "60%",
                    "110%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "0%",
                    "50%",
                    "100%"
                ]
            },
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 2,
                delay: 1
            }
        }
    },
    {
        path: "M1000 -300V700H-300V1600H2600",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "90%",
                y1: "0%",
                y2: "0%"
            },
            animate: {
                x1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                x2: [
                    "90%",
                    "40%",
                    "-10%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "0%",
                    "50%",
                    "100%"
                ]
            },
            transition: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 3,
                delay: 5
            }
        }
    },
    {
        path: "M2600 200H800V1600H2600V-200",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "100%",
                y1: "0%",
                y2: "10%"
            },
            animate: {
                x1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                x2: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "10%",
                    "60%",
                    "110%"
                ]
            },
            transition: {
                duration: 16,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 3
            }
        }
    },
    {
        path: "M2600 700H600V-300H2600V1600",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "100%",
                y1: "100%",
                y2: "90%"
            },
            animate: {
                x1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                x2: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y2: [
                    "90%",
                    "40%",
                    "-10%"
                ]
            },
            transition: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 3,
                delay: 7
            }
        }
    },
    {
        path: "M400 1600V600H2600V-200H-200",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "10%",
                y1: "100%",
                y2: "100%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "10%",
                    "60%",
                    "110%"
                ],
                y1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y2: [
                    "100%",
                    "50%",
                    "0%"
                ]
            },
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 2,
                delay: 2
            }
        }
    },
    {
        path: "M1100 1600V400H-300V-200H2600",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "90%",
                y1: "100%",
                y2: "100%"
            },
            animate: {
                x1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                x2: [
                    "90%",
                    "40%",
                    "-10%"
                ],
                y1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                y2: [
                    "100%",
                    "50%",
                    "0%"
                ]
            },
            transition: {
                duration: 16,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 4
            }
        }
    },
    {
        path: "M-400 300H1000V1600H-400V-200",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "0%",
                y1: "0%",
                y2: "10%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "10%",
                    "60%",
                    "110%"
                ]
            },
            transition: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 8
            }
        }
    },
    {
        path: "M700 -300V500H2600V1600H-200",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "10%",
                y1: "0%",
                y2: "0%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "10%",
                    "60%",
                    "110%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "0%",
                    "50%",
                    "100%"
                ]
            },
            transition: {
                duration: 16,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 3,
                delay: 9
            }
        }
    },
    {
        path: "M-400 100H800V900H2600V-200H-400V1600",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "5%",
                y1: "0%",
                y2: "5%"
            },
            animate: {
                x1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                x2: [
                    "5%",
                    "55%",
                    "105%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "5%",
                    "55%",
                    "105%"
                ]
            },
            transition: {
                duration: 22,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 2,
                delay: 0.5
            }
        }
    },
    {
        path: "M2600 250H1200V750H-300V-200H2600V1600",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "95%",
                y1: "0%",
                y2: "5%"
            },
            animate: {
                x1: [
                    "100%",
                    "50%",
                    "0%"
                ],
                x2: [
                    "95%",
                    "45%",
                    "-5%"
                ],
                y1: [
                    "0%",
                    "50%",
                    "100%"
                ],
                y2: [
                    "5%",
                    "55%",
                    "105%"
                ]
            },
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 3,
                delay: 6
            }
        }
    }
];
const gradientColors = {
    start: "#B87333",
    middle: "#DA8A67",
    end: "#B87333"
};
function NotFound() {
    const [isTerminalOpen, setIsTerminalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRepaired, setIsRepaired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const openTerminal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsTerminalOpen(true);
    }, []);
    // Konami code Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$hidden$2d$terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useKonamiCode"])(openTerminal);
    // Triple-click on 404 to open terminal
    const handleTripleClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$hidden$2d$terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTripleClick"])(openTerminal);
    const handleRepair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsRepaired(true);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen overflow-hidden flex flex-col items-center justify-center relative bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$pulse$2d$beams$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PulseBeams"], {
                beams: beams,
                gradientColors: gradientColors,
                className: "absolute inset-0 w-full h-full opacity-60 z-0 pulse-beams-svg",
                width: 2400,
                height: 1400,
                baseColor: "#334155",
                accentColor: "#475569"
            }, void 0, false, {
                fileName: "[project]/src/app/not-found.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col items-center text-center px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2",
                        onClick: handleTripleClick,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$glitchy$2d$404$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Glitchy404"], {
                            width: 600,
                            height: 174,
                            color: "#B87333",
                            enableRepairMode: true,
                            onRepair: handleRepair
                        }, void 0, false, {
                            fileName: "[project]/src/app/not-found.tsx",
                            lineNumber: 299,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl md:text-3xl font-semibold text-white mb-4",
                        children: isRepaired ? "System Stabilized" : "Page Not Found"
                    }, void 0, false, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-400 max-w-md mb-8",
                        children: isRepaired ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "You've stabilized the glitch! The page still doesn't exist, but at least it looks better now."
                        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "The page you're looking for doesn't exist or has been moved. Let's get you back on track."
                        }, void 0, false)
                    }, void 0, false, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600 text-xs mb-6 font-mono",
                        children: isRepaired ? "Secret: Try the Konami code or triple-click..." : "Hint: Hover over the 404 to repair it..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium hover:from-[#CD7F32] hover:to-[#B87333] transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/not-found.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this),
                                    "Go to Dashboard"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/not-found.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.history.back(),
                                className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm text-white font-medium hover:bg-[#B87333]/10 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/not-found.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    "Go Back"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/not-found.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    isRepaired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openTerminal,
                        className: "mt-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#B87333] transition-colors font-mono",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/not-found.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this),
                            "Open Recovery Terminal"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/not-found.tsx",
                        lineNumber: 353,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/not-found.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$hidden$2d$terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HiddenTerminal"], {
                isOpen: isTerminalOpen,
                onClose: ()=>setIsTerminalOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/app/not-found.tsx",
                lineNumber: 364,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/not-found.tsx",
        lineNumber: 283,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_f0a6e72f._.js.map