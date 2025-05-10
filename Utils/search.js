const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'search',
    description: 'Effectue une recherche sur Google.',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un terme de recherche.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Recherche Google')
            .setDescription(`**Recherche :** ${query}\n**Auteur :** ${message.author.tag}\n[Voir les résultats ici](${searchUrl})`)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    }
};
