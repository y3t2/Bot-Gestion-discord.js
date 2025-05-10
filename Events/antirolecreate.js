const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'roleCreate',
    async execute(role) {
        try {
            // Vérifier si l'antirolecreate est activé
            const antirolecreateEnabled = await db.get(`antirolecreate_${role.guild.id}`);
            if (!antirolecreateEnabled) return;

            // Envoyer le log
            await LogsHandler.logRoleCreate(role.guild, role);

            // Supprimer le rôle
            await role.delete('Protection: Anti-role-create activé');
        } catch (error) {
            console.error('Erreur dans la protection antirolecreate:', error);
        }
    }
};
