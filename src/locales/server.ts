// https://next-international.vercel.app/docs/app-setup
// locales/server.ts
import { createI18nServer } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
  us: () => import('./us'),
  hu: () => import('./hu')
}, {
  segmentName: "countryCode"
})