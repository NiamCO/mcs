import React, { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, ShoppingBag } from 'lucide-react';

// Rarity colors
const RARITIES = {
  0: { name: 'Common', color: '#6b7280', bgColor: '#4b5563' },
  1: { name: 'Uncommon', color: '#22c55e', bgColor: '#16a34a' },
  2: { name: 'Rare', color: '#3b82f6', bgColor: '#2563eb' },
  3: { name: 'Epic', color: '#a855f7', bgColor: '#9333ea' },
  4: { name: 'Legendary', color: '#fbbf24', bgColor: '#f59e0b', sparkle: true },
  5: { name: 'Divine', color: '#06b6d4', bgColor: '#0891b2', sparkle: true }
};

// SVG Item Generator
const ItemSVG = ({ type, rarity, size = 80 }) => {
  const color = RARITIES[rarity].color;
  const bgColor = RARITIES[rarity].bgColor;
  
  const svgTypes = {
    sword: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`grad-${rarity}-sword`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect x="45" y="10" width="10" height="60" fill={`url(#grad-${rarity}-sword)`} rx="2"/>
        <rect x="35" y="65" width="30" height="8" fill={color} rx="2"/>
        <circle cx="50" cy="73" r="6" fill={bgColor}/>
        <rect x="48" y="75" width="4" height="15" fill={color} rx="2"/>
      </svg>
    ),
    bow: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M 30 20 Q 20 50 30 80" stroke={color} strokeWidth="4" fill="none"/>
        <path d="M 30 20 L 70 50 L 30 80" stroke={bgColor} strokeWidth="2" fill="none"/>
        <line x1="30" y1="20" x2="30" y2="80" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    potion: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="35" y="30" width="30" height="50" fill={`url(#grad-${rarity}-potion)`} rx="5"/>
        <rect x="40" y="20" width="20" height="15" fill={bgColor} rx="2"/>
        <circle cx="50" cy="22" r="3" fill={color}/>
        <defs>
          <linearGradient id={`grad-${rarity}-potion`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    ),
    armor: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d="M 50 20 L 30 30 L 30 70 L 50 80 L 70 70 L 70 30 Z" fill={`url(#grad-${rarity}-armor)`} stroke={color} strokeWidth="2"/>
        <circle cx="50" cy="45" r="8" fill={bgColor}/>
        <defs>
          <linearGradient id={`grad-${rarity}-armor`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    ),
    food: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" fill={color}/>
        <circle cx="45" cy="45" r="20" fill={bgColor}/>
        <circle cx="55" cy="55" r="15" fill={color} opacity="0.7"/>
      </svg>
    ),
    block: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="25" y="35" width="50" height="50" fill={bgColor} stroke={color} strokeWidth="2"/>
        <polygon points="25,35 50,20 75,35" fill={color} stroke={color} strokeWidth="2"/>
        <polygon points="75,35 75,85 50,70 50,20" fill={color} opacity="0.7" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    resource: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,15 65,35 85,40 67,57 72,78 50,67 28,78 33,57 15,40 35,35" fill={`url(#grad-${rarity}-resource)`} stroke={color} strokeWidth="2"/>
        <defs>
          <linearGradient id={`grad-${rarity}-resource`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: bgColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    ),
    music: (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="35" cy="70" r="12" fill={color}/>
        <circle cx="65" cy="65" r="12" fill={bgColor}/>
        <rect x="33" y="30" width="4" height="40" fill={color}/>
        <rect x="63" y="25" width="4" height="40" fill={bgColor}/>
        <path d="M 37 30 Q 50 20 67 25" stroke={color} strokeWidth="3" fill="none"/>
      </svg>
    )
  };
  
  return svgTypes[type] || svgTypes.resource;
};

