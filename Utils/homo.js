const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'homo',
    description: 'Calcule le pourcentage d\'homosexualité entre deux utilisateurs',
    async execute(message, args) {
        let user1, user2;

        if (message.mentions.users.size === 2) {
            const mentions = message.mentions.users.map(user => user);
            user1 = mentions[0];
            user2 = mentions[1];
        } else if (message.mentions.users.size === 1) {
            user1 = message.author;
            user2 = message.mentions.users.first();
        } else if (args.length === 0) {
            user1 = message.author;
            await message.guild.members.fetch();
            const members = message.guild.members.cache.filter(member => !member.user.bot && member.id !== message.author.id);
            user2 = members.random();
            if (!user2) {
                return message.reply('Je n\'ai pas pu trouver un utilisateur aléatoire.');
            }
            user2 = user2.user;
        } else if (args.length === 2) {
            try {
                user1 = await message.guild.members.fetch(args[0]);
                user2 = await message.guild.members.fetch(args[1]);
            } catch {
                return message.reply('Un ou plusieurs IDs sont invalides.');
            }
        } else if (args.length === 1) {
            try {
                user1 = message.author;
                user2 = await message.guild.members.fetch(args[0]);
            } catch {
                return message.reply('L\'ID mentionné est invalide.');
            }
        } else {
            return message.reply('Veuillez mentionner un ou deux utilisateurs ou fournir un ou deux IDs valides.');
        }

        const homoPercentage = Math.floor(Math.random() * 101);
        
        const homoEmbed = new EmbedBuilder()
            .setTitle('🏳️‍🌈 Homosexualité 🏳️‍🌈')
            .setDescription(`**${user1}** et **${user2}**, vous êtes Gay à **${homoPercentage}%** !`)
            .setColor(config.color)
            .setFooter({ text: config.footer });

        await message.channel.send({ embeds: [homoEmbed] });
    },
};
