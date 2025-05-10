const { QuickDB } = require('quick.db');
const db = new QuickDB();

class LogsHandler {
    static async sendLog(guild, type, embed) {
        try {
            // Récupérer la configuration des logs
            const logsConfig = await db.get(`logs_${guild.id}`);
            if (!logsConfig) return;

            // Trouver le salon de logs correspondant
            const logChannel = guild.channels.cache.get(logsConfig[type]);
            if (!logChannel) return;

            // Envoyer le log
            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error(`Erreur lors de l'envoi du log (${type}):`, error);
        }
    }

    // Logs pour les bots
    static async logBotAdd(guild, member) {
        const embed = {
            color: '#ff0000',
            title: '🤖 Bot Ajouté',
            fields: [
                { name: 'Bot', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Ajouté par', value: `${member.user.tag}`, inline: true },
                { name: 'Date', value: new Date().toLocaleString(), inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'antibot', embed);
    }

    // Logs pour les channels
    static async logChannelCreate(guild, channel) {
        const embed = {
            color: '#00ff00',
            title: '📁 Channel Créé',
            fields: [
                { name: 'Nom', value: channel.name, inline: true },
                { name: 'Type', value: channel.type, inline: true },
                { name: 'ID', value: channel.id, inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'channelcreate', embed);
    }

    static async logChannelDelete(guild, channel) {
        const embed = {
            color: '#ff0000',
            title: '🗑️ Channel Supprimé',
            fields: [
                { name: 'Nom', value: channel.name, inline: true },
                { name: 'Type', value: channel.type, inline: true },
                { name: 'ID', value: channel.id, inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'channeldelete', embed);
    }

    // Logs pour les comptes récents
    static async logAccountAge(guild, member) {
        const accountAge = Date.now() - member.user.createdTimestamp;
        const days = Math.floor(accountAge / (1000 * 60 * 60 * 24));
        
        const embed = {
            color: '#ff9900',
            title: '⏰ Compte Récent Détecté',
            fields: [
                { name: 'Membre', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Âge du compte', value: `${days} jours`, inline: true },
                { name: 'Date de création', value: member.user.createdAt.toLocaleString(), inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'accountage', embed);
    }

    // Logs pour les mentions
    static async logEveryone(guild, message) {
        const embed = {
            color: '#ff0000',
            title: '📢 Mention @everyone',
            fields: [
                { name: 'Auteur', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Salon', value: `${message.channel.name}`, inline: true },
                { name: 'Message', value: message.content.substring(0, 1024), inline: false }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'everyone', embed);
    }

    static async logHere(guild, message) {
        const embed = {
            color: '#ff0000',
            title: '📢 Mention @here',
            fields: [
                { name: 'Auteur', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Salon', value: `${message.channel.name}`, inline: true },
                { name: 'Message', value: message.content.substring(0, 1024), inline: false }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'here', embed);
    }

    // Logs pour les liens
    static async logLink(guild, message) {
        const embed = {
            color: '#ff0000',
            title: '🔗 Lien Détecté',
            fields: [
                { name: 'Auteur', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Salon', value: `${message.channel.name}`, inline: true },
                { name: 'Message', value: message.content.substring(0, 1024), inline: false }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'link', embed);
    }

    // Logs pour les rôles
    static async logRoleCreate(guild, role) {
        const embed = {
            color: '#00ff00',
            title: '👑 Rôle Créé',
            fields: [
                { name: 'Nom', value: role.name, inline: true },
                { name: 'Couleur', value: role.hexColor, inline: true },
                { name: 'ID', value: role.id, inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'rolecreate', embed);
    }

    static async logRoleDelete(guild, role) {
        const embed = {
            color: '#ff0000',
            title: '🗑️ Rôle Supprimé',
            fields: [
                { name: 'Nom', value: role.name, inline: true },
                { name: 'Couleur', value: role.hexColor, inline: true },
                { name: 'ID', value: role.id, inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'roledelete', embed);
    }

    static async logRoleUpdate(guild, oldRole, newRole) {
        const embed = {
            color: '#ff9900',
            title: '📝 Rôle Modifié',
            fields: [
                { name: 'Nom', value: `${oldRole.name} → ${newRole.name}`, inline: true },
                { name: 'Couleur', value: `${oldRole.hexColor} → ${newRole.hexColor}`, inline: true },
                { name: 'ID', value: newRole.id, inline: true }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'roleupdate', embed);
    }

    // Logs pour les badwords
    static async logBadword(guild, message, badword) {
        const embed = {
            color: '#ff0000',
            title: '🚫 Badword Détecté',
            fields: [
                { name: 'Auteur', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Salon', value: `${message.channel.name}`, inline: true },
                { name: 'Badword', value: badword, inline: true },
                { name: 'Message', value: message.content.substring(0, 1024), inline: false }
            ],
            timestamp: new Date()
        };
        await this.sendLog(guild, 'badwords', embed);
    }
}

module.exports = LogsHandler; 