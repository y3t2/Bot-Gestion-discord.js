const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        const oldRoles = oldMember.roles.cache.map(role => role.id);
        const newRoles = newMember.roles.cache.map(role => role.id);
        const addedRoles = newRoles.filter(role => !oldRoles.includes(role));

        if (addedRoles.length === 0) return;

        const blacklistedUsers = await db.get(`blacklisted_users_${oldMember.guild.id}`) || [];

        if (blacklistedUsers.includes(oldMember.id)) {
            try {
                await oldMember.roles.set([]);
            } catch (error) {
                console.error('Erreur lors du dépouillement des rôles :', error);
            }
        }
    },
};
