const { SlashCommandBuilder } = require("@discordjs/builders");
const webshot = require("node-webshot");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("applestatus")
    .setDescription("Sends a screenshot of Apple services statuses."),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: true });
        webshot("https://www.apple.com/support/systemstatus/", "status.jpeg", { screenSize: { width: 1920, height: 1080 }, shotSize: { width: 992, height: 940 }, shotOffset: { left: 462, top: 96 } }, function () {
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