const { Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        console.log(`Connecté en tant que ${client.user.tag}`);

        const loadCommands = (dir) => {
            return fs.readdirSync(path.join(__dirname, `../Commands/${dir}`))
                .filter(file => file.endsWith('.js'));
        };

        const commandFiles = loadCommands('');
        const GestionsFiles = loadCommands('Gestions');
        const ModerationsFiles = loadCommands('Moderations');
        const OwnersFiles = loadCommands('Owners');
        const WhitelistBlacklistFiles = loadCommands('WhitelistBlacklist');
        const UtilsFiles = loadCommands('Utils');
        const ProtectFiles = loadCommands('Protect'); 
        const LogsFiles = loadCommands('Logs');

        const totalCommands = commandFiles.length +
            GestionsFiles.length +
            ModerationsFiles.length +
            OwnersFiles.length +
            WhitelistBlacklistFiles.length +
            UtilsFiles.length +
            ProtectFiles.length +
            LogsFiles.length;

        const loadEvents = (dir) => {
            return fs.readdirSync(path.join(__dirname, `../Events/${dir}`))
                .filter(file => file.endsWith('.js'));
        };

        const eventFiles = loadEvents(''); 

        const totalEvents = eventFiles.length 


        console.log(`Total des commandes chargées : ${totalCommands}`);
        console.log(`Total des événements chargés : ${totalEvents}`);

        client.user.setActivity('© Powered by d_1114', { 
            type: ActivityType.Streaming, 
            url: 'https://www.twitch.tv/d_1114_On_Top'
        });
    }
};
