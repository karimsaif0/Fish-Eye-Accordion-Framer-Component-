/**
 * Made with 💛 by Karim Saif
 * Created and customized for Framer by Karim Saif
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */

"use client"

import * as React from "react"
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

const COMPONENT_AUTHOR = "Karim Saif" as const

type FAQItem = { question: string; answer: string }
type Props = {
    items: FAQItem[]
    maxWidth: number; gap: number; paddingX: number; paddingY: number; radius: number; borderWidth: number
    backgroundColor: string; hoverBackgroundColor: string; activeBackgroundColor: string
    borderColor: string; activeBorderColor: string; questionColor: string; answerColor: string; iconColor: string; shadow: string
    questionFont: any; answerFont: any; questionSize: number; questionWeight: number; answerSize: number; answerWeight: number; answerLineHeight: number
    fisheyeEnabled: boolean; fisheyeRange: number; maxScale: number; stiffness: number; damping: number; mass: number
    activation: "hover" | "click"; initialOpen: number
    openDuration: number; openBounce: number; closeDuration: number; closeBounce: number; blurAmount: number
    showIcon: boolean; icon: string; iconSize: number; iconRotation: number
    answerSpacing: number; hoverLift: number; activeScale: number
    reducedMotion: boolean; keyboardSupport: boolean
}

const DEFAULT_ITEMS: FAQItem[] = [
    { question: "What is a fisheye?", answer: "Each row scales by its distance from the cursor, creating a smooth magnification effect inspired by the macOS Dock." },
    { question: "Does it open on hover?", answer: "Yes. In hover mode, the row nearest to the pointer opens automatically without requiring a click." },
    { question: "Why is it so smooth?", answer: "Row centers are cached and refreshed when the layout changes, avoiding continuous layout reads during pointer movement." },
    { question: "Does it support reduced motion?", answer: "Yes. When reduced motion is enabled, magnification, springs, lifting and animated transitions are simplified or disabled." },
]

const DEFAULTS: Props = {
    items: DEFAULT_ITEMS, maxWidth: 760, gap: 10, paddingX: 22, paddingY: 20, radius: 18, borderWidth: 1,
    backgroundColor: "#FFFFFF", hoverBackgroundColor: "#F7F7F7", activeBackgroundColor: "#F2F2F2",
    borderColor: "#E6E6E6", activeBorderColor: "#D5D5D5", questionColor: "#111111", answerColor: "#666666", iconColor: "#111111",
    shadow: "0 8px 30px rgba(0,0,0,0.06)", questionFont: { family: "Inter", style: "Regular" }, answerFont: { family: "Inter", style: "Regular" },
    questionSize: 17, questionWeight: 600, answerSize: 15, answerWeight: 400, answerLineHeight: 1.55,
    fisheyeEnabled: true, fisheyeRange: 180, maxScale: 1.08, stiffness: 260, damping: 22, mass: 0.7,
    activation: "hover", initialOpen: -1, openDuration: 0.42, openBounce: 0.16, closeDuration: 0.3, closeBounce: 0.08, blurAmount: 5,
    showIcon: true, icon: "+", iconSize: 22, iconRotation: 45, answerSpacing: 12, hoverLift: -2, activeScale: 1.015,
    reducedMotion: true, keyboardSupport: true,
}

