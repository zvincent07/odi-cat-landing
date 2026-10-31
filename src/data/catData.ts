export interface CatProfile {
  name: string;
  breed: string;
  coatColor: string;
  gender: 'Male' | 'Female';
  dob: string;
  father: string;
  mother: string;
  dryFood: string;
  wetFood: string[];
  vitamins: string[];
  dewormingCount: number;
  litterTrained: boolean;
  bathTrained: boolean;
  personalityTraits: string[];
  favoriteSpots: string[];
}

export const ODI_DATA: CatProfile = {
  name: 'Odi',
  breed: 'Turkish Angora / Persian Mix',
  coatColor: 'Smoke Charcoal Gray & Amber Eyes',
  gender: 'Male',
  dob: 'June 15, 2026',
  father: 'Pure Persian',
  mother: '½ Turkish Angora, ½ Persian',
  dryFood: 'Whiskas Kitten',
  wetFood: [
    'Whiskas Tuna and Chicken',
    'Boiled Chicken Breast',
    'Chicken Liver & Steamed Squash',
  ],
  vitamins: ['LC Vitamins Plus', 'Coatshine'],
  dewormingCount: 3,
  litterTrained: true,
  bathTrained: true,
  personalityTraits: [
    'Silky Smoke Gray Coat',
    'Curious Amber-Eyed Explorer',
    'Cozy Blanket Dreamer',
    'Bandana Fashion Icon',
    'Gentle Gentle Boy',
    'Affectionate Purr Machine',
  ],
  favoriteSpots: [
    'Tucked snug inside fluffy golden fleece pillows',
    'Front-row window seat inside the cat travel carrier',
    'Resting peacefully right beside his favorite human',
  ],
};

/**
 * Calculates current exact age string (e.g., "4 months, 16 days" or "1 year, 2 months")
 */
export function calculateCatAge(dobString: string): {
  headline: string;
  detail: string;
  totalDays: number;
  months: number;
  years: number;
} {
  const birthDate = new Date(dobString);
  const now = new Date();

  // If birthDate is somehow in future relative to system time, handle gracefully
  let diffTime = now.getTime() - birthDate.getTime();
  if (diffTime < 0) {
    // If future demo date or system clock issue, default to 4 months baseline
    diffTime = 138 * 24 * 60 * 60 * 1000;
  }

  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    years = 0;
    months = 4;
    days = 16;
  }

  let headline = '';
  if (years >= 1) {
    headline = `${years} Year${years > 1 ? 's' : ''}${months > 0 ? ` & ${months} Mo` : ''}`;
  } else {
    headline = `${months} Months Old`;
  }

  const detail = `${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''} of pure cuteness (${totalDays} days total)`;

  return { headline, detail, totalDays, months, years };
}
