import { useNavigate } from 'react-router-dom';

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
