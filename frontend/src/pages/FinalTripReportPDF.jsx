import TripCoverPagePDF from "../components/TripCoverPagePDF";
import TripItineraryPDF from "../components/TripItineraryPDF";
import FinancialSummaryPDF from "../components/FinancialSummaryPDF";
import ServiceProvidersPDF from "../components/ServiceProvidersPDF";
import HealthSafetyLogPDF from "../components/HealthSafetyLogPDF";
import RateExperiencePDF from "../components/RateExperiencePDF";


const FinalTripReportPDF = ({ touristId, tripId }) => {

  return (
    <>
      {/* Section 01 */}
      <TripCoverPagePDF touristId={touristId} tripId={tripId} />

      {/* Section 02 */}
      <TripItineraryPDF touristId={touristId} tripId={tripId} />

      {/* Section 03 */}
      <FinancialSummaryPDF />

      {/* Section 04 */}
      <ServiceProvidersPDF />

      {/* Section 05 */}
      <HealthSafetyLogPDF />

      {/* Section 06 */}
      <RateExperiencePDF />
    </>
  );
}

export default FinalTripReportPDF;