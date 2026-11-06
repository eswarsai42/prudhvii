export type FrameVariant = "portrait" | "landscape" | "arch" | "circle" | "polaroid" | "editorial";
export interface TimelinePhotoDef { src: string; alt: string; w: number; h: number; variant: FrameVariant; lowRes?: boolean; focus?: string }

/**
 * Photographs shown opposite each event card (key = event id in events.ts).
 * These are stand-ins taken from the photographs supplied so far (all from the engagement shoot).
 * Replace a file in /public/images/timeline/ (same name) or change a path here when
 * the real photographs from each celebration arrive.
 * Photography: Muse Moment Makers.
 */
export const TIMELINE_PHOTOS: Record<string, TimelinePhotoDef> = {
  engagement: { src: "/images/timeline/engagement.jpg", alt: "The bride bending low as the groom offers her a red gerbera bouquet", w: 1000, h: 1500, variant: "portrait", focus: "50% 30%" },
  pasupu: { src: "/images/timeline/pasupu.jpg", alt: "Family seated together around silver ritual vessels before a golden carved wall", w: 1600, h: 1067, variant: "landscape" },
  "groom-haldi": { src: "/images/timeline/groom-haldi.jpg", alt: "The groom seated with folded hands in a maroon embroidered jacket", w: 1000, h: 1500, variant: "arch", focus: "50% 28%" },
  "bride-haldi": { src: "/images/timeline/bride-haldi.jpg", alt: "The bride laughing as she plays a dhol among dancing guests", w: 1000, h: 1500, variant: "circle", focus: "50% 24%" },
  sundowner: { src: "/images/timeline/sundowner.jpg", alt: "The couple standing in an open vehicle filled with yellow and lilac flowers", w: 1600, h: 1067, variant: "landscape", focus: "50% 40%" },
  sangeeth: { src: "/images/timeline/sangeeth.jpg", alt: "The couple dancing and laughing outdoors", w: 508, h: 339, variant: "polaroid", lowRes: true },
  "kaasi-yatra": { src: "/images/timeline/kaasi-yatra.jpg", alt: "A diamond ring placed on a henna-decorated hand", w: 1000, h: 1500, variant: "editorial", focus: "50% 50%" },
  "reception-vizag": { src: "/images/timeline/reception.jpg", alt: "The couple posing together, groom seated in an ivory embroidered sherwani", w: 339, h: 508, variant: "circle", lowRes: true, focus: "50% 35%" },
  "grand-wedding": { src: "/images/timeline/wedding.jpg", alt: "The couple laughing in jasmine garlands before a golden carved backdrop", w: 1800, h: 1200, variant: "landscape", focus: "50% 35%" },
  "reception-guntur": { src: "/images/timeline/reception-guntur.jpg", alt: "The couple walking hand in hand through a doorway wrapped in mist", w: 1600, h: 1067, variant: "editorial", focus: "50% 50%" },
  vratham: { src: "/images/timeline/vratham.jpg", alt: "A forehead kiss while family members laugh and cheer around the couple", w: 1600, h: 929, variant: "landscape" },
};
