const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            // Vérifier si l'antiraid est activé pour ce serveur
            const antiraidEnabled = await db.get(`antiraid_${member.guild.id}`);
            
            if (!antiraidEnabled) return; // Si l'antiraid est désactivé, on ne fait rien

            // Vérifier si le compte est récent (moins de 7 jours)
            const accountAge = Date.now() - member.user.createdTimestamp;
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            if (accountAge < sevenDays) {
                // Vérifier le nombre de membres récents
                const recentJoins = member.guild.members.cache.filter(m => 
                    Date.now() - m.joinedTimestamp < 60000 // Membres ayant rejoint dans la dernière minute
                ).size;

                if (recentJoins > 5) { // Si plus de 5 membres ont rejoint en 1 minute
                    // Expulser le membre
                    await member.kick('Protection antiraid: Trop de nouveaux membres en peu de temps');
                    
                    // Récupérer le salon de logs de protection
                    const logsConfig = await db.get(`logs_${member.guild.id}`);
                    const logChannel = logsConfig ? 
                        member.guild.channels.cache.get(logsConfig.protection) : 
                        member.guild.channels.cache.find(channel => 
                            channel.name === 'protect-logs' || channel.name === 'logs'
                        );

                    if (logChannel) {
                        const embed = {
                            color: '#ff0000',
                            title: '🛡️ Protection Antiraid',
                            description: `Un raid potentiel a été détecté et bloqué.`,
                            fields: [
                                {
                                    name: 'Membre expulsé',
                                    value: `${member.user.tag} (${member.id})`,
                                    inline: true
                                },
                                {
                                    name: 'Âge du compte',
                                    value: `${Math.floor(accountAge / (1000 * 60 * 60 * 24))} jours`,
                                    inline: true
                                },
                                {
                                    name: 'Nouveaux membres (1min)',
                                    value: `${recentJoins} membres`,
                                    inline: true
                                },
                                {
                                    name: 'Raison',
                                    value: 'Compte récent + trop de nouveaux membres en peu de temps',
                                    inline: true
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: 'Système de protection'
                            }
                        };

                        logChannel.send({ embeds: [embed] });
                    }
                }
            }
        } catch (error) {
            console.error('Erreur dans la protection antiraid:', error);
        }
    }
}; 