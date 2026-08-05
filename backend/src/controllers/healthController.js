// controllers/healthController.js
import User from '../models/User.js';
import Incident from '../models/incident.js';

// Get verified vaccinations for a tourist
export const getVaccinations = async (req, res, next) => {
  try {
    const { touristId } = req.params;

    if (!touristId) {
      return res.status(400).json({ 
        success: false, 
        message: "touristId is required in route parameters" 
      });
    }

    const user = await User.findById(touristId, 'healthInfo updatedAt');
    if (!user) {
      return res.status(404).json({ success: false, message: "Tourist profile not found" });
    }

    const { healthInfo, updatedAt } = user;
    const verifiedVaccines = [];

    if (healthInfo) {
      
      const healthData = healthInfo.toObject ? healthInfo.toObject() : healthInfo;

      for (const key in healthData) {

        if (key === 'bloodType' || key === 'medicalCondition' || key === '_id') {
          continue;
        }

        const vaccineObj = healthData[key];

        if (vaccineObj && typeof vaccineObj === 'object' && vaccineObj.status === 'Vaccinated' || vaccineObj.status === 'Exempt') {

          let readableName = key
            .replace(/([A-Z])/g, ' $1') 
            .replace(/^./, (str) => str.toUpperCase()); 

          if (key === 'covid19') readableName = 'COVID-19'; 

          verifiedVaccines.push({
            name: readableName,
            status: vaccineObj.status, 
            fileUrl: vaccineObj.fileUrl || ""
          });
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      vaccinations: verifiedVaccines 
    });

  } catch (error) {
    next(error);
  }
};

// get Incident count for a tourist
export const getIncidentCount = async (req, res, next) => {
  try {
    const { touristId } = req.params;

    if (!touristId) {
      return res.status(400).json({ 
        success: false, 
        message: "touristId is required in route parameters" 
      });
    }

    const count = await Incident.countDocuments({ touristId });
    
    res.status(200).json({ success: true, count });
  } catch (error) {
    logger.error('Error fetching incident count:', error);
    next(error);
  }
};

// get medical info for a final trip report PDF
export const getMedicalInfo = async (req, res) => {
    try {
        const { touristId } = req.params;
        const user = await User.findById(touristId, 'healthInfo');

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const v = user.healthInfo;
        const allVaccinated = (v.covid19?.status === 'Vaccinated' && 
                               v.hepatitisA?.status === 'Vaccinated' && 
                               v.typhoid?.status === 'Vaccinated');

        const incidentCount = await Incident.countDocuments({ touristId: touristId });


        const medicalData = {
            preTripCheckup: true, 
            bloodType: user.healthInfo?.bloodType || "Not provided",
            allVaccinationsUpToDate: allVaccinated,
            incidentCount: incidentCount
        };

        res.status(200).json({ success: true, data: medicalData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
