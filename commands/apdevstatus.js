const { SlashCommandBuilder } = require("@discordjs/builders");
const webshot = require("node-webshot");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("apdevstatus")
    .setDescription("Sends a screenshot of Apple Developer services statuses."),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: true });
        webshot("https://developer.apple.com/system-status/", "status.jpeg", { screenSize: { width: 1920, height: 1080 }, shotSize: { width: 992, height: 837 }, shotOffset: { left: 462, top: 96 } }, function () {
            interaction.editReply({ files: ["status.jpeg"] });
            setTimeout(() => {
                try {
                    fs.unlinkSync("status.jpeg");
                } catch (error) {
                    console.log(error);
                }
            }, 5000);
        });
    },
};