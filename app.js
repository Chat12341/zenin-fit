/* =====================================================================
   ZENIN.FIT — SHARED APP SCRIPT
   Header, footer, cart, search, stock logic and page renderers.
   Content you may want to edit: REVIEWS and FAQS (below).
   ===================================================================== */
(function () {
  'use strict';

  var CFG = STORE_CONFIG;

  /* ---------------------------------------------------------------
     CONTENT: REVIEWS  (only show real, verified customer reviews)
     Leave the array empty ([]) to hide the reviews section.
     The entries below are PLACEHOLDERS and are labeled as samples.
     --------------------------------------------------------------- */
  var REVIEWS = [
    { stars: 5, text: 'Sample review text. Replace with a real customer review.', name: 'Customer Name', item: 'Product Purchased', sample: true },
    { stars: 5, text: 'Sample review text. Replace with a real customer review.', name: 'Customer Name', item: 'Product Purchased', sample: true },
    { stars: 5, text: 'Sample review text. Replace with a real customer review.', name: 'Customer Name', item: 'Product Purchased', sample: true }
  ];

  /* ---------------------------------------------------------------
     CONTENT: FAQS  (SAMPLE POLICY TEXT: confirm before launch)
     --------------------------------------------------------------- */
  var FAQS = [
    { cat: 'Orders & Shipping', q: 'How long does shipping take?', a: 'Orders are processed within 1 to 2 business days. Standard delivery typically takes 5 to 10 business days. Delivery times vary by destination.' },
    { cat: 'Orders & Shipping', q: 'Do you ship internationally?', a: 'Yes. We ship worldwide. Duties and taxes, where applicable, are shown at checkout.' },
    { cat: 'Orders & Shipping', q: 'Is shipping free?', a: 'Orders over ' + money(CFG.freeShippingThreshold) + ' ship free. A flat fee of ' + money(CFG.shippingFlat) + ' applies to smaller orders.' },
    { cat: 'Orders & Shipping', q: 'How can I track my order?', a: 'Once your order ships you will receive an email with a tracking number and a link to follow your package.' },
    { cat: 'Sizing', q: 'Which sizes do you offer?', a: 'Every product is offered in sizes S, M and L. Availability is shown per color and size on each product page.' },
    { cat: 'Sizing', q: 'How do I find my size?', a: 'Each product page has Fit information describing how it runs. Fit varies by brand, so if you are between sizes or unsure, contact us and we will help you choose.' },
    { cat: 'Stock & Availability', q: 'What do In Stock, Low Stock and Out of Stock mean?', a: 'In Stock means the size is readily available. Low Stock means ' + CFG.lowStockThreshold + ' or fewer units remain in that color and size. Out of Stock means it is currently unavailable.' },
    { cat: 'Stock & Availability', q: 'Can I add more than the available quantity to my cart?', a: 'No. Your cart will not let you add more units of a color and size than we have available.' },
    { cat: 'Returns & Exchanges', q: 'What is your return policy?', a: 'Unworn items with original tags can be returned within 14 days of delivery for store credit or a refund to the original payment method.' },
    { cat: 'Returns & Exchanges', q: 'Can I exchange an item for a different size?', a: 'Yes, subject to availability. Contact us with your order number and the size you would like.' },
    { cat: 'Payments', q: 'Which payment methods do you accept?', a: 'Available payment methods are shown at checkout. All payments are processed securely.' },
    { cat: 'Products', q: 'Where can I find material and care information?', a: 'Every product page lists materials, fit and care instructions. If you have a question about a specific item, contact us before ordering.' }
  ];

  /* ---------------------------------------------------------------
     UTILITIES
     --------------------------------------------------------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  function brandBySlug(s) { return BRANDS.filter(function (b) { return b.slug === s; })[0]; }
  function catByKey(k) { return CATEGORIES.filter(function (c) { return c.key === k; })[0]; }
  function productById(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function colorOf(p, name) { return p.colors.filter(function (c) { return c.name === name; })[0]; }

  /* ---------------------------------------------------------------
     STOCK LOGIC
     --------------------------------------------------------------- */
  var STATUS_LABEL = { in: 'In Stock', low: 'Low Stock', out: 'Out of Stock' };
  var RANK = { out: 0, low: 1, in: 2 };

  function sizeStatus(qty) {
    if (qty <= 0) return 'out';
    if (qty <= CFG.lowStockThreshold) return 'low';
    return 'in';
  }
  function best(list) {
    return list.reduce(function (a, b) { return RANK[b] > RANK[a] ? b : a; }, 'out');
  }
  function colorStatus(c) { return best(CFG.sizes.map(function (s) { return sizeStatus(c.stock[s]); })); }
  function productStatus(p) { return best(p.colors.map(colorStatus)); }
  function getStock(id, colorName, size) {
    var p = productById(id); if (!p) return 0;
    var c = colorOf(p, colorName); if (!c) return 0;
    return c.stock[size] || 0;
  }
  function stockLabel(status, extra) {
    return '<span class="stock ' + status + '"><b></b>' + STATUS_LABEL[status] + (extra ? ' <em>' + extra + '</em>' : '') + '</span>';
  }

  /* ---------------------------------------------------------------
     PLACEHOLDER IMAGES (SVG garment silhouettes tinted by color)
     --------------------------------------------------------------- */
  var SHAPES = {
    tee: '<path d="M62 34 L92 22 Q100 40 108 22 L138 34 L184 66 L166 98 L148 84 L148 214 L52 214 L52 84 L34 98 L16 66 Z"/><path d="M92 22 Q100 40 108 22" fill="none"/>',
    hoodie: '<path d="M60 52 L84 36 Q100 56 116 36 L140 52 L186 84 L176 208 L152 204 L148 112 L148 218 L52 218 L52 112 L48 204 L24 208 L14 84 Z"/><path d="M72 44 Q76 14 100 12 Q124 14 128 44 Q114 64 100 64 Q86 64 72 44 Z"/><path d="M72 160 L128 160 L136 190 L64 190 Z" fill="none"/><path d="M94 64 L94 92 M106 64 L106 92" fill="none"/>',
    shorts: '<path d="M48 36 L152 36 L164 188 L108 188 L100 92 L92 188 L36 188 Z"/><path d="M48 52 L152 52 M96 36 L94 66 M104 36 L106 66" fill="none"/>',
    jacket: '<path d="M62 36 L84 28 L100 44 L116 28 L138 36 L186 70 L176 206 L152 202 L148 100 L148 216 L52 216 L52 100 L48 202 L24 206 L14 70 Z"/><path d="M100 44 L100 216 M84 28 L88 50 L100 44 L112 50 L116 28 M62 160 L62 188 M138 160 L138 188" fill="none"/>',
    tracksuit: '<path d="M62 14 L84 8 L100 20 L116 8 L138 14 L176 40 L168 112 L148 108 L146 56 L146 122 L54 122 L54 56 L52 108 L32 112 L24 40 Z"/><path d="M100 20 L100 122" fill="none"/><path d="M54 128 L146 128 L154 232 L108 232 L100 160 L92 232 L46 232 Z"/><path d="M54 140 L146 140" fill="none"/>'
  };
  function garment(category, hex) {
    return '<svg class="garment" viewBox="0 0 200 240" fill="' + hex + '" stroke="rgba(255,255,255,.32)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" role="img" aria-hidden="true">' + (SHAPES[category] || SHAPES.tee) + '</svg>';
  }
  function imgHtml(p, color) {
    if (color.image) return '<img src="' + esc(color.image) + '" alt="' + esc(p.name + ' in ' + color.name) + '" loading="lazy">';
    return garment(p.category, color.hex);
  }

  /* ---------------------------------------------------------------
     CART (localStorage). Never exceeds available stock.
     --------------------------------------------------------------- */
  var CART_KEY = 'zenin_cart_v1';
  var cart = [];
  var promo = null;

  function cartLoad() {
    try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
    if (!Array.isArray(cart)) cart = [];
    cartSanitize();
  }
  function cartSave() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } }
  // Drops unknown items and trims quantities to current stock. Returns true if anything changed.
  function cartSanitize() {
    var changed = false;
    cart = cart.filter(function (it) {
      var stock = getStock(it.id, it.color, it.size);
      if (!productById(it.id) || stock <= 0) { changed = true; return false; }
      if (it.qty > stock) { it.qty = stock; changed = true; }
      if (!(it.qty >= 1)) { changed = true; return false; }
      return true;
    });
    if (changed) cartSave();
    return changed;
  }
  function cartQty(id, color, size) {
    return cart.reduce(function (n, it) { return (it.id === id && it.color === color && it.size === size) ? n + it.qty : n; }, 0);
  }
  function cartCount() { return cart.reduce(function (n, it) { return n + it.qty; }, 0); }
  function addToCart(id, color, size, qty) {
    var stock = getStock(id, color, size);
    var have = cartQty(id, color, size);
    qty = Math.max(1, parseInt(qty, 10) || 1);
    if (stock <= 0) return { ok: false, msg: 'Sorry, that size is out of stock.' };
    if (have + qty > stock) {
      var room = stock - have;
      if (room <= 0) return { ok: false, msg: 'You already have all ' + stock + ' available in your cart.' };
      return { ok: false, msg: 'Only ' + stock + ' available. You have ' + have + ' in your cart, so you can add ' + room + ' more.' };
    }
    var line = cart.filter(function (it) { return it.id === id && it.color === color && it.size === size; })[0];
    if (line) line.qty += qty; else cart.push({ id: id, color: color, size: size, qty: qty });
    cartSave();
    return { ok: true, msg: 'Added to your cart.' };
  }
  function cartSetQty(i, qty) {
    var it = cart[i]; if (!it) return { ok: false };
    var stock = getStock(it.id, it.color, it.size);
    if (qty <= 0) { cart.splice(i, 1); cartSave(); return { ok: true }; }
    if (qty > stock) { it.qty = stock; cartSave(); return { ok: false, msg: 'Only ' + stock + ' available in that size.' }; }
    it.qty = qty; cartSave(); return { ok: true };
  }
  function cartDetailed() {
    return cart.map(function (it, i) {
      var p = productById(it.id), c = colorOf(p, it.color);
      var stock = getStock(it.id, it.color, it.size);
      return { i: i, it: it, p: p, c: c, stock: stock, line: p.price * it.qty };
    });
  }
  function cartTotals() {
    var subtotal = cart.reduce(function (n, it) { return n + productById(it.id).price * it.qty; }, 0);
    var discount = promo ? Math.round(subtotal * promo.pct) / 100 : 0;
    var after = subtotal - discount;
    var shipping = (after === 0 || after >= CFG.freeShippingThreshold) ? 0 : CFG.shippingFlat;
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: after + shipping, after: after };
  }

  /* ---------------------------------------------------------------
     LAYOUT: header, footer, overlays
     --------------------------------------------------------------- */
  function headerHTML() {
    var brandLinks = BRANDS.map(function (b) { return '<li><a href="' + b.slug + '.html">' + esc(b.name) + '</a></li>'; }).join('');
    return '<div class="announce">Complimentary shipping on orders over ' + money(CFG.freeShippingThreshold) + '</div>' +
      '<header class="site-header"><div class="wrap nav">' +
      '<div class="nav-left">' +
      '<button class="menu-btn" data-open="menu" aria-label="Open menu">Menu</button>' +
      '<ul class="nav-links">' +
      '<li><a href="shop.html">Shop</a></li>' +
      '<li class="has-dd"><button class="dd-btn" aria-haspopup="true" aria-expanded="false">Brands</button><ul class="dd">' + brandLinks + '</ul></li>' +
      '<li><a href="about.html">About</a></li></ul></div>' +
      '<a class="logo" href="index.html">Zenin<span>.fit</span></a>' +
      '<div class="nav-right">' +
      '<button class="nav-btn" data-open="search">Search</button>' +
      '<a href="contact.html" class="hide-m">Contact</a>' +
      '<a href="cart.html" class="cart-link">Cart (<span data-cart-count>0</span>)</a>' +
      '</div></div></header>';
  }
  function footerHTML() {
    var shop = BRANDS.map(function (b) { return '<li><a href="' + b.slug + '.html">' + esc(b.name) + '</a></li>'; }).join('');
    return '<div class="news" id="newsletter"><div class="wrap"><span class="eyebrow">Stay Ahead</span><h2>Get early access to new drops</h2>' +
      '<form class="news-form" novalidate><input type="email" placeholder="Enter your email" required aria-label="Email address"><button type="submit">Subscribe</button></form>' +
      '<p class="form-msg" id="newsMsg" role="status"></p></div></div>' +
      '<footer class="site-footer"><div class="wrap"><div class="foot">' +
      '<div><a href="index.html" class="logo">Zenin<span>.fit</span></a><p>Luxury streetwear, curated. Essentials, Bape, Chrome Hearts, Polo Ralph Lauren and Canada Goose.</p></div>' +
      '<div><h4>Shop</h4><ul><li><a href="shop.html">All Products</a></li>' + shop + '</ul></div>' +
      '<div><h4>Help</h4><ul><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li><li><a href="cart.html">Cart</a></li><li><a href="about.html">About Us</a></li></ul></div>' +
      '<div><h4>Follow</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">TikTok</a></li><li><a href="#">X / Twitter</a></li><li><a href="#">YouTube</a></li></ul></div>' +
      '</div><div class="legal"><span>&copy; ' + new Date().getFullYear() + ' Zenin.fit. All rights reserved.</span><span><a href="#">Privacy</a> &nbsp;&middot;&nbsp; <a href="#">Terms</a> &nbsp;&middot;&nbsp; <a href="#">Cookies</a></span></div>' +
      '<p class="disclaimer">All brand names and trademarks are the property of their respective owners.</p></div></footer>';
  }
  function overlaysHTML() {
    var links = '<a href="index.html">Home</a><a href="shop.html">Shop All</a>' +
      BRANDS.map(function (b) { return '<a class="sub" href="' + b.slug + '.html">' + esc(b.name) + '</a>'; }).join('') +
      '<a href="about.html">About</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a><a href="cart.html">Cart</a>';
    return '<div class="scrim" data-close></div>' +
      '<aside class="mobile-menu" id="menuPanel" aria-label="Menu"><button class="x" data-close aria-label="Close menu">Close</button>' + links + '</aside>' +
      '<div class="search-ov" id="searchPanel" role="dialog" aria-label="Search"><div class="wrap"><button class="x" data-close>Close</button>' +
      '<input type="search" id="searchInput" placeholder="Search products, brands, colors" autocomplete="off"><div id="searchResults" class="search-results"></div></div></div>' +
      '<aside class="drawer" id="drawer" aria-label="Cart"><div class="drawer-head"><h3>Your Cart</h3><button class="x" data-close>Close</button></div>' +
      '<div class="drawer-body" id="drawerBody"></div><div class="drawer-foot" id="drawerFoot"></div></aside>' +
      '<div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-box" id="modalBox"></div></div>' +
      '<div class="toast" id="toast" role="status"></div>';
  }

  function renderLayout() {
    var h = $('#site-header'), f = $('#site-footer');
    if (h) h.innerHTML = headerHTML();
    if (f) f.innerHTML = footerHTML();
    var ov = document.createElement('div'); ov.id = 'overlays'; ov.innerHTML = overlaysHTML();
    document.body.appendChild(ov);
  }

  /* ---------------------------------------------------------------
     OVERLAY CONTROLS
     --------------------------------------------------------------- */
  function openPanel(name) {
    closeAll();
    var el = name === 'menu' ? $('#menuPanel') : name === 'search' ? $('#searchPanel') : name === 'drawer' ? $('#drawer') : null;
    if (!el) return;
    el.classList.add('open');
    document.body.classList.add('lock');
    var sc = $('.scrim'); if (sc && name !== 'search') sc.classList.add('open');
    if (name === 'search') { var i = $('#searchInput'); if (i) { i.value = ''; renderSearch(''); setTimeout(function () { i.focus(); }, 30); } }
  }
  function closeAll() {
    $$('.mobile-menu,.search-ov,.drawer,.scrim,.modal,.filters').forEach(function (e) { e.classList.remove('open'); });
    document.body.classList.remove('lock');
  }
  function openModal(html) {
    closeAll();
    $('#modalBox').innerHTML = html + '<button class="btn solid" data-close>Close</button>';
    $('#modal').classList.add('open');
    document.body.classList.add('lock');
  }
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  /* ---------------------------------------------------------------
     SEARCH
     --------------------------------------------------------------- */
  function renderSearch(q) {
    var box = $('#searchResults'); if (!box) return;
    q = q.trim().toLowerCase();
    if (!q) { box.innerHTML = '<p class="muted">Start typing to search all products.</p>'; return; }
    var terms = q.split(/\s+/);
    var hits = PRODUCTS.filter(function (p) {
      var hay = (p.name + ' ' + brandBySlug(p.brand).name + ' ' + catByKey(p.category).label + ' ' + catByKey(p.category).plural + ' ' + p.colors.map(function (c) { return c.name; }).join(' ')).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) > -1; });
    }).slice(0, 8);
    if (!hits.length) { box.innerHTML = '<p class="muted">No products found for &ldquo;' + esc(q) + '&rdquo;.</p>'; return; }
    box.innerHTML = hits.map(function (p) {
      return '<a class="sr" href="product.html?id=' + p.id + '"><span class="sr-img">' + imgHtml(p, p.colors[0]) + '</span><span><b>' + esc(p.name) + '</b><small>' + esc(brandBySlug(p.brand).name) + ' &middot; ' + esc(catByKey(p.category).label) + '</small></span><span class="sr-r">' + money(p.price) + stockLabel(productStatus(p)) + '</span></a>';
    }).join('');
  }

  /* ---------------------------------------------------------------
     CART UI (drawer + cart page)
     --------------------------------------------------------------- */
  function qtyControls(d, size) {
    var atMax = d.it.qty >= d.stock;
    return '<div class="qty ' + (size || '') + '"><button data-cart="dec" data-i="' + d.i + '" aria-label="Decrease quantity">&minus;</button><span>' + d.it.qty + '</span><button data-cart="inc" data-i="' + d.i + '" aria-label="Increase quantity"' + (atMax ? ' disabled' : '') + '>+</button></div>' +
      (atMax ? '<small class="max-note">Max available (' + d.stock + ')</small>' : '');
  }
  function renderDrawer() {
    var body = $('#drawerBody'), foot = $('#drawerFoot'); if (!body) return;
    var items = cartDetailed();
    if (!items.length) {
      body.innerHTML = '<p class="muted pad">Your cart is empty.</p>';
      foot.innerHTML = '<a class="btn solid block" href="shop.html">Continue Shopping</a>';
      return;
    }
    body.innerHTML = items.map(function (d) {
      return '<div class="d-item"><a class="d-img" href="product.html?id=' + d.p.id + '&color=' + encodeURIComponent(d.c.name) + '">' + imgHtml(d.p, d.c) + '</a>' +
        '<div class="d-info"><b>' + esc(d.p.name) + '</b><small>' + esc(d.c.name) + ' / ' + esc(d.it.size) + '</small>' + qtyControls(d, 'sm') + '</div>' +
        '<div class="d-right"><span>' + money(d.line) + '</span><button class="rm" data-cart="rm" data-i="' + d.i + '">Remove</button></div></div>';
    }).join('');
    var t = cartTotals();
    foot.innerHTML = '<div class="row"><span>Subtotal</span><b>' + money(t.subtotal) + '</b></div><p class="muted small">Shipping and taxes calculated at checkout.</p>' +
      '<a class="btn solid block" href="cart.html">View Cart &amp; Checkout</a>';
  }
  function renderCartBody() {
    var box = $('#cartBody'); if (!box) return;
    var items = cartDetailed();
    if (!items.length) {
      box.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p class="muted">Looks like you have not added anything yet.</p><a class="btn solid" href="shop.html">Start Shopping</a></div>';
      return;
    }
    var t = cartTotals();
    var left = Math.max(0, CFG.freeShippingThreshold - t.after);
    var pct = Math.min(100, Math.round((t.after / CFG.freeShippingThreshold) * 100));
    var lines = items.map(function (d) {
      return '<div class="c-item"><a class="c-img" href="product.html?id=' + d.p.id + '&color=' + encodeURIComponent(d.c.name) + '">' + imgHtml(d.p, d.c) + '</a>' +
        '<div class="c-info"><small class="muted">' + esc(brandBySlug(d.p.brand).name) + '</small><h3><a href="product.html?id=' + d.p.id + '&color=' + encodeURIComponent(d.c.name) + '">' + esc(d.p.name) + '</a></h3>' +
        '<p class="muted small">Color: ' + esc(d.c.name) + ' &middot; Size: ' + esc(d.it.size) + '</p>' + stockLabel(sizeStatus(d.stock)) + '</div>' +
        '<div class="c-qty">' + qtyControls(d) + '</div>' +
        '<div class="c-price"><b>' + money(d.line) + '</b><small class="muted">' + money(d.p.price) + ' each</small><button class="rm" data-cart="rm" data-i="' + d.i + '">Remove</button></div></div>';
    }).join('');
    box.innerHTML = '<div class="cart-grid"><div class="cart-lines">' + lines + '</div>' +
      '<aside class="summary"><h3>Order Summary</h3>' +
      '<div class="ship-bar"><p class="small">' + (left > 0 ? 'Add <b>' + money(left) + '</b> more for free shipping' : 'You have unlocked free shipping') + '</p><div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="row"><span>Subtotal</span><span>' + money(t.subtotal) + '</span></div>' +
      (t.discount ? '<div class="row"><span>Discount (' + esc(promo.code) + ')</span><span>&minus;' + money(t.discount) + '</span></div>' : '') +
      '<div class="row"><span>Shipping</span><span>' + (t.shipping ? money(t.shipping) : 'Free') + '</span></div>' +
      '<div class="row total"><span>Total</span><span>' + money(t.total) + '</span></div>' +
      '<form class="promo" id="promoForm"><input type="text" id="promoInput" placeholder="Promo code" aria-label="Promo code"><button type="submit">Apply</button></form><p class="form-msg" id="promoMsg" role="status"></p>' +
      '<button class="btn solid block" id="checkoutBtn">Checkout</button><p class="muted small center">Taxes calculated at checkout.</p></aside></div>';
  }
  function refreshCart() {
    $$('[data-cart-count]').forEach(function (e) { e.textContent = cartCount(); });
    renderDrawer();
    renderCartBody();
    if (typeof window.__onCartChange === 'function') window.__onCartChange();
  }

  /* ---------------------------------------------------------------
     PRODUCT CARD
     --------------------------------------------------------------- */
  function productCard(p) {
    var st = productStatus(p);
    var c0 = p.colors.filter(function (c) { return colorStatus(c) !== 'out'; })[0] || p.colors[0];
    var badge = st === 'out' ? '<span class="badge out">Sold Out</span>' : p.isNew ? '<span class="badge">New</span>' : '';
    return '<a class="product' + (st === 'out' ? ' is-out' : '') + '" href="product.html?id=' + p.id + '">' +
      '<div class="thumb">' + badge + imgHtml(p, c0) + '<span class="quick">Choose Options</span></div>' +
      '<div class="meta"><div><small>' + esc(brandBySlug(p.brand).name) + '</small><h3>' + esc(p.name) + '</h3>' +
      '<div class="swatches">' + p.colors.map(function (c) { return '<i title="' + esc(c.name) + '" style="background:' + c.hex + '"></i>'; }).join('') + '</div></div>' +
      '<div class="price-col"><span class="price">' + money(p.price) + '</span>' + stockLabel(st) + '</div></div></a>';
  }
  function grid(list) {
    return list.length ? list.map(productCard).join('') : '<p class="muted empty-grid">No products match your selection.</p>';
  }

  /* ---------------------------------------------------------------
     PAGES
     --------------------------------------------------------------- */
  var main;
  var pages = {};

  /* ----- HOME ----- */
  pages.home = function () {
    var bg = $('#homeBrands');
    if (bg) bg.innerHTML = BRANDS.map(function (b, i) {
      return '<a href="' + b.slug + '.html" class="brand"><span class="brand-num">0' + (i + 1) + '</span><span class="brand-arrow">&nearr;</span><div><h3>' + esc(b.name) + '</h3><div class="brand-sub">' + esc(b.tagline) + '</div></div></a>';
    }).join('');
    var hp = $('#homeProducts');
    if (hp) hp.innerHTML = CFG.featuredIds.map(productById).filter(Boolean).map(productCard).join('');
    var rv = $('#homeReviews');
    if (rv) {
      if (!REVIEWS.length) { var sec = $('#reviews'); if (sec) sec.style.display = 'none'; }
      else {
        rv.innerHTML = REVIEWS.map(function (r) {
          return '<div class="review"><div><div class="stars">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</div><p>&ldquo;' + esc(r.text) + '&rdquo;</p></div><div class="who"><b>' + esc(r.name) + '</b><br>' + esc(r.item) + (r.sample ? '<br><span class="sample-tag">Sample</span>' : '') + '</div></div>';
        }).join('');
        var note = $('#reviewNote'); if (note && !REVIEWS.some(function (r) { return r.sample; })) note.style.display = 'none';
      }
    }
    var fq = $('#homeFaq');
    if (fq) fq.innerHTML = FAQS.slice(0, 5).map(function (f, i) { return faqItem(f, i === 0); }).join('');
  };

  function faqItem(f, open) {
    return '<details' + (open ? ' open' : '') + '><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
  }

  /* ----- SHOP ----- */
  pages.shop = function () {
    var params = new URLSearchParams(location.search);
    function setFrom(k) { var v = params.get(k); return v ? v.split(',') : []; }
    var st = { brand: setFrom('brand'), category: setFrom('category'), color: setFrom('color'), size: setFrom('size'), price: params.get('price') || '', inStock: params.get('instock') === '1', sort: params.get('sort') || 'featured', q: (params.get('q') || '').toLowerCase() };

    var colorMap = {};
    PRODUCTS.forEach(function (p) { p.colors.forEach(function (c) { colorMap[c.name] = c.hex; }); });
    var colorNames = Object.keys(colorMap).sort();
    var priceBands = [['', 'Any price'], ['0-200', 'Under $200'], ['200-500', '$200 to $500'], ['500-1000', '$500 to $1,000'], ['1000-99999', '$1,000 and over']];

    function chk(group, val, label, extra) {
      var on = st[group].indexOf(val) > -1 ? ' checked' : '';
      return '<label class="chk"><input type="checkbox" data-f="' + group + '" value="' + esc(val) + '"' + on + '><span>' + (extra || '') + esc(label) + '</span></label>';
    }
    var filters = '<div class="f-head"><h3>Filters</h3><button class="link-btn" id="clearAll">Clear all</button><button class="x f-close" data-close>Close</button></div>' +
      '<div class="f-group"><h4>Brand</h4>' + BRANDS.map(function (b) { return chk('brand', b.slug, b.name); }).join('') + '</div>' +
      '<div class="f-group"><h4>Category</h4>' + CATEGORIES.map(function (c) { return chk('category', c.key, c.plural); }).join('') + '</div>' +
      '<div class="f-group"><h4>Color</h4>' + colorNames.map(function (n) { return chk('color', n, n, '<i class="dot" style="background:' + colorMap[n] + '"></i>'); }).join('') + '</div>' +
      '<div class="f-group"><h4>Size</h4><div class="size-chips">' + CFG.sizes.map(function (s) { return '<label class="chip-chk"><input type="checkbox" data-f="size" value="' + s + '"' + (st.size.indexOf(s) > -1 ? ' checked' : '') + '><span>' + s + '</span></label>'; }).join('') + '</div></div>' +
      '<div class="f-group"><h4>Price</h4>' + priceBands.map(function (b) { return '<label class="chk"><input type="radio" name="price" data-f="price" value="' + b[0] + '"' + (st.price === b[0] ? ' checked' : '') + '><span>' + b[1] + '</span></label>'; }).join('') + '</div>' +
      '<div class="f-group"><h4>Availability</h4><label class="chk"><input type="checkbox" data-f="instock"' + (st.inStock ? ' checked' : '') + '><span>In stock only</span></label></div>';

    main.innerHTML = '<section class="page-head"><div class="wrap"><nav class="crumbs"><a href="index.html">Home</a><span>/</span>Shop</nav><h1>Shop All</h1><p class="muted">Every brand. Every category. Real-time stock on every size.</p></div></section>' +
      '<section class="shop"><div class="wrap shop-layout"><aside class="filters" id="filters">' + filters + '</aside>' +
      '<div class="shop-main"><div class="shop-bar"><span id="count" class="muted"></span><button class="btn small only-m" id="openFilters">Filters</button>' +
      '<label class="sort">Sort <select id="sort"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name">Name: A to Z</option></select></label></div>' +
      '<div class="chips" id="chips"></div><div class="products" id="shopGrid"></div></div></div></section>';
    $('#sort').value = st.sort;

    function inBand(p) {
      if (!st.price) return true;
      var b = st.price.split('-').map(Number); return p.price >= b[0] && p.price < b[1];
    }
    function matches(p) {
      if (st.brand.length && st.brand.indexOf(p.brand) < 0) return false;
      if (st.category.length && st.category.indexOf(p.category) < 0) return false;
      if (st.color.length && !p.colors.some(function (c) { return st.color.indexOf(c.name) > -1; })) return false;
      if (st.size.length && !p.colors.some(function (c) { return (!st.color.length || st.color.indexOf(c.name) > -1) && st.size.some(function (s) { return c.stock[s] > 0; }); })) return false;
      if (!inBand(p)) return false;
      if (st.inStock && productStatus(p) === 'out') return false;
      if (st.q) {
        var hay = (p.name + ' ' + brandBySlug(p.brand).name + ' ' + catByKey(p.category).label).toLowerCase();
        if (!st.q.split(/\s+/).every(function (t) { return hay.indexOf(t) > -1; })) return false;
      }
      return true;
    }
    function sorted(list) {
      var l = list.slice();
      if (st.sort === 'price-asc') l.sort(function (a, b) { return a.price - b.price; });
      else if (st.sort === 'price-desc') l.sort(function (a, b) { return b.price - a.price; });
      else if (st.sort === 'name') l.sort(function (a, b) { return a.name.localeCompare(b.name); });
      else if (st.sort === 'newest') l.sort(function (a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
      return l;
    }
    function chipsHTML() {
      var c = [];
      st.brand.forEach(function (v) { c.push(['brand', v, brandBySlug(v) ? brandBySlug(v).name : v]); });
      st.category.forEach(function (v) { c.push(['category', v, catByKey(v) ? catByKey(v).plural : v]); });
      st.color.forEach(function (v) { c.push(['color', v, v]); });
      st.size.forEach(function (v) { c.push(['size', v, 'Size ' + v]); });
      if (st.price) c.push(['price', st.price, priceBands.filter(function (b) { return b[0] === st.price; })[0][1]]);
      if (st.inStock) c.push(['instock', '1', 'In stock only']);
      if (st.q) c.push(['q', st.q, '"' + st.q + '"']);
      return c.map(function (x) { return '<button class="chip" data-chip="' + x[0] + '" data-val="' + esc(x[1]) + '">' + esc(x[2]) + ' &times;</button>'; }).join('');
    }
    function update() {
      var list = sorted(PRODUCTS.filter(matches));
      $('#shopGrid').innerHTML = grid(list);
      $('#count').textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
      $('#chips').innerHTML = chipsHTML();
    }
    update();

    var panel = $('#filters');
    panel.addEventListener('change', function (e) {
      var t = e.target, f = t.getAttribute('data-f'); if (!f) return;
      if (f === 'price') st.price = t.value;
      else if (f === 'instock') st.inStock = t.checked;
      else { var i = st[f].indexOf(t.value); if (t.checked && i < 0) st[f].push(t.value); if (!t.checked && i > -1) st[f].splice(i, 1); }
      update();
    });
    $('#sort').addEventListener('change', function (e) { st.sort = e.target.value; update(); });
    function clearAll() {
      st.brand = []; st.category = []; st.color = []; st.size = []; st.price = ''; st.inStock = false; st.q = '';
      $$('input', panel).forEach(function (i) { if (i.type === 'radio') i.checked = i.value === ''; else i.checked = false; });
      update();
    }
    $('#clearAll').addEventListener('click', clearAll);
    $('#chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-chip]'); if (!b) return;
      var f = b.getAttribute('data-chip'), v = b.getAttribute('data-val');
      if (f === 'price') { st.price = ''; var r = $('input[name=price][value=""]', panel); if (r) r.checked = true; }
      else if (f === 'instock') { st.inStock = false; var c = $('input[data-f=instock]', panel); if (c) c.checked = false; }
      else if (f === 'q') st.q = '';
      else { st[f].splice(st[f].indexOf(v), 1); $$('input[data-f=' + f + ']', panel).forEach(function (i) { if (i.value === v) i.checked = false; }); }
      update();
    });
    $('#openFilters').addEventListener('click', function () { panel.classList.add('open'); document.body.classList.add('lock'); });
  };

  /* ----- BRAND COLLECTION ----- */
  pages.brand = function () {
    var b = brandBySlug(document.body.getAttribute('data-brand'));
    if (!b) { main.innerHTML = '<div class="wrap pad-lg"><h1>Brand not found</h1><a class="btn" href="shop.html">Shop all</a></div>'; return; }
    var items = PRODUCTS.filter(function (p) { return p.brand === b.slug; });
    var active = new URLSearchParams(location.search).get('category') || 'all';
    var tabs = '<button class="tab' + (active === 'all' ? ' on' : '') + '" data-cat="all">All</button>' + CATEGORIES.map(function (c) { return '<button class="tab' + (active === c.key ? ' on' : '') + '" data-cat="' + c.key + '">' + c.label + '</button>'; }).join('');
    var others = BRANDS.filter(function (x) { return x.slug !== b.slug; }).map(function (x) { return '<a href="' + x.slug + '.html" class="brand"><div><h3>' + esc(x.name) + '</h3><div class="brand-sub">' + esc(x.tagline) + '</div></div><span class="brand-arrow">&nearr;</span></a>'; }).join('');
    main.innerHTML = '<section class="page-head brand-hero"><div class="wrap"><nav class="crumbs"><a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span>' + esc(b.name) + '</nav>' +
      '<span class="eyebrow">Collection</span><h1>' + esc(b.name) + '</h1><p class="lead">' + esc(b.description) + '</p></div></section>' +
      '<section class="coll"><div class="wrap"><div class="tabs" role="tablist">' + tabs + '</div><p class="muted count" id="bCount"></p><div class="products" id="bGrid"></div></div></section>' +
      '<section class="story"><div class="wrap story-grid"><div><span class="eyebrow">About ' + esc(b.name) + '</span><h2>' + esc(b.tagline) + '</h2></div><p>' + esc(b.story) + '</p></div></section>' +
      '<section class="more"><div class="wrap"><div class="head"><div><span class="eyebrow">Keep exploring</span><h2>Shop Other Brands</h2></div></div><div class="brands four">' + others + '</div></div></section>';
    function show(cat) {
      var l = items.filter(function (p) { return cat === 'all' || p.category === cat; });
      $('#bGrid').innerHTML = grid(l);
      $('#bCount').textContent = l.length + ' product' + (l.length === 1 ? '' : 's');
      $$('.tab').forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-cat') === cat); });
    }
    show(active);
    $('.tabs').addEventListener('click', function (e) { var t = e.target.closest('.tab'); if (t) show(t.getAttribute('data-cat')); });
  };

  /* ----- PRODUCT ----- */
  pages.product = function () {
    var params = new URLSearchParams(location.search);
    var p = productById(params.get('id'));
    if (!p) { main.innerHTML = '<section class="page-head"><div class="wrap"><h1>Product not found</h1><p class="muted">That product does not exist or is no longer available.</p><a class="btn solid" href="shop.html">Back to Shop</a></div></section>'; return; }
    document.title = p.name + ' | Zenin.fit';
    var b = brandBySlug(p.brand), cat = catByKey(p.category);
    var startColor = colorOf(p, params.get('color')) || p.colors.filter(function (c) { return colorStatus(c) !== 'out'; })[0] || p.colors[0];
    var state = { color: startColor.name, size: null, qty: 1 };

    main.innerHTML = '<div class="wrap"><nav class="crumbs pdp-crumbs"><a href="index.html">Home</a><span>/</span><a href="' + b.slug + '.html">' + esc(b.name) + '</a><span>/</span>' + esc(p.name) + '</nav></div>' +
      '<section class="pdp"><div class="wrap pdp-grid" id="buy"></div></section>' +
      '<section class="pdp-details"><div class="wrap narrow">' +
      '<details open><summary>Description</summary><p>' + esc(p.description) + '</p></details>' +
      '<details><summary>Features</summary><ul class="bul">' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></details>' +
      '<details><summary>Material Information</summary><p>' + esc(p.materials) + '</p></details>' +
      '<details id="fitDetails"><summary>Fit Information</summary><p>' + esc(p.fit) + '</p></details>' +
      '<details><summary>Care Instructions</summary><ul class="bul">' + p.care.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></details>' +
      '<details><summary>Shipping &amp; Returns</summary><p>Orders over ' + money(CFG.freeShippingThreshold) + ' ship free. Unworn items with tags can be returned within 14 days of delivery. See our <a href="faq.html">FAQ</a> for details.</p></details>' +
      '</div></section>' +
      '<section class="more"><div class="wrap"><div class="head"><div><span class="eyebrow">More from ' + esc(b.name) + '</span><h2>You May Also Like</h2></div></div><div class="products">' +
      PRODUCTS.filter(function (x) { return x.brand === p.brand && x.id !== p.id; }).map(productCard).join('') + '</div></div></section>';

    var buy = $('#buy');
    var msg = { text: '', ok: true };

    function draw() {
      var c = colorOf(p, state.color);
      var stock = state.size ? c.stock[state.size] : 0;
      var inCart = state.size ? cartQty(p.id, c.name, state.size) : 0;
      var room = state.size ? Math.max(0, stock - inCart) : 0;
      if (state.qty > Math.max(1, room)) state.qty = Math.max(1, room);
      var status;
      if (state.size) {
        var s = sizeStatus(stock);
        status = stockLabel(s, s === 'low' ? 'Only ' + stock + ' left' : '') + (inCart ? '<span class="in-cart">' + inCart + ' in your cart</span>' : '');
      } else status = stockLabel(colorStatus(c)) + '<span class="in-cart">Select a size to see availability</span>';
      var canAdd = state.size && room > 0;
      var addText = !state.size ? 'Select a Size' : stock <= 0 ? 'Out of Stock' : room <= 0 ? 'Maximum in Cart' : 'Add to Cart';

      var thumbs = p.colors.map(function (col) {
        return '<button class="thumb-btn' + (col.name === state.color ? ' on' : '') + '" data-color="' + esc(col.name) + '" aria-label="' + esc(col.name) + '">' + imgHtml(p, col) + '</button>';
      }).join('');
      var swatches = p.colors.map(function (col) {
        var out = colorStatus(col) === 'out';
        return '<button class="sw' + (col.name === state.color ? ' on' : '') + (out ? ' out' : '') + '" data-color="' + esc(col.name) + '" title="' + esc(col.name) + (out ? ' (sold out)' : '') + '" aria-label="' + esc(col.name) + (out ? ' sold out' : '') + '"><i style="background:' + col.hex + '"></i></button>';
      }).join('');
      var sizes = CFG.sizes.map(function (s) {
        var q = c.stock[s], ss = sizeStatus(q);
        return '<button class="size ' + ss + (state.size === s ? ' on' : '') + '" data-size="' + s + '"' + (q <= 0 ? ' disabled' : '') + '><b>' + s + '</b>' + (ss === 'out' ? '<small>Sold out</small>' : ss === 'low' ? '<small>' + q + ' left</small>' : '') + '</button>';
      }).join('');

      buy.innerHTML = '<div class="pdp-gallery"><div class="pdp-main">' + imgHtml(p, c) + (c.image ? '' : '<span class="ph-note">Image placeholder</span>') + '</div><div class="pdp-thumbs">' + thumbs + '</div></div>' +
        '<div class="pdp-info"><span class="eyebrow">' + esc(b.name) + ' &middot; ' + esc(cat.label) + '</span><h1>' + esc(p.name) + '</h1>' +
        '<div class="pdp-price">' + money(p.price) + '</div><p class="lead">' + esc(p.description) + '</p>' +
        '<div class="opt"><div class="opt-label">Color <b>' + esc(c.name) + '</b></div><div class="swatch-row">' + swatches + '</div></div>' +
        '<div class="opt"><div class="opt-label">Size <a href="#fitDetails" id="fitLink" class="size-guide">Fit information</a></div><div class="size-row">' + sizes + '</div></div>' +
        '<div class="stock-line">' + status + '</div>' +
        '<div class="buy-row"><div class="qty"><button data-q="-1" aria-label="Decrease quantity"' + (state.qty <= 1 ? ' disabled' : '') + '>&minus;</button><span>' + state.qty + '</span><button data-q="1" aria-label="Increase quantity"' + (state.qty >= room ? ' disabled' : '') + '>+</button></div>' +
        '<button class="btn solid add" data-add' + (canAdd ? '' : ' disabled') + '>' + addText + '</button></div>' +
        '<p class="msg ' + (msg.ok ? 'ok' : 'bad') + '" role="status">' + esc(msg.text) + '</p>' +
        '<ul class="perks"><li>Free shipping over ' + money(CFG.freeShippingThreshold) + '</li><li>14-day returns on unworn items</li></ul></div>';
    }
    draw();

    buy.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-color]'))) {
        state.color = t.getAttribute('data-color'); state.size = null; state.qty = 1; msg = { text: '', ok: true };
        try { history.replaceState(null, '', '?id=' + p.id + '&color=' + encodeURIComponent(state.color)); } catch (x) { /* ignore */ }
        draw();
      } else if ((t = e.target.closest('[data-size]'))) {
        state.size = t.getAttribute('data-size'); state.qty = 1; msg = { text: '', ok: true }; draw();
      } else if ((t = e.target.closest('[data-q]'))) {
        state.qty += parseInt(t.getAttribute('data-q'), 10); if (state.qty < 1) state.qty = 1; draw();
      } else if (e.target.closest('[data-add]')) {
        if (!state.size) { msg = { text: 'Please select a size.', ok: false }; draw(); return; }
        var r = addToCart(p.id, state.color, state.size, state.qty);
        msg = { text: r.msg, ok: r.ok };
        if (r.ok) { state.qty = 1; refreshCart(); draw(); openPanel('drawer'); } else draw();
      } else if (e.target.closest('#fitLink')) {
        e.preventDefault(); var d = $('#fitDetails'); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    window.__onCartChange = function () { draw(); };
  };

  /* ----- CART ----- */
  pages.cart = function () {
    main.innerHTML = '<section class="page-head"><div class="wrap"><nav class="crumbs"><a href="index.html">Home</a><span>/</span>Cart</nav><h1>Your Cart</h1></div></section><section class="cart-sec"><div class="wrap" id="cartBody"></div></section>';
    renderCartBody();
    main.addEventListener('submit', function (e) {
      if (e.target.id !== 'promoForm') return;
      e.preventDefault();
      var code = $('#promoInput').value.trim().toUpperCase();
      var pct = CFG.promoCodes[code];
      if (pct) { promo = { code: code, pct: pct }; renderCartBody(); var m = $('#promoMsg'); if (m) { m.textContent = 'Promo applied.'; m.className = 'form-msg ok'; } }
      else { var m2 = $('#promoMsg'); m2.textContent = code ? 'That code is not valid.' : 'Enter a promo code.'; m2.className = 'form-msg bad'; }
    });
    main.addEventListener('click', function (e) {
      if (!e.target.closest('#checkoutBtn')) return;
      if (cartSanitize()) { refreshCart(); toast('Some quantities were adjusted to match available stock.'); return; }
      var t = cartTotals();
      openModal('<h3>Checkout is not connected yet</h3><p class="muted">Your cart is valid and within available stock (total ' + money(t.total) + '). Connect a payment provider such as Stripe or Shopify to take payment.</p>');
    });
  };

  /* ----- FAQ ----- */
  pages.faq = function () {
    var cats = []; FAQS.forEach(function (f) { if (cats.indexOf(f.cat) < 0) cats.push(f.cat); });
    var list = $('#faqList');
    function draw(q) {
      q = (q || '').toLowerCase().trim();
      var html = '';
      cats.forEach(function (c) {
        var items = FAQS.filter(function (f) { return f.cat === c && (!q || (f.q + ' ' + f.a).toLowerCase().indexOf(q) > -1); });
        if (items.length) html += '<h3 class="faq-cat">' + esc(c) + '</h3>' + items.map(function (f) { return faqItem(f, false); }).join('');
      });
      list.innerHTML = html || '<p class="muted">No questions match your search. <a href="contact.html" class="link">Contact us</a>.</p>';
    }
    draw('');
    $('#faqSearch').addEventListener('input', function (e) { draw(e.target.value); });
  };

  /* ----- CONTACT ----- */
  pages.contact = function () {
    var form = $('#contactForm'); if (!form) return;
    var mail = $('#contactEmail'); if (mail) { mail.textContent = CFG.contactEmail; mail.href = 'mailto:' + CFG.contactEmail; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      function check(id, test, msg) {
        var el = $('#' + id), err = $('#' + id + 'Err');
        var good = test(el.value.trim());
        err.textContent = good ? '' : msg; el.classList.toggle('invalid', !good);
        if (!good) ok = false;
      }
      check('cName', function (v) { return v.length > 1; }, 'Please enter your name.');
      check('cEmail', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, 'Please enter a valid email.');
      check('cTopic', function (v) { return v !== ''; }, 'Please choose a topic.');
      check('cMsg', function (v) { return v.length >= 10; }, 'Please write at least 10 characters.');
      var out = $('#contactMsg');
      if (!ok) { out.textContent = 'Please fix the highlighted fields.'; out.className = 'form-msg bad'; return; }
      out.textContent = 'Thank you. Your message has been received and we will reply soon.';
      out.className = 'form-msg ok'; form.reset();
    });
  };

  pages.about = function () { /* static page */ };

  /* ---------------------------------------------------------------
     GLOBAL EVENTS
     --------------------------------------------------------------- */
  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-open]'))) { openPanel(t.getAttribute('data-open')); return; }
      if (e.target.closest('[data-close]') || e.target.classList.contains('scrim')) { closeAll(); return; }
      if ((t = e.target.closest('.dd-btn'))) {
        var li = t.parentNode, open = li.classList.toggle('open'); t.setAttribute('aria-expanded', open); return;
      }
      if (!e.target.closest('.has-dd')) $$('.has-dd.open').forEach(function (x) { x.classList.remove('open'); });
      if ((t = e.target.closest('[data-cart]'))) {
        var i = parseInt(t.getAttribute('data-i'), 10), act = t.getAttribute('data-cart'), it = cart[i]; if (!it) return;
        var r;
        if (act === 'inc') r = cartSetQty(i, it.qty + 1);
        else if (act === 'dec') r = cartSetQty(i, it.qty - 1);
        else r = cartSetQty(i, 0);
        if (r && r.msg) toast(r.msg);
        refreshCart();
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    document.addEventListener('input', function (e) { if (e.target.id === 'searchInput') renderSearch(e.target.value); });
    document.addEventListener('submit', function (e) {
      if (!e.target.classList.contains('news-form')) return;
      e.preventDefault();
      var inp = $('input', e.target), m = $('#newsMsg');
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) { m.textContent = 'Thanks for subscribing.'; m.className = 'form-msg ok'; inp.value = ''; }
      else { m.textContent = 'Please enter a valid email address.'; m.className = 'form-msg bad'; }
    });
    window.addEventListener('storage', function (e) { if (e.key === CART_KEY) { cartLoad(); refreshCart(); } });
  }

  /* ---------------------------------------------------------------
     INIT
     --------------------------------------------------------------- */
  function init() {
    cartLoad();
    renderLayout();
    main = $('#main');
    var page = document.body.getAttribute('data-page');
    if (pages[page]) pages[page]();
    bindGlobal();
    refreshCart();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
