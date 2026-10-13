import React from 'react';
import ReactDOMServer from 'react-dom/server';

const POIPopup = ({ place }) => (
  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', maxWidth: '160px' }}>
    <strong>{place.name}</strong><br />
    <span style={{ background: '#1A73E8', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginTop: '4px', marginBottom: '4px', display: 'inline-block' }}>
      📍 Suggested Stop
    </span><br />
    <span style={{ color: '#6B7280', fontSize: '11px' }}>
      {place.vicinity || place.category}
    </span>
  </div>
);

export const renderPOIPopup = (place) => {
  return ReactDOMServer.renderToString(<POIPopup place={place} />);
};
