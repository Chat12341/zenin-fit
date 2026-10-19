/* =====================================================================
   ZENIN.FIT — PRODUCTS & INVENTORY
   ---------------------------------------------------------------------
   SECTION 1  STORE_CONFIG   Store-wide settings (low-stock level, shipping)
   SECTION 2  INVENTORY      >>> EDIT STOCK NUMBERS HERE <<<
   SECTION 3  IMAGES         Optional real photos per color
   SECTION 4  BRANDS / CATEGORIES / PRODUCT DETAILS
   SECTION 5  Composition + validation (no need to edit)

   HOW STOCK STATUS WORKS (automatic)
   - A size with 0 units         -> "Out of Stock"
   - A size with 1..lowStockThreshold units -> "Low Stock"
   - A size with more than that  -> "In Stock"
   - A color or product shows its BEST size status (it is "In Stock" if any
     size is comfortably in stock, "Out of Stock" only when every size is 0).
   - The cart will never allow more units than the stock number below.

   NOTE: This is a static site, so stock numbers are not reduced when someone
   buys. After a real sale, update the number here (or connect a backend).
   ===================================================================== */

/* ---------- SECTION 1: STORE CONFIG ---------- */
const STORE_CONFIG = {
  currency: 'USD',
  lowStockThreshold: 5,          // 1 to this number of units = "Low Stock"
  freeShippingThreshold: 500,    // free shipping at or above this subtotal
  shippingFlat: 15,              // shipping fee below the threshold
  contactEmail: 'hello@zenin.fit',
  sizes: ['S', 'M', 'L'],
  promoCodes: {},                // e.g. { 'WELCOME10': 10 } = 10% off. Empty = none.
  featuredIds: [                 // products shown on the homepage
    'essentials-hoodie', 'bape-hoodie', 'chrome-hearts-tshirt', 'polo-ralph-lauren-hoodie',
    'canada-goose-jacket', 'essentials-tracksuit', 'bape-jacket', 'chrome-hearts-jacket'
  ]
};

/* ---------- SECTION 2: INVENTORY (EDIT ME) ----------
   Format:  'product-id': { 'Color Name': { S: units, M: units, L: units } }
   Color names must match the colors listed in SECTION 4.
   Set a number to 0 to mark a size sold out. */
