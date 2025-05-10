const { PermissionsBitField, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const backup = require('discord-backup');
const config = require('../../Client/config.js');

const db = new QuickDB();
backup.setStorageFolder(__dirname + "/backups/");

module.exports = {
    name: 'backup',
    aliases: ['bkp'],
    description: 'Gérez les sauvegardes du serveur, et permet de les charger dans un autre serveur.',
    async execute(message) {
        if (!message) return console.error("Le message n'est pas défini.");

        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners) || !owners.includes(message.author.id)) {
            return sendResponse(message, "Vous n'avez pas la permission d'utiliser cette commande.");
        }

        const actionMenu = new StringSelectMenuBuilder()
            .setCustomId('backup_action')
            .setPlaceholder('Choisissez une action')
            .addOptions([
                { label: 'Créer une sauvegarde', value: 'create' },
                { label: 'Charger une sauvegarde', value: 'load' },
                { label: 'Supprimer une sauvegarde', value: 'delete' },
                { label: 'Lister les sauvegardes', value: 'list' },
                { label: 'Effacer toutes les sauvegardes', value: 'clear' },
            ]);

        const embed = new EmbedBuilder()
            .setTitle("**Backup**")
            .setDescription("Sélectionnez une action de sauvegarde:")
            .setColor(config.color)
            .setFooter({ text: config.footer });

        const row = new ActionRowBuilder().addComponents(actionMenu);
        await sendResponse(message, { embeds: [embed], components: [row] });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId !== 'backup_action') return;

            await interaction.deferUpdate(); // Toujours confirmer l'interaction

            const selectedAction = interaction.values[0];
            try {
                switch (selectedAction) {
                    case 'create':
                        await createBackup(message);
                        break;
                    case 'load':
                        await loadBackup(message, interaction);
                        break;
                    case 'delete':
                        await deleteBackup(message);
                        break;
                    case 'list':
                        await listBackups(message);
                        break;
                    case 'clear':
                        await clearBackups(message);
                        break;
                }
            } catch (error) {
                console.error(`Erreur lors de l'action '${selectedAction}':`, error);
                message.channel.send("Une erreur s'est produite lors de l'exécution de cette action.");
            }
        });

        collector.on('end', () => {});
    },
};

async function sendResponse(message, content) {
    try {
        await message.reply(content);
    } catch (error) {
        console.error("Erreur lors de l'envoi de la réponse:", error);
        try {
            await message.channel.send(content);
        } catch (sendError) {
            console.error("Impossible d'envoyer le message de secours:", sendError);
        }
    }
}

async function createBackup(message) {
    const codePrompt = await message.channel.send("Merci d'entrer un nom de sauvegarde:");
    const collectorCode = message.channel.createMessageCollector({
        filter: m => m.author.id === message.author.id,
        time: 30000
    });

    collectorCode.on('collect', async (m) => {
        const code = m.content.trim();
        if (!code) return message.reply("Merci d'entrer un nom de sauvegarde valide.");

        try {
            const backupData = await backup.create(message.guild, {
                maxMessagesPerChannel: 0,
                jsonBeautify: true,
                doNotBackup: ["emojis"]
            });

            // Collecte des données des salons
            const channelsPermissions = message.guild.channels.cache.map(channel => ({
                id: channel.id,
                permissions: channel.permissionOverwrites.cache.map(perm => ({
                    id: perm.id,
                    allow: perm.allow.toArray(),
                    deny: perm.deny.toArray()
                }))
            }));

            // Collecte des données des rôles
            const rolesData = message.guild.roles.cache.filter(role => role.name !== '@everyone').map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                permissions: role.permissions.toArray()
            }));

            // Collecte des données des membres
            const membersData = await Promise.all(message.guild.members.cache.map(async (member) => ({
                id: member.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                roles: member.roles.cache.map(role => role.id),
                joinedAt: member.joinedAt
            })));

            // Collecte des données des bans
            const bans = await message.guild.bans.fetch();
            const bansData = bans.map(ban => ban.user.id);

            // Collecte des données des emojis
            const emojisData = message.guild.emojis.cache.map(emoji => ({
                id: emoji.id,
                name: emoji.name,
                animated: emoji.animated,
                url: emoji.url,
            }));

            // Données du serveur
            const serverData = {
                iconURL: message.guild.iconURL(),
                bannerURL: message.guild.bannerURL(),
                name: message.guild.name,
                description: message.guild.description,
            };

            await db.push(`backupserv_${message.guild.id}`, {
                code,
                dcode: backupData.id,
                channelsPermissions,
                rolesData,
                membersData,
                bansData,
                emojisData,
                serverData
            });

            message.channel.send(`Le serveur a bien été copié sous le nom: \`${code}\``);
        } catch (error) {
            console.error("Erreur lors de la création de la sauvegarde:", error);
            message.channel.send("Une erreur s'est produite lors de la création de la sauvegarde.");
        } finally {
            cleanUpPrompt(codePrompt);
            collectorCode.stop();
        }
    });

    collectorCode.on('end', collected => {
        cleanUpPrompt(codePrompt);
        if (collected.size === 0) {
            message.channel.send("Temps écoulé, sauvegarde annulée.");
        }
    });
}

