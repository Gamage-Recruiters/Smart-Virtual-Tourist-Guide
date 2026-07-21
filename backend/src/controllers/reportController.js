import User from '../models/User.js';
import { countries } from 'countries-list';

const getRegion = (countryName) => {
    if (!countryName) return 'Asia';

    const countryData = Object.values(countries).find(
        (c) => c.name.toLowerCase() === countryName.trim().toLowerCase()
    );

    if (countryData) {
        const continentCode = countryData.continent; // 'AS', 'EU', 'AF', 'OC', 'NA', 'SA' 

        // Middle East 
        const middleEastCountries = [
            "Egypt", "Saudi Arabia", "United Arab Emirates", "Turkey", "Israel", 
            "Iran", "Iraq", "Qatar", "Kuwait", "Jordan", "Oman", "Lebanon"
        ];
        if (middleEastCountries.includes(countryData.name)) {
            return 'Middle East & North Africa';
        }

        // Asia-Pacific
        const asiaPacificCountries = [
            "Japan", "South Korea", "China", "Taiwan", "Singapore", "Thailand", 
            "Vietnam", "Indonesia", "Malaysia", "Philippines"
        ];
        if (asiaPacificCountries.includes(countryData.name)) {
            return 'Asia-Pacific';
        }

        if (continentCode === 'OC') return 'Oceania';
        if (continentCode === 'AS') return 'Asia';
        if (continentCode === 'AF') return 'Africa';
        if (continentCode === 'EU') return 'Europe';
        if (continentCode === 'NA' || continentCode === 'SA') return 'Americas';
    }

    return 'Asia'; // Default fallback
};
 
export const getTouristArrivalStats = async (req, res) => {
    try {

        const tourists = await User.find({ role: 'tourist_user' });

        const regionsList = [
            "Asia",
            "Africa",
            "Europe",
            "Americas",
            "Oceania",
            "Asia-Pacific",
            "Middle East & North Africa"
        ];

        const colorMapping = {
            "Asia": "#0B53A4",
            "Africa": "#247BB2",
            "Europe": "#2EC4B6",
            "Americas": "#4CC9F0",
            "Oceania": "#72EFDD",
            "Asia-Pacific": "#F1C40F",
            "Middle East & North Africa": "#F39C12"
        };

        // ──────────────────────────────────
        // SECTION 1: CHART DATA (TOP VISUAL)
        // ──────────────────────────────────
        const chartCounts = {};
        regionsList.forEach(region => {
            chartCounts[region] = 0; 
        });

        tourists.forEach(tourist => {
            const region = getRegion(tourist.country);
            if (chartCounts[region] !== undefined) {
                chartCounts[region] += 1;
            }
        });

        const chartData = regionsList.map(region => {
            return {
                label: region === "Middle East & North Africa" ? "Middle East" : region,
                value: chartCounts[region],
                colorHex: colorMapping[region]
            };
        });


        // ─────────────────────────────────────
        // SECTION 2: TABLE DATA (BOTTOM VISUAL)
        // ─────────────────────────────────────
        const tableCounts = {};
        regionsList.forEach(region => {
            tableCounts[region] = {
                Male: Array(12).fill(0),
                Female: Array(12).fill(0)
            };
        });


        tourists.forEach(tourist => {
            const region = getRegion(tourist.country);
            const gender = tourist.gender || 'Male';

            if (tourist.createdAt && tableCounts[region]) {
                const monthIdx = new Date(tourist.createdAt).getMonth();
                if (tableCounts[region][gender]) {
                    tableCounts[region][gender][monthIdx] += 1;
                }
            }
        });

        const tableData = regionsList.map(region => {
            const maleMonthly = tableCounts[region].Male;
            const femaleMonthly = tableCounts[region].Female;

            const maleTotal = maleMonthly.reduce((sum, val) => sum + val, 0);
            const femaleTotal = femaleMonthly.reduce((sum, val) => sum + val, 0);

            return {
                region,
                rows: [
                    { gender: "Male", monthly: maleMonthly, total: maleTotal.toLocaleString() },
                    { gender: "Female", monthly: femaleMonthly, total: femaleTotal.toLocaleString() }
                ]
            };
        });


        return res.status(200).json({
            success: true,
            data: { chartData, tableData }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
