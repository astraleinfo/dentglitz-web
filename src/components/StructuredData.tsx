/**
 * JSON-LD structured data for local SEO.
 *
 * The `Dentist` (a LocalBusiness subtype) block is the most important signal for
 * "dentist / dental clinic near me" searches: it gives Google your exact name,
 * address, phone (NAP), geo-coordinates, hours, services and rating.
 *
 * NOTE: aggregateRating reflects your Google rating at the time of writing.
 * Update `ratingValue` / `reviewCount` here when they change meaningfully.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://dentglitz.com";

const CLINIC_NAME = "Dentglitz - The Complete Dental Care";
const PHONE = "+91-82484-56752";
const GOOGLE_MAPS_CID = "https://maps.google.com/?cid=17084000590836589882";

const faqs = [
  {
    q: "How much do dental implants cost at Dentglitz?",
    a: "Dental implant cost depends on the number of implants, bone condition and implant type. We offer a free consultation with a transparent, itemized treatment plan and no hidden costs. Implants start from Rs. 25,000 per tooth.",
  },
  {
    q: "Is teeth whitening safe? How long does it last?",
    a: "Yes, professional teeth whitening at Dentglitz is completely safe and supervised by specialists. Results typically last 12 to 24 months with proper care. We offer in-chair sessions and take-home kits.",
  },
  {
    q: "Do you offer emergency dental treatment?",
    a: "Yes. We offer same-day emergency appointments for toothaches, broken teeth, dental trauma and lost fillings or crowns. Call our clinic and we will see you as soon as possible.",
  },
  {
    q: "How can I book an appointment?",
    a: "You can book online through the form on our website, by calling us directly, or via WhatsApp. We confirm your booking quickly and send reminders before your visit.",
  },
  {
    q: "What makes Dentglitz different from other dental clinics in Porur?",
    a: "Dentglitz combines a luxury patient experience with advanced clinical expertise: 3D CBCT, digital scans, laser dentistry, a multi-specialist team and pain-free, personalized care under one roof.",
  },
];

export function StructuredData() {
  const dentist = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: CLINIC_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/glowing-teeth.png`,
    logo: `${SITE_URL}/dentglitz-logo.svg`,
    telephone: PHONE,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "1A, Kambar St, near Grace Matriculation Higher Secondary School, Karambakkam, Ponni Nagar",
      addressLocality: "Porur, Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600116",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.0393754,
      longitude: 80.1553859,
    },
    hasMap: GOOGLE_MAPS_CID,
    areaServed: [
      { "@type": "Place", name: "Porur" },
      { "@type": "Place", name: "Chennai" },
      { "@type": "Place", name: "Mugalivakkam" },
      { "@type": "Place", name: "Ramapuram" },
      { "@type": "Place", name: "Iyyappanthangal" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "17:30",
        closes: "21:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "17:30",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "51",
    },
    medicalSpecialty: ["Dentistry", "CosmeticDentistry", "Orthodontic", "Prosthodontic"],
    availableService: [
      "Dental Implants",
      "Invisalign / Clear Aligners",
      "Root Canal Treatment",
      "Teeth Whitening",
      "Smile Design",
      "Crowns and Bridges",
      "Kids Dentistry",
      "Full Mouth Rehabilitation",
    ].map((s) => ({ "@type": "MedicalProcedure", name: s })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: CLINIC_NAME,
    publisher: { "@id": `${SITE_URL}/#clinic` },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentist) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
