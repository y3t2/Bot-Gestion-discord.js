const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config.js');

module.exports = {
    name: 'verify',
    description: 'Configurer le système de vérification.',
    
    async execute(message, args) {
        const ownerIds = await db.get('owners') || [];

        if (!ownerIds.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('**Verification**')
            .setDescription('Configuration du **salon**/**rôle**/**activer/desactiver** pour la verification')
            .setColor(config.color)
            .setFooter({ text: config.footer });

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('setup_verify')
                    .setPlaceholder('Sélectionnez une option')
                    .addOptions([
                        {
                            label: 'Config-salon',
                            description: 'Définir le salon pour l\'embed de vérification',
                            value: 'setup_channel'
                        },
                        {
                            label: 'Config-rôle',
                            description: 'Définir le rôle à attribuer après vérification',
                            value: 'setup_role'
                        },
                        {
                            label: 'Activer/Désactiver',
                            description: 'Activer ou désactiver le système de vérification',
                            value: 'toggle_system'
                        }
                    ])
            );

        await message.channel.send({
            embeds: [embed],
            components: [selectMenu]
        });
    }
};
