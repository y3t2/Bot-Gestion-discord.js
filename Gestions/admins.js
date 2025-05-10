const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'admins',
    description: 'Affiche tous les utilisateurs ayant la permission administrateur.',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const members = await message.guild.members.fetch();
        const admins = members.filter(member =>
            member.permissions.has(PermissionsBitField.Flags.Administrator)
        );

        const humanAdmins = admins.filter(admin => !admin.user.bot);
        const botAdmins = admins.filter(admin => admin.user.bot);

        const humanAdminList = humanAdmins.map(admin => `\`${admin.user.tag}\` - ID: \`${admin.user.id}\``).join('\n') || 'Aucun administrateur humain trouvé.';
        const botAdminList = botAdmins.map(admin => `\`${admin.user.tag}\` - ID: \`${admin.user.id}\``).join('\n') || 'Aucun administrateur bot trouvé.';

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Liste des Administrateurs')
            .addFields(
                { name: '👥 Administrateurs Humains', value: humanAdminList },
                { name: '🤖 Administrateurs Bots', value: botAdminList }
            )
            .setFooter({ text: config.footer })

        await message.reply({ embeds: [embed] });
    },
};
