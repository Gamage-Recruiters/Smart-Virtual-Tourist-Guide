import { useParams } from "react-router-dom";

import TripCoverPagePDF from "../components/TripCoverPagePDF";
import TripItineraryPDF from "../components/TripItineraryPDF";
import FinancialSummaryPDF from "../components/FinancialSummaryPDF";
import ServiceProvidersPDF from "../components/ServiceProvidersPDF";
import HealthSafetyLogPDF from "../components/HealthSafetyLogPDF";
import RateExperiencePDF from "../components/RateExperiencePDF";


const FinalTripReportPDF = ({ touristId: propTouristId, tripId: propTripId }) => {

  const { touristId: urlTouristId, tripId: urlTripId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);

  const tId = propTouristId || urlTouristId || searchParams.get('touristId');
  const trId = propTripId || urlTripId || searchParams.get('tripId');

  return (
    <div className="print-container">
      {/* Section 01 */}
      <TripCoverPagePDF touristId={tId} tripId={trId} />

      {/* Section 02 */}
      <TripItineraryPDF touristId={tId} tripId={trId} />

      {/* Section 03 */}
      <FinancialSummaryPDF />

      {/* Section 04 */}
      <ServiceProvidersPDF />

      {/* Section 05 */}
      <HealthSafetyLogPDF />

      {/* Section 06 */}
      <RateExperiencePDF touristId={tId} tripId={trId} />
    </div>
  );
}

export default FinalTripReportPDF;