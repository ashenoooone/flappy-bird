import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaders } from '../../store/slices/UserSlice';
import Leaderboard from '../Leaderboard/Leaderboard';

const LeaderboardContainer = () => {
  const dispatch = useDispatch();
  const leaders = useSelector((state) => state.user.leaders);
  useEffect(() => {
    dispatch(getLeaders());
  }, []);

  return <Leaderboard leaders={leaders} />;
};

export default LeaderboardContainer;
