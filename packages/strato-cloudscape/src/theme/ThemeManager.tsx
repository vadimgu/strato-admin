import { useEffect } from 'react';
import { useStore } from 'strato-core';
import { Mode, applyMode } from '@cloudscape-design/global-styles';

export const ThemeManager = () => {
  const [theme] = useStore('theme', 'light');

  useEffect(() => {
    applyMode(theme === 'dark' ? Mode.Dark : Mode.Light);
  }, [theme]);

  return null;
};

export default ThemeManager;
