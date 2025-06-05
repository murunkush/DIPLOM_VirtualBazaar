const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb+srv://munkhbaatarmurun:qenS49JgPOJytCKi@virtual-bazaar.pwbqt.mongodb.net/?retryWrites=true&w=majority&appName=virtual-bazaar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const makeAdmin = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Хэрэглэгч олдсонгүй!');
            return;
        }
        user.role = 'admin';
        await user.save();
        console.log(`${email} амжилттай админ боллоо!`);
    } catch (error) {
        console.error('Алдаа:', error);
    } finally {
        mongoose.connection.close();
    }
};

makeAdmin('ADMINN@gmail.com'); // Энд өөрийн хүссэн хэрэглэгчийн email-ийг бичнэ
