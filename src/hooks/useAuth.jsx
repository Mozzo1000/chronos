import { useState, useEffect } from 'preact/hooks';
import pb from '../lib/pocketbase';

export function useAuth() {
  const [user, setUser] = useState(pb.authStore.model);
  const [isValid, setIsValid] = useState(pb.authStore.isValid);

  useEffect(() => {
    // Listen for auth changes (logout/login)
    return pb.authStore.onChange((token, model) => {
      setUser(model);
      setIsValid(!!token);
    });
  }, []);

  const logout = () => {
    pb.authStore.clear();
  };

  return { user, isValid, logout };
}