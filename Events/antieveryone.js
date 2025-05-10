const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../Client/config.js');
const LogsHandler = require('./logsHandler');

const db = new QuickDB();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Ignorer les messages des bots
            if (message.author.bot) return;

            // Vérifier si l'antieveryone est activé
            const antieveryoneEnabled = await db.get(`antieveryone_${message.guild.id}`);
            if (!antieveryoneEnabled) return;

            // Vérifier si le message contient @everyone
            if (message.mentions.everyone) {
                // Envoyer le log
                await LogsHandler.logEveryone(message.guild, message);

                // Supprimer le message
                await message.delete();

                // Avertir l'utilisateur
                const warning = await message.channel.send(`${message.author}, les mentions @everyone ne sont pas autorisées.`);
                setTimeout(() => warning.delete().catch(() => {}), 5000);
            }
        } catch (error) {
            console.error('Erreur dans la protection antieveryone:', error);
        }
    },
};
