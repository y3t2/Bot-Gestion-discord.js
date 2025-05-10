const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'setuprolewl',
    description: 'Ajouter, supprimer ou lister les rôles whitelist.',
    async execute(message, args) {
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

        const action = args[0];

        if (!action || !['add', 'del', 'list'].includes(action)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier une action : `add`, `del` ou `list`.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (action === 'add') {
            const roleMention = message.mentions.roles.first();
            const roleId = args[1]?.replace(/[<>@!]/g, '');
            const roleToAdd = roleMention || (roleId ? message.guild.roles.cache.get(roleId) : null);

            if (!roleToAdd) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un rôle valide ou fournir un ID de rôle à ajouter.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await db.set('whitelistRole', roleToAdd.id);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le rôle ${roleToAdd.name} a été ajouté pour les utilisateurs whitelistés.`)
                    .setFooter({ text: config.footer })
                ]
            });

        } else if (action === 'del') {
            await db.delete('whitelistRole');
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le rôle whitelist a été supprimé de la base de données.')
                    .setFooter({ text: config.footer })
                ]
            });

        } else if (action === 'list') {
            const whitelistRole = await db.get('whitelistRole');
            if (!whitelistRole) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Aucun rôle whitelist n\'a été défini.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            const roles = [whitelistRole];
            const chunkSize = 10;
            const chunks = [];
            for (let i = 0; i < roles.length; i += chunkSize) {
                chunks.push(roles.slice(i, i + chunkSize));
            }

            let page = 0;

            const sendPage = () => {
                const roleList = chunks[page].map((roleId, index) => {
                    const role = message.guild.roles.cache.get(roleId);
                    return `${index + 1 + page * chunkSize}) ${role ? `<@&${roleId}>` : roleId} (${roleId})`;
                }).join('\n');

                return new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`**Rôles Whitelist**\n${roleList}`)
                    .setFooter({ text: config.footer });
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === chunks.length - 1)
                );

            const msg = await message.reply({ embeds: [sendPage()], components: [row] });

            const filter = i => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'next' && page < chunks.length - 1) {
                    page++;
                } else if (interaction.customId === 'prev' && page > 0) {
                    page--;
                }

                await interaction.update({ embeds: [sendPage()], components: [row] });

                row.components[0].setDisabled(page === 0);
                row.components[1].setDisabled(page === chunks.length - 1);
            });

            collector.on('end', () => {
                row.components.forEach(button => button.setDisabled(true));
                msg.edit({ components: [row] });
            });
        }
    }
};
