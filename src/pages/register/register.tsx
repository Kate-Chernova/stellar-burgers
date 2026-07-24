import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { RegisterUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';

type TLocationState = {
  from?: Location;
};

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as TLocationState | null)?.from?.pathname || '/';

  const errorText = useSelector((state) => state.user.error) ?? '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
