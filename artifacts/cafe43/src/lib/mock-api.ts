import {
  Category,
  OrderStatus,
  type CategorySummary,
  type CreateMenuItemBody,
  type CreateOrderBody,
  type CreateReviewBody,
  type GalleryPhoto,
  type HealthStatus,
  type MenuItem,
  type Order,
  type OrderItem,
  type OrderStatus as OrderStatusType,
  type Review,
  type ReviewSummary,
  type ShopInfo,
  type ShopStatus,
  type UpdateMenuItemBody,
  type UpdateOrderStatusBody,
} from "@workspace/api-client-react";

declare global {
  interface Window {
    __cafe43MockApiInstalled__?: boolean;
  }
}

const MENU_STORAGE_KEY = "cafe43.mock.menu-items.v1";
const REVIEWS_STORAGE_KEY = "cafe43.mock.reviews.v1";
const ORDERS_STORAGE_KEY = "cafe43.mock.orders.v1";

const BASE_REVIEW_COUNT = 77;
const BASE_REVIEW_RATING = 4.6;
const TBILISI_TIME_ZONE = "Asia/Tbilisi";
const OPENS_AT_HOUR = 10;
const CLOSES_AT_HOUR = 22;

const categoryOrder = [
  Category.cakes,
  Category.pastries,
  Category.drinks,
  Category.chocolate,
] as const;

