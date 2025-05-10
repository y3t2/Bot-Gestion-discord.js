const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fetch = require('node-fetch'); 
const config = require('../../Client/config');



const countries = [
    { label: 'France 🇫🇷', value: 'FR' },
    { label: 'Allemagne 🇩🇪', value: 'DE' },
    { label: 'Espagne 🇪🇸', value: 'ES' },
    { label: 'Italie 🇮🇹', value: 'IT' },
    { label: 'Belgique 🇧🇪', value: 'BE' },
    { label: 'Pays-Bas 🇳🇱', value: 'NL' },
    { label: 'Royaume-Uni 🇬🇧', value: 'GB' },
    { label: 'Autriche 🇦🇹', value: 'AT' },
    { label: 'Portugal 🇵🇹', value: 'PT' },
    { label: 'Suisse 🇨🇭', value: 'CH' },
    { label: 'Suède 🇸🇪', value: 'SE' },
    { label: 'Norvège 🇳🇴', value: 'NO' },
    { label: 'Danemark 🇩🇰', value: 'DK' },
    { label: 'Finlande 🇫🇮', value: 'FI' },
    { label: 'Irlande 🇮🇪', value: 'IE' },
    { label: 'Pologne 🇵🇱', value: 'PL' },
    { label: 'République tchèque 🇨🇿', value: 'CZ' },
    { label: 'Hongrie 🇭🇺', value: 'HU' },
    { label: 'Grèce 🇬🇷', value: 'GR' }
];


