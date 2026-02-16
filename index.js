const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const fs = require('fs');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let data = {};
if (fs.existsSync('./data.json')) {
  data = JSON.parse(fs.readFileSync('./data.json'));
}

function saveData() {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Xem số tiền của bạn'),
  new SlashCommandBuilder()
    .setName('work')
    .setDescription('Đi làm kiếm tiền')
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );
  console.log('Bot đã sẵn sàng!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  if (!data[userId]) data[userId] = { money: 0 };

  if (interaction.commandName === 'balance') {
    await interaction.reply(`💰 Bạn có ${data[userId].money} coins`);
  }

  if (interaction.commandName === 'work') {
    const earn = Math.floor(Math.random() * 200) + 50;
    data[userId].money += earn;
    saveData();
    await interaction.reply(`🛠 Bạn kiếm được ${earn} coins!`);
  }
});

client.login(token);
