const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config'); 

module.exports = {
    name: 'lc',
    description: 'Calcule le pourcentage d\'amour entre deux utilisateurs',
    async execute(message, args) {
        let user1, user2;

        if (message.mentions.users.size === 2) {
            const mentions = message.mentions.users.map(user => user);
            user1 = mentions[0];
            user2 = mentions[1];
        }
        else if (message.mentions.users.size === 1) {
            user1 = message.author;
            user2 = message.mentions.users.first();
        }
        else if (args.length === 0) {
            user1 = message.author;
            await message.guild.members.fetch();

            const members = message.guild.members.cache.filter(member => !member.user.bot && member.id !== message.author.id);
            user2 = members.random(); 

            if (!user2) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color) 
                        .setDescription('Je n\'ai pas pu trouver un utilisateur aléatoire.')
                        .setFooter({ text: config.footer }) 
                    ]
                });
            }
            user2 = user2.user;
        }
        else if (args.length === 2) {
            try {
                user1 = await message.guild.members.fetch(args[0]);
                user2 = await message.guild.members.fetch(args[1]);
            } catch {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Un ou plusieurs IDs sont invalides.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }
        }
        else if (args.length === 1) {
            try {
                user1 = message.author;
                user2 = await message.guild.members.fetch(args[0]);
            } catch {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('L\'ID mentionné est invalide.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez mentionner un ou deux utilisateurs ou fournir un ou deux IDs valides.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const lovePercentage = Math.floor(Math.random() * 101);

        const loveEmbed = new EmbedBuilder()
            .setTitle('💖 Calculateur d\'amour 💖')
            .setDescription(`Le pourcentage d'amour entre **${user1}** et **${user2}** est de **${lovePercentage}%** !`)
            .setColor(config.color)
            .setFooter({ text: config.footer });

        message.channel.send({ content: `${user1} 💘 ${user2}`, embeds: [loveEmbed] });
    },
};
