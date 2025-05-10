const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'antiraid',
    description: 'Active ou désactive les protections antiraid',
    async execute(message, args) {
        // Vérifier si l'utilisateur a les permissions nécessaires
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ Vous n\'avez pas la permission d\'utiliser cette commande.');
        }

        // Vérifier si un argument est fourni
        if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase())) {
            return message.reply('❌ Usage: `+antiraid on` ou `+antiraid off`');
        }

        const status = args[0].toLowerCase();
        const guildId = message.guild.id;

        try {
            // Mettre à jour le statut dans la base de données
            await db.set(`antiraid_${guildId}`, status === 'on');

            // Créer un embed pour la réponse
            const embed = {
                color: status === 'on' ? '#00ff00' : '#ff0000',
                title: '🛡️ Configuration Antiraid',
                description: `Les protections antiraid ont été ${status === 'on' ? 'activées' : 'désactivées'} avec succès.`,
                fields: [
                    {
                        name: 'Protections activées',
                        value: status === 'on' ? '✅' : '❌',
                        inline: true
                    },
                    {
                        name: 'Configuré par',
                        value: message.author.tag,
                        inline: true
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Système de protection'
                }
            };

            message.reply({ embeds: [embed] });

            // Log de l'action
            console.log(`[ANTIRAID] ${message.author.tag} a ${status === 'on' ? 'activé' : 'désactivé'} les protections antiraid dans ${message.guild.name}`);

        } catch (error) {
            console.error('Erreur lors de la configuration antiraid:', error);
            message.reply('❌ Une erreur est survenue lors de la configuration des protections antiraid.');
        }
    }
}; 