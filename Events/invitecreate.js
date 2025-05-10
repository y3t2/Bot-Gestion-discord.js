const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: Events.InviteCreate,
    async execute(invite) {
        try {
            // Vérifiez si invite.guild existe
            if (!invite.guild) {
                console.error('La guilde est indéfinie.');
                return;
            }

            // Assurez-vous que l'objet guild a la méthode fetchInvites
            if (typeof invite.guild.invites.fetch !== 'function') {
                console.error('La méthode fetchInvites est introuvable sur cet objet guild.');
                return;
            }

            // Récupérer les invitations actuelles de la guilde
            const invites = await invite.guild.invites.fetch();

            // Logique pour gérer les invitations
            console.log(`Une nouvelle invitation a été créée: ${invite.code}`);

            // Vous pouvez ici mettre à jour votre base de données ou toute autre logique
            await db.set(`invite_${invite.code}`, {
                uses: invite.uses,
                maxUses: invite.maxUses,
                temporary: invite.temporary,
                createdAt: invite.createdAt,
                inviter: invite.inviter.id
            });

            console.log(`Invitations mises à jour pour ${invite.guild.name}`);
        } catch (error) {
            console.error('Erreur lors de la gestion de l\'invitation créée:', error);
        }
    },
};
