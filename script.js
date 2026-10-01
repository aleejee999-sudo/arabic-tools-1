/* ==========================================
   script.js | الأدوات الرقمية
   ========================================== */

const DEFAULT_LANG = 'ar';          // pehli baar aane wale ke liye zubaan: 'ar' ya 'ur'
const LANG_KEY = 'site_lang';
const TASBEEH_KEY = 'tasbeeh_state';

let currentLang = DEFAULT_LANG;
let lastFortune = null;
let lastAge = null;

/* ---------- Chhote helpers ---------- */
const $ = (id) => document.getElementById(id);

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function setLinkText(selector, text) {
  document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
}

let toastTimer;
function showToast(msg) {
  let el = $('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// Vercel Analytics: page views khud ginay jate hain. Ye sirf custom event ke liye hai
// (custom events shayad Vercel ke paid plan par hi kaam karte hain; warna ye khamoshi se ignore ho jata hai)
function track(name) {
  try {
    if (typeof window.va === 'function') window.va('event', { name: name });
  } catch (e) {}
}

function parseDate(str) {
  const p = str.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

/* ---------- Translations ---------- */
const translations = {
  ar: {
    logo: "الأدوات الرقمية",
    langBtn: "اردو",
    navHome: "الرئيسية", navBlog: "المدونة", navAbout: "من نحن", navContact: "اتصل بنا",
    footAbout: "من نحن", footContact: "اتصل بنا", footPrivacy: "سياسة الخصوصية",
    tabZodiac: "🔮 الأبراج والحظ",
    tabAge: "🎂 حاسبة العمر",
    tabWa: "💬 واتساب مباشر",
    tabTasbeeh: "📿 التسبيح والأدعية",
    cardZodiac: "الأبراج والحظ", cardAge: "حاسبة العمر", cardWa: "واتساب مباشر", cardTasbeeh: "التسبيح والأدعية",

    title: "🔮 حاسبة الأبراج ومعرفة الحظ",
    desc: "أدخل اسمك وتاريخ ميلادك لمعرفة برجك تلقائياً واكتشاف حظك وتوقعاتك!",
    lblName: "اسمك الكريم:",
    namePlaceholder: "أدخل اسمك هنا...",
    lblDob: "تاريخ ميلادك:",
    btnCalculate: "كشف البرج والحظ ✨",
    lblZodiacFound: "برجك الفلكي هو:",
    lblPersonality: "الشخصية والصفات:",
    lblFuture: "التوقعات القادمة:",
    lblTravel: "فرصة السفر والمستقبل:",
    btnFb: "f مشاركة على فيسبوك",
    btnWa: "💬 مشاركة واتساب",
    resultFor: "نتيجة التحليل لـ",
    needName: "الرجاء إدخال اسمك أولاً!",
    needDob: "الرجاء اختيار تاريخ ميلادك!",
    shareText: "اكتشف برجك وحظك اليوم عبر هذا الرابط:",

    ageTitle: "🎂 حاسبة العمر بالتفصيل",
    ageDesc: "احسب عمرك بالتفصيل بالسنوات والأشهر والأيام!",
    lblAgeDob: "تاريخ الميلاد:",
    btnCalcAge: "احسب العمر 🎈",
    ageResult: "عمرك الحالي: {y} سنة و {m} أشهر و {d} يوم",
    ageDays: "إجمالي الأيام التي عشتها: {n} يوم",
    ageNext: "باقي {n} يوم على عيد ميلادك القادم",
    ageToday: "🎉 اليوم عيد ميلادك، كل عام وأنت بخير!",
    needAgeDob: "الرجاء اختيار تاريخ الميلاد!",
    futureDob: "تاريخ الميلاد لا يمكن أن يكون في المستقبل!",

    waTitle: "💬 مراسلة واتساب مباشرة",
    waDesc: "أرسل رسالة واتساب بدون حفظ الرقم في جهات الاتصال!",
    lblWaNum: "رقم الهاتف (مع رمز الدولة):",
    lblWaMsg: "الرسالة (اختياري):",
    btnSendWa: "فتح المحادثة 🚀",
    needNumber: "الرجاء إدخال رقم هاتف صحيح!",

    subTabTasbeeh: "عدّاد التسبيح",
    subTabDuas: "أدعية مسنونة",
    subTabWazaif: "أوراد مشهورة",
    modeLabel100: "حسب الترتيب (تسبيح 100)",
    modeLabelFree: "وضع حر (بدون حد)",
    modeBtnToFree: "وضع حر",
    modeBtnTo100: "تسبيح 100",
    tapBtn: "اضغط للتسبيح",
    resetBtn: "إعادة (0)",
    nextBtn: "التسبيحة التالية ➔",
    tasbeehDone: "ما شاء الله! اكتملت 100 مرة.",
    dua1Title: "١. دعاء الاستيقاظ من النوم",
    dua1Text: "الحمد لله الذي أعادنا إلى الحياة بعد النوم، وإليه المرجع والبعث.",
    dua2Title: "٢. دعاء الخروج من المنزل",
    dua2Text: "أخرج باسم الله متوكلاً عليه، ولا حول ولا قوة إلا بالله.",
    wazifa1Title: "١. وظيفة للنجاة من الهموم والكروب",
    wazifa1Text: "آية كريمة: يُرجى أن يفرّج الله بها الكرب عمّن دعا بها في شدته."
  },
  ur: {
    logo: "ڈیجیٹل ٹولز",
    langBtn: "العربية",
    navHome: "ہوم", navBlog: "بلاگ", navAbout: "ہمارے بارے میں", navContact: "رابطہ",
    footAbout: "ہمارے بارے میں", footContact: "رابطہ", footPrivacy: "پرائیویسی پالیسی",
    tabZodiac: "🔮 برج اور قسمت",
    tabAge: "🎂 عمر معلوم کریں",
    tabWa: "💬 ڈائریکٹ واٹس ایپ",
    tabTasbeeh: "📿 تسبیح و وظائف",
    cardZodiac: "برج اور قسمت", cardAge: "عمر معلوم کریں", cardWa: "ڈائریکٹ واٹس ایپ", cardTasbeeh: "تسبیح و وظائف",

    title: "🔮 برج اور قسمت کا حال",
    desc: "اپنا نام اور تاریخِ پیدائش درج کریں، خودکار طریقے سے اپنا برج اور قسمت کا حال جانیں!",
    lblName: "آپ کا نام:",
    namePlaceholder: "یہاں اپنا نام لکھیں...",
    lblDob: "آپ کی تاریخِ پیدائش:",
    btnCalculate: "برج اور قسمت دیکھیں ✨",
    lblZodiacFound: "آپ کا برج ہے:",
    lblPersonality: "شخصیت اور خصوصیات:",
    lblFuture: "آئندہ ہفتے کی پیشگوئی:",
    lblTravel: "سفر اور مستقبل کا حال:",
    btnFb: "f فیس بک پر شیئر کریں",
    btnWa: "💬 واٹس ایپ پر شیئر کریں",
    resultFor: "قسمت کا حال برائے",
    needName: "براہ کرم پہلے اپنا نام درج کریں!",
    needDob: "براہ کرم اپنی تاریخِ پیدائش منتخب کریں!",
    shareText: "اس لنک سے اپنا برج اور قسمت کا حال دیکھیں:",

    ageTitle: "🎂 عمر کا مکمل حساب",
    ageDesc: "اپنی عمر سال، مہینوں اور دنوں میں تفصیلاً معلوم کریں!",
    lblAgeDob: "تاریخِ پیدائش:",
    btnCalcAge: "عمر کا حساب لگائیں 🎈",
    ageResult: "آپ کی عمر: {y} سال، {m} مہینے اور {d} دن ہے",
    ageDays: "اب تک کل دن: {n}",
    ageNext: "اگلی سالگرہ میں {n} دن باقی ہیں",
    ageToday: "🎉 آج آپ کی سالگرہ ہے، مبارک ہو!",
    needAgeDob: "براہ کرم تاریخِ پیدائش منتخب کریں!",
    futureDob: "تاریخِ پیدائش آنے والے وقت کی نہیں ہو سکتی!",

    waTitle: "💬 ڈائریکٹ واٹس ایپ میسج",
    waDesc: "نمبر سیو کیے بغیر ڈائریکٹ واٹس ایپ پر چیٹ شروع کریں!",
    lblWaNum: "موبائل نمبر (کنٹری کوڈ کے ساتھ):",
    lblWaMsg: "پیغام (اختیاری):",
    btnSendWa: "چیٹ شروع کریں 🚀",
    needNumber: "براہ کرم درست موبائل نمبر درج کریں!",

    subTabTasbeeh: "تسبیح کاؤنٹر",
    subTabDuas: "مسنون دعائیں",
    subTabWazaif: "مقبول وظائف",
    modeLabel100: "حسبِ ترتیب (100 والی تسبیح)",
    modeLabelFree: "آزاد تسبیح (بغیر کسی حد کے)",
    modeBtnToFree: "آزاد تسبیح",
    modeBtnTo100: "100 والی تسبیح",
    tapBtn: "ٹیپ کریں (تسبیح گنیں)",
    resetBtn: "ریسیٹ (0)",
    nextBtn: "اگلی تسبیح ➔",
    tasbeehDone: "ماشاء اللہ! 100 بار مکمل ہو گیا۔",
    dua1Title: "۱. سو کر اٹھنے کی دعا",
    dua1Text: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔",
    dua2Title: "۲. گھر سے نکلنے کی دعا",
    dua2Text: "اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، اور اللہ کے بغیر نہ کوئی طاقت ہے نہ قوت۔",
    wazifa1Title: "۱. تمام پریشانیوں اور غموں سے نجات کا وظیفہ",
    wazifa1Text: "آیتِ کریمہ: جو شخص مصیبت میں اسے پڑھے گا، اللہ تعالی اس کی تکلیف دور فرمائے گا۔"
  }
};

const zodiacSigns = {
  ar: [
    "الجدي (Capricorn)", "الدلو (Aquarius)", "الحوت (Pisces)",
    "الحمل (Aries)", "الثور (Taurus)", "الجوزاء (Gemini)",
    "السرطان (Cancer)", "الأسد (Leo)", "العذراء (Virgo)",
    "الميزان (Libra)", "العقرب (Scorpio)", "القوس (Sagittarius)"
  ],
  ur: [
    "برج جدی (Capricorn)", "برج دلو (Aquarius)", "برج حوت (Pisces)",
    "برج حمل (Aries)", "برج ثور (Taurus)", "برج جوزا (Gemini)",
    "برج سرطان (Cancer)", "برج اسد (Leo)", "برج سنبلہ (Virgo)",
    "برج میزان (Libra)", "برج عقرب (Scorpio)", "برج قوس (Sagittarius)"
  ]
};

const predictions = {
  ar: {
    personality: [
      "شخصية قيادية وقوية، تتمتع بذكاء حاد وقدرة على اتخاذ القرارات الصائبة.",
      "قلبك طيب للغاية، تحب الخير للجميع وتتمتع بكاريزما تجذب الآخرين إليك.",
      "طموح جداً وعقلك منظم، تعشق النجاح ولا ترضى إلا بالقمة."
    ],
    future: [
      "خبر سار مفاجئ وهدية غير متوقعة في الطريق إليك خلال الأيام القادمة!",
      "فتح أبواب رزق جديدة ومشروع ناجح سيغير مستواك المالي للأفضل.",
      "انقضاء فترة تعب وتبدل الأحوال إلى راحة بال وسعادة كبيرة."
    ],
    travel: [
      "فرصة سفر ممتازة قادمة إليك للعمل أو السياحة في دولة جديدة!",
      "رحلة ممتعة قريباً مع أشخاص تحبهم ستجدد طاقتك وإيجابيتك.",
      "تغيير المحلي أو الانتقال لمكان أفضل يعود عليك بالخير والبركة."
    ]
  },
  ur: {
    personality: [
      "آپ ایک پرعزم اور قیادت پسند انسان ہیں جو کسی بھی مشکل حالات سے گھبراتا نہیں۔",
      "آپ کا دل بہت صاف اور نرم ہے، لوگوں کی مدد کرنا اور محبت بانٹنا آپ کی بہترین صفت ہے۔",
      "آپ بے حد ذہین اور محنتی ہیں، کسی کام کو شروع کریں تو اسے انجام تک پہنچا کر دم لیتے ہیں۔"
    ],
    future: [
      "آنے والے دنوں میں آپ کو کوئی بہت بڑی خوشخبری یا سرپرائز ملنے والا ہے!",
      "رزق اور روزگار میں زبردست برکت کا وقت قریب ہے، مالی پریشانیاں ختم ہوں گی۔",
      "کسی پرانے اور عزیز دوست سے ملاقات آپ کی خوشیوں کا باعث بنے گی۔"
    ],
    travel: [
      "بہت جلد کسی خوبصورت جگہ یا بیرونِ ملک کا سفر کرنے کا بہترین موقع ملے گا!",
      "تفریحی سفر کا امکان ہے جو آپ کے ذہن اور موڈ کو تر و تازہ کر دے گا۔",
      "مستقبل قریب میں کام یا رہائش میں مثبت تبدیلی آپ کے لیے انتہائی مبارک ثابت ہوگی۔"
    ]
  }
};

/* ---------- Zubaan badalna ---------- */
function applyLanguage() {
  const t = translations[currentLang];
  document.documentElement.lang = currentLang;
  document.documentElement.dir = 'rtl';

  // Header, menu, footer
  setText('logo-text', t.logo);
  setText('lang-btn', t.langBtn);
  setText('tab-zodiac', t.tabZodiac);
  setText('tab-age', t.tabAge);
  setText('tab-wa', t.tabWa);
  setText('tab-tasbeeh', t.tabTasbeeh);
  setLinkText('.nav-links a[href="index.html"]', t.navHome);
  setLinkText('.nav-links a[href="blog.html"]', t.navBlog);
  setLinkText('.nav-links a[href="about.html"]', t.navAbout);
  setLinkText('.nav-links a[href="contact.html"]', t.navContact);
  setLinkText('.site-footer a[href="about.html"]', t.footAbout);
  setLinkText('.site-footer a[href="contact.html"]', t.footContact);
  setLinkText('.site-footer a[href="privacy.html"]', t.footPrivacy);

  // Home page cards
  setLinkText('.home-card[href="horoscope.html"] span', t.cardZodiac);
  setLinkText('.home-card[href="age-counter.html"] span', t.cardAge);
  setLinkText('.home-card[href="wa-direct.html"] span', t.cardWa);
  setLinkText('.home-card[href="tasbih-counter.html"] span', t.cardTasbeeh);

  // Horoscope
  setText('title', t.title);
  setText('desc', t.desc);
  setText('lbl-name', t.lblName);
  setText('lbl-dob', t.lblDob);
  setText('btn-calculate', t.btnCalculate);
  setText('lbl-zodiac-found', t.lblZodiacFound);
  setText('lbl-res-personality', t.lblPersonality);
  setText('lbl-res-future', t.lblFuture);
  setText('lbl-res-travel', t.lblTravel);
  const nameInput = $('username');
  if (nameInput) nameInput.placeholder = t.namePlaceholder;
  setLinkText('.btn-fb', t.btnFb);
  setLinkText('.btn-wa', t.btnWa);
  renderFortune();

  // Age
  setText('age-title', t.ageTitle);
  setText('age-desc', t.ageDesc);
  setText('lbl-age-dob', t.lblAgeDob);
  setText('btn-calc-age', t.btnCalcAge);
  renderAge();

  // WhatsApp
  setText('wa-title', t.waTitle);
  setText('wa-desc', t.waDesc);
  setText('lbl-wa-num', t.lblWaNum);
  setText('lbl-wa-msg', t.lblWaMsg);
  setText('btn-send-wa', t.btnSendWa);

  // Tasbeeh page
  setText('subTabTasbeeh', t.subTabTasbeeh);
  setText('subTabDuas', t.subTabDuas);
  setText('subTabWazaif', t.subTabWazaif);
  setText('tapBtn', t.tapBtn);
  setText('resetBtn', t.resetBtn);
  setText('nextBtn', t.nextBtn);
  setText('dua1Title', t.dua1Title);
  setText('dua1Urdu', t.dua1Text);
  setText('dua2Title', t.dua2Title);
  setText('dua2Urdu', t.dua2Text);
  setText('wazifa1Title', t.wazifa1Title);
  setText('wazifa1Urdu', t.wazifa1Text);
  updateTasbeehUI();
}

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'ur' : 'ar';
  try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) {}
  applyLanguage();
}

function loadSavedLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ar' || saved === 'ur') currentLang = saved;
  } catch (e) {}
}

