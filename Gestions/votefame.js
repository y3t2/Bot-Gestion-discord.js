const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');
const ms = require('ms');

module.exports = {
    name: 'votefame',
    aliases: ['vtf'],
    description: 'Crée un vote de Fame',

    async execute(message, args) {
        const ownerIds = await db.get('owners') || [];
        
        // Vérifier si l'utilisateur est un owner ou un administrateur
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
                        .setTitle("**Vote de Fame**")
                        .setDescription('Utilisation correcte de la commande :\n**+votefame `<durée>` `<personne1>` `<personne2>`**\n\n**Exemples**:\n+votefame `10m` `@User1` `@User2` — Démarre un vote de Fame de 10 minutes entre deux utilisateurs.')
                        .setColor(config.color)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const durationInput = args[0];
        const person1 = message.mentions.users.first();
        const person2 = message.mentions.users.at(1);

        if (!durationInput || !person1 || !person2) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Veuillez spécifier une durée et mentionner deux personnes.")
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
                    .setTitle("🗳️ Vote de Fame lancé!")
                    .setDescription(`Votez pour votre Le Mec qui a le plus de Fame !\n🔹 **💜** pour ${person1}\n🔹 **🔮** pour ${person2}`)
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
            ]
        });

        const timestamp = Date.now() + durationMs;
        const emojis = ['💜', '🔮'];

        for (const emoji of emojis) {
            await msg.react(emoji);
        }

        const interval = setInterval(async () => {
            const remainingTime = calculateRemainingTime(timestamp);
            if (remainingTime <= 0) {
                clearInterval(interval);
                return concludeVote(msg, message, person1, person2);
            }

            const embed = new EmbedBuilder()
                .setTitle("**Vote en cours**")
                .setDescription(`Votez pour votre Le Mec qui a le plus de Fame ! ${formatDuration(remainingTime)}\n🔹 Réagissez avec 💜 pour ${person1}\n ou 🔮 pour ${person2}!`)
                .setColor(config.color)
                .setFooter({ text: config.footer });

            await msg.edit({ embeds: [embed] });
        }, 3000);
    }
};

async function concludeVote(msg, message, person1, person2) {
    const reactions1 = msg.reactions.cache.get('💜');
    const reactions2 = msg.reactions.cache.get('🔮');

    const fetchedUsers1 = await reactions1?.users.fetch();
    const fetchedUsers2 = await reactions2?.users.fetch();

    const participants1 = fetchedUsers1?.filter(user => !user.bot) || [];
    const participants2 = fetchedUsers2?.filter(user => !user.bot) || [];

    const winner = participants1.size > participants2.size ? person1 : person2;
    const embed = new EmbedBuilder()
        .setTitle("🏆 Résultat du vote de Fame")
        .setDescription(`Le gagnant est : ${winner}\n👤 Créé par: ${message.author}`)
        .setColor(config.color)
        .setFooter({ text: config.footer });

    await msg.edit({ embeds: [embed] });

    const congratulationEmbed = new EmbedBuilder()
        .setDescription(`Félicitations à ${winner} qui a remporté le vote de Fame ! L'autre c'est une salope force a toi bg !`)
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
