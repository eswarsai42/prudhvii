export const cn = (...v: (string | false | null | undefined)[]) => v.filter(Boolean).join(" ");
export const pad2 = (n: number) => String(n).padStart(2, "0");
