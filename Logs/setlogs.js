const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'setlogs',
    description: 'Configure les salons de logs',
    async execute(message, args) {
        // Vérifier les permissions
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        try {
            // Créer la catégorie "LOGS"
            const category = await message.guild.channels.create({
                name: 'LOGS',
                type: 4, // GUILD_CATEGORY
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: message.guild.members.me.id,
                        allow: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles']
                    }
                ]
            });

            // Liste des salons à créer avec leurs types de logs
            const channels = [
                { name: '📝mod-logs', type: 'moderation' },
                { name: '🛡️protect-logs', type: 'protection' },
                { name: '🤖bot-logs', type: 'bot' },
                { name: '👥member-logs', type: 'members' },
                { name: '🔨server-logs', type: 'server' },
                { name: '💬message-logs', type: 'messages' },
                { name: '🎵voice-logs', type: 'voice' },
                // Nouveaux salons de logs
                { name: '🤖antibot-logs', type: 'antibot' },
                { name: '📁channel-create-logs', type: 'channelcreate' },
                { name: '🗑️channel-delete-logs', type: 'channeldelete' },
                { name: '⏰account-age-logs', type: 'accountage' },
                { name: '📢everyone-logs', type: 'everyone' },
                { name: '📢here-logs', type: 'here' },
                { name: '🔗link-logs', type: 'link' },
                { name: '👑role-create-logs', type: 'rolecreate' },
                { name: '🗑️role-delete-logs', type: 'roledelete' },
                { name: '📝role-update-logs', type: 'roleupdate' },
                { name: '🚫badwords-logs', type: 'badwords' }
            ];

            // Créer les salons
            const createdChannels = {};
            for (const channel of channels) {
                const newChannel = await message.guild.channels.create({
                    name: channel.name,
                    type: 0, // GUILD_TEXT
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['ViewChannel']
                        },
                        {
                            id: message.guild.members.me.id,
                            allow: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles']
                        }
                    ]
                });
                createdChannels[channel.type] = newChannel.id;
            }

            // Sauvegarder les IDs des salons dans la base de données
            await db.set(`logs_${message.guild.id}`, createdChannels);

            // Créer l'embed de confirmation
            const embed = {
                color: '#00ff00',
                title: '✅ Configuration des Logs',
                description: 'Les salons de logs ont été configurés avec succès !',
                fields: [
                    {
                        name: '📝 Modération',
                        value: `<#${createdChannels.moderation}>`,
                        inline: true
                    },
                    {
                        name: '🛡️ Protection',
                        value: `<#${createdChannels.protection}>`,
                        inline: true
                    },
                    {
                        name: '🤖 Bot',
                        value: `<#${createdChannels.bot}>`,
                        inline: true
                    },
                    {
                        name: '👥 Membres',
                        value: `<#${createdChannels.members}>`,
                        inline: true
                    },
                    {
                        name: '🔨 Serveur',
                        value: `<#${createdChannels.server}>`,
                        inline: true
                    },
                    {
                        name: '💬 Messages',
                        value: `<#${createdChannels.messages}>`,
                        inline: true
                    },
                    {
                        name: '🎵 Voice',
                        value: `<#${createdChannels.voice}>`,
                        inline: true
                    },
                    {
                        name: '🤖 Anti-Bot',
                        value: `<#${createdChannels.antibot}>`,
                        inline: true
                    },
                    {
                        name: '📁 Création Channels',
                        value: `<#${createdChannels.channelcreate}>`,
                        inline: true
                    },
                    {
                        name: '🗑️ Suppression Channels',
                        value: `<#${createdChannels.channeldelete}>`,
                        inline: true
                    },
                    {
                        name: '⏰ Âge des Comptes',
                        value: `<#${createdChannels.accountage}>`,
                        inline: true
                    },
                    {
                        name: '📢 Mentions Everyone',
                        value: `<#${createdChannels.everyone}>`,
                        inline: true
                    },
                    {
                        name: '📢 Mentions Here',
                        value: `<#${createdChannels.here}>`,
                        inline: true
                    },
                    {
                        name: '🔗 Liens',
                        value: `<#${createdChannels.link}>`,
                        inline: true
                    },
                    {
                        name: '👑 Création Rôles',
                        value: `<#${createdChannels.rolecreate}>`,
                        inline: true
                    },
                    {
                        name: '🗑️ Suppression Rôles',
                        value: `<#${createdChannels.roledelete}>`,
                        inline: true
                    },
                    {
                        name: '📝 Mise à jour Rôles',
                        value: `<#${createdChannels.roleupdate}>`,
                        inline: true
                    },
                    {
                        name: '🚫 Badwords',
                        value: `<#${createdChannels.badwords}>`,
                        inline: true
                    }
                ],
                footer: {
                    text: 'Les salons sont privés et visibles uniquement par les administrateurs'
                }
            };

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la configuration des logs:', error);
            message.reply('❌ Une erreur est survenue lors de la configuration des salons de logs.');
        }
    }
}; 