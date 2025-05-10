const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../Client/config.js');
const LogsHandler = require('./logsHandler');

const db = new QuickDB();

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole) {
        try {
            // Vérifier si l'antiroleupdate est activé
            const antiroleupdateEnabled = await db.get(`antiroleupdate_${oldRole.guild.id}`);
            if (!antiroleupdateEnabled) return;

            // Envoyer le log
            await LogsHandler.logRoleUpdate(oldRole.guild, oldRole, newRole);

            // Restaurer les anciennes propriétés du rôle
            await newRole.edit({
                name: oldRole.name,
                color: oldRole.color,
                hoist: oldRole.hoist,
                position: oldRole.position,
                permissions: oldRole.permissions,
                mentionable: oldRole.mentionable,
                reason: 'Protection: Anti-role-update activé'
            });
        } catch (error) {
            console.error('Erreur dans la protection antiroleupdate:', error);
        }
    },
};
