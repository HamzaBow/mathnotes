import { useState, useEffect, useCallback } from "react";

export default function useAsync(callback: Function, dependencies:any[] = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<any>();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setData(undefined);
    callback()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, data };
}
