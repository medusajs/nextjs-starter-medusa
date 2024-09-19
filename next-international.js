// https://next-international.vercel.app/docs/app-setup
// locales/index.ts
import { createI18n } from 'next-international'
 
export const { useI18n, useScopedI18n, I18nProvider, getLocaleProps } = createI18n({
  hu: () => import('./hu'),
  en: () => import('./en')
})