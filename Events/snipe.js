const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.partial) return;

        const channelId = message.channel.id;
        const deletedMessageData = {
            content: message.content,
            authorId: message.author.id,
        };

        await db.set(`deletedMessage_${channelId}`, deletedMessageData);
    },
};