const INVENTORY = {
  /* ===== ESSENTIALS ===== */
  'essentials-hoodie': {
    'Black': { S: 10, M: 15, L: 8 },
    'Gray':  { S: 7,  M: 12, L: 9 },
    'Cream': { S: 6,  M: 10, L: 5 }
  },
  'essentials-tshirt': {
    'Black': { S: 24, M: 30, L: 18 },
    'White': { S: 20, M: 26, L: 14 },
    'Sand':  { S: 9,  M: 12, L: 6 }
  },
  'essentials-shorts': {
    'Charcoal': { S: 12, M: 16, L: 9 },
    'Cream':    { S: 8,  M: 11, L: 4 },
    'Olive':    { S: 6,  M: 9,  L: 0 }
  },
  'essentials-jacket': {
    'Black': { S: 7, M: 10, L: 6 },
    'Navy':  { S: 5, M: 8,  L: 3 },
    'Olive': { S: 4, M: 6,  L: 2 }
  },
  'essentials-tracksuit': {
    'Gray':  { S: 9,  M: 14, L: 7 },
    'Black': { S: 12, M: 15, L: 10 },
    'Cream': { S: 3,  M: 5,  L: 2 }
  },

  /* ===== BAPE ===== */
  'bape-hoodie': {
    'Black':        { S: 6, M: 9,  L: 4 },
    'Forest Green': { S: 5, M: 7,  L: 3 },
    'Navy':         { S: 8, M: 10, L: 6 }
  },
  'bape-tshirt': {
    'White': { S: 14, M: 18, L: 11 },
    'Black': { S: 16, M: 20, L: 12 },
    'Red':   { S: 4,  M: 6,  L: 0 }
  },
  'bape-shorts': {
    'Gray':  { S: 7, M: 10, L: 5 },
    'Black': { S: 9, M: 12, L: 8 },
    'Navy':  { S: 5, M: 6,  L: 2 }
  },
  'bape-jacket': {
    'Black':        { S: 5, M: 7, L: 3 },
    'Navy':         { S: 4, M: 5, L: 0 },
    'Forest Green': { S: 3, M: 4, L: 2 }
  },
  'bape-tracksuit': {
    'Black': { S: 4, M: 6, L: 3 },
    'Gray':  { S: 2, M: 3, L: 1 },
    'Navy':  { S: 5, M: 5, L: 4 }
  },

  /* ===== CHROME HEARTS ===== */
  'chrome-hearts-hoodie': {
    'Black': { S: 3, M: 4, L: 2 },
    'White': { S: 2, M: 3, L: 0 },
    'Gray':  { S: 4, M: 5, L: 3 }
  },
  'chrome-hearts-tshirt': {
    'Black': { S: 8, M: 11, L: 6 },
    'White': { S: 7, M: 9,  L: 5 },
    'Red':   { S: 2, M: 3,  L: 1 }
  },
  'chrome-hearts-shorts': {
    'Black':    { S: 5, M: 7, L: 4 },
    'Gray':     { S: 4, M: 6, L: 3 },
    'Burgundy': { S: 3, M: 4, L: 1 }
  },
  'chrome-hearts-jacket': {
    'Black':    { S: 2, M: 3, L: 2 },
    'Brown':    { S: 1, M: 2, L: 0 },
    'Burgundy': { S: 2, M: 2, L: 1 }
  },
  'chrome-hearts-tracksuit': {
    'Black': { S: 3, M: 4, L: 2 },
    'Gray':  { S: 2, M: 3, L: 1 },
    'Navy':  { S: 0, M: 0, L: 0 }   // fully sold out color
  },

  /* ===== POLO RALPH LAUREN ===== */
  'polo-ralph-lauren-hoodie': {
    'Navy':  { S: 12, M: 16, L: 10 },
    'Gray':  { S: 10, M: 14, L: 9 },
    'Cream': { S: 8,  M: 11, L: 6 }
  },
  'polo-ralph-lauren-tshirt': {
    'White': { S: 22, M: 28, L: 19 },
    'Navy':  { S: 18, M: 24, L: 15 },
    'Black': { S: 15, M: 20, L: 12 }
  },
  'polo-ralph-lauren-shorts': {
    'Navy':  { S: 11, M: 14, L: 9 },
    'Gray':  { S: 9,  M: 12, L: 7 },
    'Olive': { S: 6,  M: 8,  L: 5 }
  },
  'polo-ralph-lauren-jacket': {
    'Navy':  { S: 7, M: 10, L: 6 },
    'Sand':  { S: 5, M: 8,  L: 4 },
    'Olive': { S: 4, M: 6,  L: 3 }
  },
  'polo-ralph-lauren-tracksuit': {
    'Navy':     { S: 8, M: 11, L: 6 },
    'Black':    { S: 7, M: 9,  L: 5 },
    'Burgundy': { S: 3, M: 5,  L: 2 }
  },

  /* ===== CANADA GOOSE ===== */
  'canada-goose-hoodie': {
    'Black': { S: 6, M: 9, L: 5 },
    'Navy':  { S: 5, M: 7, L: 4 },
    'Gray':  { S: 4, M: 6, L: 3 }
  },
  'canada-goose-tshirt': {
    'White': { S: 10, M: 13, L: 8 },
    'Black': { S: 12, M: 15, L: 9 },
    'Navy':  { S: 7,  M: 9,  L: 5 }
  },
  'canada-goose-shorts': {
    'Black': { S: 6, M: 8, L: 4 },
    'Sand':  { S: 5, M: 6, L: 3 },
    'Olive': { S: 3, M: 5, L: 0 }
  },
  'canada-goose-jacket': {
    'Black': { S: 4, M: 6, L: 3 },
    'Navy':  { S: 3, M: 4, L: 2 },
    'Sand':  { S: 2, M: 3, L: 0 }
  },
  'canada-goose-tracksuit': {
    'Black': { S: 5, M: 7, L: 4 },
    'Gray':  { S: 4, M: 5, L: 3 },
    'Navy':  { S: 3, M: 4, L: 1 }
  }
};