function clamp(value: number, min: number, max: number) { return Math.min(Math.max(value, min), max) }
function safeNumber(value: unknown, fallback: number, min?: number, max?: number) {
    const n = typeof value === "number" && Number.isFinite(value) ? value : fallback
    return typeof min === "number" && n < min ? min : typeof max === "number" && n > max ? max : n
}
function normalizeItems(value: unknown): FAQItem[] {
    if (!Array.isArray(value) || value.length === 0) return DEFAULT_ITEMS
    const result = value.map((item) => {
        if (!item || typeof item !== "object") return null
        const record = item as Record<string, unknown>
        return { question: typeof record.question === "string" ? record.question : "", answer: typeof record.answer === "string" ? record.answer : "" }
    }).filter(Boolean) as FAQItem[]
    return result.length ? result : DEFAULT_ITEMS
}
function getSafeProps(input: Partial<Props>): Props {
    const items = normalizeItems(input.items)
    const initialOpen = safeNumber(input.initialOpen, DEFAULTS.initialOpen, -1, Math.max(-1, items.length - 1))
    return {
        items,
        maxWidth: safeNumber(input.maxWidth, DEFAULTS.maxWidth, 120, 2000), gap: safeNumber(input.gap, DEFAULTS.gap, 0, 100),
        paddingX: safeNumber(input.paddingX, DEFAULTS.paddingX, 0, 100), paddingY: safeNumber(input.paddingY, DEFAULTS.paddingY, 0, 100),
        radius: safeNumber(input.radius, DEFAULTS.radius, 0, 100), borderWidth: safeNumber(input.borderWidth, DEFAULTS.borderWidth, 0, 10),
        backgroundColor: typeof input.backgroundColor === "string" ? input.backgroundColor : DEFAULTS.backgroundColor,
        hoverBackgroundColor: typeof input.hoverBackgroundColor === "string" ? input.hoverBackgroundColor : DEFAULTS.hoverBackgroundColor,
        activeBackgroundColor: typeof input.activeBackgroundColor === "string" ? input.activeBackgroundColor : DEFAULTS.activeBackgroundColor,
        borderColor: typeof input.borderColor === "string" ? input.borderColor : DEFAULTS.borderColor,
        activeBorderColor: typeof input.activeBorderColor === "string" ? input.activeBorderColor : DEFAULTS.activeBorderColor,
        questionColor: typeof input.questionColor === "string" ? input.questionColor : DEFAULTS.questionColor,
        answerColor: typeof input.answerColor === "string" ? input.answerColor : DEFAULTS.answerColor,
        iconColor: typeof input.iconColor === "string" ? input.iconColor : DEFAULTS.iconColor,
        shadow: typeof input.shadow === "string" ? input.shadow : DEFAULTS.shadow,
        questionFont: input.questionFont ?? DEFAULTS.questionFont, answerFont: input.answerFont ?? DEFAULTS.answerFont,
        questionSize: safeNumber(input.questionSize, DEFAULTS.questionSize, 8, 100), questionWeight: safeNumber(input.questionWeight, DEFAULTS.questionWeight, 100, 900),
        answerSize: safeNumber(input.answerSize, DEFAULTS.answerSize, 8, 100), answerWeight: safeNumber(input.answerWeight, DEFAULTS.answerWeight, 100, 900),
        answerLineHeight: safeNumber(input.answerLineHeight, DEFAULTS.answerLineHeight, 0.8, 3),
        fisheyeEnabled: typeof input.fisheyeEnabled === "boolean" ? input.fisheyeEnabled : DEFAULTS.fisheyeEnabled,
        fisheyeRange: safeNumber(input.fisheyeRange, DEFAULTS.fisheyeRange, 20, 1000), maxScale: safeNumber(input.maxScale, DEFAULTS.maxScale, 1, 2),
        stiffness: safeNumber(input.stiffness, DEFAULTS.stiffness, 1, 1000), damping: safeNumber(input.damping, DEFAULTS.damping, 1, 100), mass: safeNumber(input.mass, DEFAULTS.mass, 0.1, 10),
        activation: input.activation === "click" ? "click" : DEFAULTS.activation, initialOpen,
        openDuration: safeNumber(input.openDuration, DEFAULTS.openDuration, 0.01, 2), openBounce: safeNumber(input.openBounce, DEFAULTS.openBounce, 0, 1),
        closeDuration: safeNumber(input.closeDuration, DEFAULTS.closeDuration, 0.01, 2), closeBounce: safeNumber(input.closeBounce, DEFAULTS.closeBounce, 0, 1),
        blurAmount: safeNumber(input.blurAmount, DEFAULTS.blurAmount, 0, 30), showIcon: typeof input.showIcon === "boolean" ? input.showIcon : DEFAULTS.showIcon,
        icon: typeof input.icon === "string" ? input.icon : DEFAULTS.icon, iconSize: safeNumber(input.iconSize, DEFAULTS.iconSize, 8, 60),
        iconRotation: safeNumber(input.iconRotation, DEFAULTS.iconRotation, -180, 180), answerSpacing: safeNumber(input.answerSpacing, DEFAULTS.answerSpacing, 0, 60),
        hoverLift: safeNumber(input.hoverLift, DEFAULTS.hoverLift, -30, 30), activeScale: safeNumber(input.activeScale, DEFAULTS.activeScale, 1, 1.2),
        reducedMotion: typeof input.reducedMotion === "boolean" ? input.reducedMotion : DEFAULTS.reducedMotion,
        keyboardSupport: typeof input.keyboardSupport === "boolean" ? input.keyboardSupport : DEFAULTS.keyboardSupport,
    }
}
function getFontFamily(font: any): string | undefined { return typeof font === "string" ? font : font && typeof font.family === "string" ? font.family : undefined }
function getFontStyle(font: any): React.CSSProperties {
    const style = font && typeof font.style === "string" ? font.style : ""
    return { fontFamily: getFontFamily(font), fontStyle: /italic/i.test(style) ? "italic" : "normal" }
}

