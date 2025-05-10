const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'owner',
    description: 'Ajoute un Owner .',
    async execute(message, args) {
        const ownerId = args[0]?.replace(/[<>@!]/g, '');

        const isOwner = await db.get('owners') || [];
        const isStaff = config.staff.includes(message.author.id);

        if (!isOwner.includes(message.author.id) && !isStaff) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!ownerId) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez fournir un ID ou une mention d\'un utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let owners = await db.get('owners') || [];
        if (owners.includes(ownerId)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur est déjà un owner.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        owners.push(ownerId);
        await db.set('owners', owners);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${ownerId}> a été ajouté en tant qu'owner.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
