export function bearingToCardinal(bearing) {
  if (bearing == null || Number.isNaN(bearing)) return '';
  const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const idx = Math.round(bearing / 45) % 8;
  return dirs[idx];
}

export function formatStepInstruction(step) {
  if (!step) return 'Continue to destination';
  const m = step.maneuver || {};
  const type = (m.type || '').toLowerCase();
  const mod = (m.modifier || '').toLowerCase();
  const name = step.name ? step.name.trim() : '';
  const ontoRoad = name ? `onto ${name}` : '';
  const onRoad = name ? `on ${name}` : '';

  if (type === 'depart') {
    const dir = bearingToCardinal(m.bearing_after);
    return `Head ${dir ? `${dir} ` : ''}${onRoad || 'toward destination'}`.trim();
  }
  if (type === 'arrive') {
    return name ? `Arrive at destination on ${name}` : 'Arrive at your destination';
  }
  if (type === 'roundabout' || type === 'rotary') {
    const exitText = m.exit ? `take exit ${m.exit}` : 'enter roundabout';
    return `At the roundabout, ${exitText} ${ontoRoad}`.trim();
  }
  if (type === 'exit roundabout' || type === 'exit rotary') {
    return `Exit roundabout ${ontoRoad}`.trim();
  }
  if (type === 'fork') {
    return `Keep ${mod || 'left'} at the fork ${onRoad}`.trim();
  }
  if (type === 'end of road') {
    return `At the end of the road, turn ${mod || 'left'} ${ontoRoad}`.trim();
  }
  if (type === 'on ramp' || type === 'off ramp') {
    return `Take ramp ${mod ? `${mod} ` : ''}${ontoRoad}`.trim();
  }
  if (type === 'merge') {
    return `Merge ${mod ? `${mod} ` : ''}${ontoRoad}`.trim();
  }
  if (mod.includes('left')) return `Turn ${mod} ${ontoRoad}`.trim();
  if (mod.includes('right')) return `Turn ${mod} ${ontoRoad}`.trim();
  if (mod === 'uturn') return `Make a U-turn ${ontoRoad}`.trim();
  if (mod === 'straight' || type === 'continue' || type === 'new name') {
    return `Continue straight ${onRoad || ontoRoad}`.trim();
  }
  if (mod) {
    return `${mod.charAt(0).toUpperCase() + mod.slice(1)} ${ontoRoad}`.trim();
  }
  return name ? `Continue onto ${name}` : 'Continue on route';
}

export function formatDistance(meters) {
  if (meters == null || Number.isNaN(meters) || !Number.isFinite(meters)) return '';
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.max(1, Math.round(meters))} m`;
}

export function getManeuverIconType(step, isArrived = false) {
  if (isArrived) return 'arrive';
  if (!step) return 'straight';

  const m = step.maneuver || {};
  const type = (m.type || step.maneuverType || '').toLowerCase();
  const mod = (m.modifier || step.maneuverModifier || '').toLowerCase();
  const inst = (step.instructions || '').toLowerCase();

  if (type === 'arrive' || inst.includes('arrive')) return 'arrive';
  if (type.includes('roundabout') || type.includes('rotary') || inst.includes('roundabout')) return 'roundabout';
  if (mod === 'uturn' || inst.includes('u-turn') || inst.includes('uturn')) return 'uturn';
  if (mod === 'sharp left' || inst.includes('sharp left')) return 'sharp_left';
  if (mod === 'sharp right' || inst.includes('sharp right')) return 'sharp_right';
  if (mod === 'slight left' || inst.includes('slight left')) return 'slight_left';
  if (mod === 'slight right' || inst.includes('slight right')) return 'slight_right';
  if (mod.includes('left') || inst.includes('turn left') || inst.includes('keep left')) return 'left';
  if (mod.includes('right') || inst.includes('turn right') || inst.includes('keep right')) return 'right';
  return 'straight';
}

