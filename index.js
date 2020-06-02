const {Client} = require('discord.js');
const bot = new Client();

const GuildModel = require('./models/Guild');
const {connect} = require('mongoose');
var version = "1.0.1";

const prefix = '^';

const mysql= require("mysql");

/* #region db
var connnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"kdb"
}); /* #endregion */

connect.connect(err=>{
    if(err) throw err;
    console.log("Connected to database");
})

bot.on('ready', ()=>{
         console.log('This bot is online!')
     });

bot.on('message', (msg)=>{
    let args = msg.content.substring(prefix.length).split(" ");

    switch(args[0])
    {
        case 'ping':
            msg.channel.send('pong!');
            break;

        case 'HelloThere':

            msg.channel.send("General Kenobi");
            break;

        case 'ChittyChittyBangBang':

            msg.channel.send("You're broken!")
            break;

        case 'tag':

            const taggedUser = msg.mentions.users.first();
            msg.channel.send("You tagged:" +taggedUser.username);
            break;

        case "You're":

            if(args[1]==="breathtaking")
            {
                msg.channel.send(msg.author.username +" No, you're breathtaking!");
            }

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
bot.login(process.env.token);

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
