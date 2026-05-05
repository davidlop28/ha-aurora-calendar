function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  const raw = color.trim().replace(/^#/, "");
  const hex = raw.length === 3
    ? raw.split("").map((char) => char + char).join("")
    : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const value = Number.parseInt(hex, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function toHex(value: number): string {
  return Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0");
}

export function contrastText(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return "var(--primary-text-color)";
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 150 ? "#1f2933" : "#ffffff";
}

export function shadeColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `#${toHex(rgb.r + amount)}${toHex(rgb.g + amount)}${toHex(rgb.b + amount)}`;
}
