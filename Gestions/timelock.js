const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms'); 
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: "timelock",
    usage: "timelock <time>",
    description: "Commence un verrouillage temporaire dans un salon.",
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const isOwner = owners.includes(message.author.id);
        const hasManageChannelsPermission = message.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!hasManageChannelsPermission && !isOwner) {
            const embed = new EmbedBuilder()
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'executer cette commande.`)
                .setColor(config.color)
                .setFooter({ text: config.footer });
            return message.channel.send({ embeds: [embed] });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setDescription("Je n'ai pas la permission nécessaire pour verrouiller ce salon.")
                .setColor(config.color)
                .setFooter({ text: config.footer });
            return message.channel.send({ embeds: [embed] });
        }

        const time = args.join(" ");
        if (!time) {
            const embed = new EmbedBuilder()
                .setDescription("Veuillez entrer une durée valide en `Secondes`, `Minutes` ou `Heures`.")
                .setColor(config.color)
                .setFooter({ text: config.footer });
            return message.channel.send({ embeds: [embed] });
        }

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SendMessages: false,
        });

        const embed = new EmbedBuilder()
            .setTitle("Mise à jour du salon")
            .setDescription(`${message.channel} a été placé sous verrouillage pendant \`${time}\``)
            .setColor(config.color)
            .setFooter({ text: config.footer });
        await message.channel.send({ embeds: [embed] });

        setTimeout(async () => {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true,
            });

            const embed2 = new EmbedBuilder()
                .setTitle("Mise à jour du salon")
                .setDescription(`Le verrouillage a été levé dans ${message.channel}`)
                .setColor(config.color)
                .setFooter({ text: config.footer });
            await message.channel.send({ embeds: [embed2] });
        }, ms(time));

        message.delete();
    }
};
