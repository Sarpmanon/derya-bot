const { exec } = require("child_process");
const fs = require('fs');

const activeUsers = new Set();

async function downloadPixelya(message) {
  const userId = message.author.id;

  if (activeUsers.has(userId)) {
      return message.reply('Wait before the first command is complete.');
  }

  activeUsers.add(userId)

  try {
    const splitMessage = message.content.split(',') //https://pixelya.fun/#d,6353,-8252,-24,
    const splitCanvas = splitMessage[0].split('#')
    let canvasID;
    let randomAssVar = 500;

    switch(splitCanvas[1]) {
      case 'd':
        canvasID = 5;
        break;
      case 'w':
        canvasID = 0;
        break;
      case 'g':
        canvasID = 1;
        break;
      case 't':
        canvasID = 6;
        randomAssVar = 50;
        break;
    }
    

    const x_start = splitMessage[1] - randomAssVar;
    const y_start = splitMessage[2] - randomAssVar;
    const x_end = Number(splitMessage[1]) + randomAssVar;
    const y_end = Number(splitMessage[2]) + randomAssVar;
    
    const startx_starty = x_start + "_" + y_start
    const endx_endy = x_end + "_" + y_end
          
    msg = await message.reply('Your image is being downloaded, give me a second...')
    //await message.channel.sendTyping();

    exec(`python commands\\areaDownPYA.py ${canvasID} ${startx_starty} ${endx_endy} ${message.author.id}.png`, (error, stdout, stderr) => {
      if (error) {
          console.log(`areadownload hatası: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`areadownload stderr: ${stderr}`);
          return;
      }
      //console.log(stdout)


      setTimeout(function(){
        sendToChannel();
    }, 1000);
    })
    }
    catch (error) {
      console.log(`[PYA DOWNLOAD ERROR] ${error}`)
      return;
    }

    async function sendToChannel() {
      try {
      let zencigot = true;
      while (zencigot == true) {
        if (fs.existsSync(`${message.author.id}.png`)) {
          await msg.edit({
            content: "Your image is ready.", 
            files: [{ attachment: `${message.author.id}.png` }] });
          zencigot = false;
          setTimeout(function(){
            fs.unlinkSync(`${message.author.id}.png`)
        }, 2000);
      } else {
          return;
      }
    }
    } catch (err) {
      console.log(`[PYA MESSAGE EDIT ERROR] ` + err)
    } finally {
      activeUsers.delete(userId);
      /*if (fs.existsSync(`${message.author.id}.png`)) {
        await msg.edit({
          content: "Your image is ready pookie, enjoy it :3", 
          files: [{ attachment: `${message.author.id}.png` }] });
        zencigot = false;
        setTimeout(function(){
          fs.unlinkSync(`${message.author.id}.png`)
      }, 2000);
    } else {
        return;
    }*/
    }
    }
}

module.exports = downloadPixelya;