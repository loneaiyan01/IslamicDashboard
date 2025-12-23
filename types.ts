import React from 'react';

export interface WeatherData {
  temperature: number;
  weatherCode: number;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string; // Index signature for iteration
}

export interface AyahData {
  arabic: string;
  english: string;
  surah: {
    name: string;
    englishName: string;
    number: number;
  };
  numberInSurah: number;
}

export interface JokeData {
  setup: string;
  punchline: string;
}

export interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  allowOverflow?: boolean;
}