import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { getRegisterUser, getUserData, resetError } from '../../services/slices/user';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useDispatch();
  const { error, request } = useSelector(getUserData);

  useEffect(() => {
    dispatch(resetError());
    setLocalError('');
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    if (password !== confirmPassword) {
      setLocalError('Пароли не совпадают');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    if (!userName.trim()) {
      setLocalError('Введите имя');
      return false;
    }
    if (!email.trim()) {
      setLocalError('Введите email');
      return false;
    }
    setLocalError('');
    return true;
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    
    dispatch(resetError());
    setLocalError('');
    
    if (!validateForm()) {
      return;
    }

    dispatch(getRegisterUser({ email, password, name: userName }));
  };

  const errorText = error || localError;

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      confirmPassword={confirmPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      setConfirmPassword={setConfirmPassword}
      handleSubmit={handleSubmit}
      isLoading={request}
    />
  );
};