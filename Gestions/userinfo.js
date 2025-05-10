const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');
const moment = require('moment');

const db = new QuickDB();

module.exports = {
  name: 'userinfo',
  aliases: ['whois', 'user'],
  usage: 'userinfo <MENTION>',
  description: 'Obtenez des informations avancées sur un utilisateur',
  async execute(message, args) {
    const ownerIds = await db.get('owners') || [];
    const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
    const isOwner = ownerIds.includes(message.author.id);

    if (!isAdmin && !isOwner) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
            .setColor(config.color)
            .setFooter({ text: config.footer })
        ]
      });
    }

    let user;

    if (!args[0]) {
      user = message.member;
    } else {
      user = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(err => {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("Impossible de trouver cette personne")
              .setColor(config.color)
              .setFooter({ text: config.footer })
          ]
        });
      });
    }

    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("Impossible de trouver cette personne !")
            .setColor(config.color)
            .setFooter({ text: config.footer })
        ]
      });
    }

    let stat = {
      online: "https://emoji.gg/assets/emoji/9166_online.png",
      idle: "https://emoji.gg/assets/emoji/3929_idle.png",
      dnd: "https://emoji.gg/assets/emoji/2531_dnd.png",
      offline: "https://emoji.gg/assets/emoji/7445_status_offline.png"
    };
    let badges = await user.user.flags;
    badges = await badges ? badges.toArray() : ["Aucun"];

    let newbadges = badges.map(m => m.replace("_", " "));

    let embed = new EmbedBuilder()
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setColor(config.color)
      .setAuthor({ name: user.user.tag, iconURL: user.user.displayAvatarURL({ dynamic: true }) });

    let array = [];
    const activities = user.user.presence?.activities || [];
    if (activities.length) {
      activities.forEach(activity => {
        let name = activity.name || "Aucune";
        let details = activity.details || "Aucun";
        let state = activity.state || "Aucun";
        let type = activity.type;

        array.push(`**${type}** : \`${name} : ${details} : ${state}\``);

        if (activity.name === "Spotify") {
          embed.setThumbnail(`https://i.scdn.co/image/${activity.assets.largeImage.replace("spotify:", "")}`);
        }
      });
      embed.setDescription(array.join("\n"));
    }

    if (user.nickname !== null) embed.addFields({ name: "Surnom", value: user.nickname });
    embed.addFields(
      { name: "Rejoint le", value: moment(user.joinedAt).format("LLLL") },
      { name: "Compte créé le", value: moment(user.user.createdAt).format("LLLL") },
      { name: "Informations communes", value: `ID: \`${user.user.id}\`\nDiscriminator: ${user.user.discriminator}\nBot: ${user.user.bot}\nUtilisateur supprimé: ${user.deleted}` },
      { name: "Badges", value: newbadges.join(", ").toLowerCase() || "Aucun" }
    ).setFooter({ text: config.footer, iconURL: stat[user.user.presence?.status] || stat.offline });

    return message.channel.send({ embeds: [embed] }).catch(err => {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription("Erreur : " + err)
            .setColor(config.color)
            .setFooter({ text: config.footer })
        ]
      });
    });
  }
};
