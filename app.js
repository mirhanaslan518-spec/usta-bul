'use strict';
/* ================================================================
   USTABUL — app.js
   Sprint 2 · Tüm uygulama mantığı
   ================================================================ */

/* ----------------------------------------------------------------
   1. SABİTLER — KATEGORİLER (renk her kategoriye özel CSS değişkeni)
   ---------------------------------------------------------------- */
const CATS = [
  { id:'boya',     icon:'🎨', name:'Boya & Badana',  col:'var(--boya-c)', bg:'var(--boya-bg)',
    sub:['İç Cephe Boyama','Dış Cephe Boyama','Ahşap Boyama','Metal Boyama'] },
  { id:'karo',     icon:'⬜', name:'Karo & Seramik', col:'var(--karo-c)', bg:'var(--karo-bg)',
    sub:['Yer Karosu','Duvar Karosu','Mozaik & Dekor'] },
  { id:'elektrik', icon:'⚡', name:'Elektrik',        col:'var(--elec-c)', bg:'var(--elec-bg)',
    sub:['Elektrik Tesisatı','Aydınlatma','Güvenlik Sistemleri','Kombi & Klima'] },
  { id:'tesisat',  icon:'🔧', name:'Su Tesisatı',    col:'var(--tes-c)',  bg:'var(--tes-bg)',
    sub:['Tesisat Kurulumu','Tamir & Bakım','Doğalgaz'] },
  { id:'tadilat',  icon:'🏗️', name:'Tadilat & Yapı', col:'var(--tad-c)',  bg:'var(--tad-bg)',
    sub:['Genel Tadilat','Mutfak Yenileme','Banyo Yenileme','Asma Tavan & Alçıpan'] },
  { id:'temizlik', icon:'🧹', name:'Temizlik',        col:'var(--tem-c)', bg:'var(--tem-bg)',
    sub:['Ev Temizliği','Ofis Temizliği','Derin Temizlik'] },
  { id:'tasima',   icon:'🚚', name:'Taşımacılık',     col:'var(--tas-c)', bg:'var(--tas-bg)',
    sub:['Ev Taşıma','Ofis Taşıma','Parça Taşıma'] },
  { id:'bahce',    icon:'🌿', name:'Bahçe & Peyzaj', col:'var(--bah-c)', bg:'var(--bah-bg)',
    sub:['Peyzaj Düzenleme','Sulama Sistemleri','Ağaç & Çim Bakımı'] },
];

/* Toptan alımda anlamlı olan malzeme kategorileri (alt küme) */
const WHOLESALE_CAT_IDS = ['boya','karo','elektrik','tesisat','tadilat','bahce'];

/* Kategoriye özel "Ek Hizmetler" kontrol listesi (ilan oluştururken) */
const CHECKLISTS = {
  boya:     ['Duvar Boyama','Tavan Boyama','Astar Uygulama','Eski Boya Kazıma','Alçı Tamiri','Dış Cephe İzolasyonu'],
  karo:     ['Zemin Döşeme','Duvar Döşeme','Fugalama','Eski Karo Söküm','Silikon Çekimi'],
  elektrik: ['Priz/Anahtar Değişimi','Aydınlatma Montajı','Sigorta Kutusu Yenileme','Kablo Çekimi','Topraklama Kontrolü'],
  tesisat:  ['Çamaşır Makinesi Bağlantısı','Su Deposu Temizliği','Boru Hattı Kaçak Tamiri','Tıkanıklık Açma','Batarya/Musluk Değişimi','Kombi Bakımı'],
  tadilat:  ['Alçıpan Montajı','Kapı/Pencere Değişimi','Mutfak Dolabı Montajı','Zemin Döşeme (Laminat/Parke)','Asma Tavan'],
  temizlik: ['Cam Temizliği','Halı/Koltuk Yıkama','Genel Ev Temizliği','İnşaat Sonrası Temizlik'],
  tasima:   ['Eşya Paketleme','Asansörsüz Taşıma','Mobilya Sökme/Montaj','Sigortalı Taşıma'],
  bahce:    ['Çim Biçme','Budama','Sulama Sistemi Kurulumu','Peyzaj Tasarımı','İlaçlama'],
};

/* Toptan alımda kategoriye özel marka listesi */
const BRANDS = {
  boya:     ['Filli Boya','Marshall','Dyo','Polisan','Diğer'],
  karo:     ['Kale Seramik','Vitra','Çanakkale Seramik','NG Kütahya','Diğer'],
  elektrik: ['Schneider Electric','Legrand','Viko','Hager','Diğer'],
  tesisat:  ['Eca','Demirdöküm','Vaillant','Pilsa','Diğer'],
  tadilat:  ['Knauf','Baumit','Weber','Diğer'],
  bahce:    ['Bosch','Gardena','Stihl','Diğer'],
};

const CITIES = {
  'İstanbul':  ['Kadıköy','Beşiktaş','Üsküdar','Şişli','Beyoğlu','Fatih','Bakırköy','Maltepe','Kartal','Pendik'],
  'Ankara':    ['Çankaya','Keçiören','Mamak','Etimesgut','Sincan','Yenimahalle'],
  'İzmir':     ['Konak','Karşıyaka','Bornova','Buca','Çiğli','Gaziemir'],
  'Bursa':     ['Osmangazi','Nilüfer','Yıldırım','Gemlik','Mudanya'],
  'Antalya':   ['Muratpaşa','Kepez','Konyaaltı','Alanya','Manavgat'],
  'Adana':     ['Seyhan','Çukurova','Yüreğir','Sarıçam'],
  'Konya':     ['Meram','Selçuklu','Karatay','Ereğli'],
  'Gaziantep': ['Şahinbey','Şehitkamil','Nizip'],
  'Batman':    ['Merkez','Beşiri','Gercüş','Kozluk','Sason'],
  'Diyarbakır':['Bağlar','Kayapınar','Sur','Yenişehir'],
  'Kayseri':   ['Melikgazi','Kocasinan','Talas'],
  'Mersin':    ['Yenişehir','Mezitli','Toroslar','Akdeniz'],
};

/* ----------------------------------------------------------------
   2. ÖRNEK VERİLER (anonim rumuzlar dahil)
   ---------------------------------------------------------------- */
const SEED_USERS = [
  { id:'u1', email:'kullanici@test.com', password:'123456', name:'Fatma Arslan', anonName:'Kullanıcı561748',
    role:'user', city:'İstanbul', district:'Kadıköy', isAdmin:false, suspended:false },
  { id:'u2', email:'kullanici2@test.com',password:'123456', name:'Kemal Tunç',   anonName:'Kullanıcı198342',
    role:'user', city:'Ankara',   district:'Çankaya', isAdmin:false, suspended:false },
  /* Site sahibi demo hesabı — Sprint 7 moderasyon paneline, Sprint 8 yönetici paneline erişebilir. */
  { id:'u9', email:'admin@ustabul.com', password:'admin123', name:'UstaBul Yönetici', anonName:'Yönetici',
    role:'user', city:'İstanbul', district:'Şişli', isAdmin:true, suspended:false },
];
const SEED_WORKERS = [
  { id:'w1', email:'usta@test.com',  password:'123456', name:'Mehmet Yıldız', anonName:'Satıcı324519', role:'worker',
    city:'İstanbul', district:'Kadıköy', bio:'20 yıllık boya ve badana ustasıyım. İç ve dış cephe boyama konusunda uzmanım. Kaliteli malzeme kullanır, işimi zamanında bitiririm.',
    skills:['Boya & Badana','Tadilat & Yapı'], rating:4.8, ratingCount:34, jobsDone:41, joinedYear:'2022',
    /* "Yetkili Usta" — site sahibinin verdiği özel güven rütbesi, gönderi işaretleyebilir. */
    isTrustedWorker:true, suspended:false },
  { id:'w2', email:'ali@test.com',   password:'123456', name:'Ali Kaya',      anonName:'Satıcı778210', role:'worker',
    city:'İstanbul', district:'Beşiktaş', bio:'Belgeli elektrikçiyim. Tesisat, aydınlatma ve güvenlik sistemleri kurulumu yapıyorum. 15 yıllık deneyim.',
    skills:['Elektrik'], rating:4.5, ratingCount:22, jobsDone:28, joinedYear:'2021', isTrustedWorker:false, suspended:false },
  { id:'w3', email:'hasan@test.com', password:'123456', name:'Hasan Demir',   anonName:'Satıcı405987', role:'worker',
    city:'Ankara', district:'Çankaya', bio:'Su tesisatı ve doğalgaz konusunda 15 yıllık deneyimim var. Acil çağrılara yanıt veriyorum.',
    skills:['Su Tesisatı'], rating:4.7, ratingCount:18, jobsDone:23, joinedYear:'2020', isTrustedWorker:false, suspended:false },
];
const SEED_REVIEWS = {
  w1:[
    { author:'Kullanıcı7714', rating:5, comment:'Çok düzenli çalıştı. Salon mükemmel oldu, kesinlikle tavsiye ederim.', date:'15 Kasım 2024' },
    { author:'Kullanıcı2290', rating:5, comment:'Zamanında geldi, söz verdiği sürede bitirdi. Fiyat/performans çok iyi.', date:'3 Ekim 2024' },
    { author:'Kullanıcı5581', rating:4, comment:'Kaliteli iş çıkardı, temizliğe biraz daha dikkat edebilirdi.', date:'20 Ağustos 2024' },
  ],
  w2:[
    { author:'Kullanıcı9013', rating:5, comment:'Elektrik tesisatımızı hızlı ve güvenli yeniledi. Teşekkürler!', date:'10 Aralık 2024' },
    { author:'Kullanıcı3367', rating:4, comment:'İşini biliyor, belgeli ve profesyonel.', date:'5 Kasım 2024' },
  ],
  w3:[
    { author:'Kullanıcı6602', rating:5, comment:'Petek tamiri için aradım, aynı gün geldi. Harika hizmet.', date:'2 Ocak 2025' },
  ],
};
const SEED_JOBS = [
  { id:'j1', userId:'u1', catId:'boya',     catName:'Boya & Badana',  catIcon:'🎨', sub:'İç Cephe Boyama',
    title:'Salon ve iki yatak odası boyatmak istiyorum',
    desc:'Yaklaşık 80 m² duvar boyatmam gerekiyor. Salon, iki yatak odası ve koridor dahil. Yüksek kaliteli mat boya kullanılmasını istiyorum.',
    checklist:['Duvar Boyama','Astar Uygulama'],
    availability:{ type:'weekend', date:'', timeFrom:'', timeTo:'' },
    city:'İstanbul', district:'Kadıköy', budget:'6.000–9.000 TL', status:'open',
    photoRequested:true, photos:[],
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'',
    adminHidden:false,
    createdAt:new Date(Date.now()-2*86400000).toISOString(), offerIds:['o1'] },
  { id:'j2', userId:'u2', catId:'karo',     catName:'Karo & Seramik', catIcon:'⬜', sub:'Banyo Yenileme',
    title:'Banyo seramik döşeme işi',
    desc:'Banyoyu yenilemek istiyorum. Zemin ve duvar seramikleri değişecek. Yaklaşık 6 m² zemin, 18 m² duvar. Seramikleri ben temin edeceğim, sadece işçilik lazım.',
    checklist:['Zemin Döşeme','Duvar Döşeme','Eski Karo Söküm'],
    availability:{ type:'flexible', date:'', timeFrom:'', timeTo:'' },
    city:'Ankara', district:'Çankaya', budget:'3.000–5.000 TL', status:'open',
    photoRequested:false, photos:[],
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
    createdAt:new Date(Date.now()-5*86400000).toISOString(), offerIds:[] },
  { id:'j3', userId:'u2', catId:'elektrik', catName:'Elektrik',        catIcon:'⚡', sub:'Elektrik Tesisatı',
    title:'3+1 daire elektrik tesisatı yenileme',
    desc:'3+1 dairenin komple elektrik tesisatını yenilemek istiyorum. Sigorta kutusu dahil her şey değişecek. Belgeli elektrikçi tercihim.',
    checklist:['Sigorta Kutusu Yenileme','Priz/Anahtar Değişimi','Kablo Çekimi'],
    availability:{ type:'specific', date:new Date(Date.now()+4*86400000).toISOString().slice(0,10), timeFrom:'10:00', timeTo:'14:00' },
    city:'İstanbul', district:'Beşiktaş', budget:'12.000–18.000 TL', status:'open',
    photoRequested:false, photos:[],
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
    createdAt:new Date(Date.now()-86400000).toISOString(), offerIds:['o2'] },
  { id:'j4', userId:'u1', catId:'tesisat',  catName:'Su Tesisatı',     catIcon:'🔧', sub:'Tamir & Bakım',
    title:'Mutfak borusu akıtıyor — acil tamir',
    desc:'Mutfak lavabosunun altından su sızıyor. Birkaç gündür böyle, acil bakım lazım.',
    checklist:['Boru Hattı Kaçak Tamiri'],
    availability:{ type:'weekday', date:'', timeFrom:'', timeTo:'' },
    city:'Batman', district:'Merkez', budget:'500–1.500 TL', status:'open',
    photoRequested:false, photos:[],
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
    createdAt:new Date(Date.now()-3*3600000).toISOString(), offerIds:[] },
  /* Sprint 7 demosu: otomatik PII taraması bu ilanı telefon numarası içerdiği için
     yayından kaldırmadan işaretler — moderasyon kuyruğunda görünür. */
  { id:'j5', userId:'u2', catId:'bahce',    catName:'Bahçe & Peyzaj', catIcon:'🌿', sub:'Çim Biçme',
    title:'Bahçe düzenlemesi yaptırmak istiyorum',
    desc:'150 m² bahçemin çimlerini biçtirmek ve düzenletmek istiyorum. Müsait olan ustalar lütfen 0532 555 12 34 numarasından beni arasın, WhatsApp da olur.',
    checklist:[],
    availability:{ type:'flexible', date:'', timeFrom:'', timeTo:'' },
    city:'Ankara', district:'Çankaya', budget:null, status:'open',
    photoRequested:false, photos:[],
    flagged:true, flagReasons:['phone'], flagStatus:'pending', flagNotes:'', adminHidden:false,
    createdAt:new Date(Date.now()-6*3600000).toISOString(), offerIds:[] },
];

/* Kayıtlı adresler (Sprint 5) — kullanıcı ilan verirken buradan seçebilir */
const SEED_ADDRESSES = [
  { id:'a1', userId:'u1', label:'Ev', city:'İstanbul', district:'Kadıköy', fullAddress:'Caferağa Mah. Moda Cad. No:14 D:3' },
  { id:'a2', userId:'u1', label:'İş', city:'İstanbul', district:'Beşiktaş', fullAddress:'Levazım Mah. Koru Sok. No:2 Kat:5' },
];
/* Denetim kaydı (audit log) — Sprint 8. Yöneticinin gizliliği aştığı her an burada iz bırakır. */
const SEED_AUDIT_LOG = [];
const SEED_OFFERS = [
  { id:'o1', jobId:'j1', workerId:'w1', status:'pending', duration:'2 gün',
    rounds:[
      { by:'worker', price:7500, note:'80 m² iç cephe boyamayı 2 günde bitiririm. Kaliteli boya kullanırım, astar dahil.', at:new Date(Date.now()-86400000).toISOString() },
      { by:'user', price:6800, note:'Biraz indirim yapabilir misiniz?', at:new Date(Date.now()-40*3600000).toISOString() },
    ],
    createdAt:new Date(Date.now()-86400000).toISOString() },
  { id:'o2', jobId:'j3', workerId:'w2', status:'pending', duration:'3-4 gün',
    rounds:[
      { by:'worker', price:14000, note:'3+1 daire tesisatı için 3-4 günlük iş. Tüm malzeme dahil, belgeli elektrikçi.', at:new Date(Date.now()-12*3600000).toISOString() },
    ],
    createdAt:new Date(Date.now()-12*3600000).toISOString() },
];

/* Hazır ürünler (direkt satın alınabilir) */
const SEED_PRODS = [
  { id:'p1', icon:'🪣', sellerId:'w1', name:'Marshall İç Cephe Boyası', brand:'Marshall', seller:'Satıcı324519',
    desc:'Yüksek örtücülüklü, su bazlı iç cephe boyası. 15 L teneke, 70–80 m² kapatma kapasitesi.',
    price:780, unit:'teneke (15L)', minOrder:10, catId:'boya', cat:'Boya & Malzeme',
    /* ÜRÜN RESMİ: images/ klasörüne konacak dosyaya göreceli yol. Dosya yoksa
       kart otomatik olarak kategori ikonuna geri döner (onerror fallback). */
    image:'images/marshall-ic-cephe-boyasi.jpg',
    detail:'Türkiye\'de üretilmektedir. CE sertifikalıdır. Toplu siparişlerde %10 indirim.' },
];

/* Toptan alım talepleri (demand) — kullanıcılar "bulamadığım ürünü" talep eder */
const SEED_DEMANDS = [
  { id:'d1', userId:'u2', catId:'boya', catName:'Boya & Badana', catIcon:'🎨', sub:'İç Cephe Boyama',
    brand:'Filli Boya', qty:100, unit:'Kutu', note:'Beyaz renk, mat. Toplu indirim isteriz.',
    delivery:'ship', city:'Ankara', district:'Çankaya', addr:'(gizli)',
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
    status:'open', createdAt:new Date(Date.now()-4*3600000).toISOString(), offerIds:['do1'] },
];
const SEED_DEMAND_OFFERS = [
  { id:'do1', demandId:'d1', sellerId:'w1', unitPrice:95, totalPrice:9500, shipping:350,
    desc:'Filli Boya 100 kutu temin edebilirim, 5 iş günü içinde teslim ederim.',
    status:'pending', createdAt:new Date(Date.now()-2*3600000).toISOString() },
];

/* ================================================================
   2b. OTOMATİK KİŞİSEL VERİ (PII) TESPİTİ — Sprint 7
   Bir gönderi yayınlanmadan önce serbest metin alanları taranır.
   Bir eşleşme gönderiyi YAYINDAN KALDIRMAZ — sadece işaretler ve
   moderasyon kuyruğuna ekler (yanlış pozitifte gerçek bir ilanı
   gizlemek, gecikmeli incelemeden daha kötü bir kullanıcı deneyimi
   olur). Bu sezgisel/heuristik bir tarama; kesin bir NLP çözümü
   değildir — gerçek sistemde bu adım sunucu tarafında ve daha
   gelişmiş modellerle yapılır (bkz. yol haritası Sprint 11+).
   ================================================================ */

/* Yaygın Türkçe erkek/kadın isimleri — "adım/ismim/ben X Y" kalıbını
   doğrulamak için kısa bir liste. Kapsamlı değildir, sezgisel bir
   ek sinyal olarak kullanılır. */
const COMMON_TR_FIRST_NAMES = [
  'Mehmet','Mustafa','Ahmet','Ali','Hasan','Hüseyin','İbrahim','Ömer','Yusuf','Murat',
  'Emre','Can','Burak','Serkan','Kemal','Cem','Onur','Barış','Kaan','Tolga',
  'Fatma','Ayşe','Emine','Hatice','Zeynep','Elif','Meryem','Özlem','Sema','Derya',
  'Merve','Ebru','Aylin','Selin','Buse','Gamze','Pınar','Esra','Yasemin','Nur',
];

/* Türkiye cep telefonu kalıbı: 05XX XXX XX XX (ayraçlı ya da ayraçsız) */
const PHONE_REGEX = /(?:^|[^\d])0?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}(?:[^\d]|$)/;

/* Adres ipucu anahtar kelimeleri — tek başına zayıf sinyal, 2+ eşleşme güçlü sinyal */
const ADDRESS_KEYWORD_REGEX = /\b(mah\.?|mahallesi|sok\.?|sokak|cad\.?|cadde|apt\.?|blok|daire|kat\s?\d+|no\s?:?\s?\d+)\b/gi;

/* TC Kimlik No sağlama algoritması (resmi kontrol basamağı formülü) */
function isValidTCKN(str) {
  if (!/^\d{11}$/.test(str)) return false;
  const d = str.split('').map(Number);
  if (d[0] === 0) return false;
  const oddSum  = d[0]+d[2]+d[4]+d[6]+d[8];
  const evenSum = d[1]+d[3]+d[5]+d[7];
  const digit10 = ((oddSum*7) - evenSum) % 10;
  const first10Sum = d.slice(0,10).reduce((a,b)=>a+b,0);
  const digit11 = first10Sum % 10;
  return digit10 === d[9] && digit11 === d[10];
}

