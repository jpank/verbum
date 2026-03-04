import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Verbum — Biblical Vocabulary",
    short_name: "Verbum",
    description: "Learn Biblical vocabulary in Polish and English",
    start_url: "/",
    display: "standalone",
    background_color: "#260f3a",
    theme_color: "#7c3aad",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["education", "religion"],
  };
}
