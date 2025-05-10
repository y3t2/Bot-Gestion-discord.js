const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'gay',
    description: 'Affiche un niveau de "gay" pour un membre.',
    async execute(message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const replies = [
            "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ 0% !",
            "🏳️‍🌈⬛⬛⬛⬛⬛⬛⬛⬛ 10%",
            "🏳️‍🌈🏳️‍🌈⬛⬛⬛⬛⬛⬛ 20% !",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛⬛⬛⬛ 30%",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛⬛⬛⬛ 40% !",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛⬛⬛⬛ 50%",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛⬛⬛ 60% !",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛⬛ 70%",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛⬛ 80%",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈⬛ 90%",
            "🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈 100%",
        ];

        const result = Math.floor(Math.random() * replies.length);
        
        const embed = new EmbedBuilder()
            .setDescription(`Niveau de **Gay** de __<@${member.user.id}>__ !`)
            .addFields(
                { name: '**Gay à :**', value: `${replies[result]}` }
            )
            .setFooter({ text: config.footer })
            .setColor(config.color);

        await message.reply({ embeds: [embed] }).catch(() => false);
    },
};