// Case data with proper weight distribution
const CASES = [
  {
    id: 'resources',
    name: 'RESOURCES CASE',
    price: 12,
    image: 'resourcescase.png',
    items: [
      { name: 'Coal', rarity: 0, minPrice: 2, maxPrice: 6, weight: 1200, type: 'resource' },
      { name: 'Flint', rarity: 0, minPrice: 3, maxPrice: 8, weight: 1000, type: 'resource' },
      { name: 'Iron', rarity: 1, minPrice: 7, maxPrice: 13, weight: 600, type: 'resource' },
      { name: 'Slime', rarity: 1, minPrice: 10, maxPrice: 16, weight: 500, type: 'resource' },
      { name: 'Redstone', rarity: 1, minPrice: 12, maxPrice: 22, weight: 300, type: 'resource' },
      { name: 'Lapis', rarity: 2, minPrice: 20, maxPrice: 28, weight: 150, type: 'resource' },
      { name: 'Glowstone', rarity: 2, minPrice: 30, maxPrice: 43, weight: 100, type: 'resource' },
      { name: 'Gold', rarity: 2, minPrice: 70, maxPrice: 110, weight: 70, type: 'resource' },
      { name: 'Diamond', rarity: 3, minPrice: 280, maxPrice: 450, weight: 45, type: 'resource' },
      { name: 'Emerald', rarity: 3, minPrice: 380, maxPrice: 600, weight: 30, type: 'resource' },
      { name: 'Nether Star', rarity: 4, minPrice: 800, maxPrice: 1000, weight: 15, type: 'resource' }
    ]
  },
  {
    id: 'food',
    name: 'FOOD CASE',
    price: 30,
    image: 'foodcase.png',
    items: [
      { name: 'Rotten Flesh', rarity: 0, minPrice: 2, maxPrice: 5, weight: 1100, type: 'food' },
      { name: 'Bread', rarity: 0, minPrice: 5, maxPrice: 10, weight: 1000, type: 'food' },
      { name: 'Watermelon', rarity: 0, minPrice: 6, maxPrice: 10, weight: 900, type: 'food' },
      { name: 'Carrot', rarity: 1, minPrice: 6, maxPrice: 10, weight: 800, type: 'food' },
      { name: 'Apple', rarity: 1, minPrice: 6, maxPrice: 11, weight: 750, type: 'food' },
      { name: 'Potato', rarity: 1, minPrice: 7, maxPrice: 12, weight: 700, type: 'food' },
      { name: 'Chicken', rarity: 1, minPrice: 20, maxPrice: 34, weight: 500, type: 'food' },
      { name: 'Beef', rarity: 2, minPrice: 20, maxPrice: 34, weight: 400, type: 'food' },
      { name: 'Porkchop', rarity: 2, minPrice: 20, maxPrice: 35, weight: 350, type: 'food' },
      { name: 'Mutton', rarity: 2, minPrice: 22, maxPrice: 36, weight: 300, type: 'food' },
      { name: 'Mushrooms', rarity: 2, minPrice: 120, maxPrice: 280, weight: 200, type: 'food' },
      { name: 'Pumpkin Pie', rarity: 3, minPrice: 140, maxPrice: 300, weight: 150, type: 'food' },
      { name: 'Cookie', rarity: 3, minPrice: 330, maxPrice: 530, weight: 100, type: 'food' },
      { name: 'Cake', rarity: 3, minPrice: 350, maxPrice: 540, weight: 80, type: 'food' },
      { name: 'Poisonous Potato', rarity: 4, minPrice: 370, maxPrice: 560, weight: 60, type: 'food' },
      { name: 'Golden Carrot', rarity: 4, minPrice: 640, maxPrice: 765, weight: 40, type: 'food' },
      { name: 'Glistering Melon', rarity: 4, minPrice: 640, maxPrice: 780, weight: 35, type: 'food' },
      { name: 'Golden Apple', rarity: 4, minPrice: 640, maxPrice: 800, weight: 30, type: 'food' }
    ]
  },
  {
    id: 'swords',
    name: 'SWORDS CASE',
    price: 35,
    image: 'swordscase.png',
    items: [
      { name: 'Wooden Sword', rarity: 0, minPrice: 3, maxPrice: 5, weight: 1000, type: 'sword' },
      { name: 'Stone Sword', rarity: 0, minPrice: 4, maxPrice: 7, weight: 850, type: 'sword' },
      { name: 'Iron Sword', rarity: 1, minPrice: 12, maxPrice: 20, weight: 600, type: 'sword' },
      { name: 'Redstone Sword', rarity: 1, minPrice: 30, maxPrice: 40, weight: 400, type: 'sword' },
      { name: 'Lapis Sword', rarity: 2, minPrice: 50, maxPrice: 60, weight: 250, type: 'sword' },
      { name: 'Golden Mini Sword', rarity: 2, minPrice: 90, maxPrice: 165, weight: 150, type: 'sword' },
      { name: 'Golden Sword', rarity: 2, minPrice: 100, maxPrice: 175, weight: 120, type: 'sword' },
      { name: 'Ender Sword', rarity: 3, minPrice: 200, maxPrice: 250, weight: 80, type: 'sword' },
      { name: 'Diamond Mini Sword', rarity: 3, minPrice: 480, maxPrice: 880, weight: 40, type: 'sword' },
      { name: 'Diamond Sword', rarity: 4, minPrice: 560, maxPrice: 940, weight: 30, type: 'sword' },
      { name: 'Emerald Mini Sword', rarity: 4, minPrice: 1400, maxPrice: 2900, weight: 20, type: 'sword' },
      { name: 'Emerald Sword', rarity: 4, minPrice: 1500, maxPrice: 3000, weight: 15, type: 'sword' }
    ]
  },
  {
    id: 'shooting',
    name: 'SHOOTING CASE',
    price: 40,
    image: 'shootingcase.png',
    items: [
      { name: 'Arrow', rarity: 0, minPrice: 3, maxPrice: 8, weight: 1000, type: 'bow' },
      { name: 'Wooden Bow', rarity: 0, minPrice: 4, maxPrice: 12, weight: 800, type: 'bow' },
      { name: 'Wooden Crossbow', rarity: 1, minPrice: 7, maxPrice: 16, weight: 650, type: 'bow' },
      { name: 'Trident', rarity: 1, minPrice: 13, maxPrice: 22, weight: 400, type: 'bow' },
      { name: 'Golden Arrow', rarity: 2, minPrice: 25, maxPrice: 40, weight: 220, type: 'bow' },
      { name: 'Diamond Arrow', rarity: 3, minPrice: 50, maxPrice: 150, weight: 100, type: 'bow' },
      { name: 'Golden Trident', rarity: 3, minPrice: 450, maxPrice: 650, weight: 75, type: 'bow' },
      { name: 'Emerald Bow', rarity: 4, minPrice: 950, maxPrice: 1500, weight: 45, type: 'bow' },
      { name: 'Emerald Crossbow', rarity: 4, minPrice: 1250, maxPrice: 1750, weight: 30, type: 'bow' },
      { name: 'Emerald Trident', rarity: 4, minPrice: 1500, maxPrice: 2300, weight: 20, type: 'bow' }
    ]
  },
  {
    id: 'music',
    name: 'MUSIC CASE',
    price: 60,
    image: 'musiccase.png',
    items: [
      { name: 'Music Disc 1', rarity: 0, minPrice: 8, maxPrice: 20, weight: 900, type: 'music' },
      { name: 'Music Disc 2', rarity: 1, minPrice: 25, maxPrice: 50, weight: 700, type: 'music' },
      { name: 'Music Disc 3', rarity: 1, minPrice: 25, maxPrice: 51, weight: 650, type: 'music' },
      { name: 'Music Disc 4', rarity: 1, minPrice: 25, maxPrice: 52, weight: 600, type: 'music' },
      { name: 'Music Disc 5', rarity: 2, minPrice: 25, maxPrice: 53, weight: 400, type: 'music' },
      { name: 'Music Disc 6', rarity: 2, minPrice: 25, maxPrice: 54, weight: 350, type: 'music' },
      { name: 'Music Disc 7', rarity: 2, minPrice: 25, maxPrice: 55, weight: 300, type: 'music' },
      { name: 'Music Disc 8', rarity: 3, minPrice: 25, maxPrice: 56, weight: 200, type: 'music' },
      { name: 'Music Disc 9', rarity: 3, minPrice: 200, maxPrice: 330, weight: 120, type: 'music' },
      { name: 'Music Disc 10', rarity: 3, minPrice: 300, maxPrice: 550, weight: 90, type: 'music' },
      { name: 'Music Disc 11', rarity: 4, minPrice: 550, maxPrice: 740, weight: 70, type: 'music' },
      { name: 'Music Disc 12', rarity: 4, minPrice: 800, maxPrice: 1000, weight: 50, type: 'music' },
      { name: 'Music Disc 13', rarity: 4, minPrice: 950, maxPrice: 1100, weight: 40, type: 'music' }
    ]
  },
  {
    id: 'armor',
    name: 'ARMOR CASE',
    price: 110,
    image: 'armorcase.png',
    items: [
      { name: 'Leather Boots', rarity: 0, minPrice: 10, maxPrice: 22, weight: 850, type: 'armor' },
      { name: 'Leather Helmet', rarity: 0, minPrice: 11, maxPrice: 23, weight: 800, type: 'armor' },
      { name: 'Leather Leggings', rarity: 1, minPrice: 13, maxPrice: 25, weight: 700, type: 'armor' },
      { name: 'Leather Chestplate', rarity: 1, minPrice: 15, maxPrice: 25, weight: 650, type: 'armor' },
      { name: 'Iron Boots', rarity: 1, minPrice: 35, maxPrice: 65, weight: 500, type: 'armor' },
      { name: 'Iron Helmet', rarity: 2, minPrice: 35, maxPrice: 65, weight: 400, type: 'armor' },
      { name: 'Iron Leggings', rarity: 2, minPrice: 35, maxPrice: 70, weight: 350, type: 'armor' },
      { name: 'Iron Chestplate', rarity: 2, minPrice: 35, maxPrice: 70, weight: 300, type: 'armor' },
      { name: 'Golden Boots', rarity: 2, minPrice: 50, maxPrice: 80, weight: 250, type: 'armor' },
      { name: 'Chainmail Helmet', rarity: 2, minPrice: 290, maxPrice: 480, weight: 200, type: 'armor' },
      { name: 'Diamond Boots', rarity: 3, minPrice: 730, maxPrice: 850, weight: 150, type: 'armor' },
      { name: 'Diamond Helmet', rarity: 3, minPrice: 750, maxPrice: 860, weight: 120, type: 'armor' },
      { name: 'Diamond Chestplate', rarity: 3, minPrice: 800, maxPrice: 900, weight: 100, type: 'armor' },
      { name: 'Emerald Boots', rarity: 4, minPrice: 1800, maxPrice: 2000, weight: 70, type: 'armor' },
      { name: 'Emerald Helmet', rarity: 4, minPrice: 1900, maxPrice: 2100, weight: 60, type: 'armor' },
      { name: 'Emerald Chestplate', rarity: 4, minPrice: 2100, maxPrice: 2400, weight: 50, type: 'armor' },
      { name: 'Elytra', rarity: 4, minPrice: 2650, maxPrice: 3000, weight: 40, type: 'armor' }
    ]
  },
  {
    id: 'blocks',
    name: 'BLOCKS CASE',
    price: 150,
    image: 'blockscase.png',
    items: [
      { name: 'Workbench', rarity: 0, minPrice: 40, maxPrice: 55, weight: 800, type: 'block' },
      { name: 'Chest', rarity: 0, minPrice: 55, maxPrice: 60, weight: 750, type: 'block' },
      { name: 'Furnace', rarity: 1, minPrice: 55, maxPrice: 65, weight: 650, type: 'block' },
      { name: 'Iron Block', rarity: 1, minPrice: 70, maxPrice: 95, weight: 550, type: 'block' },
      { name: 'Bookshelf', rarity: 2, minPrice: 80, maxPrice: 100, weight: 400, type: 'block' },
      { name: 'Pumpkin', rarity: 2, minPrice: 90, maxPrice: 110, weight: 350, type: 'block' },
      { name: 'Redstone Block', rarity: 2, minPrice: 100, maxPrice: 120, weight: 300, type: 'block' },
      { name: 'Golden Block', rarity: 2, minPrice: 300, maxPrice: 550, weight: 250, type: 'block' },
      { name: 'Obsidian Block', rarity: 3, minPrice: 700, maxPrice: 800, weight: 180, type: 'block' },
      { name: 'TNT', rarity: 3, minPrice: 820, maxPrice: 900, weight: 150, type: 'block' },
      { name: 'Diamond Block', rarity: 3, minPrice: 2000, maxPrice: 2300, weight: 100, type: 'block' },
      { name: 'Slime Block', rarity: 4, minPrice: 2300, maxPrice: 2800, weight: 70, type: 'block' },
      { name: 'Ender Chest', rarity: 4, minPrice: 2600, maxPrice: 3200, weight: 60, type: 'block' },
      { name: 'Emerald Block', rarity: 4, minPrice: 8200, maxPrice: 8800, weight: 30, type: 'block' },
      { name: 'Beacon', rarity: 4, minPrice: 8500, maxPrice: 9300, weight: 25, type: 'block' }
    ]
  },
  {
    id: 'potion',
    name: 'POTION CASE',
    price: 350,
    image: 'potioncase.png',
    items: [
      { name: 'Potion of Swiftness', rarity: 1, minPrice: 50, maxPrice: 100, weight: 600, type: 'potion' },
      { name: 'Potion of Strength', rarity: 1, minPrice: 60, maxPrice: 110, weight: 550, type: 'potion' },
      { name: 'Potion of Healing', rarity: 2, minPrice: 100, maxPrice: 200, weight: 400, type: 'potion' },
      { name: 'Potion of Fire Resistance', rarity: 2, minPrice: 120, maxPrice: 220, weight: 350, type: 'potion' },
      { name: 'Potion of Invisibility', rarity: 2, minPrice: 150, maxPrice: 250, weight: 300, type: 'potion' },
      { name: 'Potion of Night Vision', rarity: 2, minPrice: 140, maxPrice: 240, weight: 280, type: 'potion' },
      { name: 'Potion of Regeneration', rarity: 3, minPrice: 300, maxPrice: 500, weight: 200, type: 'potion' },
      { name: 'Potion of Leaping', rarity: 3, minPrice: 280, maxPrice: 480, weight: 180, type: 'potion' },
      { name: 'Potion of Water Breathing', rarity: 3, minPrice: 320, maxPrice: 520, weight: 150, type: 'potion' },
      { name: 'Potion of Luck', rarity: 4, minPrice: 800, maxPrice: 1200, weight: 80, type: 'potion' },
      { name: 'Potion of Absorption', rarity: 4, minPrice: 850, maxPrice: 1300, weight: 70, type: 'potion' },
      { name: 'Dragon Breath', rarity: 4, minPrice: 1500, maxPrice: 2500, weight: 40, type: 'potion' }
    ]
  },
  {
    id: 'emerald',
    name: 'EMERALD CASE',
    price: 600,
    image: 'emeraldcase.png',
    items: [
      { name: 'Emerald Arrow', rarity: 3, minPrice: 400, maxPrice: 600, weight: 300, type: 'bow' },
      { name: 'Emerald Shield', rarity: 3, minPrice: 500, maxPrice: 700, weight: 280, type: 'armor' },
      { name: 'Emerald Boots', rarity: 3, minPrice: 600, maxPrice: 800, weight: 250, type: 'armor' },
      { name: 'Emerald Helmet', rarity: 4, minPrice: 800, maxPrice: 1200, weight: 200, type: 'armor' },
      { name: 'Emerald Leggings', rarity: 4, minPrice: 900, maxPrice: 1300, weight: 180, type: 'armor' },
      { name: 'Emerald Chestplate', rarity: 4, minPrice: 1000, maxPrice: 1500, weight: 150, type: 'armor' },
      { name: 'Emerald Mini Sword', rarity: 4, minPrice: 1200, maxPrice: 1800, weight: 120, type: 'sword' },
      { name: 'Emerald Sword', rarity: 4, minPrice: 1500, maxPrice: 2200, weight: 100, type: 'sword' },
      { name: 'Emerald Bow', rarity: 4, minPrice: 1400, maxPrice: 2000, weight: 90, type: 'bow' },
      { name: 'Emerald Crossbow', rarity: 4, minPrice: 1600, maxPrice: 2300, weight: 80, type: 'bow' },
      { name: 'Emerald Trident', rarity: 4, minPrice: 1800, maxPrice: 2500, weight: 70, type: 'bow' },
      { name: 'Emerald Block', rarity: 4, minPrice: 2500, maxPrice: 3500, weight: 50, type: 'block' }
    ]
  },
  {
    id: 'super',
    name: 'SUPER CASE',
    price: 1000,
    image: 'supercase.png',
    items: [
      { name: 'Diamond Sword', rarity: 3, minPrice: 800, maxPrice: 1200, weight: 200, type: 'sword' },
      { name: 'Diamond Chestplate', rarity: 3, minPrice: 900, maxPrice: 1300, weight: 180, type: 'armor' },
      { name: 'Ender Chest', rarity: 3, minPrice: 1000, maxPrice: 1500, weight: 160, type: 'block' },
      { name: 'Dragon Breath', rarity: 4, minPrice: 1500, maxPrice: 2500, weight: 120, type: 'potion' },
      { name: 'Emerald Sword', rarity: 4, minPrice: 2000, maxPrice: 3000, weight: 100, type: 'sword' },
      { name: 'Emerald Chestplate', rarity: 4, minPrice: 2200, maxPrice: 3200, weight: 90, type: 'armor' },
      { name: 'Elytra', rarity: 4, minPrice: 2800, maxPrice: 4000, weight: 80, type: 'armor' },
      { name: 'Beacon', rarity: 4, minPrice: 5000, maxPrice: 7000, weight: 70, type: 'block' },
      { name: 'Nether Star', rarity: 5, minPrice: 8000, maxPrice: 12000, weight: 50, type: 'resource' },
      { name: 'Divine Sword', rarity: 5, minPrice: 10000, maxPrice: 15000, weight: 30, type: 'sword' },
      { name: 'Divine Armor Set', rarity: 5, minPrice: 12000, maxPrice: 18000, weight: 20, type: 'armor' }
    ]
  }
];

