'use client';

import { useState, useEffect } from 'react';
import type { Locale } from './i18n';

type Messages = Record<string, any>;

export function useTranslation() {
  const [messages, setMessages] = useState<Messages>({});
  const [locale, setLocale] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedLocale = (localStorage.getItem('locale') as Locale) || 'en';
        setLocale(savedLocale);
        
        const loadedMessages = await import(`../messages/${savedLocale}.json`);
        setMessages(loadedMessages.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English
        const fallbackMessages = await import('../messages/en.json');
        setMessages(fallbackMessages.default);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale, isLoading };
}

