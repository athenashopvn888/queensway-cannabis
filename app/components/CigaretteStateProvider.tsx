"use client";

import { createContext, useContext } from "react";

const CigaretteState = createContext({ web: false, tv: false });

export default function CigaretteStateProvider({ children, value }: {
  children: React.ReactNode;
  value: { web: boolean; tv: boolean };
}) {
  return <CigaretteState.Provider value={value}>{children}</CigaretteState.Provider>;
}

export function useCigaretteState() {
  return useContext(CigaretteState);
}
