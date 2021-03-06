import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Cristi',
            email: 'cristian.pirvuletu00@e-uvt.ro',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
        },
        {
            name: 'John',
            email: 'user@example.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: false,
        },
    ],
    products:[
        {
            name:'Sorento',
            category:'Vargate',
            image:'/images/p1.jpg',
            price:1,
            countInStock: 10,
            brand:'Hortitom',
            rating:4.5,
            numReviews:10,
            description: 'calitate medie',
        },
        {
            name:'Huelva',
            category:'Negre',
            image:'/images/p2.jpg',
            price:2,
            countInStock: 15,
            brand:'Marcoser',
            rating:4.5,
            numReviews:16,
            description: 'calitate superioara',
        },
        {
            name:'Pata neagra',
            category:'Negre',
            image:'/images/p3.jpg',
            price:1.2,
            countInStock: 10,
            brand:'Hortitom',
            rating:4.5,
            numReviews:8,
            description: 'calitate medie',
        },
        {
            name:'Topgun',
            category:'Vargate',
            image:'/images/p4.jpg',
            price:1.5,
            countInStock: 0,
            brand:'Hortitom',
            rating:4.5,
            numReviews:10,
            description: 'calitate medie',
        },
        {
            name:'Mirsini',
            category:'Vargate',
            image:'/images/p5.jpg',
            price:2,
            countInStock: 20,
            brand:'Hortitom',
            rating:4.5,
            numReviews:12,
            description: 'calitate superioara',
        },
        {
            name:'Fire Ball',
            category:'Negre',
            image:'/images/p6.jpg',
            price:1.6,
            countInStock: 26,
            brand:'Semplus',
            rating:4.5,
            numReviews:15,
            description: 'calitate medie',
        },

    ],
};
export default data;