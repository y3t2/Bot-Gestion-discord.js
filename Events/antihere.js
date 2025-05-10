const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignorer les messages des bots
            if (message.author.bot) return;

            // Vérifier si l'antihere est activé
            const antihereEnabled = await db.get(`antihere_${message.guild.id}`);
            if (!antihereEnabled) return;

            // Vérifier si le message contient @here
            if (message.mentions.here) {
                // Envoyer le log
                await LogsHandler.logHere(message.guild, message);

                // Supprimer le message
                await message.delete();

                // Avertir l'utilisateur
                const warning = await message.channel.send(`${message.author}, les mentions @here ne sont pas autorisées.`);
                setTimeout(() => warning.delete().catch(() => {}), 5000);
            }
        } catch (error) {
            console.error('Erreur dans la protection antihere:', error);
        }
    }
};
