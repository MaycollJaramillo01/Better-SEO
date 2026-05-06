"use client";
import { useState } from "react";

function detectLanguage(): "en" | "es" {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const raw = navigator.language || navigator.languages?.[0] || "en";
  return raw.toLowerCase().startsWith("es") ? "es" : "en";
}

export function useLanguage(): "en" | "es" {
  const [lang] = useState<"en" | "es">(detectLanguage);

  return lang;
}
