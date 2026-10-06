/* ==========================================
   qr-script.js | مولّد رمز QR
   (script.js کے بعد لوڈ ہوتا ہے)
   ========================================== */
(function () {
  if (typeof translations === 'undefined') return;

  /* ---------- ترجمے ---------- */
  translations.ar.qr = {
    title: "🔳 مولّد رمز QR",
    desc: "أنشئ رمز QR للدفع أو واتساب أو الواي فاي أو بطاقة العمل، ثم نزّله أو اطبعه كملصق.",
    types: { pay: "💳 بنك / دفع", wa: "💬 واتساب", wifi: "📶 واي فاي", vcard: "👤 بطاقة عمل", text: "🔗 رابط / نص" },
    f: {
      bank: "البنك / المحفظة", title: "اسم صاحب الحساب", iban: "رقم الحساب / الآيبان", phone: "رقم الجوال",
      msg: "رسالة جاهزة (اختياري)", ssid: "اسم الشبكة (SSID)", pass: "كلمة المرور", sec: "نوع الحماية",
      name: "الاسم", shop: "اسم المتجر / الشركة", email: "البريد الإلكتروني", addr: "العنوان", text: "رابط الموقع أو نص"
    },
    design: "التصميم", fg: "لون الرمز", bg: "لون الخلفية", logo: "شعار في الوسط (اختياري)",
    hint: "اجعل لون الرمز داكنًا والخلفية فاتحة لسهولة المسح.",
    payNote: "ملاحظة: بعض تطبيقات البنوك لا تقرأ هذا الرمز تلقائيًا. جرّبه بتطبيق بنكك أولًا، وللحصول على رمز تاجر رسمي تواصل مع البنك.",
    png: "تنزيل PNG", jpg: "تنزيل JPG", print: "🖨️ طباعة الملصق",
    empty: "اكتب البيانات لعرض الرمز",
    poster: "ندعم الدفع الإلكتروني هنا", scanPay: "امسح الرمز للدفع", scan: "امسح الرمز",
    blank: "متجرك", popup: "اسمح بالنوافذ المنبثقة لطباعة الملصق", blog: "📖 اقرأ دليل رمز QR"
  };
  translations.ur.qr = {
    title: "🔳 کیو آر کوڈ جنریٹر",
    desc: "ادائیگی، واٹس ایپ، وائی فائی یا وی کارڈ کا QR بنائیں، پھر ڈاؤن لوڈ کریں یا پوسٹر پرنٹ کریں۔",
    types: { pay: "💳 بینک / پیمنٹ", wa: "💬 واٹس ایپ", wifi: "📶 وائی فائی", vcard: "👤 وی کارڈ", text: "🔗 لنک / ٹیکسٹ" },
    f: {
      bank: "بینک / وائلٹ", title: "اکاؤنٹ ہولڈر کا نام", iban: "اکاؤنٹ / IBAN نمبر", phone: "موبائل نمبر",
      msg: "پری فلڈ پیغام (اختیاری)", ssid: "وائی فائی کا نام (SSID)", pass: "پاس ورڈ", sec: "سیکیورٹی",
      name: "نام", shop: "دکان / کمپنی کا نام", email: "ای میل", addr: "پتہ", text: "ویب سائٹ لنک یا تحریر"
    },
    design: "ڈیزائن", fg: "QR کا رنگ", bg: "بیک گراؤنڈ کا رنگ", logo: "درمیان میں لوگو (اختیاری)",
    hint: "QR کا رنگ گہرا اور بیک گراؤنڈ ہلکا رکھیں تاکہ اسکین آسان ہو۔",
    payNote: "نوٹ: ہر بینک ایپ یہ QR آٹو فل نہیں کرتی۔ پہلے اپنی بینک ایپ سے آزما لیں، اور سرکاری راست / مرچنٹ QR کے لیے اپنے بینک سے رابطہ کریں۔",
    png: "PNG ڈاؤن لوڈ", jpg: "JPG ڈاؤن لوڈ", print: "🖨️ پرنٹ پوسٹر",
    empty: "QR دیکھنے کے لیے تفصیل لکھیں",
    poster: "یہاں آن لائن ادائیگی قبول کی جاتی ہے", scanPay: "ادائیگی کے لیے QR اسکین کریں", scan: "QR کو اسکین کریں",
    blank: "آپ کی دکان", popup: "پوسٹر پرنٹ کے لیے پاپ اپ کی اجازت دیں", blog: "📖 QR کوڈ گائیڈ پڑھیں"
  };

  /* ---------- ڈیٹا ---------- */
  const BANKS = {
    ur: ["Easypaisa", "JazzCash", "Upaisa", "SadaPay", "NayaPay", "Raast", "State Bank of Pakistan",
         "Meezan Bank", "HBL", "UBL", "Alfalah", "Allied Bank", "MCB", "Bank Al Habib", "Askari Bank"],
    ar: ["Al Rajhi Bank", "SNB Al Ahli", "STC Pay", "urpay", "Riyad Bank", "Alinma Bank",
         "Bank Albilad", "Banque Saudi Fransi", "SABB", "Saudi Awwal Bank"]
  };
  const REGION = {
    ur: { cc: "+92", country: "PK", cur: "586", city: "PAKISTAN", ph: "3001234567" },
    ar: { cc: "+966", country: "SA", cur: "682", city: "SAUDI ARABIA", ph: "501234567" }
  };
  const FIELDS = {
    pay: [["bank", "sel"], ["title", "txt"], ["iban", "ltr"], ["phone", "tel"]],
    wa: [["phone", "tel"], ["msg", "area"]],
    wifi: [["ssid", "txt"], ["pass", "txt"], ["sec", "sec"]],
    vcard: [["name", "txt"], ["shop", "txt"], ["phone", "tel"], ["email", "ltr"], ["addr", "txt"]],
    text: [["text", "area"]]
  };

  const S = {};              // ٹائپ کی ہوئی قیمتیں (ٹیب بدلنے پر محفوظ رہتی ہیں)
  let tab = 'pay', logoData = null, qr = null, renderedLang = null;

  const tx = () => translations[currentLang].qr;
  const reg = () => REGION[currentLang];
  const val = (k) => (S[k] || '').trim();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- QR ڈیٹا بنانا ---------- */
  function crc16(s) {
    let c = 0xFFFF;
    for (let i = 0; i < s.length; i++) {
      c ^= s.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) : (c << 1);
      c &= 0xFFFF;
    }
    return c.toString(16).toUpperCase().padStart(4, '0');
  }
  const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;
  const wifiEsc = (s) => s.replace(/([\\;,:"])/g, '\\$1');

  function fullPhone() {
    const cc = (S.ccode || reg().cc).replace(/\D/g, '');
    return cc + (S.phone || '').replace(/\D/g, '').replace(/^0+/, '');
  }

  function payload() {
    const r = reg();
    if (tab === 'pay') {
      const acc = val('iban').replace(/\s/g, '');
      if (!acc) return '';
      const mai = tlv('00', (S.bank || BANKS[currentLang][0]).replace(/\s/g, '').toLowerCase()) +
                  tlv('01', acc) + (val('phone') ? tlv('02', fullPhone()) : '');
      const body = tlv('00', '01') + tlv('01', '11') + tlv('26', mai) + tlv('52', '0000') +
                   tlv('53', r.cur) + tlv('58', r.country) +
                   tlv('59', (val('title') || 'MERCHANT').slice(0, 25)) + tlv('60', r.city.slice(0, 15)) + '6304';
      return body + crc16(body);
    }
    if (tab === 'wa') {
      const p = fullPhone();
      if (p.length < 8) return '';
      return 'https://wa.me/' + p + (val('msg') ? '?text=' + encodeURIComponent(val('msg')) : '');
    }
    if (tab === 'wifi') {
      if (!val('ssid')) return '';
      const sec = S.sec || 'WPA2';
      const type = sec === 'nopass' ? 'nopass' : (sec === 'WPA3' ? 'SAE' : sec);
      return 'WIFI:T:' + type + ';S:' + wifiEsc(val('ssid')) + ';' +
             (sec === 'nopass' ? '' : 'P:' + wifiEsc(S.pass || '') + ';') + ';';
    }
    if (tab === 'vcard') {
      if (!val('name')) return '';
      return ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + val('name'),
        val('shop') && 'ORG:' + val('shop'),
        val('phone') && 'TEL:+' + fullPhone(),
        val('email') && 'EMAIL:' + val('email'),
        val('addr') && 'ADR:;;' + val('addr') + ';;;;',
        'END:VCARD'].filter(Boolean).join('\n');
    }
    return val('text');
  }

  /* ---------- لائیو اپڈیٹ ---------- */
  function refresh() {
    if (!qr) return;
    const t = tx(), d = payload();
    qr.update({
      data: d || ' ',
      image: logoData || undefined,
      dotsOptions: { type: 'rounded', color: $('qr-fg').value },
      backgroundOptions: { color: $('qr-bg').value },
      cornersSquareOptions: { type: 'extra-rounded', color: $('qr-fg').value }
    });
    const shop = tab === 'pay' ? val('title') : tab === 'vcard' ? (val('shop') || val('name')) : '';
    $('pv-shop').textContent = shop || t.blank;
    $('pv-bank').textContent = tab === 'pay' ? (S.bank || BANKS[currentLang][0]) : t.types[tab].replace(/^\S+\s/, '');
    $('pv-meta').textContent = d ? (tab === 'pay' ? val('iban') : '') : t.empty;
  }

  /* ---------- فارم بنانا ---------- */
  function renderTypes() {
    const t = tx();
    $('qr-types').innerHTML = Object.keys(FIELDS).map((k) =>
      '<button type="button" class="tab-btn' + (k === tab ? ' active' : '') + '" data-k="' + k + '">' + t.types[k] + '</button>'
    ).join('');
    $('qr-types').querySelectorAll('button').forEach((b) => {
      b.onclick = () => { tab = b.dataset.k; renderTypes(); renderForm(); };
    });
  }

  function renderForm() {
    const t = tx(), r = reg();
    let h = '';
    FIELDS[tab].forEach(([k, type]) => {
      h += '<div class="form-group"><label for="qf-' + k + '">' + t.f[k] + '</label>';
      if (type === 'sel') {
        h += '<select id="qf-' + k + '">' + BANKS[currentLang].map((b) => '<option>' + b + '</option>').join('') + '</select>';
      } else if (type === 'sec') {
        h += '<select id="qf-' + k + '"><option>WPA2</option><option>WPA3</option><option>WPA</option><option value="nopass">Open</option></select>';
      } else if (type === 'area') {
        h += '<textarea id="qf-' + k + '"></textarea>';
      } else if (type === 'tel') {
        h += '<div class="qr-phone-row"><input type="text" id="qf-' + k + '" inputmode="tel" placeholder="' + r.ph + '">' +
             '<input type="text" id="qf-ccode" inputmode="tel" aria-label="country code"></div>';
      } else {
        h += '<input type="text" id="qf-' + k + '"' + (type === 'ltr' ? ' dir="ltr"' : '') + '>';
      }
      h += '</div>';
    });
    $('qr-fields').innerHTML = h;

    // پچھلی لکھی قیمتیں واپس بھریں اور سننے والے لگائیں
    $('qr-fields').querySelectorAll('input,select,textarea').forEach((el) => {
      const k = el.id.slice(3);
      if (k === 'ccode') el.value = S.ccode || r.cc;
      else if (S[k] !== undefined) el.value = S[k];
      else if (k === 'bank') S.bank = el.value;
      const save = () => { S[k] = el.value; refresh(); };
      el.addEventListener('input', save);
      el.addEventListener('change', save);
    });

    const note = $('qr-paynote');
    note.textContent = t.payNote;
    note.hidden = tab !== 'pay';
    refresh();
  }

  /* ---------- پرنٹ پوسٹر ---------- */
  async function printPoster() {
    const t = tx();
    if (!payload()) { showToast(t.empty); return; }
    const blob = await qr.getRawData('png');
    const url = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
    const size = $('qr-paper').value, k = size === 'A4' ? 1 : 0.75;
    const w = window.open('', '_blank');
    if (!w) { showToast(t.popup); return; }
    const heading = tab === 'pay' ? t.poster : t.scan;
    const sub = tab === 'pay' ? t.scanPay : '';
    const name = $('pv-shop').textContent, bank = $('pv-bank').textContent;
    w.document.write('<!DOCTYPE html><html lang="' + currentLang + '" dir="rtl"><head><meta charset="UTF-8"><title>' + esc(name) + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Noto+Naskh+Arabic:wght@600;700&display=swap" rel="stylesheet">' +
      '<style>@page{size:' + size + ';margin:0}body{margin:0;font-family:"Noto Naskh Arabic",serif;text-align:center;color:#0f172a}' +
      '.p{height:100vh;box-sizing:border-box;padding:7vh 8vw;border:14px double #2563eb;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:' + (2 * k) + 'vh}' +
      'h1{font-family:Amiri,serif;font-size:' + (3.2 * k) + 'rem;color:#2563eb;margin:0;line-height:1.8}' +
      'h2{margin:0;font-size:' + (2 * k) + 'rem}.b{font-size:' + (1.4 * k) + 'rem;color:#64748b}' +
      'img{width:62%;max-width:520px}.s{font-size:' + (1.3 * k) + 'rem;font-weight:700}</style></head>' +
      '<body><div class="p"><h1>' + esc(heading) + '</h1><h2>' + esc(name) + '</h2><div class="b">' + esc(bank) + '</div>' +
      '<img src="' + url + '" alt="QR"><div class="s">' + esc(sub) + '</div></div>' +
      '<script>document.fonts.ready.then(function(){setTimeout(function(){print()},400)})<\/script></body></html>');
    w.document.close();
    track('qr_poster_printed');
  }

  /* ---------- زبان لاگو کرنا (آپ کے applyLanguage کے ساتھ جڑا ہوا) ---------- */
  function applyQrLang() {
    if (!$('qr-root') || typeof QRCodeStyling === 'undefined') return;
    const t = tx();

    // زبان بدلے تو کنٹری کوڈ اور بینک خود بدلیں
    if (renderedLang !== null && renderedLang !== currentLang) { delete S.ccode; delete S.bank; }
    renderedLang = currentLang;

    setText('qr-title', t.title);
    setText('qr-desc', t.desc);
    setText('qr-design-title', t.design);
    setText('lbl-qr-fg', t.fg);
    setText('lbl-qr-bg', t.bg);
    setText('lbl-qr-logo', t.logo);
    setText('qr-hint', t.hint);
    setText('qr-dl-png', t.png);
    setText('qr-dl-jpg', t.jpg);
    setText('qr-print', t.print);
    setText('qr-blog-link', t.blog);

    if (!qr) {
      qr = new QRCodeStyling({
        width: 240, height: 240, type: 'canvas', data: ' ', margin: 6,
        qrOptions: { errorCorrectionLevel: 'H' },
        dotsOptions: { type: 'rounded', color: '#2563eb' },
        backgroundOptions: { color: '#ffffff' },
        cornersSquareOptions: { type: 'extra-rounded' },
        imageOptions: { crossOrigin: 'anonymous', margin: 4, imageSize: 0.28 }
      });
      qr.append($('qr-canvas'));

      ['qr-fg', 'qr-bg'].forEach((id) => $(id).addEventListener('input', refresh));
      $('qr-logo').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (!f) { logoData = null; refresh(); return; }
        const fr = new FileReader();
        fr.onload = () => { logoData = fr.result; refresh(); };
        fr.readAsDataURL(f);
      });
      $('qr-dl-png').onclick = () => { qr.download({ name: 'qr-code', extension: 'png' }); track('qr_downloaded'); };
      $('qr-dl-jpg').onclick = () => { qr.download({ name: 'qr-code', extension: 'jpeg' }); track('qr_downloaded'); };
      $('qr-print').onclick = printPoster;
    }
    renderTypes();
    renderForm();
  }

  const baseApply = applyLanguage;
  applyLanguage = function () {
    baseApply();
    applyQrLang();
  };
})();