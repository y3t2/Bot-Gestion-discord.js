const { Events, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../Client/config');

const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const autokickList = await db.get('autokick') || [];
        const owners = await db.get('owners') || [];
        const whitelist = await db.get('whitelist') || [];

        if (autokickList.includes(member.id) && !owners.includes(member.id) && !whitelist.includes(member.id)) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription("Vous avez été ajouté à la liste des auto-kicks. Veuillez cesser de rejoindre ce serveur.")
                .setFooter({ text: config.footer });

            try {
                await member.send({ embeds: [embed] });
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message DM :', error);
            }

            try {
                await member.kick('Auto-kick: Membre sur la liste des auto-kicks.');
            } catch (error) {
                console.error('Erreur lors de l\'expulsion d\'un membre :', error);
            }
        }
    }
};
