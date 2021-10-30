module.exports = {
    varkOptions: {
        reply_markup: {
            inline_keyboard: [
                [
                {
                    text: 'Візуальний канал',
                    callback_data: 'visual'
                }
                ],
                [
                {
                    text: 'Аудіальний канал',
                    callback_data: 'audio'
                }
                ],
                [
                {
                    text: 'Вербальний канал',
                    callback_data: 'verbal'
                }
                ],
                [
                {
                    text: 'Кінестетичний канал',
                    callback_data: 'video'
                }
                ]
        ]
        }
    },
    timeIntervalOptions: {
        reply_markup: {
            inline_keyboard: [
                [
                {
                    text: '10 година',
                    callback_data: '10год'
                }
                ],
                [
                {
                    text: '15 година',
                    callback_data: '15год'
                }
                ],
                [
                {
                    text: '18 година',
                    callback_data: '18год'
                }
                ]
        ]
        }
    },
    
}