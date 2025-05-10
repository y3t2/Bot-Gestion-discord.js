const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const ms = require('ms');
const db = new QuickDB();
const config = require('../Client/config');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const owners = await db.get('owners') || [];
        if (owners.includes(message.author.id)) return;

        const isEnabled = await db.get(`badwords_enabled_${message.guild.id}`);
        if (!isEnabled) return;

        const badwords = await db.get(`badwords_${message.guild.id}`) || [];
        const foundBadword = badwords.some(badword => message.content.toLowerCase().includes(badword.toLowerCase()));

        if (foundBadword) {
            await message.delete();

            let infractions = await db.get(`infractions_${message.author.id}_${message.guild.id}`) || 0;
            infractions++;
            await db.set(`infractions_${message.author.id}_${message.guild.id}`, infractions);

            const logChannelId = await db.get(`log_channel_badwords_${message.guild.id}`);
            const logChannel = logChannelId ? await message.guild.channels.fetch(logChannelId) : null;

            if (infractions >= 3) {
                const botMember = message.guild.members.me;
                if (!botMember.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                    return message.channel.send({
                        embeds: [new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription('Le bot n\'a pas la permission de mute les membres.')
                            .setFooter({ text: config.footer })
                        ]
                    });
                }

                const member = message.guild.members.cache.get(message.author.id);
                if (member) {
                    await member.timeout(ms('1m'), 'Badwords.');
                    await db.set(`infractions_${message.author.id}_${message.guild.id}`, 0);

                    const sanctions = await db.get(`sanctions_${message.author.id}`) || [];
                    sanctions.push({
                        type: 'Mute temporaire',
                        moderator: message.client.user.id,
                        reason: 'Utilisation de mots interdits à 3 reprises.',
                        date: Date.now()
                    });
                    await db.set(`sanctions_${message.author.id}`, sanctions);

                    const sanctionMessage = `<@${message.author.id}> a été mute pendant 1 minute pour avoir utilisé des mots interdits à 3 reprises.`;

                    message.channel.send({
                        embeds: [new EmbedBuilder()
                            .setColor(config.color)
                            .setDescription(sanctionMessage)
                            .setFooter({ text: config.footer })
                        ]
                    });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Sanction - Mute pour mots interdits')
                            .setDescription(sanctionMessage)
                            .setColor(config.color)
                            .setFooter({ text: config.footer });

                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } else {
                message.channel.send({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, votre message a été supprimé car il contenait un mot interdit. Attention, après 3 infractions, vous serez mute.`)
                        .setFooter({ text: config.footer })
                    ]
                }).then(msg => setTimeout(() => msg.delete(), 5000));

                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Message supprimé - Mot interdit')
                        .setDescription(`<@${message.author.id}> a envoyé un message contenant un mot interdit.\nMessage supprimé : ${message.content}`)
                        .setColor(config.color)
                        .setFooter({ text: config.footer });

                    await logChannel.send({ embeds: [logEmbed] });
                }
            }
        }
    },
};
