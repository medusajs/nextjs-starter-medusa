import en from './src/lib/i18n/translations/en';
import type enMessages from './src/lib/i18n/translations/en';
import { formats, FormatsType } from './src/lib/i18n/request-config';

type Messages = typeof en;

declare module 'next-intl' {
    type DefaultLocale = 'en';
    type SupportedLocales = DefaultLocale | 'ar';
  
    type MessageSchema = typeof arMessages;
  
    interface IntlConfig {
      locale: SupportedLocales;
      messages: MessageSchema;
      formats: FormatsType;
    }
  }
  import { useTranslations } from "next-intl"import { useTranslations } from "next-intl"