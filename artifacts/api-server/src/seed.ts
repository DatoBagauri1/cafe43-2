import {
  db,
  pool,
  menuItemsTable,
  reviewsTable,
  galleryPhotosTable,
} from "@workspace/db";
import { sql } from "drizzle-orm";

const ASSET = (file: string) => `/api/assets/${file}`;

const menuSeed = [
  // Cakes
  {
    name: "Dark Chocolate Layer Cake",
    nameKa: "მუქი შოკოლადის ფენოვანი ტორტი",
    description: "Three layers of velvety dark chocolate sponge with whipped ganache and a glossy mirror glaze.",
    descriptionKa: "ხავერდოვანი მუქი შოკოლადის სამი ფენა, განაშის კრემი და სარკისებური მორთვა.",
    price: "18.00",
    category: "cakes",
    imageUrl: ASSET("cake_chocolate.jpg"),
    featured: true,
  },
  {
    name: "Berry Pavlova",
    nameKa: "კენკროვანი პავლოვა",
    description: "Crisp meringue, vanilla bean cream and a slow-cooked compote of strawberries and raspberries.",
    descriptionKa: "მკვრივი მერენგი, ვანილის კრემი და ხილის კომპოტი.",
    price: "16.00",
    category: "cakes",
    imageUrl: ASSET("cake_pavlova.jpg"),
    featured: true,
  },
  {
    name: "Classic Tiramisu",
    nameKa: "კლასიკური ტირამისუ",
    description: "Espresso-soaked savoiardi layered with mascarpone cream and dusted with single-origin cocoa.",
    descriptionKa: "ესპრესოში დაფენილი სავოიარდი, მასკარპონეს კრემი და კაკაო.",
    price: "14.00",
    category: "cakes",
    imageUrl: ASSET("cake_tiramisu.jpg"),
    featured: false,
  },
  {
    name: "Honey Medovik",
    nameKa: "თაფლიანი მედოვიკი",
    description: "Eight whisper-thin honey layers folded with sour-cream cream — a Caucasus classic, our way.",
    descriptionKa: "თაფლიანი ფენების ნაზი ნამცხვარი არაჟნისებრი კრემით.",
    price: "12.00",
    category: "cakes",
    imageUrl: ASSET("cake_medovik.jpg"),
    featured: true,
  },
  // Pastries
  {
    name: "Butter Croissant",
    nameKa: "კარაქის კრუასანი",
    description: "Laminated 81 times with French butter. Honest crumb, audible shatter.",
    descriptionKa: "ფრანგული კარაქით, ნაზი და ხრაშუნა.",
    price: "5.50",
    category: "pastries",
    imageUrl: ASSET("pastry_croissant.jpg"),
    featured: true,
  },
  {
    name: "Pain au Chocolat",
    nameKa: "პენ ო შოკოლა",
    description: "Two batons of 70% Valrhona inside warm laminated dough.",
    descriptionKa: "მუქი შოკოლადით სავსე ცომის ნამცხვარი.",
    price: "6.50",
    category: "pastries",
    imageUrl: ASSET("pastry_painchoc.jpg"),
    featured: false,
  },
  {
    name: "Raspberry Macarons (6)",
    nameKa: "ჟოლოს მაკარონი (6)",
    description: "Six almond meringues with raspberry buttercream from the morning's berries.",
    descriptionKa: "ნუშის ექვსი მერენგი ჟოლოს კრემით.",
    price: "9.00",
    category: "pastries",
    imageUrl: ASSET("pastry_macarons.jpg"),
    featured: true,
  },
  {
    name: "Lemon Tart",
    nameKa: "ლიმონის ტარტი",
    description: "Sablé crust, sharp Amalfi lemon curd, scorched Italian meringue.",
    descriptionKa: "ხრაშუნა ცომი, ლიმონის კრემი და მერენგი.",
    price: "8.00",
    category: "pastries",
    imageUrl: ASSET("pastry_lemontart.jpg"),
    featured: false,
  },
  // Drinks
  {
    name: "Single-Origin Espresso",
    nameKa: "ერთწარმოების ესპრესო",
    description: "A 22g pull from this week's Ethiopian washed lot. Stone fruit, jasmine, brown sugar.",
    descriptionKa: "ეთიოპიური მარცვლის ესპრესო, ნაზი და არომატული.",
    price: "4.00",
    category: "drinks",
    imageUrl: ASSET("drink_espresso.jpg"),
    featured: false,
  },
  {
    name: "Cappuccino",
    nameKa: "კაპუჩინო",
    description: "Double-shot espresso, silky steamed milk, served in a warmed porcelain cup.",
    descriptionKa: "ორმაგი ესპრესო, რძის ნაზი ქაფი.",
    price: "6.00",
    category: "drinks",
    imageUrl: ASSET("drink_cappuccino.jpg"),
    featured: true,
  },
  {
    name: "Cold Brew",
    nameKa: "ცივად დაყენებული ყავა",
    description: "Steeped for 18 hours. Smooth, low-acid, served over a single big ice cube.",
    descriptionKa: "18 საათი დაყენებული, ნაზი და ცივი.",
    price: "5.50",
    category: "drinks",
    imageUrl: ASSET("drink_icedcoffee.jpg"),
    featured: false,
  },
  {
    name: "Jasmine Pearl Tea",
    nameKa: "ჟასმინის მარგალიტის ჩაი",
    description: "Hand-rolled green tea pearls, infused at 78°C. Floral, soft, returns sweet.",
    descriptionKa: "მწვანე ჩაი ჟასმინის გემოთი.",
    price: "5.00",
    category: "drinks",
    imageUrl: ASSET("drink_tea.jpg"),
    featured: false,
  },
  // Chocolate
  {
    name: "Dark Truffles (8)",
    nameKa: "მუქი ტრიუფელები (8)",
    description: "Hand-rolled 70% truffles, dusted in unsweetened cocoa.",
    descriptionKa: "ხელით გორგოლავებული ტრიუფელები კაკაოში.",
    price: "15.00",
    category: "chocolate",
    imageUrl: ASSET("choc_truffles.jpg"),
    featured: true,
  },
  {
    name: "Single-Origin Bar — Madagascar",
    nameKa: "ერთწარმოების ფილა — მადაგასკარი",
    description: "75% dark with bright red-fruit notes from Sambirano valley beans.",
    descriptionKa: "75% მუქი შოკოლადი მადაგასკარის მარცვლისგან.",
    price: "11.00",
    category: "chocolate",
    imageUrl: ASSET("choc_bar.jpg"),
    featured: false,
  },
  {
    name: "Chocolate-Dipped Strawberries (6)",
    nameKa: "შოკოლადში ჩაყურსული მარწყვი (6)",
    description: "Six in-season strawberries dipped to order in tempered dark chocolate.",
    descriptionKa: "სეზონური მარწყვი შოკოლადში.",
    price: "13.00",
    category: "chocolate",
    imageUrl: ASSET("choc_strawberry.jpg"),
    featured: true,
  },
  {
    name: "Praline Selection (9)",
    nameKa: "პრალინეების ნაკრები (9)",
    description: "Nine pralines: gianduja, hazelnut, salted caramel, pistachio, raspberry — plus four to surprise you.",
    descriptionKa: "ცხრა პრალინე ნაირნაირი გემოთი.",
    price: "20.00",
    category: "chocolate",
    imageUrl: ASSET("choc_pralines.jpg"),
    featured: false,
  },
];

