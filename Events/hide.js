const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const hiddenList = await db.get('hiddenList') || [];

        if (hiddenList.includes(message.author.id)) {
            await message.delete();

            // Optionnel : Envoi d'une notification dans un canal de log ou dans le même canal (si nécessaire)
            // Si vous souhaitez envoyer une notification dans un canal spécifique (ex: #logs)
            // const logChannel = message.guild.channels.cache.get('ID_DU_CANAL_DE_LOGS');
            // if (logChannel) {
            //     logChannel.send({
            //         embeds: [new EmbedBuilder()
            //             .setColor(config.color)
            //             .setDescription(`Le message de <@${message.author.id}> a été supprimé car cet utilisateur est dans la liste des cachés.`)
            //             .setFooter({ text: config.footer })
            //         ]
            //     });
            // }
        }
    }
};
