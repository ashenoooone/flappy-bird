import React from 'react';
import './Leaderboard.scss';

const Leaderboard = ({ leaders }) => {
  return (
    <section className='leaderboard'>
      <div className='container'>
        <table className='leaderboard__table'>
          <thead>
            <tr className='leaderboard__table-row'>
              <th className='leaderboard__table-heading'>
                <h3>Позиция</h3>
              </th>
              <th className='leaderboard__table-heading'>
                <h3> Имя пользователя</h3>
              </th>
              <th className='leaderboard__table-heading'>
                <h3>Счет</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => {
              return (
                <tr className='leaderboard__table-row' key={leader.id}>
                  <td className='leaderboard__table-cell'>{index + 1}</td>
                  <td>{leader.username}</td>
                  <td>{leader.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Leaderboard;
