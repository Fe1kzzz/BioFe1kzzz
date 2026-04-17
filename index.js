const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Информационный бот запущен как ${client.user.tag}`);
});

async function sendInfoPanel(channelId) {
  const channel = await client.channels.fetch(channelId);
  
  // Основная информация
  const mainEmbed = new EmbedBuilder()
    .setTitle(`📋 Информация по проекту ${config.projectName}`)
    .setDescription(config.description)
    .setColor('#FF0000')
    .addFields({
      name: '\u200B',
      value: config.additionalInfo
    });

  // Расписание серверов
  const scheduleEmbed = new EmbedBuilder()
    .setTitle('📋 Расписание серверов')
    .setColor('#FF0000')
    .setDescription(
      `• **Время вайпа (летнего периода):** ${config.schedule.summerWipe.time} ${config.schedule.summerWipe.timezone} (${config.schedule.summerWipe.months})\n` +
      `• **Время вайпа (учебного периода):** ${config.schedule.schoolWipe.time} ${config.schedule.schoolWipe.timezone} (${config.schedule.schoolWipe.months})\n` +
      `• **Еженедельный вайп карты:** ${config.schedule.weeklyWipe}\n` +
      `• **Глобальный вайп:** ${config.schedule.globalWipe}\n` +
      `• **Плановый рестарт:** ${config.schedule.plannedRestart}`
    );

  // Серверы
  let serversText = '';
  config.servers.forEach((server, index) => {
    serversText += `**Сервер ${index + 1}**\n\n`;
    serversText += `**${server.name}**\n`;
    serversText += `**${server.multiplier}**\n`;
    serversText += `**Вайп:** ${server.wipeType}\n\n`;
    serversText += `\`\`\`connect\n${server.connect}\`\`\`\n`;
  });

  scheduleEmbed.addFields({
    name: '\u200B',
    value: serversText
  });

  // Полезные команды
  const commandsEmbed = new EmbedBuilder()
    .setTitle('📋 Полезные команды')
    .setColor('#FF0000');

  let commandsText = '';
  config.commands.forEach(cmd => {
    commandsText += `\`${cmd.command}\` - ${cmd.description}\n`;
  });

  commandsEmbed.setDescription(commandsText);

  // Официальные ссылки
  const linksEmbed = new EmbedBuilder()
    .setTitle('📋 Официальные ссылки проекта')
    .setColor('#FF0000')
    .setDescription(
      `**Наш магазин** - ${config.links.shop}\n` +
      `**Discord** - ${config.links.discord}\n` +
      `**Telegram** - ${config.links.telegram}\n` +
      `**Группа VK** - ${config.links.vk}`
    );

  // Кнопки
  const buttons = new ActionRowBuilder();
  config.buttons.forEach(btn => {
    buttons.addComponents(
      new ButtonBuilder()
        .setLabel(btn.label)
        .setEmoji(btn.emoji)
        .setStyle(ButtonStyle.Link)
        .setURL(btn.url)
    );
  });

  await channel.send({ embeds: [mainEmbed] });
  await channel.send({ embeds: [scheduleEmbed] });
  await channel.send({ embeds: [commandsEmbed] });
  await channel.send({ embeds: [linksEmbed], components: [buttons] });
}

client.login(process.env.DISCORD_TOKEN);

module.exports = { sendInfoPanel };
