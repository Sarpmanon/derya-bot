const Configuration = require('openai');
const OpenAIApi = require('openai');
require('dotenv').config();

//I took this code from a tutorial so you can ignore this as well (lol)
async function gptFunc(message, client) {
    if (message.author.bot) return;
    if (message.content.startsWith('https://pixelya.fun/#')) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    const configuration = new Configuration({
      apiKey: process.env.API_KEY,
    });
    
    const openai = new OpenAIApi(configuration);

    let conversationLog = [
      { role: 'system', content: "samimi arkadaşlarız gibi konuş ara sıra alay et saçma bulduğun cümlelerin sonunda amk ve aq ekle ve sosyal medya ağzıyla konuş ve ara sıra küfret. Mesajlarının uzunluğu asla ama asla 300 harfi geçmesin." },
    ];
  
    try {
      //await message.channel.sendTyping();
      let prevMessages = await message.channel.messages.fetch({ limit: 5 });
      prevMessages.reverse();
      
      prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id == client.user.id) {
          conversationLog.push({
            role: 'assistant',
            content: msg.content,
            name: msg.author.username
              .replace(/\s+/g, '_')
              .replace(/[^\w\s]/gi, ''),
          });
        }
  
        if (msg.author.id == message.author.id) {
          conversationLog.push({
            role: 'user',
            content: msg.content,
            name: message.author.username
              .replace(/\s+/g, '_')
              .replace(/[^\w\s]/gi, ''),
          });
        }
      });
  
      const result = await openai
        .chat.completions.create({
          model: 'gpt-4.1',
          messages: conversationLog,
        })
        .catch((error) => {
          console.log(`yine mi openai hatası yapma etme gözünü seveyim: ${error}`);
        });
      if (result.choices[0].message.content.length < 2000) {
        await message.reply(result.choices[0].message.content);
      }
      else {
        await message.reply('mesaj çok uzun be fiksicim (masayı yumruklar)')
      }
    } catch (error) {
      console.log(`yine mi hata verdi yapma etme gözünü seveyim: ${error}`);
    }
}
module.exports = gptFunc;