function StaticFaqList({ props }: { props: Props }) {
    const id = React.useId().replace(/:/g, "")
    return <div data-component-author={COMPONENT_AUTHOR} style={{ width: "100%", maxWidth: props.maxWidth, margin: "0 auto", display: "flex", flexDirection: "column", gap: props.gap, boxSizing: "border-box" }}>
        {props.items.map((item, index) => {
            const active = props.initialOpen === index
            return <div key={`${index}-${item.question}`} style={{ position: "relative", width: "100%", zIndex: active ? 3 : 1, transform: active ? `scale(${props.activeScale})` : "none" }}>
                <div style={{ width: "100%", boxSizing: "border-box", borderRadius: props.radius, border: `${props.borderWidth}px solid ${active ? props.activeBorderColor : props.borderColor}`, background: active ? props.activeBackgroundColor : props.backgroundColor, boxShadow: props.shadow, overflow: "hidden" }}>
                    <div style={{ padding: `${props.paddingY}px ${props.paddingX}px`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                        <span style={{ minWidth: 0, flex: 1, color: props.questionColor, fontSize: props.questionSize, fontWeight: props.questionWeight, lineHeight: 1.25, overflowWrap: "anywhere", ...getFontStyle(props.questionFont) }}>{item.question}</span>
                        {props.showIcon && <span aria-hidden="true" style={{ flex: "0 0 auto", width: props.iconSize, height: props.iconSize, display: "flex", alignItems: "center", justifyContent: "center", color: props.iconColor, fontSize: props.iconSize, lineHeight: 1, transform: active ? `rotate(${props.iconRotation}deg)` : "none", userSelect: "none" }}>{props.icon}</span>}
                    </div>
                    {active && <div id={`${id}-answer-${index}`} style={{ padding: `0 ${props.paddingX}px ${props.paddingY}px`, color: props.answerColor, fontSize: props.answerSize, fontWeight: props.answerWeight, lineHeight: props.answerLineHeight, overflowWrap: "anywhere", ...getFontStyle(props.answerFont) }}><div style={{ paddingTop: props.answerSpacing }}>{item.answer}</div></div>}
                </div>
            </div>
        })}
    </div>
}

function FisheyeRow({ item, index, active, hovered, pointerY, centerY, props, reducedMotion, onToggle, onHover, componentId }: {
    item: FAQItem; index: number; active: boolean; hovered: boolean; pointerY: MotionValue<number>; centerY: MotionValue<number>; props: Props; reducedMotion: boolean
    onToggle: (index: number) => void; onHover: (index: number | null) => void; componentId: string
}) {
    const answerId = `${componentId}-answer-${index}`
    const distanceScale = useTransform(pointerY, (y) => {
        if (!props.fisheyeEnabled || reducedMotion || !Number.isFinite(y)) return 1
        const center = centerY.get(); if (!Number.isFinite(center)) return 1
        const distance = Math.abs(y - center); if (distance >= props.fisheyeRange) return 1
        const normalized = 1 - distance / Math.max(1, props.fisheyeRange)
        return 1 + (props.maxScale - 1) * normalized * normalized
    })
    const scale = useSpring(distanceScale, { stiffness: props.stiffness, damping: props.damping, mass: props.mass })
    const activeScale = useSpring(active ? props.activeScale : 1, { stiffness: props.stiffness, damping: props.damping, mass: props.mass })
    const lift = useSpring(hovered && !reducedMotion ? props.hoverLift : 0, { stiffness: props.stiffness, damping: props.damping, mass: props.mass })
    const combinedScale = useTransform([scale, activeScale], ([a, b]) => Number(a) * Number(b))
    const rowBackground = active ? props.activeBackgroundColor : hovered ? props.hoverBackgroundColor : props.backgroundColor
    const openTransition = reducedMotion ? { duration: 0.01 } : { type: "spring" as const, visualDuration: props.openDuration, bounce: props.openBounce }
    const closeTransition = reducedMotion ? { duration: 0.01 } : { type: "spring" as const, visualDuration: props.closeDuration, bounce: props.closeBounce }

    return <motion.div style={{ position: "relative", width: "100%", scale: combinedScale, y: lift, zIndex: active ? 3 : hovered ? 2 : 1 }} onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(null)}>
        <motion.button
            type="button"
            aria-expanded={active}
            aria-controls={answerId}
            aria-label={props.activation === "hover" ? `${item.question}. Hover to open, or activate with keyboard.` : item.question}
            onClick={() => onToggle(index)}
            style={{ width: "100%", display: "block", margin: 0, padding: 0, textAlign: "left", border: "none", outline: "none", color: "inherit", font: "inherit", cursor: "pointer", background: "transparent", appearance: "none", WebkitAppearance: "none" }}
            whileFocus={{ boxShadow: "0 0 0 3px rgba(0,0,0,0.16)" }}
        >
            <div style={{ width: "100%", boxSizing: "border-box", borderRadius: props.radius, border: `${props.borderWidth}px solid ${active ? props.activeBorderColor : props.borderColor}`, background: rowBackground, boxShadow: props.shadow, overflow: "hidden", transition: reducedMotion ? "none" : "background 180ms ease, border-color 180ms ease" }}>
                <div style={{ padding: `${props.paddingY}px ${props.paddingX}px`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ minWidth: 0, flex: 1, color: props.questionColor, fontSize: props.questionSize, fontWeight: props.questionWeight, lineHeight: 1.25, overflowWrap: "anywhere", ...getFontStyle(props.questionFont) }}>{item.question}</span>
                    {props.showIcon && <motion.span aria-hidden="true" animate={{ rotate: active ? props.iconRotation : 0 }} transition={reducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: props.stiffness, damping: props.damping, mass: props.mass }} style={{ flex: "0 0 auto", width: props.iconSize, height: props.iconSize, display: "flex", alignItems: "center", justifyContent: "center", color: props.iconColor, fontSize: props.iconSize, lineHeight: 1, userSelect: "none" }}>{props.icon}</motion.span>}
                </div>
                <AnimatePresence initial={false}>
                    {active && <motion.div id={answerId} initial={{ height: 0, opacity: 0, filter: reducedMotion || props.blurAmount <= 0 ? "blur(0px)" : `blur(${props.blurAmount}px)` }} animate={{ height: "auto", opacity: 1, filter: "blur(0px)", transition: { height: openTransition, opacity: reducedMotion ? { duration: 0.01 } : { duration: Math.min(props.openDuration, 0.3) }, filter: reducedMotion ? { duration: 0.01 } : { duration: props.openDuration } } }} exit={{ height: 0, opacity: 0, filter: reducedMotion || props.blurAmount <= 0 ? "blur(0px)" : `blur(${props.blurAmount}px)`, transition: { height: closeTransition, opacity: reducedMotion ? { duration: 0.01 } : { duration: Math.min(props.closeDuration, 0.25) }, filter: reducedMotion ? { duration: 0.01 } : { duration: props.closeDuration } } }} style={{ overflow: "hidden" }}>
                        <div style={{ padding: `0 ${props.paddingX}px ${props.paddingY}px`, color: props.answerColor, fontSize: props.answerSize, fontWeight: props.answerWeight, lineHeight: props.answerLineHeight, overflowWrap: "anywhere", ...getFontStyle(props.answerFont) }}><div style={{ paddingTop: props.answerSpacing }}>{item.answer}</div></div>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </motion.button>
    </motion.div>
}

function InteractiveFaqList({ props }: { props: Props }) {
    const systemReducedMotion = useReducedMotion()
    const reducedMotion = props.reducedMotion && systemReducedMotion === true
    const [active, setActive] = React.useState<number | null>(props.initialOpen >= 0 ? props.initialOpen : null)
    const [hovered, setHovered] = React.useState<number | null>(null)
    const pointerY = useMotionValue(-9999)
    const centers = React.useRef<number[]>([])
    const rowsRef = React.useRef<Array<HTMLDivElement | null>>([])
    const frame = React.useRef<number | null>(null)
    const componentId = React.useId().replace(/:/g, "")
    const measure = React.useCallback(() => { centers.current = rowsRef.current.map((el) => { if (!el) return Number.NaN; const r = el.getBoundingClientRect(); return r.top + r.height / 2 }) }, [])
    const scheduleMeasure = React.useCallback(() => { if (typeof window === "undefined" || frame.current !== null) return; frame.current = window.requestAnimationFrame(() => { frame.current = null; measure() }) }, [measure])

    React.useEffect(() => {
        scheduleMeasure()
        const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleMeasure) : null
        rowsRef.current.forEach((el) => el && observer?.observe(el))
        window.addEventListener("resize", scheduleMeasure)
        window.addEventListener("scroll", scheduleMeasure, true)
        return () => { window.removeEventListener("resize", scheduleMeasure); window.removeEventListener("scroll", scheduleMeasure, true); observer?.disconnect(); if (frame.current !== null) window.cancelAnimationFrame(frame.current) }
    }, [props.items.length, scheduleMeasure])
    React.useEffect(() => { scheduleMeasure() }, [active, hovered, scheduleMeasure])
    React.useEffect(() => { setActive((v) => v !== null && v < props.items.length ? v : props.initialOpen >= 0 ? props.initialOpen : null); setHovered((v) => v !== null && v < props.items.length ? v : null) }, [props.items.length, props.initialOpen])

    const findNearest = React.useCallback((y: number) => {
        let nearest = -1, distance = Infinity
        centers.current.forEach((center, index) => { if (!Number.isFinite(center)) return; const d = Math.abs(y - center); if (d < distance) { distance = d; nearest = index } })
        return nearest
    }, [])
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "touch") return
        pointerY.set(event.clientY)
        const nearest = findNearest(event.clientY)
        if (nearest < 0) return
        setHovered((v) => v === nearest ? v : nearest)
        if (props.activation === "hover") setActive((v) => v === nearest ? v : nearest)
    }
    const leave = () => { pointerY.set(-9999); setHovered(null); if (props.activation === "hover") setActive(null) }
    const handleHover = (index: number | null) => { setHovered(index); if (props.activation === "hover") setActive(index) }
    const handleToggle = (index: number) => setActive((v) => v === index ? null : index)

    return <div data-component-author={COMPONENT_AUTHOR} onPointerMove={handlePointerMove} onPointerLeave={leave} onPointerCancel={leave} style={{ width: "100%", maxWidth: props.maxWidth, margin: "0 auto", display: "flex", flexDirection: "column", gap: props.gap, boxSizing: "border-box", touchAction: "pan-y" }}>
        {props.items.map((item, index) => <div key={`${index}-${item.question}`} ref={(el) => { rowsRef.current[index] = el }} style={{ width: "100%" }}>
            <FisheyeRow item={item} index={index} active={active === index} hovered={hovered === index} pointerY={pointerY} centerY={{ get: () => centers.current[index] ?? Number.NaN } as MotionValue<number>} props={props} reducedMotion={reducedMotion} onToggle={handleToggle} onHover={handleHover} componentId={componentId} />
        </div>)}
    </div>
}

