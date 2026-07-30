import connectTestDB from '../configs/testDb.js';
import roomSchema from '../models/room.model.js';
import specialPackageSchema from '../models/specialPackage.model.js';

const getRoomModel = async () => {
  const conn = await connectTestDB();
  return conn.models.Room || conn.model('Room', roomSchema.schema);
};

const getPackageModel = async () => {
  const conn = await connectTestDB();
  return conn.models.SpecialPackage || conn.model('SpecialPackage', specialPackageSchema.schema);
};

export const getReservationData = async (req, res) => {
  try {
    const RoomModel = await getRoomModel();
    const PackageModel = await getPackageModel();

    const [rooms, packages] = await Promise.all([
      RoomModel.find().sort({ createdAt: -1 }).lean(),
      PackageModel.find().sort({ createdAt: -1 }).lean(),
    ]);

    return res.status(200).json({
      success: true,
      rooms,
      packages,
    });
  } catch (error) {
    console.error('getReservationData error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
