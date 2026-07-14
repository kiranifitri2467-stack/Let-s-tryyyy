/* =========================================================
   LILY OF LIES — GIFT & LETTER STUDIO
   app.js — vanilla JS, no framework, no external deps
========================================================= */
(function(){
"use strict";

/* ---------------------------------------------------------
   0. CONSTANTS & DUMMY DATA
--------------------------------------------------------- */
const WA_NUMBER = "6281220505562"; // nomor WhatsApp admin (dummy)
const SHIPPING_COST = 10000;
const LOW_STOCK_THRESHOLD = 3;
const CATEGORY_LABELS = {
  stationery:"Stationery", hiasan:"Hiasan", blindbox:"Blind Box", buket:"Buket", letter:"Letter & Keepsakes"
};
const VOUCHERS = {
  "LILY10": { type:"percent", value:10, label:"Diskon 10%" },
  "NEWMEMORY": { type:"flat", value:15000, label:"Potongan Rp15.000" },
  "LOLANNIVE2": { type:"percent", value:50, label:"Diskon 50%"}
};

const DEFAULT_PRODUCTS = [
  { id:1, name:"Notebook Vintage Rose", category:"stationery", price:45000, stock:15, icon:"📓", image:"image/notebook-vintage-rose.jpg",
    desc:"Notebook bersampul vintage bermotif mawar dengan kertas dot-grid lembut, cocok untuk journaling harian atau mencatat ide-ide manis." },
  { id:2, name:"Pulpen Gel Pastel Set (5pcs)", category:"stationery", price:35000, stock:20, icon:"🖊️", image:"image/cat-stationery.svg",
    desc:"Satu set berisi 5 pulpen gel warna pastel lembut dengan tinta halus dan tahan lama, teman setia menulis surat maupun tugas harian." },
  { id:3, name:"Pembatas Buku Bunga Kering", category:"stationery", price:15000, stock:0, icon:"🔖", image:"image/cat-stationery.svg",
    desc:"Pembatas buku laminasi berisi bunga kering asli — unik, estetik, dan tak ada satupun yang sama persis." },
  { id:4, name:"Sticker Pack Aesthetic Diary", category:"stationery", price:18000, stock:30, icon:"✨", image:"image/cat-stationery.svg",
    desc:"Kumpulan stiker aesthetic bertema bunga dan bintang untuk mempercantik diary, planner, maupun laptop kesayanganmu." },
  { id:5, name:"Planner Mingguan Dreamy", category:"stationery", price:52000, stock:2, icon:"🗒️", image:"image/cat-stationery.svg",
    desc:"Planner mingguan dengan ilustrasi dreamy pastel, membantu menyusun jadwal sekaligus jadi teman semangat sepanjang minggu." },
  { id:6, name:"Lampu Tidur Bulan Mini", category:"hiasan", price:85000, stock:10, icon:"🌙", image:"image/cat-hiasan.svg",
    desc:"Lampu tidur meja berbentuk bulan sabit dengan cahaya hangat yang menenangkan, cocok menemani malam-malam tenangmu." },
  { id:7, name:"Lampu Gantung String Fairy Lights", category:"hiasan", price:60000, stock:12, icon:"🪔", image:"image/cat-hiasan.svg",
    desc:"Lampu gantung LED berbentuk untaian bintang, mudah dipasang untuk mempercantik dinding kamar maupun area belajar." },
  { id:8, name:"Keychain Bunga Resin", category:"hiasan", price:22000, stock:25, icon:"🔑", image:"image/cat-hiasan.svg",
    desc:"Gantungan kunci resin bermotif bunga asli yang diawetkan — cantik, ringan, dan tahan lama dibawa ke mana saja." },
  { id:9, name:"Jam Meja Mini Klasik", category:"hiasan", price:75000, stock:1, icon:"🕰️", image:"image/cat-hiasan.svg",
    desc:"Jam meja mini bergaya klasik elegan, mempercantik meja belajar sekaligus menemani rutinitasmu tetap tepat waktu." },
  { id:10, name:"Cermin Kecil Bingkai Bunga", category:"hiasan", price:40000, stock:8, icon:"🪞", image:"image/cat-hiasan.svg",
    desc:"Cermin kecil dengan bingkai bunga estetik, pas diletakkan di meja rias maupun rak buku sebagai sentuhan manis." },
  // Blind Box Fantasy Garden — sekarang punya 2 gambar (gallery)
  { id:11, name:"Blind Box Fantasy Garden", category:"blindbox", price:95000, stock:14, icon:"🌸", image:["image/blind-box-fantasy-garden-1.jpg","image/blind-box-fantasy-garden-2.jpg"],
    desc:"Blind box bertema taman fantasi berisi karakter-karakter imut serba misteri — kejutan menyenangkan di setiap kotaknya." },
  { id:12, name:"Blind Box Cry Baby Series", category:"blindbox", price:98000, stock:0, icon:"😢", image:"image/cat-blindbox.svg",
    desc:"Blind box tema Cry Baby yang ekspresif dan menggemaskan, favorit para kolektor figur unik." },
  { id:13, name:"Blind Box Dark Academia", category:"blindbox", price:98000, stock:9, icon:"📚", image:"image/cat-blindbox.svg",
    desc:"Blind box bertema Dark Academia dengan nuansa klasik misterius, cocok untuk pecinta estetika akademik vintage." },
  { id:14, name:"Blind Box Doll Whisper", category:"blindbox", price:99000, stock:6, icon:"🎎", image:"image/cat-blindbox.svg",
    desc:"Blind box tema boneka misterius dengan desain lembut nan artistik, tiap seri membawa ekspresi berbeda." },
  { id:15, name:"Buket Stationery Pastel", category:"buket", price:120000, stock:6, icon:"💐", image:"image/cat-buket.svg",
    desc:"Buket unik berisi rangkaian alat tulis pastel — pulpen, sticky notes, hingga pensil — hadiah anti-mainstream yang tetap berguna." },
  { id:16, name:"Buket Blind Box Surprise", category:"buket", price:150000, stock:5, icon:"🎁", image:"image/cat-buket.svg",
    desc:"Rangkaian buket berisi beberapa blind box mini, memadukan kejutan koleksi dengan keindahan buket hadiah." },
  { id:17, name:"Buket Dry Flower Lavender", category:"buket", price:110000, stock:7, icon:"🌾", image:"image/preserved-flower.jpg",
    desc:"Buket bunga kering lavender yang tahan lama dan wangi lembut, cocok untuk hadiah maupun dekorasi ruangan." },
  { id:18, name:"Jar of Mood", category:"letter", price:48000, stock:11, icon:"🫙", image:"image/cat-letter.svg",
    desc:"Toples berisi puluhan kartu mood harian mungil untuk menemani dan merayakan setiap suasana hatimu." },
  { id:19, name:"Motivation Jar", category:"letter", price:48000, stock:4, icon:"🌟", image:"image/cat-letter.svg",
    desc:"Toples berisi puluhan kartu motivasi harian untuk menyemangati harimu, satu kartu satu semangat baru." },
  { id:20, name:"Secret Letter Box — For Me 10 Years Later", category:"letter", price:55000, stock:3, icon:"✉️", image:"image/cat-letter.svg",
    desc:"Kotak surat rahasia untuk kamu tulis hari ini dan buka kembali sepuluh tahun mendatang — kapsul waktu penuh kenangan." }
];

const UPCOMING_PRODUCTS = [
  { id:"u1", name:"Blind Box Celestial Dreams", category:"blindbox", icon:"🌌", eta:"Agustus 2026",
    desc:"Seri terbaru bertema langit malam penuh bintang, kejutan karakter baru menanti." },
  { id:"u2", name:"Jar of Gratitude", category:"letter", icon:"🍀", eta:"Agustus 2026",
    desc:"Toples kartu rasa syukur harian, teman kecil untuk menumbuhkan hati yang lebih ringan." },
  { id:"u3", name:"Lampu Proyektor Galaxy", category:"hiasan", icon:"🌠", eta:"September 2026",
    desc:"Lampu proyektor efek galaksi berputar, ubah kamar jadi planetarium mini." },
  { id:"u4", name:"Buket Preserved Rose", category:"buket", icon:"🌹", eta:"September 2026",
    desc:"Buket mawar preserved tahan hingga setahun, elegan tanpa perlu perawatan air." }
];

/* ---------------------------------------------------------
   1. STATE (localStorage-backed)
--------------------------------------------------------- */
let PRODUCTS = [];
let cart = [];               // [{id, qty}]
let wishlist = [];           // [productId, ...]
let currentUser = null;      // {name, email, phone, address}
let usersDB = {};             // {email: {name, email, phone, address}}
let isAdmin = false;
let ratingsDB = {};           // {productId: [flowers,...]}
let reviewsDB = {};           // {productId: [{user,text,date,reply}]}
let orders = [];              // [{orderNo, name, email, phone, address, note, method, items, total, date, status}]
let activeCategory = "all";
let checkoutVoucher = null;   // {code, type, value}
let currentModalProductId = null;
// state for modal image indices (per product)
let currentModalImageIndex = {}; // { [productId]: 0 }

/* ---------------------------------------------------------
   0b. FIREBASE (sinkronisasi pesanan lintas perangkat)
--------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyCDt-SaBmlpyLHSvY5mjp7Lf4Dy1QSNGuM",
  authDomain: "lily-of-lies.firebaseapp.com",
  projectId: "lily-of-lies",
  storageBucket: "lily-of-lies.firebasestorage.app",
  messagingSenderId: "830402460993",
  appId: "1:830402460993:web:6ff6d3e76b8329827c75c0"
};
let db = null;
try{
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}catch(e){
  console.error("Firebase gagal diinisialisasi, memakai localStorage saja:", e);
  db = null;
}
let adminOrdersUnsub = null; // untuk hentikan listener saat admin panel ditutup
let productsUnsub = null;
let ratingsUnsub = null;
let reviewsUnsub = null;

function initFirestoreSync(){
  if(!db) return;

  // Sinkron stok produk — real-time ke semua pengunjung
  productsUnsub = db.collection("products").onSnapshot(snapshot=>{
    snapshot.forEach(doc=>{
      const data = doc.data();
      const p = getProduct(Number(doc.id));
      if(p && typeof data.stock === "number"){ p.stock = Math.max(0, data.stock); }
    });
    saveStock();
    renderGrid();
    renderRecommend();
    if(currentModalProductId) renderProductModalBody();
    if(isAdmin && document.getElementById("adminPanel") && !document.getElementById("adminPanel").hidden) renderAdminTable();
  }, err=> console.error("Gagal sinkron stok produk dari server:", err));

  // Sinkron rating — satu dokumen per produk, berisi array nilai
  ratingsUnsub = db.collection("ratings").onSnapshot(snapshot=>{
    const grouped = {};
    snapshot.forEach(doc=>{
      const data = doc.data();
      if(data && Array.isArray(data.values)){
        grouped[doc.id] = data.values.map(v => (v && typeof v === "object") ? v.value : v);
      }
    });
    ratingsDB = grouped;
    saveRatings();
    renderGrid();
    renderRecommend();
    if(currentModalProductId) renderProductModalBody();
  }, err=> console.error("Gagal sinkron rating dari server:", err));

  // Sinkron ulasan — satu dokumen per ulasan (biar admin bisa balas per-item)
  reviewsUnsub = db.collection("reviews").onSnapshot(snapshot=>{
    const grouped = {};
    snapshot.forEach(doc=>{
      const data = doc.data();
      const pid = String(data.productId);
      grouped[pid] = grouped[pid] || [];
      grouped[pid].push({ id: doc.id, user:data.user, text:data.text, date:data.date, reply:data.reply || "" });
    });
    reviewsDB = grouped;
    saveReviews();
    if(currentModalProductId) renderProductModalBody();
    if(isAdmin && document.getElementById("adminPanel") && !document.getElementById("adminPanel").hidden) renderAdminReviews();
  }, err=> console.error("Gagal sinkron ulasan dari server:", err));
}

function loadState(){
  try{
    const savedStock = JSON.parse(localStorage.getItem("lol_stock") || "{}");
    PRODUCTS = DEFAULT_PRODUCTS.map(p => ({ ...p, stock: (savedStock[p.id] !== undefined ? savedStock[p.id] : p.stock) }));
  }catch(e){ PRODUCTS = DEFAULT_PRODUCTS.map(p=>({...p})); }

  try{ cart = JSON.parse(localStorage.getItem("lol_cart") || "[]"); }catch(e){ cart = []; }
  try{ wishlist = JSON.parse(localStorage.getItem("lol_wishlist") || "[]"); }catch(e){ wishlist = []; }
  try{ currentUser = JSON.parse(localStorage.getItem("lol_user") || "null"); }catch(e){ currentUser = null; }
  try{ usersDB = JSON.parse(localStorage.getItem("lol_users") || "{}"); }catch(e){ usersDB = {}; }
  isAdmin = localStorage.getItem("lol_admin_session") === "true";
  try{ ratingsDB = JSON.parse(localStorage.getItem("lol_ratings") || "{}"); }catch(e){ ratingsDB = {}; }
  try{ reviewsDB = JSON.parse(localStorage.getItem("lol_reviews") || "{}"); }catch(e){ reviewsDB = {}; }
  try{ orders = JSON.parse(localStorage.getItem("lol_orders") || "[]"); }catch(e){ orders = []; }
}

function saveStock(){
  const map = {};
  PRODUCTS.forEach(p => map[p.id] = p.stock);
  localStorage.setItem("lol_stock", JSON.stringify(map));
}
function saveCart(){ localStorage.setItem("lol_cart", JSON.stringify(cart)); }
function saveWishlist(){ localStorage.setItem("lol_wishlist", JSON.stringify(wishlist)); }
function saveUser(){ localStorage.setItem("lol_user", JSON.stringify(currentUser)); }
function saveUsers(){ localStorage.setItem("lol_users", JSON.stringify(usersDB)); }
function saveRatings(){ localStorage.setItem("lol_ratings", JSON.stringify(ratingsDB)); }
function saveReviews(){ localStorage.setItem("lol_reviews", JSON.stringify(reviewsDB)); }
function saveOrders(){ localStorage.setItem("lol_orders", JSON.stringify(orders)); }

/* ---------------------------------------------------------
   2. HELPERS
--------------------------------------------------------- */
function formatRupiah(n){
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}
// helper to get product image (supports images[] fallback)
function getProductImage(p, idx = 0){
  if(!p) return "";
  if(Array.isArray(p.images) && p.images.length > 0){
    return p.images[Math.max(0, Math.min(idx, p.images.length - 1))];
  }
  return p.image || (p.images && p.images[0]) || "";
}
function getProduct(id){ return PRODUCTS.find(p => p.id === Number(id)); }
function stockStatus(stock){
  if(stock <= 0) return "out";
  if(stock <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}
function stockLabel(stock){
  if(stock <= 0) return "Stok Habis";
  if(stock <= LOW_STOCK_THRESHOLD) return `Stok Menipis (${stock})`;
  return `Stok Tersedia (${stock})`;
}
function avgRating(id){
  const arr = ratingsDB[id] || [];
  if(!arr.length) return 0;
  return arr.reduce((a,b)=>a+b,0) / arr.length;
}
function flowerRatingStatic(avg){
  let html = '<span class="flower-rating" aria-label="Rating produk">';
  for(let i=1;i<=5;i++){
    html += `<span class="${i <= Math.round(avg) ? "" : "muted"}">✿</span>`;
  }
  html += "</span>";
  return html;
}
function flowerRatingInteractive(id, current){
  let html = `<span class="flower-rating interactive" data-pid="${id}">`;
  for(let i=1;i<=5;i++){
    html += `<button type="button" class="${i<=current?"filled":""}" data-flower="${i}">✿</button>`;
  }
  html += "</span>";
  return html;
}
function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function trackEvent(name, params){
  // DUMMY ANALYTICS — dalam produksi, ini akan terkirim ke Google Analytics sungguhan.
  try{ if(typeof gtag === "function") gtag("event", name, params || {}); }catch(e){}
  console.log("[Analytics:dummy]", name, params || {});
}
function toast(msg, type){
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.textContent = msg;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(()=>{ el.style.opacity = "0"; el.style.transition = "opacity .3s ease"; setTimeout(()=>el.remove(), 320); }, 2600);
}
function openModal(id){ const m = document.getElementById(id); m.hidden = false; document.body.style.overflow = "hidden"; }
function closeModalById(id){
  const m = document.getElementById(id);
  m.hidden = true;
  if(id === "adminPanel" && adminOrdersUnsub){ adminOrdersUnsub(); adminOrdersUnsub = null; }
  if(!anyModalOpen()) document.body.style.overflow = "";
}
function anyModalOpen(){
  return ["productModal","checkoutModal","confirmModal","loginModal","adminPanel"].some(id=>{
    const el = document.getElementById(id); return el && !el.hidden;
  }) || document.getElementById("cartDrawer").classList.contains("open")
    || document.getElementById("wishlistDrawer").classList.contains("open");
}

/* ---------------------------------------------------------
   3. PRODUCT GRID + FILTER + SEARCH
--------------------------------------------------------- */
function getFilteredProducts(){
  const search = document.getElementById("navSearchInput").value.trim().toLowerCase();
  const cat = document.getElementById("filterCategory").value;
  const priceRange = document.getElementById("filterPrice").value;
  const sortBy = document.getElementById("sortBy").value;

  let list = PRODUCTS.filter(p=>{
    if(cat !== "all" && p.category !== cat) return false;
    if(search && !p.name.toLowerCase().includes(search) && !CATEGORY_LABELS[p.category].toLowerCase().includes(search)) return false;
    if(priceRange !== "all"){
      const [min,max] = priceRange.split("-").map(Number);
      if(p.price < min || p.price > max) return false;
    }
    return true;
  });

  switch(sortBy){
    case "price-asc": list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "rating-desc": list.sort((a,b)=>avgRating(b.id)-avgRating(a.id)); break;
    case "name-asc": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: break;
  }
  return list;
}

function productCardHtml(p){
  const status = stockStatus(p.stock);
  const badge = status === "out" ? '<span class="card-badge out">Stok Habis</span>'
              : status === "low" ? `<span class="card-badge low">Sisa ${p.stock}</span>` : "";
  const avg = avgRating(p.id);
  const isWished = wishlist.includes(p.id);
  return `
  <article class="product-card" data-id="${p.id}" tabindex="0">
    <div class="card-media">
      <img class="media-img" src="${getProductImage(p,0)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.remove()">
      ${p.icon}
      ${badge}
      <button class="wishlist-btn ${isWished?"active":""}" data-wish-id="${p.id}" title="${isWished?"Hapus dari wishlist":"Simpan ke wishlist"}">${isWished?"♥":"♡"}</button>
      <div class="card-info-overlay">
        <strong>${escapeHtml(p.name)}</strong>
        <span>${stockLabel(p.stock)}</span>
        <span>${avg ? avg.toFixed(1)+" ✿ rata-rata rating" : "Belum ada rating"}</span>
      </div>
    </div>
    <div class="card-body">
      <span class="card-cat">${CATEGORY_LABELS[p.category]}</span>
      <h3 class="card-name">${escapeHtml(p.name)}</h3>
      <span class="card-flowers">${flowerRatingStatic(avg)} <span style="color:#9a9aa5;font-size:.78rem;">(${(ratingsDB[p.id]||[]).length})</span></span>
      <span class="card-price">${formatRupiah(p.price)}</span>
      <div class="card-actions">
        <button class="btn btn-line btn-detail" data-id="${p.id}">Detail</button>
        <button class="btn btn-primary btn-quickadd" data-id="${p.id}" ${p.stock<=0?"disabled":""}>+ Keranjang</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(){
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const list = getFilteredProducts();
  document.getElementById("resultCount").textContent = `Menampilkan ${list.length} dari ${PRODUCTS.length} produk`;
  if(!list.length){
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = list.map(productCardHtml).join("");
}

function renderRecommend(){
  // Rekomendasi: produk dengan rating tertinggi & masih tersedia, fallback ke produk acak
  const grid = document.getElementById("recommendGrid");
  let pool = PRODUCTS.filter(p=>p.stock>0);
  pool.sort((a,b)=> avgRating(b.id) - avgRating(a.id));
  let picks = pool.slice(0,4);
  if(picks.length < 4){
    const rest = PRODUCTS.filter(p=>!picks.includes(p)).slice(0,4-picks.length);
    picks = picks.concat(rest);
  }
  grid.innerHTML = picks.map(productCardHtml).join("");
}

/* ---------------------------------------------------------
   4b. WISHLIST
--------------------------------------------------------- */
function updateWishlistBadge(){
  document.getElementById("wishlistCount").textContent = wishlist.length;
}

function toggleWishlist(id){
  const idx = wishlist.indexOf(id);
  if(idx > -1){
    wishlist.splice(idx,1);
    toast("Dihapus dari wishlist",
"",
``
