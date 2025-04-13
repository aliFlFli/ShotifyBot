const { Telegraf } = require('telegraf');
const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const Redis = require('ioredis');
const { promisify } = require('util');
const express = require('express');
const https = require('https');

require('dotenv').config();

// متغیر برای ردیابی خطای آخر
let lastError = null;

// 1. تنظیمات Express
const app = express();
app.get('/ping', (req, res) => {
  res.send('پینگ دریافت شد!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`سرور Express روی پورت ${PORT} اجرا شد.`);
});

// 2. تابع ارسال نوتیفیکیشن به ادمین
async function notifyAdmin(message) {
  try {
    await bot.telegram.sendMessage(process.env.ADMIN_ID, message, { parse_mode: 'HTML' });
    console.log('نوتیفیکیشن به ادمین ارسال شد:', message);
  } catch (error) {
    console.error('خطا در ارسال نوتیفیکیشن به ادمین:', error.message);
  }
}

// 3. تابع پینگ به خود پروژه
function pingSelf() {
  return new Promise((resolve, reject) => {
    https.get('https://mire-truthful-star.glitch.me/ping', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyBot/1.0)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('پاسخ پینگ Glitch:', data);
          lastError = null; // ریست خطا در صورت موفقیت
          resolve();
        } else {
          const errorMsg = `پینگ ناموفق بود: کد وضعیت ${res.statusCode}`;
          console.error(errorMsg);
          if (lastError !== errorMsg) {
            lastError = errorMsg;
            notifyAdmin(`<b>⚠️ پینگ ناموفق بود:</b>\nکد وضعیت: ${res.statusCode}`);
          }
          reject(new Error(errorMsg));
        }
      });
    }).on('error', (err) => {
      console.error('خطا در پینگ به Glitch:', err.message);
      if (lastError !== err.message) {
        lastError = err.message;
        notifyAdmin(`<b>⚠️ خطا در پینگ:</b>\n${err.message}`);
      }
      reject(err);
    });
  });
}

// 4. زمان‌بندی پینگ هر 5 دقیقه با تلاش دوباره
setInterval(async () => {
  console.log('ارسال پینگ دوره‌ای به Glitch...');
  try {
    await pingSelf();
  } catch (error) {
    console.error('تلاش پینگ ناموفق بود، تلاش دوباره...');
    setTimeout(async () => {
      console.log('تلاش دوباره برای پینگ...');
      try {
        await pingSelf();
      } catch (retryError) {
        console.error('تلاش دوباره هم ناموفق بود:', retryError.message);
      }
    }, 30000); // 30 ثانیه تأخیر قبل از تلاش دوباره
  }
}, 5 * 60 * 1000);

// 5. تنظیمات اتصال به Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  reconnectOnError: (err) => {
    console.log('اتصال Redis با خطا مواجه شد:', err);
    return true;
  },
  maxRetriesPerRequest: 3
});
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);

// 6. تنظیمات EventEmitter
require('events').EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(20);

// 7. APIهای اسکرین‌شات (10 تا API)
const SCREENSHOT_APIS = [
  { name: 'API1', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API1_KEY, limit: 100, counterKey: 'api1_requests' },
  { name: 'API2', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API2_KEY, limit: 100, counterKey: 'api2_requests' },
  { name: 'API3', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API3_KEY, limit: 100, counterKey: 'api3_requests' },
  { name: 'API4', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API4_KEY, limit: 100, counterKey: 'api4_requests' },
  { name: 'API5', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API5_KEY, limit: 100, counterKey: 'api4_requests' },
  { name: 'API6', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API6_KEY, limit: 100, counterKey: 'api6_requests' },
  { name: 'API7', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API7_KEY, limit: 100, counterKey: 'api7_requests' },
  { name: 'API8', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API8_KEY, limit: 100, counterKey: 'api8_requests' },
  { name: 'API9', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API9_KEY, limit: 100, counterKey: 'api9_requests' },
  { name: 'API10', url: (p) => `https://api.apiflash.com/v1/urltoimage?access_key=${p.key}&url=${p.url}&width=${p.width}&height=${p.height}&full_page=${p.fullpage}&format=${p.format}`, key: process.env.API10_KEY, limit: 100, counterKey: 'api10_requests' }
];

