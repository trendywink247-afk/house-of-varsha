import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Site settings
export const defaultSettings = {
  storeName: 'House of Varsha',
  tagline: 'Handcrafted Indian Ethnic Wear',
  whatsappNumber: '917569619390',
  instagramHandle: 'houseofvarsha',
  email: 'hello@houseofvarsha.com'
} as const;

// Format WhatsApp link with optional pre-filled message
export const getWhatsAppLink = (number: string, message?: string): string => {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanNumber}${encodedMessage}`;
};

// Format Instagram profile link
export const getInstagramLink = (handle: string): string => {
  const cleanHandle = handle.replace('@', '');
  return `https://instagram.com/${cleanHandle}`;
};

// Parse price for sorting
export const parsePrice = (price: string): number => {
  const num = price.replace(/[^0-9]/g, '');
  return parseInt(num) || 0;
};

// Format price display
export const formatPrice = (price: string): string => {
  return price;
};

// Generate WhatsApp order message
export const generateOrderMessage = (productName: string, code: string, price: string, size?: string): string => {
  let message = `Hello! I'm interested in ordering:\n\n` +
    `Product: ${productName}\n` +
    `Code: ${code}\n` +
    `Price: ${price}`;
  
  if (size) {
    message += `\nSize: ${size}`;
  }
  
  message += `\n\nPlease confirm availability.`;
  return message;
};

// Scroll to element smoothly
export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if element is in viewport
export const isInViewport = (element: HTMLElement, threshold = 0.1): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight * (1 - threshold)) &&
    rect.bottom >= (window.innerHeight * threshold)
  );
};
