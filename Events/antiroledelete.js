const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'roleDelete',
    async execute(role) {
        try {
            // Vérifier si l'antiroledelete est activé
            const antiroledeleteEnabled = await db.get(`antiroledelete_${role.guild.id}`);
            if (!antiroledeleteEnabled) return;

            // Envoyer le log
            await LogsHandler.logRoleDelete(role.guild, role);

            // Recréer le rôle avec les mêmes propriétés
            const newRole = await role.guild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                position: role.position,
                permissions: role.permissions,
                mentionable: role.mentionable,
                reason: 'Protection: Anti-role-delete activé'
            });

            // Restaurer les permissions du rôle
            await newRole.setPermissions(role.permissions);
        } catch (error) {
            console.error('Erreur dans la protection antiroledelete:', error);
        }
    },
};
