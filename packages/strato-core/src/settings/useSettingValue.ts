import { useCallback } from 'react';
import { useSettings } from './SettingsContext';
import type { AdminSettings } from './SettingsContext';

type Resolver = <K extends keyof AdminSettings>(
  propValue: AdminSettings[K] | undefined,
  settingKey: K,
  schemaValue?: AdminSettings[K],
) => AdminSettings[K] | undefined;

/**
 * Returns a resolver function that applies three-tier precedence:
 *   local prop → resource schema override → admin settings
 *
 * Uses !== undefined (not ??) so `false` works as an explicit disable.
 *
 * @example
 * const resolve = useSettingValue();
 * const resolvedMode = resolve(mutationMode, 'mutationMode');
 * const resolvedRedirect = resolve(redirect, 'editRedirect');
 */
export function useSettingValue(): Resolver {
  const settings = useSettings();
  return useCallback(
    (propValue, settingKey, schemaValue) => {
      if (propValue !== undefined) return propValue;
      if (schemaValue !== undefined) return schemaValue;
      return settings[settingKey];
    },
    [settings],
  );
}