const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Dark Chocolate Layer Cake",
    nameKa: "მუქი შოკოლადის ტორტი",
    description:
      "Three layers of velvety dark chocolate sponge with whipped ganache and a glossy mirror glaze.",
    descriptionKa:
      "სამფენიანი მუქი შოკოლადის ბისკვიტი ფაფუკი განაშით და პრიალა გლაზურით.",
    price: 18,
    category: Category.cakes,
    imageUrl: "/api/assets/cake_chocolate.jpg",
    featured: true,
    createdAt: "2026-01-04T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Berry Pavlova",
    nameKa: "კენკროვანი პავლოვა",
    description:
      "Crisp meringue, vanilla bean cream and a slow-cooked compote of strawberries and raspberries.",
    descriptionKa:
      "ხრაშუნა მერინგი, ვანილის კრემი და მარწყვისა და ჟოლოს კომპოტი.",
    price: 16,
    category: Category.cakes,
    imageUrl: "/api/assets/cake_pavlova.jpg",
    featured: true,
    createdAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: 3,
    name: "Classic Tiramisu",
    nameKa: "კლასიკური ტირამისუ",
    description:
      "Espresso-soaked savoiardi layered with mascarpone cream and dusted with single-origin cocoa.",
    descriptionKa:
      "ესპრესოში დანამული სავოიარდი, მასკარპონეს კრემი და კაკაოს ფენა.",
    price: 14,
    category: Category.cakes,
    imageUrl: "/api/assets/cake_tiramisu.jpg",
    featured: false,
    createdAt: "2026-01-06T09:00:00.000Z",
  },
  {
    id: 4,
    name: "Honey Medovik",
    nameKa: "თაფლის მედოვიკი",
    description:
      "Eight whisper-thin honey layers folded with sour-cream cream for a rich, nostalgic finish.",
    descriptionKa:
      "რვაფენიანი თაფლის ნამცხვარი არაჟნის კრემით და მდიდარი გემოთი.",
    price: 12,
    category: Category.cakes,
    imageUrl: "/api/assets/cake_medovik.jpg",
    featured: true,
    createdAt: "2026-01-07T09:00:00.000Z",
  },
  {
    id: 5,
    name: "Butter Croissant",
    nameKa: "კარაქის კრუასანი",
    description:
      "Laminated with French butter for a golden crust, airy center, and an audible shatter.",
    descriptionKa:
      "ფრანგული კარაქით მომზადებული ფენოვანი ცომი ოქროსფერი ქერქით და ჰაეროვანი გულით.",
    price: 5.5,
    category: Category.pastries,
    imageUrl: "/api/assets/pastry_croissant.jpg",
    featured: true,
    createdAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: 6,
    name: "Pain au Chocolat",
    nameKa: "პენ ო შოკოლა",
    description:
      "Warm laminated dough wrapped around two bars of dark chocolate.",
    descriptionKa:
      "ფენოვანი ცომი შიგნით ორი ღერის მუქი შოკოლადით.",
    price: 6.5,
    category: Category.pastries,
    imageUrl: "/api/assets/pastry_painchoc.jpg",
    featured: false,
    createdAt: "2026-01-09T09:00:00.000Z",
  },
  {
    id: 7,
    name: "Raspberry Macarons (6)",
    nameKa: "ჟოლოს მაკარონები (6)",
    description:
      "Six almond meringues filled with bright raspberry buttercream.",
    descriptionKa:
      "ექვსი ნუშის მაკარონი ჟოლოს კრემით.",
    price: 9,
    category: Category.pastries,
    imageUrl: "/api/assets/pastry_macarons.jpg",
    featured: true,
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: 8,
    name: "Lemon Tart",
    nameKa: "ლიმონის ტარტი",
    description:
      "A buttery sablé shell with sharp lemon curd and a lightly torched meringue cap.",
    descriptionKa:
      "კარაქიანი საბლეს ცომი ლიმონის კრემით და მსუბუქად მოხრაკული მერინგით.",
    price: 8,
    category: Category.pastries,
    imageUrl: "/api/assets/pastry_lemontart.jpg",
    featured: false,
    createdAt: "2026-01-11T09:00:00.000Z",
  },
  {
    id: 9,
    name: "Single-Origin Espresso",
    nameKa: "სპეშალტი ესპრესო",
    description:
      "A balanced shot with floral aromatics, stone fruit sweetness, and a silky finish.",
    descriptionKa:
      "დაბალანსებული შოთი ყვავილოვანი არომატებით, ხილის სიტკბოთი და რბილი დაბოლოებით.",
    price: 4,
    category: Category.drinks,
    imageUrl: "/api/assets/drink_espresso.jpg",
    featured: false,
    createdAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: 10,
    name: "Cappuccino",
    nameKa: "კაპუჩინო",
    description:
      "Double-shot espresso with silky steamed milk in a warm porcelain cup.",
    descriptionKa:
      "ორმაგი ესპრესო აბრეშუმისებრი რძის ქაფით თბილ ფინჯანში.",
    price: 6,
    category: Category.drinks,
    imageUrl: "/api/assets/drink_cappuccino.jpg",
    featured: true,
    createdAt: "2026-01-13T09:00:00.000Z",
  },
  {
    id: 11,
    name: "Cold Brew",
    nameKa: "ქოლდ ბრუ",
    description:
      "Slow-steeped for 18 hours and served over ice with a smooth, low-acid profile.",
    descriptionKa:
      "18 საათით დაყენებული ცივი ყავა რბილი და დაბალმჟავიანი გემოთი.",
    price: 5.5,
    category: Category.drinks,
    imageUrl: "/api/assets/drink_icedcoffee.jpg",
    featured: false,
    createdAt: "2026-01-14T09:00:00.000Z",
  },
  {
    id: 12,
    name: "Jasmine Pearl Tea",
    nameKa: "ჟასმინის ჩაი",
    description:
      "Hand-rolled green tea pearls infused into a floral, soft cup.",
    descriptionKa:
      "ხელით დახვეული მწვანე ჩაის მარგალიტები მსუბუქი და ყვავილოვანი არომატით.",
    price: 5,
    category: Category.drinks,
    imageUrl: "/api/assets/drink_tea.jpg",
    featured: false,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 13,
    name: "Dark Truffles (8)",
    nameKa: "მუქი ტრიუფელები (8)",
    description:
      "Eight hand-rolled dark chocolate truffles finished with unsweetened cocoa.",
    descriptionKa:
      "რვა ხელით დამზადებული მუქი შოკოლადის ტრიუფელი კაკაოს საფარით.",
    price: 15,
    category: Category.chocolate,
    imageUrl: "/api/assets/choc_truffles.jpg",
    featured: true,
    createdAt: "2026-01-16T09:00:00.000Z",
  },
  {
    id: 14,
    name: "Single-Origin Bar - Madagascar",
    nameKa: "შოკოლადის ფილა - მადაგასკარი",
    description:
      "A 75% dark bar with bright red-fruit notes from Madagascar cocoa.",
    descriptionKa:
      "75%-იანი მუქი შოკოლადის ფილა წითელი ხილის ტონებით.",
    price: 11,
    category: Category.chocolate,
    imageUrl: "/api/assets/choc_bar.jpg",
    featured: false,
    createdAt: "2026-01-17T09:00:00.000Z",
  },
  {
    id: 15,
    name: "Chocolate-Dipped Strawberries (6)",
    nameKa: "შოკოლადში ამოვლებული მარწყვი (6)",
    description:
      "Seasonal strawberries dipped to order in tempered dark chocolate.",
    descriptionKa:
      "სეზონური მარწყვი შეკვეთისას ამოვლებული მუქ შოკოლადში.",
    price: 13,
    category: Category.chocolate,
    imageUrl: "/api/assets/choc_strawberry.jpg",
    featured: true,
    createdAt: "2026-01-18T09:00:00.000Z",
  },
  {
    id: 16,
    name: "Praline Selection (9)",
    nameKa: "პრალინების არჩევანი (9)",
    description:
      "Nine assorted pralines with hazelnut, pistachio, caramel, and berry fillings.",
    descriptionKa:
      "ცხრა სახეობის პრალინი თხილით, ფისტით, კარამელით და კენკრის გულსართით.",
    price: 20,
    category: Category.chocolate,
    imageUrl: "/api/assets/choc_pralines.jpg",
    featured: false,
    createdAt: "2026-01-19T09:00:00.000Z",
  },
];

