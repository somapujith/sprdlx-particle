"use client"

import { motion } from "motion/react"
import * as React from "react"
import { cn } from "@/lib/utils"

type TextGenerateEffectProps = Omit<React.ComponentProps<"div">, "children"> & {
  words: string
  filter?: boolean
  duration?: number
  staggerDelay?: number
  delay?: number
}

function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  delay = 0,
  ...props
}: TextGenerateEffectProps) {
  const wordsArray = React.useMemo(() => words.split(" "), [words])

  return (
    <div
      className={cn("font-bold", className)}
      data-slot="text-generate-effect"
      {...(props as any)}
    >
      {wordsArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          initial={{
            opacity: 0,
            filter: filter ? "blur(10px)" : "none",
          }}
          animate={{
            opacity: 1,
            filter: filter ? "blur(0px)" : "none",
          }}
          transition={{
            duration,
            delay: delay + idx * staggerDelay,
          }}
          className="inline-block will-change-transform will-change-opacity will-change-filter"
        >
          {word}{" "}
        </motion.span>
      ))}
    </div>
  )
}

export { TextGenerateEffect, type TextGenerateEffectProps }
export default TextGenerateEffect
