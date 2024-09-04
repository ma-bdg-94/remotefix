export const items: any = [
  {
    id: 1,
    label: {
      en: "Home",
      ar: "الرئيسية",
    },
    link: "/",
    private: false,
    scope: ["navigation"],
  },
  {
    id: 2,
    label: {
      en: "About",
      ar: "من نحن",
    },
    link: "#",
    private: false,
    scope: ["navigation", "dropdown"]
  },
  {
    id: 3,
    label: {
      en: "Services",
      ar: "الخدمات",
    },
    link: "#",
    private: false,
    scope: ["navigation", "dropdown"]
  },
  {
    id: 4,
    label: {
      en: "Contact",
      ar: "إتصل بنا",
    },
    link: "/contact",
    private: false,
    scope: ["navigation"],
  },
];
