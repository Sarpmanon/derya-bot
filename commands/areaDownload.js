const { exec } = require("child_process");
const fs = require('fs');
const Sequelize = require('sequelize');

module.exports = {
    name: 'areadownload',
    execute (interaction, Discord, client) {
        const coorX = interaction.options.getString('xkoor')
        const coorY = interaction.options.getString('ykoor')
        interaction.deferReply();
        //interaction.reply('görüntün indiriliyor fiksicim...')
        const sequelize = new Sequelize('database', 'user', 'password', {
          host: 'localhost',
          dialect: 'sqlite',
          logging: false,
          // SQLite only
          storage: 'database.sqlite',
        });
        exec(`python commands\\areaDownPYA.py 5 ${coorX} ${coorY} ${interaction.user.id}.png`, (error, stdout, stderr) => {
            if (error) {
                console.log(`areadownload hatası: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`areadownload stderr: ${stderr}`);
                return;
            }

             if (stdout.includes('invalid') || stdout.includes('aligned wrong')) { 
                interaction.reply({
                  content: "Köşe koordinatları yanlış ayarlanmış", 
                  files: [{ attachment: `ogretici.gif` }]
              })
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
                content: "Resmin hazır fiksicim :3", 
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