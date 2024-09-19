// https://next-international.vercel.app/docs/app-setup
// locales/server.ts
import { createI18nServer, setStaticParamsLocale } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
  us: () => import('./us'),
  hu: () => import('./hu')
}, {
  segmentName: "countryCode"
})

// see: https://github.com/QuiiBz/next-international/issues/411
export const setStaticParams = (locale: string) => setStaticParamsLocale(locale);