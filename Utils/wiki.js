const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const config = require('../../Client/config');

module.exports = {
    name: 'wiki',
    description: 'Fait une recherche Wikipedia.',
    async execute(message, args) {
        if (args.length === 0) {
            const noArgsEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez spécifier un mot-clé pour la recherche Wikipedia.')
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [noArgsEmbed] });
        }

        const query = args.join(' ');
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.type === 'https://en.wikipedia.org/api/rest_v1/page/summary/error') {
                const errorEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Erreur de recherche : ${data.detail}`)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [errorEmbed] });
            }

            if (!data.title || !data.content_urls || !data.content_urls.desktop || !data.content_urls.desktop.page) {
                const notFoundEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucune information trouvée pour le mot-clé spécifié.')
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [notFoundEmbed] });
            }

            const wikiEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(data.title)
                .setURL(data.content_urls.desktop.page) 
                .setDescription(`[Lire l'article complet sur Wikipedia](${data.content_urls.desktop.page})`)
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [wikiEmbed] });
        } catch (error) {
            console.error(error);
            const fetchErrorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la recherche sur Wikipedia.')
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [fetchErrorEmbed] });
        }
    }
};
