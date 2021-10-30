
const TelegramApi = require('node-telegram-bot-api');

const token = "2051581549:AAH-mTaHNXwjnJFL8PbHdhbK81smk3yt8xk";
// 1963414106:AAHE16MEiLHuRRdmTMVawclsj-FZUccSfiA
const bot = new TelegramApi(token, {polling: true});

const {varkOptions, timeIntervalOptions} = require('./options');
const {courseStructure} = require('./courses');
const schedule = require('node-schedule');

const UserData = [];
const testPath = courseStructure.Math[0]['Topic_1'][0].Tests_1;

const testButton = {reply_markup: {
    inline_keyboard: [
        [
        {
            text: 'Почати тестування',
            callback_data: 'begintest'
        }
        ]
]
}};

const eduTypes = {
    'visual' : 'візуальний',
    'audio' : 'аудіальний',
    'verbal' : 'вербальний',
    'video' : 'кінестетичний',
};


const sendTime = async (time, msg, text)=> {
    new schedule.scheduleJob({rule: `0 0 ${time} * * *` }, async function () {
        const userId = msg.from.id;
        
        //console.log(courseStructure.Math[0]['Topic 1'][0].Tests_1);
        UserData[userId].testsRemaining= testPath.length;             
        UserData[userId].correctAnswers=0;
        
        await bot.sendMessage(UserData[userId].chatId, text, testButton);
              
    });
}


    

// const startGame = async (chatId) => {
//     await bot.sendMessage(chatId, `Now i will guess the number from 0 to 9 and you will have to guess it`);
//     const random = Math.floor(Math.random() * 10);
//     UserData[chatId] = random;
//     await bot.sendMessage(chatId, 'Guess it!', gameOptions);
// }

