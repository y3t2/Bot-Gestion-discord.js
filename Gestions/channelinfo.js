const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'channelinfo',
    aliases: ['ci'],
    description: 'Affiche les informations d\'un salon spécifique.',
    usage: '+ci #channel',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners)) {
            console.error('Les owners ne sont pas un tableau, réinitialisez votre base de données.');
            return message.reply('Une erreur est survenue, contactez un administrateur.');
        }

        if (!owners.includes(message.author.id) && 
            !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer })
            ]});
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez mentionner un salon valide. Exemple: +ci #channel')
                .setFooter({ text: config.footer })
            ]});
        }

        const name = channel.name;
        const description = channel.topic || 'Aucune description';
        const id = channel.id;
        const nsfw = channel.nsfw ? 'Oui' : 'Non';
        const category = channel.parent ? `${channel.parent.name} (${channel.parentId})` : 'Aucune catégorie';
        const position = channel.position + 1;     
        const creationDate = `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`;  

        const embed = new EmbedBuilder()
            .setTitle(`Informations sur le salon : ${name}`)
            .addFields(
                { name: 'Nom', value: name, inline: true },
                { name: 'Description', value: description, inline: true },
                { name: 'ID', value: id, inline: true },
                { name: 'NSFW', value: nsfw, inline: true },
                { name: 'Catégorie', value: category, inline: true },
                { name: 'Position dans la catégorie', value: `${position}`, inline: true },
                { name: 'Date de création', value: creationDate, inline: false }
            )
            .setColor(config.color)
            .setFooter({ text: config.footer });

        return message.reply({ embeds: [embed] });
    }
};
