const tests = [{
    arrayOptions : ["невірно", "невірно", "вірно", "невірно"],
    question : "Тестове питання",
    opts : {
        'correct_option_id': 2,
        'type': 'quiz',
        'is_anonymous': false,
        'allows_multiple_answers': true,
        }
},
{
    arrayOptions : ["невірно", "вірно", "невірно", "невірно"],
    question : "Тестове питання2",
    opts : {
        'correct_option_id': 1,
        'type': 'quiz',
        'is_anonymous': false,
        'allows_multiple_answers': true,
        }
},
{
    arrayOptions : ["невірно", "невірно", "невірно", "вірно"],
    question : "Тестове питання3",
    opts : {
        'correct_option_id': 3,
        'type': 'quiz',
        'is_anonymous': false,
        'allows_multiple_answers': true,
        }
},
{
    arrayOptions : ["вірно", "невірно", "невірно", "невірно"],
    question : "Тестове питання4",
    opts : {
        'correct_option_id': 0,
        'type': 'quiz',
        'is_anonymous': false,
        'allows_multiple_answers': true,
        }
}]

module.exports = {
    courseStructure: {
        'Math': [
            {
                'Topic_1': [
                    {
                        'Lecture_1': {
                            'visual': 'https://il.kubg.edu.ua',
                            'verbal': 'https://ij.kubg.edu.ua',
                            'audio': 'https://if.kubg.edu.ua',
                            'video': 'https://iff.kubg.edu.ua',
                        },
                        'Tests_1': tests,
                    },
                ]
            },
        ]
    },
}


