import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // =============================================================================
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // =============================================================================
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // ============== don't need to use it if useEffect done localStorage.setItem already.
  // const toggleTheme = () => {
  //   setTheme(previousTheme => {
  //     const nextTheme = previousTheme === 'light' ? 'dark' : 'light';

  //     localStorage.setItem('theme', nextTheme);

  //     document.documentElement.setAttribute('data-theme', nextTheme);

  //     return nextTheme;
  //   });
  // };

  // =============================================================================
  const themeInfo = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeInfo}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
