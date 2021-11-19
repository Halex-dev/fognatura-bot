const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const { MessageButton, MessageActionRow, MessageEmbed} = require(`discord.js`);
const PlayerMap = new Map();

module.exports = (client) => {
  try {
    client.distube
      .on(`playSong`, async (queue, track) => {
        try {
          client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        } catch (error) {
          console.log(error)
        }
        try {
          var newQueue = client.distube.getQueue(queue.id)
          var newTrack = track;
          var data = songDashboard(newQueue, newTrack)

          let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
            PlayerMap.set(`currentmsg`, msg.id);
            return msg;
          })
          //create a collector for the thinggy
          var collector = currentSongPlayMsg.createMessageComponentCollector({
            filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
            time: track.duration > 0 ? track.duration * 1000 : 600000
          }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          let lastEdited = false;

          /**
           * @INFORMATION - EDIT THE SONG MESSAGE EVERY 10 SECONDS!
           */
          try{clearInterval(songEditInterval)}catch(e){}
          songEditInterval = setInterval(async () => {
            if (!lastEdited) {
              try{
                var newQueue = client.distube.getQueue(queue.id)
                var newTrack = newQueue.songs[0];
                var data = songDashboard(newQueue, newTrack)
                await currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }catch (e){
                clearInterval(songEditInterval)
              }
            }
          }, 10000)

          collector.on('collect', async i => {
            lastEdited = true;
            setTimeout(() => {
              lastEdited = false
            }, 7000)
            //skip
            if (i.customId == `1`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //get the player instance
              const queue = client.distube.getQueue(i.guild.id);
              //if no player available return aka not playing anything
              if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                return i.reply({
                  content: `${client.allEmojis.x} Nothing Playing yet`,
                  ephemeral: true
                })
              }
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              //if ther is nothing more to skip then stop music and leave the Channel
              if (newQueue.songs.length == 0) {
                //if its on autoplay mode, then do autoplay before leaving...
                  i.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Stopped playing and left the Channel**`)
                    .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                  })
                  clearInterval(songEditInterval);
                  //edit the current song message
                  await client.distube.stop(i.guild.id)
                return
              }
              //skip the track
              await client.distube.skip(i.guild.id)
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏭ **Skipped to the next Song!**`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              })
            }
            //stop
            if (i.customId == `2`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })

              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
                //stop the track
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Stopped playing and left the Channel!**`)
                    .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
                clearInterval(songEditInterval);
                //edit the current song message
                await client.distube.stop(i.guild.id)
            }
            //pause/resume
            if (i.customId == `3`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              if (newQueue.playing) {
                await client.distube.pause(i.guild.id);
                var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏸ **Paused!**`)
                    .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(m => m.delete({timeout: 10000}))
              } else {
                //pause the player
                await client.distube.resume(i.guild.id);
                var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`▶️ **Resumed!**`)
                    .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
              }
            }
            //autoplay
            if (i.customId == `4`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              //pause the player
              await newQueue.toggleAutoplay()
              if (newQueue.autoplay) {
                var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              } else {
                var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.autoplay ? `${client.allEmojis.check_mark} **Enabled Autoplay**`: `${client.allEmojis.x} **Disabled Autoplay**`}`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(m => m.delete({timeout: 10000}))
            }
            //Shuffle
            if(i.customId == `5`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              //pause the player
              await newQueue.shuffle()
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`🔀 **Shuffled ${newQueue.songs.length} Songs!**`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(m => m.delete({timeout: 10000}))
            }
            //Songloop
            if(i.customId == `6`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 1){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(1)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.repeatMode == 1 ? `${client.allEmojis.check_mark} **Enabled Song-Loop**`: `${client.allEmojis.x} **Disabled Song-Loop**`}`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(m => m.delete({timeout: 10000}))
              var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Queueloop
            if(i.customId == `7`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 2){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(2)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.repeatMode == 2 ? `${client.allEmojis.check_mark} **Enabled Queue-Loop**`: `${client.allEmojis.x} **Disabled Queue-Loop**`}`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(m => m.delete({timeout: 10000}))
              var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Forward
            if(i.customId == `8`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              let seektime = newQueue.currentTime + 30;
              if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏩ **Forwarded the song for \`30 Seconds\`!**`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(m => m.delete({timeout: 10000}))
              var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Rewind
            if(i.customId == `9`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
              let seektime = newQueue.currentTime - 30;
              if (seektime < 0) seektime = 0;
              if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏪ **Rewinded the song for \`30 Seconds\`!**`)
                  .setFooter(`${client.allEmojis.right} Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(m => m.delete({timeout: 10000}))
              var data = songDashboard(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Lyrics
            if(i.customId == `10`){let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                })
                return i.reply({
                  content: `${client.allEmojis.x} **Lyrics are disabled!**\n> *Due to legal Reasons, Lyrics are disabled and won't work for an unknown amount of time!* :cry:`,
                  ephemeral: true
                });
              let embeds = [];
              await ksoft.lyrics.get(newQueue.songs[0].name).then(
                async track => {
                    if (!track.lyrics) return i.reply({content: `${client.allEmojis.x} **No Lyrics Found!** :cry:`, ephemeral: true});
                    lyrics = track.lyrics;
                embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
              }).catch(e=>{
                console.log(e)
                return i.reply({content: `${client.allEmojis.x} **No Lyrics Found!** :cry:\n${String(e).substr(0, 1800)}`, ephemeral: true});
              })
              i.reply({
                embeds: embeds, ephemeral: true
              })
            }
          });
        } catch (error) {
          console.error(error)
        }
      })
      .on(`addSong`, (queue, song) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter("💯 " + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.check_mark} **Song added to the Queue!**`)
          .setDescription(`👍 Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
          .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - 1} song${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
        ]
      }))
      .on(`addList`, (queue, playlist) => {
        queue.textChannel.send({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
            .setFooter("💯" + playlist.user.tag, playlist.user.displayAvatarURL({
              dynamic: true
            }))
            .setTitle(`${client.allEmojis.check_mark} **Playlist added to the Queue!**`)
            .setDescription(`👍 Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} Song${playlist.songs.length > 0 ? "s" : ""}\``)
            .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - - playlist.songs.length} song${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
            .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
          ]});
      })
      .on(`error`, (channel, e) => {
        channel.send(`An error encountered: ${e}`).catch((e)=>console.log(e))
        console.error(e)
      })

      .on(`empty`, channel => {
        channel.send(`Voice channel is empty! Leaving the channel...`).catch((e)=>console.log(e))
      })

      .on(`searchNoResult`, message => {
        message.channel.send(`No result found!`).catch((e)=>console.log(e))
      })

      .on(`finishSong`, (queue, song) => {
        var embed = new MessageEmbed().setColor(ee.color)
        .setAuthor(`${song.name}`, "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png", song.url)
        .setDescription(`See the [Queue on the **DASHBOARD** Live!](${queue.id})`)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
        .setFooter(`💯 ${song.user.tag}\n⛔️ SONG ENDED!`, song.user.displayAvatarURL({
          dynamic: true
        }));
        queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
          currentSongPlayMsg.edit({embeds: [embed], components: []}).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      })
      .on(`finish`, queue => {
        queue.textChannel.send({
          embeds: [
            new MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
            .setTitle("⛔️ LEFT THE CHANNEL")
            .setDescription(":headphones: **There are no more songs left**")
            .setTimestamp()
          ]
        })
      })
      .on(`initQueue`, queue => {
        try {
          client.settings.ensure(queue.id, {
            defaultvolume: 70,
            defaultautoplay: false,
            defaultfilters: [`bassboost6`, `clear`]
          })
          let data = client.settings.get(queue.id)
          queue.autoplay = Boolean(data.defaultautoplay);
          queue.volume = Number(data.defaultvolume);
          queue.setFilter(data.defaultfilters);
        } catch (error) {
          console.error(error)
        }
      })
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }

  function songDashboard(newQueue, newTrack) {
    var djs = client.settings.get(newQueue.id, `djroles`);
    if(!djs || !Array.isArray(djs)) djs = [];
    else djs = djs.map(r => `<@&${r}>`);
    if(djs.length == 0 ) djs = "`not setup`";
    else djs.slice(0, 15).join(", ");
    if(!newTrack) return new MessageEmbed().setColor(ee.wrongcolor).setTitle("NO SONG FOUND?!?!")
    var embed = new MessageEmbed().setColor(ee.color)
      .setDescription(`See the [Queue on the **DASHBOARD** Live!](/queue/${newQueue.id})`)
      .addField(`🙇 Requested by:`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
      .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
      .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark}\` Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}`, true)
      .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
      .addField(`:regional_indicator_f: Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
      .setAuthor(`${newTrack.name}`, `https://media1.giphy.com/media/ZILf0x9mPnELWHcmgd/giphy.gif`, newTrack.url)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
        dynamic: true
      }));

      let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Skip`)
      let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`🏠`).setLabel(`Stop`)
      let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Pause`)
      let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('🔁').setLabel(`Autoplay`)
      let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Shuffle`)

      let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Song`)
      let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Queue`)
      let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('⏩').setLabel(`+30 Sec`)
      let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-30 Sec`)
      let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('📝').setLabel(`Lyrics`).setDisabled();

    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
    }
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
 
    if (newQueue.repeatMode === 0) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 1) {
      songloop = songloop.setStyle('SECONDARY')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 2) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SECONDARY')
    }
    if (Math.floor(newQueue.currentTime) < 10) {
      rewind = rewind.setDisabled()
    } else {
      rewind = rewind.setDisabled(false)
    }
    if (Math.floor((newTrack.duration - newQueue.currentTime)) <= 10) {
      forward = forward.setDisabled()
    } else {
      forward = forward.setDisabled(false)
    }

    const row = new MessageActionRow().addComponents([rewind, stop, pause, forward, skip]);
    const row2 = new MessageActionRow().addComponents([lyrics, autoplay, shuffle, songloop, queueloop]);

    return {
      embeds: [embed],
      components: [row, row2]
    };
  }
};