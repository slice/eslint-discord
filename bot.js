const creds = require('./creds.json');
const Discord = require('discord.js');
const Linter = require('eslint').Linter;
const linter = new Linter();

let client = new Discord.Client();
client.on('debug', console.log);
client.on('warn', console.log);
client.on('error', console.log);

// List of channel IDs that the bot should be active in.
const channels = creds.channels;

// YELL YELL YELL
const yells = creds.yells || [
  'HEY %, YOUR CODE IS BAD',
  '% WRITES BAD CODE',
  'HAHAHAHAHHAHAHAHAH %',
  'LOL %',
  'HELLO ITS ME %'
]

// Set of users that the bot doesn't respond to.
let ignoringUsers = new Set(creds.ignoring || []);

const regex = /```js\n([\s\S]+)\n?```/gi;
const rules = {
  semi: 'error'
}
const linterConfig = {
  rules,
  parserOptions: {
    ecmaVersion: 2015
  }
}

client.on('message', async msg => {
  if (!channels.includes(msg.channel.id)
      || msg.author.id == client.user.id
      || msg.author.bot
      || ignoringUsers.has(msg.author.id)) {
    return;
  }

  if (msg.content === 'fuck off eslint') {
    await msg.channel.send('ok');
    ignoringUsers.add(msg.author.id);
    return;
  }

  const match = regex.exec(msg.content);

  if (!match) {
    return;
  }

  let code = match[1];

  // Lint.
  let messages = linter.verify(code, linterConfig, {filename: 'shitcode.js'});

  // It's good!
  if (!messages.length) {
    return await msg.react('🍌')
  }

  const yell = yells[Math.floor(Math.random() * yells.length)]
    .replace('%', msg.author.toString());

  // Form error message.
  await msg.react('🔥')
  let errorMessage = messages.map(
    msg => `L${msg.line}:C${msg.column}: ${msg.message}`
  ).join('\n')

  // Yell at them!
  await msg.channel.send(yell + '\n\n```js\n' + errorMessage + '\n```');
});

client.login(creds.token);
