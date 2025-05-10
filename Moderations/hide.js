const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'hide',
    description: 'Ajouter, afficher ou retirer des utilisateurs de la liste des Hides.',
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

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Utilisez \`+hide <action>\` pour gérer la liste des utilisateurs hides.\nActions disponibles : \`add\`, \`list\`, \`remove\`.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const action = args[0].toLowerCase();

        if (action === 'add') {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
            if (!user) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un utilisateur valide ou fournir un ID utilisateur.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            let hiddenList = await db.get('hiddenList') || [];

            if (hiddenList.includes(user.id)) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`L'utilisateur ${user.tag} est déjà dans la liste des Hides.`)
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            hiddenList.push(user.id);
            await db.set('hiddenList', hiddenList);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur ${user.tag} a été ajouté à la liste des Hides.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (action === 'list') {
            const hiddenList = await db.get('hiddenList') || [];

            if (hiddenList.length === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Aucun utilisateur n\'est actuellement dans la liste des Hides.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            const hiddenUsers = hiddenList.map(id => `<@${id}>`).join('\n');
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle('Liste des Hides')
                    .setDescription(hiddenUsers)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (action === 'remove') {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
            if (!user) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un utilisateur valide ou fournir un ID utilisateur.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            let hiddenList = await db.get('hiddenList') || [];

            if (!hiddenList.includes(user.id)) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`L'utilisateur ${user.tag} n'est pas dans la liste des Hides.`)
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            hiddenList = hiddenList.filter(id => id !== user.id);
            await db.set('hiddenList', hiddenList);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur ${user.tag} a été retiré de la liste des Hides.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Action invalide. Utilisez \`add\`, \`list\`, ou \`remove\` comme argument.`)
                .setFooter({ text: config.footer })
            ]
        });
    },
};
