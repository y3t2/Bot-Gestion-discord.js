const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { QuickDB } = require('quick.db');
const config = require('./config');

const db = new QuickDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ]
});

client.guildInvites = new Collection();

client.commands = new Collection();

function loadCommands(directory) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.name.endsWith('.js')) {
            try {
                const command = require(fullPath);
                client.commands.set(command.name, command);
                console.log(`Commande chargée : ${command.name}`);
            } catch (error) {
                console.error(`Erreur lors du chargement de la commande ${file.name}:`, error);
            }
        }
    }
}

loadCommands(path.join(__dirname, '../Commands'));

function loadEvents(directory) {
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
    for (const file of files) {
        try {
            const event = require(path.join(directory, file));
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`Événement chargé : ${event.name}`);
        } catch (error) {
            console.error(`Erreur lors du chargement de l'événement ${file}:`, error);
        }
    }
}

loadEvents(path.join(__dirname, '../Events'));

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            console.log(`Commande non trouvée : ${commandName}`);
            return;
        }

        try {
            await command.execute(message, args);
            console.log(`Commande exécutée : ${commandName} par ${message.author.tag}`);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
        }
    }
});

client.login(config.token);
