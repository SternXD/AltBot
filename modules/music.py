import discord
import wavelink
from discord import app_commands
from discord.ext.commands import Bot, Cog


class Music(Cog):
    def __init__(self, client: Bot):
        self.client = client

        client.loop.create_task(self.connect_nodes())

    async def connect_nodes(self):
        await self.client.wait_until_ready()

        await wavelink.NodePool.create_node(bot=self.client,
                                            host="0.0.0.0",
                                            port=2333,
                                            password="TwiNkie45?!")

    @Cog.listener()
    async def on_wavelink_node_ready(self, node: wavelink.Node):
        print(f"Node: <{node.identifier}> is ready!")

    @app_commands.command(name="play", description="Play song through the bot.")
    async def play(self, interaction: discord.Interaction, query: str):
        if interaction.user.voice is None:
            return await interaction.response.send_message("You aren't in a voice channel!", ephemeral=True)
        if not interaction.guild.voice_client:
            vc: wavelink.Player = await interaction.user.voice.channel.connect(cls=wavelink.Player)
        else:
            vc: wavelink.Player = interaction.guild.voice_client

        track: wavelink.YouTubeTrack = await wavelink.YouTubeTrack.search(query, return_first=True)

        if vc.queue.is_empty and not vc.is_playing():
            await vc.play(track)
            await interaction.response.send_message(f"**Now playing!** `{track.title}`", ephemeral=True)
        else:
            await vc.queue.put_wait(track)
            await interaction.response.send_message(f"Added `{track.title}` to the queue...", ephemeral=True)

async def setup(client: Bot):
    await client.add_cog(Music(client))

