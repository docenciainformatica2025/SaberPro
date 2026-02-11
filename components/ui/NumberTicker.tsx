"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface NumberTickerProps {
    value: number;
    className?: string;
    suffix?: string;
}

export default function NumberTicker({ value, className, suffix = "" }: NumberTickerProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
    }, [springValue]);

    return (
        <span ref={ref} className={className} aria-atomic="true">
            <span className="sr-only">{value}{suffix}</span>
            <span aria-hidden="true">
                {displayValue}{suffix}
            </span>
        </span>
    );
}