// چک کردن کلیدها هنگام شروع
SCREENSHOT_APIS.forEach(api => {
  if (!api.key) {
    console.error(`کلید ${api.name} تنظیم نشده است!`);
    process.exit(1);
  }
});

// 8. تنظیمات پیش‌فرض
const defaultSettings = {
  format: 'png',
  fullpage: false,
  mode: 'image',
  width: 1280,
  height: 720,
  apiIndex: 0,
  language: 'fa'
};

// 9. محدودیت‌ها
const DAILY_LIMIT = 100;
const ADMIN_ID = process.env.ADMIN_ID;

// 10. فایل‌های زبان
const messages = {
  fa: {
    start: '<b>🤖 ربات اسکرین‌شات فعال شد!</b>\n\n<b>🔹 یه لینک بفرست تا اسکرین‌شات بگیرم.</b>\n<b>🔹 برای تنظیمات از دکمه‌ها استفاده کن.</b>',
    invalidUrl: '<b>لطفاً یه لینک معتبر بفرست (مثلاً https://google.com)</b>',
    rateLimit: `<b>⏳ شما به حد ${DAILY_LIMIT} درخواست روزانه رسیدید. فردا دوباره امتحان کن!</b>`,
    loadingImage: '<b>⏳ در حال گرفتن اسکرین‌شات...</b>',
    loadingPDF: '<b>⏳ در حال گرفتن اسکرین‌شات...</b>',
    success: (apiUsed) => `<b>✅ اسکرین‌شات با موفقیت گرفته شد (API: ${apiUsed})</b>`,
    error: (error) => `<b>❌ خطا در گرفتن اسکرین‌شات: ${error}</b>`,
    adminPanel: '<b>📊 پنل مدیریت</b>\n\n<b>👥 کاربران:</b> {users}\n<b>📌 درخواست‌های کل:</b> {requests}',
    adminError: '<b>⚠️ خطا در پنل ادمین! دوباره امتحان کن.</b>',
    adminAccess: '<b>🚫 فقط ادمین می‌تونه این دستور رو بزنه!</b>',
    settingsUpdated: '✅ تنظیمات به‌روز شد',
    format: 'فرمت',
    fullpage: 'FullPage',
    mode: 'حالت',
    language: 'زبان',
    on: 'روشن 🟢',
    off: 'خاموش 🔴',
    image: 'عـکــس',
    pdf: 'PDF 🟢',
    noApi: 'هیچ API در دسترس نیست.',
    apiError: (api, error) => `<b>⚠️ خطا در ${api}: ${error}</b>`,
    allApisFull: '<b>⚠️ تمام APIها به محدودیت رسیدند! لطفاً کلید جدید اضافه کنید.</b>',
    generalError: '<b>⚠️ خطایی پیش اومد! لطفاً دوباره امتحان کن.</b>'
  },
  en: {
    start: '<b>🤖 Screenshot Bot is now active!</b>\n\n<b>🔹 Send a link to take a screenshot.</b>\n<b>🔹 Use the buttons to adjust settings.</b>',
    invalidUrl: '<b>Please send a valid link (e.g., https://google.com)</b>',
    rateLimit: `<b>⏳ You've reached the daily limit of ${DAILY_LIMIT} requests. Try again tomorrow!</b>`,
    loadingImage: '<b>⏳ Taking screenshot...</b>',
    loadingPDF: '<b>⏳ Taking screenshot...</b>',
    success: (apiUsed) => `<b>✅ Screenshot taken successfully (API: ${apiUsed})</b>`,
    error: (error) => `<b>❌ Error taking screenshot: ${error}</b>`,
    adminPanel: '<b>📊 Admin Panel</b>\n\n<b>👥 Users:</b> {users}\n<b>📌 Total Requests:</b> {requests}',
    adminError: '<b>⚠️ Error in admin panel! Try again.</b>',
    adminAccess: '<b>🚫 Only admins can use this command!</b>',
    settingsUpdated: '✅ Settings updated',
    format: 'Format',
    fullpage: 'FullPage',
    mode: 'Mode',
    language: 'Language',
    on: 'On 🟢',
    off: 'Off 🔴',
    image: 'Image',
    pdf: 'PDF 🟢',
    noApi: 'No API available.',
    apiError: (api, error) => `<b>⚠️ Error in ${api}: ${error}</b>`,
    allApisFull: '<b>⚠️ All APIs have reached their limit! Please add a new key.</b>',
    generalError: '<b>⚠️ An error occurred! Please try again.</b>'
  },
  ar: {
    start: '<b>🤖 تم تفعيل بوت التقاط الشاشة!</b>\n\n<b>🔹 أرسل رابطًا لألتقط صورة شاشة.</b>\n<b>🔹 استخدم الأزرار لتعديل الإعدادات.</b>',
    invalidUrl: '<b>يرجى إرسال رابط صالح (مثل https://google.com)</b>',
    rateLimit: `<b>⏳ لقد وصلت إلى الحد اليومي وهو ${DAILY_LIMIT} طلبات. حاول مرة أخرى غدًا!</b>`,
    loadingImage: '<b>⏳ جارٍ التقاط صورة الشاشة...</b>',
    loadingPDF: '<b>⏳ جارٍ التقاط صورة الشاشة...</b>',
    success: (apiUsed) => `<b>✅ تم التقاط صورة الشاشة بنجاح (API: ${apiUsed})</b>`,
    error: (error) => `<b>❌ خطأ أثناء التقاط صورة الشاشة: ${error}</b>`,
    adminPanel: '<b>📊 لوحة الإدارة</b>\n\n<b>👥 المستخدمون:</b> {users}\n<b>📌 إجمالي الطلبات:</b> {requests}',
    adminError: '<b>⚠️ خطأ في لوحة الإدارة! حاول مرة أخرى.</b>',
    adminAccess: '<b>🚫 يمكن للمدير فقط استخدام هذا الأمر!</b>',
    settingsUpdated: '✅ تم تحديث الإعدادات',
    format: 'الصيغة',
    fullpage: 'صفحة كاملة',
    mode: 'الوضع',
    language: 'اللغة',
    on: 'مفعل 🟢',
    off: 'معطل 🔴',
    image: 'صورة',
    pdf: 'PDF 🟢',
    noApi: 'لا يوجد API متاح.',
    apiError: (api, error) => `<b>⚠️ خطأ في ${api}: ${error}</b>`,
    allApisFull: '<b>⚠️ جميع واجهات البرمجة وصلت إلى الحد الأقصى! يرجى إضافة مفتاح جديد.</b>',
    generalError: '<b>⚠️ حدث خطأ! يرجى المحاولة مرة أخرى.</b>'
  }
};

