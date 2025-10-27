/**
 * MenuBlock Preset Configurations
 * Pre-designed style templates for different restaurant themes
 */

// Import Google Fonts dynamically
const loadGoogleFont = (fontFamily) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
  link.rel = 'stylesheet';
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link);
  }
};

// Load all fonts used in presets
const PRESET_FONTS = [
  'Georgia',
  'Work Sans',
  'Inter',
  'Caveat',
  'Montserrat',
  'Roboto',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Pacifico',
  'Bebas Neue',
  'Oswald',
  'Raleway',
  'Ubuntu'
];

// Auto-load fonts on import
PRESET_FONTS.forEach(font => {
  if (font !== 'Georgia') { // Georgia is a system font
    loadGoogleFont(font);
  }
});

export const MENU_PRESETS = {
  classic: {
    name: 'Classic',
    description: 'Warm, traditional restaurant menu with serif fonts',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNGNUYxRUEiLz48L3N2Zz4=',
    styles: {
      preset: 'classic',
      background: {
        type: 'color',
        value: '#F5F1EA'
      },
      font: {
        family: 'Georgia',
        headlineSize: 22,
        bodySize: 13,
        weight: '400',
        headlineColor: '#3E2723',
        bodyColor: '#5D4037',
        priceColor: '#3E2723'
      },
      accentColor: '#8D6E63',
      priceAlign: 'left',
      currency: '₹',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: '#BCAAA4',
        indent: 0
      }
    },
    layout: {
      padding: 24,
      gap: 10
    }
  },

  modern: {
    name: 'Modern',
    description: 'Contemporary design with bold typography and clean lines',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiMyMTIxMjEiLz48L3N2Zz4=',
    styles: {
      preset: 'modern',
      background: {
        type: 'color',
        value: '#212121'
      },
      font: {
        family: 'Work Sans',
        headlineSize: 24,
        bodySize: 14,
        weight: '600',
        headlineColor: '#FFFFFF',
        bodyColor: '#B0BEC5',
        priceColor: '#E53935'
      },
      accentColor: '#E53935',
      priceAlign: 'right',
      currency: '₹',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: '#E53935',
        indent: 0
      }
    },
    layout: {
      padding: 20,
      gap: 8
    }
  },

  minimal: {
    name: 'Minimal',
    description: 'Clean, spacious layout with subtle styling',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=',
    styles: {
      preset: 'minimal',
      background: {
        type: 'color',
        value: '#FFFFFF'
      },
      font: {
        family: 'Inter',
        headlineSize: 20,
        bodySize: 11,
        weight: '400',
        headlineColor: '#263238',
        bodyColor: '#78909C',
        priceColor: '#263238'
      },
      accentColor: '#90A4AE',
      priceAlign: 'right',
      currency: '₹',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: '#ECEFF1',
        indent: 12
      }
    },
    layout: {
      padding: 28,
      gap: 12
    }
  },

  chalkboard: {
    name: 'Chalkboard',
    description: 'Hand-drawn style with textured background',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiMyQzM5MzAiLz48L3N2Zz4=',
    styles: {
      preset: 'chalkboard',
      background: {
        type: 'color',
        value: '#2C3930'
      },
      font: {
        family: 'Caveat',
        headlineSize: 26,
        bodySize: 14,
        weight: '600',
        headlineColor: '#FFFFFF',
        bodyColor: '#C5E1A5',
        priceColor: '#FFE082'
      },
      accentColor: '#AED581',
      priceAlign: 'right',
      currency: '₹',
      divider: {
        show: true,
        style: 'dashed',
        thickness: 1,
        color: '#7CB342',
        indent: 8
      }
    },
    layout: {
      padding: 20,
      gap: 10
    }
  },

  bold: {
    name: 'Bold',
    description: 'Vibrant colors with high-impact typography',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNGRjU3MjIiLz48L3N2Zz4=',
    styles: {
      preset: 'bold',
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FF5722 0%, #FFC107 100%)'
      },
      font: {
        family: 'Montserrat',
        headlineSize: 26,
        bodySize: 14,
        weight: '700',
        headlineColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        priceColor: '#FFEB3B'
      },
      accentColor: '#FFEB3B',
      priceAlign: 'right',
      currency: '₹',
      divider: {
        show: false,
        style: 'solid',
        thickness: 0,
        color: '#FFFFFF',
        indent: 0
      }
    },
    layout: {
      padding: 18,
      gap: 8
    }
  },

  // NEW PRESET: Elegant with food image background
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated with blurred food background',
    thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=120&h=80&fit=crop',
    styles: {
      preset: 'elegant',
      background: {
        type: 'image',
        value: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: 'rgba(0, 0, 0, 0.65)' // Dark overlay for text readability
      },
      font: {
        family: 'Playfair Display',
        headlineSize: 24,
        bodySize: 12,
        weight: '600',
        headlineColor: '#FFFFFF',
        bodyColor: '#E0E0E0',
        priceColor: '#FFD700'
      },
      accentColor: '#FFD700',
      priceAlign: 'right',
      currency: '$',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: 'rgba(255, 215, 0, 0.3)',
        indent: 0
      }
    },
    layout: {
      padding: 32,
      gap: 14
    }
  },

  // NEW PRESET: Rustic with wood texture
  rustic: {
    name: 'Rustic',
    description: 'Warm wooden texture with handwritten fonts',
    thumbnail: 'https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?w=120&h=80&fit=crop',
    styles: {
      preset: 'rustic',
      background: {
        type: 'image',
        value: 'https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: 'rgba(255, 248, 240, 0.75)' // Light warm overlay
      },
      font: {
        family: 'Merriweather',
        headlineSize: 22,
        bodySize: 12,
        weight: '700',
        headlineColor: '#2C1810',
        bodyColor: '#5D4037',
        priceColor: '#BF360C'
      },
      accentColor: '#BF360C',
      priceAlign: 'left',
      currency: '€',
      divider: {
        show: true,
        style: 'dashed',
        thickness: 2,
        color: 'rgba(191, 54, 12, 0.4)',
        indent: 10
      }
    },
    layout: {
      padding: 28,
      gap: 12
    }
  },

  // NEW PRESET: Luxury
  luxury: {
    name: 'Luxury',
    description: 'Premium gold and black design',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiMwMDAwMDAiLz48L3N2Zz4=',
    styles: {
      preset: 'luxury',
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)'
      },
      font: {
        family: 'Playfair Display',
        headlineSize: 26,
        bodySize: 13,
        weight: '600',
        headlineColor: '#D4AF37',
        bodyColor: '#B8B8B8',
        priceColor: '#D4AF37'
      },
      accentColor: '#D4AF37',
      priceAlign: 'right',
      currency: '$',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: '#D4AF37',
        indent: 0
      }
    },
    layout: {
      padding: 32,
      gap: 16
    }
  },

  // NEW PRESET: Fresh (Green theme)
  fresh: {
    name: 'Fresh',
    description: 'Bright and healthy with green accents',
    thumbnail: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?w=120&h=80&fit=crop',
    styles: {
      preset: 'fresh',
      background: {
        type: 'image',
        value: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: 'rgba(255, 255, 255, 0.80)' // Bright white overlay for clean look
      },
      font: {
        family: 'Poppins',
        headlineSize: 22,
        bodySize: 12,
        weight: '600',
        headlineColor: '#1B5E20',
        bodyColor: '#2E7D32',
        priceColor: '#558B2F'
      },
      accentColor: '#7CB342',
      priceAlign: 'right',
      currency: '₹',
      divider: {
        show: true,
        style: 'solid',
        thickness: 2,
        color: 'rgba(124, 179, 66, 0.3)',
        indent: 0
      }
    },
    layout: {
      padding: 24,
      gap: 12
    }
  },

  // NEW PRESET: Street Food
  street: {
    name: 'Street Food',
    description: 'Bold and energetic urban style',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNGRjlDMDAiLz48L3N2Zz4=',
    styles: {
      preset: 'street',
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)'
      },
      font: {
        family: 'Bebas Neue',
        headlineSize: 28,
        bodySize: 13,
        weight: '400',
        headlineColor: '#FFFFFF',
        bodyColor: '#FFF3E0',
        priceColor: '#FFEB3B'
      },
      accentColor: '#FFEB3B',
      priceAlign: 'left',
      currency: '₹',
      divider: {
        show: false,
        style: 'solid',
        thickness: 0,
        color: '#FFFFFF',
        indent: 0
      }
    },
    layout: {
      padding: 20,
      gap: 10
    }
  },

  // NEW PRESET: Cafe
  cafe: {
    name: 'Cafe',
    description: 'Cozy coffee shop vibe with warm tones',
    thumbnail: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=120&h=80&fit=crop',
    styles: {
      preset: 'cafe',
      background: {
        type: 'image',
        value: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: 'rgba(245, 237, 220, 0.70)' // Warm cream overlay for coziness
      },
      font: {
        family: 'Lora',
        headlineSize: 22,
        bodySize: 12,
        weight: '500',
        headlineColor: '#3E2723',
        bodyColor: '#5D4037',
        priceColor: '#6D4C41'
      },
      accentColor: '#8D6E63',
      priceAlign: 'right',
      currency: '$',
      divider: {
        show: true,
        style: 'dotted',
        thickness: 2,
        color: 'rgba(109, 76, 65, 0.4)',
        indent: 15
      }
    },
    layout: {
      padding: 26,
      gap: 12
    }
  },

  // NEW PRESET: Ocean (Seafood theme)
  ocean: {
    name: 'Ocean',
    description: 'Fresh seafood with blue ocean theme',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiMwMDY2ODgiLz48L3N2Zz4=',
    styles: {
      preset: 'ocean',
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #006064 0%, #00838F 50%, #0097A7 100%)'
      },
      font: {
        family: 'Raleway',
        headlineSize: 24,
        bodySize: 13,
        weight: '600',
        headlineColor: '#FFFFFF',
        bodyColor: '#B2EBF2',
        priceColor: '#80DEEA'
      },
      accentColor: '#26C6DA',
      priceAlign: 'right',
      currency: '$',
      divider: {
        show: true,
        style: 'solid',
        thickness: 1,
        color: 'rgba(128, 222, 234, 0.3)',
        indent: 0
      }
    },
    layout: {
      padding: 24,
      gap: 12
    }
  },

  // NEW PRESET: Vintage
  vintage: {
    name: 'Vintage',
    description: 'Classic retro diner style',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNGRkU3Q0UiLz48L3N2Zz4=',
    styles: {
      preset: 'vintage',
      background: {
        type: 'color',
        value: '#FFE7CE'
      },
      font: {
        family: 'Ubuntu',
        headlineSize: 24,
        bodySize: 13,
        weight: '500',
        headlineColor: '#8B4513',
        bodyColor: '#A0522D',
        priceColor: '#D2691E'
      },
      accentColor: '#CD853F',
      priceAlign: 'left',
      currency: '₹',
      divider: {
        show: true,
        style: 'dashed',
        thickness: 2,
        color: '#DEB887',
        indent: 8
      }
    },
    layout: {
      padding: 26,
      gap: 12
    }
  }
};

