const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'banall',
    description: 'Bannit tous les membres possibles du serveur après confirmation.',
    usage: '+banall',
    async execute(message) {
        // Vérifie si l'utilisateur a la permission d'exécuter la commande
        if (!config.staff.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        // Demande de confirmation
        const confirmationEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(
                `⚠️ **Attention** : Cette commande va bannir **tous les membres possibles** du serveur.\n\nTapez **yes** pour confirmer ou **no** pour annuler.`
            )
            .setFooter({ text: config.footer });

        await message.channel.send({ embeds: [confirmationEmbed] });

        // Filtrer les réponses pour la confirmation
        const filter = (response) => {
            return response.author.id === message.author.id && ['yes', 'no'].includes(response.content.toLowerCase());
        };

        const collector = message.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async (response) => {
            const reply = response.content.toLowerCase();

            if (reply === 'yes') {
                collector.stop('confirmed');

                // Fetch des membres du serveur
                const members = await message.guild.members.fetch();

                // Message d'information
                await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription(`🚨 Bannissement de **${members.size}** membres en cours...`)
                            .setFooter({ text: config.footer })
                    ]
                });

                // Bannissement des membres
                let banCount = 0;

                for (const member of members.values()) {
                    if (!member.bannable || member.user.bot) continue; // Ignorer les bots ou les membres non bannissables
                    try {
                        await member.ban({ reason: `Banni par ${message.author.tag}` });
                        banCount++;
                    } catch (error) {
                        console.error(`Impossible de bannir ${member.user.tag}:`, error);
                    }
                }

                // Confirmation après le bannissement
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription(`✅ **${banCount}** membres ont été bannis avec succès.`)
                            .setFooter({ text: config.footer })
                    ]
                });
            } else if (reply === 'no') {
                collector.stop('cancelled');
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription('❌ Commande annulée.')
                            .setFooter({ text: config.footer })
                    ]
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason !== 'confirmed' && reason !== 'cancelled') {
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription('⏱️ Temps écoulé. La commande a été annulée.')
                            .setFooter({ text: config.footer })
                    ]
                });
            }
        });
    }
};
