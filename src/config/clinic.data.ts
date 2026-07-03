import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import type { IconType } from "react-icons";
import { CDN } from "./media";

export interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: FaInstagram,  href: "https://www.instagram.com/dentglitz?igsh=bXJxdmc5M2F6ZW10", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/dr-chimera-jokkin-b1a404203?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", label: "LinkedIn" },
];

export const clinicStats = {
  yearsOfExperience: 9,   // doctors' clinical experience
  doctorsCount: 2,
  happyPatients: 1500,
  satisfactionPercent: 100,
  yearsInService: 4,      // years the clinic has been operating
};

// ─────────────────────────────────────────────────────────
//  Core values
// ─────────────────────────────────────────────────────────

export type ValueIconKey = "heart" | "cpu" | "shield" | "smile" | "users" | "star";

export interface ClinicValue {
  iconKey: ValueIconKey;
  title: string;
  desc: string;
}

export const clinicValues: ClinicValue[] = [
  { iconKey: "heart",  title: "Compassionate Care",  desc: "Every patient is treated like family. We take the time to listen, understand, and deliver care that truly matters." },
  { iconKey: "cpu",    title: "Advanced Technology",  desc: "From digital X-rays to CAD/CAM restorations, we invest in the latest tools for precise, comfortable treatment." },
  { iconKey: "shield", title: "Patient Safety",       desc: "Strict sterilisation protocols and infection-control standards are practised at every step, every single day." },
  { iconKey: "smile",  title: "Beautiful Results",    desc: "Our aesthetic focus means every treatment is designed to look and feel completely natural." },
  { iconKey: "users",  title: "Expert Team",          desc: "Our specialists bring years of post-graduate training across orthodontics, implantology, and cosmetic dentistry." },
  { iconKey: "star",   title: "5-Star Experience",    desc: "From your first call to post-treatment follow-up, we make every touchpoint smooth and welcoming." },
];

// ─────────────────────────────────────────────────────────
//  Clinic milestones / timeline
// ─────────────────────────────────────────────────────────

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export const milestones: Milestone[] = [
  { year: "2021", title: "Clinic Founded",   desc: "Dentglitz opened its doors in Porur, Chennai with a single mission: make quality dental care accessible to all." },
  { year: "2022", title: "Specialist Team",  desc: "Welcomed our prosthodontist & implantologist and added a dedicated cosmetic dentistry suite." },
  { year: "2023", title: "Digital Upgrade",  desc: "Adopted digital X-rays and intraoral cameras for precise, low-radiation diagnosis and treatment." },
  { year: "2024", title: "1000+ Smiles",     desc: "Celebrated transforming over a thousand smiles — a milestone built purely on patient trust and word-of-mouth." },
  { year: "2025", title: "1500+ Smiles",     desc: "Crossed 1,500 happy patients and opened our upgraded, fully air-conditioned facility with a modern patient lounge." },
];

export interface Doctor {
  name: string;
  role: string;
  qualification: string;
  experience: string;
  avatar: string;
  specialty: string;
  phone?: string;
  membership?: string;
  regNo?: string;
  specializations?: string[];
  /** CSS object-position for the photo crop, e.g. "center 30%". Defaults to "center top". */
  objectPosition?: string;
  /** Zoom factor for the photo (1 = no zoom). Use >1 to enlarge a zoomed-out photo. */
  zoom?: number;
}

export const doctors: Doctor[] = [
  {
    name: "Dr. J. Chimera",
    role: "Founder & Chief Dental Surgeon",
    qualification: "BDS - Bachelor of Dental Surgery",
    experience: "9+ Years",
    avatar: CDN("doctors/Chimera.webp"),
    objectPosition: "center 40%",
    specialty: "Founder & Chief Dental Surgeon",
    membership: "Lifetime IDA (Indian Dental Association) Member",
    regNo: "25370",
    specializations: ["Esthetic Restoration", "Root Canal Treatment", "Kids Dentistry","Tooth Removal"],
  },
  {
    name: "Dr. J. Jesima",
    role: "Prosthodontist & Implantologist",
    qualification: "MDS",
    experience: "3+ Years",
    avatar: CDN("doctors/jesima.webp"),
    objectPosition: "center 20%",
    zoom: 1.4,
    specialty: "Prosthodontics & Implantology",
    membership: "Member of Indian Prosthodontist Society",
    regNo: "33661",
    specializations: [
      "Crown and Bridge",
      "Dental Implants",
      "Precisional Attachment",
      "Full Mouth Rehabilitation",
      "Maxillofacial Prosthesis",
    ],
  },
];