// Get preset by name
export const getPreset = (presetName) => {
  return MENU_PRESETS[presetName] || MENU_PRESETS.modern;
};

// Apply preset to menu data (deep merge)
export const applyPreset = (menuData, presetName) => {
  const preset = getPreset(presetName);
  
  return {
    ...menuData,
    meta: {
      ...menuData.meta,
      preset: presetName
    },
    styles: {
      ...menuData.styles,
      ...preset.styles
    },
    layout: {
      ...menuData.layout,
      ...preset.layout
    }
  };
};

// Get all preset names
export const getPresetNames = () => Object.keys(MENU_PRESETS);

// Get all presets as array
export const getAllPresets = () => {
  return Object.entries(MENU_PRESETS).map(([key, preset]) => ({
    id: key,
    ...preset
  }));
};

// Font family options
export const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter', category: 'sans-serif' },
  { value: 'Work Sans', label: 'Work Sans', category: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'sans-serif' },
  { value: 'Poppins', label: 'Poppins', category: 'sans-serif' },
  { value: 'Raleway', label: 'Raleway', category: 'sans-serif' },
  { value: 'Ubuntu', label: 'Ubuntu', category: 'sans-serif' },
  { value: 'Bebas Neue', label: 'Bebas Neue', category: 'sans-serif' },
  { value: 'Oswald', label: 'Oswald', category: 'sans-serif' },
  { value: 'Georgia', label: 'Georgia', category: 'serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'serif' },
  { value: 'Lora', label: 'Lora', category: 'serif' },
  { value: 'Caveat', label: 'Caveat', category: 'handwriting' },
  { value: 'Pacifico', label: 'Pacifico', category: 'handwriting' },
];

