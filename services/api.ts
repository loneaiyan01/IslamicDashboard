import { WeatherData, PrayerTimes, AyahData, JokeData } from '../types';

// Default Location: Srinagar, India
const LAT = 34.0837;
const LON = 74.7973;

export const fetchWeather = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=auto`
    );
    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
    };
  } catch (error) {
    console.error("Failed to fetch weather", error);
    return { temperature: 0, weatherCode: 0 };
  }
};

export const fetchPrayerTimes = async (): Promise<PrayerTimes | null> => {
  try {
    const today = new Date();
    // Use the timestamp to get today's prayer times
    const timestamp = Math.floor(today.getTime() / 1000);
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${LAT}&longitude=${LON}&method=2`
    );
    const data = await response.json();
    const timings = data.data.timings;
    return {
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
    };
  } catch (error) {
    console.error("Failed to fetch prayer times", error);
    return null;
  }
};

export const fetchRandomAyah = async (): Promise<AyahData | null> => {
  try {
    // Fetch both Arabic (quran-uthmani) and English Translation (en.hilali)
    // We add a timestamp to the URL to prevent browser caching (cache busting)
    // We REMOVE custom headers (Cache-Control, Pragma) to avoid CORS preflight issues
    const timestamp = new Date().getTime();
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.hilali?_t=${timestamp}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // The API returns an array of editions in the order requested
    const arabicEdition = data.data[0];
    const englishEdition = data.data[1];

    return {
      arabic: arabicEdition.text,
      english: englishEdition.text,
      surah: arabicEdition.surah,
      numberInSurah: arabicEdition.numberInSurah
    };
  } catch (error) {
    console.error("Failed to fetch Ayah", error);
    return null;
  }
};

export const fetchRandomJoke = async (): Promise<JokeData | null> => {
  try {
    const response = await fetch(`https://official-joke-api.appspot.com/random_joke`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch Joke", error);
    return null;
  }
};