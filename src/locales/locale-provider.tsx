'use client';

import type { ReactNode } from 'react';
import { I18nProviderClient } from '../locales/client';

type ProviderProps = {
  countryCode: string;
  children: ReactNode;
};

// {/* <main className="relative"><LocalizationProvider>{props.children}</LocalizationProvider></main> */}
export function LocalizationProvider({ countryCode, children }: ProviderProps) {
  return (
    <I18nProviderClient locale={countryCode} fallback={<p>??? ... ???</p>}>
      {children}
    </I18nProviderClient>
  );
}