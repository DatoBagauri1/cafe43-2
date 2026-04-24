import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ka";

const translations = {
  en: {
    home: "Home",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact",
    admin: "Admin",
    viewMenu: "View the menu",
    orderNow: "Order now",
    featuredItems: "From the case",
    featuredSubtitle: "Our pastry chef's picks for this week.",
    aboutUs: "Our story",
    categories: "Browse by category",
    categoriesSubtitle: "Cakes, pastries, drinks and chocolates — all hand-finished in our kitchen.",
    recentReviews: "What guests say",
    recentReviewsSubtitle: "From regulars and first-time visitors.",
    addToCart: "Add to cart",
    inCart: "In cart",
    checkout: "Checkout",
    placeOrder: "Place order",
    writeReview: "Write a review",
    submit: "Submit",
    yourName: "Your name",
    rating: "Rating",
    yourReview: "Your review",
    emptyCart: "Your cart is empty",
    cartHelper: "Add a few sweet things to get started.",
    keepShopping: "Keep shopping",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery",
    free: "Free",
    cart: "Cart",
    items: "items",
    item: "item",
    openNow: "Open now",
    closedNow: "Closed",
    opensAt: "Opens at",
    closesAt: "Closes at",
    seeAll: "See all",
    viewDetails: "View details",
    quantity: "Quantity",
    remove: "Remove",
    clearCart: "Clear cart",
    deliveryDetails: "Delivery details",
    yourOrder: "Your order",
    fullName: "Full name",
    phone: "Phone number",
    address: "Delivery address",
    notes: "Order notes (optional)",
    notesPlaceholder: "Doorbell broken, leave with concierge, allergies, etc.",
    backToCart: "Back to cart",
    processing: "Processing...",
    orderConfirmed: "Order confirmed",
    thanksForOrder: "Thank you. We are preparing your order right now.",
    orderId: "Order number",
    status: "Status",
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready for pickup",
    completed: "Completed",
    cancelled: "Cancelled",
    backToHome: "Back to home",
    orderMore: "Order more",
    findUs: "Find us",
    visitUs: "Visit us",
    address_long: "189 David Agmashenebeli Avenue, Tbilisi",
    hours: "Hours",
    callUs: "Call us",
    emailUs: "Email us",
    getDirections: "Get directions",
    openDaily: "Daily, 10:00 — 22:00",
    searchPlaceholder: "Search the menu...",
    all: "All",
    cakes: "Cakes",
    pastries: "Pastries",
    drinks: "Drinks",
    chocolate: "Chocolate",
    noResults: "Nothing matches your search.",
    handcraftedDaily: "Handcrafted daily",
    heroTagline: "A neighborhood pastry shop on Agmashenebeli Avenue",
    aboutBody: "We bake every morning before the doors open. Butter from the same small farm. Single-origin chocolate. Coffee roasted weekly. We are not in a hurry, and neither is the food.",
    galleryTeaserTitle: "A peek inside",
    galleryTeaserSubtitle: "Tables, glass cases, the marble counter, and what comes out of the oven each morning.",
    seeGallery: "See the gallery",
    contactCta: "Stop by, or order ahead",
    contactCtaBody: "We will have it boxed and ready when you arrive.",
    basedOn: "Based on",
    ratingsSuffix: "reviews",
    leaveReview: "Leave us a review",
    nameRequired: "Name is required",
    reviewRequired: "Please write something",
    submitting: "Submitting...",
    reviewThanks: "Thank you for your review",
    reviewThanksBody: "It will help others find their way to us.",
    written: "Written",
    on: "on",
    perItem: "per item",
    aboutMin: "About 30 min",
    deliveryArea: "Tbilisi center",
    addedToCart: "Added to cart",
    cartCleared: "Cart cleared",
    backToMenu: "Back to menu",
    viewCart: "View cart",
    proceedToCheckout: "Proceed to checkout",
    youreAllSet: "You're all set",
    welcome: "Welcome to",
    photoBy: "Photo",
    next: "Next",
    previous: "Previous",
    close: "Close",
    languageName: "English",
  },
  ka: {
    home: "მთავარი",
    menu: "მენიუ",
    gallery: "გალერეა",
    reviews: "შეფასებები",
    contact: "კონტაქტი",
    admin: "ადმინი",
    viewMenu: "მენიუს ნახვა",
    orderNow: "შეუკვეთეთ ახლავე",
    featuredItems: "ვიტრინიდან",
    featuredSubtitle: "ჩვენი მწვრთნელის რჩეული ამ კვირისთვის.",
    aboutUs: "ჩვენი ისტორია",
    categories: "კატეგორიები",
    categoriesSubtitle: "ტორტები, ნამცხვრები, სასმელები და შოკოლადი — ყველაფერი ხელით მზადდება.",
    recentReviews: "სტუმრების შთაბეჭდილებები",
    recentReviewsSubtitle: "მუდმივი და ახალი სტუმრებისგან.",
    addToCart: "კალათაში დამატება",
    inCart: "კალათაშია",
    checkout: "შეკვეთის გაფორმება",
    placeOrder: "შეკვეთის განთავსება",
    writeReview: "შეფასების დაწერა",
    submit: "გაგზავნა",
    yourName: "თქვენი სახელი",
    rating: "შეფასება",
    yourReview: "თქვენი შეფასება",
    emptyCart: "თქვენი კალათა ცარიელია",
    cartHelper: "დაამატეთ რამდენიმე ტკბილი ნაწარმი დასაწყებად.",
    keepShopping: "ყიდვის გაგრძელება",
    total: "ჯამი",
    subtotal: "ჯამი",
    delivery: "მიტანა",
    free: "უფასო",
    cart: "კალათა",
    items: "ნივთი",
    item: "ნივთი",
    openNow: "ღიაა",
    closedNow: "დახურულია",
    opensAt: "იღება",
    closesAt: "იკეტება",
    seeAll: "ნახვა",
    viewDetails: "დეტალები",
    quantity: "რაოდენობა",
    remove: "წაშლა",
    clearCart: "კალათის გასუფთავება",
    deliveryDetails: "მიტანის დეტალები",
    yourOrder: "თქვენი შეკვეთა",
    fullName: "სახელი და გვარი",
    phone: "ტელეფონის ნომერი",
    address: "მისამართი",
    notes: "შენიშვნები (არასავალდებულო)",
    notesPlaceholder: "სპეციალური მითითებები, ალერგია და სხვა.",
    backToCart: "კალათაში დაბრუნება",
    processing: "მიმდინარეობს დამუშავება...",
    orderConfirmed: "შეკვეთა დადასტურდა",
    thanksForOrder: "გმადლობთ. თქვენი შეკვეთა მზადდება.",
    orderId: "შეკვეთის ნომერი",
    status: "სტატუსი",
    pending: "მოლოდინში",
    preparing: "მზადდება",
    ready: "მზადაა",
    completed: "დასრულებული",
    cancelled: "გაუქმებული",
    backToHome: "მთავარზე დაბრუნება",
    orderMore: "კიდევ შეკვეთა",
    findUs: "მოგვძებნეთ",
    visitUs: "ეწვიეთ",
    address_long: "დავით აღმაშენებლის გამზ. 189, თბილისი",
    hours: "სამუშაო საათები",
    callUs: "დაგვირეკეთ",
    emailUs: "მოგვწერეთ",
    getDirections: "მარშრუტი",
    openDaily: "ყოველდღე, 10:00 — 22:00",
    searchPlaceholder: "მენიუში ძიება...",
    all: "ყველა",
    cakes: "ტორტები",
    pastries: "ნამცხვრები",
    drinks: "სასმელები",
    chocolate: "შოკოლადი",
    noResults: "ვერაფერი მოიძებნა.",
    handcraftedDaily: "ყოველდღიური ხელნაკეთი",
    heroTagline: "უბანში ნამცხვრების სახლი აღმაშენებელის გამზირზე",
    aboutBody: "ჩვენ ვცხობთ ყოველ დილით, კარების გაღებამდე. კარაქი ერთი პატარა მეურნეობიდან. ერთწარმოების შოკოლადი. ყავას ვამზადებთ ყოველ კვირას. ჩვენ არ ვჩქარობთ — და არც საჭმელი.",
    galleryTeaserTitle: "შემოგვიხედეთ",
    galleryTeaserSubtitle: "მაგიდები, ვიტრინა, მარმარილოს დახლი და ის, რაც დილით ღუმელიდან გამოდის.",
    seeGallery: "გალერეის ნახვა",
    contactCta: "მოგვინახულეთ ან წინასწარ შეუკვეთეთ",
    contactCtaBody: "თქვენს მოსვლამდე ყველაფერი შეფუთული და მზად დაგხვდებათ.",
    basedOn: "დაფუძნებული",
    ratingsSuffix: "შეფასებაზე",
    leaveReview: "დაგვიტოვეთ შეფასება",
    nameRequired: "სახელი სავალდებულოა",
    reviewRequired: "გთხოვთ დაწეროთ რამე",
    submitting: "იგზავნება...",
    reviewThanks: "გმადლობთ შეფასებისთვის",
    reviewThanksBody: "ეს დაეხმარება სხვებს ჩვენთან მოსვლაში.",
    written: "დაწერილია",
    on: "—",
    perItem: "ერთი ცალი",
    aboutMin: "დაახლოებით 30 წთ",
    deliveryArea: "თბილისის ცენტრი",
    addedToCart: "დაემატა კალათაში",
    cartCleared: "კალათა გასუფთავდა",
    backToMenu: "მენიუში დაბრუნება",
    viewCart: "კალათის ნახვა",
    proceedToCheckout: "შეკვეთის გაფორმება",
    youreAllSet: "ყველაფერი მზადაა",
    welcome: "კეთილი იყოს თქვენი მობრძანება",
    photoBy: "ფოტო",
    next: "შემდეგი",
    previous: "წინა",
    close: "დახურვა",
    languageName: "ქართული",
  },
};

type TranslationKey = keyof typeof translations.en;

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("cafe43.lang");
    return saved === "en" || saved === "ka" ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("cafe43.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey) => {
    return translations[lang][key] || translations.en[key] || key;
  };

  const toggle = () => setLang((prev) => (prev === "en" ? "ka" : "en"));

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t }}>
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

export function localized(item: { name?: string; nameKa?: string }, lang: Language): string;
export function localized(item: { description?: string; descriptionKa?: string }, lang: Language, field: "description"): string;
export function localized(item: any, lang: Language, field: "name" | "description" = "name"): string {
  if (lang === "ka") {
    if (field === "name") return item.nameKa || item.name || "";
    return item.descriptionKa || item.description || "";
  }
  if (field === "name") return item.name || "";
  return item.description || "";
}
