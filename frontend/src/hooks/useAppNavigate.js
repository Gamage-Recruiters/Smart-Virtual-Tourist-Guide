import { useNavigate } from 'react-router-dom';

/**
 * Drop-in replacement for the old `setActivePage(pageName)` pattern.
 * Maps the legacy page keys to proper URL routes.
 *
 * Usage:
 *   const appNavigate = useAppNavigate();
 *   appNavigate('direction');   // navigates to /direction
 */
const PAGE_ROUTES = {
  explore: '/',
  direction: '/direction',
  directionOne: '/direction/setup',
  start: '/navigation',
  eta: '/eta',
  safety: '/route-alerts',
};

export const useAppNavigate = () => {
  const navigate = useNavigate();
  return (page) => navigate(PAGE_ROUTES[page] || '/');
};

export { PAGE_ROUTES };
