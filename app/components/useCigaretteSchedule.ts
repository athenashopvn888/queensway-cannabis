"use client";

import { useEffect, useState } from "react";
import { useCigaretteState } from "./CigaretteStateProvider";

export function useCigaretteSchedule(): boolean {
  const { tv } = useCigaretteState();
  const [active, setActive] = useState(tv);

  useEffect(() => {
    let stopped = false;
    async function update() {
      let enabled = false;
      try {
        const response = await fetch("/api/content-status", { cache: "no-store", signal: AbortSignal.timeout(8000) });
        if (response.ok) {
          const status = await response.json();
          enabled = status.storeCode === "QCD01" && status.cig?.tv === true;
        }
      } catch {
        // Fail closed if the shared control is unavailable.
      }
      if (!stopped) setActive(enabled);
    }
    void update();
    const timer = window.setInterval(update, 60_000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  return active;
}
