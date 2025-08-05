export const getCountdownDays = () => {
    const today = new Date();
    const tradeFairDate = new Date('2025-11-07');
    const timeDiff = tradeFairDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24) - 1);
  }