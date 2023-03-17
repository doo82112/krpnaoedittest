const Xmldata = require('../models/Xmldata');

module.exports.create = async (req, res) => {
    try {
        const { panoId, krpanoxml } = req.body;

        const xmldata = new Xmldata({ panoId, krpanoxml });

        await xmldata.save();

        return res.send(xmldata);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.find = async (req, res) => {
    try {
        const { panoId } = req.params;

        if (panoId) {
            const xmldata = await Xmldata.findOne({ panoId });

            if (!xmldata) {
                return res.send('xmldata not found');
                //return res.send('xmldata not found');
            } else {
                return res.send(xmldata);
            }
        }

        const xmldatas = await Xmldata.find({});
        return res.send(xmldatas);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.update = async (req, res) => {
    try {
        const { panoId, krpanoxml } = req.body;
        if (panoId) {
            const xmldata = await Xmldata.findOneAndUpdate({ panoId }, { panoId, krpanoxml }, { multi: true, new: true });
            if (!xmldata) {
                //return res.send('xmldata not found. cancel update');
                try {
                    const xmldata = new Xmldata({ panoId, krpanoxml });

                    await xmldata.save();

                    return res.send(xmldata);
                } catch (err) {
                    return res.status(500).send(err);
                }

            } else {
                return res.send(xmldata);
            }
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.remove = async (req, res) => {
    try {
        const { panoId } = req.params;

        const xmldata = await Xmldata.findOne({ panoId });

        if (!xmldata) {
            return res.status(404).send('xmldata not found');
        }

        await xmldata.deleteOne();
        return res.send();
    } catch (err) {
        return res.status(500).send(err);
    }
};