/**
 * President's Volunteer Service Award (PVSA) Eligibility Calculator
 * 
 * PVSA Requirements by Age Group:
 * - Ages 11-15: Bronze (50-74h), Silver (75-99h), Gold (100+h)
 * - Ages 16-25: Bronze (100-174h), Silver (175-249h), Gold (250+h)
 */

export interface PVSAEligibility {
  currentLevel: 'none' | 'bronze' | 'silver' | 'gold';
  currentHours: number;
  nextLevel: 'bronze' | 'silver' | 'gold' | 'max';
  hoursNeeded: number;
  progress: number; // 0-100 percentage to next level
  bronzeThreshold: number;
  silverThreshold: number;
  goldThreshold: number;
}

export function calculatePVSAEligibility(
  totalApprovedHours: number,
  userAge?: number
): PVSAEligibility {
  // Default to 16-25 age group if age not provided
  const isYoungerAgeGroup = userAge !== undefined && userAge >= 11 && userAge <= 15;
  
  const thresholds = isYoungerAgeGroup
    ? {
        bronze: 50,
        silver: 75,
        gold: 100,
      }
    : {
        bronze: 100,
        silver: 175,
        gold: 250,
      };

  let currentLevel: 'none' | 'bronze' | 'silver' | 'gold' = 'none';
  let nextLevel: 'bronze' | 'silver' | 'gold' | 'max' = 'bronze';
  let hoursNeeded = thresholds.bronze;
  let progress = 0;

  if (totalApprovedHours >= thresholds.gold) {
    currentLevel = 'gold';
    nextLevel = 'max';
    hoursNeeded = 0;
    progress = 100;
  } else if (totalApprovedHours >= thresholds.silver) {
    currentLevel = 'silver';
    nextLevel = 'gold';
    hoursNeeded = thresholds.gold - totalApprovedHours;
    progress = Math.min(100, ((totalApprovedHours - thresholds.silver) / (thresholds.gold - thresholds.silver)) * 100);
  } else if (totalApprovedHours >= thresholds.bronze) {
    currentLevel = 'bronze';
    nextLevel = 'silver';
    hoursNeeded = thresholds.silver - totalApprovedHours;
    progress = Math.min(100, ((totalApprovedHours - thresholds.bronze) / (thresholds.silver - thresholds.bronze)) * 100);
  } else {
    currentLevel = 'none';
    nextLevel = 'bronze';
    hoursNeeded = thresholds.bronze - totalApprovedHours;
    progress = Math.min(100, (totalApprovedHours / thresholds.bronze) * 100);
  }

  return {
    currentLevel,
    currentHours: totalApprovedHours,
    nextLevel,
    hoursNeeded: Math.max(0, hoursNeeded),
    progress: Math.max(0, Math.min(100, progress)),
    bronzeThreshold: thresholds.bronze,
    silverThreshold: thresholds.silver,
    goldThreshold: thresholds.gold,
  };
}

export function getPVSALevelName(level: 'none' | 'bronze' | 'silver' | 'gold'): string {
  switch (level) {
    case 'bronze':
      return 'Bronze';
    case 'silver':
      return 'Silver';
    case 'gold':
      return 'Gold';
    default:
      return 'Not Eligible';
  }
}

export function getPVSALevelColor(level: 'none' | 'bronze' | 'silver' | 'gold'): string {
  switch (level) {
    case 'bronze':
      return '#CD7F32'; // Bronze color
    case 'silver':
      return '#C0C0C0'; // Silver color
    case 'gold':
      return '#FFD700'; // Gold color
    default:
      return '#9CA3AF'; // Gray
  }
}