/* ---------- Burj aur qismat ---------- */
function getZodiacSignIndex(day, month) {
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 1;
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 2;
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 3;
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 4;
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 5;
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 6;
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 7;
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 8;
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 9;
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 10;
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 11;
  return 0;
}

function calculateFortune() {
  const t = translations[currentLang];
  const name = $('username').value.trim();
  const dobVal = $('dob').value;

  if (!name) { showToast(t.needName); return; }
  if (!dobVal) { showToast(t.needDob); return; }

  const dob = parseDate(dobVal);
  const day = dob.getDate();
  const month = dob.getMonth() + 1;

  lastFortune = {
    name: name,
    z: getZodiacSignIndex(day, month),
    p: (name.length + day) % 3,
    f: (name.length + month) % 3,
    t: (name.length + day + month) % 3
  };
  renderFortune();
  $('result-card').style.display = 'block';
  track('horoscope_used');
}

function renderFortune() {
  if (!lastFortune) return;
  const t = translations[currentLang];
  const p = predictions[currentLang];
  setText('res-name', t.resultFor + ': ' + lastFortune.name);
  setText('res-zodiac', zodiacSigns[currentLang][lastFortune.z]);
  setText('res-personality', p.personality[lastFortune.p]);
  setText('res-future', p.future[lastFortune.f]);
  setText('res-travel', p.travel[lastFortune.t]);
}

