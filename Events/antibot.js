const { EmbedBuilder, PermissionFlagsBits, AuditLogEvent } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../Client/config.js');
const LogsHandler = require('./logsHandler');

const db = new QuickDB();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            // Vérifier si l'antibot est activé
            const antibotEnabled = await db.get(`antibot_${member.guild.id}`);
            if (!antibotEnabled) return;

            // Vérifier si le membre est un bot
            if (member.user.bot) {
                // Envoyer le log
                await LogsHandler.logBotAdd(member.guild, member);

                // Expulser le bot
                await member.kick('Protection: Anti-bot activé');
            }
        } catch (error) {
            console.error('Erreur dans la protection antibot:', error);
        }
    },
};
