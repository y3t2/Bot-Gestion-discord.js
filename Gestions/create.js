const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'create',
    description: 'Copie un émoji d\'un autre serveur.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`);
            return message.reply({ embeds: [embed] });
        }

        if (!args.length) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez fournir l\'émoji que vous souhaitez copier.');
            return message.reply({ embeds: [embed] });
        }

        const emoji = args[0];
        const match = emoji.match(/<a?:\w+:(\d+)>/);
        const emojiId = match?.[1];
        const emojiName = match?.[0]?.split(':')[1]; 

        if (!emojiId || !emojiName) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Émoji invalide ou introuvable. Assurez-vous de mentionner un émoji.');
            return message.reply({ embeds: [embed] });
        }

        const emojiUrlPng = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
        const emojiUrlGif = `https://cdn.discordapp.com/emojis/${emojiId}.gif`;

        try {
            const fetch = (await import('node-fetch')).default;

            let response = await fetch(emojiUrlGif);
            let emojiUrl;
            let isAnimated = false;

            if (response.ok) {
                emojiUrl = emojiUrlGif;
                isAnimated = true;
            } else {
                response = await fetch(emojiUrlPng);
                if (response.ok) {
                    emojiUrl = emojiUrlPng;
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Émoji introuvable ou invalide.');
                    return message.reply({ embeds: [embed] });
                }
            }

            const newEmoji = await message.guild.emojis.create({
                attachment: emojiUrl,
                name: emojiName,
                reason: `Émoji copié par ${message.author.tag}`
            });

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('Émoji Copié')
                .setDescription(`
                    **Nom :** ${newEmoji.name}
                    **Animé :** ${isAnimated ? 'Oui' : 'Non'}
                `)
                .setThumbnail(newEmoji.url)
                .setFooter({ text: config.footer });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la création de l\'émoji:', error);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la création de l\'émoji.');
            message.reply({ embeds: [embed] });
        }
    },
};
