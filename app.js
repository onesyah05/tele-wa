const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
var gorupName = "Test"; //nama gorup Crypto ngobrol v2 2021
var key = "kick"; // pesan perintah 
const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });


client.on('qr', (qr) => {
    qrcode.generate(qr,{small: true})
});


client.on('authenticated', (session) => {
    
    sessionCfg=session;
    fs.writeFile('./session.json', JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
    console.log('BOT CHACKET COUNT WA');

    console.log('Bot harus admin grup untuk auto kick');

    console.log('send "'+key+'-jumalh minimal chat" tanpa spasi dan tanda kutip');
    console.log('Jika ada yang send ke group sesuai format di atas maka bot akan jalan');
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    if (chat.isGroup) {
        chat.setMessagesAdminsOnly()
        var m = msg.body.split('-');
        if (chat.name == gorupName && m[0].toLowerCase() == key.toLowerCase() ) {
            console.log(`\x1b[42m \x1b[30m *Group Details* \x1b[0m
Name: ${chat.name}
Created At: ${chat.createdAt.toString()}
Created By: ${chat.owner.user}
Participant count: ${chat.participants.length}
`);
            const data = [];

            var limit = {"limit":100000000000000}
            console.log("Scraping chat Start")
            let list = await chat.fetchMessages(limit);
            console.log("Scraping chat Finish")
            list.forEach( v=>{
                if (v.from.search("-") > 0) {
                    var a = v.from.split("-")
                    if (data[a[0]] >= m[1]) {
                        return;
                    }
                    data[a[0]] = (data[a[0]] || 0)+1;
                }else{
                    var a = v.from.split("@")
                    if (data[a[0]] >= m[1]) {
                        return;
                    }
                    data[a[0]] = (data[a[0]] || 0)+1;
                }
            })

            console.log(data);
            chat.participants.forEach( async (v,i) => {
                var a = v.id['user']
                var c = i++;
                var c = c+1
                if (data[a] < m[1] || !data[a]) {
                    // chat.removeParticipants([v.id.user+"@"+v.id.server]) //Auto kick Hilangkan komen untuk mengaktifkan
                    console.log(c+" User "+a+" - \x1b[41m\x1b[37m chat "+data[a] + " [Kicked] \x1b[0m | admin :" + v.isAdmin + " | Super Admin :" + v.isSuperAdmin)

                }else{
                    // msg.reply( a+" - chat "+data[a] + " [Save] ");    // auto replay hikangkan komen utnuk mengaktifkan
                    console.log(c+" User "+a+" - \x1b[42m\x1b[30m chat "+data[a] + " [Save] \x1b[0m| admin :" + v.isAdmin + " | Super Admin :" + v.isSuperAdmin)
                }

            })
        }
    }
});

client.initialize();