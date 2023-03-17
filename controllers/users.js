const User = require('../models/User');

module.exports.create = async (req, res) => {
    try {
        const { userId, password, info } = req.body;

        const user = new User({ userId, password, info });

        await user.save();

        return res.send(user);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.find = async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId) {
            const user = await User.findOne({ userId });

            if (!user) {
                return res.status(404).send('user not found');
            } else {
                return res.send(user);
            }
        }

        const users = await User.find({});
        return res.send(users);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.remove = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).send('user not found');
        }

        await user.deleteOne();
        return res.send();
    } catch (err) {
        return res.status(500).send(err);
    }
};