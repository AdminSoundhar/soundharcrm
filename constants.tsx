
import React from 'react';

export const METAL_GROUPS = ['Gold', 'Diamond', 'Platinum', 'Silver'] as const;

export const PRODUCT_CATEGORIES = [
  'Anklets', 'Aranal', 'Articles', 'Baby Feeding', 'Bangle', 'Bindi', 'Bracelet', 
  'Chain', 'Coin Ball', 'Earrings', 'Finding', 'Gold Coin', 'Haaram', 'Handset', 
  'Head Set Tikka', 'Karungali Bracelet', 'Karungali Chain', 'Kurtha Button', 
  'Mangalsutra', 'Necklace', 'Nosepin', 'Oddiyanam', 'Pendant', 'Poonal', 'Rings', 
  'Silver Coin', 'Thirumangalyam', 'Toe Rings', 'Vanki', 'Others'
];

export const SOURCES = [
  'Livechat', 'Whatsapp', 'Phone Call', 'Email', 'Email Tickets', 'Aborted Orders', 
  'Online Order', 'JPS Redemption', 'Existing Customers', 'Social Media', 
  'Gift Voucher', 'Marketing Call', 'Marketing Whatsapp', 'IVS', 'IVS missed call', 
  'Marketing JPS', 'International lead', 'Vantage circle', 'JPS Whatsapp', 
  'JPS Whatsapp - Netcore', 'Existing Lead', 'JPS300', 'Live Lead'
];

export const SALES_PERSONS = [
  'Susheel', 'Bhuvanesh', 'Ravi', 'Deepak', 'Gopi', 'Lokesh', 'Sathesh', 'Elumalai', 
  'Anbarasiya', 'Deepa', 'Priya', 'Renuka', 'Vaishnavi', 'Vignesh', 'Lavanya', 
  'Angelin', 'Indhuja', 'Panduranga', 'Sneha', 'Abinash', 'Narayanan', 'Tanuja', 
  'Sathvika', 'Sridevi', 'Revathi'
];

export const DIALING_CODES = [
  { label: '+91 (India)', value: '91' },
  { label: '+1 (USA/Canada)', value: '1' },
  { label: 'Other', value: 'other' }
];

export const STATUS_COLORS: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-purple-100 text-purple-700',
  'Qualified': 'bg-indigo-100 text-indigo-700',
  'Negotiating': 'bg-amber-100 text-amber-700',
  'Closed': 'bg-emerald-100 text-emerald-700',
  'Lost': 'bg-rose-100 text-rose-700',
};
