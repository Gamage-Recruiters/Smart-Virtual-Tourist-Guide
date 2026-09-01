import { FiMapPin } from 'react-icons/fi'
import { formatDate } from '../../utils/safety/dateUtils'
import incidentImage from '../../assets/safety/Nine-Arches-Bridge 1.png'
import MapContainer from './MapContainer'

export default function IncidentCard({ incident }) {
  const category = incident.incidentCategory || incident.category || incident.type || 'Incident'
  const date = incident.incidentDate || incident.date || formatDate(incident.createdAt)
  const time = incident.incidentTime || incident.time || ''
  const district = incident.district || 'District not listed'
  const location = incident.location || {}

  const displayImage = incident.images && incident.images.length > 0 
    ? incident.images[0] 
    : incident.image || incidentImage

  return (
    <article className="grid grid-cols-1 border border-black bg-white shadow-md md:grid-cols-[150px_1fr_275px]">
      <div className="p-3">
        <img
          src={displayImage}
          alt={category}
          className="h-32 w-full border border-slate-200 object-cover md:h-20"
        />
      </div>

      <div className="flex h-full flex-col justify-between px-2 py-3 text-sm text-black">
        <p>
          <span className="font-extrabold">Incident Type:</span> {category}
        </p>
        <p>
          <span className="font-extrabold">Date &amp; Time:</span> {date}{time ? `, ${time}` : ''}
        </p>
        <p>
          <span className="font-extrabold">District:</span> {district}
        </p>
      </div>

      <div className="px-4 py-2">
        <p className="mb-2 text-sm font-extrabold text-black">Location Map</p>
        {location.lat && location.lng ? (
          <div className="h-[100px] w-full overflow-hidden border border-slate-200 md:h-[74px] md:w-[134px]">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={12}
              minHeight="100%"
              className="!rounded-none !shadow-none"
              interactive={false}
              showControls={false}
              markers={[{ lat: location.lat, lng: location.lng, color: 'red' }]}
            />
          </div>
        ) : (
          <div className="flex h-[100px] w-full items-center justify-center bg-[#bde3f4] border border-slate-200 md:h-[74px] md:w-[134px]">
            <FiMapPin className="text-red-600" size={20} />
          </div>
        )}
      </div>
    </article>
  )
}