/* ---------- SECTION 3: IMAGES (OPTIONAL) ----------
   Until you add photos, a styled placeholder is shown for every color.
   To use a real photo:  'bape-hoodie': { 'Black': 'images/bape-hoodie-black.jpg' } */
const IMAGES = {
  'essentials-hoodie': {
    'Black': 'images/essentials-hoodie-black.webp',
    'Gray': 'images/essentials-hoodie-grey.webp',
    'Cream': 'images/essentials-hoodie-cream.webp'
  },

   'essentials-tshirt': {
  'Black': 'images/essentials-tshirt-black.jpg',
  'White': 'images/essentials-tshirt-white.webp',
  'Sand': 'images/essentials-tshirt-cream.webp'
},

  'essentials-shorts': {
  'Charcoal': 'images/essentials-shorts-charcoal.webp',
  'Cream': 'images/essentials-shorts-cream.webp',
  'Olive': 'images/essentials-shorts-olive.webp'
},

'essentials-jacket': {
  'Black': 'images/essentials-jacket-black.png',
  'Navy': 'images/essentials-jacket-navy.png',
  'Olive': 'images/essentials-jacket-olive.png'
},

'essentials-tracksuit': {
  'Gray': 'images/essentials-tracksuit-gray.png',
  'Black': 'images/essentials-tracksuit-black.png',
  'Cream': 'images/essentials-tracksuit-cream.png'
},

'bape-hoodie': {
  'Black': 'images/bape-hoodie-black.png',
  'Forest Green': 'images/bape-hoodie-forest-green.png',
  'Navy': 'images/bape-hoodie-navy.png'
},

'bape-tshirt': {
  'Black': 'images/bape-tshirt-black.webp',
  'White': 'images/bape-tshirt-white.avif',
  'Red': 'images/bape-tshirt-red.webp'
},

'bape-shorts': {
  'Black': 'images/bape-shorts-black.webp',
  'Gray': 'images/bape-shorts-gray.webp',
  'Navy': 'images/bape-shorts-navy.webp'
},

'bape-jacket': {
  'Black': 'images/bape-jacket-black.avif',
  'Navy': 'images/bape-jacket-navy.webp',
  'Forest Green': 'images/bape-jacket-forest-green.webp'
},

'bape-tracksuit': {
  'Black': 'images/bape-tracksuit-black.webp',
  'Gray': 'images/bape-tracksuit-gray.webp',
  'Navy': 'images/bape-tracksuit-navy.webp'
},
 
'chrome-hearts-hoodie': {
  'Black': 'images/chrome-hearts-hoodie-black.webp',
  'White': 'images/chrome-hearts-hoodie-white.webp',
  'Gray': 'images/chrome-hearts-hoodie-gray.webp'
}, 
'chrome-hearts-tshirt': {
  'Black': 'images/chrome-hearts-tshirt-black.webp',
  'White': 'images/chrome-hearts-tshirt-white.webp',
  'Red': 'images/chrome-hearts-tshirt-red.webp'
}, 

'chrome-hearts-shorts': {
  'Black': 'images/chrome-hearts-shorts-black.webp',
  'Gray': 'images/chrome-hearts-shorts-gray.webp',
  'Burgundy': 'images/chrome-hearts-shorts-burgundy.webp'
},

'chrome-hearts-jacket': {
  'Black': 'images/chrome-hearts-jacket-black.jpg',
  'Brown': 'images/chrome-hearts-jacket-brown.jpg',
  'Burgundy': 'images/chrome-hearts-jacket-burgundy.jpg'
},
'chrome-hearts-tracksuit': {
  'Black': 'images/chrome-hearts-tracksuit-black.jpg',
  'Gray': 'images/chrome-hearts-tracksuit-gray.jpg',
  'Navy': 'images/chrome-hearts-tracksuit-navy.jpg'
},
'polo-ralph-lauren-hoodie': {
  'Navy': 'images/polo-ralph-lauren-hoodie-navy.jpg',
  'Gray': 'images/polo-ralph-lauren-hoodie-gray.jpg',
  'Cream': 'images/polo-ralph-lauren-hoodie-cream.jpg'
},
'polo-ralph-lauren-tshirt': {
  'White': 'images/polo-ralph-lauren-tshirt-white.jpg',
  'Navy': 'images/polo-ralph-lauren-tshirt-navy.jpg',
  'Black': 'images/polo-ralph-lauren-tshirt-black.jpg'
},
'polo-ralph-lauren-shorts': {
  'Navy': 'images/polo-ralph-lauren-shorts-navy.jpg',
  'Gray': 'images/polo-ralph-lauren-shorts-gray.jpg',
  'Olive': 'images/polo-ralph-lauren-shorts-olive.jpg'
},
'polo-ralph-lauren-jacket': {
  'Navy': 'images/polo-ralph-lauren-jacket-navy.jpg',
  'Sand': 'images/polo-ralph-lauren-jacket-sand.jpg',
  'Olive': 'images/polo-ralph-lauren-jacket-olive.jpg'
},
'polo-ralph-lauren-tracksuit': {
  'Navy': 'images/polo-ralph-lauren-tracksuit-navy.jpg',
  'Black': 'images/polo-ralph-lauren-tracksuit-black.jpg',
  'Burgundy': 'images/polo-ralph-lauren-tracksuit-burgundy.jpg'
},

'canada-goose-hoodie': {
  'Black': 'images/canada-goose-hoodie-black.jpg',
  'Navy': 'images/canada-goose-hoodie-navy.jpg',
  'Gray': 'images/canada-goose-hoodie-gray.jpg'
},

'canada-goose-tshirt': {
  'White': 'images/canada-goose-tshirt-white.jpg',
  'Black': 'images/canada-goose-tshirt-black.jpg',
  'Navy': 'images/canada-goose-tshirt-navy.jpg'
}, 
'canada-goose-shorts': {
  'Black': 'images/canada-goose-shorts-black.jpg',
  'Sand': 'images/canada-goose-shorts-sand.jpg',
  'Olive': 'images/canada-goose-shorts-olive.jpg'
},

'canada-goose-jacket': {
  'Black': 'images/canada-goose-jacket-black.jpg',
  'Navy': 'images/canada-goose-jacket-navy.jpg',
  'Sand': 'images/canada-goose-jacket-sand.jpg'
},

'canada-goose-tracksuit': {
  'Black': 'images/canada-goose-tracksuit-black.jpg',
  'Gray': 'images/canada-goose-tracksuit-gray.jpg',
  'Navy': 'images/canada-goose-tracksuit-navy.jpg'
}, 
};


