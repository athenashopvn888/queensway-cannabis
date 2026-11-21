"use client";

import { useEffect, useState } from "react";
import { isCigaretteScheduleActive } from "../lib/cigaretteSchedule";

export function useCigaretteSchedule(): boolean {
  const [active, setActive] = useState(() => isCigaretteScheduleActive());
  useEffect(() => {
    const update = () => setActive(isCigaretteScheduleActive());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return active;
}
