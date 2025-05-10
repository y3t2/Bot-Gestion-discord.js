const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'voicekickall',
    aliases: ["vkickall"],
    description: 'Expulse tous les membres d\'un salon vocal avec confirmation.',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.DisconnectMembers) || 
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const confirmEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription('Êtes-vous sûr de vouloir expulser tous les membres de tous les salons vocaux ?')
            .setFooter({ text: config.footer });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('vkickall_confirm')
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('vkickall_cancel')
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Secondary)
            );

        const confirmationMessage = await message.reply({
            embeds: [confirmEmbed],
            components: [row]
        });

        const filter = interaction => ['vkickall_confirm', 'vkickall_cancel'].includes(interaction.customId) && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'vkickall_confirm') {
                const voiceChannels = message.guild.channels.cache.filter(channel => channel.isVoiceBased());

                for (const [channelId, voiceChannel] of voiceChannels) {
                    const membersInVoice = voiceChannel.members;
                    if (membersInVoice.size === 0) continue;

                    try {
                        for (const [memberId, member] of membersInVoice) {
                            await member.voice.disconnect();
                        }
                    } catch (error) {
                        console.error(error);
                        return interaction.reply({
                            embeds: [new EmbedBuilder()
                                .setColor(config.color)
                                .setDescription('Une erreur est survenue lors de l\'expulsion des membres.')
                                .setFooter({ text: config.footer })
                            ]
                        });
                    }
                }

                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Tous les membres ont été expulsés des salons vocaux.')
                        .setFooter({ text: config.footer })
                    ]
                });
            } else if (interaction.customId === 'vkickall_cancel') {
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('L\'action d\'expulsion a été annulée.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            confirmationMessage.delete();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Le temps pour confirmer l\'action a expiré.')
                        .setFooter({ text: config.footer })
                    ]
                });
                confirmationMessage.delete();
            }
        });
    }
};