/* ---------- SECTION 4: BRANDS, CATEGORIES, PRODUCT DETAILS ---------- */
const BRANDS = [
  { slug: 'essentials', name: 'Essentials', tagline: 'Elevated everyday basics.',
    description: 'Clean silhouettes, heavyweight fabrics and quiet branding for pieces you reach for every day.',
    story: 'Essentials is built on restraint: considered proportions, soft heavyweight materials and a muted palette that works with everything. It is the foundation of a modern wardrobe.' },
  { slug: 'bape', name: 'Bape', tagline: 'Japanese streetwear, unmistakable.',
    description: 'Bold graphics and standout outerwear from one of streetwear\'s most recognizable names.',
    story: 'Bape sits at the center of global streetwear culture, known for loud graphics, signature details and pieces that are made to be noticed.' },
  { slug: 'chrome-hearts', name: 'Chrome Hearts', tagline: 'Luxury rock couture.',
    description: 'Dark, detailed and collected. Limited pieces for those who dress with intent.',
    story: 'Chrome Hearts blends rock-and-roll attitude with luxury craftsmanship. Quantities are small, so sizes move quickly.' },
  { slug: 'polo-ralph-lauren', name: 'Polo Ralph Lauren', tagline: 'American heritage, refined.',
    description: 'Timeless American style, from classic fleece to heritage jackets.',
    story: 'Polo Ralph Lauren carries decades of American style into modern streetwear: dependable fits, classic details and pieces that never feel dated.' },
  { slug: 'canada-goose', name: 'Canada Goose', tagline: 'Built for extreme weather.',
    description: 'Premium cold-weather outerwear and performance basics.',
    story: 'Canada Goose is known for serious outerwear designed to perform in harsh conditions without giving up a clean, premium look.' }
];

