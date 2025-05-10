const { QuickDB } = require('quick.db');
const db = new QuickDB();
const LogsHandler = require('./logsHandler');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignorer les messages des bots
            if (message.author.bot) return;

            // Vérifier si l'antibadword est activé
            const antibadwordEnabled = await db.get(`antibadword_${message.guild.id}`);
            if (!antibadwordEnabled) return;

            // Récupérer la liste des mots interdits
            const badWords = await db.get(`badwords_${message.guild.id}`) || [];
            if (badWords.length === 0) return;

            // Vérifier si le message contient un mot interdit
            const messageContent = message.content.toLowerCase();
            const foundBadWord = badWords.find(word => messageContent.includes(word.toLowerCase()));

            if (foundBadWord) {
                // Envoyer le log
                await LogsHandler.logBadword(message.guild, message, foundBadWord);

                // Supprimer le message
                await message.delete();

                // Avertir l'utilisateur
                const warning = await message.channel.send(`${message.author}, l'utilisation de mots interdits n'est pas autorisée.`);
                setTimeout(() => warning.delete().catch(() => {}), 5000);
            }
        } catch (error) {
            console.error('Erreur dans la protection antibadword:', error);
        }
    }
}; 