async function loadBackup(message, interaction) {
    const codePrompt = await message.channel.send("Merci d'entrer le nom de la sauvegarde à charger:");
    const collectorCode = message.channel.createMessageCollector({
        filter: m => m.author.id === message.author.id,
        time: 30000
    });

    collectorCode.on('collect', async (m) => {
        const code = m.content.trim();
        const backups = await db.get(`backupserv_${message.guild.id}`) || [];
        const data = backups.find(x => x.code === code);

        if (!data) {
            return message.reply("Aucune sauvegarde trouvée avec ce nom.");
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply("Vous n'avez pas les permissions administratives pour charger cette sauvegarde.");
        }

        try {
            // Suppression des rôles existants, en ignorant le rôle @everyone
            const roles = message.guild.roles.cache.filter(role => role.name !== '@everyone');
            for (const role of roles.values()) {
                if (role.editable && !role.managed) {
                    try {
                        await role.delete();
                    } catch (error) {
                        console.error(`Erreur lors de la suppression du rôle ${role.name}: ${error.message}`);
                    }
                }
            }

            // Création des nouveaux rôles
            for (const roleData of data.rolesData) {
                await message.guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    permissions: roleData.permissions
                });
            }

            // Création des nouveaux emojis
            for (const emojiData of data.emojisData) {
                await message.guild.emojis.create(emojiData.url, emojiData.name, { animated: emojiData.animated });
            }

            // Restauration des bans
            for (const userId of data.bansData) {
                await message.guild.bans.create(userId).catch(error => {
                    console.error(`Erreur lors du reban de l'utilisateur ${userId}: ${error.message}`);
                });
            }

            // Chargement de la sauvegarde
            await backup.load(data.dcode, message.guild);

            // Restauration des permissions des salons
            const channelsPermissions = data.channelsPermissions;
            for (const channelData of channelsPermissions) {
                const channel = message.guild.channels.cache.get(channelData.id);
                if (channel) {
                    for (const perm of channelData.permissions) {
                        try {
                            await channel.permissionOverwrites.edit(perm.id, {
                                allow: perm.allow,
                                deny: perm.deny,
                            });
                        } catch (error) {
                            console.error(`Erreur lors de la restauration des permissions pour le salon ${channel.name}: ${error.message}`);
                        }
                    }
                }
            }

            // Restauration des rôles des membres
            for (const memberData of data.membersData) {
                const member = await message.guild.members.fetch(memberData.id).catch(() => null);
                if (member) {
                    await member.roles.add(memberData.roles);
                }
            }

            // Mise à jour des informations du serveur
            const { iconURL, bannerURL, name, description } = data.serverData;

            // Mettre à jour le nom et la description
            await message.guild.setName(name);
            await message.guild.setDescription(description);

            // Mettre à jour l'icône du serveur
            if (iconURL) {
                try {
                    await message.guild.setIcon(iconURL);
                } catch (error) {
                    console.error(`Erreur lors de la mise à jour de l'icône: ${error.message}`);
                }
            }

            // Mettre à jour la bannière du serveur
            if (bannerURL) {
                try {
                    await message.guild.setBanner(bannerURL);
                } catch (error) {
                    console.error(`Erreur lors de la mise à jour de la bannière: ${error.message}`);
                }
            }

            message.channel.send(`La sauvegarde \`${code}\` a été chargée avec succès.`);
        } catch (error) {
            console.error("Erreur lors du chargement de la sauvegarde:", error);
            message.channel.send("Une erreur s'est produite lors du chargement de la sauvegarde.");
        } finally {
            cleanUpPrompt(codePrompt);
            collectorCode.stop();
        }
    });

    collectorCode.on('end', collected => {
        cleanUpPrompt(codePrompt);
        if (collected.size === 0) {
            message.channel.send("Temps écoulé, chargement annulé.");
        }
    });
}

async function deleteBackup(message) {
    const codePrompt = await message.channel.send("Merci d'entrer le nom de la sauvegarde à supprimer:");
    const collectorCode = message.channel.createMessageCollector({
        filter: m => m.author.id === message.author.id,
        time: 30000
    });

    collectorCode.on('collect', async (m) => {
        const code = m.content.trim();
        const backups = await db.get(`backupserv_${message.guild.id}`) || [];
        const index = backups.findIndex(x => x.code === code);

        if (index === -1) {
            return message.reply("Aucune sauvegarde trouvée avec ce nom.");
        }

        backups.splice(index, 1);
        await db.set(`backupserv_${message.guild.id}`, backups);
        message.channel.send(`La sauvegarde \`${code}\` a été supprimée avec succès.`);
        
        cleanUpPrompt(codePrompt);
        collectorCode.stop();
    });

    collectorCode.on('end', collected => {
        cleanUpPrompt(codePrompt);
        if (collected.size === 0) {
            message.channel.send("Temps écoulé, suppression annulée.");
        }
    });
}

async function listBackups(message) {
    const backups = await db.get(`backupserv_${message.guild.id}`) || [];
    if (backups.length === 0) {
        return message.reply("Aucune sauvegarde trouvée pour ce serveur.");
    }

    const backupList = backups.map(b => `- \`${b.code}\``).join("\n");
    message.channel.send(`Liste des sauvegardes:\n${backupList}`);
}

async function clearBackups(message) {
    await db.set(`backupserv_${message.guild.id}`, []);
    message.channel.send("Toutes les sauvegardes ont été supprimées.");
}

function cleanUpPrompt(prompt) {
    prompt.delete().catch(err => console.error("Erreur lors de la suppression du prompt:", err));
}