const CATEGORIES = [
  { key: 'hoodie',    label: 'Hoodie',    plural: 'Hoodies' },
  { key: 'tshirt',    label: 'T-Shirt',   plural: 'T-Shirts' },
  { key: 'shorts',    label: 'Shorts',    plural: 'Shorts' },
  { key: 'jacket',    label: 'Jacket',    plural: 'Jackets' },
  { key: 'tracksuit', label: 'Tracksuit', plural: 'Tracksuits' }
];

const PALETTE = {
  'Black': '#141414', 'White': '#f2f2f2', 'Gray': '#8a8a8a', 'Charcoal': '#3b3b3d',
  'Cream': '#e7dfcc', 'Sand': '#c9b48f', 'Navy': '#1b2a4a', 'Olive': '#5a5f3a',
  'Forest Green': '#214a34', 'Burgundy': '#6b1f2a', 'Red': '#b3262e', 'Brown': '#5b3f2c'
};

const CARE = {
  cotton: ['Machine wash cold with like colors, inside out', 'Do not bleach', 'Tumble dry low or hang dry', 'Iron on low heat; do not iron prints directly'],
  fleece: ['Machine wash cold, inside out, with similar colors', 'Use mild detergent; avoid fabric softener', 'Tumble dry low or hang dry', 'Do not iron embroidery or graphics'],
  nylon:  ['Machine wash cold on a gentle cycle', 'Do not use fabric softener or bleach', 'Hang dry or tumble dry low', 'Do not iron; use a cool iron only if needed'],
  down:   ['Professional dry cleaning or specialist down cleaning recommended', 'Spot clean with a damp cloth', 'Store hung in a cool, dry place', 'Do not bleach or iron'],
  delicate: ['Spot clean or dry clean recommended', 'If washing, use a cold, gentle cycle inside out', 'Hang dry; avoid tumble drying', 'Do not iron prints or metal hardware']
};

/* Names, prices, descriptions and specs below are SAMPLE CONTENT.
   Replace them with your real product details before launch. */
function def(brand, category, o) { return Object.assign({ id: brand + '-' + category, brand: brand, category: category }, o); }

