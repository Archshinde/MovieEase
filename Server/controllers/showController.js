const { default: mongoose } = require("mongoose");
const Shows = require("../models/showModel")
const { ObjectId } = mongoose.Types;

const createNewShow = async (req, res) => {

    try {
        const newShow = new Shows(req.body);
        await newShow.save();

        return res.status(201).send({
            success: true,
            message: "New show added successfully!"
        })
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        })

    }

}

const getAllShows = async (req, res) => {

    let queryCondition = {};

    if (req.query.movieId) {
        const movieId = req.query.movieId;

        if (mongoose.Types.ObjectId.isValid(movieId)) {
            queryCondition.movie = new mongoose.Types.ObjectId(movieId);
        }
    }

    if (req.query.theatreId) {
        const theatreId = req.query.theatreId;

        if (mongoose.Types.ObjectId.isValid(theatreId)) {
            queryCondition.theatre = new mongoose.Types.ObjectId(theatreId);
        }
    }

    if (req.query.date) {
        const selectedDate = req.query.date;

        const startDate = new Date(`${selectedDate}T00:00:00.000Z`);
        const nextDate = new Date(`${selectedDate}T00:00:00.000Z`);

        nextDate.setUTCDate(nextDate.getUTCDate() + 1);

        queryCondition.date = {
            $gte: startDate,
            $lt: nextDate
        };
    }

    try {

        const allShows = await Shows.find(queryCondition)
            .populate("theatre")
            .populate("movie");

        console.log("Show Query:", queryCondition);
        console.log("Shows Found:", allShows);

        return res.status(200).send({
            success: true,
            message: "Shows fetched successfully!",
            data: allShows
        });

    } catch (err) {

        return res.status(500).send({
            success: false,
            message: err.message
        });

    }
};
const getShowById = async (req, res) => {

    try {
        const show = await Shows.findById(req.params.id).populate('theatre').populate('movie');

        return res.status(200).send({
            success: true,
            message: "Show fetched successfully!",
            data: show
        })

    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
        })

    }

}




module.exports = {
    createNewShow,
    getAllShows,
    getShowById
}