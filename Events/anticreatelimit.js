const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Vérifier si l'anticreatelimit est activé
            const anticreatelimitEnabled = await db.get(`anticreatelimit_${member.guild.id}`);
            if (!anticreatelimitEnabled) return;

            // Vérifier l'âge du compte
            const accountAge = Date.now() - member.user.createdTimestamp;
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            if (accountAge < sevenDays) {
                // Envoyer le log
                await LogsHandler.logAccountAge(member.guild, member);

                // Expulser le membre
                await member.kick('Protection: Compte trop récent');
            }
        } catch (error) {
            console.error('Erreur dans la protection anticreatelimit:', error);
        }
    }
};