/* "adım/ismim/ben X Y" + yaygın isim listesi eşleşmesi */
function detectNamePattern(text) {
  const pattern = /(?:adım|ismim|benim adım|ben)\s+([A-ZÇĞİÖŞÜ][a-zçğıöşüA-ZÇĞİÖŞÜ]+)\s+([A-ZÇĞİÖŞÜ][a-zçğıöşü]+)/;
  const m = text.match(pattern);
  if (!m) return false;
  return COMMON_TR_FIRST_NAMES.includes(m[1]);
}

/* Ana tarama fonksiyonu — metni analiz eder, tespit edilen sebep kodlarını döndürür.
   Dönen değerler: 'phone' | 'tckn' | 'address' | 'name' (birden fazla olabilir) */
function detectPII(text) {
  const reasons = [];
  if (!text || typeof text !== 'string') return reasons;

  if (PHONE_REGEX.test(text)) reasons.push('phone');

  const elevenDigitMatches = text.match(/\b\d{11}\b/g);
  if (elevenDigitMatches && elevenDigitMatches.some(isValidTCKN)) reasons.push('tckn');

  const addrMatches = text.match(ADDRESS_KEYWORD_REGEX);
  if (addrMatches && addrMatches.length >= 2) reasons.push('address');

  if (detectNamePattern(text)) reasons.push('name');

  return reasons;
}

/* Sebep kodunu okunabilir Türkçe etikete ve rozet rengine çevirir */
const FLAG_REASON_META = {
  phone:   { label:'📞 Telefon Numarası',      badge:'badge-rose' },
  tckn:    { label:'🪪 T.C. Kimlik No',         badge:'badge-rose' },
  address: { label:'📍 Açık Adres',             badge:'badge-gold' },
  name:    { label:'👤 Ad Soyad',               badge:'badge-gold' },
  photos:  { label:'📷 Fotoğraf İncelemesi',    badge:'badge-sky' },
  manual:  { label:'🚩 Manuel Bildirim',        badge:'badge-rose' },
};
function flagReasonLabel(code) { return (FLAG_REASON_META[code]||{}).label || code; }
function flagReasonBadgeClass(code) { return (FLAG_REASON_META[code]||{}).badge || 'badge-gray'; }

/* Bir gönderi kaydına (job veya demand) otomatik tarama uygular ve
   flagged/flagReasons/flagStatus alanlarını günceller. Var olan
   manuel bir işaretin üzerine yazmaz — sadece 'auto' sebepleri birleştirir. */
function applyAutoFlag(record, textFields) {
  const combined = textFields.filter(Boolean).join(' ');
  const autoReasons = detectPII(combined);
  const hadManual = (record.flagReasons||[]).includes('manual');
  const reasons = new Set(record.flagReasons||[]);
  autoReasons.forEach(r => reasons.add(r));
  record.flagReasons = Array.from(reasons);
  record.flagged = record.flagReasons.length > 0;
  if (record.flagged && record.flagStatus !== 'resolved') record.flagStatus = 'pending';
  if (!record.flagged) record.flagStatus = null;
  return record;
}

/* ----------------------------------------------------------------
   3. UYGULAMA DURUMU
   ---------------------------------------------------------------- */
const S = {
  view: 'home',
  user: null,
  jobId: null,
  demandId: null,
  workerId: null,
  offerJobId: null,
  offerDemandId: null,
  counterOfferId: null,
  reportTarget: null, // { type:'job'|'demand', id }
  modTab: 'pending',
  adminTab: 'users',
  _loggedIdentityViews: new Set(), // Sprint 8: aynı hedefi tekrar tekrar loglamayı önler (oturum başına bir kez)
  pendingCat: null,
  editingJobId: null,   // null = yeni ilan, dolu = düzenleme modu
  post:  { step:1, catId:null, catName:null, catIcon:null, sub:null, checklist:[],
           availType:'flexible', availDate:'', availFrom:'', availTo:'', addressId:null },
  wpost: { step:1, catId:null, catName:null, catIcon:null, sub:null, brand:null,
           qty:null, unit:'Adet', note:'', delivery:null, city:null, district:null, addr:'', addressId:null },
};

/* ----------------------------------------------------------------
   4. LOCALSTORAGE YARDIMCILARI
   ---------------------------------------------------------------- */
const db = {
  get:(k)=>{ try{ return JSON.parse(localStorage.getItem('ub_'+k)); }catch{ return null; } },
  set:(k,v)=>{ try{ localStorage.setItem('ub_'+k,JSON.stringify(v)); }catch(e){console.error(e);} },
  arr:(k)=>db.get(k)||[],
};

/* Tüm kullanıcılar (iş sahibi + usta) içinden id ile bul */
function findUserById(id)   { return db.arr('users').find(u=>u.id===id); }
function findWorkerById(id) { return db.arr('workers').find(w=>w.id===id); }

/* Sprint 9: Auth artık gerçek (Supabase), ama jobs/offers/demands vb.
   hâlâ localStorage'da ve bu tablolar findUserById/ownerAnon gibi
   fonksiyonlarla kullanıcıyı localStorage'dan arıyor. Bu yüzden her
   giriş/kayıttan sonra profili localStorage önbelleğine de yansıtırız
   — geri kalan ~3000 satırı hemen değiştirmeden köprü kurar. Sonraki
   aşamada jobs/demands/vb. de Supabase'e taşınınca bu köprü kalkacak. */
function syncProfileToLocalCache(profile) {
  if (!profile) return;
  const collection = profile.role === 'worker' ? 'workers' : 'users';
  const records = db.arr(collection);
  const idx = records.findIndex(r => r.id === profile.id);
  if (idx === -1) records.push(profile); else records[idx] = { ...records[idx], ...profile };
  db.set(collection, records);
}

/* Anonim rumuz üret */
function genAnon(role) {
  const n = Math.floor(100000 + Math.random()*900000);
  return (role==='worker' ? 'Satıcı' : 'Kullanıcı') + n;
}

/* ----------------------------------------------------------------
   5. BAŞLATMA
   ---------------------------------------------------------------- */
async function init() {
  if (!db.get('seeded')) {
    db.set('users',        SEED_USERS);
    db.set('workers',      SEED_WORKERS);
    db.set('reviews',      SEED_REVIEWS);
    db.set('jobs',         SEED_JOBS);
    db.set('offers',       SEED_OFFERS);
    db.set('products',     SEED_PRODS);
    db.set('demands',      SEED_DEMANDS);
    db.set('demandOffers', SEED_DEMAND_OFFERS);
    db.set('addresses',    SEED_ADDRESSES);
    db.set('auditLog',     SEED_AUDIT_LOG);
    db.set('seeded',       true);
  }
  migrateLegacyData();

  // Sprint 9: oturum artık Supabase'de yaşıyor, localStorage'da değil.
  try {
    const restored = await sbRestoreSession();
    if (restored && restored.suspended) {
      await sbSignOut();
      toast('Hesabınız askıya alındığı için oturumunuz kapatıldı.','er');
    } else if (restored) {
      S.user = restored;
      syncProfileToLocalCache(restored);
    }
  } catch (e) {
    console.error('Oturum geri yüklenemedi:', e);
  }

  renderAuthArea();
  populateCities();
  renderHomeCats();
  renderHomeJobs();
  renderHomeProds();
  renderHeroPreview();
  renderFilterOpts();
}

/* ----------------------------------------------------------------
   VERİ GÖÇÜ (data migration) — Sprint 6, teklif yapısı değişti.
   Bu prototip localStorage kullandığı için, tarayıcıda önceki bir
   sürümden kalma veri varsa yeni koddaki alanlar (örn. offer.rounds)
   eksik olabilir ve render sırasında çökmeye yol açar. Bu fonksiyon
   her sayfa yüklemesinde (sadece ilk seed'de değil) çalışır ve eski
   formattaki kayıtları, veriyi kaybetmeden yeni formata çevirir.
   ---------------------------------------------------------------- */
function migrateLegacyData() {
  const offers = db.arr('offers');
  let changed = false;
  const migrated = offers.map(o => {
    if (Array.isArray(o.rounds) && o.rounds.length) return o; // zaten güncel format
    changed = true;
    return {
      id: o.id, jobId: o.jobId, workerId: o.workerId,
      status: o.status || 'pending',
      duration: o.duration || '',
      rounds: [{ by:'worker', price:o.price||0, note:o.desc||'', at:o.createdAt||new Date().toISOString() }],
      createdAt: o.createdAt || new Date().toISOString(),
    };
  });
  if (changed) db.set('offers', migrated);

  // Sprint 7: eski kayıtlarda flagged/flagReasons/flagStatus alanları olmayabilir.
  // Eksikse güvenli varsayılanlarla doldurulur (çökmeyi önler).
  let jobsChanged = false;
  const jobs = db.arr('jobs').map(j => {
    if (j.flagReasons !== undefined) return j;
    jobsChanged = true;
    return { ...j, flagged:false, flagReasons:[], flagStatus:null, flagNotes:'' };
  });
  if (jobsChanged) db.set('jobs', jobs);

  let demandsChanged = false;
  const demands = db.arr('demands').map(d => {
    if (d.flagReasons !== undefined) return d;
    demandsChanged = true;
    return { ...d, flagged:false, flagReasons:[], flagStatus:null, flagNotes:'' };
  });
  if (demandsChanged) db.set('demands', demands);

  let usersChanged = false;
  const users = db.arr('users').map(u => {
    if (u.isAdmin !== undefined) return u;
    usersChanged = true;
    return { ...u, isAdmin:false };
  });
  if (usersChanged) db.set('users', users);

  let workersChanged = false;
  const workers = db.arr('workers').map(w => {
    if (w.isTrustedWorker !== undefined) return w;
    workersChanged = true;
    return { ...w, isTrustedWorker:false };
  });
  if (workersChanged) db.set('workers', workers);

  // Sprint 8: adminHidden (gönderi), suspended (hesap), auditLog koleksiyonu.
  let jobsHiddenChanged = false;
  const jobs2 = db.arr('jobs').map(j => {
    if (j.adminHidden !== undefined) return j;
    jobsHiddenChanged = true;
    return { ...j, adminHidden:false };
  });
  if (jobsHiddenChanged) db.set('jobs', jobs2);

  let demandsHiddenChanged = false;
  const demands2 = db.arr('demands').map(d => {
    if (d.adminHidden !== undefined) return d;
    demandsHiddenChanged = true;
    return { ...d, adminHidden:false };
  });
  if (demandsHiddenChanged) db.set('demands', demands2);

  let usersSuspendChanged = false;
  const users2 = db.arr('users').map(u => {
    if (u.suspended !== undefined) return u;
    usersSuspendChanged = true;
    return { ...u, suspended:false };
  });
  if (usersSuspendChanged) db.set('users', users2);

  let workersSuspendChanged = false;
  const workers2 = db.arr('workers').map(w => {
    if (w.suspended !== undefined) return w;
    workersSuspendChanged = true;
    return { ...w, suspended:false };
  });
  if (workersSuspendChanged) db.set('workers', workers2);

  if (db.get('auditLog') === null) db.set('auditLog', []);

  /* Yukarıdaki genel geriye-dönük-uyumluluk taraması her yeni alanı
     güvenli/ayrıcalıksız bir varsayılanla (false) doldurur — bu doğrudur.
     Ama bu, önceden var olan tarayıcılarda demo yönetici hesabının hiç
     eklenmemiş olması ve w1'in "Yetkili Usta" bayrağının yanlışlıkla
     false'a sabitlenmesi anlamına gelir. Bu iki noktayı SEED verisiyle
     karşılaştırıp düzeltiyoruz — kullanıcının kendi oluşturduğu diğer
     hesaplara/verilere dokunulmaz. */
  const usersNow = db.arr('users');
  if (!usersNow.some(u => u.email === 'admin@ustabul.com')) {
    const adminSeed = SEED_USERS.find(u => u.email === 'admin@ustabul.com');
    if (adminSeed) { usersNow.push(adminSeed); db.set('users', usersNow); }
  }
  const workersNow = db.arr('workers');
  let trustedFixed = false;
  SEED_WORKERS.filter(sw => sw.isTrustedWorker).forEach(sw => {
    const idx = workersNow.findIndex(w => w.id === sw.id || w.email === sw.email);
    if (idx !== -1 && !workersNow[idx].isTrustedWorker) {
      workersNow[idx].isTrustedWorker = true;
      trustedFixed = true;
    }
  });
  if (trustedFixed) db.set('workers', workersNow);
}

/* ----------------------------------------------------------------
   6. GÖRÜNÜM YÖNLENDİRME
   ---------------------------------------------------------------- */
function showView(id, data) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-'+id);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn[data-view]').forEach(b =>
    b.classList.toggle('active', b.dataset.view === id || (id==='post-wholesale'&&b.dataset.view==='wholesale')));
  S.view = id;
  window.scrollTo({ top:0, behavior:'smooth' });
  if (data) { S.jobId=data.jobId||S.jobId; S.workerId=data.workerId||S.workerId; S.demandId=data.demandId||S.demandId; }
  switch(id) {
    case 'home':              renderHomeJobs(); renderHomeProds(); renderHeroPreview(); break;
    case 'browse':            renderBrowse();   break;
    case 'job-detail':        renderJobDetail(S.jobId); break;
    case 'demand-detail':     renderDemandDetail(S.demandId); break;
    case 'worker-profile':    renderWorkerProfile(S.workerId); break;
    case 'post-job':          S.editingJobId ? renderEditJobForm() : resetPostJob(); break;
    case 'post-wholesale':    resetPostWholesale(); break;
    case 'wholesale':         renderWholesale(); break;
    case 'dashboard-user':    renderUserDash(); break;
    case 'dashboard-worker':  renderWorkerDash(); break;
    case 'moderation':        renderModerationQueue(); break;
    case 'admin-panel':       renderAdminPanel(); break;
  }
}

/* ----------------------------------------------------------------
   7. ANASAYFA
   ---------------------------------------------------------------- */
function renderHomeCats() {
  const el = document.getElementById('home-cats');
  if (!el) return;
  el.innerHTML = CATS.map(c => `
    <div class="cat-card" style="--col:${c.col};--col-bg:${c.bg};" onclick="browseByCategory('${c.id}')">
      <div class="cat-icon-wrap"><span style="font-size:30px;">${c.icon}</span></div>
      <div class="cat-name">${c.name}</div>
    </div>`).join('');
}

function browseByCategory(catId) { S.pendingCat = catId; showView('browse'); }

/* İncelemede veya silinmiş ilanlar herkese açık listelerde görünmez */
function isPubliclyVisible(job) {
  return job.status!=='pending_review' && job.status!=='deleted' && !job.adminHidden;
}

function renderHomeJobs() {
  const jobs = db.arr('jobs').filter(isPubliclyVisible)
    .sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);
  const el = document.getElementById('home-jobs');
  if (!el) return;
  el.innerHTML = jobs.length ? jobs.map(jobCardHTML).join('') :
    `<div class="empty-st" style="grid-column:1/-1;"><div class="empty-icon">📋</div><div class="empty-txt">Henüz ilan yok</div></div>`;
}

function renderHomeProds() {
  const el = document.getElementById('home-prods');
  if (!el) return;
  el.innerHTML = db.arr('products').map(prodCardHTML).join('');
}

/* Hero'nun sağındaki kartlar — gerçek verilerden, tıklanabilir.
   1) En güncel açık ilan → ilan detayına gider
   2) En yüksek puanlı usta → usta profiline gider
   3) Platform istatistiği → ilan listesine gider (her zaman anlamlı bir sonuç) */
function renderHeroPreview() {
  const wrap = document.getElementById('hero-visual');
  if (!wrap) return;

  const jobs = db.arr('jobs').filter(j=>j.status==='open' && !j.adminHidden)
    .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const workers = db.arr('workers').slice().sort((a,b)=>(b.rating||0)-(a.rating||0));
  const totalJobs = db.arr('jobs').length;
  const totalWorkers = db.arr('workers').length;

  let cardsHtml = '';

  if (jobs[0]) {
    const j = jobs[0];
    const offerCount = (j.offerIds||[]).length;
    cardsHtml += `
      <div class="hv-card" onclick="S.jobId='${j.id}';showView('job-detail')">
        <span class="hvc-emoji">${j.catIcon}</span>
        <div class="hvc-body">
          <div class="hvc-title">${esc(j.title.length>34?j.title.slice(0,34)+'…':j.title)}</div>
          <div class="hvc-sub">${esc(j.city)} / ${esc(j.district)} · ${offerCount} teklif</div>
        </div>
        <span class="hvc-status">Açık</span>
      </div>`;
  }

  if (workers[0]) {
    const w = workers[0];
    cardsHtml += `
      <div class="hv-card" onclick="S.workerId='${w.id}';showView('worker-profile')">
        <div class="hvc-av">${w.anonName.replace(/[^0-9]/g,'').slice(0,1)||'S'}</div>
        <div class="hvc-body">
          <div class="hvc-title">${esc(w.anonName)} · ★ ${w.rating||'—'}</div>
          <div class="hvc-sub">${esc(w.city)} · ${w.jobsDone||0} iş tamamlandı</div>
        </div>
        <span class="hvc-arrow">→</span>
      </div>`;
  }

  cardsHtml += `
    <div class="hv-card" onclick="showView('browse')">
      <div class="hvc-body">
        <div class="hvc-stat-num">${totalJobs}+</div>
        <div class="hvc-stat-lbl">Yayında ilan · ${totalWorkers} usta</div>
      </div>
      <span class="hvc-arrow">→</span>
    </div>`;

  wrap.innerHTML = cardsHtml;
}

/* Kategori renk bul */
function catColor(catId) { const c=CATS.find(x=>x.id===catId); return c ? {col:c.col,bg:c.bg} : {col:'var(--green)',bg:'rgba(78,123,92,.08)'}; }

/* İş ilanı kart HTML */
function jobCardHTML(job) {
  const ofrs = (job.offerIds||[]).length;
  const cc = catColor(job.catId);
  return `
    <div class="job-card" style="--col:${cc.col};--col-bg:${cc.bg};" onclick="S.jobId='${job.id}';showView('job-detail')">
      <div class="jc-top">
        <span class="jc-cat-icon">${job.catIcon}</span>
        <div><div class="jc-cat">${esc(job.catName)}</div><div class="jc-sub">${esc(job.sub)}</div></div>
      </div>
      <div class="jc-body">
        <div class="jc-title">${esc(job.title)}</div>
        <div class="jc-desc">${esc(job.desc)}</div>
        <div class="jc-meta">
          <span class="jc-loc">📍 ${job.city} / ${job.district}</span>
          <span class="jc-date">${timeAgo(job.createdAt)}</span>
        </div>
      </div>
      <div class="jc-foot">
        <span class="jc-offers">📩 ${ofrs} teklif</span>
        ${job.budget ? `<span class="badge badge-gold">💰 ${esc(job.budget)}</span>` : ''}
      </div>
    </div>`;
}

