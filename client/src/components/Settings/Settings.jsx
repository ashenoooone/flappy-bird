import React from 'react';
import './Settings.scss';

const Settings = ({ theme, onChangeThemeClick, onLogoutClick }) => {
  return (
    <section className='settings'>
      <div className='container'>
        <h2>Настройки</h2>
        <div className='settings__theme'>
          <p className='settings__text'>Тема</p>
          <div className='settings__inputs'>
            <label className='settings__label'>
              Светлая
              <input
                name='theme'
                checked={theme === 'light'}
                onChange={onChangeThemeClick}
                type='radio'
              />
            </label>
            <label className='settings__label'>
              Темная
              <input
                name='theme'
                checked={theme === 'dark'}
                onChange={onChangeThemeClick}
                type='radio'
              />
            </label>
          </div>
        </div>
        <button className='button button_default' onClick={onLogoutClick}>
          Выйти
        </button>
      </div>
    </section>
  );
};

export default Settings;
