import { FiMapPin } from 'react-icons/fi'
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
    <article className="grid border border-black bg-white shadow-md md:grid-cols-[150px_1fr_275px]">
      <div className="p-3">
        <img
          src={displayImage}
          alt={category}
          className="h-20 w-full border border-slate-200 object-cover"
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
          <div className="h-[74px] w-[134px] overflow-hidden border border-slate-200">
            <MapContainer
              latitude={location.lat}
              longitude={location.lng}
              zoom={12}
              minHeight="100%"
              className="!rounded-none !shadow-none"
              interactive={false}
              showControls={false}
              markers={[{ lat: location.lat, lng: location.lng, color: 'red' }]}
            />
          </div>
        ) : (
          <div className="flex h-[74px] w-[134px] items-center justify-center bg-[#bde3f4] border border-slate-200">
            <FiMapPin className="text-red-600" size={20} />
          </div>
        )}
      </div>
    </article>
  )
}

function formatDate(value) {
  if (!value) return 'Date not listed'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}