const DETAILS = [
  /* ===== ESSENTIALS ===== */
  def('essentials', 'hoodie', { name: 'Essentials Fleece Hoodie', price: 190, isNew: true, colors: ['Black', 'Gray', 'Cream'],
    description: 'A heavyweight everyday hoodie with a clean, logo-light face and a relaxed drop shoulder.',
    features: ['Brushed fleece interior', 'Kangaroo pocket', 'Ribbed cuffs and hem', 'Drawstring hood'],
    materials: '80% cotton, 20% polyester fleece', fit: 'Relaxed, slightly oversized fit. True to size; size down for a closer fit.', care: CARE.fleece }),
  def('essentials', 'tshirt', { name: 'Essentials Boxy Tee', price: 85, colors: ['Black', 'White', 'Sand'],
    description: 'A boxy-cut tee in dense cotton jersey that holds its shape wash after wash.',
    features: ['Boxy silhouette', 'Ribbed crew neck', 'Pre-washed for softness'],
    materials: '100% cotton jersey', fit: 'Boxy fit with a dropped shoulder. True to size.', care: CARE.cotton }),
  def('essentials', 'shorts', { name: 'Essentials Sweat Shorts', price: 110, colors: ['Charcoal', 'Cream', 'Olive'],
    description: 'Easy fleece sweat shorts with an elastic waist and a knee-length cut.',
    features: ['Elastic drawstring waist', 'Side pockets', 'Brushed fleece interior'],
    materials: '80% cotton, 20% polyester', fit: 'Relaxed fit, hits at the knee. True to size.', care: CARE.fleece }),
  def('essentials', 'jacket', { name: 'Essentials Coach Jacket', price: 230, isNew: true, colors: ['Black', 'Navy', 'Olive'],
    description: 'A lightweight coach jacket with a snap front and a clean, minimal finish.',
    features: ['Snap-button front', 'Two welt pockets', 'Lined interior', 'Elastic cuffs'],
    materials: 'Shell: 100% nylon. Lining: 100% polyester', fit: 'Regular fit with room for layering. True to size.', care: CARE.nylon }),
  def('essentials', 'tracksuit', { name: 'Essentials Fleece Tracksuit', price: 320, colors: ['Gray', 'Black', 'Cream'],
    description: 'A matching fleece jacket and joggers, built for easy all-day wear.',
    features: ['Full-zip jacket with ribbed cuffs', 'Tapered joggers with drawstring', 'Matching two-piece set'],
    materials: '80% cotton, 20% polyester fleece', fit: 'Relaxed fit. Sold as a set; size up for a looser look.', care: CARE.fleece }),

  /* ===== BAPE ===== */
  def('bape', 'hoodie', { name: 'Bape Full-Zip Hoodie', price: 420, isNew: true, colors: ['Black', 'Forest Green', 'Navy'],
    description: 'A bold full-zip hoodie with statement graphics and a heavyweight feel.',
    features: ['Full-length zip', 'Hood with drawstrings', 'Front pockets', 'Graphic detailing'],
    materials: '100% cotton heavyweight sweat fabric', fit: 'Regular fit. True to size.', care: CARE.fleece }),
  def('bape', 'tshirt', { name: 'Bape Logo Tee', price: 140, colors: ['White', 'Black', 'Red'],
    description: 'A classic crew tee with a graphic front and a soft cotton hand.',
    features: ['Graphic print', 'Ribbed crew neck', 'Straight hem'],
    materials: '100% cotton jersey', fit: 'Regular fit. True to size.', care: CARE.cotton }),
  def('bape', 'shorts', { name: 'Bape Sweat Shorts', price: 240, colors: ['Gray', 'Black', 'Navy'],
    description: 'Comfortable terry shorts with a relaxed cut and subtle branded detail.',
    features: ['Elastic waistband with drawstring', 'Side pockets', 'Embroidered detail'],
    materials: '100% cotton terry', fit: 'Relaxed fit. True to size.', care: CARE.cotton }),
  def('bape', 'jacket', { name: 'Bape Track Jacket', price: 460, colors: ['Black', 'Navy', 'Forest Green'],
    description: 'A sporty zip-up track jacket with a stand collar and a sharp, lightweight shell.',
    features: ['Full zip', 'Stand collar', 'Zip pockets', 'Ribbed cuffs'],
    materials: 'Shell: 100% nylon. Lining: 100% polyester mesh', fit: 'Regular fit. True to size.', care: CARE.nylon }),
 
  /* ===== CHROME HEARTS ===== */
  def('chrome-hearts', 'hoodie', { name: 'Chrome Hearts Pullover Hoodie', price: 1150, isNew: true, colors: ['Black', 'White', 'Gray'],
    description: 'A premium heavyweight pullover with refined graphic detail and a boxy shape.',
    features: ['Heavyweight fleece', 'Kangaroo pocket', 'Graphic detailing', 'Ribbed cuffs and hem'],
    materials: '100% cotton heavyweight fleece', fit: 'Boxy fit. True to size.', care: CARE.delicate }),
  def('chrome-hearts', 'tshirt', { name: 'Chrome Hearts Graphic Tee', price: 520, colors: ['Black', 'White', 'Red'],
    description: 'A dense cotton tee with a considered graphic and a slightly oversized fit.',
    features: ['Graphic print', 'Ribbed crew neck', 'Heavy cotton jersey'],
    materials: '100% cotton jersey', fit: 'Slightly oversized. True to size.', care: CARE.delicate }),
  def('chrome-hearts', 'shorts', { name: 'Chrome Hearts Sweat Shorts', price: 690, colors: ['Black', 'Gray', 'Burgundy'],
    description: 'Luxe fleece shorts with an elastic waist and understated branding.',
    features: ['Elastic drawstring waist', 'Side pockets', 'Heavyweight fleece'],
    materials: '100% cotton fleece', fit: 'Relaxed fit, hits at the knee. True to size.', care: CARE.delicate }),
  def('chrome-hearts', 'jacket', { name: 'Chrome Hearts Zip Jacket', price: 1650, colors: ['Black', 'Brown', 'Burgundy'],
    description: 'A zip-front jacket with a dark, tailored finish and metal hardware.',
    features: ['Full zip with metal hardware', 'Two front pockets', 'Structured collar', 'Lined interior'],
    materials: 'Cotton-blend shell with metal hardware', fit: 'Regular fit. True to size.', care: CARE.delicate }),
  def('chrome-hearts', 'tracksuit', { name: 'Chrome Hearts Tracksuit Set', price: 1980, colors: ['Black', 'Gray', 'Navy'],
    description: 'A matching jacket and pant set in heavyweight fabric, finished with fine detail.',
    features: ['Zip-up jacket', 'Tapered pants', 'Heavyweight fabric', 'Sold as a set'],
    materials: '100% cotton heavyweight fleece', fit: 'Regular fit. Sold as a set.', care: CARE.delicate }),

  /* ===== POLO RALPH LAUREN ===== */
  def('polo-ralph-lauren', 'hoodie', { name: 'Polo Ralph Lauren Fleece Hoodie', price: 168, isNew: true, colors: ['Navy', 'Gray', 'Cream'],
    description: 'A classic fleece hoodie with a soft interior and timeless proportions.',
    features: ['Soft fleece interior', 'Kangaroo pocket', 'Drawstring hood', 'Embroidered detail'],
    materials: '60% cotton, 40% polyester fleece', fit: 'Classic fit. True to size.', care: CARE.fleece }),
  def('polo-ralph-lauren', 'tshirt', { name: 'Polo Ralph Lauren Classic Tee', price: 75, colors: ['White', 'Navy', 'Black'],
    description: 'A clean crew tee in smooth cotton jersey, an easy wardrobe staple.',
    features: ['Crew neck', 'Embroidered detail', 'Soft cotton jersey'],
    materials: '100% cotton jersey', fit: 'Classic fit. True to size.', care: CARE.cotton }),
  def('polo-ralph-lauren', 'shorts', { name: 'Polo Ralph Lauren Athletic Shorts', price: 98, colors: ['Navy', 'Gray', 'Olive'],
    description: 'Lightweight athletic shorts with an easy, active fit.',
    features: ['Elastic waistband with drawstring', 'Side pockets', 'Lightweight fabric'],
    materials: '100% polyester', fit: 'Regular fit, above the knee. True to size.', care: CARE.nylon }),
  def('polo-ralph-lauren', 'jacket', { name: 'Polo Ralph Lauren Harrington Jacket', price: 275, isNew: true, colors: ['Navy', 'Sand', 'Olive'],
    description: 'A heritage Harrington jacket with a clean collar and a lightweight lining.',
    features: ['Zip front', 'Ribbed collar, cuffs and hem', 'Two slash pockets', 'Lined interior'],
    materials: 'Shell: 100% cotton. Lining: 100% polyester', fit: 'Regular fit. True to size.', care: CARE.cotton }),
  def('polo-ralph-lauren', 'tracksuit', { name: 'Polo Ralph Lauren Track Set', price: 320, colors: ['Navy', 'Black', 'Burgundy'],
    description: 'A matching track jacket and pant set with a polished, athletic look.',
    features: ['Full-zip jacket', 'Tapered pants', 'Embroidered detail', 'Sold as a set'],
    materials: 'Polyester-cotton blend', fit: 'Regular fit. Sold as a set.', care: CARE.nylon }),

  /* ===== CANADA GOOSE ===== */
  def('canada-goose', 'hoodie', { name: 'Canada Goose Fleece Hoodie', price: 450, colors: ['Black', 'Navy', 'Gray'],
    description: 'A premium fleece hoodie for cold days, with a clean finish and a warm hand.',
    features: ['Warm fleece fabric', 'Kangaroo pocket', 'Ribbed cuffs and hem', 'Drawstring hood'],
    materials: '80% cotton, 20% polyester fleece', fit: 'Regular fit. True to size.', care: CARE.fleece }),
  def('canada-goose', 'tshirt', { name: 'Canada Goose Crew Tee', price: 175, colors: ['White', 'Black', 'Navy'],
    description: 'A refined crew tee in soft cotton, ideal for layering.',
    features: ['Crew neck', 'Soft cotton jersey', 'Subtle branded detail'],
    materials: '100% cotton jersey', fit: 'Regular fit. True to size.', care: CARE.cotton }),
  def('canada-goose', 'shorts', { name: 'Canada Goose Nylon Shorts', price: 295, colors: ['Black', 'Sand', 'Olive'],
    description: 'Lightweight nylon shorts with a technical feel and a clean silhouette.',
    features: ['Elastic waist with drawcord', 'Zip pocket', 'Quick-drying fabric'],
    materials: '100% nylon', fit: 'Regular fit, above the knee. True to size.', care: CARE.nylon }),
  def('canada-goose', 'jacket', { name: 'Canada Goose Down Parka', price: 1495, isNew: true, colors: ['Black', 'Navy', 'Sand'],
    description: 'A warm, insulated parka made for deep winter, with a structured hood.',
    features: ['Insulated down fill', 'Storm hood', 'Zip and snap front', 'Multiple pockets'],
    materials: 'Shell: nylon blend. Fill: down', fit: 'Regular fit with room for layering. True to size.', care: CARE.down }),
  def('canada-goose', 'tracksuit', { name: 'Canada Goose Fleece Tracksuit', price: 890, isNew: true, colors: ['Black', 'Gray', 'Navy'],
    description: 'A matching fleece jacket and pant set for effortless cold-weather comfort.',
    features: ['Zip-up jacket', 'Tapered pants with drawstring', 'Warm fleece fabric', 'Sold as a set'],
    materials: '80% cotton, 20% polyester fleece', fit: 'Regular fit. Sold as a set.', care: CARE.fleece })
];

