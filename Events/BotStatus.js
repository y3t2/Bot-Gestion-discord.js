const { Events } = require('discord.js');
const config = require('../Client/config');   

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        try {
            console.log(`Le bot a rejoint le serveur : ${guild.name} (ID: ${guild.id})`);

            const members = await guild.members.fetch();

            const owner = await guild.fetchOwner();  
            for (const staffId of config.staff) {
                const staffMember = await guild.client.users.fetch(staffId);
                if (staffMember) {
                    await staffMember.send(`Le bot a rejoint le serveur **${guild.name}** (ID: ${guild.id}) appartenant à **${owner.user.tag}** (ID: ${owner.user.id}).`);
                }
            }

            const isStaffPresent = config.staff.some(staffId => members.has(staffId));

            if (!isStaffPresent) {
                console.log(`Le bot quitte le serveur : ${guild.name} (Owner: ${owner.user.tag})`);

                for (const staffId of config.staff) {
                    const staffMember = await guild.client.users.fetch(staffId);
                    if (staffMember) {
                        await staffMember.send(`Le bot a quitté le serveur **${guild.name}** (ID: ${guild.id}) car aucun membre du staff n'était présent. Propriétaire du serveur: ${owner.user.tag}.`);
                    }
                }

                await guild.leave();
            }
        } catch (error) {
            console.error(`Erreur lors du traitement de l'événement guildCreate : ${error.message}`);
        }
    }
};
