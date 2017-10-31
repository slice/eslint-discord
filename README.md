# eslint-discord

A Discord bot that is hooked up to ESLint. It yells at everyone that posts
bad JavaScript codeblocks.

Initial version made in 40 minutes.

## Getting Started

Why?

Create `creds.json` alongside `bot.js`:

```json
{
  "token": "...",
  "channels": ["...", "..."]
}
```

- `token` [`String`]: The Discord bot token to use.
- `channels` [`Array<String>`]: The array of channel IDs to operate in.

Then, `node bot.js`.

### Getting the bot to ignore you

Send `fuck off eslint`. The bot will now ignore you until a reboot.

Only for last resort.

## Technologies Used

- Discord.js
- ESLint

## License

MIT (See `LICENSE`).
