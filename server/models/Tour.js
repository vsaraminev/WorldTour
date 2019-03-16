const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let tourSchema = new mongoose.Schema({
    title: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE, unique: [true, 'Tour already exists.'] },
    country: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE },
    description: { type: mongoose.Schema.Types.String },
    price: { type: mongoose.Schema.Types.Number, required: REQUIRED_VALIDATION_MESSAGE },
    image: { type: mongoose.Schema.Types.String, required: REQUIRED_VALIDATION_MESSAGE },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
    likes: [{ type: mongoose.Schema.Types.String }],
    reviews: []
})

let Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;

module.exports.seedTours = () => {
    Tour.find({}).then(tours => {
        if (tours.length > 0) return

        const toursSeed = [
            {
                title: 'Морска почивка в Чешме!',
                country: 'Турция',
                createdBy: '5c86a9be1f731405acfd60e8',
                description: 'Pepperoni is an American variety of salami, made from cured pork and beef mixed together and seasoned with paprika or other chili pepper.',
                price: 9.90,
                image: 'https://imgrabo.com/pics/companies/69d977f2aca771a3f93bdf2cee8bb452.jpeg',
                likes: [],
                reviews: []
            },
            {
                title: 'Уикенд екскурзия до Паралия Катерини и Солун',
                country: 'Гърция',
                createdBy: '5c86a9be1f731405acfd60e8',
                description: 'Pepperoni is an American variety of salami, made from cured pork and beef mixed together and seasoned with paprika or other chili pepper.',
                price: 9.90,
                image: 'https://imgrabo.com/pics/companies/d74c4b1608bc72a09c364c96f130d8bb.jpeg',
                likes: [],
                reviews: []
            }
        ]

        Tour
            .create(toursSeed)
            .then(() => console.log('Seeded tours successfully.'))
            .catch((error) => console.log(error))
    })
}