import enMessages from '../messages/en/index.json';
import arMessages from '../messages/ar/index.json';
import { formats, FormatsType } from './src/lib/i18n/request-config';

type Messages = typeof en;

declare module 'next-intl' {
    type DefaultLocale = 'en';
    type SupportedLocales = DefaultLocale | 'ar';
  
    type MessageSchema = typeof enMessages;
  
    interface IntlConfig {
      locale: SupportedLocales;
      messages: MessageSchema;
      formats: FormatsType;
    }
  }
  