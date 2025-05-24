
import { commonTranslations } from './translations/common';
import { authTranslations } from './translations/auth';
import { gameTranslations } from './translations/game';
import { rentalTranslations } from './translations/rental';
import { userTranslations } from './translations/user';

export type Language = 'pl' | 'ua' | 'en' | 'ja'

export const translations = {
  pl: {
    ...commonTranslations.pl,
    ...authTranslations.pl,
    ...gameTranslations.pl,
    ...rentalTranslations.pl,
    ...userTranslations.pl,
  },
  ua: {
    ...commonTranslations.ua,
    ...authTranslations.ua,
    ...gameTranslations.ua,
    ...rentalTranslations.ua,
    ...userTranslations.ua,
  },
  en: {
    ...commonTranslations.en,
    ...authTranslations.en,
    ...gameTranslations.en,
    ...rentalTranslations.en,
    ...userTranslations.en,
  },
  ja: {
    ...commonTranslations.ja,
    ...authTranslations.ja,
    ...gameTranslations.ja,
    ...rentalTranslations.ja,
    ...userTranslations.ja,
  }
} as const; 