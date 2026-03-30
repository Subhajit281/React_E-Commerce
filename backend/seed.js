// ─── Seed Script ─────────────────────────────────────────────────────────────
// Run once from backend folder: node seed.js
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true, trim: true },
  price:         { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: null },
  images:        [{ type: String }],
  category:      { type: String, required: true, trim: true, lowercase: true },
  subcategory:   { type: String, default: "", trim: true, lowercase: true },
  sizes:         [{ label: String, sizeType: String, stock: Number }],
  stock:         { type: Number, default: 0 },
  requiresSize:  { type: Boolean, default: false },
  rating:        { rate: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  isActive:      { type: Boolean, default: true },
  isFeatured:    { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", category: "text" });
const Product = mongoose.model("Product", productSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────
const products = [

  // ── Earrings ──────────────────────────────────────────────────────────────
  {
    title: "Kundan Jhumka Earrings",
    description: "Hand-crafted gold-toned jhumkas set with vibrant kundan stones in deep red and emerald green. Intricate meenakari enamel work on the base with a delicate pearl drop. Perfect for weddings and festive occasions.",
    price: 649,
    discountPrice: 499,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
    ],
    category: "earrings",
    subcategory: "jhumkas",
    stock: 25,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Oxidised Silver Chandbali",
    description: "Traditional chandbali earrings in oxidised silver finish with hand-engraved floral motifs. Lightweight and comfortable for all-day wear. Features a small turquoise bead at the centre for a pop of colour.",
    price: 399,
    discountPrice: 299,
    images: [
      "https://images.unsplash.com/photo-1714733831162-0a6e849141be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lsdmVyJTIwZWFycmluZ3N8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1714733831162-0a6e849141be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lsdmVyJTIwZWFycmluZ3N8ZW58MHx8MHx8fDA%3D",
    ],
    category: "earrings",
    subcategory: "chandbali",
    stock: 30,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Terracotta Tribal Stud Earrings",
    description: "Handmade terracotta stud earrings shaped into traditional tribal motifs and hand-painted in earthy tones of rust, ochre and cream. Each pair is unique — a true wearable art piece.",
    price: 249,
    discountPrice: 199,
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=80",
    ],
    category: "earrings",
    subcategory: "studs",
    stock: 40,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Peacock Feather Drop Earrings",
    description: "Long dangling earrings inspired by the Indian peacock, crafted from resin and copper wire. Features intricate peacock feather detailing with iridescent blue-green hues. Lightweight despite the length.",
    price: 499,
    discountPrice: 379,
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    ],
    category: "earrings",
    subcategory: "drops",
    stock: 20,
    requiresSize: false,
    isFeatured: false,
  },

  // ── Necklaces ─────────────────────────────────────────────────────────────
  {
    title: "Multilayer Kundan Haar",
    description: "Stunning 3-layer kundan necklace set with polki stones and pearl drops. Handcrafted by artisans using traditional gold-plating technique. Comes with matching earrings. An heirloom-quality bridal piece.",
    price: 2499,
    discountPrice: 1899,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    ],
    category: "necklaces",
    subcategory: "haar",
    stock: 10,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Oxidised Tribal Choker",
    description: "Bold oxidised silver choker featuring hand-hammered tribal coin pendants and turquoise stone inlays. Adjustable thread closure fits all neck sizes. Pairs beautifully with ethnic kurtas and sarees.",
    price: 699,
    discountPrice: 549,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    category: "necklaces",
    subcategory: "choker",
    stock: 18,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Beaded Meenakari Pendant Necklace",
    description: "Delicate single-pendant necklace featuring a handmade meenakari enamel pendant in floral design with vibrant colours on gold tone. Strung on a silk thread with adjustable length from 16\" to 18\".",
    price: 449,
    discountPrice: 349,
    images: [
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80",
    ],
    category: "necklaces",
    subcategory: "pendant",
    stock: 22,
    requiresSize: false,
    isFeatured: false,
  },

  // ── Bracelets ─────────────────────────────────────────────────────────────
  {
    title: "Lac Bangle Set — Bridal Red",
    description: "Set of 4 handcrafted lac bangles in auspicious bridal red, adorned with intricate gold foil work, tiny mirror chips, and delicate beadwork. Traditional Rajasthani craftsmanship. Available in standard and large sizes.",
    price: 599,
    discountPrice: 449,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
      "https://images.unsplash.com/photo-1573935448851-6e3c8afaa7ec?w=600&q=80",
    ],
    category: "bracelets",
    subcategory: "bangles",
    stock: 35,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Rudraksha & Copper Cuff Bracelet",
    description: "Handmade cuff bracelet combining rudraksha beads with hammered copper wire wrapping. Adjustable open-cuff design fits most wrist sizes. Believed to bring positive energy — a meaningful gift.",
    price: 349,
    discountPrice: 279,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80",
    ],
    category: "bracelets",
    subcategory: "cuff",
    stock: 28,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Thread & Ghungroo Anklet-Bracelet",
    description: "Playful wrist bracelet made from hand-knotted multicolour thread featuring tiny brass ghungroo (bells) that chime softly with movement. Bohemian-ethnic style, adjustable tie closure.",
    price: 199,
    discountPrice: 149,
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    ],
    category: "bracelets",
    subcategory: "thread",
    stock: 50,
    requiresSize: false,
    isFeatured: false,
  },

  // ── Rings ─────────────────────────────────────────────────────────────────
  {
    title: "Adjustable Kundan Cocktail Ring",
    description: "Statement cocktail ring featuring a large kundan stone surrounded by intricate gold-plated filigree work. Fully adjustable band fits sizes 6–9. Eye-catching centrepiece for any festive look.",
    price: 399,
    discountPrice: 299,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
      "https://images.unsplash.com/photo-1586074299757-dc655f18518c?w=600&q=80",
    ],
    category: "rings",
    subcategory: "cocktail",
    stock: 30,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Oxidised Thumb Ring with Floral Motif",
    description: "Wide-band oxidised silver thumb ring with hand-carved floral and leaf motifs. Open-band adjustable design. A boho-ethnic everyday staple that pairs with casual and ethnic wear alike.",
    price: 249,
    discountPrice: null,
    images: [
      "https://images.unsplash.com/photo-1589128777073-263566ae57e4?w=600&q=80",
      "https://images.unsplash.com/photo-1599459183200-59c7687a0c70?w=600&q=80",
    ],
    category: "rings",
    subcategory: "thumb ring",
    stock: 40,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Midi Ring Set — Gold Tone (Set of 5)",
    description: "Dainty set of 5 stackable midi rings in gold tone, each featuring a different motif — lotus, moon, star, leaf, and plain hammered band. Mix and stack across fingers for a curated look.",
    price: 349,
    discountPrice: 279,
    images: [
      "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=600&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94815b6?w=600&q=80",
    ],
    category: "rings",
    subcategory: "midi rings",
    stock: 25,
    requiresSize: false,
    isFeatured: false,
  },

  // ── Anklets ───────────────────────────────────────────────────────────────
  {
    title: "Silver Payal with Ghungroo",
    description: "Traditional silver-toned anklet (payal) featuring rows of tiny brass ghungroos that create a soft melodic chime. Lobster clasp with adjustable extension chain. Sold as a pair.",
    price: 449,
    discountPrice: 349,
    images: [
      "https://images.unsplash.com/photo-1573935448851-6e3c8afaa7ec?w=600&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    ],
    category: "anklets",
    subcategory: "payal",
    stock: 30,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Beaded Evil Eye Anklet",
    description: "Dainty handmade anklet strung with tiny blue evil eye beads, seed beads, and a central hamsa charm in gold tone. Adjustable from 9\" to 11\". A meaningful everyday wear piece.",
    price: 249,
    discountPrice: 199,
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    ],
    category: "anklets",
    subcategory: "beaded",
    stock: 45,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Oxidised Floral Anklet Pair",
    description: "Pair of oxidised silver anklets with delicate hand-crafted floral charms and tiny coin drops. Lightweight and comfortable for daily wear. Adjustable hook closure.",
    price: 399,
    discountPrice: 299,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80",
    ],
    category: "anklets",
    subcategory: "floral",
    stock: 22,
    requiresSize: false,
    isFeatured: false,
  },

  // ── Bows / Hair Accessories ───────────────────────────────────────────────
  {
    title: "Embroidered Silk Hair Bow — Magenta",
    description: "Handmade hair bow crafted from dupioni silk in rich magenta, adorned with delicate zari embroidery and a small pearl cluster at the centre. Attached to a sturdy alligator clip. Perfect for festive hairdos.",
    price: 299,
    discountPrice: 229,
    images: [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    ],
    category: "bows & hair accessories",
    subcategory: "hair bow",
    stock: 35,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Floral Gajra Hair Clip Set",
    description: "Set of 3 handmade fabric gajra-style hair clips featuring miniature mogra flowers crafted from white satin and green leaves. Adds a traditional touch to braids, buns, and half-up hairstyles.",
    price: 349,
    discountPrice: 269,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
    ],
    category: "bows & hair accessories",
    subcategory: "hair clips",
    stock: 28,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Kundan Maang Tikka",
    description: "Elegant maang tikka featuring a central kundan stone pendant on a delicate gold-plated chain with adjustable pin attachment. Lightweight and comfortable — suitable for brides and bridesmaids alike.",
    price: 549,
    discountPrice: 429,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
    ],
    category: "bows & hair accessories",
    subcategory: "maang tikka",
    stock: 20,
    requiresSize: false,
    isFeatured: true,
  },

  // ── Brooches & Pins ───────────────────────────────────────────────────────
  {
    title: "Peacock Enamel Saree Pin",
    description: "Handcrafted saree pin brooch in the shape of a peacock, finished in vibrant meenakari enamel with blue, green and gold tones. Sturdy pin back. A beautiful functional accessory for sarees and dupattas.",
    price: 299,
    discountPrice: 229,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
      "https://images.unsplash.com/photo-1635797255620-71bc84dfd598?w=600&q=80",
    ],
    category: "brooches & pins",
    subcategory: "saree pin",
    stock: 30,
    requiresSize: false,
    isFeatured: true,
  },
  {
    title: "Lotus Motif Oxidised Brooch",
    description: "Large oxidised silver brooch featuring a hand-crafted lotus motif with intricate petal detailing and a small ruby-red stone at the centre. Versatile — wear it on a kurta, blazer, or shawl.",
    price: 349,
    discountPrice: 279,
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=80",
    ],
    category: "brooches & pins",
    subcategory: "brooch",
    stock: 22,
    requiresSize: false,
    isFeatured: false,
  },
  {
    title: "Ganesha Charm Lapel Pin",
    description: "Miniature hand-painted Ganesha charm lapel pin in antique gold finish with fine enamel colour work. Comes in a small gift box — perfect as a meaningful gift for festivals or housewarmings.",
    price: 199,
    discountPrice: 159,
    images: [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    ],
    category: "brooches & pins",
    subcategory: "lapel pin",
    stock: 40,
    requiresSize: false,
    isFeatured: false,
  },
];

// ─── Run ──────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products successfully`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected. Done!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();