/* Hazır ürün kart HTML */
/* Hazır ürün kart HTML — görsel öncelikli, kırık/eksik görselde kategori ikonuna döner */
function prodCardHTML(p) {
  const cat = CATS.find(c=>c.id===p.catId);
  const cc = catColor(p.catId);
  const fallbackIcon = (cat ? cat.icon : p.icon) || '📦';
  const imgHtml = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}"
         onerror="this.parentElement.innerHTML='<div class=&quot;pc-fallback&quot; style=&quot;background:${cc.bg}&quot;>${fallbackIcon}</div>';" />`
    : `<div class="pc-fallback" style="background:${cc.bg};">${fallbackIcon}</div>`;
  return `
    <div class="prod-card" onclick="openProdModal('${p.id}')">
      <div class="pc-image">
        ${imgHtml}
        <span class="pc-brand-tag">🏷️ ${esc(p.brand)}</span>
      </div>
      <div class="pc-body">
        <div class="pc-name">${esc(p.name)}</div>
        <div class="pc-desc">${esc(p.desc)}</div>
        <div class="pc-price-row"><span class="pc-price">${Number(p.price).toLocaleString('tr-TR')} ₺</span><span class="pc-unit">/ ${esc(p.unit)}</span></div>
        <div class="pc-min">Min. sipariş: ${p.minOrder} adet · ${esc(p.seller)}</div>
      </div>
      <div class="pc-foot">
        <span class="badge badge-gray">Hazır Ürün</span>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openProdModal('${p.id}')">İncele</button>
      </div>
    </div>`;
}

/* Toptan talep (demand) kart HTML */
function demandCardHTML(d) {
  const cc = catColor(d.catId);
  const ofrs = (d.offerIds||[]).length;
  const owner = ownerAnon(d.userId);
  return `
    <div class="toptan-card" style="--col:${cc.col};--col-bg:${cc.bg};" onclick="S.demandId='${d.id}';showView('demand-detail')">
      <div class="tc-head"><span class="badge badge-terra">🔍 Talep</span> <span class="badge badge-gray">${d.catIcon} ${esc(d.sub)}</span></div>
      <div class="tc-body">
        <div class="tc-brand">${esc(d.brand)}</div>
        <div class="tc-product">${esc(d.catName)}</div>
        <div class="tc-amount">${Number(d.qty).toLocaleString('tr-TR')} ${esc(d.unit)}</div>
        <div class="tc-meta">
          <span class="tc-anon">📍 ${esc(d.city)}/${esc(d.district)} · ${esc(owner)}</span>
        </div>
      </div>
      <div class="tc-foot">
        <span class="jc-offers">📩 ${ofrs} teklif</span>
        <span class="badge badge-sky">${d.delivery==='ship'?'📦 Kargo':'🚗 Elden Teslim'}</span>
      </div>
    </div>`;
}

/* Bir kullanıcının görünen rumuzunu döndür (kayıtlı olmayan demo veri için fallback) */
function ownerAnon(userId) {
  const u = findUserById(userId);
  return u ? u.anonName : 'Kullanıcı······';
}
function sellerAnon(workerId) {
  const w = findWorkerById(workerId);
  return w ? w.anonName : 'Satıcı······';
}

/* ----------------------------------------------------------------
   8. BROWSE & FİLTRELEME (İş İlanları)
   ---------------------------------------------------------------- */
function renderFilterOpts() {
  const cSel = document.getElementById('f-cat');
  const citySel = document.getElementById('f-city');
  if (!cSel||!citySel) return;
  cSel.innerHTML = '<option value="">Tüm Kategoriler</option>' +
    CATS.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  citySel.innerHTML = '<option value="">Tüm Şehirler</option>' +
    Object.keys(CITIES).map(c=>`<option value="${c}">${c}</option>`).join('');
}

function renderBrowse() {
  renderFilterOpts();
  if (S.pendingCat) {
    const fCat = document.getElementById('f-cat');
    if (fCat) fCat.value = S.pendingCat;
    S.pendingCat = null;
  }
  applyFilters();
}

function applyFilters() {
  const catV  = document.getElementById('f-cat')?.value||'';
  const cityV = document.getElementById('f-city')?.value||'';
  const subV  = document.getElementById('f-sub')?.value||'';

  const subSel = document.getElementById('f-sub');
  if (subSel) {
    if (catV) {
      const cat = CATS.find(c=>c.id===catV);
      subSel.innerHTML = '<option value="">Tüm Alt Kategoriler</option>' +
        (cat ? cat.sub.map(s=>`<option value="${s}">${s}</option>`).join('') : '');
      subSel.disabled = false;
    } else {
      subSel.innerHTML = '<option value="">Tüm Alt Kategoriler</option>';
      subSel.disabled = true;
    }
  }

  let jobs = db.arr('jobs').filter(isPubliclyVisible);
  if (catV)  jobs = jobs.filter(j=>j.catId===catV);
  if (cityV) jobs = jobs.filter(j=>j.city===cityV);
  if (subV)  jobs = jobs.filter(j=>j.sub===subV);
  jobs.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));

  const grid = document.getElementById('browse-grid');
  if (!grid) return;
  grid.innerHTML = jobs.length
    ? jobs.map(jobCardHTML).join('')
    : `<div class="empty-st" style="grid-column:1/-1;"><div class="empty-icon">🔍</div>
       <div class="empty-txt">İlan Bulunamadı</div>
       <div class="empty-sub">Farklı filtreler deneyin.</div></div>`;
}

function resetFilters() {
  ['f-cat','f-city','f-sub'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
  applyFilters();
}

/* ----------------------------------------------------------------
   9. İLAN DETAY (İŞ İLANI)
   ---------------------------------------------------------------- */
function renderJobDetail(jobId) {
  const job = db.arr('jobs').find(j=>j.id===jobId);
  if (!job) { toast('İlan bulunamadı','er'); showView('browse'); return; }

  // İncelemede/silinmiş ilanlar sadece sahibine görünür
  const viewerIsOwner = S.user && S.user.id === job.userId;
  if ((job.status==='pending_review' || job.status==='deleted') && !viewerIsOwner) {
    toast('Bu ilan şu anda görüntülenemez','er'); showView('browse'); return;
  }
  if (job.adminHidden && !isSuperAdmin()) {
    toast('Bu ilan şu anda görüntülenemez','er'); showView('browse'); return;
  }

  const owner = ownerAnon(job.userId);
  const ownerUser = findUserById(job.userId);

  document.getElementById('jd-review-banner')?.classList.toggle('hidden', !(job.status==='pending_review' && viewerIsOwner));

  const isModerator = S.user && (S.user.isAdmin || S.user.isTrustedWorker);
  const showFlagBanner = job.flagged && job.flagStatus==='pending' && (viewerIsOwner || isModerator);
  document.getElementById('jd-flag-banner')?.classList.toggle('hidden', !showFlagBanner);
  if (showFlagBanner) {
    document.getElementById('jd-flag-reasons').innerHTML =
      (job.flagReasons||[]).map(r=>`<span class="badge ${flagReasonBadgeClass(r)}">${flagReasonLabel(r)}</span>`).join('');
  }

  // Yönetici Görünümü — Sprint 8. Sadece isAdmin, her zaman gerçek kimlik.
  document.getElementById('jd-admin-panel')?.classList.toggle('hidden', !isSuperAdmin());
  if (isSuperAdmin()) {
    document.getElementById('jd-admin-name').textContent = ownerUser?.name || '(bulunamadı)';
    document.getElementById('jd-admin-email').textContent = ownerUser?.email || '—';
    document.getElementById('jd-admin-addr').textContent = job.addr ? `${job.addr} — ${job.city}/${job.district}` : `(tam adres girilmemiş) — ${job.city}/${job.district}`;
    const hideBtn = document.getElementById('jd-admin-hide-btn');
    hideBtn.textContent = job.adminHidden ? '✓ Görünürlüğü Geri Ver' : '👁️‍🗨️ Sadece Bana Görünür Yap';
    const logKey = 'job:'+job.id;
    if (!S._loggedIdentityViews.has(logKey)) {
      S._loggedIdentityViews.add(logKey);
      logAuditAction('view_identity', 'job', job.id, `${job.title} — ${ownerUser?.name||'?'}`);
    }
  }

  document.getElementById('jd-breadcrumb').textContent = job.catName;
  document.getElementById('jd-title').textContent = job.title;
  document.getElementById('jd-desc').textContent  = job.desc;
  document.getElementById('jd-loc').textContent   = `📍 ${job.city} / ${job.district}`;
  document.getElementById('jd-cat').textContent   = `${job.catIcon} ${job.catName}`;
  document.getElementById('jd-subcat').textContent = job.sub;
  document.getElementById('jd-availability').textContent = formatAvailability(job.availability);
  document.getElementById('jd-owner').textContent = owner;
  document.getElementById('jd-anon-owner').textContent = owner;
  document.getElementById('jd-date').textContent  = fmtDate(job.createdAt);
  const statusBadge = job.status==='open' ? '✓ Açık'
    : job.status==='in_progress' ? 'Devam Ediyor'
    : job.status==='pending_review' ? '🕐 İncelemede'
    : job.status==='completed' ? 'Tamamlandı' : 'Kapalı';
  const statusColor = job.status==='open' ? 'green' : job.status==='pending_review' ? 'gold' : 'gray';
  document.getElementById('jd-badges').innerHTML  =
    `<span class="badge badge-sage">${job.catIcon} ${esc(job.sub)}</span>
     <span class="badge badge-${statusColor}">${statusBadge}</span>
     ${job.budget ? `<span class="badge badge-gold">💰 ${esc(job.budget)}</span>` : ''}`;

  // Kontrol listesi
  const clWrap = document.getElementById('jd-checklist-wrap');
  if (job.checklist && job.checklist.length) {
    clWrap.classList.remove('hidden');
    document.getElementById('jd-checklist').innerHTML =
      job.checklist.map(c=>`<span class="badge badge-sky">✓ ${esc(c)}</span>`).join('');
  } else { clWrap.classList.add('hidden'); }

  // isOwner/isWorker — hem fotoğraf bölümünde hem aşağıdaki aksiyon panelinde kullanılır
  const isOwner  = S.user && S.user.id === job.userId;
  const isWorker = S.user && (S.user.role==='worker'||S.user.role==='both');

  // Fotoğraf isteği / galeri (Sprint 5) — bir usta talep edince ilan sahibi yükleyebilir
  const photos = job.photos || [];
  const photosWrap = document.getElementById('jd-photos-wrap');
  const uploadWrap = document.getElementById('jd-photo-upload-wrap');
  if (photos.length || job.photoRequested) {
    photosWrap.classList.remove('hidden');
    document.getElementById('jd-photos-gallery').innerHTML = photos.length
      ? photos.map(src => `<a class="jd-photo-thumb" href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="Oda fotoğrafı" /></a>`).join('')
      : `<p style="color:var(--muted);font-size:var(--fs-sm);">Henüz fotoğraf eklenmedi.</p>`;
    uploadWrap.classList.toggle('hidden', !isOwner);
  } else {
    photosWrap.classList.add('hidden');
  }

  // Teklifler (pazarlık dahil — Sprint 6)
  const offers = db.arr('offers').filter(o=>o.jobId===jobId);
  document.getElementById('jd-offer-cnt').textContent = `${offers.length} teklif`;
  const ofEl = document.getElementById('jd-offers');
  if (!offers.length) {
    ofEl.innerHTML = `<div class="empty-st" style="padding:40px;">
      <div class="empty-icon">📭</div><div class="empty-txt">Henüz teklif yok</div>
      <div class="empty-sub">İlk teklifi siz verin!</div></div>`;
  } else {
    ofEl.innerHTML = offers.map(o => {
      const sw = findWorkerById(o.workerId);
      const anon = sellerAnon(o.workerId);
      const isOwnerViewer = S.user && S.user.id === job.userId;
      const isThisWorkerViewer = S.user && S.user.id === o.workerId;
      const revealed = o.status==='accepted';
      const displayName = revealed ? `${anon} <span style="color:var(--muted);font-weight:400;">· ${esc(sw?.name||'')}</span>` : anon;
      const last = latestRound(o);
      const capped = isNegotiationCapped(o);
      const myTurn = (isOwnerViewer && last.by==='worker') || (isThisWorkerViewer && last.by==='user');

      const historyHtml = o.rounds.length > 1 ? `
        <div class="neg-history">
          ${o.rounds.slice(0,-1).map(r => `
            <div class="neg-round">
              <span class="neg-round-who">${r.by==='worker'?esc(anon):esc(owner)}:</span>
              <span class="neg-round-price">${Number(r.price).toLocaleString('tr-TR')} ₺</span>
              ${r.note?`<span class="neg-round-note">"${esc(r.note)}"</span>`:''}
            </div>`).join('')}
        </div>` : '';

      let actionHtml = '';
      if (o.status==='withdrawn') {
        actionHtml = `<span class="badge badge-gray">Geri Çekildi</span>`;
      } else if (o.status==='accepted') {
        // rozet zaten isimde gösteriliyor
      } else if (job.status!=='open') {
        actionHtml = `<span class="badge badge-gray">İlan Kapalı</span>`;
      } else if (isOwnerViewer || isThisWorkerViewer) {
        if (myTurn) {
          actionHtml = `
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();acceptOffer('${o.id}','${jobId}')">✓ Kabul Et</button>
            ${!capped ? `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openCounterModal('${o.id}')">🔄 Karşı Teklif</button>` : ''}
            ${isThisWorkerViewer ? `<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();withdrawOffer('${o.id}')">Geri Çek</button>` : ''}`;
        } else {
          actionHtml = `
            <span class="badge badge-gold">${isOwnerViewer?'Usta':'İlan sahibi'} yanıtı bekleniyor</span>
            ${isThisWorkerViewer ? `<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();withdrawOffer('${o.id}')">Geri Çek</button>` : ''}`;
        }
      }

      return `
        <div class="offer-item ${o.status==='accepted'?'accepted':''} ${o.status==='withdrawn'?'withdrawn':''}"
             onclick="S.workerId='${o.workerId}';showView('worker-profile')">
          <div class="offer-av">${anon.replace(/[^0-9]/g,'').slice(0,1)||'S'}</div>
          <div class="offer-info">
            <div class="offer-wname">${displayName}
              ${revealed?'<span class="badge badge-green" style="margin-left:6px;">✓ Kabul Edildi</span>':''}
              ${capped && o.status==='pending' ? '<span class="badge badge-gray" style="margin-left:6px;">Tur sınırına ulaşıldı</span>' : ''}
            </div>
            <div class="offer-stars">★ ${sw?.rating||'—'} · <span style="color:var(--green-dk);">Profili gör →</span></div>
            ${historyHtml}
            <div class="offer-desc">${esc(last.note||'')}</div>
            <div style="font-size:var(--fs-xs);color:var(--muted);margin-top:4px;">🔄 ${o.rounds.length}. teklif${o.duration?` · ⏱ ${esc(o.duration)}`:''} · ${fmtDate(last.at)}</div>
          </div>
          <div style="flex-shrink:0;text-align:right;" onclick="event.stopPropagation()">
            <div class="offer-price">${Number(last.price).toLocaleString('tr-TR')} ₺</div>
            <div class="neg-actions" style="margin-top:8px;">${actionHtml}</div>
          </div>
        </div>`;
    }).join('');
  }

  // Sağ panel
  const alreadyOffered = offers.some(o => S.user && o.workerId===S.user.id);
  const actionEl = document.getElementById('jd-action');

  if (isOwner) {
    const canEdit = job.status==='open' || job.status==='pending_review';
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:10px;">Bu İlan Sizin</h3>
      <p style="color:var(--muted);">Gelen teklifleri inceleyip kabul edebilir ya da karşı teklif verebilirsiniz. İlanda rumuzunuz <strong>${owner}</strong> görünüyor.</p>
      ${canEdit ? `
        <hr class="divider">
        <div class="row" style="gap:10px;">
          <button class="btn btn-outline btn-sm" style="flex:1;" onclick="startEditJob('${job.id}')">✏️ Düzenle</button>
          <button class="btn btn-danger btn-sm" style="flex:1;" onclick="deleteJob('${job.id}')">🗑️ Sil</button>
        </div>` : `
        <hr class="divider">
        <p style="font-size:var(--fs-sm);color:var(--muted);">Teklif kabul edildiği için bu ilan artık düzenlenemez veya silinemez.</p>`}
      <hr class="divider">
      <button class="btn btn-ghost btn-full" onclick="showView('dashboard-user')">İlanlarıma Dön</button>
      ${moderatorReportButtonHTML(job, isModerator, 'job')}`;
  } else if (isWorker && alreadyOffered) {
    const myOffer = offers.find(o => o.workerId === S.user.id);
    const last = latestRound(myOffer);
    let statusText;
    if (myOffer.status === 'accepted') statusText = '✅ Teklifiniz kabul edildi! Gerçek iletişim bilgileri artık görünür.';
    else if (myOffer.status === 'withdrawn') statusText = '🚫 Bu teklifi geri çektiniz.';
    else if (last.by === 'user') statusText = `📩 İlan sahibi ${Number(last.price).toLocaleString('tr-TR')} ₺ karşı teklif verdi — aşağıdaki listeden yanıtlayabilirsiniz.`;
    else statusText = `⏳ Son teklifiniz ${Number(last.price).toLocaleString('tr-TR')} ₺ — ilan sahibinin yanıtı bekleniyor.`;
    actionEl.innerHTML = `
      <div style="text-align:center;padding:16px 0;">
        <div style="font-size:44px;margin-bottom:12px;">💬</div>
        <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Teklif Durumunuz</h3>
        <p style="color:var(--muted);">${statusText}</p>
      </div>
      <hr class="divider">
      ${photoRequestButtonHTML(job)}
      ${moderatorReportButtonHTML(job, isModerator, 'job')}`;
  } else if (isWorker) {
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Teklif Ver</h3>
      <p style="color:var(--muted);margin-bottom:16px;">Bu iş için fiyat teklifinizi rumuzunuzla (<strong>${S.user.anonName}</strong>) gönderin.</p>
      <button class="btn btn-primary btn-full btn-lg" onclick="openOfferModal('${jobId}')">💬 Teklif Gönder</button>
      <hr class="divider">
      ${photoRequestButtonHTML(job)}
      ${moderatorReportButtonHTML(job, isModerator, 'job')}`;
  } else {
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Teklif Vermek İster Misiniz?</h3>
      <p style="color:var(--muted);margin-bottom:16px;">Usta olarak giriş yapın ve teklif gönderin.</p>
      <button class="btn btn-primary btn-full" onclick="openModal('m-auth')">Giriş Yap / Kayıt Ol</button>
      ${moderatorReportButtonHTML(job, isModerator, 'job')}`;
  }
}

/* Usta tarafındaki "Fotoğraf İste" düğmesi/durumu — hem teklif verilmiş hem verilmemiş durumda gösterilir */
function photoRequestButtonHTML(job) {
  if (job.photoRequested) {
    return `<div class="info-box" style="text-align:center;">📷 Fotoğraf talebiniz gönderildi — ilan sahibi yüklediğinde burada görünecek.</div>`;
  }
  return `
    <p class="fhint mb4">Odayı daha iyi değerlendirmek için ilan sahibinden fotoğraf isteyebilirsiniz.</p>
    <button class="btn btn-outline btn-full" onclick="requestJobPhotos('${job.id}')">📷 Fotoğraf İste</button>`;
}

/* Sadece site sahibi / Yetkili Usta görür — gönderiyi moderasyon kuyruğuna manuel ekler (Sprint 7)
   type: 'job' | 'demand' */
function moderatorReportButtonHTML(record, isModerator, type) {
  if (!isModerator) return '';
  if (record.flagged && record.flagStatus==='pending') {
    return `
      <hr class="divider">
      <div class="info-box" style="background:rgba(52,152,216,.10);border-color:rgba(52,152,216,.3);color:#1A5E8A;">
        🛡️ Bu gönderi zaten inceleme kuyruğunda.
      </div>`;
  }
  return `
    <hr class="divider">
    <button class="btn btn-danger btn-full btn-sm" onclick="openReportModal('${type}','${record.id}')">🚩 Gönderiyi İşaretle</button>`;
}

function acceptOffer(offerId, jobId) {
  const offers = db.arr('offers');
  const idx = offers.findIndex(o=>o.id===offerId);
  if (idx===-1) return;
  offers[idx].status = 'accepted';
  db.set('offers', offers);
  const jobs = db.arr('jobs');
  const ji = jobs.findIndex(j=>j.id===jobId);
  if (ji!==-1) { jobs[ji].status='in_progress'; db.set('jobs',jobs); }
  toast('Teklif kabul edildi! Gerçek isim ve iletişim bilgileri artık görünür.','ok');
  renderJobDetail(jobId);
}

/* ----------------------------------------------------------------
   9b. FOTOĞRAF İSTEĞİ (Sprint 5) — usta ister, ilan sahibi yükler.
   Not: Bu bir prototiptir; gerçek saklama/CDN veya uygunsuz içerik
   denetimi yoktur — görseller yalnızca tarayıcının localStorage'ında
   base64 olarak tutulur. Üretimde bu adım gerçek dosya depolama ve
   moderasyon servisi gerektirir (bkz. Sprint 7/11 planı).
   ---------------------------------------------------------------- */
function requestJobPhotos(jobId) {
  if (!S.user) { openModal('m-auth'); return; }
  const jobs = db.arr('jobs');
  const idx = jobs.findIndex(j=>j.id===jobId);
  if (idx===-1) return;
  jobs[idx].photoRequested = true;
  db.set('jobs', jobs);
  toast('Fotoğraf talebiniz gönderildi. İlan sahibi yüklediğinde görebileceksiniz.','ok');
  renderJobDetail(jobId);
}

function handleJobPhotoUpload(ev) {
  const files = ev.target.files;
  if (!files || !files.length) return;
  const jobId = S.jobId;
  let remaining = files.length;
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) { remaining--; return; }
    if (file.size > 3*1024*1024) { toast('Her fotoğraf 3MB\'den küçük olmalı','er'); remaining--; return; }
    const reader = new FileReader();
    reader.onload = e => {
      const jobs = db.arr('jobs');
      const idx = jobs.findIndex(j=>j.id===jobId);
      if (idx!==-1) {
        if (!jobs[idx].photos) jobs[idx].photos = [];
        jobs[idx].photos.push(e.target.result);
        db.set('jobs', jobs);
      }
      remaining--;
      if (remaining<=0) {
        toast('Fotoğraflar eklendi 🎉','ok');
        renderJobDetail(jobId);
      }
    };
    reader.readAsDataURL(file);
  });
  ev.target.value = '';
}

