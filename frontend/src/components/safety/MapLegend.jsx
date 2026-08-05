import { SEVERITY_LEGEND_ITEMS } from '../../constants/severityConfig';

/**
 * Reusable map legend overlay for risk/priority level indicators.
 * Extracted from AlertMap.jsx and WeatherAlertsPage.jsx where identical
 * legend code was duplicated.
 *
 * @param {Object} props
 * @param {string} props.title - Legend heading (e.g. "Priority Level", "Risk Level")
 * @param {'bottom-left'|'bottom-right'} props.position - Position on the map (default: 'bottom-right')
 * @param {'horizontal'|'vertical'} props.layout - Item arrangement (default: 'vertical')
 * @param {Array} props.items - Override items array [{color, label}] (defaults to standard 4-tier levels)
 */
export default function MapLegend({
  title = 'Risk Level',
  position = 'bottom-right',
  layout = 'vertical',
  items = SEVERITY_LEGEND_ITEMS,
}) {
  const positionStyles = {
    'bottom-left':  { bottom: '16px', left: '16px' },
    'bottom-right': { bottom: '16px', right: '16px' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        zIndex: 1000,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(100,116,139,0.25)',
        borderRadius: '10px',
        padding: '8px 14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        pointerEvents: 'none',
      }}
    >
      {/* Title */}
      <p
        style={{
          margin: '0 0 7px 0',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#475569',
        }}
      >
        {title}
      </p>

      {/* Items */}
      <div
        style={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
          gap: layout === 'horizontal' ? '18px' : '5px',
        }}
      >
        {items.map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: layout === 'horizontal' ? '6px' : '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
                border: '2px solid rgba(0,0,0,0.15)',
                boxShadow: `0 0 0 3px ${color}33`,
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#475569',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
