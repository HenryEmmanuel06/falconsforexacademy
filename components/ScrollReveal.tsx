"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

type ScrollRevealProps = {
    children: ReactNode;
    className?: string;
    amount?: number;
    delay?: number;
};

export default function ScrollReveal({ children, className, amount = 0.2, delay = 0 }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { amount, once: false });

    return (
        <motion.div ref={ref} className={`relative ${className ?? ""}`.trim()}>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                    hidden: {
                        opacity: 1,
                        backdropFilter: "blur(6px)",
                    },
                    visible: {
                        opacity: 0,
                        backdropFilter: "blur(0px)",
                    },
                }}
                transition={{ duration: 0.3, ease: "easeOut", delay }}
                style={{ backgroundColor: "rgba(255,255,255,0.01)" }}
            />

            <div className="relative z-0">{children}</div>
        </motion.div>
    );
}
