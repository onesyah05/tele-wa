
require('dotenv').config();
const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const TelegramBot = require('node-telegram-bot-api');
const token = '-----';// Token Bot TELE
const bot = new TelegramBot(token, {polling: true});

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
var groupName = "Test"; //nama gorup WA


const idGroup =   process.env.ID;

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });
process.env["NTBA_FIX_350"] = 1;



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
console.log('Ketik /set di group yang di inging kan, lalu kirim pesan ke bot');
client.on('ready', () => {
    console.log('Client is ready!');
});

bot.onText(/\/set/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    bot.getChat(chatId).then(data=>{
        console.log(data.id);
        fs.unlinkSync('.env')
        fs.writeFileSync('.env', 'ID='+data.id);
    })
    // console.log(bot.getChat(chatId).chat.id)
    // send back the matched "whatever" to the chat
    // bot.sendMessage(chatId, resp);
  });
  

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.photo) {
        if (!fs.existsSync('photos')){
            fs.mkdirSync('photos', { recursive: true });
        }
        
        const file_id = msg.photo[3].file_id;
        const caps = msg.caption;
        bot.getFile(file_id).then(function (resp) {
                bot.downloadFile(file_id, "photos/").then(function (resps) {
                resps
                });
                async function group(cap = '',file) {
                    const group =  await client.getChats().then(chats => {
                        chats.forEach(v => {
                            if (v.name == groupName) {
                                // console.log(v.id._serialized)
                                const media = MessageMedia.fromFilePath('./'+file);
                                client.sendMessage(v.id._serialized, media,{caption: cap}).then(resp =>{
                                    resp
                                })
                               
                                    
                                
                                
                            }
                        });
                    });
                    const fileOptions = {
                        // Explicitly specify the file name.
                        filename: 'customfilename',
                        // Explicitly specify the MIME type.
                        contentType: 'image/jpeg',
                      };
                    bot.sendPhoto(idGroup,fs.createReadStream('./'+file),{caption : cap} ,fileOptions).catch((error) => {
                        console.log(error.code);  // => 'ETELEGRAM'
                        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
                      });
                }
                group(caps,resp.file_path);
                
        });
    }
    if (msg.video) {
        if (!fs.existsSync('videos')){
            fs.mkdirSync('videos', { recursive: true });
        }
        const file_id = msg.video.file_id;
        const caps = msg.caption;
        bot.getFile(file_id).then(function (resp) {
            // console.log(resp);
                bot.downloadFile(file_id, "videos/").then(function (resps) {
                });
                async function group(cap = '',file) {
                    const group =  await client.getChats().then(chats => {
                        chats.forEach(v => {
                            if (v.name == groupName) {
                               
                                const media = MessageMedia.fromFilePath('./'+file);
                                client.sendMessage(v.id._serialized, media,{caption: cap}).then(resp =>{
                                    // console.log(resp);
                                    resp
                                })
                                
                            }
                        });
                    });
                }
                group(caps,resp.file_path);
        });
    }

    if (msg.text && !msg.entities) {
        
                async function group(file) {
                    const group =  await client.getChats().then(chats => {
                        chats.forEach(v => {
                            if (v.name == groupName) {
                                var chat = `*Chat from ${msg.from.username}*
${file}`
                                client.sendMessage(v.id._serialized, chat,{caption: "cap"}).then(resp =>{
                                    resp
                                })
                                bot.sendMessage(idGroup, file);
                            }
                        });
                    });
                }
                group(msg.text);
    }
    // console.log(msg);
});


client.initialize();