/* ----------------------------------------------------------------
   10. İLAN OLUŞTURMA (İŞ İLANI) — kontrol listesi dahil
   ---------------------------------------------------------------- */
function resetPostJob() {
  S.editingJobId = null;
  S.post = { step:1, catId:null, catName:null, catIcon:null, sub:null, checklist:[],
             availType:'flexible', availDate:'', availFrom:'', availTo:'', addressId:null };
  [1,2,3,4].forEach(s => document.getElementById('ps'+s)?.classList.toggle('hidden', s!==1));
  document.getElementById('ps-ok')?.classList.add('hidden');
  document.querySelector('#view-post-job .steps-row')?.classList.remove('hidden');
  updStepDots('s', 1);
  renderPostCats();
  populateCities();
  ['p-title','p-desc','p-budget','p-addr'].forEach(id => { const e=document.getElementById(id); if(e) e.value=''; });
  const availSel = document.getElementById('p-avail-type'); if (availSel) availSel.value='flexible';
  toggleAvailabilityFields();
  const saveChk = document.getElementById('p-save-addr'); if (saveChk) saveChk.checked=false;
  document.getElementById('p-save-addr-label-wrap')?.classList.add('hidden');
  renderAddressPicker('p');
  document.getElementById('ps4-title').textContent = '4. İlanı Onayla';
  document.getElementById('ps4-submit-btn').textContent = '✓ İlanı Yayınla';
  const anon = S.user ? S.user.anonName : '—';
  const a1=document.getElementById('p-anon-preview'); if(a1) a1.textContent=anon;
  const a2=document.getElementById('p-anon-preview2'); if(a2) a2.textContent=anon;
}

/* Düzenleme modunda ilan formunu var olan veriyle doldurur ve özet adımına atlar */
function renderEditJobForm() {
  const job = db.arr('jobs').find(j=>j.id===S.editingJobId);
  if (!job) { toast('İlan bulunamadı','er'); S.editingJobId=null; showView('dashboard-user'); return; }

  document.getElementById('ps-ok')?.classList.add('hidden');
  document.querySelector('#view-post-job .steps-row')?.classList.remove('hidden');
  renderPostCats();
  populateCities();

  pickCat(job.catId, job.catName, job.catIcon);
  const subOptions = (CATS.find(c=>c.id===job.catId)||{}).sub || [];
  const subIdx = subOptions.indexOf(job.sub);
  if (subIdx > -1) pickSub(job.sub, subIdx);

  document.getElementById('p-title').value = job.title;
  document.getElementById('p-desc').value = job.desc;
  document.getElementById('p-budget').value = job.budget || '';

  renderChecklist();
  (CHECKLISTS[job.catId]||[]).forEach((item,i) => {
    if ((job.checklist||[]).includes(item)) {
      const cb = document.querySelector(`#chk-${i} input[type=checkbox]`);
      if (cb) { cb.checked = true; toggleCheck(item, cb, i); }
    }
  });

  const av = job.availability || {};
  document.getElementById('p-avail-type').value = av.type || 'flexible';
  toggleAvailabilityFields();
  document.getElementById('p-avail-date').value = av.date || '';
  if (av.timeFrom) document.getElementById('p-avail-from').value = av.timeFrom;
  if (av.timeTo)   document.getElementById('p-avail-to').value = av.timeTo;

  renderAddressPicker('p');
  if (job.addressId && db.arr('addresses').some(a=>a.id===job.addressId)) {
    pickSavedAddress('p', job.addressId);
  } else {
    pickNewAddress('p');
    document.getElementById('p-city').value = job.city || '';
    fillDistricts('p-city','p-dist');
    document.getElementById('p-dist').value = job.district || '';
    document.getElementById('p-addr').value = job.addr || '';
  }

  const anon = S.user ? S.user.anonName : '—';
  document.getElementById('p-anon-preview').textContent = anon;
  document.getElementById('p-anon-preview2').textContent = anon;
  document.getElementById('ps4-title').textContent = '4. Değişiklikleri Onayla';
  document.getElementById('ps4-submit-btn').textContent = '✓ İlanı Güncelle';
  goStep(4);
}

function renderPostCats() {
  const g = document.getElementById('pcat-grid');
  if (!g) return;
  g.innerHTML = CATS.map(c => `
    <div class="pcat-card" id="pc-${c.id}" style="--col:${c.col};" onclick="pickCat('${c.id}','${c.name}','${c.icon}')">
      <span class="pcat-icon">${c.icon}</span>
      <span class="pcat-name">${c.name}</span>
    </div>`).join('');
}

