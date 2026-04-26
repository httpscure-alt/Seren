import { cookies } from "next/headers";
import type { Dictionary, Lang } from "./types";
import { en } from "./en";
import { id } from "./id";

export const LANG_COOKIE = "seren_lang";

export function normalizeLang(value: string | undefined): Lang {
  return value === "id" ? "id" : "en";
}

export async function getDictionary(): Promise<{ lang: Lang; dict: Dictionary }> {
  const c = await cookies();
  const lang = normalizeLang(c.get(LANG_COOKIE)?.value);
  return { lang, dict: lang === "id" ? id : en };
}