const defaultReviews: Review[] = [
  {
    id: 1,
    username: "Nino K.",
    rating: 5,
    text: "The medovik here is the best I have had in Tbilisi. The room smells like butter and coffee in the best way.",
    createdAt: "2026-02-02T10:15:00.000Z",
  },
  {
    id: 2,
    username: "Davit M.",
    rating: 5,
    text: "Came for an espresso and left with a box of macarons. Everything felt thoughtful and fresh.",
    createdAt: "2026-02-05T14:20:00.000Z",
  },
  {
    id: 3,
    username: "Sophio L.",
    rating: 4,
    text: "Beautiful interior and the croissants are properly laminated. Busy on weekends but worth the wait.",
    createdAt: "2026-02-08T09:50:00.000Z",
  },
  {
    id: 4,
    username: "Giorgi T.",
    rating: 5,
    text: "Pavlova was excellent. Crisp outside, soft inside, and the berry compote tasted freshly made.",
    createdAt: "2026-02-12T16:40:00.000Z",
  },
];

const defaultGallery: GalleryPhoto[] = [
  {
    id: 1,
    imageUrl: "/api/assets/gal_interior1.jpg",
    caption: "The room - warm light, glass cases, and marble counters.",
  },
  {
    id: 2,
    imageUrl: "/api/assets/gal_barista.jpg",
    caption: "Pulling a fresh espresso.",
  },
  {
    id: 3,
    imageUrl: "/api/assets/gal_macarondisplay.jpg",
    caption: "This week's macaron lineup.",
  },
  {
    id: 4,
    imageUrl: "/api/assets/gal_chef.jpg",
    caption: "Hand-finishing every cake.",
  },
  {
    id: 5,
    imageUrl: "/api/assets/gal_morning.jpg",
    caption: "Slow Sunday morning.",
  },
  {
    id: 6,
    imageUrl: "/api/assets/gal_outdoor.jpg",
    caption: "Tables on Agmashenebeli.",
  },
  {
    id: 7,
    imageUrl: "/api/assets/gal_tarts.jpg",
    caption: "Tarts in the morning case.",
  },
  {
    id: 8,
    imageUrl: "/api/assets/gal_couple.jpg",
    caption: "First date weather.",
  },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readCollection<T>(storageKey: string, defaults: T[]): T[] {
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    const seeded = clone(defaults);
    window.localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Stored value is not an array");
    }

    return parsed as T[];
  } catch {
    const seeded = clone(defaults);
    window.localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  }
}

function writeCollection<T>(storageKey: string, value: T[]): void {
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function getMenuItems(): MenuItem[] {
  return readCollection<MenuItem>(MENU_STORAGE_KEY, defaultMenuItems);
}

function saveMenuItems(items: MenuItem[]): void {
  writeCollection(MENU_STORAGE_KEY, items);
}

function getReviews(): Review[] {
  return readCollection<Review>(REVIEWS_STORAGE_KEY, defaultReviews);
}

function saveReviews(reviews: Review[]): void {
  writeCollection(REVIEWS_STORAGE_KEY, reviews);
}

function getOrders(): Order[] {
  return readCollection<Order>(ORDERS_STORAGE_KEY, []);
}

function saveOrders(orders: Order[]): void {
  writeCollection(ORDERS_STORAGE_KEY, orders);
}

function nextId(rows: Array<{ id: number }>): number {
  return rows.reduce((maxId, row) => Math.max(maxId, row.id), 0) + 1;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function emptyResponse(status = 204): Response {
  return new Response(null, { status });
}

function errorResponse(status: number, message: string): Response {
  return jsonResponse({ message }, status);
}

async function readJsonBody<T>(request: Request): Promise<T> {
  const text = await request.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    return a.id - b.id;
  });
}

function sortByNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function normalizeSearch(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function getReviewSummary(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) {
    return { averageRating: 0, count: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    averageRating: Number((total / reviews.length).toFixed(2)),
    count: reviews.length,
  };
}

function getShopStatus(): ShopStatus {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TBILISI_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  const hour = Number(getPart("hour"));
  const minute = Number(getPart("minute"));
  const minutes = hour * 60 + minute;
  const openingMinutes = OPENS_AT_HOUR * 60;
  const closingMinutes = CLOSES_AT_HOUR * 60;

  return {
    isOpen: minutes >= openingMinutes && minutes < closingMinutes,
    opensAt: "10:00",
    closesAt: "22:00",
    currentLocalTime: `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart("hour")}:${getPart("minute")}:00+04:00`,
  };
}

function getShopInfo(reviews: Review[]): ShopInfo {
  const dynamicSummary = getReviewSummary(reviews);
  const totalCount = BASE_REVIEW_COUNT + dynamicSummary.count;
  const blendedAverage =
    totalCount > 0
      ? (BASE_REVIEW_RATING * BASE_REVIEW_COUNT +
          dynamicSummary.averageRating * dynamicSummary.count) /
        totalCount
      : BASE_REVIEW_RATING;

  return {
    name: "CAFE 43",
    tagline: "Premium pastry & dessert shop",
    address: "189 David Agmashenebeli Ave",
    city: "Tbilisi",
    phone: "+995 32 243 43 43",
    email: "hello@cafe43.ge",
    rating: Number(blendedAverage.toFixed(1)),
    reviewCount: totalCount,
    latitude: 41.7211,
    longitude: 44.7982,
    hours: "Daily, 10:00 - 22:00",
  };
}

function getCategorySummary(items: MenuItem[]): CategorySummary[] {
  return categoryOrder
    .map((category) => {
      const inCategory = items.filter((item) => item.category === category);

      if (inCategory.length === 0) {
        return null;
      }

      const [sample] = sortMenuItems(inCategory);

      return {
        category,
        count: inCategory.length,
        sampleImageUrl: sample.imageUrl,
      };
    })
    .filter((item): item is CategorySummary => item !== null);
}

function toAbsoluteApiUrl(request: Request): URL {
  return new URL(request.url, window.location.origin);
}

function isMockableApiRequest(url: URL): boolean {
  return (
    url.origin === window.location.origin &&
    url.pathname.startsWith("/api/") &&
    !url.pathname.startsWith("/api/assets/")
  );
}

async function handleMenuCollection(
  request: Request,
  url: URL,
): Promise<Response> {
  if (request.method === "GET") {
    const category = url.searchParams.get("category");
    const search = normalizeSearch(url.searchParams.get("search") ?? "");

    let items = sortMenuItems(getMenuItems());

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter((item) =>
        [item.name, item.nameKa, item.description, item.descriptionKa].some(
          (field) => field.toLocaleLowerCase().includes(search),
        ),
      );
    }

    return jsonResponse(items);
  }

  if (request.method === "POST") {
    const body = await readJsonBody<CreateMenuItemBody>(request);
    const items = getMenuItems();

    const nextItem: MenuItem = {
      id: nextId(items),
      name: body.name,
      nameKa: body.nameKa,
      description: body.description,
      descriptionKa: body.descriptionKa,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl,
      featured: body.featured ?? false,
      createdAt: new Date().toISOString(),
    };

    const updatedItems = [...items, nextItem];
    saveMenuItems(updatedItems);

    return jsonResponse(nextItem, 201);
  }

  return errorResponse(405, "Method not allowed");
}

async function handleMenuItem(
  request: Request,
  id: number,
): Promise<Response> {
  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === id);

  if (request.method === "GET") {
    if (index === -1) {
      return errorResponse(404, "Menu item not found");
    }

    return jsonResponse(items[index]);
  }

  if (request.method === "PATCH") {
    if (index === -1) {
      return errorResponse(404, "Menu item not found");
    }

    const body = await readJsonBody<UpdateMenuItemBody>(request);
    const current = items[index];
    const updatedItem: MenuItem = {
      ...current,
      ...body,
      price: body.price ?? current.price,
    };

    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    saveMenuItems(updatedItems);

    return jsonResponse(updatedItem);
  }

  if (request.method === "DELETE") {
    if (index !== -1) {
      saveMenuItems(items.filter((item) => item.id !== id));
    }

    return emptyResponse();
  }

  return errorResponse(405, "Method not allowed");
}

