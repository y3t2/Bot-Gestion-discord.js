const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} est prêt pour gérer les bannissements temporaires.`);

        setInterval(async () => {
            const allTempBans = await db.all();
            const currentTime = Date.now();

            for (const record of allTempBans) {
                if (record.id.startsWith('tempban_')) {
                    const { guildId, endTime, reason } = record.value;

                    if (currentTime >= endTime) {
                        try {
                            const guild = client.guilds.cache.get(guildId);
                            if (guild) {
                                const userId = record.id.replace('tempban_', '');

                                await guild.bans.remove(userId, 'Bannissement temporaire terminé.');

                                const user = await client.users.fetch(userId).catch(() => null);
                                if (user) {
                                    await user.send({
                                        content: `Votre bannissement du serveur **${guild.name}** est terminé. Vous pouvez maintenant rejoindre à nouveau le serveur.`
                                    }).catch(err => console.log(`Impossible d'envoyer un message à l'utilisateur : ${err}`));
                                }

                                await db.delete(record.id);
                                console.log(`Utilisateur ${userId} débanni du serveur ${guild.name} et informé.`);
                            }
                        } catch (error) {
                            console.error(`Erreur lors du débanissement ou de l'envoi du message privé: ${error}`);
                        }
                    }
                }
            }
        }, 60000);
    }
};
