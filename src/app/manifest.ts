import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dentglitz - The Complete Dental Care",
    short_name: "Dentglitz",
    description:
      "Modern, painless dental care in Porur, Chennai. Implants, Invisalign, smile design and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e9b8d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
