export const SITE = {
  website: "https://morit958.com", // replace this with your deployed domain
  author: "Morita",
  profile: "",
  desc: "my tech blog things.",
  title: "blog morit958",
  ogImage: "my-icon-image.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "修正を提案する",
    url: "https://github.com/moriT958/myblog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "ja", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Tokyo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
