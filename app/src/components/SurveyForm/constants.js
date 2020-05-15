import { config as ps } from "./configs/problem-solving";
import { config as social } from "./configs/social";

export const PROBLEM_SOLVING_SURVEY = "Problem Solving";
export const SOCIAL_SURVEY = "Social";

export const SURVEYS = Object.freeze({
  [PROBLEM_SOLVING_SURVEY]: ps,
  [SOCIAL_SURVEY]: social,
});
