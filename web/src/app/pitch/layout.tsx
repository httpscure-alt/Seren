import type { ReactNode } from "react";
import "./pitch-deck.css";

export default function PitchLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
      />
      {children}
    </>
  );
}
