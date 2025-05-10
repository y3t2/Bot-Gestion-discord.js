const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignorer les messages des bots
            if (message.author.bot) return;

            // Vérifier si l'antilink est activé
            const antilinkEnabled = await db.get(`antilink_${message.guild.id}`);
            if (!antilinkEnabled) return;

            // Vérifier si le message contient un lien
            const linkRegex = /(https?:\/\/[^\s]+)/g;
            if (linkRegex.test(message.content)) {
                // Envoyer le log
                await LogsHandler.logLink(message.guild, message);

                // Supprimer le message
                await message.delete();

                // Avertir l'utilisateur
                const warning = await message.channel.send(`${message.author}, les liens ne sont pas autorisés.`);
                setTimeout(() => warning.delete().catch(() => {}), 5000);
            }
        } catch (error) {
            console.error('Erreur dans la protection antilink:', error);
        }
    }
};
