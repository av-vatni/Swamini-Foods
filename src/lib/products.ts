import type { Locale } from "./i18n";

export type Category = "sweet" | "namkeen" | "flour";
export type Tag = "ghee" | "oil";
type Localized = Record<Locale, string>;

export type Product = {
  /** Database id (absent for built-in fallback items) */
  id?: string;
  slug: string;
  name: Localized;
  description: Localized;
  /** ₹ per 1 kg */
  price: number;
  category: Category;
  tag?: Tag;
  featured?: boolean;
  /** Google Drive share link (or a /public path) */
  image?: string;
};

/* Price calculator rules (grams) */
export const QTY = {
  step: 250,
  min: 250,
  max: 10000,
  initial: 1000,
  presets: [250, 500, 1000, 2000],
};

export const priceFor = (product: Product, grams: number) =>
  Math.round((product.price * grams) / 1000);

export const PRODUCTS: Product[] = [
  {
    slug: "besan-ladoo",
    name: { mr: "बेसन लाडू", en: "Besan Ladoo" },
    description: {
      mr: "मंद आचेवर खमंग भाजलेल्या बेसनाचे, साजुक तुपातले मऊ लाडू.",
      en: "Gram flour slow-roasted till aromatic, rolled into soft ladoos with pure ghee.",
    },
    price: 640, category: "sweet", tag: "ghee", featured: true,
    image: "https://drive.google.com/file/d/1YLbtGqunVzbApJyYTH4ldMZnn92mhmyR/view?usp=sharing",
  },
  {
    slug: "balushahi",
    name: { mr: "बालुशाही", en: "Balushahi" },
    description: {
      mr: "बाहेरून कुरकुरीत, आतून पदरदार आणि पाकात मुरलेली बालुशाही.",
      en: "Flaky, layered rounds fried in pure ghee and soaked in sugar syrup.",
    },
    price: 660, category: "sweet", tag: "ghee",
    image: "https://drive.google.com/file/d/1UsaWeBQKrTN7jENVZnUdDc_r3YDsZ2F_/view?usp=sharing",
  },
  {
    slug: "shankarpale-sweet",
    name: { mr: "शंकरपाळे (गोड)", en: "Shankarpale (Sweet)" },
    description: {
      mr: "साजुक तुपातले खुसखुशीत, हलक्या गोडीचे शंकरपाळे.",
      en: "Crisp, lightly sweet diamond-cut bites made with pure ghee.",
    },
    price: 640, category: "sweet", tag: "ghee", featured: true,
    image: "https://drive.google.com/file/d/1o-MNPrABTbyOCBMwpKPxd_9WXODq692l/view?usp=sharing",
  },
  {
    slug: "karanji",
    name: { mr: "करंजी", en: "Karanji" },
    description: {
      mr: "खोबरे-सुक्या मेव्याच्या सारणाने भरलेली, साजुक तुपात तळलेली करंजी.",
      en: "Crisp half-moon pastries filled with coconut and dry fruits, fried in pure ghee.",
    },
    price: 900, category: "sweet", tag: "ghee", featured: true,
    image: "https://drive.google.com/file/d/1099dm4_GgKJSlEnro7L1yly7fy4nn6j_/view?usp=sharing",
  },
  {
    slug: "bhajani-chakli",
    name: { mr: "भाजणी चकली", en: "Bhajani Chakli" },
    description: {
      mr: "घरच्या भाजणी पिठाची, खमंग आणि कुरकुरीत पारंपरिक चकली.",
      en: "Traditional crunchy spirals made from our home-roasted bhajani flour.",
    },
    price: 540, category: "namkeen", featured: true,
    image: "https://drive.google.com/file/d/1-X1MvIH1VHGpBP7tw8q8begY7wGC-rqx/view?usp=sharing",
  },
  {
    slug: "sev",
    name: { mr: "शेव", en: "Sev" },
    description: {
      mr: "बेसनाची बारीक, कुरकुरीत आणि हलकी शेव.",
      en: "Fine, crunchy gram-flour noodles — light and moreish.",
    },
    price: 400, category: "namkeen",
    image: "https://drive.google.com/file/d/1C13uFL-qGScXZZFFEgmx4nbI6NN672pX/view?usp=sharing",
  },
  {
    slug: "lasun-sev",
    name: { mr: "लसूण शेव", en: "Garlic Sev" },
    description: {
      mr: "लसणाच्या चवीची, चटपटीत कुरकुरीत शेव.",
      en: "Crunchy sev with a bold garlic kick.",
    },
    price: 440, category: "namkeen",
    image: "https://drive.google.com/file/d/1cslwqWi2DHKxCfLF6-CyYhny2usatZ7P/view?usp=sharing",
  },
  {
    slug: "poha-chivda-fried",
    name: { mr: "पोहा चिवडा (तळलेला)", en: "Poha Chivda (Fried)" },
    description: {
      mr: "तळलेले पोहे, शेंगदाणे आणि खमंग फोडणीचा चिवडा.",
      en: "Fried flattened rice tossed with peanuts and a fragrant tempering.",
    },
    price: 400, category: "namkeen", featured: true,
    image: "https://drive.google.com/file/d/1bokk5M2iESz1LZtWFOI4p5acoNe_H6pP/view?usp=sharing",
  },
  {
    slug: "patal-poha-chivda",
    name: { mr: "पातळ पोहा चिवडा", en: "Thin Poha Chivda" },
    description: {
      mr: "पातळ पोह्यांचा हलका, कुरकुरीत आणि चटपटीत चिवडा.",
      en: "Light, crisp chivda made from thin flattened rice.",
    },
    price: 360, category: "namkeen",
    image: "https://drive.google.com/file/d/1jEKNNKQrRPHP9j_xiza0YPJ9dVNldOS_/view?usp=sharing",
  },
  {
    slug: "shankarpale-salted",
    name: { mr: "शंकरपाळे (खारे)", en: "Shankarpale (Salted)" },
    description: {
      mr: "चहासोबत खाण्यासाठी खुसखुशीत खारे शंकरपाळे.",
      en: "Crisp savoury shankarpale — perfect with evening tea.",
    },
    price: 400, category: "namkeen",
    image: "https://drive.google.com/file/d/155cyqpenjxdNM3NuZK7ms0jp4X2L1m-H/view?usp=sharing",
  },
  {
    slug: "sapit-ladoo",
    name: { mr: "सपीट लाडू", en: "Sapit Ladoo" },
    description: {
      mr: "रव्याचे, साजुक तुपातले रवाळ आणि सुगंधी लाडू.",
      en: "Fragrant semolina ladoos made with pure ghee.",
    },
    price: 700, category: "sweet", tag: "ghee", featured: true,
    image: "https://drive.google.com/file/d/1hA_4HV_0ZEt2AMCC0UOE3HyJO4Gbs2Xi/view?usp=sharing",
  },
  {
    slug: "anarse-pith",
    name: { mr: "अनारसे पीठ", en: "Anarse Flour" },
    description: {
      mr: "घरी अनारसे करण्यासाठी तयार पीठ.",
      en: "Ready-made dough to make anarse at home.",
    },
    price: 300, category: "flour",
    image: "https://drive.google.com/file/d/1GYBAsGvZya6mazteZiKhD2BvyrbRV9jw/view?usp=sharing",
  },
  {
    slug: "chakli-bhajani-pith",
    name: { mr: "चकली भाजणी पीठ", en: "Chakli Bhajani Flour" },
    description: {
      mr: "धान्ये-डाळी भाजून दळलेले, घरी चकली करण्यासाठी भाजणी पीठ.",
      en: "Roasted grain-and-lentil flour to make chakli at home.",
    },
    price: 300, category: "flour",
    image: "https://drive.google.com/file/d/1glvyyJ1nDSMcAWx768vp2PUyDsDkKn28/view?usp=sharing",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
