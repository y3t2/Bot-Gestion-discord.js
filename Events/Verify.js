const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'setup_verify') {
            const ownerIds = await db.get('owners') || [];
            if (!ownerIds.includes(interaction.user.id)) {
                return interaction.reply({
                    content: 'Vous n\'avez pas la permission d\'utiliser cette commande.',
                    ephemeral: true
                });
            }

            const selectedOption = interaction.values[0];
            switch (selectedOption) {
                case 'setup_channel':
                    await interaction.reply({
                        content: 'Veuillez donner l\'ID du salon ou mentionner le salon.',
                        ephemeral: true
                    });

                    const channelFilter = m => m.author.id === interaction.user.id;
                    const channelCollector = interaction.channel.createMessageCollector({ filter: channelFilter, time: 60000, max: 1 });

                    channelCollector.on('collect', async (msg) => {
                        const channel = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content);
                        if (channel) {
                            await db.set('verify_channel', channel.id);
                            await msg.delete(); 
                            await interaction.followUp({ content: `Salon configuré : <#${channel.id}>`, ephemeral: true });
                        } else {
                            await interaction.followUp({ content: 'Aucun salon valide mentionné ou ID invalide.', ephemeral: true });
                        }
                    });
                    break;

                case 'setup_role':
                    await interaction.reply({
                        content: 'Veuillez donner l\'ID du rôle ou mentionner le rôle.',
                        ephemeral: true
                    });

                    const roleFilter = m => m.author.id === interaction.user.id;
                    const roleCollector = interaction.channel.createMessageCollector({ filter: roleFilter, time: 60000, max: 1 });

                    roleCollector.on('collect', async (msg) => {
                        const role = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content);
                        if (role) {
                            await db.set('verify_role', role.id);
                            await msg.delete(); 
                            await interaction.followUp({ content: `Rôle configuré : <@&${role.id}>`, ephemeral: true });
                        } else {
                            await interaction.followUp({ content: 'Aucun rôle valide mentionné ou ID invalide.', ephemeral: true });
                        }
                    });
                    break;

                case 'toggle_system':
                    const isSystemActive = await db.get('verify_active') || false;
                    const newStatus = !isSystemActive;
                    await db.set('verify_active', newStatus);

                    if (newStatus) {
                        const verifyChannelId = await db.get('verify_channel');
                        const verifyRoleId = await db.get('verify_role');

                        if (!verifyChannelId || !verifyRoleId) {
                            return interaction.reply({
                                content: 'Veuillez d\'abord configurer le salon et le rôle avant d\'activer le système.',
                                ephemeral: true
                            });
                        }

                        const verifyChannel = interaction.guild.channels.cache.get(verifyChannelId);

                        const embed = new EmbedBuilder()
                            .setDescription('Cliquez sur le bouton ci-dessous pour vérifier votre compte et obtenir le rôle.')
                            .setColor(config.color)
                            .setFooter({text: config.footer});

                        const verifyButton = new ButtonBuilder()
                            .setCustomId('verify_button')
                            .setLabel('Vérifier')
                            .setStyle(ButtonStyle.Secondary)

                        const row = new ActionRowBuilder().addComponents(verifyButton);

                        await verifyChannel.send({ embeds: [embed], components: [row] });

                        await interaction.reply({
                            content: 'Système de vérification activé.',
                            ephemeral: true
                        });
                    } else {
                        const verifyChannelId = await db.get('verify_channel');
                        if (verifyChannelId) {
                            const verifyChannel = interaction.guild.channels.cache.get(verifyChannelId);
                            const lastMessage = (await verifyChannel.messages.fetch({ limit: 1 })).first();

                            if (lastMessage && lastMessage.author.bot) {
                                await lastMessage.delete();
                            }

                            await interaction.reply({
                                content: 'Système de vérification désactivé et message supprimé.',
                                ephemeral: true
                            });
                        }
                    }
                    break;

                default:
                    interaction.reply({ content: 'Option invalide.', ephemeral: true });
                    break;
            }
        }
    }
};
