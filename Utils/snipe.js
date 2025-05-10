const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'snipe',
    description: 'Affiche le dernier message supprimé dans ce salon.',
    async execute(message) {
        const channelId = message.channel.id;

        const lastDeletedMessage = await db.get(`deletedMessage_${channelId}`);

        if (!lastDeletedMessage) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucun message supprimé trouvé dans ce salon.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Dernier message supprimé')
            .setDescription(`**Auteur : ** <@${lastDeletedMessage.authorId}>\n**Message : ** ${lastDeletedMessage.content}`)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    },
};
