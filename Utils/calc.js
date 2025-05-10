const { EmbedBuilder } = require('discord.js');
const math = require('mathjs');
const config = require('../../Client/config.js');

module.exports = {
    name: 'calc',
    description: 'Permet de résoudre des calculs ou des équations.',
    async execute(message, args) {
        if (args.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez spécifier une expression mathématique à évaluer.')
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        }

        const expression = args.join(' ');

        try {
            const result = math.evaluate(expression);

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('Résultat du Calcul')
                .addFields(
                    { name: 'Expression', value: `\`\`\`${expression}\`\`\``, inline: false },
                    { name: 'Résultat', value: `\`\`\`${result}\`\`\``, inline: false }
                )
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Erreur dans l\'expression mathématique fournie. Veuillez vérifier la syntaxe.')
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [embed] });
        }
    }
};
