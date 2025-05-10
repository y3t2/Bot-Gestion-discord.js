const { PermissionsBitField, AuditLogEvent, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        try {
            // Vérifier si l'antichanneldelete est activé
            const antichanneldeleteEnabled = await db.get(`antichanneldelete_${channel.guild.id}`);
            if (!antichanneldeleteEnabled) return;

            // Envoyer le log
            await LogsHandler.logChannelDelete(channel.guild, channel);

            // Recréer le channel
            const newChannel = await channel.guild.channels.create({
                name: channel.name,
                type: channel.type,
                parent: channel.parent,
                position: channel.position,
                topic: channel.topic,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                rateLimitPerUser: channel.rateLimitPerUser,
                permissions: channel.permissionOverwrites.cache
            });

            // Restaurer les permissions
            for (const [id, overwrite] of channel.permissionOverwrites.cache) {
                await newChannel.permissionOverwrites.create(id, overwrite.allow, overwrite.deny);
            }
        } catch (error) {
            console.error('Erreur dans la protection antichanneldelete:', error);
        }
    },
};
