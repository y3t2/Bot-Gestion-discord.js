const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'boosters',
    description: 'Affiche tous les boosters.',
    async execute(message) {
        const { guild } = message;

        try {
            const members = await guild.members.fetch();
            const boosters = members.filter(member => member.premiumSince);

            if (boosters.size === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription("Il n'y a actuellement aucun membre qui booste le serveur.")
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            const boosterList = boosters.map(member => {
                const boostDate = member.premiumSince.toLocaleDateString();
                return `${member.user} - Boost depuis le ${boostDate}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(' Boosters du Serveur')
                .setDescription(boosterList)
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération des boosters:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la récupération des boosters.')
                .setFooter({ text: config.footer });

            message.reply({ embeds: [errorEmbed] });
        }
    }
};