const MinecraftCaseSimulator = () => {
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonItem, setWonItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [lastDaily, setLastDaily] = useState(null);
  const [dailyStreak, setDailyStreak] = useState(1);
  const [spinItems, setSpinItems] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [lastShopRefresh, setLastShopRefresh] = useState(null);
  
  const spinAudioRef = useRef(null);
  const openedAudioRef = useRef(null);
  const buttonAudioRef = useRef(null);
  const selectAudioRef = useRef(null);
  const soldAudioRef = useRef(null);

  const generateShopItems = () => {
    const allItems = CASES.flatMap(c => 
      c.items.filter(item => item.rarity >= 2).map(item => ({
        ...item,
        shopPrice: Math.round(item.maxPrice * 1.5)
      }))
    );
    
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const moneyData = await window.storage.get('money');
        const invData = await window.storage.get('inventory');
        const dailyData = await window.storage.get('last-daily');
        const streakData = await window.storage.get('daily-streak');
        const shopData = await window.storage.get('shop-items');
        const shopRefreshData = await window.storage.get('shop-refresh');
        
        if (moneyData) setMoney(parseFloat(moneyData.value));
        else setMoney(100);
        
        if (invData) setInventory(JSON.parse(invData.value));
        if (dailyData) setLastDaily(dailyData.value);
        if (streakData) setDailyStreak(parseInt(streakData.value));
        
        const today = new Date().toDateString();
        if (shopRefreshData && shopRefreshData.value === today && shopData) {
          setShopItems(JSON.parse(shopData.value));
          setLastShopRefresh(today);
        } else {
          const newShopItems = generateShopItems();
          setShopItems(newShopItems);
          setLastShopRefresh(today);
          window.storage.set('shop-items', JSON.stringify(newShopItems));
          window.storage.set('shop-refresh', today);
        }
      } catch {
        setMoney(100);
        const newShopItems = generateShopItems();
        setShopItems(newShopItems);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (money !== null) {
      window.storage.set('money', money.toString()).catch(() => {});
    }
  }, [money]);

  useEffect(() => {
    if (inventory.length >= 0) {
      window.storage.set('inventory', JSON.stringify(inventory)).catch(() => {});
    }
  }, [inventory]);

  const claimDaily = () => {
    const today = new Date().toDateString();
    if (lastDaily !== today) {
      playSound(buttonAudioRef);
      const reward = dailyStreak * 100;
      setMoney(m => m + reward);
      setLastDaily(today);
      setDailyStreak(s => s + 1);
      window.storage.set('last-daily', today);
      window.storage.set('daily-streak', (dailyStreak + 1).toString());
    }
  };

  const playSound = (ref) => {
    if (ref?.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const formatMoney = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${Math.floor(amount)}`;
  };

  const selectRandomItem = (caseData) => {
    const totalWeight = caseData.items.reduce((a, b) => a + b.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of caseData.items) {
      random -= item.weight;
      if (random <= 0) return { ...item };
    }
    return { ...caseData.items[0] };
  };

  const openCase = () => {
    if (money < selectedCase.price) return;
    
    playSound(buttonAudioRef);
    setMoney(money - selectedCase.price);
    
    const finalItem = selectRandomItem(selectedCase);
    const items = [];
    
    for (let i = 0; i < 30; i++) {
      items.push(selectRandomItem(selectedCase));
    }
    
    items.push(finalItem);
    
    for (let i = 0; i < 15; i++) {
      items.push(selectRandomItem(selectedCase));
    }
    
    setSpinItems(items);
    setIsSpinning(true);
    
    setTimeout(() => playSound(spinAudioRef), 100);

    setTimeout(() => {
      const durability = Math.floor(Math.random() * 100) + 1;
      const itemValue = finalItem.minPrice + (finalItem.maxPrice - finalItem.minPrice) * (durability / 100);
      
      const newItem = {
        ...finalItem,
        durability,
        value: Math.round(itemValue * 100) / 100,
        id: Date.now()
      };
      
      setWonItem(newItem);
      setInventory([...inventory, newItem]);
      setIsSpinning(false);
      setShowWinScreen(true);
      playSound(openedAudioRef);
    }, 4200);
  };

  const buyShopItem = (item) => {
    if (money < item.shopPrice) return;
    
    playSound(buttonAudioRef);
    setMoney(money - item.shopPrice);
    
    const durability = 100;
    const newItem = {
      ...item,
      durability,
      value: item.maxPrice,
      id: Date.now()
    };
    
    setInventory([...inventory, newItem]);
  };

  const closeWinScreen = () => {
    playSound(buttonAudioRef);
    setShowWinScreen(false);
    setWonItem(null);
  };

  const toggleItemSelection = (itemId) => {
    playSound(selectAudioRef);
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const sellItems = () => {
    if (selectedItems.length === 0) return;
    playSound(soldAudioRef);
    const totalValue = inventory
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.value, 0);
    setMoney(money + totalValue);
    setInventory(inventory.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const today = new Date().toDateString();
  const canClaimDaily = lastDaily !== today;
  const dailyReward = dailyStreak * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0e1434',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <audio ref={spinAudioRef} src="media/spin.webm" />
      <audio ref={openedAudioRef} src="media/caseopened.webm" />
      <audio ref={buttonAudioRef} src="media/buttonclicked.webm" />
      <audio ref={selectAudioRef} src="media/itemselected.webm" />
      <audio ref={soldAudioRef} src="media/itemssold.webm" />

      {/* Top Bar */}
      <div style={{
        background: '#121a46',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => { playSound(buttonAudioRef); setActiveTab('inventory'); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'inventory' ? '#35c895' : 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: activeTab === 'inventory' ? '3px solid #35c895' : 'none',
              transition: 'all 0.3s'
            }}
          >
            INVENTORY
          </button>
          <button
            onClick={() => { playSound(buttonAudioRef); setActiveTab('cases'); setSelectedCase(null); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'cases' ? '#35c895' : 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: activeTab === 'cases' ? '3px solid #35c895' : 'none',
              transition: 'all 0.3s'
            }}
          >
            CASES
          </button>
          <button
            onClick={() => { playSound(buttonAudioRef); setActiveTab('shop'); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'shop' ? '#35c895' : 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 0',
              borderBottom: activeTab === 'shop' ? '3px solid #35c895' : 'none',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={16} />
            SHOP
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {canClaimDaily && (
            <button
              onClick={claimDaily}
              style={{
                background: 'linear-gradient(135deg, #35c895, #2aa876)',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
                padding: '10px 24px',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(53, 200, 149, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(53, 200, 149, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(53, 200, 149, 0.4)';
              }}
            >
              ▶ ${dailyReward} FREE
            </button>
          )}
          
          <button
            onClick={() => playSound(buttonAudioRef)}
            style={{
              background: 'linear-gradient(135deg, #35c895, #2aa876)',
              border: 'none',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(53, 200, 149, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <Star fill="black" color="black" size={22} />
          </button>

          <div style={{ 
            fontSize: '22px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #35c895, #2aa876)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {formatMoney(money)}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      {activeTab === 'cases' && !selectedCase && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          padding: '40px',
          maxWidth: '1000px',
          margin: '0 auto',
          justifyContent: 'center'
        }}>
          {CASES.map(caseItem => (
            <div
              key={caseItem.id}
              onClick={() => { playSound(buttonAudioRef); setSelectedCase(caseItem); }}
              style={{
                background: 'linear-gradient(135deg, #212644, #2d3250)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                width: '170px',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
                border: '2px solid rgba(53, 200, 149, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(53,200,149,0.3)';
                e.currentTarget.style.borderColor = '#35c895';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = 'rgba(53, 200, 149, 0.1)';
              }}
            >
              <img 
                src={`images/${caseItem.image}`} 
                alt={caseItem.name}
                style={{
                  width: '100%',
                  height: '130px',
                  objectFit: 'contain',
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              />
              <div style={{
                fontSize: '11px',
                textAlign: 'center',
                marginBottom: '10px',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                {caseItem.name}
              </div>
              <div style={{
                fontSize: '18px',
                textAlign: 'center',
                color: '#35c895',
                fontWeight: 'bold'
              }}>
                ${caseItem.price}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Case View */}
      {activeTab === 'cases' && selectedCase && !isSpinning && !showWinScreen && (
        <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={() => { playSound(buttonAudioRef); setSelectedCase(null); }}
              style={{
                background: 'rgba(53, 200, 149, 0.15)',
                border: '2px solid #35c895',
                color: '#35c895',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 28px',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#35c895';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(53, 200, 149, 0.15)';
                e.currentTarget.style.color = '#35c895';
              }}
            >
              <ArrowLeft size={18} />
              BACK
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
              {selectedCase.name}
            </h2>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1a2147 0%, #252d52 100%)',
            borderRadius: '24px',
            padding: '50px 30px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            border: '3px solid #2a3157',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderTop: '36px solid #35c895',
              filter: 'drop-shadow(0 4px 8px rgba(53, 200, 149, 0.5))'
            }} />

            <div style={{
              display: 'flex',
              gap: '24px',
              overflowX: 'auto',
              padding: '20px 40px',
              justifyContent: 'center',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {selectedCase.items.filter(item => item.rarity >= 1).slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: '150px',
                    background: `linear-gradient(180deg, ${RARITIES[item.rarity].bgColor}50 0%, transparent 100%)`,
                    borderRadius: '20px',
                    padding: '28px 20px',
                    border: `3px solid ${RARITIES[item.rarity].color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: `0 0 20px ${RARITIES[item.rarity].color}30`,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 0 30px ${RARITIES[item.rarity].color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 0 20px ${RARITIES[item.rarity].color}30`;
                  }}
                >
                  <ItemSVG type={item.type} rarity={item.rarity} size={70} />
                  <div style={{ fontSize: '11px', textAlign: 'center', fontWeight: '600', marginTop: '12px' }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={openCase}
              disabled={money < selectedCase.price}
              style={{
                background: money >= selectedCase.price 
                  ? 'linear-gradient(135deg, #35c895, #2aa876)' 
                  : 'linear-gradient(135deg, #555, #444)',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '18px 90px',
                borderRadius: '50px',
                cursor: money >= selectedCase.price ? 'pointer' : 'not-allowed',
                opacity: money >= selectedCase.price ? 1 : 0.5,
                boxShadow: money >= selectedCase.price 
                  ? '0 6px 25px rgba(53,200,149,0.5)' 
                  : 'none',
                transition: 'all 0.3s',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                if (money >= selectedCase.price) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 35px rgba(53,200,149,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (money >= selectedCase.price) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(53,200,149,0.5)';
                }
              }}
            >
              OPEN (${selectedCase.price})
            </button>
          </div>
        </div>
      )}

      {/* Spinning Animation */}
      {isSpinning && (
        <div style={{ padding: '60px 0', maxWidth: '100%', margin: '0 auto', overflow: 'hidden' }}>
          <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '50px', fontWeight: 'bold', letterSpacing: '1px' }}>
            {selectedCase.name}
          </h2>

          <div style={{
            background: 'linear-gradient(135deg, #1a2147 0%, #252d52 100%)',
            borderRadius: '24px',
            padding: '60px 0',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 40px',
            border: '3px solid #2a3157',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '5px',
              height: '75%',
              background: 'linear-gradient(to bottom, transparent, #35c895 20%, #35c895 80%, transparent)',
              zIndex: 10,
              boxShadow: '0 0 30px #35c895',
              borderRadius: '10px'
            }} />

            <div style={{
              display: 'flex',
              gap: '24px',
              animation: 'slideLeft 4s cubic-bezier(0.22, 0.61, 0.36, 1)',
              paddingLeft: 'calc(50% - 100px)'
            }}>
              {spinItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: '180px',
                    background: `linear-gradient(180deg, ${RARITIES[item.rarity].bgColor}60 0%, ${RARITIES[item.rarity].bgColor}20 100%)`,
                    borderRadius: '20px',
                    padding: '30px 24px',
                    border: `4px solid ${RARITIES[item.rarity].color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: `0 0 25px ${RARITIES[item.rarity].color}50`,
                    flexShrink: 0
                  }}
                >
                  <ItemSVG type={item.type} rarity={item.rarity} size={90} />
                  <div style={{ fontSize: '13px', textAlign: 'center', fontWeight: '700', marginTop: '14px' }}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes slideLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-180px * 30 - 24px * 30)); }
            }
          `}</style>
        </div>
      )}

      {/* Win Screen */}
      {showWinScreen && wonItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.96)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', position: 'relative', maxWidth: '500px' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: `radial-gradient(circle, ${RARITIES[wonItem.rarity].color}35, transparent 70%)`,
              animation: 'glow 2.5s ease-in-out infinite',
              pointerEvents: 'none'
            }} />

            {RARITIES[wonItem.rarity].sparkle && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                height: '500px',
                background: `conic-gradient(from 0deg, ${RARITIES[wonItem.rarity].color}, transparent, ${RARITIES[wonItem.rarity].color})`,
                borderRadius: '50%',
                animation: 'rotate 5s linear infinite',
                opacity: 0.4,
                pointerEvents: 'none'
              }} />
            )}

            <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '2px' }}>
              YOU WON
            </div>

            <div style={{
              fontSize: '32px',
              color: '#35c895',
              fontWeight: 'bold',
              marginBottom: '40px'
            }}>
              ${wonItem.value.toFixed(2)}
            </div>

            <div style={{
              width: '240px',
              height: '240px',
              background: `linear-gradient(135deg, ${RARITIES[wonItem.rarity].color}, ${RARITIES[wonItem.rarity].bgColor})`,
              borderRadius: '30px',
              margin: '0 auto 35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 25px 70px ${RARITIES[wonItem.rarity].color}70`,
              animation: 'float 3.5s ease-in-out infinite',
              position: 'relative',
              zIndex: 1,
              padding: '20px'
            }}>
              <ItemSVG type={wonItem.type} rarity={wonItem.rarity} size={160} />
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${RARITIES[wonItem.rarity].color}, ${RARITIES[wonItem.rarity].bgColor})`,
              color: 'white',
              padding: '14px 40px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '24px',
              letterSpacing: '0.5px'
            }}>
              {wonItem.name}
            </div>

            <div style={{
              width: '240px',
              height: '10px',
              background: '#1a1a2e',
              borderRadius: '50px',
              margin: '0 auto 10px',
              overflow: 'hidden',
              border: '2px solid #2a2a4e'
            }}>
              <div style={{
                width: `${wonItem.durability}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${wonItem.durability > 70 ? '#22c55e' : wonItem.durability > 30 ? '#fbbf24' : '#ef4444'}, ${wonItem.durability > 70 ? '#16a34a' : wonItem.durability > 30 ? '#f59e0b' : '#dc2626'})`,
                borderRadius: '50px',
                boxShadow: `0 0 10px ${wonItem.durability > 70 ? '#22c55e' : wonItem.durability > 30 ? '#fbbf24' : '#ef4444'}`
              }} />
            </div>
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '50px', fontWeight: '600' }}>
              Durability: {wonItem.durability}%
            </div>

            <button
              onClick={closeWinScreen}
              style={{
                background: 'linear-gradient(135deg, #35c895, #2aa876)',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '16px 70px',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 6px 25px rgba(53,200,149,0.5)',
                transition: 'all 0.3s',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 35px rgba(53,200,149,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(53,200,149,0.5)';
              }}
            >
              OK
            </button>
          </div>

          <style>{`
            @keyframes glow {
              0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.75; transform: translate(-50%, -50%) scale(1.08); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(-4deg); }
              50% { transform: translateY(-18px) rotate(4deg); }
            }
            @keyframes rotate {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', letterSpacing: '1px' }}>
              DAILY SHOP
            </h2>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Items refresh every day
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {shopItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, #212644, #2d3250)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: `3px solid ${RARITIES[item.rarity].color}`,
                  boxShadow: `0 8px 25px ${RARITIES[item.rarity].color}20`,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 15px 40px ${RARITIES[item.rarity].color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${RARITIES[item.rarity].color}20`;
                }}
              >
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, ${RARITIES[item.rarity].color}, ${RARITIES[item.rarity].bgColor})`,
                  borderRadius: '16px',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}>
                  <ItemSVG type={item.type} rarity={item.rarity} size={70} />
                </div>

                <div style={{
                  fontSize: '12px',
                  textAlign: 'center',
                  marginBottom: '12px',
                  fontWeight: '600',
                  color: RARITIES[item.rarity].color
                }}>
                  {item.name}
                </div>

                <button
                  onClick={() => buyShopItem(item)}
                  disabled={money < item.shopPrice}
                  style={{
                    width: '100%',
                    background: money >= item.shopPrice 
                      ? 'linear-gradient(135deg, #35c895, #2aa876)'
                      : 'linear-gradient(135deg, #555, #444)',
                    border: 'none',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: money >= item.shopPrice ? 'pointer' : 'not-allowed',
                    opacity: money >= item.shopPrice ? 1 : 0.5,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (money >= item.shopPrice) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (money >= item.shopPrice) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  BUY ${item.shopPrice}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory */}
      {activeTab === 'inventory' && (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '35px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>
              Items: {inventory.length}
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={sellItems}
                style={{
                  background: 'linear-gradient(135deg, #35c895, #2aa876)',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '14px 45px',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 25px rgba(53,200,149,0.5)',
                  transition: 'all 0.3s',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 35px rgba(53,200,149,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(53,200,149,0.5)';
                }}
              >
                SELL ($
                {inventory.filter(item => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.value, 0).toFixed(2)})
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '20px'
          }}>
            {inventory.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                style={{
                  background: selectedItems.includes(item.id)
                    ? `linear-gradient(180deg, ${RARITIES[item.rarity].bgColor}70 0%, #2d3250 100%)`
                    : 'linear-gradient(135deg, #212644, #2d3250)',
                  borderRadius: '20px',
                  padding: '22px',
                  cursor: 'pointer',
                  border: `3px solid ${selectedItems.includes(item.id) ? RARITIES[item.rarity].color : 'transparent'}`,
                  transition: 'all 0.3s',
                  position: 'relative',
                  boxShadow: selectedItems.includes(item.id) 
                    ? `0 0 25px ${RARITIES[item.rarity].color}50` 
                    : '0 4px 15px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#35c895',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '4px 10px',
                  borderRadius: '50px'
                }}>
                  ${item.value.toFixed(2)}
                </div>

                <div style={{
                  width: '90px',
                  height: '90px',
                  background: `linear-gradient(135deg, ${RARITIES[item.rarity].color}, ${RARITIES[item.rarity].bgColor})`,
                  borderRadius: '16px',
                  margin: '24px auto 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px'
                }}>
                  <ItemSVG type={item.type} rarity={item.rarity} size={65} />
                </div>

                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#1a1a2e',
                  borderRadius: '50px',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  border: '1px solid #2a2a4e'
                }}>
                  <div style={{
                    width: `${item.durability}%`,
                    height: '100%',
                    background: item.durability > 70 ? '#22c55e' : item.durability > 30 ? '#fbbf24' : '#ef4444',
                    borderRadius: '50px'
                  }} />
                </div>

                <div style={{
                  fontSize: '11px',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: RARITIES[item.rarity].color
                }}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {inventory.length === 0 && (
            <div style={{
              textAlign: 'center',
              fontSize: '18px',
              color: '#666',
              marginTop: '120px',
              fontWeight: '600'
            }}>
              Your inventory is empty. Open some cases!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinecraftCaseSimulator;
