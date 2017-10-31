const creds = require('./creds.json');
const Discord = require('discord.js');
const Linter = require('eslint').Linter;
const linter = new Linter();

let client = new Discord.Client();
client.on('debug', console.log);
client.on('warn', console.log);
client.on('error', console.log);

const channels = ['303292278582280193', '366746609041801227'];
const yells = [
  'HEY %, YOUR CODE IS BAD',
  '% WRITES BAD CODE',
  'HAHAHAHAHHAHAHAHAH %',
  'LOL %',
  'HELLO ITS ME %'
]
let ignoringUsers = new Set();
const regex = /```js\n([\s\S]+)\n?```/gi;
const rules = {
  semi: 'error'
}

client.on('message', async msg => {
  // Only function in whitelisted channels. Ignore myself, and ignore bots.
  // Also, ignore blacklisted users.
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
  let messages = linter.verify(code, {
    rules, parserOptions: {
      ecmaVersion: 2015}
    }, {
      filename: 'shitcode.js'
    }
  );

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
  await msg.channel.send(
    yell + '\n\n```js\n' + errorMessage + '\n```'
  );
});

client.login(creds.token);