const reviewsSeed = [
  {
    username: "Nino K.",
    rating: 5,
    text: "The medovik here is the best I have had in Tbilisi. The room smells like butter and coffee — exactly how a pastry shop should smell.",
  },
  {
    username: "Davit M.",
    rating: 5,
    text: "Came for an espresso and left with a box of macarons. Their pastry chef clearly cares.",
  },
  {
    username: "Sophio L.",
    rating: 4,
    text: "Beautiful interior and the croissants are properly laminated. Slightly busy on weekends but worth the wait.",
  },
  {
    username: "Giorgi T.",
    rating: 5,
    text: "Pavlova was a revelation. Crisp outside, marshmallow inside, and the berry compote tasted like summer.",
  },
];

const gallerySeed = [
  { imageUrl: ASSET("gal_interior1.jpg"), caption: "The room — warm light, glass cases, marble counters." },
  { imageUrl: ASSET("gal_barista.jpg"), caption: "Pulling a fresh espresso." },
  { imageUrl: ASSET("gal_macarondisplay.jpg"), caption: "This week's macaron lineup." },
  { imageUrl: ASSET("gal_chef.jpg"), caption: "Hand-finishing every cake." },
  { imageUrl: ASSET("gal_morning.jpg"), caption: "Slow Sunday morning." },
  { imageUrl: ASSET("gal_outdoor.jpg"), caption: "Tables on Agmashenebeli." },
  { imageUrl: ASSET("gal_tarts.jpg"), caption: "Tarts in the morning case." },
  { imageUrl: ASSET("gal_couple.jpg"), caption: "First date weather." },
];

async function seed() {
  console.log("Seeding CAFE 43...");

  await db.execute(sql`TRUNCATE TABLE ${menuItemsTable} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${reviewsTable} RESTART IDENTITY CASCADE`);
  await db.execute(sql`TRUNCATE TABLE ${galleryPhotosTable} RESTART IDENTITY CASCADE`);

  await db.insert(menuItemsTable).values(menuSeed);
  await db.insert(reviewsTable).values(reviewsSeed);
  await db.insert(galleryPhotosTable).values(gallerySeed);

  console.log(
    `Seeded ${menuSeed.length} menu items, ${reviewsSeed.length} reviews, ${gallerySeed.length} photos.`,
  );
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
