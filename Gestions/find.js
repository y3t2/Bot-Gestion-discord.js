const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'find',
    description: 'Trouve les informations d\'un membre, y compris s\'il est en vocal et depuis combien de temps.',
    async execute(message, args) {
        const ownerIds = await db.get('owners') || []; 

        if (!ownerIds.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un membre à rechercher.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const memberId = args[0].replace(/[<@!>]/g, ''); 
        let member;

        try {
            member = await message.guild.members.fetch(memberId);
        } catch (error) {
            console.error('Erreur lors de la récupération du membre:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le membre spécifié est introuvable.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const isInVoice = member.voice.channel ? 'Oui' : 'Non';
        const voiceChannel = member.voice.channel ? `<#${member.voice.channel.id}>` : 'Aucun';
        let timeInChannel = 'Inconnu';

        if (member.voice.channel) {
            const joinedTimestamp = member.voice.channel.joinedTimestamp;
            if (joinedTimestamp) {
                const timeJoined = Date.now() - joinedTimestamp;
                const minutes = Math.floor(timeJoined / (1000 * 60));
                timeInChannel = `${minutes} minutes`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('🔍 Informations sur le membre')
            .setDescription(`
                **Membre :** ${member}
                **En vocal :** ${isInVoice}
                **Salon vocal :** ${voiceChannel}
                **Depuis :** ${timeInChannel}
            `)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    },
};
