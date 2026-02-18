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
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0, filter: "blur(12px)", y: 18 },
                visible: { opacity: 1, filter: "blur(0px)", y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
