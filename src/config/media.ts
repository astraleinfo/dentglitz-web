/**
 * Central place for all images, media, and content-with-images.
 * Swap a URL here and it updates every component that uses it.
 */
const U = (id: string, w = 800, q = 75) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

// Build a CDN URL. Encodes each path segment so spaces, "&", etc. are safe.
export const CDN = (path: string) =>
  `${process.env.NEXT_PUBLIC_CDN_URL}/${path.split("/").map(encodeURIComponent).join("/")}`;

// ─────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────

export interface GalleryItem {
  img: string;
  label: string;
  cat: string;
}

export interface TransformationCase {
  id: number;
  label: string;
  before: string;
  after: string;
  quote: string;
  tag: string;
}

export type EventType = "Camp" | "Event" | "Workshop";

export interface UpdatePost {
  img: string;
  type: EventType;
  date: string;
  location: string;
  title: string;
  description: string;
  details?: string;
}

// ─────────────────────────────────────────────────────────
//  Media object
// ─────────────────────────────────────────────────────────

export const media = {

  // ── Static assets (files in /public) ──────────────────
  heroBackground:  CDN("website-background/hero-background-new.webp"),
  aboutBackground: CDN("website-background/about-background.webp"),
  glowingTeeth:    CDN("website-background/glowing-teeth.png"),

  // ── Feature / section images ───────────────────────────
  hero:       U("photo-1588776814546-1ffcf47267a5", 1400),
  whyUs:      CDN("website-background/about-us.webp"),
  ctaPattern: U("photo-1606811841689-23dfddce3e95", 1200),

  // ── Raw gallery arrays (kept for backward compatibility) ─
  gallery: [
    U("photo-1629909613654-28e377c37b09", 600),
    U("photo-1601001815853-3835274403b3", 600),
    U("photo-1612349317150-e413f6a5b16d", 600),
    U("photo-1571772996211-2f02c9727629", 600),
  ],

  smileGallery: [
    U("photo-1606811841689-23dfddce3e95", 500),
    U("photo-1588776814546-1ffcf47267a5", 500),
    U("photo-1609840114035-3c981b782dfe", 500),
    U("photo-1571772996211-2f02c9727629", 500),
    U("photo-1612349317150-e413f6a5b16d", 500),
    U("photo-1629909613654-28e377c37b09", 500),
  ],

  // ── Service card images ────────────────────────────────
  implantImg:    U("photo-1606811841689-23dfddce3e95", 300),
  invisalignImg: U("photo-1588776814546-1ffcf47267a5", 300),
  veneerImg:     U("photo-1609840114035-3c981b782dfe", 300),

  // ── Avatars ───────────────────────────────────────────
  avatars: {
    sarah:    "https://i.pravatar.cc/120?img=45",
    mohammed: "https://i.pravatar.cc/120?img=12",
    priya:    "https://i.pravatar.cc/120?img=32",
  },

  testimonialAvatars: [
    "https://i.pravatar.cc/80?img=45",
    "https://i.pravatar.cc/80?img=12",
    "https://i.pravatar.cc/80?img=32",
    "https://i.pravatar.cc/80?img=22",
    "https://i.pravatar.cc/80?img=48",
    "https://i.pravatar.cc/80?img=15",
    "https://i.pravatar.cc/80?img=35",
    "https://i.pravatar.cc/80?img=8",
  ] as string[],

  // ── Gallery items (used by landing Gallery section + /gallery page) ──
  galleryItems: [
    // First 8 shown on landing page
    { img: "/images/gallery/IMG20241218202009.jpg",   label: "Treatment Room",              cat: "Clinic Interior" },
    { img: CDN("gallery/gallery_img4.webp"),           label: "Full Smile Rehabilitation",   cat: "Treatments"      },
    { img: "/images/gallery/IMG_20260415_190154.jpg", label: "Dental Treatment in Progress",cat: "Treatments"      },
    { img: CDN("gallery/gallery_img3.webp"),           label: "Crown Bridge Restoration",    cat: "Treatments"      },
    { img: "/images/gallery/IMG20250324202450.jpg",   label: "Invisalign Clear Aligners",   cat: "Equipment"       },
    { img: CDN("gallery/gallery_img2.webp"),           label: "Smile Makeover",              cat: "Treatments"      },
    { img: CDN("gallery/gallery_img1.webp"),           label: "Dental Chair Setup",          cat: "Clinic Interior" },
    { img: "/images/gallery/IMG_20260412_143058.jpg", label: "Patient Consultation",        cat: "Happy Patients"  },
    // Extended gallery
    { img: "/images/gallery/IMG20241129201849.jpg",   label: "Dental Crown Result",         cat: "Treatments"      },
    { img: "/images/gallery/IMG20250411132814.jpg",   label: "Ceramic Crown Restoration",   cat: "Treatments"      },
    { img: "/images/gallery/IMG20250405205453.jpg",   label: "Post-Treatment Smile",        cat: "Treatments"      },
    { img: "/images/gallery/IMG20250411132713.jpg",   label: "Smile Transformation",        cat: "Treatments"      },
    { img: "/images/gallery/IMG20250411132753.jpg",   label: "Dental Bridge Result",        cat: "Treatments"      },
    { img: "/images/gallery/IMG20250113204606.jpg",   label: "Orthodontic Result",          cat: "Treatments"      },
    { img: "/images/gallery/IMG20250211193725.jpg",   label: "Alignment Correction",        cat: "Treatments"      },
    { img: "/images/gallery/IMG20241228190900.jpg",   label: "Complete Denture",            cat: "Equipment"       },
    { img: "/images/gallery/IMG20241228191238.jpg",   label: "Full Denture Set",            cat: "Equipment"       },
    { img: "/images/gallery/IMG20260219191143.jpg",   label: "Dental X-Ray",               cat: "Equipment"       },
    { img: "/images/gallery/IMG20241218202026.jpg",   label: "Clinic Interior",             cat: "Clinic Interior" },
    { img: "/images/gallery/IMG20251028200418.jpg",   label: "Pre-Treatment Assessment",    cat: "Treatments"      },
    { img: "/images/gallery/IMG20251025203108.jpg",   label: "Scaling Case",                cat: "Treatments"      },
    { img: "/images/gallery/IMG20250211190027.jpg",   label: "Orthodontic Case",            cat: "Treatments"      },
    { img: "/images/gallery/IMG20241129201727.jpg",   label: "Missing Teeth Case",          cat: "Treatments"      },
    { img: "/images/gallery/IMG20260404203742.jpg",   label: "Pre-Treatment Evaluation",    cat: "Treatments"      },
    { img: "/images/gallery/IMG20250113203214.jpg",   label: "Alignment Case",              cat: "Treatments"      },
    { img: "/images/gallery/IMG20241114182353.jpg",   label: "Implant Placement",           cat: "Treatments"      },
    { img: "/images/gallery/IMG20241114182347.jpg",   label: "Implant Surgery",             cat: "Treatments"      },
    { img: "/images/gallery/IMG20260219190756.jpg",   label: "Tooth Extraction",            cat: "Treatments"      },
    { img: "/images/gallery/IMG-20251020-WA0181.jpg", label: "Dental Crown Set",            cat: "Equipment"       },
    { img: "/images/gallery/IMG20250310135023.jpg",   label: "Implant Assessment",          cat: "Treatments"      },
    { img: "/images/gallery/IMG20250310135058.jpg",   label: "Implant Case",                cat: "Treatments"      },
  ] as GalleryItem[],

  // ── Before / after transformation cases ───────────────
  transformations: [
    {
      id: 1,
      label: "Complete Denture",
      before: CDN("Transformation/Complete Denture/complete_denture_before.webp"),
      after:  CDN("Transformation/Complete Denture/complete_denture_after.webp"),
      quote: "Full arch restored with a complete denture at Dentglitz — The Complete Dental Care.",
      tag:   "Complete Denture",
    },
    {
      id: 2,
      label: "Crown & Bridge Prosthodontics — Case 1",
      before: CDN("Transformation/Crown & Bridge Prosthodontics/1/Crown_Bridge_Prosthodontics_1_before.webp"),
      after:  CDN("Transformation/Crown & Bridge Prosthodontics/1/Crown_Bridge_Prosthodontics_1_after.webp"),
      quote: "Missing teeth replaced with a fixed crown & bridge for a natural, confident smile.",
      tag:   "Crown & Bridge I",
    },
    {
      id: 3,
      label: "Crown & Bridge Prosthodontics — Case 2",
      before: CDN("Transformation/Crown & Bridge Prosthodontics/2/Crown_Bridge_Prosthodontics_2_before.webp"),
      after:  CDN("Transformation/Crown & Bridge Prosthodontics/2/Crown_Bridge_Prosthodontics_2_after.webp"),
      quote: "Another crown & bridge rehabilitation restoring function and aesthetics.",
      tag:   "Crown & Bridge II",
    },
    {
      id: 4,
      label: "Fractured Tooth Restored with Composite",
      before: CDN("Transformation/Fractured Tooth Restored with Composite/Fractured_Tooth_Restored_with_Composite_before.webp"),
      after:  CDN("Transformation/Fractured Tooth Restored with Composite/Fractured_Tooth_Restored_with_Composite_after.webp"),
      quote: "A chipped, fractured tooth rebuilt seamlessly with tooth-coloured composite.",
      tag:   "Composite",
    },
    {
      id: 5,
      label: "Removable Partial Denture",
      before: CDN("Transformation/Removable Partial Denture/Removable_Partial_Denture_before.webp"),
      after:  CDN("Transformation/Removable Partial Denture/Removable_Partial_Denture_after.webp"),
      quote: "Gaps restored with a comfortable, well-fitting removable partial denture.",
      tag:   "Removable Denture",
    },
    {
      id: 6,
      label: "Upper Arch Rehabilitation",
      before: CDN("Transformation/Upper Arch Rehabilitation/Upper_Arch_Rehabilitation_before.webp"),
      after:  CDN("Transformation/Upper Arch Rehabilitation/Upper_Arch_Rehabilitation_after.webp"),
      quote: "Complete upper arch rehabilitation for a fully renewed smile.",
      tag:   "Full Arch",
    },
  ] as TransformationCase[],

  // ── Updates / events (landing section uses first 4; /updates page uses all) ──
  updates: [
    {
      img: CDN("Camp 2022/dental camp.webp"),
      type: "Camp" as EventType,
      date: "14–15 August 2022",
      location: "Dentglitz — Porur, Chennai",
      title: "Free Dental Check-up & Oral Health Awareness Camp — August 2022",
      description:
        "Dentglitz – The Complete Dental Care successfully organized a Free Dental Camp on 14th and 15th August 2022 to promote oral health awareness and provide accessible dental care to the community.",
      details:
        "The camp offered free dental check-ups, personalized treatment consultations, and individualized treatment plans. Participants who attended with a camp slip received a 20% discount on selected dental treatments, including professional teeth cleaning (scaling), tooth-colored fillings (restorations), and tooth extractions, including impacted teeth. The special offer remained valid until 15th September 2022, subject to terms and conditions.\n\n" +
        "The camp received an encouraging response from the community, with many patients benefiting from early diagnosis, preventive care, and timely treatment. The initiative reflected Dentglitz's commitment to improving oral health awareness and delivering quality dental care to the public.",
    },
  ] as UpdatePost[],
};
