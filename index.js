const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Web server started');
});

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const DATA_FILE = './data.json';

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your money'),
  new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim daily reward'),
  new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Complete a quest')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Bot online as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const data = loadData();
  const userId = interaction.user.id;

  if (!data[userId]) {
    data[userId] = {
      money: 0,
      lastDaily: 0
    };
  }

  if (interaction.commandName === 'balance') {
    return interaction.reply(`💰 You have ${data[userId].money} coins.`);
  }

  if (interaction.commandName === 'daily') {
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;

    if (now - data[userId].lastDaily < cooldown) {
      return interaction.reply("⏳ You already claimed daily reward.");
    }

    data[userId].money += 100;
    data[userId].lastDaily = now;
    saveData(data);

    return interaction.reply("🎁 You received 100 coins!");
  }

  if (interaction.commandName === 'quest') {
    const reward = Math.floor(Math.random() * 200) + 50;
    data[userId].money += reward;
    saveData(data);

    return interaction.reply(`⚔️ Quest completed! You earned ${reward} coins.`);
  }
});

client.login(TOKEN);
