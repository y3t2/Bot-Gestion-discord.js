const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'voicemoove',
    aliases: ["vmoove"],
    description: 'Déplace un utilisateur mentionné vers un canal vocal spécifique.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id) && 
            !message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        const member = message.mentions.members.first();
        if (!member) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("Veuillez mentionner l'utilisateur que vous souhaitez déplacer.")
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        const channelId = args[1];
        if (!channelId) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("Veuillez fournir l'ID du canal vocal où vous souhaitez déplacer l'utilisateur.")
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        const channel = message.guild.channels.cache.get(channelId);
        if (!channel || channel.type !== 2) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("L'ID de canal vocal fourni n'est pas valide ou n'est pas un canal vocal.")
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        if (!member.voice.channelId) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("L'utilisateur mentionné n'est pas dans un canal vocal.")
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        try {
            await member.voice.setChannel(channel);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`${member.user.tag} a été déplacé vers le canal vocal **${channel.name}**.`)
                .setFooter({ text: config.footer });
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("Une erreur s'est produite lors du déplacement de l'utilisateur.")
                .setFooter({ text: config.footer });
            message.reply({ embeds: [embed] });
        }
    },
};