// 11. توابع کمکی
async function getUserSettings(userId) {
  const settings = await getAsync(`user:${userId}:settings`);
  return settings ? JSON.parse(settings) : { ...defaultSettings };
}

async function updateUserSettings(userId, settings) {
  await setAsync(`user:${userId}:settings`, JSON.stringify(settings));
  await redis.sadd('users', userId);
}

async function checkRateLimit(userId) {
  const today = new Date().toISOString().split('T')[0];
  const key = `user:${userId}:requests:${today}`;
  const requests = await redis.incr(key);
  if (requests === 1) await redis.expire(key, 86400);
  return requests <= DAILY_LIMIT;
}

async function checkApiLimit(api) {
  const month = new Date().toISOString().slice(0, 7);
  const redisKey = `api:${api.counterKey}:${month}`;
  let requests = parseInt(await getAsync(redisKey)) || 0;
  if (requests === 0) {
    await setAsync(redisKey, 1);
    await redis.expire(redisKey, 30 * 86400);
  } else {
    await redis.incr(redisKey);
    requests++;
  }
  return requests <= api.limit;
}

async function getBestApiIndex() {
  const apiStats = await Promise.all(
    SCREENSHOT_APIS.map(async (api) => {
      const month = new Date().toISOString().slice(0, 7);
      const requests = parseInt(await getAsync(`api:${api.counterKey}:${month}`)) || 0;
      return { api, requests };
    })
  );
  const available = apiStats.filter(stat => stat.requests < stat.api.limit);
  return available.length > 0 ? SCREENSHOT_APIS.indexOf(available.sort((a, b) => a.requests - b.requests)[0].api) : -1;
}

