import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { username, email, score } = useSelector((state) => state.user);
  return { isAuth: !!username, username, score, email };
};
