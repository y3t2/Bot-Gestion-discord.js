const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');
const ms = require('ms');

module.exports = {
    name: 'giveaway',
    description: 'Démarre un giveaway',
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

        if (args.length < 3) { 
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("**Giveaway**")
                        .setDescription('Utilisation correcte de la commande :\n**&giveaway `<durée>` `<nombre de gagnants>` `<prix>`**')
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const durationInput = args[0];
        const winnersCount = parseInt(args[1], 10);
        const prize = args.slice(2).join(' ') || 'Un prix incroyable !';

        if (!durationInput) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Veuillez spécifier une durée pour le giveaway.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        if (isNaN(winnersCount) || winnersCount <= 0) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Veuillez spécifier un nombre valide de gagnants.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const durationMs = ms(durationInput);
        if (!durationMs) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Durée invalide. Utilisez des formats comme 1m, 1h, 1d.")
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription("🔄 Démarrage du giveaway...")
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
            ]
        });

        const timestamp = Date.now() + durationMs;
        const defaultReaction = await db.get(`reactgv${message.guild.id}`) || '🎉';

        await msg.react(defaultReaction);

        const interval = setInterval(async () => {
            const remainingTime = calculateRemainingTime(timestamp);
            if (remainingTime <= 0) {
                clearInterval(interval);
                return concludeGiveaway(msg, message, defaultReaction, prize, winnersCount);
            }

            const embed = new EmbedBuilder()
                .setTitle(prize)
                .setDescription(`Réagissez avec ${defaultReaction} pour participer!\n*Nombre de gagnants : ${winnersCount}*\n**Hosted by:** ${message.author}`)
                .addFields({ name: `Temps restant`, value: formatDuration(remainingTime) })
                .setColor(config.color)
                .setFooter({ text: config.footer });

            await msg.edit({ embeds: [embed] });
        }, 3000);
    }
};

async function concludeGiveaway(msg, message, winnerReaction, prize, winnersCount) {
    const reaction = msg.reactions.cache.get(winnerReaction);
    
    const fetchedUsers = await reaction.users.fetch();
    const participants = fetchedUsers.filter(user => !user.bot);

    if (participants.size === 0) {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Aucun participant valide.")
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
        .setTitle(prize)
        .setDescription(`🏆 Gagnants: ${winners.join(', ')}\n**Hosted by:** ${message.author}`)
        .setColor(config.color)
        .setFooter({ text: config.footer });

    await msg.edit({ embeds: [embed] });

    const congratulationEmbed = new EmbedBuilder()
        .setDescription(`🎉 Félicitations à ${winners.join(', ')} qui gagnent **${prize}**!`)
        .setColor(config.color)
        .setFooter({ text: config.footer });

    await message.channel.send({ embeds: [congratulationEmbed] });
}

function calculateRemainingTime(endTime) {
    return endTime - Date.now();
}

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
}
