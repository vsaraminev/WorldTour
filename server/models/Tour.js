const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let tourSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE, unique: [true, 'Tour already exists.'] },
    country: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE },
    description: { type: mongoose.Schema.Types.String },
    cost: { type: mongoose.Schema.Types.Number, required: REQUIRED_VALIDATION_MESSAGE },
    image: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    posts: [{type: mongoose.Schema.Types.String}],
})

let Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;

module.exports.seedTours = () => {
    Tour.find({}).then(tours => {
        if (tours.length > 0) return

        const toursSeed = [
            {
                title: 'Milan',
                country: 'Italy',
                createdBy: '5c86a9be1f731405acfd60e8',
                description: 'Milan is a city in northern Italy, capital of Lombardy, and the second-most populous city in Italy after Rome, with the city proper having a population of 1,372,810 while its metropolitan area has a population of 3,244,365. Its continuously built-up urban area (that stretches beyond the boundaries of the Metropolitan City of Milan) has a population estimated to be about 5,270,000 over 1,891 square kilometer’s (730 square miles). The wider Milan metropolitan area, known as Greater Milan, is a polycentric metropolitan region that extends over central Lombardy and eastern Piedmont and which counts an estimated total population of 7.5 million, making it by far the largest metropolitan area in Italy and the 54th largest in the world. Milan served as capital of the Western Roman Empire from 286 to 402 and the Duchy of Milan during the medieval period and early modern age.',
                cost: 250.95,
                image: 'https://media-cdn.tripadvisor.com/media/photo-s/02/78/a8/90/semplicemente-una-gran.jpg',
            },
            {
                title: 'Mexico City',
                country: 'Mexico',
                createdBy: '5c86a9be1f731405acfd60e8',
                description: 'Mexico City is the capital of Mexico and the most populous city in North America. Mexico City is one of the most important cultural and financial centres in the Americas. It is located in the Valley of Mexico (Valle de México), a large valley in the high plateaus in the center of Mexico, at an altitude of 2,240 meters (7,350 ft). The city has 16 boroughs. The 2009 population for the city proper was approximately 8.84 million people, with a land area of 1,485 square kilometers (573 sq mi). According to the most recent definition agreed upon by the federal and state governments, the population of Greater Mexico City is 21.3 million, which makes it the largest metropolitan area of the Western Hemisphere, the eleventh-largest agglomeration (2017), and the largest Spanish-speaking city in the world.',
                cost: 950.40,
                image: 'https://bitnovosti.com/wp-content/uploads/2017/12/1105-Does_Mexico_Have_Better_Healthcare_Than_the_United_States-1296x728-header.jpg',
            }
        ]

        Tour
            .create(toursSeed)
            .then(() => console.log('Seeded tours successfully.'))
            .catch((error) => console.log(error))
    })
}