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
"[project]/src/components/ui/gradient-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GradientButton",
    ()=>GradientButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function GradientButton({ children, className = "", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `gradient-button-copper w-full px-6 py-3 text-white font-medium ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/gradient-button.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/login.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginPage",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-ssr] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$pulse$2d$beams$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/pulse-beams.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$gradient$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/gradient-button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
// --- BEAM CONFIGURATION ---
const beams = [
    {
        path: "M-200 150H800V1500",
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
        path: "M-200 600H500V-200",
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
        path: "M300 -200V400H2500",
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
        path: "M1000 -200V500H-200",
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
        path: "M2500 200H1200V1500",
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
        path: "M2500 700H900V-200",
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
        path: "M400 1500V800H2500",
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
        path: "M1100 1500V600H-200",
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
        path: "M-200 300H600V1500",
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
        path: "M700 -200V350H2500",
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
        path: "M-200 100H400V700H2500",
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
        path: "M2500 250H1400V550H-200",
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
    },
    {
        path: "M200 -200V300H1000V1500",
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
                delay: 3.5
            }
        }
    },
    {
        path: "M1300 1500V900H700V-200",
        gradientConfig: {
            initial: {
                x1: "100%",
                x2: "95%",
                y1: "100%",
                y2: "95%"
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
                    "100%",
                    "50%",
                    "0%"
                ],
                y2: [
                    "95%",
                    "45%",
                    "-5%"
                ]
            },
            transition: {
                duration: 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 7.5
            }
        }
    },
    {
        path: "M-200 450H2500",
        gradientConfig: {
            initial: {
                x1: "0%",
                x2: "10%",
                y1: "50%",
                y2: "50%"
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
                    "50%",
                    "50%",
                    "50%"
                ],
                y2: [
                    "50%",
                    "50%",
                    "50%"
                ]
            },
            transition: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                repeatDelay: 4,
                delay: 10
            }
        }
    },
    {
        path: "M850 -200V1500",
        gradientConfig: {
            initial: {
                x1: "50%",
                x2: "50%",
                y1: "0%",
                y2: "10%"
            },
            animate: {
                x1: [
                    "50%",
                    "50%",
                    "50%"
                ],
                x2: [
                    "50%",
                    "50%",
                    "50%"
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
                repeatDelay: 5,
                delay: 11
            }
        }
    }
];
const gradientColors = {
    start: "#FFFFFF",
    middle: "#DA8A67",
    end: "#B87333"
};
// --- HELPER COMPONENTS (ICONS) ---
const GoogleIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-5 w-5",
        viewBox: "0 0 48 48",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#FFC107",
                d: "M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 347,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#FF3D00",
                d: "M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 351,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#4CAF50",
                d: "M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 355,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#1976D2",
                d: "M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 359,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/login.tsx",
        lineNumber: 342,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const LoginPage = ({ title = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
    className: "font-light tracking-tighter",
    children: "Welcome"
}, void 0, false, {
    fileName: "[project]/src/components/ui/login.tsx",
    lineNumber: 383,
    columnNumber: 11
}, ("TURBOPACK compile-time value", void 0)), description = "Access your account and continue your journey with us", heroImageSrc, onSignIn, onGoogleSignIn, onResetPassword, onCreateAccount, isLoading = false, error = null })=>{
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] relative overflow-hidden bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$pulse$2d$beams$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PulseBeams"], {
                beams: beams,
                gradientColors: gradientColors,
                className: "absolute inset-0 w-full h-full opacity-60 z-0",
                width: 2400,
                height: 1400,
                baseColor: "#334155",
                accentColor: "#475569"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex-1 flex items-center justify-center md:justify-start p-8 relative z-10 text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-md md:ml-8 lg:ml-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 412,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "animate-element animate-delay-200 text-slate-400",
                                children: description
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 415,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-element animate-delay-250 rounded-lg bg-red-900/50 border border-red-500/30 p-3 text-sm text-red-200",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 420,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "space-y-5",
                                onSubmit: onSignIn,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-element animate-delay-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-sm font-medium text-slate-400",
                                                children: "Email Address"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 427,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "email",
                                                    type: "email",
                                                    placeholder: "Enter your email address",
                                                    className: "w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-slate-500",
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ui/login.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 430,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 426,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-element animate-delay-400",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-sm font-medium text-slate-400",
                                                children: "Password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 442,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            name: "password",
                                                            type: showPassword ? "text" : "password",
                                                            placeholder: "Enter your password",
                                                            className: "w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-slate-500",
                                                            required: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ui/login.tsx",
                                                            lineNumber: 447,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setShowPassword(!showPassword),
                                                            className: "absolute inset-y-0 right-3 flex items-center",
                                                            children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                className: "w-5 h-5 text-slate-400 hover:text-white transition-colors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ui/login.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "w-5 h-5 text-slate-400 hover:text-white transition-colors"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ui/login.tsx",
                                                                lineNumber: 462,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ui/login.tsx",
                                                            lineNumber: 454,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ui/login.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 445,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 441,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-element animate-delay-500 flex items-center justify-between text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-3 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        name: "rememberMe",
                                                        className: "custom-checkbox"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ui/login.tsx",
                                                        lineNumber: 471,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-300",
                                                        children: "Keep me signed in"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ui/login.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 470,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                onClick: (e)=>{
                                                    e.preventDefault();
                                                    onResetPassword?.();
                                                },
                                                className: "hover:underline text-[#DA8A67] transition-colors",
                                                children: "Reset password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ui/login.tsx",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-element animate-delay-600 flex justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$gradient$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GradientButton"], {
                                            type: "submit",
                                            className: "rounded-2xl",
                                            disabled: isLoading,
                                            children: isLoading ? "Signing in..." : "Sign In"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/login.tsx",
                                            lineNumber: 491,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 490,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 425,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-element animate-delay-700 relative flex items-center justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-full border-t border-[#B87333]/30"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 502,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-4 text-sm text-slate-400 bg-black absolute",
                                        children: "Or continue with"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 503,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 501,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onGoogleSignIn,
                                className: "animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#B87333]/30 rounded-2xl py-4 text-white hover:bg-[#B87333]/10 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleIcon, {}, void 0, false, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 513,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Continue with Google"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 508,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "animate-element animate-delay-900 text-center text-sm text-slate-400",
                                children: [
                                    "New to our platform?",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#",
                                        onClick: (e)=>{
                                            e.preventDefault();
                                            onCreateAccount?.();
                                        },
                                        className: "text-[#DA8A67] hover:underline transition-colors",
                                        children: "Create Account"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/login.tsx",
                                        lineNumber: 519,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/login.tsx",
                                lineNumber: 517,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/login.tsx",
                        lineNumber: 411,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/login.tsx",
                    lineNumber: 410,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 409,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            heroImageSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "hidden md:block flex-1 relative z-10 pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/login.tsx",
                lineNumber: 536,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/login.tsx",
        lineNumber: 396,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// JWT Payload interface matching the backend structure
__turbopack_context__.s([
    "clearTokenCache",
    ()=>clearTokenCache,
    "decodeJWT",
    ()=>decodeJWT,
    "getAuthHeaders",
    ()=>getAuthHeaders,
    "getAuthHeadersAsync",
    ()=>getAuthHeadersAsync,
    "getAuthHeadersFromCookies",
    ()=>getAuthHeadersFromCookies,
    "getTimeUntilExpiration",
    ()=>getTimeUntilExpiration,
    "getTokenExpirationDate",
    ()=>getTokenExpirationDate,
    "getTokenFromCookies",
    ()=>getTokenFromCookies,
    "hasAllPermissions",
    ()=>hasAllPermissions,
    "hasAnyPermission",
    ()=>hasAnyPermission,
    "hasPermission",
    ()=>hasPermission,
    "isTokenExpired",
    ()=>isTokenExpired,
    "isTokenValid",
    ()=>isTokenValid,
    "logout",
    ()=>logout,
    "validateRedirectUrl",
    ()=>validateRedirectUrl
]);
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        // Decode the payload (second part)
        const payload = parts[1];
        // Handle base64url decoding (works in both browser and Node.js)
        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - base64.length % 4) % 4;
        base64 += '='.repeat(padLength);
        let decoded;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // Node.js environment
            decoded = Buffer.from(base64, 'base64').toString('utf-8');
        }
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
function getTokenFromCookies(cookies) {
    const cookieMap = new Map();
    cookies.split(';').forEach((cookie)=>{
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            cookieMap.set(key.trim(), decodeURIComponent(value));
        }
    });
    return cookieMap.get('product_auth_token') || null;
}
// Cache for token to avoid repeated API calls (client-side only)
let tokenCache = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
function getAuthHeaders() {
    // HTTP-only cookies cannot be accessed from JavaScript
    // This function is kept for backward compatibility but returns empty headers
    // Use getAuthHeadersAsync() for proper token retrieval
    return {};
}
async function getAuthHeadersAsync() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {};
    }
    //TURBOPACK unreachable
    ;
}
function clearTokenCache() {
    tokenCache = null;
}
function getAuthHeadersFromCookies(cookies) {
    const token = getTokenFromCookies(cookies);
    if (token) {
        return {
            Authorization: `Bearer ${token}`
        };
    }
    return {};
}
function isTokenExpired(token) {
    const payload = decodeJWT(token);
    if (!payload) {
        return true; // Invalid token format, consider expired
    }
    // Check if token has exp claim
    if (!payload.exp) {
        return false; // No expiration claim, assume valid
    }
    // Compare with current time
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}
function getTokenExpirationDate(token) {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }
    return new Date(payload.exp * 1000); // Convert Unix timestamp (seconds) to milliseconds
}
function getTimeUntilExpiration(token) {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
        return null;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = payload.exp - currentTime;
    return timeUntilExpiration > 0 ? timeUntilExpiration : 0;
}
function isTokenValid(token) {
    if (!token || token.trim() === '') {
        return false;
    }
    // Basic token format check (should have 3 parts separated by dots)
    if (token.split('.').length !== 3) {
        return false;
    }
    return !isTokenExpired(token);
}
function validateRedirectUrl(redirectParam, defaultUrl = '/') {
    if (!redirectParam) {
        return defaultUrl;
    }
    try {
        // Decode the URL parameter
        const decoded = decodeURIComponent(redirectParam);
        // Security checks:
        // 1. Must start with / (relative URL only)
        if (!decoded.startsWith('/')) {
            return defaultUrl;
        }
        // 2. Prevent protocol-relative URLs (//example.com)
        if (decoded.startsWith('//')) {
            return defaultUrl;
        }
        // 3. Prevent javascript:, data:, vbscript: URLs
        if (decoded.match(/^(javascript|data|vbscript|file|about):/i)) {
            return defaultUrl;
        }
        // 4. Prevent null bytes and other dangerous characters
        if (decoded.includes('\0') || decoded.includes('\r') || decoded.includes('\n')) {
            return defaultUrl;
        }
        // 5. Prevent URLs with query parameters that could be exploited
        // Allow query params but validate the base path
        const urlPath = decoded.split('?')[0];
        if (!urlPath.startsWith('/')) {
            return defaultUrl;
        }
        // 6. Prevent excessive path traversal attempts
        if (urlPath.includes('../') || urlPath.includes('..\\')) {
            return defaultUrl;
        }
        return decoded;
    } catch (error) {
        // If decoding fails, return default URL
        console.error('Error validating redirect URL:', error);
        return defaultUrl;
    }
}
async function logout() {
    try {
        // Clear token cache
        clearTokenCache();
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally{
        // Always redirect to login page
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
}
function hasPermission(token, requiredPermission) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return payload.permissions.includes(requiredPermission);
}
function hasAnyPermission(token, requiredPermissions) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return requiredPermissions.some((perm)=>payload.permissions.includes(perm));
}
function hasAllPermissions(token, requiredPermissions) {
    const payload = decodeJWT(token);
    if (!payload || !payload.permissions) {
        return false;
    }
    return requiredPermissions.every((perm)=>payload.permissions.includes(perm));
}
}),
"[project]/src/app/(auth)/login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPageRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$login$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/login.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthNavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthNavigationContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jwt-auth.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function LoginPageContent() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { navigateTo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthNavigationContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthNavigation"])();
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Get and validate redirect URL from query parameters, default to dashboard
    // This prevents open redirect attacks by only allowing relative URLs
    const redirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jwt$2d$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateRedirectUrl"])(searchParams.get("redirect"), "/dashboard");
    const handleSignIn = async (e)=>{
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed. Please try again.");
                setIsLoading(false);
                return;
            }
            // Redirect to the validated safe URL
            // Use window.location.href to force full page reload and ensure cookie is available
            window.location.href = redirectUrl;
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };
    const handleGoogleSignIn = ()=>{
        // TODO: Implement Google sign-in
        console.log("Google sign-in clicked");
    };
    const handleResetPassword = ()=>{
        // TODO: Implement password reset
        console.log("Reset password clicked");
    };
    const handleCreateAccount = ()=>{
        navigateTo("signup");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$login$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoginPage"], {
        onSignIn: handleSignIn,
        onGoogleSignIn: handleGoogleSignIn,
        onResetPassword: handleResetPassword,
        onCreateAccount: handleCreateAccount,
        isLoading: isLoading,
        error: error
    }, void 0, false, {
        fileName: "[project]/src/app/(auth)/login/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function LoginPageRoute() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-black",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/(auth)/login/page.tsx",
            lineNumber: 89,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginPageContent, {}, void 0, false, {
            fileName: "[project]/src/app/(auth)/login/page.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(auth)/login/page.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_8d27ba0b._.js.map