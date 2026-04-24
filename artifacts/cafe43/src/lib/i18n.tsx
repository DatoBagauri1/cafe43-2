import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ka";

const translations = {
  en: {
    home: "Home",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    viewMenu: "View Menu",
    orderNow: "Order Now",
    featuredItems: "Featured Pastries",
    aboutUs: "About Us",
    categories: "Categories",
    recentReviews: "Recent Reviews",
    addToCart: "Add to cart",
    checkout: "Checkout",
    writeReview: "Write a review",
    submit: "Submit",
    emptyCart: "Your cart is empty",
    total: "Total",
    cart: "Cart",
    openNow: "Open now",
    opensAt: "Opens at",
    closesAt: "Closes at",
  },
  ka: {
    home: "მთავარი",
    menu: "მენიუ",
    gallery: "გალერეა",
    reviews: "შეფასებები",
    contact: "კონტაქტი",
    viewMenu: "მენიუს ნახვა",
    orderNow: "შეკვეთა",
    featuredItems: "რჩეული ნაწარმი",
    aboutUs: "ჩვენ შესახებ",
    categories: "კატეგორიები",
    recentReviews: "ბოლო შეფასებები",
    addToCart: "კალათაში დამატება",
    checkout: "ყიდვა",
    writeReview: "შეფასების დაწერა",
    submit: "გაგზავნა",
    emptyCart: "თქვენი კალათა ცარიელია",
    total: "ჯამი",
    cart: "კალათა",
    openNow: "ღიაა",
    opensAt: "იღება",
    closesAt: "იკეტება",
  }
};

type TranslationKey = keyof typeof translations.en;

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("cafe43.lang");
    return (saved === "en" || saved === "ka") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("cafe43.lang", lang);
  }, [lang]);

  const t = (key: TranslationKey) => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}
