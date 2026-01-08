'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface NumberTickerProps {
    value: number;
    direction?: 'up' | 'down';
    delay?: number;
    className?: string;
    suffix?: string;
}

export default function NumberTicker({
    value,
    direction = 'up',
    delay = 0,
    className,
    suffix = '',
}: NumberTickerProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === 'down' ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    });
    const isInView = useInView(ref, { margin: '0px', once: true });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === 'down' ? 0 : value);
            }, delay * 1000);
        }
    }, [motionValue, isInView, delay, value, direction]);

    useEffect(() => {
        springValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(
                    Math.round(latest)
                ) + suffix;
            }
        });
    }, [springValue, suffix]);

    return (
        <span
            className={className}
            ref={ref}
        />
    );
}
