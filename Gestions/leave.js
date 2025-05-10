const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'leave',
    description: 'Permet au bot de quitter le serveur actuel.',
    usage: '+leave',
    async execute(message) {
        if (!config.staff.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const owner = await message.guild.fetchOwner();

        await message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Je quitte le serveur de **${owner.user.tag}** (ID: ${owner.id}) par **${message.author.tag}**.`)
                .setFooter({ text: config.footer })
            ]
        });

        try {
            await message.guild.leave();
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de la tentative de quitter le serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