/* ---------- Umar ka hisab ---------- */
function calculateAge() {
  const t = translations[currentLang];
  const dobInput = $('age-dob-input').value;
  if (!dobInput) { showToast(t.needAgeDob); return; }

  const birth = parseDate(dobInput);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (birth > today) { showToast(t.futureDob); return; }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.round((today - birth) / 86400000);
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const daysToNext = Math.round((next - today) / 86400000);

  lastAge = { y: years, m: months, d: days, total: totalDays, next: daysToNext };
  renderAge();
  $('age-result').style.display = 'block';
  track('age_calculated');
}

function renderAge() {
  if (!lastAge) return;
  const t = translations[currentLang];
  const lines = [
    t.ageResult.replace('{y}', lastAge.y).replace('{m}', lastAge.m).replace('{d}', lastAge.d),
    t.ageDays.replace('{n}', lastAge.total),
    lastAge.next === 0 ? t.ageToday : t.ageNext.replace('{n}', lastAge.next)
  ];
  setText('age-res-text', lines.join('\n'));
}


function openWhatsAppDirect() {
  const t = translations[currentLang];
  const message = $('wa-message').value.trim();
  let num = $('wa-number').value.replace(/\D/g, '');

  if (num.indexOf('00') === 0) num = num.slice(2);                 // 0092... -> 92...
  else if (num.length === 11 && num.charAt(0) === '0') num = '92' + num.slice(1);  // 0300... -> 92300...

  if (num.length < 10) { showToast(t.needNumber); return; }

  const url = 'https://wa.me/' + num + (message ? '?text=' + encodeURIComponent(message) : '');
  window.open(url, '_blank');
  track('whatsapp_opened');
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
}

