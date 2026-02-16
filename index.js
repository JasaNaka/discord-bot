const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Load player data
let data = fs.existsSync('./data.json')
  ? JSON.parse(fs.readFileSync('./data.json'))
  : {};

// Load quest data
const questsData = JSON.parse(fs.readFileSync('./quests.json'));

function saveData() {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

function getRandomQuest() {
  const rates = questsData.rarity_rates;
  const total = Object.values(rates).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  let selectedRarity;
  for (const rarity in rates) {
    if (rand < rates[rarity]) {
      selectedRarity = rarity;
      break;
    }
    rand -= rates[rarity];
  }

  const filtered = questsData.quests.filter(q => q.rarity === selectedRarity);
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
