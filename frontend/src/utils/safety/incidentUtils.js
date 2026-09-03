export function getIncidentCategory(incident) {
  return incident.incidentCategory || incident.category || incident.type || 'Other';
}

export function getCurrentTouristId() {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user._id || user.id;
    }
  } catch (e) {
    console.warn('Could not parse user from localStorage', e);
  }
  return null;
}
