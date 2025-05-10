const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');

module.exports = {
    name: 'clearuser',
    description: 'Supprime un nombre spécifié de messages d\'un utilisateur.',
    async execute(message, args) {
        const member = message.member;
        const owners = await db.get('owners') || [];

        if (!Array.isArray(owners)) {
            console.error('Les propriétaires doivent être stockés dans un tableau.');
            return;
        }

        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez mentionner un utilisateur dont vous voulez supprimer les messages.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const amount = parseInt(args[1], 10);
        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un nombre valide de messages à supprimer.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            await message.delete();
        } catch (error) {
            console.error('Erreur lors de la suppression du message de la commande:', error);
        }

        try {
            const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
            const userMessages = fetchedMessages.filter(msg => msg.author.id === user.id);

            if (userMessages.size === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Aucun message trouvé pour cet utilisateur dans les 100 derniers messages.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            const messagesToDelete = userMessages.first(amount);

            await message.channel.bulkDelete(messagesToDelete, true);

            const confirmationMessage = await message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les messages de l'utilisateur ${user.tag} ont été suprimé.`)
                    .setFooter({ text: config.footer })
                ]
            });

            setTimeout(async () => {
                try {
                    await confirmationMessage.delete();
                } catch (error) {
                    console.error('Erreur lors de la suppression du message de confirmation:', error);
                }
            }, 1500);

        } catch (error) {
            console.error('Erreur lors de la suppression des messages:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Il y a eu une erreur lors de la suppression des messages.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
