const Discord = require('discord.js');
const spotify = require('spotify-url-info');

exports.run = async (client, message, args) => {
    try {
        /** Get Data Member */
        const get = client.users.cache.get(args[0]) || message.author || message.mentions.members.first();
        const member = message.guild.members.cache.get(get.id).presence.activities;
        const getData = member.find(a => a.name.toLowerCase() === 'spotify');
        if (!getData) return message.reply('Spotify tidak terdektsi di presence!');

        /** Get Data Song */
        const dataSpotify = await spotify.getData('https://open.spotify.com/track/' + getData.syncId);
        if (!dataSpotify) return message.reply('Data tidak ditemukan!');

        const embed = new Discord.MessageEmbed()
            .setColor(dataSpotify.dominantColor)
            .setAuthor('Spotify Current Playing', 'https://cdn.discordapp.com/attachments/932997960923480099/933878227536080956/spotify.png', dataSpotify.external_urls.spotify)
            .setImage(dataSpotify.album.images[0].url)
            .addField('Title :', dataSpotify.name, true)
            .addField('Album :', dataSpotify.album.name ? dataSpotify.album.name : '-', true)
            .addField('Artist :', dataSpotify.artists.map((a, i) => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)
            .addField('Length :', client.util.parseDur(dataSpotify.duration_ms), true)
            .addField('Link :', 'https://open.spotify.com/track/' + dataSpotify.id, true)
            .setFooter(get.tag, get.avatarURL({ size: 4096 }))


        await message.channel.send({ embeds: [embed] });
    } catch (error) {
        message.channel.send(`Something went wrong: ${error.message}`);
        console.log(error);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'spotify',
    description: 'Menampilkan status spotify',
    usage: 'spotify',
    example: 'spotify'
}