const start = () => {
    bot.setMyCommands([
        {command:'/start', description: 'Запуск телеграм каналу'},
        {command:'/info', description:'Відкрити вікно з інформацією'},
        //{command:'/game', description:'game of guess a random number from 0 to 9'},
        {command:'/edutype', description:'Змінити тип сприймання інформації'},
        {command:'/taskinterval', description:'Змінити часовий інтервал'},
              
    ])

const setEduType = async (type, chatId, userId) => {
    UserData[userId].eduType = `${type}`;            
    await bot.sendMessage(chatId, `Обрано ${eduTypes[`${type}`]} тип срийняття.`);
    if(UserData[userId].timeInterval!=undefined){
        return 0;
    }
    else{
        return bot.sendMessage(chatId, 'Також необхідно одразу обрати проміжок отримання навчальних матеріалів та завдань', timeIntervalOptions);
    }
}

    bot.on('poll_answer', async poll=>{

        if(poll.option_ids == testPath[UserData[poll.user.id].testsRemaining-1].opts.correct_option_id){
            UserData[poll.user.id].correctAnswers+=1;
        }  

        UserData[poll.user.id].testsRemaining-=1;
        let index = UserData[poll.user.id].testsRemaining-1;

        if(UserData[poll.user.id].testsRemaining>0){            
            return bot.sendPoll(UserData[poll.user.id].chatId, 
                testPath[index].question, 
                testPath[index].arrayOptions, 
                testPath[index].opts)
        }  
        else{
            let buffer = eduTypes;
            let asArray = Object.entries(buffer);
            let filtered = asArray.filter(([key, value]) => key  !== `${UserData[poll.user.id].eduType}`);
            let lectureTypesOptions = {
                reply_markup: {
                    inline_keyboard: [
                        [
                        {
                            text: `${filtered[0][1]}`,
                            callback_data: `lecture_${filtered[0][0]}`
                        }
                        ],
                        [
                        {
                            text: `${filtered[1][1]}`,
                            callback_data: `lecture_${filtered[1][0]}`
                        }
                        ],
                        [
                        {
                            text: `${filtered[2][1]}`,
                            callback_data: `lecture_${filtered[2][0]}`
                        }
                        ]
                ]
                }
            };
            bot.sendMessage(UserData[poll.user.id].chatId, `Кількість вірних відповідей: ${UserData[poll.user.id].correctAnswers} з ${testPath.length}`)
            if(UserData[poll.user.id].correctAnswers <= (testPath.length/2)){
                bot.sendMessage(UserData[poll.user.id].chatId, `Спробуйте лекційний матеріал іншого типу сприйняття інформації`, lectureTypesOptions)

            }
        }      
        return 0;
    })

    bot.on('message', async msg=>{

        const text = msg.text;
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        if(text === '/start'){

            UserData[userId] = {
                correctAnswers:0,
                chatId: chatId,
                testsRemaining:0,
                eduType: undefined,
                timeInterval: undefined,                
            };

            //await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b50/063/b5006369-8faa-44d7-9f02-1ca97d82cd49/192/20.webp');          
            await bot.sendMessage(chatId, 'Ласкаво просимо до телеграм-боту адаптивного навчання');
            
            if(UserData[userId].eduType === undefined){
                await bot.sendMessage(chatId, 'Спочатку необхідно пройти тест на тип сприймання інформації');
                await bot.sendMessage(chatId, 'Натисніть на посилання та пройдіть тест -> https://vark-learn.com/опросник-vark-опросник-по-стратегиям-обу/')
                await bot.sendMessage(chatId, 'Оберіть рекомендований тип сприйняття', varkOptions);
                return 0;    
            }
            return 0;
        }

        if(text === '/info'){
  
            if(UserData[chatId] !== undefined){
                return bot.sendMessage(chatId, `Обраний тип сприймання інформації: ${UserData[chatId].eduType}`)
            }
            return 0;
        }
        
        // if(text === '/game'){
        //    return startGame(chatId);
        // }

        if(text === '/edutype'){
            return await bot.sendMessage(chatId, 'Зміна типу сприйняття', varkOptions);
        }

        if(text === '/taskinterval'){
            return bot.sendMessage(chatId, 'Оберіть проміжок отрмання інформації', timeIntervalOptions);
        } 

        return bot.sendMessage(chatId, "Я вас не розумію");
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const userId = msg.from.id;
        const chatId = UserData[userId].chatId;
        const path = courseStructure.Math[0]['Topic_1'][0]['Lecture_1'][`${UserData[userId].eduType}`];
        if(data === 'begintest'){
            const index = UserData[userId].testsRemaining-1;
            await bot.sendPoll(UserData[userId].chatId,
                testPath[index].question,
                testPath[index].arrayOptions,
                testPath[index].opts)
        }
        if(data === 'visual'){
            return setEduType(data, chatId, userId);
        }
        if(data === 'audio'){
            return setEduType(data, chatId, userId);
        }
        if(data === 'verbal'){
            return setEduType(data, chatId, userId);
        }
        if(data === 'video'){
            return setEduType(data, chatId, userId);
        }

        if(data === 'lecture_visual'){
            UserData[userId].testsRemaining= testPath.length;             
            UserData[userId].correctAnswers=0;
            return bot.sendMessage(chatId, `1Прочитайте лекцію -> ${courseStructure.Math[0]['Topic_1'][0]['Lecture_1']['visual']}`, testButton);
            
        }
        if(data === 'lecture_audio'){
            UserData[userId].testsRemaining= testPath.length;             
            UserData[userId].correctAnswers=0;
            return bot.sendMessage(chatId, `2Прочитайте лекцію -> ${courseStructure.Math[0]['Topic_1'][0]['Lecture_1']['audio']}`, testButton);
            
        }
        if(data === 'lecture_verbal'){
            UserData[userId].testsRemaining= testPath.length;             
            UserData[userId].correctAnswers=0;
            return bot.sendMessage(chatId, `3Прочитайте лекцію -> ${courseStructure.Math[0]['Topic_1'][0]['Lecture_1']['verbal']}`, testButton);
            
        }
        if(data === 'lecture_video'){
            UserData[userId].testsRemaining= testPath.length;             
            UserData[userId].correctAnswers=0;
            return bot.sendMessage(chatId, `4Прочитайте лекцію -> ${courseStructure.Math[0]['Topic_1'][0]['Lecture_1']['video']}`, testButton);
            
        }

        if(data === '10год'){
            // const text = 'Повідолення буде відправлене через 1сек!'
            // await sendTime((1/60), msg, text);
            // console.log(UserData[chatId].timeInterval);
            // const messageId = msg.message.message_id;
            // return bot.deleteMessage(chatId, messageId, form = {});
            UserData[userId].timeInterval=10;
            text =`Прочитайте лекцію -> ${path}`;
            // bot.sendMessage(chatId, `Прочитайте лекцію -> ${path}`);
            await sendTime(UserData[userId].timeInterval, msg, text);
            return 0;

            
        }
        if(data === '15год'){
            //const text = 'Повідолення буде відправлене через 20сек!'
            UserData[userId].timeInterval=15;
            text =`Прочитайте лекцію -> ${path}`;            
            return sendTime(UserData[userId].timeInterval, msg, text);
        }
        if(data === '18год'){
            //const text = 'Повідолення буде відправлене через 30сек!'
            UserData[userId].timeInterval=18;
            text =`Прочитайте лекцію -> ${path}`;            
            return sendTime(UserData[userId].timeInterval, msg, text);
        }
        
    })
}

start();