async function handleReviewsCollection(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return jsonResponse(sortByNewest(getReviews()));
  }

  if (request.method === "POST") {
    const body = await readJsonBody<CreateReviewBody>(request);
    const reviews = getReviews();

    const nextReview: Review = {
      id: nextId(reviews),
      username: body.username,
      rating: body.rating,
      text: body.text,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = sortByNewest([...reviews, nextReview]);
    saveReviews(updatedReviews);

    return jsonResponse(nextReview, 201);
  }

  return errorResponse(405, "Method not allowed");
}

async function handleOrdersCollection(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return jsonResponse(sortByNewest(getOrders()));
  }

  if (request.method === "POST") {
    const body = await readJsonBody<CreateOrderBody>(request);
    const menuItems = getMenuItems();
    const orders = getOrders();

    const itemSnapshots: OrderItem[] = [];
    let total = 0;

    for (const item of body.items) {
      const menuItem = menuItems.find((menu) => menu.id === item.menuItemId);

      if (!menuItem) {
        return errorResponse(400, `Unknown menu item: ${item.menuItemId}`);
      }

      itemSnapshots.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        unitPrice: menuItem.price,
        quantity: item.quantity,
      });

      total += menuItem.price * item.quantity;
    }

    const nextOrder: Order = {
      id: nextId(orders),
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      notes: body.notes ?? "",
      items: itemSnapshots,
      total: Number(total.toFixed(2)),
      status: OrderStatus.pending,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = sortByNewest([...orders, nextOrder]);
    saveOrders(updatedOrders);

    return jsonResponse(nextOrder, 201);
  }

  return errorResponse(405, "Method not allowed");
}

async function handleOrderStatus(
  request: Request,
  id: number,
): Promise<Response> {
  if (request.method !== "PATCH") {
    return errorResponse(405, "Method not allowed");
  }

  const body = await readJsonBody<UpdateOrderStatusBody>(request);
  const orders = getOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return errorResponse(404, "Order not found");
  }

  const updatedOrder: Order = {
    ...orders[index],
    status: body.status as OrderStatusType,
  };

  const updatedOrders = [...orders];
  updatedOrders[index] = updatedOrder;
  saveOrders(updatedOrders);

  return jsonResponse(updatedOrder);
}

async function handleMockApiRequest(request: Request): Promise<Response> {
  const url = toAbsoluteApiUrl(request);
  const { pathname } = url;

  if (pathname === "/api/healthz" && request.method === "GET") {
    const payload: HealthStatus = { status: "ok" };
    return jsonResponse(payload);
  }

  if (pathname === "/api/menu") {
    return handleMenuCollection(request, url);
  }

  if (pathname === "/api/menu/featured" && request.method === "GET") {
    const featured = getMenuItems()
      .filter((item) => item.featured)
      .sort((a, b) => a.id - b.id);

    return jsonResponse(featured);
  }

  if (pathname === "/api/menu/categories" && request.method === "GET") {
    return jsonResponse(getCategorySummary(getMenuItems()));
  }

  if (/^\/api\/menu\/\d+$/.test(pathname)) {
    const id = Number(pathname.split("/").pop());
    return handleMenuItem(request, id);
  }

  if (pathname === "/api/reviews") {
    return handleReviewsCollection(request);
  }

  if (pathname === "/api/reviews/summary" && request.method === "GET") {
    return jsonResponse(getReviewSummary(getReviews()));
  }

  if (pathname === "/api/gallery" && request.method === "GET") {
    return jsonResponse(clone(defaultGallery));
  }

  if (pathname === "/api/orders") {
    return handleOrdersCollection(request);
  }

  if (/^\/api\/orders\/\d+\/status$/.test(pathname)) {
    const segments = pathname.split("/");
    const id = Number(segments[3]);
    return handleOrderStatus(request, id);
  }

  if (pathname === "/api/shop/status" && request.method === "GET") {
    return jsonResponse(getShopStatus());
  }

  if (pathname === "/api/shop/info" && request.method === "GET") {
    return jsonResponse(getShopInfo(getReviews()));
  }

  return errorResponse(404, "Not found");
}

export function installMockApi(): void {
  if (typeof window === "undefined" || window.__cafe43MockApiInstalled__) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = toAbsoluteApiUrl(request);

    if (!isMockableApiRequest(url)) {
      return originalFetch(input, init);
    }

    return handleMockApiRequest(request);
  };

  window.__cafe43MockApiInstalled__ = true;
}
