export const checkIsOpen = (openTime?: string, closeTime?: string): boolean => {
  if (!openTime || !closeTime) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const openMinutes = parseToMinutes(openTime);
  const closeMinutes = parseToMinutes(closeTime);

  if (closeMinutes > openMinutes) {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } else {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }
};