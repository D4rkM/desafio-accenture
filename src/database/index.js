import mongoose from 'mongoose';

import '../bootstrap';

export default mongoose.connect(
    `${process.env.MONGO_URI}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    error => {
        if (error) {
            console.log('Error while connecting to the database:');
            throw error;
        }
        console.log(`Connection to '${process.env.MONGO_URI}' made succesfuly`);
    }
);
