const { exec } = require("child_process");
const fs = require('fs');

module.exports = {
    name: 'areadownload',
    execute (interaction, Discord, client) {
        const coorX = interaction.options.getString('xkoor')
        const coorY = interaction.options.getString('ykoor')
        const canvas = interaction.options.getString("canvas")

        let canvasRiyalID = "0";

        switch(canvas) {
          case 'world':
            canvasRiyalID = "5";
            break;
          case 'mini':
            canvasRiyalID = "0";
            break;
          case 'graffiti':
            canvasRiyalID = "1";
            break;
          case 'top15':
            canvasRiyalID = "6";
            break;
        }


        interaction.deferReply();
        //interaction.reply('görüntün indiriliyor fiksicim...')

        exec(`python commands\\areaDownPYA.py ${canvasRiyalID} ${coorX} ${coorY} ${interaction.user.id}.png`, (error, stdout, stderr) => {
            if (error) {
                console.log(`areadownload hatası: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`areadownload stderr: ${stderr}`);
                return;
            }

             if (stdout.includes('invalid') || stdout.includes('aligned wrong')) {
              try {
                interaction.editReply({
                  content: "Corner coordinates are aligned wrong", 
                  files: [{ attachment: `ogretici.gif` }]
                })
              } catch (error) {
                console.log(`[AREADOWNLOAD ERROR] - ${error}`)
              }
                return stdout;
            } else { 

            setTimeout(function(){
                sendToChannel();
            }, 1000);
        }
          });

          async function sendToChannel() {

          let zencigot = true;
          while (zencigot == true) {
            if (fs.existsSync(`${interaction.user.id}.png`)) {
              interaction.editReply({
                //content: "Resmin hazır fiksicim :3",
                content: "your image was downloaded successfully", 
                files: [{ attachment: `${interaction.user.id}.png` }]
            });
              zencigot = false;
              setTimeout(function(){
                fs.unlinkSync(`${interaction.user.id}.png`)
            }, 2000);
          } else {
              return;
          }
        }
          }
    }
}