function shareWhatsApp() {
  const t = translations[currentLang];
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(t.shareText);
  window.open('https://api.whatsapp.com/send?text=' + text + '%20' + url, '_blank');
}

const tasbeehList = [
  "سُبْحَانَ اللّٰهِ",
  "اَلْحَمْدُ لِلّٰهِ",
  "اَللّٰهُ أَكْبَرُ",
  "لَآ إِلٰهَ اِلَّا اللّٰهُ",
  "أَسْتَغْفِرُ اللّٰهَ",
  "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ"
];

let currentTasbeehIndex = 0;
let tasbeehCount = 0;
let isFreeMode = false;

function saveTasbeeh() {
  try {
    localStorage.setItem(TASBEEH_KEY, JSON.stringify({
      i: currentTasbeehIndex, c: tasbeehCount, f: isFreeMode
    }));
  } catch (e) {}
}

function loadTasbeeh() {
  try {
    const s = JSON.parse(localStorage.getItem(TASBEEH_KEY));
    if (!s) return;
    const i = Number(s.i);
    const c = Number(s.c);
    if (i >= 0 && i < tasbeehList.length) currentTasbeehIndex = i;
    if (c >= 0) tasbeehCount = c;
    isFreeMode = !!s.f;
  } catch (e) {}
}

function updateTasbeehUI() {
  const t = translations[currentLang];
  setText('tasbeehName', tasbeehList[currentTasbeehIndex]);
  setText('countDisplay', tasbeehCount);
  setText('modeLabel', isFreeMode ? t.modeLabelFree : t.modeLabel100);
  setText('modeBtn', isFreeMode ? t.modeBtnTo100 : t.modeBtnToFree);
}

function countUp() {
  tasbeehCount++;
  if (navigator.vibrate) navigator.vibrate(15);

  if (!isFreeMode && tasbeehCount >= 100) {
    showToast(translations[currentLang].tasbeehDone);
    nextTasbeeh();
    return;
  }
  updateTasbeehUI();
  saveTasbeeh();
}

function resetCount() {
  tasbeehCount = 0;
  updateTasbeehUI();
  saveTasbeeh();
}

function nextTasbeeh() {
  tasbeehCount = 0;
  currentTasbeehIndex = (currentTasbeehIndex + 1) % tasbeehList.length;
  updateTasbeehUI();
  saveTasbeeh();
}

function toggleMode() {
  isFreeMode = !isFreeMode;
  resetCount();
}

function openSubTab(evt, subTabId) {
  document.querySelectorAll('.sub-tab-content').forEach((el) => {
    el.style.display = 'none';
    el.classList.remove('active');
  });
  document.querySelectorAll('.sub-tab-btn').forEach((btn) => btn.classList.remove('active'));

  const target = $(subTabId);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active');
  }
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
  loadSavedLang();
  loadTasbeeh();
  applyLanguage();
});