export default function FisheyeFaq(inputProps: Partial<Props>) {
    const isStatic = useIsStaticRenderer()
    const props = getSafeProps(inputProps)
    if (isStatic) return <StaticFaqList props={props} />
    return <InteractiveFaqList props={props} />
}

FisheyeFaq.defaultProps = DEFAULTS

addPropertyControls(FisheyeFaq, {
    items: { type: ControlType.Array, title: "Items", maxCount: 20, control: { type: ControlType.Object, controls: { question: { type: ControlType.String, title: "Question", defaultValue: "What is a fisheye?" }, answer: { type: ControlType.String, title: "Answer", defaultValue: "Each row scales by its distance from the cursor.", displayTextArea: true } } } },
    maxWidth: { type: ControlType.Number, title: "Max Width", min: 120, max: 2000, step: 1, description: "Maximum width of the complete accordion." },
    gap: { type: ControlType.Number, title: "Gap", min: 0, max: 100, step: 1, description: "Vertical space between accordion rows." },
    paddingX: { type: ControlType.Number, title: "Horizontal Padding", min: 0, max: 100, step: 1, description: "Horizontal padding inside each row." },
    paddingY: { type: ControlType.Number, title: "Vertical Padding", min: 0, max: 100, step: 1, description: "Vertical padding inside each row." },
    radius: { type: ControlType.Number, title: "Radius", min: 0, max: 100, step: 1, description: "Corner radius applied to each accordion row." },
    borderWidth: { type: ControlType.Number, title: "Border Width", min: 0, max: 10, step: 1, description: "Thickness of the row border." },
    backgroundColor: { type: ControlType.Color, title: "Background", description: "Background color of inactive rows." },
    hoverBackgroundColor: { type: ControlType.Color, title: "Hover Background", description: "Background color while a row is hovered." },
    activeBackgroundColor: { type: ControlType.Color, title: "Active Background", description: "Background color of the open row." },
    borderColor: { type: ControlType.Color, title: "Border", description: "Border color of inactive rows." },
    activeBorderColor: { type: ControlType.Color, title: "Active Border", description: "Border color of the open row." },
    questionColor: { type: ControlType.Color, title: "Question Color", description: "Color of the question text." },
    answerColor: { type: ControlType.Color, title: "Answer Color", description: "Color of the answer text." },
    iconColor: { type: ControlType.Color, title: "Icon Color", description: "Color of the accordion icon." },
    shadow: { type: ControlType.String, title: "Shadow", description: "CSS box-shadow applied to each accordion row." },
    questionFont: { type: ControlType.Font, title: "Question Font", description: "Font family and style used for question text." },
    answerFont: { type: ControlType.Font, title: "Answer Font", description: "Font family and style used for answer text." },
    questionSize: { type: ControlType.Number, title: "Question Size", min: 8, max: 100, step: 1, description: "Font size of the question text in pixels." },
    questionWeight: { type: ControlType.Number, title: "Question Weight", min: 100, max: 900, step: 100, description: "Font weight used for question text." },
    answerSize: { type: ControlType.Number, title: "Answer Size", min: 8, max: 100, step: 1, description: "Font size of the answer text in pixels." },
    answerWeight: { type: ControlType.Number, title: "Answer Weight", min: 100, max: 900, step: 100, description: "Font weight used for answer text." },
    answerLineHeight: { type: ControlType.Number, title: "Answer Line Height", min: 0.8, max: 3, step: 0.05, description: "Line-height multiplier used by the answer text." },
    fisheyeEnabled: { type: ControlType.Boolean, title: "Fisheye", enabledTitle: "Enabled", disabledTitle: "Disabled", description: "Magnifies rows based on their distance from the pointer." },
    fisheyeRange: { type: ControlType.Number, title: "Fisheye Range", min: 20, max: 1000, step: 1, description: "Distance around the pointer where fisheye magnification is applied." },
    maxScale: { type: ControlType.Number, title: "Max Scale", min: 1, max: 2, step: 0.01, description: "Maximum scale reached by the row closest to the pointer." },
    stiffness: { type: ControlType.Number, title: "Stiffness", min: 1, max: 1000, step: 1, description: "Spring stiffness controlling fisheye and interaction responsiveness." },
    damping: { type: ControlType.Number, title: "Damping", min: 1, max: 100, step: 1, description: "Spring damping controlling overshoot and settling." },
    mass: { type: ControlType.Number, title: "Mass", min: 0.1, max: 10, step: 0.1, description: "Spring mass controlling the physical feel of movement." },
    activation: { type: ControlType.Enum, title: "Activation", options: ["hover", "click"], optionTitles: ["Hover", "Click"], description: "Controls whether rows open from pointer hover or explicit activation." },
    initialOpen: { type: ControlType.Number, title: "Initial Open", min: -1, max: 19, step: 1, description: "Index of the row initially open. Use -1 to start with all rows closed." },
    openDuration: { type: ControlType.Number, title: "Open Duration", min: 0.01, max: 2, step: 0.01, description: "Visual duration used when opening the answer." },
    openBounce: { type: ControlType.Number, title: "Open Bounce", min: 0, max: 1, step: 0.01, description: "Spring bounce amount used when opening an answer." },
    closeDuration: { type: ControlType.Number, title: "Close Duration", min: 0.01, max: 2, step: 0.01, description: "Visual duration used when closing the answer." },
    closeBounce: { type: ControlType.Number, title: "Close Bounce", min: 0, max: 1, step: 0.01, description: "Spring bounce amount used when closing an answer." },
    blurAmount: { type: ControlType.Number, title: "Blur", min: 0, max: 30, step: 1, description: "Blur applied while the answer is transitioning." },
    showIcon: { type: ControlType.Boolean, title: "Show Icon", enabledTitle: "Visible", disabledTitle: "Hidden", description: "Shows or hides the accordion toggle icon." },
    icon: { type: ControlType.String, title: "Icon", defaultValue: "+", description: "Character or symbol used as the accordion icon." },
    iconSize: { type: ControlType.Number, title: "Icon Size", min: 8, max: 60, step: 1, description: "Size of the accordion icon." },
    iconRotation: { type: ControlType.Number, title: "Icon Rotation", min: -180, max: 180, step: 1, description: "Rotation applied to the icon when its row is open." },
    answerSpacing: { type: ControlType.Number, title: "Answer Spacing", min: 0, max: 60, step: 1, description: "Space between the question area and answer text." },
    hoverLift: { type: ControlType.Number, title: "Hover Lift", min: -30, max: 30, step: 1, description: "Vertical movement applied to the hovered row." },
    activeScale: { type: ControlType.Number, title: "Active Scale", min: 1, max: 1.2, step: 0.005, description: "Scale applied to the currently active row." },
    reducedMotion: { type: ControlType.Boolean, title: "Reduced Motion", enabledTitle: "Respect", disabledTitle: "Ignore", description: "Respects the user's reduced-motion preference and simplifies animated effects." },
    keyboardSupport: { type: ControlType.Boolean, title: "Keyboard Support", enabledTitle: "Enhanced", disabledTitle: "Basic", description: "Keeps enhanced keyboard focus styling available while the semantic button remains keyboard accessible." },
})
