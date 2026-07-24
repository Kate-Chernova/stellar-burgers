import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

type TLocationState = {
  from?: Location;
};

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  // Если мы пришли на /login из ProtectedRoute, там лежит state.from
  // Если нет — после логина отправляем на главную
  const from = (location.state as TLocationState | null)?.from?.pathname || '/';

  // Берём ошибку из стора, чтобы показать её в UI
  const errorText = useSelector((state) => state.user.error) ?? '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