async function createPDFFromImage(imageBuffer, format) {
  const pdfDoc = await PDFDocument.create();
  const image = format === 'png' ? await pdfDoc.embedPng(imageBuffer) : await pdfDoc.embedJpg(imageBuffer);
  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  return pdfDoc.save();
}

async function captureScreenshot(url, settings, userId) {
  const bestIndex = await getBestApiIndex();
  if (bestIndex === -1) {
    if (userId.toString() !== ADMIN_ID.toString()) {
      bot.telegram.sendMessage(ADMIN_ID, messages[settings.language].allApisFull, { parse_mode: 'HTML' });
    }
    throw new Error(messages[settings.language].noApi);
  }

  const api = SCREENSHOT_APIS[bestIndex];
  try {
    console.log('تلاش برای API:', api.name, 'با فرمت:', settings.format);
    const apiUrl = api.url({ key: api.key, url: encodeURIComponent(url), ...settings });
    console.log('درخواست به:', apiUrl);
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 45000 });
    settings.apiIndex = bestIndex;
    await updateUserSettings(userId, settings);
    await redis.incr('total_requests');
    return { data: response.data, apiUsed: api.name };
  } catch (error) {
    console.error(`خطا در ${api.name}:`, error.message);
    if (userId.toString() !== ADMIN_ID.toString()) {
      bot.telegram.sendMessage(ADMIN_ID, messages[settings.language].apiError(api.name, error.message), { parse_mode: 'HTML' });
    }
    throw error;
  }
}

// 12. کیبورد تنظیمات
function settingsKeyboard(userId, settings) {
  const lang = settings.language;
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: `${messages[lang].format}: ${settings.format === 'png' ? '✅ PNG' : 'PNG'}`, callback_data: 'set_format_png' },
          { text: `${messages[lang].format}: ${settings.format === 'jpeg' ? '✅ JPEG' : 'JPEG'}`, callback_data: 'set_format_jpeg' }
        ],
        [
          { text: `${messages[lang].fullpage}: ${settings.fullpage ? messages[lang].on : messages[lang].off}`, callback_data: 'toggle_fullpage' }
        ],
        [
          { text: `${messages[lang].mode}: ${settings.mode === 'pdf' ? messages[lang].pdf : messages[lang].image}`, callback_data: 'toggle_mode' }
        ],
        [
          { text: `${messages[lang].language}: ${lang === 'fa' ? '🇮🇷' : lang === 'en' ? '🇬🇧' : '🇸🇦'}`, callback_data: 'change_language' }
        ]
      ]
    },
    parse_mode: 'HTML'
  };
}

// 13. ربات و توکن
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error('توکن ربات تنظیم نشده!');
  process.exit(1);
}
const bot = new Telegraf(TOKEN);

// 14. دستور /start
bot.start(async (ctx) => {
  console.log('دستور /start دریافت شد از:', ctx.from.id);
  const userId = ctx.from.id;
  const settings = await getUserSettings(userId);
  try {
    await updateUserSettings(userId, settings);
    await ctx.reply(messages[settings.language].start, { ...settingsKeyboard(userId, settings), parse_mode: 'HTML' });
  } catch (err) {
    console.error('خطا در /start:', err.message);
    await ctx.reply(messages[settings.language].generalError, { parse_mode: 'HTML' });
  }
});

// 15. دستور /admin
bot.command('admin', async (ctx) => {
  console.log('ورود به دستور /admin از:', ctx.from.id);
  const settings = await getUserSettings(ctx.from.id);
  if (ctx.from.id.toString() !== ADMIN_ID.toString()) {
    console.log('کاربر غیرمجاز:', ctx.from.id, 'ADMIN_ID:', ADMIN_ID);
    return ctx.reply(messages[settings.language].adminAccess, { parse_mode: 'HTML' });
  }
  try {
    const userCount = await redis.scard('users') || 0;
    const totalRequests = parseInt(await redis.get('total_requests')) || 0;
    const text = messages[settings.language].adminPanel
      .replace('{users}', userCount)
      .replace('{requests}', totalRequests);
    await ctx.reply(text, { parse_mode: 'HTML' });
  } catch (err) {
    console.error('خطا در پنل ادمین:', err.message);
    await ctx.reply(messages[settings.language].adminError, { parse_mode: 'HTML' });
  }
});

