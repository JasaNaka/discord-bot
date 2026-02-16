const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const DATA_FILE = './data.json';

// Tạo file JSON nếu chưa có
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function loadData() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Slash commands
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
        await interaction.reply(`💰 You have ${data[userId].money} coins.`);
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

        await interaction.reply("🎁 You received 100 coins!");
    }

    if (interaction.commandName === 'quest') {
        const reward = Math.floor(Math.random() * 200) + 50;
        data[userId].money += reward;
        saveData(data);

        await interaction.reply(`⚔️ Quest completed! You earned ${reward} coins.`);
    }
});

client.login(TOKEN);  const filtered = questsData.quests.filter(q => q.rarity === selectedRarity);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your gold balance'),
  new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Complete a random quest')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );
  console.log('Quest Bot is ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;
  if (!data[userId]) data[userId] = { gold: 0 };

  if (interaction.commandName === 'balance') {
    return interaction.reply(`💰 You have ${data[userId].gold} Gold`);
  }

  if (interaction.commandName === 'quest') {
    const quest = getRandomQuest();

    const amount = Math.floor(
      Math.random() * (quest.max_gold - quest.min_gold + 1)
    ) + quest.min_gold;

    data[userId].gold += amount;
    saveData();

    const message = quest.message.replace('{amount}', amount);

    return interaction.reply(`✨ [${quest.rarity.toUpperCase()}]\n${message}`);
  }
});

client.login(token);  const filtered = questsData.quests.filter(q => q.rarity === selectedRarity);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your gold balance'),
  new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Complete a random quest')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );
  console.log('Quest Bot is ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;
  if (!data[userId]) data[userId] = { gold: 0 };

  if (interaction.commandName === 'balance') {
    return interaction.reply(`💰 You have ${data[userId].gold} Gold`);
  }

  if (interaction.commandName === 'quest') {
    const quest = getRandomQuest();

    const amount = Math.floor(
      Math.random() * (quest.max_gold - quest.min_gold + 1)
    ) + quest.min_gold;

    data[userId].gold += amount;
    saveData();

    const message = quest.message.replace('{amount}', amount);

    return interaction.reply(`✨ [${quest.rarity.toUpperCase()}]\n${message}`);
  }
});

client.login(token);
