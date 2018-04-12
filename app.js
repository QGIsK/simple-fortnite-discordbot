const Config = require("./config.json");
const Discord = require("discord.js");
const Fortnite = require("fortnite");
const ft = new Fortnite(Config.apiFortnite);

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("Demian.cf", {type: "WATCHING"});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = Config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  //$hello

  if(cmd === `${prefix}hello`) {
    return message.channel.send("Hello!")
  }

  //!fstats {pc} {epicName}
  if(cmd === `${prefix}lfstats`) {

    let username = args[0];
    let platform = args[1] || "pc";
    let data = ft.getInfo(username, platform).then(data => {

      let stats = data.lifetimeStats;
      let kills = stats.find(s => s.stat == 'kills');
      let wins = stats.find(s => s.stat == 'wins');
      let kd = stats.find(s => s.stat == 'kd');
      let mPlayed = stats.find(s => s.stat == 'matchesPlayed');

      let embed = new Discord.RichEmbed()
      .setTitle("Fortnite Stats | Lifetime")
      .setAuthor(data.username + "'s")
      .setColor(Config.green)
      .addField("Kills", kills.value, true)
      .addField("Wins", wins.value, true)
      .addField("K/D", kd.value, true)
      .addField("Matches Played", mPlayed.value, true)

      message.channel.send(embed);

    }).catch(e => {
      console.log(e);
      message.channel.send("Couldn't find that username");
    });

  }

});

bot.login(Config.token);
