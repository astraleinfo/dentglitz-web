/**
 * Central place for all images, media, and content-with-images.
 * Swap a URL here and it updates every component that uses it.
 */
const U = (id: string, w = 800, q = 75) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

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
  heroBackground:  "/hero-background-new.png",
  aboutBackground: "/about-background.png",
  glowingTeeth:    "/glowing-teeth.png",

  // ── Feature / section images ───────────────────────────
  hero:       U("photo-1588776814546-1ffcf47267a5", 1400),
  whyUs:      U("photo-1609840114035-3c981b782dfe", 900),
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
    { img: "/images/gallery/IMG20250201185229.jpg",   label: "Full Smile Rehabilitation",   cat: "Treatments"      },
    { img: "/images/gallery/IMG_20260415_190154.jpg", label: "Dental Treatment in Progress",cat: "Treatments"      },
    { img: "/images/gallery/IMG20241129201909.jpg",   label: "Crown Bridge Restoration",    cat: "Treatments"      },
    { img: "/images/gallery/IMG20250324202450.jpg",   label: "Invisalign Clear Aligners",   cat: "Equipment"       },
    { img: "/images/gallery/IMG20250405205426.jpg",   label: "Smile Makeover",              cat: "Treatments"      },
    { img: "/images/gallery/IMG20241218202014.jpg",   label: "Dental Chair Setup",          cat: "Clinic Interior" },
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
      label: "Crown & Bridge Restoration",
      before: "/images/gallery/IMG20241129201727.jpg",
      after:  "/images/gallery/IMG20241129201909.jpg",
      quote: "\"The team at Dentglitz transformed my smile completely. Highly recommended!\" — Pooja M.",
      tag:   "Crown & Bridge",
    },
    {
      id: 2,
      label: "Orthodontic Alignment",
      before: "/images/gallery/IMG20250113203214.jpg",
      after:  "/images/gallery/IMG20250113204606.jpg",
      quote: "\"My crooked teeth are now perfectly aligned — the results exceeded my expectations!\" — Rahul K.",
      tag:   "Orthodontics",
    },
    {
      id: 3,
      label: "Smile Correction",
      before: "/images/gallery/IMG20250211190027.jpg",
      after:  "/images/gallery/IMG20250211193725.jpg",
      quote: "\"I finally have the smile I always wanted. The Dentglitz team is truly exceptional!\" — Anjali R.",
      tag:   "Smile Correction",
    },
  ] as TransformationCase[],

  // ── Updates / events (landing section uses first 4; /updates page uses all) ──
  updates: [
    {
      img: U("photo-1576091160550-2173dba999ef"),
      type: "Camp" as EventType,
      date: "June 15, 2025",
      location: "Porur Community Hall, Chennai",
      title: "Free Dental Health Camp — Porur",
      description: "We organised a free dental screening camp for over 200 residents. Consultations, X-rays, and oral hygiene kits were provided at no charge.",
      details: "Our team of four dentists and two hygienists spent the entire day screening patients of all ages. The most common findings were early-stage cavities and gum disease — both highly treatable when caught early. Every attendee received a personalised dental hygiene kit and a follow-up appointment offer at Dentglitz.",
    },
    {
      img: U("photo-1540575467063-178a50c2df87"),
      type: "Event" as EventType,
      date: "April 7, 2025",
      location: "Raj Convention Centre, Chennai",
      title: "South India Dental Summit 2025",
      description: "Our team attended the annual South India Dental Summit where the latest advances in implantology and cosmetic dentistry were showcased.",
      details: "Three members of the Dentglitz clinical team participated in this two-day summit. Highlights included a live implant surgery demonstration, hands-on composite bonding workshops, and keynote sessions on AI-assisted diagnosis. We returned with practical insights that directly benefit our patients.",
    },
    {
      img: U("photo-1588776814546-1ffcf47267a5"),
      type: "Camp" as EventType,
      date: "February 20, 2025",
      location: "Karambakkam School Grounds",
      title: "Children's Oral Health Drive",
      description: "Partnering with local schools, we conducted smile check-ups and fluoride treatment sessions for over 150 children in the Karambakkam area.",
      details: "Working alongside teachers and school nurses, our team made oral health fun for kids aged 5–14. We used interactive tools to demonstrate proper brushing and flossing, and provided fluoride varnish treatments. Parents received printed guides on diet and dental care for children.",
    },
    {
      img: U("photo-1585435557343-3b092031a831"),
      type: "Workshop" as EventType,
      date: "November 12, 2024",
      location: "Dentglitz Clinic, Porur",
      title: "Smile Makeover Workshop",
      description: "An interactive in-clinic workshop covering teeth whitening, veneers, and Invisalign — open to patients and aspiring dental students.",
      details: "Fifteen participants joined us for a three-hour hands-on session. We demonstrated shade selection for veneers, walked through Invisalign ClinCheck simulations, and let participants try professional whitening trays. Q&A with our cosmetic specialist closed the event.",
    },
    {
      img: U("photo-1576091160550-2173dba999ef"),
      type: "Camp" as EventType,
      date: "September 3, 2024",
      location: "Valasaravakkam Grounds",
      title: "Senior Citizens Dental Camp",
      description: "A dedicated screening and awareness camp for residents above 60 years, focused on denture care, dry mouth, and oral cancer screening.",
      details: "In partnership with a local senior citizens' association, we screened 90 elderly patients. Special emphasis was placed on oral cancer early detection — a simple but life-saving check that's often missed. Denture adjustments and relining consultations were offered on-site.",
    },
    {
      img: U("photo-1540575467063-178a50c2df87"),
      type: "Event" as EventType,
      date: "July 20, 2024",
      location: "ITC Grand Chola, Chennai",
      title: "Invisalign Provider Conference",
      description: "Our lead orthodontist attended the Invisalign Regional Provider Conference to stay current on aligner protocols and new product lines.",
      details: "The conference covered the latest Invisalign system updates, including Palate Expander and Mandibular Advancement features. Our orthodontist completed two advanced training modules and is now certified to treat complex cases that were previously only manageable with traditional braces.",
    },
    {
      img: U("photo-1585435557343-3b092031a831"),
      type: "Workshop" as EventType,
      date: "March 8, 2024",
      location: "Dentglitz Clinic, Porur",
      title: "Women's Dental Health Day",
      description: "On International Women's Day, we hosted a free workshop addressing dental changes during pregnancy, menopause, and hormonal cycles.",
      details: "Twenty women attended this special awareness session. Topics covered included pregnancy gingivitis, bone density and periodontal health post-menopause, and the link between stress hormones and bruxism. Every attendee received a complimentary dental check-up voucher.",
    },
    {
      img: U("photo-1576091160550-2173dba999ef"),
      type: "Camp" as EventType,
      date: "January 26, 2024",
      location: "Porur Lake Park",
      title: "Republic Day Dental Awareness Camp",
      description: "On Republic Day, we set up a public awareness stall at the Porur Lake Park event, reaching hundreds of local families.",
      details: "Our team distributed toothbrushes, toothpaste samples, and dental health pamphlets to over 300 visitors. Quick oral health assessments were offered on the spot. The goal was simple: reach families who might not otherwise visit a dentist and break the barrier to accessing dental care.",
    },
  ] as UpdatePost[],
};
