const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'helpall',
    description: 'Affiche toutes les commandes disponibles sous forme de menu déroulant organisé.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor(config.color) 
            .setTitle('**Helpall**')
            .setDescription(`Affiche des informations détaillées sur les commandes`)
            .setFooter({ text: config.footer })

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('helpall_menu')
            .setPlaceholder('Sélectionnez une catégorie')
            .addOptions([
                {
                    label: 'Owners',
                    description: 'Afficher les commandes liées aux Owners',
                    value: 'owner_commands',
                    emoji: '👑',
                },
                {
                    label: 'Protect',  
                    description: 'Afficher les commandes de protection',
                    value: 'protect_commands',
                    emoji: '🛡️',
                },
                {
                    label: 'Logs Bot',  
                    description: 'Afficher les commandes de logs',
                    value: 'logs_commands',
                    emoji: '📜',
                },
                {
                    label: 'WhiteList & BlackList',
                    description: 'Afficher les commandes de blacklist et whitelist',
                    value: 'blacklist_whitelist_commands',
                    emoji: '🚫',
                },
                {
                    label: 'Moderations',
                    description: 'Afficher les commandes de Modération',
                    value: 'mode_commands',
                    emoji: '⚙️',
                },
                {
                    label: 'Utils',
                    description: 'Afficher les commandes Utilitaires',
                    value: 'utility_commands',
                    emoji: '🔧',
                },
                {
                    label: 'Gestions',
                    description: 'Afficher les commandes de gestion',
                    value: 'management_commands',
                    emoji: '📋',
                },
                {
                    label: 'Backup',
                    description: 'Afficher les commandes de sauvegarde',
                    value: 'backup_commands',
                    emoji: '💾',
                },
                {
                    label: 'Ticket',
                    description: 'Afficher les commandes de ticket',
                    value: 'ticket_commands',
                    emoji: '🎟️',
                },
                {
                    label: 'Giveaway',
                    description: 'Afficher les commandes de giveaway',
                    value: 'giveaway_commands',
                    emoji: '🎉',
                },
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        const filter = interaction => interaction.customId === 'helpall_menu' && interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async interaction => {
            if (!interaction.isStringSelectMenu()) return;

            let selectedCategory;
            switch (interaction.values[0]) {
                case 'owner_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Owners**')
                        .setDescription('Voici les commandes liées à l\'owner disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}owner`, value: '• Ajouter un Owner.' },
                            { name: `➤ ${config.prefix}owners`, value: '• Afficher la liste des Owners.' },
                            { name: `➤ ${config.prefix}unowner`, value: '• Retirer un Owner.' },
                            { name: `➤ ${config.prefix}ownerbot`, value: '• Affiche les infos sur le Staff-Bot.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'protect_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Protect**')
                        .setDescription('Voici les commandes de protection disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}verify`, value: '• Ouvre le menu pour mettre en place la vérification.' },
                            { name: `➤ ${config.prefix}badwords`, value: '• Gérer les badwords du serveur.' },
                            { name: `➤ ${config.prefix}antilink`, value: '• Gère l\'anti-link.' },
                            { name: `➤ ${config.prefix}antibot`, value: '• Gère l\'anti-bot.' },
                            { name: `➤ ${config.prefix}antichannelcreate`, value: '• Gère l\'anti-channel-create.' },
                            { name: `➤ ${config.prefix}antichanneldelete`, value: '• Gère l\'anti-channel-delete.' },
                            { name: `➤ ${config.prefix}anticreatelimit`, value: '• Gérer les kick des membres ayants un compte trop recent.' },
                            { name: `➤ ${config.prefix}antieveryone`, value: '• Gère l\'anti-everyone.' },
                            { name: `➤ ${config.prefix}antihere`, value: '• Gère l\'anti-here.' },
                            { name: `➤ ${config.prefix}antirolecreate`, value: '• Gère l\'anti-role-create.' },
                            { name: `➤ ${config.prefix}antiroledelete`, value: '• Gère l\'anti-role-delete.' },
                            { name: `➤ ${config.prefix}antiroleupdate`, value: '• Gère l\'anti-role-update.' },
                            { name: `➤ ${config.prefix}antiraid`, value: '• Active ou désactive les protections antiraid.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                    case 'logs_commands':  
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Logs Protect Bot**')
                        .setDescription('Voici les commandes de logs disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}setlogs`, value: '• Configure les salons de logs du serveur.' },
                            { name: `➤ ${config.prefix}logs-antibot`, value: '• Gérer les logs d\'ajout de Bots.' },
                            { name: `➤ ${config.prefix}logs-antichannelcreate`, value: '• Gérer les logs des creations de channels.' },
                            { name: `➤ ${config.prefix}logs-antichanneldelete`, value: '• Gérer les logs des supressions de channels.' },
                            { name: `➤ ${config.prefix}logs-anticreatelimit`, value: '• Gérer les logs des creations de compte recentes.' },
                            { name: `➤ ${config.prefix}logs-antieveryone`, value: '• Gérer les logs des mentions "everyone".' },
                            { name: `➤ ${config.prefix}logs-antihere`, value: '• Gérer les logs des mentions "here".' },
                            { name: `➤ ${config.prefix}logs-antilink`, value: '• Gérer les logs des liens.' },
                            { name: `➤ ${config.prefix}logs-antirolecreate`, value: '• Gérer les logs des creations de rôles.' },
                            { name: `➤ ${config.prefix}logs-antiroledelete`, value: '• Gérer les logs des supressions de rôles.' },
                            { name: `➤ ${config.prefix}logs-antiroleupdate`, value: '• Gérer les logs des updates de rôles.' },
                            { name: `➤ ${config.prefix}logs-badwords`, value: '• Gérer les logs des badwords.' },
                        )
                        .setFooter({ text: config.footer });
                        
                    break;
                case 'blacklist_whitelist_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**WhiteList & Blacklist**')
                        .setDescription('Voici les commandes de blacklist et whitelist disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}blacklist`, value: '• Ajoute un utilisateur à la BlackList.' },
                            { name: `➤ ${config.prefix}unblacklist`, value: '• Retire un utilisateur de la BlackList.' },
                            { name: `➤ ${config.prefix}blacklists`, value: '• Affiche tous les utilisateurs présents dans la BlackList.' },
                            { name: `➤ ${config.prefix}whitelist`, value: '• Ajoute un utilisateur à la WhiteList.' },
                            { name: `➤ ${config.prefix}unwhitelist`, value: '• Retire un utilisateur de la WhiteList.' },
                            { name: `➤ ${config.prefix}whitelists`, value: '• Affiche tous les utilisateurs présents dans la WhiteList.' },
                            { name: `➤ ${config.prefix}whitelistrole`, value: '• Ajoute un rôle à la WhiteListRoles.' },
                            { name: `➤ ${config.prefix}unwhitelistrole`, value: '• Retire un rôle de la WhiteListRoles.' },
                            { name: `➤ ${config.prefix}whitelistroles`, value: '• Affiche tous les rôles présents dans la WhiteList.' },
                            { name: `➤ ${config.prefix}setuprolewl`, value: '• Met en places le(s) rôles qui seront ajouté(s) quand un utilisateur serra ajouté a la WhiteList.' },
                            { name: `➤ ${config.prefix}blacklistrank`, value: '• Ajoute un membre à la BlackListRank.' },
                            { name: `➤ ${config.prefix}unblacklistrank`, value: '• Retire un utilisateur de la BlackListRank.' },
                            { name: `➤ ${config.prefix}blacklistranks`, value: '• Affiche les utilisateurs présents dans la BlackListRank.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'mode_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Modération**')
                        .setDescription('Voici les commandes de modération disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}autokick`, value: '• Active le kick automatique d\'un membre.' },
                            { name: `➤ ${config.prefix}hide`, value: '• Ajouter, afficher ou retirer des utilisateurs de la liste des Hides.' },
                            { name: `➤ ${config.prefix}chide`, value: '• Cache un salon aux yeux des membres.' },
                            { name: `➤ ${config.prefix}unchide`, value: '• Révèle un salon aux yeux des membres' },
                            { name: `➤ ${config.prefix}ban`, value: '• Ban un utilisateur du serveur.' },
                            { name: `➤ ${config.prefix}banip`, value: '• Ban un utilisateur par son IP.' },
                            { name: `➤ ${config.prefix}bantemp`, value: '• Ban temporairement un utilisateur.' },
                            { name: `➤ ${config.prefix}infoban`, value: '• Affiche le statut de ban d\'un utilisateur.' },
                            { name: `➤ ${config.prefix}kick`, value: '• Expulse un utilisateur du serveur.' },
                            { name: `➤ ${config.prefix}mute`, value: '• Mute un utilisateur.' },
                            { name: `➤ ${config.prefix}unautokick`, value: '• Désactive le kick automatique d\'un membre.' },
                            { name: `➤ ${config.prefix}unban`, value: '• Débannit un utilisateur.' },
                            { name: `➤ ${config.prefix}unbanip`, value: '• Débannit un utilisateur par son IP.' },
                            { name: `➤ ${config.prefix}unmute`, value: '• Annule le mute d\'un utilisateur.' },
                            { name: `➤ ${config.prefix}voicekick`, value: '• Expulse un utilisateur d\'un canal vocal.' },
                            { name: `➤ ${config.prefix}voicekickall`, value: '• Expulse tous les utilisateurs d\'un canal vocal.' },
                            { name: `➤ ${config.prefix}warn`, value: '• Avertit un utilisateur.' },
                            { name: `➤ ${config.prefix}mp`, value: '• Envoie un message à un membre spécifique.' },
                        )
                        .setFooter({ text: config.footer });

                    break; 
                case 'utility_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Utils**')
                        .setDescription('Voici les commandes utilitaires disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}banner`, value: '• Affiche la bannière d\'un utilisateur ou du serveur.' },
                            { name: `➤ ${config.prefix}boosters`, value: '• Affiche les boosters du serveur.' },
                            { name: `➤ ${config.prefix}bots`, value: '• Affiche tous les bots présents sur le serveur.' },
                            { name: `➤ ${config.prefix}calc`, value: '• Effectue des calculs.' },
                            { name: `➤ ${config.prefix}gay`, value: '• Affiche un niveau de "gay" pour un membre.' },
                            { name: `➤ ${config.prefix}help`, value: '• Affiche l\'aide générale.' },
                            { name: `➤ ${config.prefix}helpall`, value: '• Affiche toutes les commandes disponibles.' },
                            { name: `➤ ${config.prefix}homo`, value: '• Calcule le pourcentage d\'homosexualité entre deux utilisateurs.' },
                            { name: `➤ ${config.prefix}lc`, value: '• Calcule le pourcentage d\'amour entre deux utilisateurs.' },
                            { name: `➤ ${config.prefix}members`, value: '• Affiche le nombre de membres sur le serveur.' },
                            { name: `➤ ${config.prefix}pic`, value: '• Affiche l\'avatar d\'un utilisateur ou l\'icône du serveur.' },
                            { name: `➤ ${config.prefix}ping`, value: '• Affiche la latence du bot.' },
                            { name: `➤ ${config.prefix}search`, value: '• Effectue une recherche sur Google.' },
                            { name: `➤ ${config.prefix}serverinfo`, value: '• Affiche les informations relatives sur le serveur.' },
                            { name: `➤ ${config.prefix}snipe`, value: '• Affiche le dernier message supprimé.' },
                            { name: `➤ ${config.prefix}stat`, value: '• Donne le nombre de serveurs sur lesquels est présent le bot.' },
                            { name: `➤ ${config.prefix}weather`, value: '• Affiche la météo pour une ville.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'management_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Gestions**')
                        .setDescription('Voici les commandes de gestion disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}addrole`, value: '• Ajoute un rôle à un membre.' },
                            { name: `➤ ${config.prefix}delrole`, value: '• Retire un rôle d\'un membre.' },
                            { name: `➤ ${config.prefix}derank`, value: '• Retire tous les rôles d\'un membre.' },
                            { name: `➤ ${config.prefix}clear`, value: '• Supprime un nombre de messages spécifié.' },
                            { name: `➤ ${config.prefix}clearuser`, value: '• Supprime un nombre de messages spécifié pour un membre.' },
                            { name: `➤ ${config.prefix}create`, value: '• Crée un emoji sur le serveur.' },
                            { name: `➤ ${config.prefix}sanctions`, value: '• Affiche les sanctions d\'un membre' },
                            { name: `➤ ${config.prefix}clearsanctions`, value: '• Supprime les sanctions d\'un membre.' },
                            { name: `➤ ${config.prefix}embed`, value: '• Crée un embed personnalisé et l\'envoie dans un salon.' },
                            { name: `➤ ${config.prefix}lock`, value: '• Verrouille un/all salon(s) pour les membres.' },
                            { name: `➤ ${config.prefix}unlock`, value: '• Déverrouille un/all salon(s) pour les membres.' },
                            { name: `➤ ${config.prefix}timelock`, value: '• Verrouille un salon pour une durée spécifiée.' },
                            { name: `➤ ${config.prefix}userinfo`, value: '• Donne les informations relatives sur un membre.' },
                            { name: `➤ ${config.prefix}voice`, value: '• Affiche les stats vocaux.' },
                            { name: `➤ ${config.prefix}voicemoove`, value: '• Déplace un membre vers un salon vocal.' },
                            { name: `➤ ${config.prefix}find`, value: '• Cherche si un membre est dans un salon vocal.' },
                            { name: `➤ ${config.prefix}pin`, value: '• Épingle un message dans un salon textuel.' },
                            { name: `➤ ${config.prefix}renew`, value: '• Renouvelle un salon.' },
                            { name: `➤ ${config.prefix}channelinfo`, value: '• Affiche les informations d\'un salon spécifique.' },
                            { name: `➤ ${config.prefix}say`, value: '• Envoie un message avec le bot dans un salon spécifique.' },
                            { name: `➤ ${config.prefix}votefame`, value: '• Fait un vote entre 2 personnes pour savoir qui a le plus de fame.' },
                            { name: `➤ ${config.prefix}setjoiners`, value: '• Configure le salon où sera envoyé le message de bienvenue.' },
                            { name: `➤ ${config.prefix}setleaves`, value: '• Configure le salon où sera envoyé le message de départ.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'backup_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Backup**')
                        .setDescription('Voici les commandes de sauvegarde disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}backup`, value: '• Ne pas USE {HS}.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'ticket_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Ticket**')
                        .setDescription('Voici les commandes de ticket disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}ticket`, value: '• Met en place le panel de ticket.' },
                            { name: `➤ ${config.prefix}claim`, value: '• Récupère un ticket.' },
                            { name: `➤ ${config.prefix}close`, value: '• Ferme un ticket.' },
                            { name: `➤ ${config.prefix}add`, value: '• Ajoute un membre au ticket.' },
                            { name: `➤ ${config.prefix}del`, value: '• Supprime un membre du ticket.' },
                            { name: `➤ ${config.prefix}rename`, value: '• Renomme un ticket.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                case 'giveaway_commands':
                    selectedCategory = new EmbedBuilder()
                        .setColor(config.color)
                        .setTitle('**Giveaway**')
                        .setDescription('Voici les commandes de giveaway disponibles :\n')
                        .addFields(
                            { name: `➤ ${config.prefix}giveaway`, value: '• Crée un giveaway.' },
                            { name: `➤ ${config.prefix}reerol`, value: '• Annonce un nouveau gagnant.' },
                        )
                        .setFooter({ text: config.footer });

                    break;
                default:
                    return;
            }

            await interaction.update({ embeds: [selectedCategory], components: [row] });
        });

        collector.on('end', collected => {
            if (!collected.size) return sentMessage.edit({ components: [] });
        });
    },
};
