const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'verify_button') {
            const roleId = await db.get('verify_role');
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({ content: 'Le rôle de vérification est introuvable.', ephemeral: true });
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);
            await member.roles.add(role);

            await interaction.reply({ content: `Vous avez été vérifié, et le rôle <@&${roleId}> vous a été attribué !`, ephemeral: true });
        }
    }
};
