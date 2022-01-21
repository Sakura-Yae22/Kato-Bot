const db = require('../database/schema/Giveaway');
const dbxp = require('../database/schema/xp_player');

module.exports = async (client, interaction) => {
    if (interaction.customId === 'santai') {
        await interaction.deferUpdate();

        //give santai role to players when clicked
        const santai = interaction.message.guild.roles.cache.find(r => r.name === 'POSer');
        const member = await interaction.message.guild.members.fetch(interaction.user.id);
        console.log(member);

        if (member.roles.cache.has(santai.id)) return;
        member.roles.add(santai);

        //send on dm 
        interaction.user.send(`Selamat datang di **${interaction.message.guild.name}**, kamu telah mendapatkan role **POSer**!`);
    }

    if (interaction.customId === 'giveawayID') {
        await interaction.deferUpdate();

        const data = await db.findOne({ messageID: interaction.message.id });
        const xps = await dbxp.findOne({ id: 1 });
        if (!xps) return;

        if (!data) return interaction.user.send('Giveaway tidak ditemukan!');
        if (data.isDone) return interaction.user.send('Giveaway telah berakhir!');
        if (data.entries.includes(interaction.user.id)) return interaction.user.send('Sudah terdaftar dalam giveaway!');

        let isOK = null;
        switch (data.require.name) {
            case 'MEE6':
                const xp = xps.data;
                const player = xp.find(a => a.id === interaction.user.id);
                if (!player) return interaction.user.send('Tidak dapat mengikuti karna Level tidak mencukupi!');

                const requireLevel = parseInt(data.require.value);
                isOK = player.level <= requireLevel ? false : true;
                break;

            case 'ROLE':
                const requireRole = data.require.value;
                const rolePlayer = interaction.member.roles.cache;
                for (const role of requireRole) if (rolePlayer.has(role)) isOK = true;
                break;

            default:
                isOK = true;
                break;
        }

        if (!isOK) return interaction.user.send('Syarat tidak mencukupi!');
        data.entries.push(interaction.user.id);
        data.embed.fields[2].value = `${data.entries.length}`;

        await interaction.message.edit({ embeds: [data.embed] });
        await db.findOneAndUpdate({ messageID: interaction.message.id }, data);

        interaction.user.send('Telah mengikuti giveaway!');
    }
}