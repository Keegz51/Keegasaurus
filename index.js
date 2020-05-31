const {Client} = require('discord.js');
const bot = new Client();

const GuildModel = require('./models/Guild');
const {connect} = require('mongoose');
var version = "1.0.1";

const prefix = '^';

bot.on('ready', ()=>{
         console.log('This bot is online!')
     });

bot.on('message', async (msg)=>{
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {

        case 'create':
            console.log("Got here");
            const doc= new GuildModel({id: msg.guild.id, demerits: 0});
            await doc.save;
            msg.channel.send("Created document");

        break;

        case 'demerit':

            if(args[1].length<=0)
            {
                msg.channel.send("Could not execute command, please indicate who you want to demerit");
            }
            else
            {
                const doc = await GuildModel.findOneAndUpdate({id: msg.guild.id}, {$set: {demerits: (Number)(demerits+5)}},{new: true});
                return msg.channel.send(doc.id +'s demerits have been updated to  ' +doc.demerits);
            }

        break;

        case 'ping':
            msg.channel.send('pong!');
            break;

        case 'info':
            if(args[1] === 'version')
            {
                msg.channel.send(version);
            }
            else
            {
                msg.channel.send("Invalid command");
            }
            break;

            case 'embed':
                let member = msg.mentions.members.first() || msg.member, user = member.user;

                const embed = new Discord.MessageEmbed()
                .setTitle('Trainer Information')
                .addField('Trainer Name', msg.author.username);
                msg.channel.send(embed);
                break;

            case 'send':
                try
                {
                    const attachments = new MessageAttachment(args[1]);
                    const fs = require("fs"); // Or `import fs from "fs";` with ESM
                    if (fs.existsSync(args[1])) 
                    {
                        msg.channel.send(msg.author, attachments);
                    }
                    else
                    {
                        msg.channel.send("Could not execute command");
                    }
                
                }
                catch(err)
                {

                    msg.channel.send("Could not execute command");

                }
                break;

    }
});

(async()=>{
    await connect('mongodb://localhost/mongodb-demo', {
        useNewUrlParser:true,
        useFindAndModify:false
    });
    return bot.login(process.env.token);
})()

/* #region Main 
// bot.on('ready', ()=>{
//     console.log('This bot is online!')
// })
Old switch statement
bot.on('message', async (msg)=>{
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {
        case 'ping':
            msg.channel.send('pong!');
            break;

        case 'info':
            if(args[1] === 'version')
            {
                msg.channel.send(version);
            }
            else
            {
                msg.channel.send("Invalid command");
            }
            break;

            case 'embed':
                let member = msg.mentions.members.first() || msg.member, user = member.user;

                const embed = new Discord.MessageEmbed()
                .setTitle('Trainer Information')
                .addField('Trainer Name', msg.author.username);
                msg.channel.send(embed);
                break;

            case 'send':
                try
                {
                    const attachments = new MessageAttachment(args[1]);
                    const fs = require("fs"); // Or `import fs from "fs";` with ESM
                    if (fs.existsSync(args[1])) 
                    {
                        msg.channel.send(msg.author, attachments);
                    }
                    else
                    {
                        msg.channel.send("Could not execute command");
                    }
                
                }
                catch(err)
                {

                    msg.channel.send("Could not execute command");

                }
                break;

            case 'create':

                const doc= new GuildModel({id: msg.guild.id, demerits: 0});
                await doc.save;
                msg.reply("Created document");

            break;

            case 'demerit':

                if(args[1].length<=0)
                {
                    msg.channel.send("Could not execute command, please indicate who you want to demerit");
                }
                else
                {
                    const doc = await GuildModel.findOneAndUpdate({id: msg.guild.id}, {$set: {demerits: demerits+5}},{new: true});
                    return msg.reply(doc.id +'s demerits have been updated to  ' +doc.demerits);
                }

            break;

    }
})
/* #endregion */
