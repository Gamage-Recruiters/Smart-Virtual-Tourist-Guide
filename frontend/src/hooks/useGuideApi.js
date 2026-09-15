import { useCallback, useEffect, useState } from 'react';
import apiClient from '../services/api';

export default function useGuideApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!endpoint) { setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const result = await apiClient.get(endpoint);
      if (!result?.success) throw new Error(result?.message || 'Unable to load this page.');
      setData(result);
    }
    catch (err) { setError(err.message || 'Unable to load this page.'); }
    finally { setLoading(false); }
  }, [endpoint]);

  // The callback owns the request lifecycle and is intentionally triggered by endpoint changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load, setData };
}
