// controllers/adminController.js

const getAdminStats = async (req, res) => {
    try {
        res.status(200).json({ message: "Admin stats route is working properly!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error occurred", error: error.message });
    }
};

module.exports = {
    getAdminStats
};