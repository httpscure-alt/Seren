import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "seren | skin journey",
};

/**
 * Loads Material Symbols for the exported HTML reference layout (schedule, photo, verified, star, footer icons).
 */
export default function ConsultWelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      {children}
    </>
  );
}
