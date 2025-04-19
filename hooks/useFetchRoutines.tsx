import {useState} from 'react';

export const FETCH_RESULTS = 10;
export const MAX_LENGTH = 50;

export const useFetchRoutines = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
  
  // Code comes below here
  const getUsers = async (currentPage : any, isTop = false) => {
    setIsLoading(true);
    setSuccess(false);
    setErrorMessage('');
    try {
        const response = await fetch(currentPage, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
      if (isTop) {
        const newList = [...data?.results, ...users];
        const slicedUsers = [...newList].slice(0, MAX_LENGTH);
        setUsers(slicedUsers);
      }
      if (!isTop) {
        const randomIndex = () => Math.ceil(Math.random() * 10);
        const newList = [...users, ...data?.results];
        const slicedUsers = [...newList].slice(-1 * MAX_LENGTH + randomIndex());
        setUsers(slicedUsers);
      }
      setSuccess(true);
    } catch (error: any) {
      const theError =
        error?.response && error.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
      setErrorMessage(theError);
    }
    setIsLoading(false);
  };
  // Code comes above here
  
    return { users, isLoading, success, getRoutines, errorMessage };
  };