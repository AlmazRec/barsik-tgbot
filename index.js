const TelegramApi = require("node-telegram-bot-api")
const token = "your_token"
const bot = new TelegramApi(token, {polling: true})

let click_count = 0
let click_power = 5
let click_sum = 0

const upgrades = {
    "Улучшение клика": 50,
    "Кошачий корм": 200,
}
bot.setMyCommands([
    {command: "/start", description: "Приветствие"},
    {command: "/get_barsik", description: "Получить барсяту"},
    {command: "/balance", description: "Ваши барсята"},
    {command: "/slots", description: "Игры слоты"}
])
const menuButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "🧍‍♂️Профиль🧍‍♂️", callback_data: "profile"}],
            [{text: "💵Заработать💵", callback_data: "earn"}],
            [{text: "Слоты", callback_data: "slots"}],
            [{text: "🛍️Магазин🛍️", callback_data: "shop"}]
        ]
    })
}
const shopButtons = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Улучшить силу клика X2⬆️ (100БР)", callback_data: "upgrade_click"}]
        ]
    })
}
const tapButton = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: "Получить барсяту", callback_data: "get"}],
            [{text: "Вернуться в меню", callback_data: 'menu'}]
        ]
    })
}
async function add_barsik(chatId) {
    click_count = click_count + click_power
    click_sum += 1
    await bot.sendMessage(chatId, `Вам добавилось ${click_power} барсят.\nБаланс: ${click_count}`, tapButton)
}



bot.on("message", async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start') {
        await bot.sendMessage(chatId, `Meow😺`, menuButtons)
    }
    if(text === "/get_barsik") {
        await add_barsik(chatId)
    }
    if(text === "/balance") {
        await bot.sendMessage(chatId, `Ваш баланс: ${click_count}`)
    }
})



bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if(data === "get" || data === "earn") {
        await add_barsik(chatId)
    }
    if(data === "profile") {
        await bot.sendMessage(chatId, `😺Профиль пользователя: ${msg.from.first_name}😺\n😺Кол-во барсят: ${click_count}\n👆Всего кликов: ${click_sum}`)
    }
    if(data === "menu"){
        await bot.sendMessage(chatId, "Вы вернулись в меню", menuButtons)
    }
    if(data === 'shop') {
        await bot.sendMessage(chatId, "Ассортимент магазина", shopButtons)
    }
    if (data === 'upgrade_click') {
        const upgradeCost = upgrades["Улучшение клика"];
        if (click_count >= upgradeCost) {
            click_count -= upgradeCost;
            click_power *= 2;
            await bot.sendMessage(chatId, `Вы успешно улучшили силу клика! Новая сила клика: ${click_power}`);
        } else {
            await bot.sendMessage(chatId, "У вас недостаточно барсят для покупки улучшения.");
        }
    }
})

bot.on("callback_query", async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === "slots") {
        await bot.sendMessage(chatId, "Игра пошла!")

        const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉'];
        const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
        const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

        if (slot1 === slot2 && slot2 === slot3) {
            await bot.sendMessage(chatId, `Поздравляем! Вы выиграли! ${slot1} ${slot2} ${slot3}`)
            click_count *= 2
        } else {
            await bot.sendMessage(chatId, `Увы, вы проиграли. Попробуйте еще раз. ${slot1} ${slot2} ${slot3}`)
            click_count *= 0.5
        }
    }
})
