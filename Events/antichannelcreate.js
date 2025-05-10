const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        try {
            // Vérifier si l'antichannelcreate est activé
            const antichannelcreateEnabled = await db.get(`antichannelcreate_${channel.guild.id}`);
            if (!antichannelcreateEnabled) return;

            // Envoyer le log
            await LogsHandler.logChannelCreate(channel.guild, channel);

            // Supprimer le channel
            await channel.delete('Protection: Anti-channel-create activé');
        } catch (error) {
            console.error('Erreur dans la protection antichannelcreate:', error);
        }
    }
};
