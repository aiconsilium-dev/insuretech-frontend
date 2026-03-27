import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type SidebarContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  isMobile: boolean;
  isTablet: boolean;
};

const SidebarContext = createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
  toggle: () => {},
  isMobile: false,
  isTablet: false,
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const getBreakpoint = () => {
    if (typeof window === 'undefined') return { mobile: false, tablet: false };
    const w = window.innerWidth;
    return { mobile: w < 768, tablet: w >= 768 && w < 1280 };
  };

  const [bp, setBp] = useState(getBreakpoint);
  const [open, setOpen] = useState(() => !getBreakpoint().mobile && !getBreakpoint().tablet);

  useEffect(() => {
    const handler = () => {
      const next = getBreakpoint();
      setBp(next);
      // Only auto-adjust when crossing breakpoints, not on every resize
      if (next.mobile) {
        setOpen(false);
      } else if (next.tablet) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggle = () => setOpen((v) => !v);

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, toggle, isMobile: bp.mobile, isTablet: bp.tablet }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
