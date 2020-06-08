//const {Client} = require('discord.js');
const Discord = require('discord.js');
const bot = new Discord.Client();

const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const GuildModel = require('./models/Guild');

var version = "1.0.1";

const prefix = '^';

const mysql= require("mysql");

bot.on('ready', ()=>{
    console.log('This bot is online!')

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();

        if (!table['count(*)']) 
        {
            // If the table isn't there, create it and setup the database correctly.
            sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
            // Ensure that the "id" row is always unique and indexed.
            sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
            sql.pragma("synchronous = 1");
            sql.pragma("journal_mode = wal");

            //DB Created
        }

    // And then we have two prepared statements to get and set the score data.
    bot.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    bot.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

     });

bot.on('message', (msg)=>{
    let args = msg.content.substring(prefix.length).split(" ");

    if (msg.author.bot) return;
    let score;
    if (msg.guild) 
    {
        score = bot.getScore.get(msg.author.id, msg.guild.id);
        if (!score) 
        {

        score = { 
            id: `${msg.guild.id}-${msg.author.id}`, 
            user: msg.author.id, 
            guild: msg.guild.id, 
            points: 0, 
            level: 1 }

         }

        score.points++;
        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

        if(score.level < curLevel) 
        {
        score.level++;
        msg.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
        }

        bot.setScore.run(score);
    }

    switch(args[0])
    {

        case 'points':

            msg.reply(`You currently have ${score.points} points and are level ${score.level}!`)
            break;

        case 'give' :

             // Limited to guild owner - adjust to your own preference!
            if(!msg.author.id === msg.guild.owner) return msg.reply("You're not the boss of me, you can't do that!");

            const user = msg.mentions.users.first() || bot.users.get(args[0]);
            if(!user) return msg.reply("You must mention someone or give their ID!");

            //const pointsToAdd = parseInt(args[1], 10);

            const pointsToAdd = parseInt(Math.ceil(Math.random() * 10));

            if(!pointsToAdd) return msg.reply("Wow, you've given 0 demerits. The chances of that happening are 1 in 1.09^59")

            // Get their current points.
            let userscore = bot.getScore.get(user.id, msg.guild.id);
            // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
            let userLevel =0;
            if (!userscore) {
                userscore = { 
                    id: `${msg.guild.id}-${user.id}`, 
                    user: user.id, guild: msg.guild.id, 
                    points: 0, 
                    level: 1 }
                userLevel=userscore.level;
            }
            userscore.points += pointsToAdd;

            // We also want to update their level (but we won't notify them if it changes)
            userLevel = Math.floor(0.1 * Math.sqrt(score.points));
            userscore.level = userLevel;

            // And we save it!
            bot.setScore.run(userscore);

            return msg.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
            break;

            //Override-give - 3
            case 'override-give' :

                // Limited to guild owner - adjust to your own preference!
               if(!msg.author.id === '426697019558461442') return msg.reply("You're not the boss of me, you can't do that! Don't tell me what to do!");
   
               const user3 = msg.mentions.users.first() || bot.users.get(args[0]);
               if(!user3) return msg.reply("You must mention someone or give their ID!");
   
               const pointsToAdd3 = parseInt(args[1], 10);
   
               if(!pointsToAdd3) return msg.reply("You didn't tell me how many points to give...")
   
               // Get their current points.
               let userscore3 = bot.getScore.get(user3.id, msg.guild.id);
               // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
               if (!userscore3) {
                   userscore3 = { 
                       id: `${msg.guild.id}-${user3.id}`, 
                       user: user3.id, guild: msg.guild.id, 
                       points: 0, 
                       level: 1 }
               }
               userscore3.points += pointsToAdd3;
   
               // We also want to update their level (but we won't notify them if it changes)
               let userLevel3 = Math.floor(0.1 * Math.sqrt(score.points));
               userscore3.level = userLevel3;
   
               // And we save it!
               bot.setScore.run(userscore3);
   
               return msg.channel.send(`${user3.tag} has received ${pointsToAdd3} points and now stands at ${userscore3.points} points.`);
               break;
        
        case 'leaderboard' :

            const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(msg.guild.id);

            // Now shake it and show it! (as a nice embed, too!)
            const embed = new Discord.MessageEmbed()
                .setTitle("Leaderboard")
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setDescription("Our top 10 points leaders!")
                .setColor(0x00AE86);

            for(const data of top10) 
            {
                embed.addField
                (
                    //trace
                    bot.users.cache.get(data.user).username,
                    `${data.points} points (level ${data.level})`
                    
                )
            ;}

            return msg.channel.send({embed});
            break;

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
                let member = msg.mentions.members.first() || msg.member, user1 = member.user;

                const embed2 = new Discord.MessageEmbed()
                .setTitle('Trainer Information')
                .addField('Trainer Name', msg.author.username);
                msg.channel.send(embed2);
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