function pickCat(id, name, icon) {
  document.querySelectorAll('#pcat-grid .pcat-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('pc-'+id)?.classList.add('sel');
  S.post.catId=id; S.post.catName=name; S.post.catIcon=icon; S.post.sub=null; S.post.checklist=[];
  const cat = CATS.find(c=>c.id===id);
  const area = document.getElementById('psubcat-area');
  const sg = document.getElementById('psubcat-grid');
  area.classList.remove('hidden');
  sg.innerHTML = cat.sub.map((s,i) => `
    <div class="pcat-card" id="psc-${i}" onclick="pickSub('${s.replace(/'/g,"\\'")}',${i})">
      <span class="pcat-name">${s}</span>
    </div>`).join('');
  document.getElementById('ps1-next').disabled = true;
  area.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function pickSub(sub, i) {
  document.querySelectorAll('#psubcat-grid .pcat-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('psc-'+i)?.classList.add('sel');
  S.post.sub = sub;
  document.getElementById('ps1-next').disabled = false;
}

function renderChecklist() {
  const wrap = document.getElementById('p-checklist-wrap');
  const grid = document.getElementById('p-checklist');
  const items = CHECKLISTS[S.post.catId] || [];
  if (!items.length) { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  grid.innerHTML = items.map((item,i) => `
    <label class="check-item" id="chk-${i}">
      <input type="checkbox" onchange="toggleCheck('${item.replace(/'/g,"\\'")}', this, ${i})" />
      <span>${esc(item)}</span>
    </label>`).join('');
}

function toggleCheck(item, input, i) {
  const wrap = document.getElementById('chk-'+i);
  if (input.checked) {
    if (!S.post.checklist.includes(item)) S.post.checklist.push(item);
    wrap.classList.add('checked');
  } else {
    S.post.checklist = S.post.checklist.filter(x=>x!==item);
    wrap.classList.remove('checked');
  }
}

/* Uygunluk (availability) alanları — Sprint 5 */
function toggleAvailabilityFields() {
  const type = document.getElementById('p-avail-type')?.value;
  document.getElementById('p-avail-specific')?.classList.toggle('hidden', type!=='specific');
}
function collectAvailabilityFromForm() {
  return {
    type: document.getElementById('p-avail-type')?.value || 'flexible',
    date: document.getElementById('p-avail-date')?.value || '',
    timeFrom: document.getElementById('p-avail-from')?.value || '',
    timeTo: document.getElementById('p-avail-to')?.value || '',
  };
}
function formatAvailability(av) {
  if (!av) return 'Esnek — herhangi bir zaman uyar';
  switch (av.type) {
    case 'weekday':  return 'Hafta İçi';
    case 'weekend':  return 'Hafta Sonu';
    case 'specific': return av.date ? `📅 ${fmtDate(av.date)} · 🕐 ${av.timeFrom||'—'}–${av.timeTo||'—'}` : 'Belirli tarih (girilmedi)';
    default:         return 'Esnek — herhangi bir zaman uyar';
  }
}

/* Kayıtlı adres seçici — hem post-job hem (ileride) post-wholesale için ortak.
   prefix: 'p' (ilan) — S.post.addressId üzerinden takip edilir. */
function renderAddressPicker(prefix) {
  const wrap = document.getElementById(`${prefix}-addr-picker`);
  const manualWrap = document.getElementById(`${prefix}-addr-manual`);
  if (!wrap) return;
  const myAddrs = S.user ? db.arr('addresses').filter(a=>a.userId===S.user.id) : [];
  if (!myAddrs.length) {
    wrap.innerHTML = '';
    manualWrap?.classList.remove('hidden');
    return;
  }
  wrap.innerHTML = `
    <label class="flabel">Adres Seçin</label>
    <div class="addr-grid" id="${prefix}-addr-grid">
      ${myAddrs.map(a => `
        <div class="addr-card" id="${prefix}-ac-${a.id}" onclick="pickSavedAddress('${prefix}','${a.id}')">
          <div class="addr-label">📍 ${esc(a.label)}</div>
          <div class="addr-loc">${esc(a.city)} / ${esc(a.district)}</div>
          <div class="addr-full">${esc(a.fullAddress)}</div>
        </div>`).join('')}
      <div class="addr-card" id="${prefix}-ac-new" onclick="pickNewAddress('${prefix}')">
        <div class="addr-label">➕ Yeni Adres Gir</div>
        <div class="addr-loc">Farklı bir adres kullan</div>
      </div>
    </div>`;
  manualWrap?.classList.add('hidden');
}
function pickSavedAddress(prefix, addressId) {
  document.querySelectorAll(`#${prefix}-addr-grid .addr-card`).forEach(c=>c.classList.remove('sel'));
  document.getElementById(`${prefix}-ac-${addressId}`)?.classList.add('sel');
  if (prefix==='p') S.post.addressId = addressId; else S.wpost.addressId = addressId;
  document.getElementById(`${prefix}-addr-manual`)?.classList.add('hidden');
}
function pickNewAddress(prefix) {
  document.querySelectorAll(`#${prefix}-addr-grid .addr-card`).forEach(c=>c.classList.remove('sel'));
  document.getElementById(`${prefix}-ac-new`)?.classList.add('sel');
  if (prefix==='p') S.post.addressId = null; else S.wpost.addressId = null;
  document.getElementById(`${prefix}-addr-manual`)?.classList.remove('hidden');
}

/* ----------------------------------------------------------------
   Profilim panelindeki "Kayıtlı Adreslerim" yönetimi (Sprint 5)
   ---------------------------------------------------------------- */
function renderMyAddresses() {
  if (!S.user) return;
  const myAddrs = db.arr('addresses').filter(a=>a.userId===S.user.id);
  const html = myAddrs.length ? myAddrs.map(a => `
    <div class="addr-card" style="cursor:default;margin-bottom:10px;">
      <div class="row-between">
        <div>
          <div class="addr-label">📍 ${esc(a.label)}</div>
          <div class="addr-loc">${esc(a.city)} / ${esc(a.district)}</div>
          <div class="addr-full" style="white-space:normal;">${esc(a.fullAddress)}</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteAddress('${a.id}')">🗑️ Sil</button>
      </div>
    </div>`).join('')
    : `<div class="empty-st" style="padding:32px;"><div class="empty-icon">📍</div><div class="empty-txt">Henüz kayıtlı adres yok</div>
       <div class="empty-sub">İlan verirken adres girip kaydedebilir, ya da buradan ekleyebilirsiniz.</div></div>`;
  const du = document.getElementById('du-addresses'); if (du) du.innerHTML = html;
  const dw = document.getElementById('dw-addresses'); if (dw) dw.innerHTML = html;
}

function openAddressModal() {
  if (!S.user) { openModal('m-auth'); return; }
  ['am-label','am-addr'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  populateCities();
  document.getElementById('am-city').value = '';
  document.getElementById('am-dist').innerHTML = '<option value="">Önce şehir seçin</option>';
  document.getElementById('am-dist').disabled = true;
  openModal('m-address');
}

function submitAddressForm() {
  if (!S.user) return;
  const label = document.getElementById('am-label')?.value.trim();
  const city  = document.getElementById('am-city')?.value;
  const dist  = document.getElementById('am-dist')?.value;
  const addr  = document.getElementById('am-addr')?.value.trim();
  if (!label) { toast('Adres etiketi girin (Örn: Ev, İş)','er'); return; }
  if (!city)  { toast('Şehir seçin','er'); return; }
  if (!dist)  { toast('İlçe seçin','er'); return; }
  if (!addr||addr.length<5) { toast('Tam adres girin','er'); return; }
  const addrs = db.arr('addresses');
  addrs.push({ id:'a'+Date.now(), userId:S.user.id, label, city, district:dist, fullAddress:addr });
  db.set('addresses', addrs);
  closeModal('m-address');
  toast('Adres kaydedildi','ok');
  renderMyAddresses();
}

function deleteAddress(addressId) {
  if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
  const addrs = db.arr('addresses').filter(a=>a.id!==addressId);
  db.set('addresses', addrs);
  toast('Adres silindi','nfo');
  renderMyAddresses();
}

function goStep(n) {
  if (n===2) { renderChecklist(); }
  if (n===3) {
    const t=document.getElementById('p-title')?.value.trim();
    const d=document.getElementById('p-desc')?.value.trim();
    if (!t) { toast('Lütfen ilan başlığı girin','er'); return; }
    if (!d||d.length<15) { toast('İş açıklaması en az 15 karakter olmalı','er'); return; }
  }
  if (n===4) {
    if (!S.post.addressId) {
      const city=document.getElementById('p-city')?.value;
      const dist=document.getElementById('p-dist')?.value;
      if (!city) { toast('Lütfen şehir seçin veya kayıtlı bir adres seçin','er'); return; }
      if (!dist) { toast('Lütfen ilçe seçin','er'); return; }
    }
    renderPostSummary();
  }
  [1,2,3,4].forEach(s => document.getElementById('ps'+s)?.classList.add('hidden'));
  document.getElementById('ps'+n)?.classList.remove('hidden');
  updStepDots('s', n);
  document.querySelector('#view-post-job .post-wrap')?.scrollIntoView({ behavior:'smooth' });
}

/* Genel adım göstergesi güncelleyici. prefix: 's' (ilan) veya 'ws' (toptan) */
function updStepDots(prefix, cur) {
  const total = prefix==='ws' ? 5 : 4;
  for (let s=1; s<=total; s++) {
    const dot = document.getElementById(prefix+'d'+s);
    if (!dot) continue;
    dot.classList.remove('on','done');
    const circle = dot.querySelector('.step-circle');
    if (s < cur) { dot.classList.add('done'); circle.textContent='✓'; }
    else if (s===cur) { dot.classList.add('on'); circle.textContent=s; }
    else { circle.textContent=s; }
  }
  for (let s=1; s<total; s++) {
    const ln = document.getElementById(prefix+'l'+s);
    if (ln) ln.classList.toggle('done', s<cur);
  }
}

function renderPostSummary() {
  const t=document.getElementById('p-title')?.value.trim()||'';
  const d=document.getElementById('p-desc')?.value.trim()||'';
  const b=document.getElementById('p-budget')?.value.trim()||'';
  let city, dist, addrLabelPrefix='';
  if (S.post.addressId) {
    const savedAddr = db.arr('addresses').find(a=>a.id===S.post.addressId);
    city = savedAddr?.city||''; dist = savedAddr?.district||'';
    addrLabelPrefix = savedAddr ? `${esc(savedAddr.label)} — ` : '';
  } else {
    city = document.getElementById('p-city')?.value||'';
    dist = document.getElementById('p-dist')?.value||'';
  }
  const cat=CATS.find(c=>c.id===S.post.catId);
  const clHtml = S.post.checklist.length
    ? `<tr><td>Ek Hizmetler</td><td>${S.post.checklist.map(esc).join(', ')}</td></tr>` : '';
  const availHtml = formatAvailability(collectAvailabilityFromForm());
  document.getElementById('p-summary').innerHTML = `
    <table class="sum-table">
      <tr><td>Kategori</td><td>${cat?.icon||''} ${esc(S.post.catName)} → ${esc(S.post.sub)}</td></tr>
      <tr><td>Başlık</td><td>${esc(t)}</td></tr>
      <tr><td>Açıklama</td><td>${esc(d.substring(0,120))}${d.length>120?'...':''}</td></tr>
      ${clHtml}
      <tr><td>Uygunluk</td><td>${availHtml}</td></tr>
      <tr><td>Konum</td><td>📍 ${addrLabelPrefix}${esc(city)} / ${esc(dist)}</td></tr>
      ${b?`<tr><td>Bütçe</td><td>💰 ${esc(b)}</td></tr>`:''}
      <tr><td>Rumuz</td><td>${S.user?S.user.anonName:'—'}</td></tr>
    </table>`;
}

function submitJob() {
  if (!S.user) { openModal('m-auth'); return; }
  const t = document.getElementById('p-title')?.value.trim();
  const d = document.getElementById('p-desc')?.value.trim();
  const b = document.getElementById('p-budget')?.value.trim();
  const availability = collectAvailabilityFromForm();

  let city, dist, addr, addressId = null;
  if (S.post.addressId) {
    const savedAddr = db.arr('addresses').find(a=>a.id===S.post.addressId);
    if (savedAddr) { city=savedAddr.city; dist=savedAddr.district; addr=savedAddr.fullAddress; addressId=savedAddr.id; }
  }
  if (!city) {
    city = document.getElementById('p-city')?.value;
    dist = document.getElementById('p-dist')?.value;
    addr = document.getElementById('p-addr')?.value.trim();
    const saveChk = document.getElementById('p-save-addr');
    if (saveChk && saveChk.checked && city && dist) {
      const label = document.getElementById('p-save-addr-label')?.value.trim() || 'Adresim';
      const newAddr = { id:'a'+Date.now(), userId:S.user.id, label, city, district:dist, fullAddress:addr };
      const addrs = db.arr('addresses'); addrs.push(newAddr); db.set('addresses', addrs);
      addressId = newAddr.id;
    }
  }

  const isEdit = !!S.editingJobId;
  const jobs = db.arr('jobs');

  if (isEdit) {
    const idx = jobs.findIndex(j=>j.id===S.editingJobId);
    if (idx===-1) { toast('İlan bulunamadı','er'); return; }
    jobs[idx] = {
      ...jobs[idx],
      catId:S.post.catId, catName:S.post.catName, catIcon:S.post.catIcon, sub:S.post.sub,
      title:t, desc:d, checklist:[...S.post.checklist], availability,
      city, district:dist, addr, addressId, budget:b||null,
      status:'pending_review',
    };
    applyAutoFlag(jobs[idx], [t, d]);
    db.set('jobs', jobs);
    document.getElementById('ps-ok-icon').textContent = '🕐';
    document.getElementById('ps-ok-title').textContent = 'Değişiklikler İncelemeye Alındı';
    document.getElementById('ps-ok-sub').textContent = 'İlanınız onaylanana kadar yalnızca sizin panelinizde görünür. Onaylandığında yeniden yayına girecek.';
    document.getElementById('ps-ok-email-title').textContent = '📧 Bilgilendirme (simülasyon)';
    document.getElementById('p-email-sim').innerHTML =
      `"${esc(t)}" ilanınızdaki değişiklikler onay bekliyor.<br>Bu bir prototip incelemesidir — gerçek moderasyon sunucu tarafında yapılır.`;
    toast('İlan güncellendi — inceleme onayı bekleniyor','ok');
    S.editingJobId = null;
  } else {
    const job = {
      id:'j'+Date.now(), userId:S.user.id,
      catId:S.post.catId, catName:S.post.catName, catIcon:S.post.catIcon, sub:S.post.sub,
      title:t, desc:d, checklist:[...S.post.checklist], availability,
      city, district:dist, addr, addressId, budget:b||null,
      photoRequested:false, photos:[],
      flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
      status:'open', createdAt:new Date().toISOString(), offerIds:[],
    };
    applyAutoFlag(job, [t, d]);
    jobs.push(job); db.set('jobs',jobs);
    const wCount = db.arr('workers').filter(w=>w.city===city).length;
    document.getElementById('ps-ok-icon').textContent = '🎉';
    document.getElementById('ps-ok-title').textContent = 'İlanınız Yayınlandı!';
    document.getElementById('ps-ok-sub').textContent = 'Bölgenizdeki ustalar e-posta ile haberdar edildi. Teklif gelince sizi bilgilendireceğiz.';
    document.getElementById('ps-ok-email-title').textContent = '📧 E-posta gönderildi (simülasyon)';
    document.getElementById('p-email-sim').innerHTML =
      `Konu: UstaBul – ${city}'de yeni ${S.post.catName} ilanı<br>
       ${wCount} usta e-posta ile bilgilendirildi.<br>
       İlan: "${esc(t)}" — Rumuz: ${S.user.anonName}`;
    if (job.flagged) {
      toast('İlanınız yayınlandı, ancak paylaşım kuralları açısından incelemeye alındı 🔍','nfo');
    } else {
      toast('İlanınız yayınlandı! 🎉','ok');
    }
  }

  [1,2,3,4].forEach(s=>document.getElementById('ps'+s)?.classList.add('hidden'));
  document.querySelector('#view-post-job .steps-row')?.classList.add('hidden');
  document.getElementById('ps-ok')?.classList.remove('hidden');
}

/* ----------------------------------------------------------------
   10b. İLAN DÜZENLE / SİL / ONAYI SİMÜLE ET (Sprint 5)
   ---------------------------------------------------------------- */
function startEditJob(jobId) {
  const job = db.arr('jobs').find(j=>j.id===jobId);
  if (!job) { toast('İlan bulunamadı','er'); return; }
  if (!S.user || S.user.id !== job.userId) { toast('Bu ilanı düzenleme yetkiniz yok','er'); return; }
  if (job.status!=='open' && job.status!=='pending_review') {
    toast('Bu ilan artık düzenlenemez (teklif kabul edilmiş)','er'); return;
  }
  S.editingJobId = jobId;
  showView('post-job');
}

function deleteJob(jobId) {
  const job = db.arr('jobs').find(j=>j.id===jobId);
  if (!job) return;
  if (!S.user || S.user.id !== job.userId) { toast('Bu ilanı silme yetkiniz yok','er'); return; }
  if (!confirm('Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;
  const jobs = db.arr('jobs');
  const idx = jobs.findIndex(j=>j.id===jobId);
  if (idx!==-1) { jobs[idx].status='deleted'; db.set('jobs', jobs); }
  toast('İlan silindi','nfo');
  if (S.view==='job-detail') showView('dashboard-user');
  else renderUserDash();
}

/* Gerçek moderasyon Sprint 7/8'de gelecek — şimdilik onayı simüle eden demo düğmesi */
function simulateApproveJob(jobId) {
  const jobs = db.arr('jobs');
  const idx = jobs.findIndex(j=>j.id===jobId);
  if (idx===-1) return;
  jobs[idx].status = 'open';
  db.set('jobs', jobs);
  toast('İnceleme onaylandı (simülasyon) — ilan yeniden yayında','ok');
  renderJobDetail(jobId);
}

/* ----------------------------------------------------------------
   11. TOPTAN ALIM TALEBİ OLUŞTURMA (5 ADIM)
   ---------------------------------------------------------------- */
function resetPostWholesale() {
  if (!S.user) { openModal('m-auth'); showView('home'); return; }
  S.wpost = { step:1, catId:null, catName:null, catIcon:null, sub:null, brand:null,
              qty:null, unit:'Adet', note:'', delivery:null, city:null, district:null, addr:'', addressId:null };
  [1,2,3,4,5].forEach(s => document.getElementById('ws'+s)?.classList.toggle('hidden', s!==1));
  document.getElementById('ws-ok')?.classList.add('hidden');
  document.querySelector('#view-post-wholesale .steps-row')?.classList.remove('hidden');
  updStepDots('ws', 1);
  renderWPostCats();
  populateCities();
  document.querySelectorAll('.del-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('w-ship-fields')?.classList.add('hidden');
  ['w-qty','w-note','w-addr','w-brand-other'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  const u=document.getElementById('w-unit'); if(u) u.value='Adet';
  const saveChk = document.getElementById('w-save-addr'); if (saveChk) saveChk.checked=false;
}

function renderWPostCats() {
  const g = document.getElementById('wpcat-grid');
  if (!g) return;
  const cats = CATS.filter(c=>WHOLESALE_CAT_IDS.includes(c.id));
  g.innerHTML = cats.map(c => `
    <div class="pcat-card" id="wpc-${c.id}" style="--col:${c.col};" onclick="wPickCat('${c.id}','${c.name}','${c.icon}')">
      <span class="pcat-icon">${c.icon}</span>
      <span class="pcat-name">${c.name}</span>
    </div>`).join('');
}

function wPickCat(id, name, icon) {
  document.querySelectorAll('#wpcat-grid .pcat-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('wpc-'+id)?.classList.add('sel');
  S.wpost.catId=id; S.wpost.catName=name; S.wpost.catIcon=icon; S.wpost.sub=null; S.wpost.brand=null;
  const cat = CATS.find(c=>c.id===id);
  const area = document.getElementById('wsubcat-area');
  const sg = document.getElementById('wsubcat-grid');
  area.classList.remove('hidden');
  sg.innerHTML = cat.sub.map((s,i) => `
    <div class="pcat-card" id="wsc-${i}" onclick="wPickSub('${s.replace(/'/g,"\\'")}',${i})">
      <span class="pcat-name">${s}</span>
    </div>`).join('');
  document.getElementById('ws1-next').disabled = true;
  area.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

function wPickSub(sub, i) {
  document.querySelectorAll('#wsubcat-grid .pcat-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('wsc-'+i)?.classList.add('sel');
  S.wpost.sub = sub;
  document.getElementById('ws1-next').disabled = false;
}

function renderBrandGrid() {
  const g = document.getElementById('wbrand-grid');
  const brands = BRANDS[S.wpost.catId] || ['Diğer'];
  g.innerHTML = brands.map((b,i) => `
    <div class="pcat-card" id="wbr-${i}" onclick="pickBrand('${b.replace(/'/g,"\\'")}',${i})">
      <span class="pcat-name">${esc(b)}</span>
    </div>`).join('');
  document.getElementById('wbrand-other-wrap').classList.add('hidden');
}

function pickBrand(brand, i) {
  document.querySelectorAll('#wbrand-grid .pcat-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById('wbr-'+i)?.classList.add('sel');
  const otherWrap = document.getElementById('wbrand-other-wrap');
  if (brand === 'Diğer') {
    otherWrap.classList.remove('hidden');
    S.wpost.brand = null;
    document.getElementById('w-brand-other').focus();
  } else {
    otherWrap.classList.add('hidden');
    S.wpost.brand = brand;
  }
}

function pickDelivery(type) {
  document.getElementById('wdc-ship')?.classList.toggle('sel', type==='ship');
  document.getElementById('wdc-pickup')?.classList.toggle('sel', type==='pickup');
  S.wpost.delivery = type;
  document.getElementById('w-ship-fields')?.classList.toggle('hidden', type!=='ship');
  if (type==='ship') {
    renderAddressPicker('w');
  } else {
    S.wpost.addressId = null;
  }
}

function wGoStep(n) {
  if (n===2) { renderBrandGrid(); }
  if (n===3) {
    if (!S.wpost.catId) { toast('Lütfen kategori seçin','er'); return; }
    const other = document.getElementById('w-brand-other')?.value.trim();
    if (!S.wpost.brand && !other) { toast('Lütfen bir marka seçin veya yazın','er'); return; }
    if (!S.wpost.brand && other) S.wpost.brand = other;
  }
  if (n===4) {
    const qty = document.getElementById('w-qty')?.value;
    if (!qty || Number(qty)<=0) { toast('Lütfen geçerli bir miktar girin','er'); return; }
    S.wpost.qty = Number(qty);
    S.wpost.unit = document.getElementById('w-unit')?.value || 'Adet';
    S.wpost.note = document.getElementById('w-note')?.value.trim();
  }
  if (n===5) {
    if (!S.wpost.delivery) { toast('Lütfen teslimat tercihi seçin','er'); return; }
    const city=document.getElementById('w-city')?.value;
    const dist=document.getElementById('w-dist')?.value;
    if (!city) { toast('Lütfen şehir seçin','er'); return; }
    if (!dist) { toast('Lütfen ilçe seçin','er'); return; }
    S.wpost.city=city; S.wpost.district=dist;
    if (S.wpost.delivery==='ship') {
      if (!S.wpost.addressId) {
        const addr = document.getElementById('w-addr')?.value.trim();
        if (!addr) { toast('Kargo için tam adres girin veya kayıtlı bir adres seçin','er'); return; }
        S.wpost.addr = addr;
      }
    } else {
      S.wpost.addr = '';
    }
    renderDemandSummary();
  }
  [1,2,3,4,5].forEach(s => document.getElementById('ws'+s)?.classList.add('hidden'));
  document.getElementById('ws'+n)?.classList.remove('hidden');
  updStepDots('ws', n);
  document.querySelector('#view-post-wholesale .post-wrap')?.scrollIntoView({ behavior:'smooth' });
}

function renderDemandSummary() {
  const cat=CATS.find(c=>c.id===S.wpost.catId);
  let addrLine = '';
  if (S.wpost.delivery==='ship') {
    if (S.wpost.addressId) {
      const savedAddr = db.arr('addresses').find(a=>a.id===S.wpost.addressId);
      addrLine = `<tr><td>Teslimat Adresi</td><td>📍 ${savedAddr?esc(savedAddr.label)+' — ':''}${esc(savedAddr?.fullAddress||'')}</td></tr>`;
    } else {
      addrLine = `<tr><td>Teslimat Adresi</td><td>📍 ${esc(document.getElementById('w-addr')?.value.trim()||'')}</td></tr>`;
    }
  }
  document.getElementById('w-summary').innerHTML = `
    <table class="sum-table">
      <tr><td>Kategori</td><td>${cat?.icon||''} ${esc(S.wpost.catName)} → ${esc(S.wpost.sub)}</td></tr>
      <tr><td>Marka</td><td>${esc(S.wpost.brand)}</td></tr>
      <tr><td>Miktar</td><td>${S.wpost.qty} ${esc(S.wpost.unit)}</td></tr>
      ${S.wpost.note?`<tr><td>Not</td><td>${esc(S.wpost.note)}</td></tr>`:''}
      <tr><td>Teslimat</td><td>${S.wpost.delivery==='ship'?'📦 Adresime Gönderilsin':'🚗 Kendim Gelip Alacağım'}</td></tr>
      <tr><td>Konum</td><td>📍 ${esc(S.wpost.city)} / ${esc(S.wpost.district)}</td></tr>
      ${addrLine}
      <tr><td>Rumuz</td><td>${S.user?S.user.anonName:'—'}</td></tr>
    </table>`;
}

function submitDemand() {
  if (!S.user) { openModal('m-auth'); return; }
  let addr = '', addressId = null;
  if (S.wpost.delivery==='ship') {
    if (S.wpost.addressId) {
      const savedAddr = db.arr('addresses').find(a=>a.id===S.wpost.addressId);
      if (savedAddr) { addr = savedAddr.fullAddress; addressId = savedAddr.id; }
    } else {
      addr = document.getElementById('w-addr')?.value.trim() || '';
      const saveChk = document.getElementById('w-save-addr');
      if (saveChk && saveChk.checked && addr) {
        const label = document.getElementById('w-save-addr-label')?.value.trim() || 'Adresim';
        const newAddr = { id:'a'+Date.now(), userId:S.user.id, label, city:S.wpost.city, district:S.wpost.district, fullAddress:addr };
        const addrs = db.arr('addresses'); addrs.push(newAddr); db.set('addresses', addrs);
        addressId = newAddr.id;
      }
    }
  }
  const demand = {
    id:'d'+Date.now(), userId:S.user.id,
    catId:S.wpost.catId, catName:S.wpost.catName, catIcon:S.wpost.catIcon, sub:S.wpost.sub,
    brand:S.wpost.brand, qty:S.wpost.qty, unit:S.wpost.unit, note:S.wpost.note||'',
    delivery:S.wpost.delivery, city:S.wpost.city, district:S.wpost.district, addr, addressId,
    flagged:false, flagReasons:[], flagStatus:null, flagNotes:'', adminHidden:false,
    status:'open', createdAt:new Date().toISOString(), offerIds:[],
  };
  applyAutoFlag(demand, [demand.note, demand.brand]);
  const demands=db.arr('demands'); demands.push(demand); db.set('demands',demands);
  const sCount = db.arr('workers').length;
  document.getElementById('w-email-sim').innerHTML =
    `Konu: UstaBul – Yeni ${S.wpost.catName} toptan alım talebi<br>
     ${sCount} satıcı e-posta ile bilgilendirildi.<br>
     Talep: "${esc(S.wpost.brand)} — ${S.wpost.qty} ${esc(S.wpost.unit)}" — Rumuz: ${S.user.anonName}`;
  [1,2,3,4,5].forEach(s=>document.getElementById('ws'+s)?.classList.add('hidden'));
  document.querySelector('#view-post-wholesale .steps-row')?.classList.add('hidden');
  document.getElementById('ws-ok')?.classList.remove('hidden');
  if (demand.flagged) {
    toast('Talebiniz yayınlandı, ancak paylaşım kuralları açısından incelemeye alındı 🔍','nfo');
  } else {
    toast('Talebiniz yayınlandı! 🎉','ok');
  }
}

/* ----------------------------------------------------------------
   12. TOPTAN ALIM — Hazır Ürünler / Talepler görünümü
   ---------------------------------------------------------------- */
function renderWholesale() {
  document.getElementById('wholesale-prods').innerHTML = db.arr('products').map(prodCardHTML).join('');
  renderWholesaleDemands();
}

function renderWholesaleDemands() {
  const demands = db.arr('demands').filter(d=>d.status!=='deleted' && !d.adminHidden).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const el = document.getElementById('wholesale-demands');
  if (!el) return;
  el.innerHTML = demands.length ? demands.map(demandCardHTML).join('')
    : `<div class="empty-st" style="grid-column:1/-1;"><div class="empty-icon">🔍</div><div class="empty-txt">Henüz talep yok</div></div>`;
}

function wholesaleTab(tab) {
  document.getElementById('wtab-prod')?.classList.toggle('on', tab==='prod');
  document.getElementById('wtab-dem')?.classList.toggle('on', tab==='dem');
  document.getElementById('wpanel-prod')?.classList.toggle('hidden', tab!=='prod');
  document.getElementById('wpanel-dem')?.classList.toggle('hidden', tab!=='dem');
  if (tab==='dem') renderWholesaleDemands();
}

function openProdModal(pid) {
  const p = db.arr('products').find(x=>x.id===pid);
  if (!p) return;
  const cat = CATS.find(c=>c.id===p.catId);
  const cc = catColor(p.catId);
  const fallbackIcon = (cat ? cat.icon : p.icon) || '📦';
  const imgHtml = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:cover;"
         onerror="this.parentElement.style.background='${cc.bg}';this.parentElement.innerHTML='${fallbackIcon}';" />`
    : fallbackIcon;
  document.getElementById('prod-title').textContent = p.name;
  document.getElementById('prod-body').innerHTML = `
    <div style="display:flex;gap:var(--s5);margin-bottom:var(--s5);flex-wrap:wrap;">
      <div style="width:130px;height:130px;background:${p.image?'var(--bg-alt)':cc.bg};border:1.5px solid var(--border);border-radius:var(--r);
                  display:flex;align-items:center;justify-content:center;font-size:48px;flex-shrink:0;overflow:hidden;">${imgHtml}</div>
      <div style="flex:1;">
        <div style="font-size:var(--fs-sm);color:var(--muted);margin-bottom:4px;">Marka: <strong>${esc(p.brand)}</strong> · Satıcı: ${esc(p.seller)}</div>
        <div style="font-size:var(--fs-2xl);font-weight:900;color:var(--green-dk);">${Number(p.price).toLocaleString('tr-TR')} ₺</div>
        <div style="font-size:var(--fs-sm);color:var(--muted);">/ ${esc(p.unit)}</div>
        <div style="margin-top:var(--s3);padding:var(--s3) var(--s4);background:rgba(232,200,96,.22);border-radius:var(--r-sm);
                    font-size:var(--fs-sm);font-weight:700;color:var(--dark);">Min. sipariş: ${p.minOrder} adet</div>
      </div>
    </div>
    <p style="color:var(--dark-2);margin-bottom:var(--s4);">${esc(p.desc)}</p>
    <hr class="divider">
    <p style="font-size:var(--fs-sm);color:var(--muted);">${esc(p.detail)}</p>`;
  openModal('m-prod');
}

/* ----------------------------------------------------------------
   13. TOPTAN TALEP DETAY
   ---------------------------------------------------------------- */
function renderDemandDetail(demandId) {
  const d = db.arr('demands').find(x=>x.id===demandId);
  if (!d) { toast('Talep bulunamadı','er'); showView('wholesale'); return; }
  const owner = ownerAnon(d.userId);

  const viewerIsOwner = S.user && S.user.id === d.userId;
  if (d.status==='deleted' && !viewerIsOwner) {
    toast('Bu talep şu anda görüntülenemez','er'); showView('wholesale'); return;
  }
  if (d.adminHidden && !isSuperAdmin()) {
    toast('Bu talep şu anda görüntülenemez','er'); showView('wholesale'); return;
  }

  const isModerator = S.user && (S.user.isAdmin || S.user.isTrustedWorker);
  const showFlagBanner = d.flagged && d.flagStatus==='pending' && (viewerIsOwner || isModerator);
  document.getElementById('dd-flag-banner')?.classList.toggle('hidden', !showFlagBanner);
  if (showFlagBanner) {
    document.getElementById('dd-flag-reasons').innerHTML =
      (d.flagReasons||[]).map(r=>`<span class="badge ${flagReasonBadgeClass(r)}">${flagReasonLabel(r)}</span>`).join('');
  }

  const ownerUserD = findUserById(d.userId);
  document.getElementById('dd-admin-panel')?.classList.toggle('hidden', !isSuperAdmin());
  if (isSuperAdmin()) {
    document.getElementById('dd-admin-name').textContent = ownerUserD?.name || '(bulunamadı)';
    document.getElementById('dd-admin-email').textContent = ownerUserD?.email || '—';
    document.getElementById('dd-admin-addr').textContent = d.addr ? `${d.addr} — ${d.city}/${d.district}` : `(tam adres girilmemiş) — ${d.city}/${d.district}`;
    const hideBtnD = document.getElementById('dd-admin-hide-btn');
    hideBtnD.textContent = d.adminHidden ? '✓ Görünürlüğü Geri Ver' : '👁️‍🗨️ Sadece Bana Görünür Yap';
    const logKeyD = 'demand:'+d.id;
    if (!S._loggedIdentityViews.has(logKeyD)) {
      S._loggedIdentityViews.add(logKeyD);
      logAuditAction('view_identity', 'demand', d.id, `${d.brand} — ${ownerUserD?.name||'?'}`);
    }
  }

  document.getElementById('dd-title').textContent = `${d.brand} — ${d.qty} ${d.unit}`;
  document.getElementById('dd-anon-owner').textContent = owner;
  document.getElementById('dd-cat').textContent = `${d.catIcon} ${d.catName}`;
  document.getElementById('dd-sub').textContent = d.sub;
  document.getElementById('dd-brand').textContent = d.brand;
  document.getElementById('dd-amount').textContent = `${d.qty} ${d.unit}`;
  document.getElementById('dd-delivery').textContent = d.delivery==='ship' ? '📦 Adresime Gönderilsin (kargo ücreti teklifte belirtilir)' : '🚗 Kendim Gelip Alacağım';
  document.getElementById('dd-loc').textContent = `📍 ${d.city} / ${d.district}`;
  document.getElementById('dd-owner').textContent = owner;
  document.getElementById('dd-date').textContent = fmtDate(d.createdAt);
  document.getElementById('dd-badges').innerHTML = `
    <span class="badge badge-sage">${d.catIcon} ${esc(d.sub)}</span>
    <span class="badge badge-${d.status==='open'?'green':'gray'}">${d.status==='open'?'✓ Açık':'Kapalı'}</span>
    <span class="badge badge-sky">${d.delivery==='ship'?'📦 Kargo':'🚗 Elden Teslim'}</span>`;

  const noteWrap=document.getElementById('dd-note-wrap');
  if (d.note) { noteWrap.classList.remove('hidden'); document.getElementById('dd-note').textContent=d.note; }
  else { noteWrap.classList.add('hidden'); }

  const offers = db.arr('demandOffers').filter(o=>o.demandId===demandId);
  document.getElementById('dd-offer-cnt').textContent = `${offers.length} teklif`;
  const ofEl = document.getElementById('dd-offers');
  if (!offers.length) {
    ofEl.innerHTML = `<div class="empty-st" style="padding:40px;">
      <div class="empty-icon">📭</div><div class="empty-txt">Henüz teklif yok</div>
      <div class="empty-sub">İlk teklifi siz verin!</div></div>`;
  } else {
    ofEl.innerHTML = offers.map(o => {
      const sw = findWorkerById(o.sellerId);
      const anon = sellerAnon(o.sellerId);
      const isOwner = S.user && S.user.id === d.userId;
      const revealed = o.status==='accepted';
      const displayName = revealed ? `${anon} <span style="color:var(--muted);font-weight:400;">· ${esc(sw?.name||'')}</span>` : anon;
      return `
        <div class="offer-item ${o.status==='accepted'?'accepted':''}" onclick="S.workerId='${o.sellerId}';showView('worker-profile')">
          <div class="offer-av">${anon.replace(/[^0-9]/g,'').slice(0,1)||'S'}</div>
          <div class="offer-info">
            <div class="offer-wname">${displayName}
              ${revealed?'<span class="badge badge-green" style="margin-left:6px;">✓ Kabul Edildi</span>':''}
            </div>
            <div class="offer-stars">★ ${sw?.rating||'—'} · <span style="color:var(--green-dk);">Profili gör →</span></div>
            <div class="offer-desc">${esc(o.desc)}</div>
            <div style="font-size:var(--fs-xs);color:var(--muted);margin-top:4px;">
              Birim: ${Number(o.unitPrice).toLocaleString('tr-TR')} ₺
              ${o.shipping?` · Kargo: ${Number(o.shipping).toLocaleString('tr-TR')} ₺`:''}
              · ${fmtDate(o.createdAt)}
            </div>
          </div>
          <div style="flex-shrink:0;text-align:right;">
            <div class="offer-price">${Number(o.totalPrice + (o.shipping||0)).toLocaleString('tr-TR')} ₺</div>
            ${isOwner && o.status==='pending' && d.status==='open' ?
              `<button class="btn btn-primary btn-sm" style="margin-top:8px;"
                       onclick="event.stopPropagation();acceptDemandOffer('${o.id}','${demandId}')">✓ Kabul Et</button>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  const isOwner  = S.user && S.user.id === d.userId;
  const isSeller = S.user && (S.user.role==='worker'||S.user.role==='both');
  const alreadyOffered = offers.some(o => S.user && o.sellerId===S.user.id);
  const actionEl = document.getElementById('dd-action');

  if (isOwner) {
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:10px;">Bu Talep Sizin</h3>
      <p style="color:var(--muted);">Gelen teklifleri inceleyip kabul edebilirsiniz.</p>
      <hr class="divider">
      <button class="btn btn-ghost btn-full" onclick="showView('dashboard-user')">Taleplerime Dön</button>
      ${moderatorReportButtonHTML(d, isModerator, 'demand')}`;
  } else if (isSeller && alreadyOffered) {
    actionEl.innerHTML = `
      <div style="text-align:center;padding:16px 0;">
        <div style="font-size:44px;margin-bottom:12px;">✅</div>
        <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Teklifiniz Gönderildi</h3>
        <p style="color:var(--muted);">Kabul edildiğinde e-posta ile bilgilendirileceksiniz.</p>
      </div>
      ${moderatorReportButtonHTML(d, isModerator, 'demand')}`;
  } else if (isSeller) {
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Teklif Ver</h3>
      <p style="color:var(--muted);margin-bottom:16px;">Bu ürünü satabiliyorsanız rumuzunuzla (<strong>${S.user.anonName}</strong>) teklif gönderin.</p>
      <button class="btn btn-primary btn-full btn-lg" onclick="openDemandOfferModal('${demandId}')">💬 Teklif Gönder</button>
      ${moderatorReportButtonHTML(d, isModerator, 'demand')}`;
  } else {
    actionEl.innerHTML = `
      <h3 style="font-size:var(--fs-lg);font-weight:700;margin-bottom:8px;">Satıcı mısınız?</h3>
      <p style="color:var(--muted);margin-bottom:16px;">Giriş yapın ve bu talebe teklif verin.</p>
      <button class="btn btn-primary btn-full" onclick="openModal('m-auth')">Giriş Yap / Kayıt Ol</button>`;
  }
}

function acceptDemandOffer(offerId, demandId) {
  const offers = db.arr('demandOffers');
  const idx = offers.findIndex(o=>o.id===offerId);
  if (idx===-1) return;
  offers[idx].status='accepted';
  db.set('demandOffers', offers);
  const demands=db.arr('demands');
  const di=demands.findIndex(d=>d.id===demandId);
  if (di!==-1) { demands[di].status='in_progress'; db.set('demands',demands); }
  toast('Teklif kabul edildi! Gerçek isim ve iletişim bilgileri artık görünür.','ok');
  renderDemandDetail(demandId);
}

function openDemandOfferModal(demandId) {
  if (!S.user) { openModal('m-auth'); return; }
  if (S.user.role==='user') { toast('Teklif vermek için satıcı (usta) hesabı gerekir','er'); return; }
  S.offerDemandId = demandId;
  const d = db.arr('demands').find(x=>x.id===demandId);
  ['do-unit-price','do-total-price','do-shipping','do-desc'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  document.getElementById('do-shipping-wrap')?.classList.toggle('hidden', !(d && d.delivery==='ship'));
  openModal('m-demand-offer');
}

function submitDemandOffer() {
  const unitPrice=document.getElementById('do-unit-price')?.value;
  const totalPrice=document.getElementById('do-total-price')?.value;
  const shipping=document.getElementById('do-shipping')?.value;
  const desc=document.getElementById('do-desc')?.value.trim();
  if (!unitPrice||Number(unitPrice)<=0)  { toast('Geçerli bir birim fiyat girin','er'); return; }
  if (!totalPrice||Number(totalPrice)<=0){ toast('Geçerli bir toplam fiyat girin','er'); return; }
  if (!desc||desc.length<5) { toast('Açıklama en az 5 karakter olmalı','er'); return; }
  const offer={ id:'do'+Date.now(), demandId:S.offerDemandId, sellerId:S.user.id,
    unitPrice:Number(unitPrice), totalPrice:Number(totalPrice), shipping:shipping?Number(shipping):0,
    desc, status:'pending', createdAt:new Date().toISOString() };
  const offers=db.arr('demandOffers'); offers.push(offer); db.set('demandOffers',offers);
  const demands=db.arr('demands');
  const di=demands.findIndex(d=>d.id===S.offerDemandId);
  if (di!==-1) { if(!demands[di].offerIds) demands[di].offerIds=[]; demands[di].offerIds.push(offer.id); db.set('demands',demands); }
  toast('Teklifiniz gönderildi! Talep sahibi e-posta ile bilgilendirildi.','ok');
  closeModal('m-demand-offer');
  if (S.view==='demand-detail') renderDemandDetail(S.offerDemandId);
}

/* ----------------------------------------------------------------
   14. USTA / SATICI PROFİLİ (her zaman rumuzla gösterilir)
   ---------------------------------------------------------------- */
function renderWorkerProfile(wId) {
  const w = db.arr('workers').find(x=>x.id===wId);
  if (!w) { toast('Profil bulunamadı','er'); return; }
  const stars = n => '★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
  document.getElementById('wp-av').textContent      = w.anonName.replace(/[^0-9]/g,'').slice(0,1) || 'S';
  document.getElementById('wp-name').textContent    = w.anonName;
  document.getElementById('wp-stars').textContent   = stars(w.rating);
  document.getElementById('wp-meta').textContent    = `${w.city} / ${w.district} · ${w.ratingCount} değerlendirme`;

  // Yönetici Görünümü — Sprint 8
  document.getElementById('wp-admin-chip')?.classList.toggle('hidden', !isSuperAdmin());
  if (isSuperAdmin()) {
    document.getElementById('wp-admin-name').textContent = `${w.name} · ${w.email}`;
    const logKey = 'worker:'+w.id;
    if (!S._loggedIdentityViews.has(logKey)) {
      S._loggedIdentityViews.add(logKey);
      logAuditAction('view_identity', 'worker', w.id, `${w.anonName} — ${w.name}`);
    }
  }

  document.getElementById('wp-bio').textContent     = w.bio;
  document.getElementById('wp-loc').textContent     = `${w.city} / ${w.district}`;
  document.getElementById('wp-done').textContent    = `${w.jobsDone} iş`;
  document.getElementById('wp-since').textContent   = `${w.joinedYear} yılından beri`;
  document.getElementById('wp-rat-big').textContent = w.rating.toFixed(1);
  document.getElementById('wp-rat-stars').textContent = stars(w.rating);
  document.getElementById('wp-rat-cnt').textContent = `${w.ratingCount} değerlendirme`;
  document.getElementById('wp-skills').innerHTML    =
    (w.skills||[]).map(s=>`<span class="badge badge-sage">${esc(s)}</span>`).join('');
  const reviews = (db.get('reviews')||{})[wId]||[];
  document.getElementById('wp-rev-cnt').textContent = `${reviews.length} yorum`;
  document.getElementById('wp-reviews').innerHTML   = reviews.length
    ? reviews.map(r => `
        <div class="rev-item">
          <div class="rev-head"><span class="rev-author">${esc(r.author)}</span>
                                <span class="rev-date">${r.date}</span></div>
          <div class="rev-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          <div class="rev-text">${esc(r.comment)}</div>
        </div>`).join('')
    : `<div class="empty-st" style="padding:28px;"><div class="empty-txt">Henüz yorum yok</div></div>`;
}

/* ----------------------------------------------------------------
   15. KİMLİK DOĞRULAMA
   ---------------------------------------------------------------- */
function renderAuthArea() {
  const el=document.getElementById('auth-area');
  if (!el) return;
  if (S.user) {
    const isWorker = S.user.role==='worker';
    const dashView = isWorker ? 'dashboard-worker' : 'dashboard-user';
    /* Aynı simge seti sidebar (.dicon) ile birebir aynı — emoji font'a bağımlı olmayan
       satır içi SVG kullanılır, böylece hangi tarayıcı/işletim sisteminde olursa olsun
       tutarlı şekilde render edilir. */
    const ICONS = {
      posts:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6M9 16h6M9 8h2"/></svg>',
      inbox:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
      factory:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a1 1 0 0 0-1.6-.8L2 8Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>',
      user:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      chart:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      send:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
      image:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
      logout:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
      shield:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
      lock:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    };
    const items = isWorker ? [
      { icon:ICONS.chart,   label:'İstatistikler',      panel:'dw-p-stats' },
      { icon:ICONS.send,    label:'Tekliflerim',         panel:'dw-p-offers' },
      { icon:ICONS.factory, label:'Toptan Talepleri',    panel:'dw-p-demands' },
      { icon:ICONS.image,   label:'Ürünlerim',           panel:'dw-p-products' },
      { icon:ICONS.user,    label:'Profilim',            panel:'dw-p-profile' },
    ] : [
      { icon:ICONS.posts,   label:'İlanlarım',           panel:'du-p-posts' },
      { icon:ICONS.inbox,   label:'Gelen Teklifler',     panel:'du-p-offers' },
      { icon:ICONS.factory, label:'Toptan Taleplerim',   panel:'du-p-demands' },
      { icon:ICONS.user,    label:'Profilim',            panel:'du-p-profile' },
    ];
    const itemsHtml = items.map(it =>
      `<button class="pdrop-item" onclick="goDash('${dashView}','${it.panel}')"><span class="dicon">${it.icon}</span> ${it.label}</button>`
    ).join('');
    /* Sadece site sahibi / Yetkili Usta görür — Sprint 7 */
    let modHtml = '';
    if (S.user.isAdmin || S.user.isTrustedWorker) {
      const pendingCount = db.arr('jobs').filter(j=>j.flagged && j.flagStatus==='pending').length
        + db.arr('demands').filter(d=>d.flagged && d.flagStatus==='pending').length;
      modHtml = `
        <div class="pdrop-sep"></div>
        <button class="pdrop-item" onclick="showView('moderation')">
          <span class="dicon">${ICONS.shield}</span> Moderasyon Paneli
          ${pendingCount ? `<span class="badge badge-rose" style="margin-left:auto;">${pendingCount}</span>` : ''}
        </button>`;
    }
    /* Sadece site sahibi görür — Sprint 8, Yetkili Usta'ya AÇILMAZ */
    let adminHtml = '';
    if (S.user.isAdmin) {
      adminHtml = `
        <button class="pdrop-item" onclick="showView('admin-panel')">
          <span class="dicon">${ICONS.lock}</span> Yönetici Paneli
        </button>`;
    }
    el.innerHTML = `
      <div class="profile-wrap">
        <button class="user-chip" onclick="showView('${dashView}')">👤 ${esc(S.user.name.split(' ')[0])} <span class="chevron">▾</span></button>
        <div class="profile-dropdown">
          <div class="pdrop-inner">
            ${itemsHtml}
            ${modHtml}
            ${adminHtml}
            <div class="pdrop-sep"></div>
            <button class="pdrop-item danger" onclick="logout()"><span class="dicon">${ICONS.logout}</span> Çıkış Yap</button>
          </div>
        </div>
      </div>`;
  } else {
    el.innerHTML=`<button class="btn-hdr-login" onclick="authTab('login');openModal('m-auth')">Giriş Yap</button>
                  <button class="btn-hdr-reg"   onclick="authTab('register');openModal('m-auth')">Kayıt Ol</button>`;
  }
}

/* Dropdown menu öğelerinden dashboard'a gidip doğru paneli açar */
function goDash(view, panelId) {
  showView(view);
  // showView senkron render ettiği için panel elementleri artık DOM'da mevcut
  const btn = document.querySelector(`[data-panel="${panelId}"]`);
  switchPanel(panelId, btn);
}

function authTab(tab) {
  document.querySelectorAll('#m-auth .atab').forEach((t,i) =>
    t.classList.toggle('on', (i===0&&tab==='login')||(i===1&&tab==='register')));
  document.getElementById('af-login').classList.toggle('on', tab==='login');
  document.getElementById('af-reg').classList.toggle('on',   tab==='register');
}

function demoFill(e,p) {
  document.getElementById('l-email').value=e;
  document.getElementById('l-pass').value=p;
}

async function doLogin() {
  const email=document.getElementById('l-email')?.value.trim().toLowerCase();
  const pass=document.getElementById('l-pass')?.value;
  if (!email||!pass) { toast('E-posta ve şifre girin','er'); return; }
  const btn = document.querySelector('#af-login .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Giriş yapılıyor...'; }
  try {
    const profile = await sbSignIn({ email, password: pass });
    S.user = profile;
    syncProfileToLocalCache(profile);
    closeModal('m-auth'); renderAuthArea();
    toast(`Hoş geldiniz, ${profile.name.split(' ')[0]}! 👋`,'ok');
    showView(profile.role==='worker'?'dashboard-worker':'dashboard-user');
  } catch (err) {
    if (err.message === 'SUSPENDED') {
      toast('Bu hesap askıya alınmış. Destek ekibiyle iletişime geçin.','er');
    } else {
      toast('E-posta veya şifre hatalı','er');
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Giriş Yap'; }
  }
}

async function doRegister() {
  const name=document.getElementById('r-name')?.value.trim();
  const email=document.getElementById('r-email')?.value.trim().toLowerCase();
  const pass=document.getElementById('r-pass')?.value;
  const role=document.getElementById('r-role')?.value;
  const city=document.getElementById('r-city')?.value;
  const dist=document.getElementById('r-dist')?.value;
  if (!name) { toast('Ad soyad girin','er'); return; }
  if (!email||!email.includes('@')) { toast('Geçerli e-posta girin','er'); return; }
  if (!pass||pass.length<6) { toast('Şifre en az 6 karakter olmalı','er'); return; }
  if (!city) { toast('Şehir seçin','er'); return; }
  const btn = document.querySelector('#af-reg .btn-crimson, #af-reg .btn-terra, #af-reg .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Kayıt oluşturuluyor...'; }
  try {
    const profile = await sbSignUp({ email, password:pass, name, role, city, district:dist });
    S.user = profile;
    syncProfileToLocalCache(profile);
    closeModal('m-auth'); renderAuthArea();
    toast(`Kayıt başarılı! Rumuzunuz: ${profile.anonName} 🎉`,'ok');
    showView(role==='worker'?'dashboard-worker':'dashboard-user');
  } catch (err) {
    if ((err.message||'').toLowerCase().includes('already registered') || (err.code==='23505')) {
      toast('Bu e-posta zaten kayıtlı','er');
    } else {
      toast('Kayıt oluşturulamadı: ' + (err.message||'bilinmeyen hata'),'er');
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Kayıt Ol'; }
  }
}

async function logout() {
  await sbSignOut();
  S.user=null;
  renderAuthArea(); showView('home'); toast('Çıkış yapıldı','nfo');
}

function requireLogin(v) {
  if (!S.user) { openModal('m-auth'); return false; }
  showView(v); return true;
}

function showDash() {
  if (!S.user) { openModal('m-auth'); return; }
  showView(S.user.role==='worker'?'dashboard-worker':'dashboard-user');
}

/* ----------------------------------------------------------------
   16. TEKLİF VER MODALI (İŞ İLANI)
   ---------------------------------------------------------------- */
function openOfferModal(jobId) {
  if (!S.user) { openModal('m-auth'); return; }
  if (S.user.role==='user') { toast('Teklif vermek için usta hesabı gerekir','er'); return; }
  S.offerJobId = jobId;
  ['o-price','o-desc','o-dur'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  openModal('m-offer');
}

function submitOffer() {
  const price=document.getElementById('o-price')?.value;
  const desc=document.getElementById('o-desc')?.value.trim();
  const dur=document.getElementById('o-dur')?.value.trim();
  if (!price||Number(price)<=0) { toast('Geçerli bir fiyat girin','er'); return; }
  if (!desc||desc.length<10)    { toast('Açıklama en az 10 karakter olmalı','er'); return; }
  const offer={
    id:'o'+Date.now(), jobId:S.offerJobId, workerId:S.user.id, status:'pending', duration:dur,
    rounds:[{ by:'worker', price:Number(price), note:desc, at:new Date().toISOString() }],
    createdAt:new Date().toISOString(),
  };
  const offers=db.arr('offers'); offers.push(offer); db.set('offers',offers);
  const jobs=db.arr('jobs');
  const ji=jobs.findIndex(j=>j.id===S.offerJobId);
  if (ji!==-1) { if(!jobs[ji].offerIds) jobs[ji].offerIds=[]; jobs[ji].offerIds.push(offer.id); db.set('jobs',jobs); }
  toast('Teklifiniz gönderildi! İlan sahibi e-posta ile bilgilendirildi.','ok');
  closeModal('m-offer');
  if (S.view==='job-detail') renderJobDetail(S.offerJobId);
}

/* ----------------------------------------------------------------
   16b. PAZARLIK / KARŞI TEKLİF (Sprint 6)
   Her teklif artık tek bir satır değil, bir "tur" dizisidir:
   rounds: [{ by:'worker'|'user', price, note, at }, ...]
   En fazla MAX_NEGOTIATION_ROUNDS tur sonra görüşme kilitlenir
   (kabul hâlâ mümkündür, sadece yeni karşı teklif verilemez).
   ---------------------------------------------------------------- */
const MAX_NEGOTIATION_ROUNDS = 5;

function latestRound(offer) { return offer.rounds[offer.rounds.length - 1]; }
function isNegotiationCapped(offer) { return offer.rounds.length >= MAX_NEGOTIATION_ROUNDS; }

function openCounterModal(offerId) {
  if (!S.user) { openModal('m-auth'); return; }
  const offer = db.arr('offers').find(o=>o.id===offerId);
  if (!offer) return;
  if (isNegotiationCapped(offer)) { toast('Bu görüşme tur sınırına ulaştı, artık karşı teklif verilemez','er'); return; }
  S.counterOfferId = offerId;
  const last = latestRound(offer);
  document.getElementById('co-context').textContent = `Son teklif: ${Number(last.price).toLocaleString('tr-TR')} ₺`;
  document.getElementById('co-round-info').textContent = `Bu görüşmede ${offer.rounds.length}/${MAX_NEGOTIATION_ROUNDS} tur kullanıldı.`;
  document.getElementById('co-price').value = '';
  document.getElementById('co-note').value = '';
  openModal('m-counter');
}

function submitCounter() {
  const offerId = S.counterOfferId;
  const offers = db.arr('offers');
  const idx = offers.findIndex(o=>o.id===offerId);
  if (idx===-1) return;
  const offer = offers[idx];
  if (isNegotiationCapped(offer)) { toast('Bu görüşme tur sınırına ulaştı','er'); return; }
  const job = db.arr('jobs').find(j=>j.id===offer.jobId);
  if (!job) return;

  const price = document.getElementById('co-price')?.value;
  const note = document.getElementById('co-note')?.value.trim();
  if (!price || Number(price)<=0) { toast('Geçerli bir fiyat girin','er'); return; }

  const by = (S.user.id===job.userId) ? 'user' : 'worker';
  const lastBy = latestRound(offer).by;
  if (by === lastBy) { toast('Şu anda karşı tarafın yanıtı bekleniyor','er'); return; }

  offers[idx].rounds.push({ by, price:Number(price), note, at:new Date().toISOString() });
  db.set('offers', offers);
  closeModal('m-counter');
  const otherSide = by==='user' ? 'usta' : 'ilan sahibi';
  toast(`Karşı teklifiniz gönderildi! ${otherSide} e-posta ile bilgilendirildi.`,'ok');
  renderJobDetail(offer.jobId);
}

function withdrawOffer(offerId) {
  const offer = db.arr('offers').find(o=>o.id===offerId);
  if (!offer) return;
  if (!S.user || S.user.id !== offer.workerId) { toast('Bu teklifi geri çekme yetkiniz yok','er'); return; }
  if (!confirm('Teklifinizi geri çekmek istediğinize emin misiniz?')) return;
  const offers = db.arr('offers');
  const idx = offers.findIndex(o=>o.id===offerId);
  if (idx===-1) return;
  offers[idx].status = 'withdrawn';
  db.set('offers', offers);
  toast('Teklifiniz geri çekildi','nfo');
  renderJobDetail(offer.jobId);
}

/* ----------------------------------------------------------------
   MODERASYON — Sprint 7
   Manuel bildirim, moderasyon kuyruğu, onayla/kaldır işlemleri.
   Erişim: S.user.isAdmin (site sahibi) veya S.user.isTrustedWorker
   (Yetkili Usta). Bu prototipte yetki kontrolü istemci tarafında
   yapılır — gerçek üründe sunucu tarafı oturum doğrulaması şarttır
   (bkz. yol haritası Sprint 8/11).
   ---------------------------------------------------------------- */
function isModeratorUser() {
  return !!(S.user && (S.user.isAdmin || S.user.isTrustedWorker));
}

/* Sprint 8: gizlilik-aşan yetkiler (gerçek kimlik görme, hesap askıya alma,
   gönderi gizleme) SADECE site sahibine (isAdmin) açıktır — Yetkili Usta'ya
   (isTrustedWorker) değil. Sprint 7'nin moderasyon yetkisiyle karıştırılmamalı. */
function isSuperAdmin() {
  return !!(S.user && S.user.isAdmin);
}

/* Denetim kaydı — yöneticinin anonimliği aştığı / hesap üzerinde işlem yaptığı
   her an burada iz bırakır. type: 'view_identity'|'suspend'|'unsuspend'|'hide'|'unhide' */
function logAuditAction(action, targetType, targetId, details) {
  if (!S.user) return;
  const log = db.arr('auditLog');
  log.unshift({
    id:'al'+Date.now()+Math.floor(Math.random()*1000),
    adminId:S.user.id, adminName:S.user.name,
    action, targetType, targetId, details:details||'',
    at:new Date().toISOString(),
  });
  db.set('auditLog', log);
}

function openReportModal(type, id) {
  if (!isModeratorUser()) { toast('Bu işlem için yetkiniz yok','er'); return; }
  S.reportTarget = { type, id };
  document.getElementById('rp-note').value = '';
  openModal('m-report');
}

function submitReport() {
  if (!isModeratorUser() || !S.reportTarget) { closeModal('m-report'); return; }
  const { type, id } = S.reportTarget;
  const note = document.getElementById('rp-note')?.value.trim() || '';
  const collection = type==='job' ? 'jobs' : 'demands';
  const records = db.arr(collection);
  const idx = records.findIndex(r=>r.id===id);
  if (idx===-1) { closeModal('m-report'); return; }
  const reasons = new Set(records[idx].flagReasons||[]);
  reasons.add('manual');
  records[idx].flagReasons = Array.from(reasons);
  records[idx].flagged = true;
  records[idx].flagStatus = 'pending';
  records[idx].flagNotes = note;
  db.set(collection, records);
  closeModal('m-report');
  toast('Gönderi moderasyon kuyruğuna eklendi','ok');
  if (type==='job' && S.view==='job-detail') renderJobDetail(id);
  if (type==='demand' && S.view==='demand-detail') renderDemandDetail(id);
}

/* Kuyruktan onaylama (işareti temizler, gönderi zaten yayında kalmıştı) veya kaldırma (yayından indirir) */
function resolveModeration(type, id, action) {
  const collection = type==='job' ? 'jobs' : 'demands';
  const records = db.arr(collection);
  const idx = records.findIndex(r=>r.id===id);
  if (idx===-1) return;
  if (action==='approve') {
    records[idx].flagStatus = 'resolved';
    toast('Gönderi onaylandı, işaret kaldırıldı','ok');
  } else if (action==='remove') {
    if (!confirm('Bu gönderiyi yayından kaldırmak istediğinize emin misiniz?')) return;
    records[idx].status = 'deleted';
    records[idx].flagStatus = 'resolved';
    toast('Gönderi yayından kaldırıldı','nfo');
  }
  db.set(collection, records);
  renderModerationQueue();
}

function moderationTab(tab) {
  S.modTab = tab;
  document.getElementById('modtab-pending')?.classList.toggle('on', tab==='pending');
  document.getElementById('modtab-resolved')?.classList.toggle('on', tab==='resolved');
  document.getElementById('mod-list-pending')?.classList.toggle('hidden', tab!=='pending');
  document.getElementById('mod-list-resolved')?.classList.toggle('hidden', tab!=='resolved');
}

function moderationCardHTML(record, type) {
  const isJob = type==='job';
  const title = isJob ? record.title : `${record.brand} — ${record.qty} ${record.unit}`;
  const desc = isJob ? record.desc : (record.note||'(not girilmemiş)');
  const anon = ownerAnon(record.userId);
  const resolved = record.flagStatus==='resolved';
  const reasonsHtml = (record.flagReasons||[]).map(r=>`<span class="badge ${flagReasonBadgeClass(r)}">${flagReasonLabel(r)}</span>`).join('');
  const goDetail = isJob
    ? `S.jobId='${record.id}';showView('job-detail')`
    : `S.demandId='${record.id}';showView('demand-detail')`;
  return `
    <div class="mod-card ${resolved?'resolved':''}">
      <div class="mod-card-head">
        <div>
          <div class="mod-card-title" onclick="${goDetail}">${isJob?'📋':'🏭'} ${esc(title)}</div>
          <div class="mod-card-meta">${anon} · ${esc(record.city)}/${esc(record.district)} · ${fmtDate(record.createdAt)} ${record.status==='deleted'?'· <strong style="color:var(--danger);">Kaldırıldı</strong>':''}</div>
        </div>
        <span class="badge badge-gray">${isJob?'İş İlanı':'Toptan Talep'}</span>
      </div>
      <div class="mod-card-reasons">${reasonsHtml}</div>
      <div class="mod-card-desc">${esc(desc.length>220?desc.slice(0,220)+'…':desc)}</div>
      ${record.flagNotes ? `<div class="mod-card-note">Not: "${esc(record.flagNotes)}"</div>` : ''}
      ${!resolved ? `
        <div class="mod-card-actions">
          <button class="btn btn-primary btn-sm" onclick="resolveModeration('${type}','${record.id}','approve')">✓ Onayla (İşareti Kaldır)</button>
          <button class="btn btn-danger btn-sm" onclick="resolveModeration('${type}','${record.id}','remove')">🗑️ Yayından Kaldır</button>
          <button class="btn btn-ghost btn-sm" onclick="${goDetail}">Detayı Gör</button>
        </div>` : `
        <div class="mod-card-actions">
          <button class="btn btn-ghost btn-sm" onclick="${goDetail}">Detayı Gör</button>
        </div>`}
    </div>`;
}

function renderModerationQueue() {
  if (!isModeratorUser()) {
    toast('Bu panele erişim yetkiniz yok','er');
    showView('home');
    return;
  }
  const jobs = db.arr('jobs').filter(j=>j.flagged);
  const demands = db.arr('demands').filter(d=>d.flagged);
  const all = [
    ...jobs.map(j=>({record:j, type:'job'})),
    ...demands.map(d=>({record:d, type:'demand'})),
  ].sort((a,b)=>new Date(b.record.createdAt)-new Date(a.record.createdAt));

  const pending = all.filter(x=>x.record.flagStatus==='pending');
  const resolved = all.filter(x=>x.record.flagStatus==='resolved');
  const autoCount = all.filter(x=>(x.record.flagReasons||[]).some(r=>r!=='manual')).length;

  document.getElementById('mod-s-pending').textContent = pending.length;
  document.getElementById('mod-s-resolved').textContent = resolved.length;
  document.getElementById('mod-s-auto').textContent = autoCount;

  const pendingEl = document.getElementById('mod-list-pending');
  pendingEl.innerHTML = pending.length
    ? pending.map(x=>moderationCardHTML(x.record, x.type)).join('')
    : `<div class="empty-st"><div class="empty-icon">✅</div><div class="empty-txt">Bekleyen inceleme yok</div><div class="empty-sub">Tüm gönderiler temiz görünüyor.</div></div>`;

  const resolvedEl = document.getElementById('mod-list-resolved');
  resolvedEl.innerHTML = resolved.length
    ? resolved.map(x=>moderationCardHTML(x.record, x.type)).join('')
    : `<div class="empty-st"><div class="empty-icon">🗂️</div><div class="empty-txt">Henüz çözümlenmiş kayıt yok</div></div>`;

  moderationTab(S.modTab || 'pending');
}

/* ----------------------------------------------------------------
   YÖNETİCİ PANELİ — Sprint 8 (yalnızca isAdmin, Yetkili Usta DAHİL DEĞİL)
   Kullanıcı/usta yönetimi (askıya alma), gizlenen gönderiler, denetim kaydı.
   ---------------------------------------------------------------- */
function adminTab(tab) {
  S.adminTab = tab;
  ['users','hidden','audit'].forEach(t => {
    document.getElementById('admintab-'+t)?.classList.toggle('on', t===tab);
    document.getElementById('admin-panel-'+t)?.classList.toggle('hidden', t!==tab);
  });
}

function renderAdminPanel() {
  if (!isSuperAdmin()) {
    toast('Bu panele erişim yetkiniz yok','er');
    showView('home');
    return;
  }
  renderAdminUsers();
  renderAdminHiddenPosts();
  renderAuditLog();
  adminTab(S.adminTab || 'users');
}

function renderAdminUsers() {
  const users = db.arr('users').map(u=>({...u, __kind:'user'}));
  const workers = db.arr('workers').map(w=>({...w, __kind:'worker'}));
  const all = [...users, ...workers].filter(u=>u.id!==S.user.id); // yönetici kendini listede görmez
  const el = document.getElementById('admin-users-list');
  if (!el) return;
  el.innerHTML = all.length ? all.map(u => `
    <div class="mod-card ${u.suspended?'':''}" style="border-left-color:${u.suspended?'var(--danger)':'var(--green)'};">
      <div class="mod-card-head">
        <div>
          <div class="mod-card-title" style="cursor:default;">${u.__kind==='worker'?'🔧':'👤'} ${esc(u.name)} <span style="color:var(--muted);font-weight:400;">(${esc(u.anonName)})</span></div>
          <div class="mod-card-meta">${esc(u.email)} · ${esc(u.city)}/${esc(u.district)} · ${u.__kind==='worker'?'Usta':'Kullanıcı'}${u.isTrustedWorker?' · 🛡️ Yetkili Usta':''}${u.isAdmin?' · ⭐ Yönetici':''}</div>
        </div>
        <span class="badge ${u.suspended?'badge-rose':'badge-green'}">${u.suspended?'Askıya Alındı':'Aktif'}</span>
      </div>
      <div class="mod-card-actions">
        ${u.isAdmin ? `<span class="fhint">Yönetici hesapları askıya alınamaz.</span>` : `
          <button class="btn ${u.suspended?'btn-primary':'btn-danger'} btn-sm" onclick="toggleSuspend('${u.__kind==='worker'?'workers':'users'}','${u.id}')">
            ${u.suspended?'✓ Askıyı Kaldır':'⛔ Askıya Al'}
          </button>`}
      </div>
    </div>`).join('')
    : `<div class="empty-st"><div class="empty-icon">👥</div><div class="empty-txt">Kayıtlı kullanıcı yok</div></div>`;
}

async function toggleSuspend(collection, id) {
  const records = db.arr(collection);
  const idx = records.findIndex(r=>r.id===id);
  if (idx===-1) return;
  const willSuspend = !records[idx].suspended;
  if (willSuspend && !confirm(`${records[idx].name} adlı hesabı askıya almak istediğinize emin misiniz? Hesap sahibi giriş yapamayacak.`)) return;

  // Sprint 9: gerçek kaynak Supabase'dir — doLogin buradan okur. Önce
  // orayı güncelliyoruz, yerel önbellek sadece ekranı hemen yansıtmak için.
  try {
    const { error } = await sb.from('profiles').update({ suspended: willSuspend }).eq('id', id);
    if (error) throw error;
  } catch (err) {
    toast('Askıya alma işlemi kaydedilemedi: ' + (err.message||'bilinmeyen hata'),'er');
    return;
  }

  records[idx].suspended = willSuspend;
  db.set(collection, records);
  logAuditAction(willSuspend?'suspend':'unsuspend', collection==='workers'?'worker':'user', id, records[idx].name);
  toast(willSuspend?'Hesap askıya alındı':'Hesabın askısı kaldırıldı','ok');
  renderAdminUsers();
}

function renderAdminHiddenPosts() {
  const jobs = db.arr('jobs').filter(j=>j.adminHidden).map(j=>({record:j, type:'job'}));
  const demands = db.arr('demands').filter(d=>d.adminHidden).map(d=>({record:d, type:'demand'}));
  const all = [...jobs, ...demands].sort((a,b)=>new Date(b.record.createdAt)-new Date(a.record.createdAt));
  const el = document.getElementById('admin-hidden-list');
  if (!el) return;
  el.innerHTML = all.length ? all.map(x => {
    const isJob = x.type==='job';
    const title = isJob ? x.record.title : `${x.record.brand} — ${x.record.qty} ${x.record.unit}`;
    const goDetail = isJob ? `S.jobId='${x.record.id}';showView('job-detail')` : `S.demandId='${x.record.id}';showView('demand-detail')`;
    return `
    <div class="mod-card" style="border-left-color:var(--dark-2);">
      <div class="mod-card-head">
        <div>
          <div class="mod-card-title" onclick="${goDetail}">${isJob?'📋':'🏭'} ${esc(title)}</div>
          <div class="mod-card-meta">${ownerAnon(x.record.userId)} — ${esc(findUserById(x.record.userId)?.name||'')} · ${esc(x.record.city)}/${esc(x.record.district)}</div>
        </div>
        <span class="badge badge-gray">👁️‍🗨️ Sadece Yöneticiye Görünür</span>
      </div>
      <div class="mod-card-actions">
        <button class="btn btn-primary btn-sm" onclick="toggleAdminHide('${x.type}','${x.record.id}')">✓ Görünürlüğü Geri Ver</button>
        <button class="btn btn-ghost btn-sm" onclick="${goDetail}">Detayı Gör</button>
      </div>
    </div>`;
  }).join('')
    : `<div class="empty-st"><div class="empty-icon">👁️</div><div class="empty-txt">Gizlenen gönderi yok</div></div>`;
}

/* Bir gönderiyi "sadece yöneticiye görünür" yapar / geri açar. İlan sahibi
   dahil kimse görmez — Sprint 7'nin "kaldır"ından farklıdır (o, gönderiyi
   ihlal nedeniyle kapatır ve sahibine "kaldırıldı" olarak görünür kalır). */
function toggleAdminHide(type, id) {
  const collection = type==='job' ? 'jobs' : 'demands';
  const records = db.arr(collection);
  const idx = records.findIndex(r=>r.id===id);
  if (idx===-1) return;
  const willHide = !records[idx].adminHidden;
  records[idx].adminHidden = willHide;
  db.set(collection, records);
  logAuditAction(willHide?'hide':'unhide', type, id, records[idx].title||records[idx].brand);
  toast(willHide?'Gönderi sadece size görünür yapıldı':'Gönderi görünürlüğü geri verildi','ok');
  if (S.view==='job-detail' && type==='job') renderJobDetail(id);
  if (S.view==='demand-detail' && type==='demand') renderDemandDetail(id);
  if (S.view==='admin-panel') renderAdminHiddenPosts();
}

function renderAuditLog() {
  const log = db.arr('auditLog');
  const el = document.getElementById('admin-audit-list');
  if (!el) return;
  const ACTION_LABELS = {
    view_identity: { label:'🔍 Gerçek Kimliği Görüntüledi', badge:'badge-sky' },
    suspend:        { label:'⛔ Hesabı Askıya Aldı',         badge:'badge-rose' },
    unsuspend:      { label:'✓ Askıyı Kaldırdı',             badge:'badge-green' },
    hide:           { label:'👁️‍🗨️ Gönderiyi Gizledi',        badge:'badge-gray' },
    unhide:         { label:'✓ Gönderi Görünürlüğünü Açtı',  badge:'badge-green' },
  };
  el.innerHTML = log.length ? `
    <table class="sum-table" style="width:100%;">
      <thead><tr style="text-align:left;">
        <td style="font-weight:800;color:var(--dark);">İşlem</td>
        <td style="font-weight:800;color:var(--dark);">Yönetici</td>
        <td style="font-weight:800;color:var(--dark);">Hedef</td>
        <td style="font-weight:800;color:var(--dark);">Tarih</td>
      </tr></thead>
      <tbody>
        ${log.map(l => {
          const meta = ACTION_LABELS[l.action] || { label:l.action, badge:'badge-gray' };
          return `<tr>
            <td><span class="badge ${meta.badge}">${meta.label}</span></td>
            <td>${esc(l.adminName)}</td>
            <td>${esc(l.details||l.targetId)}</td>
            <td style="color:var(--muted);font-size:var(--fs-sm);">${fmtDate(l.at)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`
    : `<div class="empty-st"><div class="empty-icon">🗂️</div><div class="empty-txt">Henüz denetim kaydı yok</div><div class="empty-sub">Yönetici gizliliği aşan bir işlem yaptığında burada listelenir.</div></div>`;
}

/* ----------------------------------------------------------------
   17. KULLANICI DASHBOARD
   ---------------------------------------------------------------- */
function renderUserDash() {
  if (!S.user) { showView('home'); return; }
  const u=S.user;
  document.getElementById('du-av').textContent = u.anonName.replace(/[^0-9]/g,'').slice(0,1) || 'K';
  document.getElementById('du-name').textContent = u.anonName;
  document.getElementById('du-panon').value  = u.anonName;
  document.getElementById('du-pname').value  = u.name;
  document.getElementById('du-pemail').value = u.email;
  document.getElementById('du-pcity').value  = u.city||'';
  document.getElementById('du-pdist').value  = u.district||'';
  const allJobs=db.arr('jobs');
  const myJobs=allJobs.filter(j=>j.userId===u.id && j.status!=='deleted' && !j.adminHidden);
  const allOffers=db.arr('offers');
  const myOffers=allOffers.filter(o=>myJobs.some(j=>j.id===o.jobId));
  document.getElementById('du-s1').textContent=myJobs.length;
  document.getElementById('du-s2').textContent=myOffers.length;
  document.getElementById('du-s3').textContent=myJobs.filter(j=>j.status==='completed').length;

  const jEl=document.getElementById('du-jobs');
  jEl.innerHTML = myJobs.length ? myJobs.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).map(j=>{
    const statusLabel = j.status==='open' ? 'Açık' : j.status==='in_progress' ? 'Devam Ediyor'
      : j.status==='pending_review' ? '🕐 İncelemede' : 'Tamamlandı';
    const statusColor = j.status==='open' ? 'green' : j.status==='pending_review' ? 'gold' : 'gray';
    const canEdit = j.status==='open' || j.status==='pending_review';
    return `
    <div class="card mb4" style="cursor:pointer;" onclick="S.jobId='${j.id}';showView('job-detail')">
      <div class="card-body">
        <div class="row-between">
          <div>
            <div style="font-size:var(--fs-md);font-weight:700;">${esc(j.title)}</div>
            <div style="font-size:var(--fs-sm);color:var(--muted);margin-top:4px;">${j.catIcon} ${j.catName} · 📍 ${j.city}/${j.district}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="badge badge-sage">📩 ${(j.offerIds||[]).length} teklif</span>
            <span class="badge badge-${statusColor}">${statusLabel}</span>
          </div>
        </div>
        ${canEdit ? `
        <div class="row" style="gap:8px;margin-top:12px;" onclick="event.stopPropagation()">
          <button class="btn btn-outline btn-sm" onclick="startEditJob('${j.id}')">✏️ Düzenle</button>
          <button class="btn btn-danger btn-sm" onclick="deleteJob('${j.id}')">🗑️ Sil</button>
        </div>` : ''}
      </div>
    </div>`;
  }).join('')
  : `<div class="empty-st"><div class="empty-icon">📋</div><div class="empty-txt">Henüz ilan yok</div>
     <div class="empty-sub">İlk ilanınızı oluşturun!</div>
     <button class="btn btn-terra" style="margin-top:20px;" onclick="showView('post-job')">+ İlan Ver</button></div>`;

  const oEl=document.getElementById('du-offers');
  oEl.innerHTML = myOffers.length ? myOffers.map(o=>{
    const job=allJobs.find(j=>j.id===o.jobId);
    const anon=sellerAnon(o.workerId);
    const last = latestRound(o);
    const capped = isNegotiationCapped(o);
    const myTurn = last.by==='worker'; // sıra ilan sahibinde
    let statusBadge, statusColor;
    if (o.status==='accepted')      { statusBadge='✓ Kabul Edildi'; statusColor='green'; }
    else if (o.status==='withdrawn'){ statusBadge='Geri Çekildi'; statusColor='gray'; }
    else if (myTurn)                { statusBadge='Yanıtınız Bekleniyor'; statusColor='gold'; }
    else                            { statusBadge='Usta Yanıtı Bekleniyor'; statusColor='gray'; }
    return `
      <div class="card mb4">
        <div class="card-body">
          <div style="font-size:var(--fs-xs);color:var(--muted);margin-bottom:6px;">İlan: ${esc(job?.title||'')} · 🔄 ${o.rounds.length}. teklif</div>
          <div class="row-between">
            <div>
              <div style="font-size:var(--fs-md);font-weight:700;">${anon}</div>
              <div style="color:var(--muted);margin-top:4px;">${esc((last.note||'').substring(0,80))}${(last.note||'').length>80?'...':''}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:var(--fs-xl);font-weight:800;color:var(--green-dk);">${Number(last.price).toLocaleString('tr-TR')} ₺</div>
              <span class="badge badge-${statusColor}">${statusBadge}</span>
            </div>
          </div>
          ${o.status==='pending' && job?.status==='open' && myTurn ? `
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="acceptOffer('${o.id}','${o.jobId}');renderUserDash()">✓ Kabul Et</button>
              ${!capped ? `<button class="btn btn-outline btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail');openCounterModal('${o.id}')">🔄 Karşı Teklif</button>` : ''}
              <button class="btn btn-ghost btn-sm"   onclick="S.workerId='${o.workerId}';showView('worker-profile')">Profili Gör</button>
            </div>` : `
            <div style="margin-top:12px;">
              <button class="btn btn-ghost btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail')">İlan Detayına Git</button>
            </div>`}
        </div>
      </div>`;
  }).join('')
  : `<div class="empty-st"><div class="empty-icon">📭</div><div class="empty-txt">Henüz teklif gelmedi</div></div>`;

  // Toptan taleplerim
  const myDemands=db.arr('demands').filter(d=>d.userId===u.id && !d.adminHidden);
  const dEl=document.getElementById('du-demands');
  dEl.innerHTML = myDemands.length ? `<div class="toptan-grid">${myDemands.map(demandCardHTML).join('')}</div>`
    : `<div class="empty-st"><div class="empty-icon">🏭</div><div class="empty-txt">Henüz talep yok</div>
       <button class="btn btn-terra" style="margin-top:20px;" onclick="showView('post-wholesale')">+ Talep Oluştur</button></div>`;

  renderMyAddresses();
}

function saveUserProfile() {
  if (!S.user) return;
  const name=document.getElementById('du-pname')?.value.trim();
  const city=document.getElementById('du-pcity')?.value.trim();
  const dist=document.getElementById('du-pdist')?.value.trim();
  if (!name) { toast('Ad soyad boş olamaz','er'); return; }
  const users=db.arr('users'); const idx=users.findIndex(u=>u.id===S.user.id);
  if (idx!==-1) { users[idx]={...users[idx],name,city,district:dist}; db.set('users',users); S.user=users[idx]; db.set('currentUser',users[idx]); }
  renderAuthArea(); toast('Profil güncellendi','ok');
}

/* ----------------------------------------------------------------
   18. USTA / SATICI DASHBOARD
   ---------------------------------------------------------------- */
function renderWorkerDash() {
  if (!S.user) { showView('home'); return; }
  const u=S.user;
  document.getElementById('dw-av').textContent = u.anonName.replace(/[^0-9]/g,'').slice(0,1) || 'S';
  document.getElementById('dw-name').textContent = u.anonName;
  document.getElementById('dw-panon').value  = u.anonName;
  document.getElementById('dw-pname').value  = u.name;
  document.getElementById('dw-pbio').value   = u.bio||'';
  document.getElementById('dw-pcity').value  = u.city||'';
  document.getElementById('dw-pdist').value  = u.district||'';
  document.getElementById('dw-pskills').value= (u.skills||[]).join(', ');

  const myOffers=db.arr('offers').filter(o=>o.workerId===u.id);
  const acceptedOffers=myOffers.filter(o=>o.status==='accepted');
  const pendingOffers=myOffers.filter(o=>o.status==='pending');
  const acceptRate = myOffers.length ? Math.round((acceptedOffers.length/myOffers.length)*100) : 0;

  document.getElementById('dw-s1').textContent=myOffers.length;
  document.getElementById('dw-s2').textContent=acceptedOffers.length;
  document.getElementById('dw-s3').textContent=myOffers.length ? `%${acceptRate}` : '—';

  renderWorkerCharts(myOffers, acceptedOffers, pendingOffers);
  renderMyProducts();

  const oEl=document.getElementById('dw-offers');
  const allJobs=db.arr('jobs');
  oEl.innerHTML=myOffers.length ? myOffers.map(o=>{
    const job=allJobs.find(j=>j.id===o.jobId);
    const last = latestRound(o);
    const capped = isNegotiationCapped(o);
    const myTurn = last.by==='user'; // sıra ustada
    let statusBadge, statusColor;
    if (o.status==='accepted')      { statusBadge='✓ Kabul Edildi'; statusColor='green'; }
    else if (o.status==='withdrawn'){ statusBadge='Geri Çekildi'; statusColor='gray'; }
    else if (myTurn)                { statusBadge='Yanıtınız Bekleniyor'; statusColor='gold'; }
    else                            { statusBadge='İlan Sahibi Yanıtı Bekleniyor'; statusColor='gray'; }
    return `
      <div class="card mb4">
        <div class="card-body">
          <div class="row-between">
            <div>
              <div style="font-size:var(--fs-md);font-weight:700;">${esc(job?.title||'İlan')}</div>
              <div style="font-size:var(--fs-sm);color:var(--muted);margin-top:4px;">${job?.city||''} / ${job?.district||''} · 🔄 ${o.rounds.length}. teklif · ${fmtDate(last.at)}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:var(--fs-xl);font-weight:800;color:var(--green-dk);">${Number(last.price).toLocaleString('tr-TR')} ₺</div>
              <span class="badge badge-${statusColor}">${statusBadge}</span>
            </div>
          </div>
          ${o.status==='pending' && job?.status==='open' ? `
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              ${myTurn ? `<button class="btn btn-primary btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail');acceptOffer('${o.id}','${o.jobId}')">✓ Kabul Et</button>` : ''}
              ${myTurn && !capped ? `<button class="btn btn-outline btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail');openCounterModal('${o.id}')">🔄 Karşı Teklif</button>` : ''}
              <button class="btn btn-danger btn-sm" onclick="withdrawOffer('${o.id}');renderWorkerDash()">Geri Çek</button>
              <button class="btn btn-ghost btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail')">İlan Detayı</button>
            </div>` : `
            <div style="margin-top:12px;">
              <button class="btn btn-ghost btn-sm" onclick="S.jobId='${o.jobId}';showView('job-detail')">İlan Detayına Git</button>
            </div>`}
        </div>
      </div>`;
  }).join('')
  : `<div class="empty-st"><div class="empty-icon">📤</div><div class="empty-txt">Henüz teklif vermediniz</div>
     <button class="btn btn-primary" style="margin-top:16px;" onclick="showView('browse')">İlanları İncele</button></div>`;

  // Toptan alım talepleri (satıcı olarak teklif verebileceği talepler)
  const openDemands=db.arr('demands').filter(d=>d.status==='open' && !d.adminHidden);
  const dEl=document.getElementById('dw-demands');
  dEl.innerHTML=openDemands.length ? openDemands.slice(0,6).map(demandCardHTML).join('')
    : `<div class="empty-st" style="grid-column:1/-1;"><div class="empty-icon">🏭</div><div class="empty-txt">Şu an açık talep yok</div></div>`;

  renderMyAddresses();
}

/* ----------------------------------------------------------------
   18b. İSTATİSTİKLER — Chart.js pasta + çubuk grafik
   Sadece hesap sahibi görür (kendi dashboard'unda render edilir).
   ---------------------------------------------------------------- */
let _chartOfferStatus = null;
let _chartOfferCats   = null;

function renderWorkerCharts(myOffers, acceptedOffers, pendingOffers) {
  const wrap  = document.getElementById('dw-charts-wrap');
  const empty = document.getElementById('dw-stats-empty');
  if (!wrap) return;

  if (!myOffers.length) {
    wrap.classList.add('hidden');
    empty?.classList.remove('hidden');
    return;
  }
  wrap.classList.remove('hidden');
  empty?.classList.add('hidden');

  if (typeof Chart === 'undefined') return; // CDN engellenmişse sessizce vazgeç

  // --- Pasta grafik: Teklif Durumu ---
  const ctx1 = document.getElementById('chart-offer-status')?.getContext('2d');
  if (ctx1) {
    if (_chartOfferStatus) _chartOfferStatus.destroy();
    _chartOfferStatus = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Kabul Edildi', 'Bekliyor'],
        datasets: [{
          data: [acceptedOffers.length, pendingOffers.length],
          backgroundColor: ['#1B8354', '#D4CCC0'],
          borderColor: '#FFFFFF',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { family:'Plus Jakarta Sans', size:13 }, padding:16 } } },
        cutout: '62%',
      },
    });
  }

  // --- Çubuk grafik: Kategoriye Göre Teklifler ---
  const allJobs = db.arr('jobs');
  const catCounts = {};
  myOffers.forEach(o => {
    const job = allJobs.find(j=>j.id===o.jobId);
    const catName = job ? job.catName : 'Diğer';
    catCounts[catName] = (catCounts[catName]||0) + 1;
  });
  const catLabels = Object.keys(catCounts);
  const catData   = Object.values(catCounts);
  const catColors = catLabels.map(name => {
    const cat = CATS.find(c=>c.name===name);
    return cat ? getComputedStyle(document.documentElement).getPropertyValue('--'+cat.id==='elektrik'?'elec-c':cat.id.slice(0,4)+'-c').trim() || '#1B8354' : '#1B8354';
  });

  const ctx2 = document.getElementById('chart-offer-cats')?.getContext('2d');
  if (ctx2) {
    if (_chartOfferCats) _chartOfferCats.destroy();
    _chartOfferCats = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: catLabels,
        datasets: [{
          data: catData,
          backgroundColor: '#1B8354',
          borderRadius: 6,
          maxBarThickness: 36,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display:false } },
        scales: {
          y: { beginAtZero:true, ticks:{ stepSize:1, font:{family:'Plus Jakarta Sans'} }, grid:{color:'#E6E0D8'} },
          x: { ticks:{ font:{family:'Plus Jakarta Sans', size:12} }, grid:{display:false} },
        },
      },
    });
  }
}

/* ----------------------------------------------------------------
   18c. ÜRÜNLERİM — satıcının kendi ürünlerini yönetmesi (görsel dahil)
   ---------------------------------------------------------------- */
let _pendingProductImage = null; // base64 data URL, henüz kaydedilmemiş

function renderMyProducts() {
  const el = document.getElementById('dw-products');
  if (!el || !S.user) return;
  const myProds = db.arr('products').filter(p=>p.sellerId===S.user.id);
  el.innerHTML = myProds.length ? myProds.map(myProductCardHTML).join('')
    : `<div class="empty-st" style="grid-column:1/-1;">
         <div class="empty-icon">🖼️</div><div class="empty-txt">Henüz ürün eklemediniz</div>
         <div class="empty-sub">Toptan Alım bölümünde görünmesi için bir ürün ekleyin.</div>
         <button class="btn btn-terra" style="margin-top:16px;" onclick="openAddProductModal()">+ Yeni Ürün Ekle</button>
       </div>`;
}

function myProductCardHTML(p) {
  const cat = CATS.find(c=>c.id===p.catId);
  const cc = catColor(p.catId);
  const imgHtml = p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.parentElement.innerHTML='<div class=&quot;pc-fallback&quot;>${cat?cat.icon:'📦'}</div>';" />`
    : `<div class="pc-fallback" style="background:${cc.bg};">${cat?cat.icon:'📦'}</div>`;
  return `
    <div class="myprod-card" style="--col:${cc.col};--col-bg:${cc.bg};">
      <div class="pc-image">${imgHtml}</div>
      <div class="pc-body">
        <div class="pc-name">${esc(p.name)}</div>
        <div class="pc-desc">${esc(p.desc)}</div>
        <div class="pc-price-row"><span class="pc-price">${Number(p.price).toLocaleString('tr-TR')} ₺</span><span class="pc-unit">/ ${esc(p.unit)}</span></div>
        <div class="pc-min">Min. sipariş: ${p.minOrder} adet</div>
      </div>
      <div class="myprod-foot">
        <button class="btn btn-danger btn-sm btn-full" onclick="deleteMyProduct('${p.id}')">🗑️ Sil</button>
      </div>
    </div>`;
}

function openAddProductModal() {
  if (!S.user || (S.user.role!=='worker' && S.user.role!=='both')) {
    toast('Ürün eklemek için usta/satıcı hesabı gerekir','er'); return;
  }
  // Kategori listesini doldur
  const sel = document.getElementById('ap-cat');
  sel.innerHTML = CATS.map(c=>`<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  // Formu temizle
  ['ap-name','ap-brand','ap-desc','ap-price','ap-unit','ap-min'].forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  removeProductImage();
  openModal('m-add-product');
}

function handleProductImageUpload(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('Lütfen bir görsel dosyası seçin','er'); return; }
  if (file.size > 3*1024*1024) { toast('Görsel 3MB\'den küçük olmalı','er'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    _pendingProductImage = e.target.result; // base64 data URL
    document.getElementById('ap-preview-img').src = _pendingProductImage;
    document.getElementById('ap-preview-wrap').classList.add('show');
    document.getElementById('ap-upload-box').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function removeProductImage(ev) {
  if (ev) ev.stopPropagation();
  _pendingProductImage = null;
  const input = document.getElementById('ap-image-input');
  if (input) input.value = '';
  document.getElementById('ap-preview-wrap')?.classList.remove('show');
  document.getElementById('ap-upload-box')?.classList.remove('hidden');
}

function submitProduct() {
  if (!S.user) { openModal('m-auth'); return; }
  const name  = document.getElementById('ap-name')?.value.trim();
  const catId = document.getElementById('ap-cat')?.value;
  const brand = document.getElementById('ap-brand')?.value.trim();
  const desc  = document.getElementById('ap-desc')?.value.trim();
  const price = document.getElementById('ap-price')?.value;
  const unit  = document.getElementById('ap-unit')?.value.trim();
  const min   = document.getElementById('ap-min')?.value;

  if (!name) { toast('Ürün adı girin','er'); return; }
  if (!brand) { toast('Marka girin','er'); return; }
  if (!desc||desc.length<10) { toast('Açıklama en az 10 karakter olmalı','er'); return; }
  if (!price||Number(price)<=0) { toast('Geçerli bir fiyat girin','er'); return; }
  if (!unit) { toast('Birim girin (Örn: teneke, kutu)','er'); return; }
  if (!min||Number(min)<=0) { toast('Geçerli bir minimum sipariş adedi girin','er'); return; }

  const cat = CATS.find(c=>c.id===catId);
  const product = {
    id:'p'+Date.now(), sellerId:S.user.id, seller:S.user.anonName,
    name, brand, desc, price:Number(price), unit, minOrder:Number(min),
    catId, cat:cat?cat.name:'', image:_pendingProductImage||null,
    detail:'Satıcı tarafından eklenmiştir.',
    createdAt:new Date().toISOString(),
  };
  const prods=db.arr('products'); prods.push(product); db.set('products',prods);
  closeModal('m-add-product');
  toast('Ürününüz yayınlandı! 🎉','ok');
  renderMyProducts();
  renderHomeProds();
}

function deleteMyProduct(pid) {
  const prods = db.arr('products').filter(p=>p.id!==pid);
  db.set('products', prods);
  toast('Ürün silindi','nfo');
  renderMyProducts();
  renderHomeProds();
}

function saveWorkerProfile() {
  if (!S.user) return;
  const name  =document.getElementById('dw-pname')?.value.trim();
  const bio   =document.getElementById('dw-pbio')?.value.trim();
  const city  =document.getElementById('dw-pcity')?.value.trim();
  const dist  =document.getElementById('dw-pdist')?.value.trim();
  const skills=document.getElementById('dw-pskills')?.value.trim().split(',').map(s=>s.trim()).filter(Boolean);
  const workers=db.arr('workers'); const idx=workers.findIndex(w=>w.id===S.user.id);
  if (idx!==-1) { workers[idx]={...workers[idx],name,bio,city,district:dist,skills}; db.set('workers',workers); S.user=workers[idx]; db.set('currentUser',workers[idx]); }
  renderAuthArea(); toast('Profil güncellendi','ok');
}

/* ----------------------------------------------------------------
   19. MODAL YARDIMCILARI
   ---------------------------------------------------------------- */
function openModal(id)  { document.getElementById(id)?.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id,ev) {
  if (ev && ev.target!==document.getElementById(id)) return;
  document.getElementById(id)?.classList.remove('open'); document.body.style.overflow='';
}
document.addEventListener('keydown', e => {
  if (e.key==='Escape') { document.querySelectorAll('.overlay.open').forEach(m=>m.classList.remove('open')); document.body.style.overflow=''; }
});

/* ----------------------------------------------------------------
   20. PANEL YÖNETİMİ
   ---------------------------------------------------------------- */
function switchPanel(panelId, btn) {
  document.querySelectorAll('.dpanel').forEach(p=>p.classList.remove('on'));
  document.getElementById(panelId)?.classList.add('on');
  btn?.closest('.dash-nav')?.querySelectorAll('.dnav-btn').forEach(b=>b.classList.remove('on'));
  btn?.classList.add('on');
}

/* ----------------------------------------------------------------
   21. ŞEHİR / İLÇE SEÇİCİLERİ
   ---------------------------------------------------------------- */
function populateCities() {
  const cityOpts = '<option value="">Şehir Seçin</option>' +
    Object.keys(CITIES).map(c=>`<option value="${c}">${c}</option>`).join('');
  ['p-city','r-city','w-city','am-city'].forEach(id => { const e=document.getElementById(id); if(e) e.innerHTML=cityOpts; });
}

function fillDistricts(cityId, distId) {
  const city = document.getElementById(cityId)?.value;
  const dEl  = document.getElementById(distId);
  if (!dEl) return;
  if (!city) { dEl.disabled=true; dEl.innerHTML='<option value="">Önce şehir seçin</option>'; return; }
  const districts=CITIES[city]||[];
  dEl.disabled=false;
  dEl.innerHTML='<option value="">İlçe Seçin</option>' +
    districts.map(d=>`<option value="${d}">${d}</option>`).join('');
}

/* ----------------------------------------------------------------
   22. TOAST
   ---------------------------------------------------------------- */
function toast(msg, type='nfo') {
  const wrap=document.getElementById('toast-wrap');
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  el.textContent=msg;
  wrap.appendChild(el);
  setTimeout(()=>el.remove(), 3100);
}

/* ----------------------------------------------------------------
   23. YARDIMCI FONKSİYONLAR
   ---------------------------------------------------------------- */
function esc(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function fmtDate(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}); }
  catch { return iso; }
}
function timeAgo(iso) {
  if (!iso) return '';
  const diff=Date.now()-new Date(iso);
  const h=Math.floor(diff/3600000), d=Math.floor(h/24);
  if (d>0) return `${d} gün önce`;
  if (h>0) return `${h} saat önce`;
  return 'Az önce';
}

/* ================================================================
   BAŞLAT
   ================================================================ */
document.addEventListener('DOMContentLoaded', init);

/* JAVASCRIPT SONU */