// Currency options
export const CURRENCIES = [
  { value: '₹', label: '₹ INR (Rupee)', code: 'INR' },
  { value: '$', label: '$ USD (Dollar)', code: 'USD' },
  { value: '€', label: '€ EUR (Euro)', code: 'EUR' },
  { value: '£', label: '£ GBP (Pound)', code: 'GBP' },
  { value: '¥', label: '¥ JPY (Yen)', code: 'JPY' },
  { value: 'A$', label: 'A$ AUD (Australian Dollar)', code: 'AUD' },
  { value: 'C$', label: 'C$ CAD (Canadian Dollar)', code: 'CAD' },
  { value: 'CHF', label: 'CHF (Swiss Franc)', code: 'CHF' },
];

// Locale options for formatting
export const LOCALES = [
  { value: 'en-IN', label: 'India (en-IN)' },
  { value: 'en-US', label: 'United States (en-US)' },
  { value: 'en-GB', label: 'United Kingdom (en-GB)' },
  { value: 'de-DE', label: 'Germany (de-DE)' },
  { value: 'fr-FR', label: 'France (fr-FR)' },
  { value: 'es-ES', label: 'Spain (es-ES)' },
  { value: 'ja-JP', label: 'Japan (ja-JP)' },
  { value: 'zh-CN', label: 'China (zh-CN)' },
];

