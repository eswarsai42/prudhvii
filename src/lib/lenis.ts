import type Lenis from "lenis";
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;
export function lockScroll(lock: boolean) {
  if (lock) { instance?.stop(); document.documentElement.classList.add("scroll-locked"); }
  else { instance?.start(); document.documentElement.classList.remove("scroll-locked"); }
}
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: id === "home" ? 0 : -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}
