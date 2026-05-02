"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function PitchHeroStagger({
  eyebrow,
  title,
  tagline,
  children,
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  children?: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <HeroStatic eyebrow={eyebrow} title={title} tagline={tagline} childrenSlot={children} />
      </div>
    );
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      className="relative z-10 mx-auto w-full max-w-4xl"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.09, delayChildren: 0.05 },
        },
      }}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="mb-8 opacity-[0.88]">
        <span className="font-headline text-5xl font-light tracking-tighter text-primary lowercase sm:text-7xl md:text-8xl">
          seren
        </span>
        <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-primary/22" />
      </motion.div>
      <motion.span variants={item} className="mb-4 block font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </motion.span>
      <motion.h1 variants={item} className="mb-4 font-headline text-3xl font-light tracking-tight text-on-surface lowercase md:text-5xl">
        {title}
      </motion.h1>
      {tagline ? (
        <motion.p
          variants={item}
          className="mx-auto max-w-2xl font-headline text-base font-medium leading-snug tracking-wide text-primary uppercase opacity-[0.72] md:text-lg"
        >
          {tagline}
        </motion.p>
      ) : null}
      {children ? (
        <motion.div variants={item} className="mt-12 flex flex-wrap justify-center gap-4 md:mt-16">
          {children}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function HeroStatic({
  eyebrow,
  title,
  tagline,
  childrenSlot,
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  childrenSlot?: ReactNode;
}) {
  return (
    <>
      <div className="mb-8 opacity-[0.88]">
        <span className="font-headline text-5xl font-light tracking-tighter text-primary lowercase sm:text-7xl md:text-8xl">
          seren
        </span>
        <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-primary/22" />
      </div>
      <span className="mb-4 block font-headline text-xs font-medium tracking-[0.2em] text-primary uppercase">{eyebrow}</span>
      <h1 className="mb-4 font-headline text-3xl font-light tracking-tight text-on-surface lowercase md:text-5xl">{title}</h1>
      {tagline ? (
        <p className="mx-auto max-w-2xl font-headline text-base font-medium leading-snug tracking-wide text-primary uppercase opacity-[0.72] md:text-lg">
          {tagline}
        </p>
      ) : null}
      {childrenSlot ? <div className="mt-12 flex flex-wrap justify-center gap-4 md:mt-16">{childrenSlot}</div> : null}
    </>
  );
}