const citiesByCountry = {
    FR: [
        { label: 'Paris', value: 'Paris' },
        { label: 'Lyon', value: 'Lyon' },
        { label: 'Marseille', value: 'Marseille' },
        { label: 'Toulouse', value: 'Toulouse' },
        { label: 'Nice', value: 'Nice' },
        { label: 'Bordeaux', value: 'Bordeaux' },
        { label: 'Nantes', value: 'Nantes' },
        { label: 'Strasbourg', value: 'Strasbourg' },
        { label: 'Montpellier', value: 'Montpellier' }
    ],
    DE: [
        { label: 'Berlin', value: 'Berlin' },
        { label: 'Munich', value: 'Munich' },
        { label: 'Hambourg', value: 'Hamburg' },
        { label: 'Francfort', value: 'Frankfurt' },
        { label: 'Stuttgart', value: 'Stuttgart' },
        { label: 'Düsseldorf', value: 'Düsseldorf' },
        { label: 'Cologne', value: 'Cologne' },
        { label: 'Brême', value: 'Bremen' },
        { label: 'Hanovre', value: 'Hanover' }
    ],
    ES: [
        { label: 'Madrid', value: 'Madrid' },
        { label: 'Barcelone', value: 'Barcelona' },
        { label: 'Valence', value: 'Valencia' },
        { label: 'Séville', value: 'Seville' },
        { label: 'Saragosse', value: 'Zaragoza' },
        { label: 'Malaga', value: 'Malaga' },
        { label: 'Bilbao', value: 'Bilbao' },
        { label: 'Murcie', value: 'Murcia' },
        { label: 'Salamanca', value: 'Salamanca' }
    ],
    IT: [
        { label: 'Rome', value: 'Rome' },
        { label: 'Milan', value: 'Milan' },
        { label: 'Naples', value: 'Naples' },
        { label: 'Turin', value: 'Turin' },
        { label: 'Palermo', value: 'Palermo' },
        { label: 'Gênes', value: 'Genoa' },
        { label: 'Bologne', value: 'Bologna' },
        { label: 'Florence', value: 'Florence' },
        { label: 'Venise', value: 'Venice' }
    ],
    BE: [
        { label: 'Bruxelles', value: 'Bruxelles' },
        { label: 'Anvers', value: 'Antwerp' },
        { label: 'Gand', value: 'Ghent' },
        { label: 'Liège', value: 'Liège' },
        { label: 'Charleroi', value: 'Charleroi' },
        { label: 'Bruges', value: 'Bruges' },
        { label: 'Namur', value: 'Namur' },
        { label: 'Ostende', value: 'Ostend' },
        { label: 'Mons', value: 'Mons' }
    ],
    NL: [
        { label: 'Amsterdam', value: 'Amsterdam' },
        { label: 'Rotterdam', value: 'Rotterdam' },
        { label: 'La Haye', value: 'The Hague' },
        { label: 'Utrecht', value: 'Utrecht' },
        { label: 'Eindhoven', value: 'Eindhoven' },
        { label: 'Tilburg', value: 'Tilburg' },
        { label: 'Groningue', value: 'Groningen' },
        { label: 'Arnhem', value: 'Arnhem' },
        { label: 'Maastricht', value: 'Maastricht' }
    ],
    GB: [
        { label: 'Londres', value: 'London' },
        { label: 'Manchester', value: 'Manchester' },
        { label: 'Birmingham', value: 'Birmingham' },
        { label: 'Liverpool', value: 'Liverpool' },
        { label: 'Édimbourg', value: 'Edinburgh' },
        { label: 'Glasgow', value: 'Glasgow' },
        { label: 'Bristol', value: 'Bristol' },
        { label: 'Leeds', value: 'Leeds' },
        { label: 'Sheffield', value: 'Sheffield' }
    ],
    AT: [
        { label: 'Vienne', value: 'Vienna' },
        { label: 'Graz', value: 'Graz' },
        { label: 'Linz', value: 'Linz' },
        { label: 'Salzbourg', value: 'Salzburg' },
        { label: 'Innsbruck', value: 'Innsbruck' },
        { label: 'Klagenfurt', value: 'Klagenfurt' },
        { label: 'St. Pölten', value: 'St. Pölten' },
        { label: 'Bregenz', value: 'Bregenz' },
        { label: 'Villach', value: 'Villach' }
    ],
    PT: [
        { label: 'Lisbonne', value: 'Lisbon' },
        { label: 'Porto', value: 'Porto' },
        { label: 'Braga', value: 'Braga' },
        { label: 'Coimbra', value: 'Coimbra' },
        { label: 'Aveiro', value: 'Aveiro' },
        { label: 'Funchal', value: 'Funchal' },
        { label: 'Évora', value: 'Évora' },
        { label: 'Viseu', value: 'Viseu' },
        { label: 'Guimarães', value: 'Guimarães' }
    ],
    CH: [
        { label: 'Zurich', value: 'Zurich' },
        { label: 'Genève', value: 'Geneva' },
        { label: 'Bâle', value: 'Basel' },
        { label: 'Berne', value: 'Bern' },
        { label: 'Lucerne', value: 'Lucerne' },
        { label: 'Lausanne', value: 'Lausanne' },
        { label: 'Saint-Moritz', value: 'St. Moritz' },
        { label: 'Interlaken', value: 'Interlaken' },
        { label: 'Montreux', value: 'Montreux' }
    ],
    SE: [
        { label: 'Stockholm', value: 'Stockholm' },
        { label: 'Göteborg', value: 'Gothenburg' },
        { label: 'Malmö', value: 'Malmö' },
        { label: 'Uppsala', value: 'Uppsala' },
        { label: 'Västerås', value: 'Västerås' },
        { label: 'Örebro', value: 'Örebro' },
        { label: 'Linköping', value: 'Linköping' },
        { label: 'Helsingborg', value: 'Helsingborg' },
        { label: 'Lund', value: 'Lund' }
    ],
    NO: [
        { label: 'Oslo', value: 'Oslo' },
        { label: 'Bergen', value: 'Bergen' },
        { label: 'Stavanger', value: 'Stavanger' },
        { label: 'Drammen', value: 'Drammen' },
        { label: 'Kristiansand', value: 'Kristiansand' },
        { label: 'Tromsø', value: 'Tromsø' },
        { label: 'Trondheim', value: 'Trondheim' },
        { label: 'Sandnes', value: 'Sandnes' },
        { label: 'Bodø', value: 'Bodø' }
    ],
    DK: [
        { label: 'Copenhague', value: 'Copenhagen' },
        { label: 'Aarhus', value: 'Aarhus' },
        { label: 'Odense', value: 'Odense' },
        { label: 'Aalborg', value: 'Aalborg' },
        { label: 'Esbjerg', value: 'Esbjerg' },
        { label: 'Randers', value: 'Randers' },
        { label: 'Kolding', value: 'Kolding' },
        { label: 'Horsens', value: 'Horsens' },
        { label: 'Silkeborg', value: 'Silkeborg' }
    ],
    FI: [
        { label: 'Helsinki', value: 'Helsinki' },
        { label: 'Espoo', value: 'Espoo' },
        { label: 'Tampere', value: 'Tampere' },
        { label: 'Oulu', value: 'Oulu' },
        { label: 'Vantaa', value: 'Vantaa' },
        { label: 'Jyväskylä', value: 'Jyväskylä' },
        { label: 'Lahti', value: 'Lahti' },
        { label: 'Kuopio', value: 'Kuopio' },
        { label: 'Rovaniemi', value: 'Rovaniemi' }
    ],
    IE: [
        { label: 'Dublin', value: 'Dublin' },
        { label: 'Cork', value: 'Cork' },
        { label: 'Limerick', value: 'Limerick' },
        { label: 'Galway', value: 'Galway' },
        { label: 'Waterford', value: 'Waterford' },
        { label: 'Drogheda', value: 'Drogheda' },
        { label: 'Sligo', value: 'Sligo' },
        { label: 'Kilkenny', value: 'Kilkenny' },
        { label: 'Ennis', value: 'Ennis' }
    ],
    PL: [
        { label: 'Varsovie', value: 'Warsaw' },
        { label: 'Cracovie', value: 'Kraków' },
        { label: 'Gdańsk', value: 'Gdańsk' },
        { label: 'Wrocław', value: 'Wrocław' },
        { label: 'Poznań', value: 'Poznań' },
        { label: 'Łódź', value: 'Łódź' },
        { label: 'Katowice', value: 'Katowice' },
        { label: 'Bydgoszcz', value: 'Bydgoszcz' },
        { label: 'Szczecin', value: 'Szczecin' }
    ],
    CZ: [
        { label: 'Prague', value: 'Prague' },
        { label: 'Brno', value: 'Brno' },
        { label: 'Ostrava', value: 'Ostrava' },
        { label: 'Plzeň', value: 'Plzeň' },
        { label: 'Liberec', value: 'Liberec' },
        { label: 'Olomouc', value: 'Olomouc' },
        { label: 'Ústí nad Labem', value: 'Ústí nad Labem' },
        { label: 'Hradec Králové', value: 'Hradec Králové' },
        { label: 'Zlin', value: 'Zlin' }
    ],
    HU: [
        { label: 'Budapest', value: 'Budapest' },
        { label: 'Debrecen', value: 'Debrecen' },
        { label: 'Szeged', value: 'Szeged' },
        { label: 'Miskolc', value: 'Miskolc' },
        { label: 'Pécs', value: 'Pécs' },
        { label: 'Győr', value: 'Győr' },
        { label: 'Nyíregyháza', value: 'Nyíregyháza' },
        { label: 'Kecskemét', value: 'Kecskemét' },
        { label: 'Székesfehérvár', value: 'Székesfehérvár' }
    ],
    GR: [
        { label: 'Athènes', value: 'Athens' },
        { label: 'Thessalonique', value: 'Thessaloniki' },
        { label: 'Patras', value: 'Patras' },
        { label: 'Heraklion', value: 'Heraklion' },
        { label: 'Larissa', value: 'Larissa' },
        { label: 'Volos', value: 'Volos' },
        { label: 'Rhodes', value: 'Rhodes' },
        { label: 'Chania', value: 'Chania' },
        { label: 'Kalamata', value: 'Kalamata' }
    ]
};

