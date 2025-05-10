const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'voicekick',
    aliases: ["vkick"],
    description: 'Expulse un membre d\'un salon vocal en utilisant une mention ou un ID.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        
        if (!owners.includes(message.author.id) && !message.member.permissions.has('DisconnectMembers')) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const memberId = args[0]?.replace(/[<@!>]/g, '');
        if (!memberId) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(memberId).catch(() => null);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas présent sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!member.voice.channel) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('L\'utilisateur n\'est pas connecté à un salon vocal.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            await member.voice.disconnect();

            let sanctions = await db.get(`sanctions_${memberId}`) || [];
            sanctions.push({
                type: 'Kick',
                reason: 'Expulsé par un modérateur',
                date: new Date().toISOString(),
                moderator: message.author.id
            });
            await db.set(`sanctions_${memberId}`, sanctions);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur <@${member.user.id}> a été expulsé du salon vocal.`)
                    .addFields(
                        { name: 'Pseudo:', value: `${member.user.tag}` },
                        { name: 'ID:', value: `${member.user.id}` },
                        { name: 'Date:', value: `${new Date().toLocaleString()}` }
                    )
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de l\'expulsion de l\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
