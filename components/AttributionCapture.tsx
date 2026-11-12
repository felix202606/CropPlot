"use client";

import { rememberVisit } from "@/lib/growth";
import { useEffect } from "react";

export function AttributionCapture() {
  useEffect(() => {
    rememberVisit();
  }, []);
  return null;
}
