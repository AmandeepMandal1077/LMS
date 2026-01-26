export enum CacheKeys {
  PUBLISHED_COURSES = "published_courses",
}

export const generateKey = (key: string, userId: string) => {
  return `${key}:${userId}`;
};
