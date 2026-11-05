export interface Photo { src: string; alt: string; w: number; h: number; lowRes?: boolean }
export const GALLERY_CATEGORIES = ["Engagement", "Pasupu", "Bride Haldi", "Groom Haldi", "Sangeeth", "Wedding", "Reception"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/** Photographs by Muse Moment Makers. Add new photos to the matching category as they arrive. */
export const GALLERY: Record<GalleryCategory, Photo[]> = {
  Engagement: [
    { src: "/images/hero-garlands.jpg", alt: "The couple laughing together, wearing jasmine garlands before a golden carved backdrop", w: 2400, h: 1600 },
    { src: "/images/ring.jpg", alt: "A diamond ring being placed on a henna-decorated hand", w: 1066, h: 1600 },
    { src: "/images/entrance.jpg", alt: "The couple walking hand in hand through a doorway wrapped in mist", w: 2400, h: 1600 },
    { src: "/images/flowers.jpg", alt: "A red gerbera bouquet offered as the bride bends low among scattered petals", w: 1066, h: 1600 },
    { src: "/images/jeep-ride.jpg", alt: "The couple riding in an open vehicle decorated with yellow and lilac flowers", w: 2000, h: 1333 },
    { src: "/images/dhol.jpg", alt: "The bride playing a dhol, laughing, surrounded by dancing guests", w: 1066, h: 1600 },
    { src: "/images/family-blessing.jpg", alt: "A kiss on the forehead as family members laugh and cheer around them", w: 2000, h: 1161 },
    { src: "/images/groom-portrait.jpg", alt: "The groom seated in an ivory embroidered sherwani", w: 339, h: 508, lowRes: true },
    { src: "/images/henna-detail.jpg", alt: "Henna-covered hand resting on an embroidered sherwani", w: 339, h: 508, lowRes: true },
    { src: "/images/jeep-portrait.jpg", alt: "The couple standing together in an open vehicle on a sunny street", w: 339, h: 508, lowRes: true },
    { src: "/images/jeep-smile.jpg", alt: "The couple smiling at each other during the procession", w: 508, h: 339, lowRes: true },
    { src: "/images/laughing.jpg", alt: "The bride laughing, wearing sunglasses and gold jewellery", w: 508, h: 339, lowRes: true },
  ],
  Pasupu: [], "Bride Haldi": [], "Groom Haldi": [], Sangeeth: [], Wedding: [], Reception: [],
};
