const Discord = require('discord.js');
const { Permissions } = Discord;

exports.run = async (client, message, args) => {
    try {

        if (!message.guild.me.permissions.has([Permissions.FLAGS.MUTE_MEMBERS])) return message.channel.send("Aku tidak mempunyai akses!");
        if (!message.member.permissions.has([Permissions.FLAGS.MUTE_MEMBERS])) return message.channel.send("Kamu tidak memiliki izin untuk menggunakan perintah ini!");

        const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;
        let role = message.guild.roles.cache.find(r => r.name === "Kool-E");


        mutee.roles.add(role).then(() => {
            message.channel.send(`${mutee.user.tag} telah selesai diberi \`Kool-E\`.\nAlasan : Menghina Kato`)
        })

        let embed = new Discord.MessageEmbed()
            .setAuthor(`Kool-E | ${mutee.user.tag}`)
            .setColor(client.warna.kato)
            .addField("User", `<@${mutee.id}>`, true)
            .addField("Moderator", `<@${message.author}>`, true)
            .setTimestamp()
            .setFooter(`${message.member.id}`, message.guild.iconURL);

        client.channels.cache.get(client.config.channel["warn-activity"]).send({ embeds: [embed] });

        setTimeout(() => {
            mutee.roles.remove(role)
        }, 900000);

    } catch (error) {
        return message.channel.send(`Something went wrong: ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ['koole'],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'kool-e',
    description: 'Memberikan Role Kool-E kepada Member',
    usage: 'k!koole',
    example: 'k!koole'
}