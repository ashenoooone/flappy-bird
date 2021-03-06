import React from 'react';
import './Main.scss';
const Main = () => {
  return (
    <section className='main'>
      <div className='container'>
        <h1 className='main__title'>Главная страница</h1>
        <div className='main__instruction'>
          <h3 className='main__text'>Инструкция по игре:</h3>
          <p>
            Чтобы начать играть нажмите в верхнем меню на кнопку "Играть", после
            чего вы попадете на страницу игры.
          </p>
          <h3>Управление:</h3>
          <p>
            Чтобы взлететь вверх нажмите и удерживайте левую кнопку мыши или
            пробел.
          </p>
          <p>
            После каждого пройденного препятствия вам будет начисляться 1 очко,
            лучшие игроки заносятся в таблицу лидеров.
          </p>
          <p>
            Если вы заденете препятствие, то игра закончится и вы проиграете.
          </p>
          <p>Цель игры - набрать как можно больше очков.</p>
          <h3>Удачи!</h3>
        </div>
      </div>
    </section>
  );
};

export default Main;
