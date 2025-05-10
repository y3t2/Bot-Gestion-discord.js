const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');

module.exports = {
    name: 'reerol',
    description: 'Réélu les gagnants d\'un giveaway.',
    async execute(message, args) {
        const ownerIds = await db.get('owners') || []; 

        if (!ownerIds.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const giveawayMessageId = args[0]; 
        const winnersCount = parseInt(args[1], 10) || 1;

        if (!giveawayMessageId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Veuillez spécifier l'ID du message du giveaway.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId).catch(() => null);
        if (!giveawayMessage) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Message de giveaway introuvable.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const reaction = await giveawayMessage.reactions.cache.first();
        if (!reaction) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Aucune réaction trouvée sur ce message.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const fetchedUsers = await reaction.users.fetch();
        const participants = fetchedUsers.filter(user => !user.bot);

        if (participants.size === 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Aucun participant valide trouvé.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        let winners = [];
        for (let i = 0; i < winnersCount && participants.size > 0; i++) {
            const winner = participants.random();
            winners.push(winner);
            participants.delete(winner.id);
        }

        const embed = new EmbedBuilder()
            .setTitle(" Réélection de(s) gagnant(s")
            .setDescription(`🏆 Nouveaux gagnant(s): ${winners.join(', ')}\n👤 Crée par: ${message.author}`)
            .setColor(config.color)
            .setFooter({ text: config.footer });

        await message.channel.send({ embeds: [embed] });
    }
};