// 16. پردازش لینک‌ها
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const url = ctx.message.text.trim();
  console.log('متن دریافت شد از:', userId, 'متن:', url);

  if (url.startsWith('/')) return;
  const settings = await getUserSettings(userId);
  try {
    new URL(url);
  } catch {
    return ctx.reply(messages[settings.language].invalidUrl, { parse_mode: 'HTML' });
  }
  if (!(await checkRateLimit(userId))) return ctx.reply(messages[settings.language].rateLimit, { parse_mode: 'HTML' });

  try {
    console.log('تنظیمات فعلی قبل از اسکرین‌شات:', settings);
    // پیام لودینگ بسته به نوع خروجی و زبان
    const loadingMsg = await ctx.reply(
      settings.mode === 'pdf' ? messages[settings.language].loadingPDF : messages[settings.language].loadingImage,
      { parse_mode: 'HTML' }
    );
    const { data: imageData, apiUsed } = await captureScreenshot(url, settings, userId);

    if (settings.mode === 'pdf') {
      // تنظیم وضعیت "در حال ارسال سند" زیر اسم ربات
      await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
      const pdfBuffer = await createPDFFromImage(imageData, settings.format);
      await ctx.replyWithDocument({ source: Buffer.from(pdfBuffer), filename: `screenshot-${Date.now()}.pdf` });
    } else {
      // تنظیم وضعیت "در حال ارسال عکس" زیر اسم ربات
      await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_photo');
      await ctx.replyWithPhoto({ source: Buffer.from(imageData) });
    }
    try {
      await ctx.deleteMessage(loadingMsg.message_id);
    } catch (e) {
      console.error('خطا در حذف پیام لودینگ:', e.message);
    }
    await ctx.reply(messages[settings.language].success(apiUsed), { parse_mode: 'HTML' });
  } catch (error) {
    console.error('خطا در گرفتن اسکرین‌شات:', error.message);
    await ctx.reply(messages[settings.language].error(error.message), { parse_mode: 'HTML' });
  }
});

// 17. مدیریت تنظیمات (با آپدیت کامل پیام)
bot.action(['set_format_png', 'set_format_jpeg', 'toggle_fullpage', 'toggle_mode', 'change_language'], async (ctx) => {
  const userId = ctx.from.id;
  const action = ctx.callbackQuery.data;
  const settings = await getUserSettings(userId);
  const oldSettings = JSON.stringify(settings);

  if (action === 'change_language') {
    settings.language = settings.language === 'fa' ? 'en' : settings.language === 'en' ? 'ar' : 'fa';
  } else {
    switch (action) {
      case 'set_format_png': settings.format = 'png'; break;
      case 'set_format_jpeg': settings.format = 'jpeg'; break;
      case 'toggle_fullpage': settings.fullpage = !settings.fullpage; break;
      case 'toggle_mode': settings.mode = settings.mode === 'pdf' ? 'image' : 'pdf'; break;
    }
  }

  if (JSON.stringify(settings) !== oldSettings) {
    await updateUserSettings(userId, settings);
    // آپدیت کامل پیام (متن + کیبورد)
    await ctx.editMessageText(messages[settings.language].start, {
      ...settingsKeyboard(userId, settings),
      parse_mode: 'HTML'
    });
  }
  await ctx.answerCbQuery(messages[settings.language].settingsUpdated);
});

// 18. مدیریت خطاها
bot.catch((err, ctx) => {
  console.error('خطای عمومی در ربات:', err.message, 'کنتکست:', ctx.update);
  const settings = ctx.from ? getUserSettings(ctx.from.id) : { language: 'fa' };
  ctx.reply(messages[settings.language].generalError, { parse_mode: 'HTML' });
});

// 19. راه‌اندازی ربات
bot.launch()
  .then(() => {
    console.log('🤖 ربات فعال شد و به تلگرام وصل شد!');
    console.log('دستورهای ثبت‌شده: /start, /admin');
    pingSelf();
  })
  .catch(err => console.error('🚫 خطا در اتصال به تلگرام:', err));

// 20. مدیریت خاموشی
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
