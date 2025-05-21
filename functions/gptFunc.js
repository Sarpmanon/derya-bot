const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

async function gptFunc(message, client) {
  if (message.author.bot) return;
  if (message.content.startsWith('https://pixelya.fun/#')) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;

  const conversationLog = [
    {
      role: 'system',
      content: "samimi arkadaşlarız gibi konuş ara sıra alay et saçma bulduğun cümlelerin sonunda amk ve aq ekle ve sosyal medya ağzıyla konuş ve ara sıra küfret. Mesajlarının uzunluğu asla ama asla 300 harfi geçmesin."
    }
  ];

  let imageUrl;

  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    if (attachment.contentType && attachment.contentType.startsWith('image/')) {
      imageUrl = attachment.url;
    }
  }


  let prevMessages = await message.channel.messages.fetch({ limit: 5 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.content.startsWith('!')) return;
    if (msg.author.id === client.user.id) {
      conversationLog.push({
        role: 'assistant',
        content: msg.content,
        name: msg.author.username
      });
    } else if (msg.author.id === message.author.id) {
      conversationLog.push({
        role: 'user',
        content: msg.content,
        name: msg.author.username
      });
    }
  });

  conversationLog.push({
    role: 'user',
    content: message.content,
    name: message.author.username
  });

  try {
    let result;

    if (imageUrl) {
      result = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          ...conversationLog,
          {
            role: 'user',
            content: [
              { type: 'text', text: message.content || "Bu resmi samimi arkadaşlarız gibi inceleyip yorumla" },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });
    } else {
      result = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationLog,
        max_tokens: 300
      });
    }

    const reply = result.choices[0].message.content;

    if (reply.length < 2000) {
      await message.reply(reply);
    } else {
      await message.reply('Mesaj çok uzun oldu be, bıçak gibi kesmem lazım aq');
    }
  } catch (err) {
    console.error('[OPENAI ERROR] -', err);
  }
}

module.exports = gptFunc;