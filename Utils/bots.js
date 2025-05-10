const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'bots',
    description: 'Affiche tous les bots présents sur le serveur.',
    async execute(message) {
        const botsCollection = message.guild.members.cache.filter(member => member.user.bot);

        if (botsCollection.size === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Il n\'y a aucun bot sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const bots = Array.from(botsCollection.values()); 
        const botsPerPage = 5; 
        let currentPage = 0; 

        const generateEmbed = (page) => {
            const start = page * botsPerPage;
            const end = start + botsPerPage;
            const botsOnPage = bots.slice(start, end);
            const totalPages = Math.ceil(bots.length / botsPerPage);

            const embed = new EmbedBuilder()
                .setTitle(`Liste des Bots - Page ${currentPage + 1}/${totalPages}`)
                .setColor(config.color)
                .setFooter({ text: config.footer });

            botsOnPage.forEach(bot => {
                const isCertified = bot.user.flags?.has(1 << 16) ? 'OUI' : 'NON'; 

                embed.addFields({
                    name: `Bot: ${bot.user.tag}`,
                    value: `Identifiant: ${bot.id}\nCertifié: ${isCertified}`,
                });
            });

            return embed;
        };

        const createPaginationButtons = () => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('◀')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('▶')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === Math.ceil(bots.length / botsPerPage) - 1)
                );
        };

        const embedMessage = await message.channel.send({
            embeds: [generateEmbed(currentPage)],
            components: [createPaginationButtons()],
        });

        const collector = embedMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas interagir avec cette pagination.')
                    .setFooter({ text: config.footer })
                ], ephemeral: true });
            }

            if (interaction.customId === 'previous') {
                currentPage--;
            } else if (interaction.customId === 'next') {
                currentPage++;
            }

            await interaction.update({
                embeds: [generateEmbed(currentPage)],
                components: [createPaginationButtons()],
            });
        });

        collector.on('end', () => {
            embedMessage.edit({
                components: [],
            });
        });
    }
};
