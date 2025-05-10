const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config.js'); 

module.exports = {
    name: 'antibadwords',
    description: 'Gérer les mots interdits et activer/désactiver le filtre.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners) || !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const prefix = config.prefix;

        if (args.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle('Commande : antibadwords')
                    .setDescription('Vous devez spécifier une action à effectuer.')
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antibadwords on\` pour activer le filtre des Badwords.\nUtilisez \`${prefix}antibadwords off\` pour désactiver le filtre des Badwords.\nUtilisez \`${prefix}antibadwords add <word>\` pour ajouter un mot à la liste des Badwords.\nUtilisez \`${prefix}antibadwords del <word>\` pour supprimer un mot de la liste des Badwords.\nUtilisez \`${prefix}antibadwords list\` pour voir la liste des Badwords.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const option = args[0].toLowerCase();

        if (option === 'on' || option === 'off') {
            const isEnabled = option === 'on';
            await db.set(`badwords_enabled_${message.guild.id}`, isEnabled);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le filtre des Badwords est désormais ${isEnabled ? 'activé' : 'désactivé'}.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (option === 'add') {
            const word = args[1];
            if (!word) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez spécifier un mot à ajouter à la liste des Badwords.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            const badwords = await db.get(`badwords_${message.guild.id}`) || [];
            if (badwords.includes(word)) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Ce mot est déjà dans la liste Badwords.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            badwords.push(word);
            await db.set(`badwords_${message.guild.id}`, badwords);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le mot "${word}" a été ajouté à la liste des Badwords.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (option === 'del') {
            const word = args[1];
            if (!word) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez spécifier un mot à supprimer de la liste des Badwords.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            let badwords = await db.get(`badwords_${message.guild.id}`) || [];
            if (!badwords.includes(word)) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Ce mot n\'est pas dans la liste des Badwords.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            badwords = badwords.filter(bw => bw !== word);
            await db.set(`badwords_${message.guild.id}`, badwords);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le mot "${word}" a été supprimé de la liste des Badwords.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (option === 'list') {
            const badwords = await db.get(`badwords_${message.guild.id}`) || [];
            const badwordsList = badwords.length > 0 ? badwords.join(', ') : 'Aucun Badwords.';

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle('**Badwords**')
                    .setDescription(badwordsList)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Commande invalide. Utilisez \`${prefix}antibadwords on/off\`, \`${prefix}antibadwords add <word>\`, \`${prefix}antibadwords del <word>\`, ou \`${prefix}antibadwords list\`.`)
                .setFooter({ text: config.footer })
                .addFields({
                    name: 'Comment utiliser cette commande',
                    value: `Utilisez \`${prefix}antibadwords on\` pour activer le filtre des Badwords.\nUtilisez \`${prefix}antibadwords off\` pour désactiver le filtre des Badwords.\nUtilisez \`${prefix}antibadwords add <word>\` pour ajouter un mot à la liste des Badwords.\nUtilisez \`${prefix}antibadwords del <word>\` pour supprimer un mot de la liste des Badwords.\nUtilisez \`${prefix}antibadwords list\` pour voir la liste des Badwords.`
                })
            ]
        });
    },
};