/* ---------- SECTION 5: COMPOSITION + VALIDATION (no need to edit) ---------- */
const PRODUCTS = DETAILS.map(function (d) {
  return Object.assign({}, d, {
    colors: d.colors.map(function (name) {
      var inv = (INVENTORY[d.id] || {})[name] || {};
      return {
        name: name,
        hex: PALETTE[name],
        image: (IMAGES[d.id] || {})[name] || null,
        stock: { S: Math.max(0, parseInt(inv.S, 10) || 0), M: Math.max(0, parseInt(inv.M, 10) || 0), L: Math.max(0, parseInt(inv.L, 10) || 0) }
      };
    })
  });
});

(function validateInventory() {
  var problems = [];
  DETAILS.forEach(function (d) {
    var inv = INVENTORY[d.id];
    if (!inv) { problems.push('Missing inventory for ' + d.id); return; }
    d.colors.forEach(function (c) {
      if (!inv[c]) { problems.push(d.id + ': no inventory for color "' + c + '"'); return; }
      STORE_CONFIG.sizes.forEach(function (s) {
        var v = inv[c][s];
        if (!Number.isInteger(v) || v < 0) problems.push(d.id + ' / ' + c + ' / ' + s + ': stock must be a whole number 0 or higher (got ' + v + ')');
      });
    });
    Object.keys(inv).forEach(function (c) { if (d.colors.indexOf(c) === -1) problems.push(d.id + ': inventory has unknown color "' + c + '"'); });
  });
  Object.keys(INVENTORY).forEach(function (id) { if (!DETAILS.some(function (d) { return d.id === id; })) problems.push('Inventory has unknown product id "' + id + '"'); });
  if (problems.length && typeof console !== 'undefined') console.warn('[Zenin inventory check]\n' + problems.join('\n'));
})();
