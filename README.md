# TurtleHerm
This is for my final year Project.

# How to install the discord bot?
These are the instructions on how to install the Discord RPG Bot.
# Downloading Node JS and All the packages.
1. [Download latest version of Node JS.](https://nodejs.org/en)
2. Download this repo from above as a zip.
3. Extract all the files of the zip folder from the repo.
4. Open a command prompt or the version of command prompt you have on your os. Direct it to he extracted files folder and run `npm install` to install the packages
# Getting your Discord API Key.
1. [Create a Discord Account if you havent.](https://discord.gg)
2. [Go to the Developer Settings page and create a new application.](https://discord.com/developers/applications)
3. Name your application anything you would like. Note this is going to be the bot name.
4. Agree to the terms of service.
5. On the web page look to your left and find the settings. In the settings there should be something called "Bot". Click that.![AltText](https://i.imgur.com/u5h7KOp.png)
6. Click Build A Bot.
7. Then you want to click Reset Token.
8. A Token should appear. Click Copy Token or Select the Token and click Copy.
9. Go to the extracted folder and find `app.js` file with your IDE. I suggest Visual Studio Code. 
10. Where it says `const client_key = ""` in the speech marks put in your key there.
11. Open a terminal in your IDE and do `nodemon app.js`.
If you have any concerns I suggest joining [the support discord.js server for help](https://discord.gg/djs)

# How to invite the discord bot to your server?
1. [Go to this page](https://discord.com/developers/applications/)
2. Select the Application of your bot.
3. On the Side Page Click `OAuth2`
4. Two Options should show up. `General` and `URL Generator`. Click `URL Generator`.
5. In the Scope section click bot.
6. In the bot permission click Adminsitrator.
7. In the bottom there should be a text box saying `Generated URL`. Click Copy to copy the link.
An Example of how it should look like. ![An Example of how it should look like](https://i.imgur.com/ZLyA1e8.png)
8. Go to the copied URL and Select the server you want to put it in.
9. Do the Captcha.
10. The bot should be in your Server and Running.

# How to use the application?
1. First of all you are going to need to change some configurations.
2. In the repo you downloaded. Open the file of `util/config.json`. 
3. Change the ClientID to your Bot ClientID. You can find the Client ID in discord.gg/developers/applications
4. You can find GuildID by doing Click the server icon and click Copy Server ID. (Make sure to turn on Discord Developer Mode)
5. After changin the settings. You want to deploy the commands. To Deploy the commands open a new terminal and run `node deploy.js`
6. After that go to functions.js file and change the mongoose.connect function paramter to your mongoDB url.
7. now run the `node app.js` in the terminal.
8. First of all you want to run the setup command which is where all the commands will be ran of the bot.
9. Second you want to go to settings and turn on the activator.
10. Now you want to make an account (do /start) 

