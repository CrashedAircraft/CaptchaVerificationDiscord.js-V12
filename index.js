const Discord = require("discord.js");
const MessageEmbed = require("discord.js");
const Attachment = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client()
const Catpcha = require("@haileybot/captcha-generator");

client.on("ready", () => {
  client.user.setActivity("CrashedAircraft on github!", { type: "WATCHING" });
  console.log("Bot is online! Woohoo!")
});

client.on("guildMemberAdd", (member, message) => {
  const welcome_channel_id = require("./config.json");
  const welcomeChannel = member.guild.channels.cache.get(welcome_channel_id)
  let welcomeMsg = new Discord.MessageEmbed()
  .setTitle(`A member just joined!`)
  .setDescription(`Welcome ${member.tag}! I already started the verification process on your dm's!.`)
  .setColor("RANDOM")
  welcomeChannel.send(welcomeMsg)
  let captcha = new Captcha()
  const attachment = new Discord.MessageAttachment(captcha.PNGStream, "captcha.png")
  let verificationMsg = new Discord.MessageEmbed()
  .setTitle(`Human verification required!`)
  .setDescription(`Hello there! I'm here to inform you that you need to verify yourself to gain access to the server. Please type in the captcha shown below (Case sensitive, upper-case only). This message will self-destruct within **1 minute**. If you still can't solve the captcha within the amount of time given, **please re-join the server!**`)
  .attachFiles(attachment)
  .setImage(`attachment://captcha.png`)
  .setColor("RED")
  member.send(verificationMsg)
  member.createDM().then(dmchannel => {
    const collector = new Discord.MessageCollector(dmchannel, m => m.member.id === m.member.id, { time: 60000 });
    collector.on("collect", m => {
      if(m.content === captcha.value) {
        let successMsg = new Discord.MessageEmbed()
        .setTitle(`✅`)
        .setDescription(`You have successfully completed the verification process! You can now gain access to the server.`)
        .setColor("GREEN")
        member.send(successMsg)
        const verified_role_id = require("./config.json")
        let verifiedRole = message.guild.roles.cache.find(r => r.id === verified_role_id)
        member.roles.add(verifiedRole)
      }
    });
  });
});

const { keep_alive } = require("./keep_alive")
const token = process.env["token"]
client.login(token)
