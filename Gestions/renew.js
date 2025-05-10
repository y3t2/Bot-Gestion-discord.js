const { PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const config = require('../../Client/config'); 

module.exports = {
    name: 'renew',
    async execute(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const oldChannel = message.channel;

        try {
            const channelName = oldChannel.name;
            const channelType = oldChannel.type;
            const channelParent = oldChannel.parentId; 
            const channelPosition = oldChannel.position; 
            const channelPermissions = oldChannel.permissionOverwrites.cache.map(overwrite => ({
                id: overwrite.id,
                allow: overwrite.allow.toArray(),
                deny: overwrite.deny.toArray()
            }));

            await oldChannel.delete();

            const newChannel = await oldChannel.guild.channels.create({
                name: channelName,
                type: channelType,
                parent: channelParent || null,
                permissionOverwrites: channelPermissions.map(permission => ({
                    id: permission.id,
                    allow: permission.allow,
                    deny: permission.deny
                })),
                reason: 'Recréation du salon pour renouvellement'
            });

            await newChannel.setPosition(channelPosition);
            await newChannel.send(`<@${message.author.id}> a renouvelé le salon avec succès.`);
        } catch (error) {
            console.error(error);
            try {
                await message.channel.send('Il y a eu une erreur en essayant de recréer le salon.');
            } catch (sendError) {
                console.error('Erreur lors de l\'envoi du message d\'erreur :', sendError);
            }
        }
    }
};
