import { useState } from 'react'
import DestinationSection from './components/touristDashboard/DiscoverSection'
import DailyItinerary from './components/tripPlanning/DailyItinerary'
import DestinationHighlights from './components/tripPlanning/DestinationHighlights'
import TripItinerary from './components/TripItinerary'

function App() {
  const [itinerary, setItinerary] = useState(null)

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <TripItinerary itineraryId="6a2a3044cc161c9a51ffb170" />
      <br />
      <DestinationSection setItinerary={setItinerary} />
      <br />
      <DailyItinerary itinerary={itinerary} />
      <br />
      <DestinationHighlights />
    </div>
  )
}

export default App