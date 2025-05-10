const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const targetRoleId = interaction.message.embeds[0].description.match(/<@&(\d+)>/)[1];
        const targetRole = interaction.guild.roles.cache.get(targetRoleId);

        if (!targetRole) return;

        const currentEmbed = interaction.message.embeds[0];
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Danger)
            );

        if (interaction.customId === 'yes') {
            await interaction.deferUpdate();

            let countdown = 10;

            const countdownEmbed = new EmbedBuilder(currentEmbed)
                .setDescription(`Le rôle ${targetRole} sera attribué à tous les membres dans ${countdown} secondes.\nTapez \`cancel\` pour annuler.`)
                .setFooter({ text: config.footer });

            await interaction.update({ embeds: [countdownEmbed], components: [actionRow] });

            const members = interaction.guild.members.cache;
            const roleAddedUsers = [];

            const interval = setInterval(async () => {
                countdown--;
                countdownEmbed.setDescription(`Le rôle ${targetRole} sera attribué à tous les membres dans ${countdown} secondes.\nTapez \`cancel\` pour annuler.`);
                await interaction.message.edit({ embeds: [countdownEmbed] });

                if (countdown <= 0) {
                    clearInterval(interval);
                    let successCount = 0;
                    let failureCount = 0;
                    let failedUsers = [];

                    for (const member of members.values()) {
                        try {
                            if (!member.roles.cache.has(targetRole.id)) {
                                await member.roles.add(targetRole);
                                successCount++;
                                roleAddedUsers.push(member.id);
                            }
                        } catch (error) {
                            failureCount++;
                            failedUsers.push(`${member.user.tag} (${member.id})`);
                        }
                    }

                    const finalEmbed = new EmbedBuilder(currentEmbed)
                        .setDescription(`Le rôle ${targetRole} a été attribué avec succès à ${successCount} membres.`)
                        .addFields([
                            { name: 'Échecs', value: `${failureCount} membres`, inline: true }
                        ]);

                    if (failedUsers.length > 0) {
                        finalEmbed.addFields({ name: 'Membres échoués', value: failedUsers.join('\n'), inline: false });
                    }

                    await interaction.message.edit({ embeds: [finalEmbed], components: [] });
                }
            }, 1000);

            const msgCollector = interaction.channel.createMessageCollector({ time: 10000 });
            msgCollector.on('collect', msg => {
                if (msg.content.toLowerCase() === 'cancel' && msg.author.id === interaction.user.id) {
                    clearInterval(interval);
                    countdownEmbed.setDescription('La commande a été annulée.');
                    msgCollector.stop();
                    return interaction.message.edit({ embeds: [countdownEmbed], components: [] });
                }
            });
        } else if (interaction.customId === 'no') {
            await interaction.deferUpdate();

            const cancelEmbed = new EmbedBuilder(currentEmbed)
                .setDescription('La commande a été annulée.');

            await interaction.message.edit({ embeds: [cancelEmbed], components: [] });
        }
    }
};
