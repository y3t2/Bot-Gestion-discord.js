const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'clear',
    description: 'Supprime un nombre de messages spécifié.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!args[0] || isNaN(args[0])) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous devez spécifier un nombre valide de messages à supprimer.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const amount = parseInt(args[0]) + 1; 

        try {
            const fetched = await message.channel.messages.fetch({ limit: amount });
            await message.channel.bulkDelete(fetched);
            message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`J'ai supprimé ${args[0]} messages.`)
                    .setFooter({ text: config.footer })
                ]
            }).then(msg => {
                setTimeout(() => msg.delete(), 1000);
            });
        } catch (error) {
            console.error('Erreur lors de la suppression des messages :', error);
            message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Il y a eu une erreur en essayant de supprimer les messages.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
