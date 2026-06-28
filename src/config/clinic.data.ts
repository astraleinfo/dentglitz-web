import { FaInstagram, FaFacebook, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface SocialLink {
  icon: IconType;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: FaInstagram,  href: "#", label: "Instagram" },
  { icon: FaFacebook,   href: "#", label: "Facebook" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { icon: FaYoutube,    href: "#", label: "YouTube" },
];

export const clinicStats = {
  yearsOfExperience: 9,
  doctorsCount: 2,
  happyPatients: 1000,
  satisfactionPercent: 100,
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
  { year: "2009", title: "Clinic Founded",    desc: "Dentglitz opened its doors in Porur, Chennai with a single mission: make quality dental care accessible to all." },
  { year: "2013", title: "First Expansion",   desc: "Added a dedicated cosmetic dentistry suite and welcomed our first specialist prosthodontist." },
  { year: "2017", title: "Digital Upgrade",   desc: "Full transition to digital X-rays and intraoral cameras, reducing patient radiation by 80%." },
  { year: "2021", title: "1000+ Smiles",      desc: "Celebrated transforming over a thousand smiles — a milestone built purely on patient trust and word-of-mouth." },
  { year: "2025", title: "Premium Redesign",  desc: "Opened our upgraded, fully air-conditioned facility with a new patient lounge and modern treatment bays." },
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
}

export const doctors: Doctor[] = [
  {
    name: "Dr. J. Chimera",
    role: "Founder & Chief Dental Surgeon",
    qualification: "BDS - Bachelor of Dental Surgery",
    experience: "9+ Years",
    avatar: "https://i.pravatar.cc/400?img=47",
    specialty: "Esthetic Restoration",
    phone: "8248456752",
    membership: "Lifetime IDA (Indian Dental Association) Member",
    regNo: "25370",
    specializations: ["Esthetic Restoration", "Root Canal Treatment", "Kids Dentistry"],
  },
  {
    name: "Dr. J. Jesima",
    role: "Prosthodontist & Implantologist",
    qualification: "MDS",
    experience: "3+ Years",
    avatar: "https://i.pravatar.cc/400?img=47",
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
