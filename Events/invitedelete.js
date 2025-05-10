const { Events } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: Events.InviteDelete,
    async execute(invite) {
        try {
            // Assurez-vous que invite.guild est défini
            const guild = invite.guild;

            if (!guild) {
                console.error('Guild is undefined');
                return;
            }

            // Récupérer les invitations actuelles du serveur
            const invites = await guild.invites.fetch();
            
            // Logique pour gérer les invitations
            // Par exemple, vous pouvez enregistrer des informations dans votre base de données
            for (const invite of invites.values()) {
                // Traitez l'invitation
                console.log(`Invitation supprimée : ${invite.code}`);
                
                // Vous pouvez mettre à jour votre base de données ici
                await db.delete(`invite_${invite.code}`);
            }

            console.log(`Invitations mises à jour pour ${guild.name}`);
        } catch (error) {
            console.error('Erreur lors de la gestion de l\'invitation supprimée:', error);
        }
    },
};
