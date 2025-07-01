import { MuscleGroup, MuscleGroupConfig } from "../types";

// Configuration for muscle groups including display properties
export const muscleGroupConfigs: Record<MuscleGroup, MuscleGroupConfig> = {
  [MuscleGroup.CHEST]: {
    label: "胸肌",
    color: "#ff4d4f",
    icon: "💪",
  },
  [MuscleGroup.SHOULDERS]: {
    label: "肩膀",
    color: "#ff7a45",
    icon: "🔥",
  },
  [MuscleGroup.LEGS]: {
    label: "腿部",
    color: "#ffa940",
    icon: "🦵",
  },
  [MuscleGroup.BACK]: {
    label: "背部",
    color: "#bae637",
    icon: "💚",
  },
  [MuscleGroup.ABS]: {
    label: "腹肌",
    color: "#36cfc9",
    icon: "⚡",
  },
  [MuscleGroup.ARMS]: {
    label: "手臂",
    color: "#597ef7",
    icon: "💪",
  },
  [MuscleGroup.CARDIO]: {
    label: "有氧",
    color: "#eb2f96",
    icon: "❤️",
  },
};

// Helper function to get muscle group config
export const getMuscleGroupConfig = (muscleGroup: MuscleGroup): MuscleGroupConfig => {
  return muscleGroupConfigs[muscleGroup];
};

// Helper function to get all muscle group options for forms
export const getMuscleGroupOptions = () => {
  return Object.entries(muscleGroupConfigs).map(([value, config]) => ({
    label: config.label,
    value,
    color: config.color,
    icon: config.icon,
  }));
};
