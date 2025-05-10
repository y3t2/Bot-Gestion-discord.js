const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const greetings = ['salut', 'yo', 'yooo', 'sdk?', 'coucou', 'Wewe',];


        const containsGreeting = greetings.some(greeting => message.content.toLowerCase().includes(greeting));
        const isEveryoneMentioned = message.mentions.everyone; 

        if (containsGreeting && !isEveryoneMentioned) {
            try {
                const reactionEmoji = '👋'; 
                await message.react(reactionEmoji);
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la réaction :', error);
            }
        }
    },
};
