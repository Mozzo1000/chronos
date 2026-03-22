export const TRACKING_CONFIG = [
  { key: 'steps', label: 'Steps', type: 'number', category: 'Physical', icon: 'Footprints', shortcut: false},
  { key: 'weight', label: 'Weight (kg)', type: 'number', category: 'Physical', icon: 'Weight', shortcut: false},
  { key: 'lunch', label: 'Lunch', type: 'select', options: ['Homemade', 'Takeout'], category: 'Finance', icon: 'CookingPot', shortcut: true},
  { key: 'bathroom', label: 'Bathroom', type: 'select', options: ['Nr 1', 'Nr 2', 'Both'], category: 'Health', icon: 'Toilet', shortcut: true},
  { key: 'alcohol', label: 'Alcohol', type: 'select', options: ['Yes', 'No'], category: 'Health', icon: 'Beer', shortcut: true }
];