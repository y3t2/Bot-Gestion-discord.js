const { Events } = require('discord.js');
const config = require('../Client/config.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const mentionedStaff = message.mentions.members.filter(member => config.staff.includes(member.id));
        const whitelist = await db.get('whitelist') || [];
        const whitelistRoleId = await db.get('whitelistRole');


        const userId = message.author.id;

        if (whitelist.includes(userId)) {
            const member = message.guild.members.cache.get(userId);
            if (member && whitelistRoleId) {
                const role = message.guild.roles.cache.get(whitelistRoleId);
                if (role && !member.roles.cache.has(role.id)) {
                    await member.roles.add(role);
                }
            }
        }
    }
};
