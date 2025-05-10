const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'blacklistranks',
    aliases: ['blranks'],
    description: 'Affiche les utilisateurs actuellement en liste noire.',
    async execute(message) {
        const authorId = message.author.id;

        const owners = await db.get('owners') || [];
        if (!owners.includes(authorId)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${authorId}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let blacklistedUsers = await db.get(`blacklisted_users_${message.guild.id}`) || [];
        
        if (blacklistedUsers.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucun utilisateur n\'est actuellement dans la BlackListRank.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < blacklistedUsers.length; i += chunkSize) {
            chunks.push(blacklistedUsers.slice(i, i + chunkSize));
        }

        let page = 0;

        const sendPage = () => {
            const blacklistedList = chunks[page].map((userId, index) => {
                const user = message.client.users.cache.get(userId);
                return `${index + 1 + page * chunkSize}) ${user ? `<@${userId}>` : userId} (${userId})`;
            }).join('\n');

            return new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`**BlackListRank**\n${blacklistedList}`)
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
