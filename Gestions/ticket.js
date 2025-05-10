const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');
const configticket = require('../../Data/configticket.json');

const db = new QuickDB();

module.exports = {
    name: 'ticket', 
    description: 'Ouvrir un ticket de support',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const username = message.author.username;

        const ticketEmbed = new EmbedBuilder()
            .setTitle(configticket.title)
            .setDescription(configticket.description.replace(/{username}/g, username))
            .setColor(config.color)
            .setFooter({ text: configticket.footer })
            .setImage(configticket.image_url);

        const ticketButtonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel(configticket.button_label)
                    .setStyle(ButtonStyle.Primary)
            );

        await message.channel.send({
            embeds: [ticketEmbed],
            components: [ticketButtonRow],
        });
    },
};



