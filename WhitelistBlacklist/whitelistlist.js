const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'whitelists',
    aliases: ['wls'],
    description: 'Liste les utilisateurs dans la whitelist.',
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

        let whitelist = await db.get('whitelist') || [];
        if (whitelist.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Il n\'y a actuellement aucun utilisateur dans la whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < whitelist.length; i += chunkSize) {
            chunks.push(whitelist.slice(i, i + chunkSize));
        }

        let page = 0;

        const sendPage = () => {
            const whitelistList = chunks[page].map((id, index) => `${index + 1 + page * chunkSize}) <@${id}> (${id})`).join('\n');

            return new EmbedBuilder()
                .setColor(config.color)
                .setTitle('**Whitelist**')
                .setDescription(`\n${whitelistList}`)
                .setFooter({ text: config.footer });
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === chunks.length - 1)
            );

        const msg = await message.reply({ embeds: [sendPage()], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'next' && page < chunks.length - 1) {
                page++;
            } else if (interaction.customId === 'prev' && page > 0) {
                page--;
            }

            await interaction.update({ embeds: [sendPage()], components: [row] });

            row.components[0].setDisabled(page === 0);
            row.components[1].setDisabled(page === chunks.length - 1);
        });

        collector.on('end', () => {
            row.components.forEach(button => button.setDisabled(true));
            msg.edit({ components: [row] });
        });
    }
};
