import HSOverlay from "@preline/overlay";

export function convertToLocalDateTime(isoTimestamp) {
  const date = new Date(isoTimestamp);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  //   timeZoneName: 'short'
  };

  return date.toLocaleString(undefined, options); 
}

export const overlay = (selector) => {
  const element = document.querySelector(selector);

  if (!element) {
    console.warn(`Overlay with selector "${selector}" not found.`);
    return {
      open: () => {},
      close: () => {},
    };
  }

  const instance = new HSOverlay(element);

  return {
    open: () => instance.open(),
    close: () => instance.close(),
  };
};

export function toRupiah(value, withPrefix = true) {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof number !== 'number' || isNaN(number)) return withPrefix ? 'Rp0' : '0';

  return `${withPrefix ? 'Rp ' : ''}${number
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}