module.exports = {
    name: 'weather',
    description: 'Affiche la météo pour une ville donnée.',
    async execute(message) {
        
        const countrySelectMenu = new StringSelectMenuBuilder()
            .setCustomId('country_select')
            .setPlaceholder('Choisissez un pays')
            .addOptions(countries);

        const countryRow = new ActionRowBuilder().addComponents(countrySelectMenu);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('🌍 Sélectionnez un pays pour commencer')
            .setDescription('Choisissez d\'abord un pays dans le menu déroulant ci-dessous.')
            .setFooter({ text: config.footer})
            

        
        const sentMessage = await message.reply({ embeds: [embed], components: [countryRow] });

        
        const countryFilter = interaction => interaction.isStringSelectMenu() && interaction.customId === 'country_select';
        const countryCollector = sentMessage.createMessageComponentCollector({ filter: countryFilter, time: 60000 }); 

        countryCollector.on('collect', async interaction => {
            const selectedCountry = interaction.values[0];
            const selectedCities = citiesByCountry[selectedCountry];

            
            const citySelectMenu = new StringSelectMenuBuilder()
                .setCustomId('city_select')
                .setPlaceholder('Choisissez une ville')
                .addOptions(selectedCities);

            const cityRow = new ActionRowBuilder().addComponents(citySelectMenu);

            const cityEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('Sélectionnez une ville')
                .setDescription(`Vous avez choisi le pays : ${countries.find(c => c.value === selectedCountry).label}. Sélectionnez maintenant une ville.`)
                .setFooter({ text: config.footer })
                

            await interaction.update({ embeds: [cityEmbed], components: [cityRow] });

            
            const cityFilter = i => i.isStringSelectMenu() && i.customId === 'city_select';
            const cityCollector = interaction.message.createMessageComponentCollector({ filter: cityFilter, time: 60000 }); 

            cityCollector.on('collect', async i => {
                const city = i.values[0];
                await fetchWeatherData(i, city);
            });
        });
    },
};


async function fetchWeatherData(interaction, city) {
    const apiKey = config.WEATHER_API_KEY; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            return interaction.reply('Ville non trouvée.');
        }

        const weatherEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`Météo à ${city}`)
            .setDescription(`**Température :** ${data.main.temp} °C\n**Description :** ${data.weather[0].description}\n**Humidité :** ${data.main.humidity}%\n**Vitesse du vent :** ${data.wind.speed} m/s`)
            .setFooter({ text: config.footer})
            

        await interaction.reply({ embeds: [weatherEmbed] });
    } catch (error) {
        console.error(error);
        await interaction.reply('Une erreur est survenue lors de la récupération des données météorologiques.');
    }
}
