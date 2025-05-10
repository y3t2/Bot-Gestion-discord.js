const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Récupérer les invitations de la guilde
            const invites = await member.guild.invites.fetch();
            const previousInvites = await db.get(`invites_${member.guild.id}`) || {};

            let usedInvite;
            invites.forEach(invite => {
                // Vérifie si l'invitation a été utilisée
                if (previousInvites[invite.code] && previousInvites[invite.code].uses < invite.uses) {
                    usedInvite = invite;
                }
            });

            if (usedInvite) {
                // Mettre à jour la base de données pour cet utilisateur
                await db.add(`invites_${member.guild.id}_${usedInvite.inviter.id}`, 1); // Ajoute 1 invite pour l'inviteur
                await db.add(`leaves_${member.guild.id}_${usedInvite.inviter.id}`, 0); // Réinitialise les leaves
                console.log(`Membre ${member.user.tag} a rejoint avec l'invitation de ${usedInvite.inviter.tag}`);
            }

            // Mettez à jour les invitations dans la base de données
            await db.set(`invites_${member.guild.id}`, invites);
        } catch (error) {
            console.error('Erreur lors de la gestion de l\'ajout d\'un membre :', error);
        }
    },
};
