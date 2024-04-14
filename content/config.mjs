
/**
 * @type {import("../config/siteConfig").UserConfig}
 */

const config = {
  title: "BAC Révision 2024",
  description: "Cours et fiches pour réviser le BAC",
  author: "Yann Renard",
  domain: "https://bac-2024-obsidian-sync.vercel.app/",

  navLinks: [{ href: "/Maths", name: "Mathématiques" }],
  navLinks: [{ href: "/Philosophie", name: "Philosophie" }],
  navLinks: [{ href: "/Physique-Chimie", name: "Physique-Chimie" }],
  navLinks: [{ href: "/SIN", name: "SIN" }],
};

const userConfig = {
  navbarTitle: {
    text: "BAC Révision 2024",
  },
  showComments: true,
  showEditLink: true,
  editLinkRoot: "https://github.com/yannouuuu/BAC-2024-Obsidian-Sync/tree/main/content",
};
export default {};
