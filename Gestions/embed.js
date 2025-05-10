const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, InteractionType } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'embed',
    description: 'Envoie un message dans le salon spécifié avec un embed personnalisé.',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                content: '${message.author}, vous n\'avez pas la permission d\'executer cette commande.',
                embeds: [new EmbedBuilder().setColor(config.color).setDescription('${message.author}, vous n\'avez pas la permission d\'executer cette commande.')]
            });
        }

       
        const channelSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('channelSelect')
            .setPlaceholder('🔽 Sélectionnez un salon ou entrez l\'ID du salon manuellement')
            .addOptions([
                {
                    label: 'Entrer l\'ID du salon manuellement',
                    value: 'manualEntry',
                }
            ]);

        const rowChannel = new ActionRowBuilder().addComponents(channelSelectMenu);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('📩 Sélection du Salon')
            .setFooter({text: config.footer})
            

        const sentMessage = await message.channel.send({
            embeds: [embed],
            components: [rowChannel]
        });

        const collector = sentMessage.createMessageComponentCollector({ time: 6000000 });

        let selectedChannel;

        collector.on('collect', async interaction => {
            if (interaction.isStringSelectMenu() && interaction.customId === 'channelSelect' && interaction.user.id === message.author.id) {
                if (interaction.values[0] === 'manualEntry') {
                    const modal = new ModalBuilder()
                        .setCustomId('manualChannelIdModal')
                        .setTitle('🔢 Entrer l\'ID du Salon');

                    const input = new TextInputBuilder()
                        .setCustomId('channelIdInput')
                        .setLabel('ID du salon')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Entrez l\'ID du salon ici');

                    const modalRow = new ActionRowBuilder().addComponents(input);
                    modal.addComponents(modalRow);

                    await interaction.showModal(modal);

                    interaction.client.once('interactionCreate', async modalInteraction => {
                        if (modalInteraction.isModalSubmit() && modalInteraction.customId === 'manualChannelIdModal') {
                            const channelId = modalInteraction.fields.getTextInputValue('channelIdInput');
                            selectedChannel = message.guild.channels.cache.get(channelId);

                            if (selectedChannel && selectedChannel.isTextBased()) {
                                await modalInteraction.reply({ 
                                    content: ` Salon sélectionné : <#${selectedChannel.id}>. Personnalisez maintenant votre embed.`,
                                    embeds: [new EmbedBuilder()
                                        .setColor(config.color)
                                        .setDescription(`Le salon <#${selectedChannel.id}> a été sélectionné. Vous pouvez maintenant personnaliser votre embed.`)
                                        .setFooter({text: config.footer})
                                        
                                    ]
                                });
                                await showEmbedCustomizationMenu(modalInteraction, embed, selectedChannel);
                            } else {
                                await modalInteraction.reply({ 
                                    content: ' ID de salon invalide. Assurez-vous que l\'ID correspond à un salon textuel valide.',
                                    ephemeral: true,
                                    embeds: [new EmbedBuilder()
                                        .setColor(config.color)
                                        .setDescription('L\'ID du salon que vous avez entré est invalide ou n\'est pas un salon textuel. Veuillez réessayer avec un ID valide.')
                                        .setFooter({text: config.footer})
                                        
                                    ]
                                });
                            }
                        }
                    });
                } else {
                    selectedChannel = message.guild.channels.cache.get(interaction.values[0]);

                    if (selectedChannel && selectedChannel.isTextBased()) {
                        await interaction.reply({ 
                            content: ` Salon sélectionné : <#${selectedChannel.id}>. Personnalisez maintenant votre embed.`,
                            embeds: [new EmbedBuilder()
                                .setColor(config.color)
                                .setDescription(`Le salon <#${selectedChannel.id}> a été sélectionné. Vous pouvez maintenant personnaliser votre embed.`)
                                .setFooter({text: config.footer})
                                
                            ]
                        });
                        await showEmbedCustomizationMenu(interaction, embed, selectedChannel);
                    } else {
                        await interaction.reply({ 
                            content: ' Le salon sélectionné est invalide ou n\'est pas un salon textuel.',
                            ephemeral: true,
                            embeds: [new EmbedBuilder()
                                .setColor(config.color)
                                .setDescription('Le salon sélectionné est invalide ou n\'est pas un salon textuel. Veuillez réessayer.')
                                .setFooter({text: config.footer})
                                
                            ]
                        });
                    }
                }
            }
        });

        async function showEmbedCustomizationMenu(interaction, embed, selectedChannel) {
            const embedOptionsMenu = new StringSelectMenuBuilder()
                .setCustomId('embedOptions')
                .setPlaceholder('🎨 Personnalisez votre embed')
                .addOptions([
                    { label: 'Titre', value: 'title' },
                    { label: 'Description', value: 'description' },
                    { label: 'Couleur (Code hexadécimal)', value: 'color' },
                    { label: 'Image (URL)', value: 'image' },
                    { label: 'Footer', value: 'footer' }
                ]);

            const rowOptions = new ActionRowBuilder().addComponents(embedOptionsMenu);
            const sendButton = new ButtonBuilder()
                .setCustomId('sendEmbed')
                .setLabel('Envoyer l\'embed')
                .setStyle(ButtonStyle.Success);

            const rowButton = new ActionRowBuilder().addComponents(sendButton);

            const previewEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('👀 Prévisualisation de l\'Embed')
                .setDescription('Personnalisez les différentes parties de l\'embed pour voir un aperçu en temps réel.');

            await interaction.followUp({
                embeds: [previewEmbed],
                components: [rowOptions, rowButton]
            });

            const optionsCollector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            optionsCollector.on('collect', async optionInteraction => {
                if (optionInteraction.isStringSelectMenu() && optionInteraction.customId === 'embedOptions' && optionInteraction.user.id === message.author.id) {
                    const modal = new ModalBuilder()
                        .setCustomId('embedModal')
                        .setTitle('🛠️ Personnaliser l\'embed');

                    const input = new TextInputBuilder()
                        .setCustomId('input')
                        .setLabel(`Entrez le texte pour ${optionInteraction.values[0]}`)
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder(`Entrez ici le texte pour ${optionInteraction.values[0]}`);

                    const modalRow = new ActionRowBuilder().addComponents(input);
                    modal.addComponents(modalRow);

                    await optionInteraction.showModal(modal);

                    optionInteraction.client.once('interactionCreate', async modalInteraction => {
                        if (modalInteraction.isModalSubmit() && modalInteraction.customId === 'embedModal') {
                            const userInput = modalInteraction.fields.getTextInputValue('input');

                            switch (optionInteraction.values[0]) {
                                case 'title':
                                    embed.setTitle(userInput);
                                    break;
                                case 'description':
                                    embed.setDescription(userInput);
                                    break;
                                case 'color':
                                    const hexColor = /^#[0-9A-F]{6}$/i.test(userInput);
                                    if (hexColor) {
                                        embed.setColor(userInput);
                                    } else {
                                        await modalInteraction.reply({ 
                                            content: '❌ Veuillez entrer une couleur valide au format hexadécimal (ex: #FF5733).', 
                                            ephemeral: true,
                                            embeds: [new EmbedBuilder()
                                                .setColor(config.color)
                                                .setDescription('La couleur que vous avez entrée n\'est pas valide. Assurez-vous que le code hexadécimal est au format #RRGGBB.')
                                                .setFooter({text: config.footer})
                                            ]
                                        });
                                        return;
                                    }
                                    break;
                                case 'image':
                                    const imageUrl = userInput.startsWith('http') ? userInput : '';
                                    if (imageUrl) {
                                        embed.setImage(imageUrl);
                                    } else {
                                        await modalInteraction.reply({ 
                                            content: '❌ Veuillez entrer une URL valide pour l\'image.',
                                            ephemeral: true,
                                            embeds: [new EmbedBuilder()
                                                .setColor(config.footer)
                                                .setDescription('L\'URL de l\'image que vous avez entrée n\'est pas valide. Assurez-vous que l\'URL est correcte et accessible.')
                                                .setFooter({text: config.footer})
                                            ]
                                        });
                                        return;
                                    }
                                    break;
                                case 'footer':
                                    embed.setFooter({ text: userInput });
                                    break;
                            }

                            await modalInteraction.update({ 
                                embeds: [embed], 
                                content: '🔄 L\'embed a été mis à jour. Vous pouvez continuer à personnaliser ou envoyer l\'embed.', 
                                components: [rowOptions, rowButton] 
                            });
                        }
                    });
                }

                if (optionInteraction.isButton() && optionInteraction.customId === 'sendEmbed' && optionInteraction.user.id === message.author.id) {
                    if (selectedChannel && selectedChannel.isTextBased()) {
                        await selectedChannel.send({ embeds: [embed] });
                        await optionInteraction.update({ 
                            content: ` Le message a été envoyé dans le salon <#${selectedChannel.id}>.`, 
                            components: [] 
                        });
                    } else {
                        await optionInteraction.reply({ 
                            content: ' Salon non valide. Veuillez réessayer.',
                            ephemeral: true,
                            embeds: [new EmbedBuilder()
                                .setColor(config.color)
                                .setDescription('Le salon dans lequel vous essayez d\'envoyer le message est invalide. Veuillez vérifier le salon sélectionné.')
                                .setFooter({text: config.footer})
                            ]
                        });
                    }
                }
            });
        }
    },
};
