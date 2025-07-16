import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-switch-wrapper">
      <label className="theme-switch" htmlFor="theme-checkbox">
        <input
          type="checkbox"
          id="theme-checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <div className="slider">
          <div className="slider-icon sun">☀️</div>
          <div className="slider-icon moon">🌙</div>
        </div>
      </label>
    </div>
  );
};