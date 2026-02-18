"use client";

import { type ReactNode, useMemo } from "react";
import { motion, type Variants } from "framer-motion";

type MotionOnceProps = {
    children: ReactNode;
    className?: string;
    amount?: number;
    delay?: number;
    duration?: number;
};

function pickAnimation(
    className: string | undefined,
): "fadein_up" | "fadein_right" | "fadein_left" | "fadein_bottom" | "none" {
    const cn = className ?? "";
    if (cn.includes("fadein_up")) return "fadein_up";
    if (cn.includes("fadein_right")) return "fadein_right";
    if (cn.includes("fadein_left")) return "fadein_left";
    if (cn.includes("fadein_bottom")) return "fadein_bottom";
    return "none";
}

export default function MotionOnce({ children, className, amount = 0.2, delay = 0, duration = 0.6 }: MotionOnceProps) {
    const animation = pickAnimation(className);

    const variants = useMemo<Variants>(() => {
        if (animation === "fadein_right") {
            return {
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0 },
            };
        }

        if (animation === "fadein_left") {
            return {
                hidden: { opacity: 0, x: -24 },
                visible: { opacity: 1, x: 0 },
            };
        }

        if (animation === "fadein_bottom") {
            return {
                hidden: { opacity: 0, y: -24 },
                visible: { opacity: 1, y: 0 },
            };
        }

        if (animation === "fadein_up") {
            return {
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
            };
        }

        return {
            hidden: {},
            visible: {},
        };
    }, [animation]);

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={variants}
            transition={{ duration, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
