/**
 * MenuBlock Component
 * Main component for restaurant menu block with drag-and-drop support
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { 
  Menu, 
  GripVertical, 
  Star,
  Settings
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getIcon } from './icons.jsx';
import { getPreset } from './presets';

/**
 * Create default MenuBlock element data
 * Returns schema-compliant default configuration
 */
export const createMenuBlockElement = () => {
  const now = new Date().toISOString();
  
  return {
    id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'menuBlock',
    content: 'menuBlock', // Required by SlideElement interface
    meta: {
      preset: 'modern',
      theme: 'dark',
      createdAt: now
    },
    layout: {
      width: 1920,
      height: 1080,
      columns: 2,
      itemsPerColumn: null,
      padding: 24,
      gap: 12
    },
    styles: {
      preset: 'modern',
      background: {
        type: 'color',
        value: '#212121'
      },
      font: {
        family: 'Work Sans',
        headlineSize: 56,
        bodySize: 28,
        weight: '600',
        headlineColor: '#FFFFFF',
        bodyColor: '#B0BEC5',
        priceColor: '#E53935'
      },
      accentColor: '#E53935',
      priceAlign: 'right',
      currency: '₹',
      icons: {
        veg: 'leaf',
        nonveg: 'chili'
      },
      divider: {
        show: true,
        style: 'solid',
        thickness: 2,
        color: '#E53935',
        indent: 0
      }
    },
    items: [
      {
        id: 'item-1',
        name: 'Veg Thali',
        description: 'Rice, Dal, 2 Veg Curries, Roti',
        price: 199,
        tag: 'veg',
        icon: 'leaf',
        spicy: false
      },
      {
        id: 'item-2',
        name: 'Paneer Butter Masala',
        description: 'House special creamy curry',
        price: 249,
        tag: 'veg',
        icon: 'leaf',
        spicy: true
      },
      {
        id: 'item-3',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 299,
        tag: 'nonveg',
        icon: 'chili',
        spicy: true
      }
    ],
    settings: {
      showDescriptions: true,
      showDivider: true,
      priceDecimals: 0,
      currencyPosition: 'before',
      showIcons: true,
      imageForItem: false
    },
    // For element compatibility
    position: { x: 0, y: 0 },
    size: { width: 960, height: 540 }
  };
};

/**
 * Draggable MenuBlock Card
 * Sidebar catalog item component
 */
export const DraggableMenuBlockCard = ({ element, showLarge = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: { type: 'menuBlock', element }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <TooltipProvider key={element.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all ${
              isDragging ? 'opacity-50' : 'border-transparent'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Menu className="h-12 w-12 text-white opacity-80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold">{element.name || 'Menu Block'}</p>
              </div>
              {/* Drag Handle Indicator */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p className="font-semibold text-sm">Menu Block</p>
          <p className="text-xs text-muted-foreground mt-1">
            Restaurant/cafe menu layout with customizable items and styling
          </p>
          <p className="text-xs text-muted-foreground mt-1">Drag to canvas to add</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Menu Item Renderer
 * Renders a single menu item with all styling
 */
const MenuItemRenderer = ({ item, menuData, zoomLevel = 100, onItemClick }) => {
  const { styles, settings } = menuData;
  const scale = zoomLevel / 100;
  
  // Format price
  const formatPrice = (price) => {
    const formatted = settings.priceDecimals === 0 
      ? Math.round(price).toString()
      : price.toFixed(settings.priceDecimals);
    
    const withCurrency = settings.currencyPosition === 'before'
      ? `${styles.currency}${formatted}`
      : `${formatted}${styles.currency}`;
    
    return withCurrency;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="menu-item relative cursor-pointer hover:bg-black/5 rounded-lg transition-colors"
      style={{
        marginBottom: `${menuData.layout.gap}px`,
        padding: '8px',
      }}
      onClick={() => onItemClick && onItemClick(item.id)}
    >
      <div className="flex items-start gap-3">
        {/* Icon/Image */}
        {settings.showIcons && item.icon && (
          <div className="flex-shrink-0 mt-1">
            {getIcon(item.icon, { 
              className: "w-6 h-6",
              color: item.tag === 'veg' ? '#4CAF50' : '#D32F2F'
            })}
          </div>
        )}
        
        {settings.imageForItem && item.image && (
          <div className="flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`flex items-start justify-between gap-4 ${styles.priceAlign === 'right' ? '' : 'flex-row-reverse'}`}>
            {/* Name & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 
                  style={{
                    fontSize: `${styles.font.headlineSize * scale}px`,
                    fontFamily: styles.font.family,
                    fontWeight: styles.font.weight,
                    color: styles.font.headlineColor || '#1a1a1a',
                    lineHeight: 1.2
                  }}
                  className="font-bold"
                >
                  {item.name}
                </h3>
                
                {/* Badges */}
                {item.spicy && (
                  <Badge variant="destructive" className="text-xs">
                    🌶️ Spicy
                  </Badge>
                )}
              </div>
              
              {settings.showDescriptions && item.description && (
                <p 
                  style={{
                    fontSize: `${styles.font.bodySize * scale}px`,
                    fontFamily: styles.font.family,
                    color: styles.font.bodyColor || '#666666',
                    marginTop: '4px',
                    lineHeight: 1.4
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className={`flex-shrink-0 ${styles.priceAlign === 'right' ? 'text-right' : 'text-left'}`}>
              <span 
                style={{
                  fontSize: `${styles.font.headlineSize * scale}px`,
                  fontFamily: styles.font.family,
                  fontWeight: '700',
                  color: styles.font.priceColor || styles.accentColor,
                  lineHeight: 1.2
                }}
                className="font-bold"
              >
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      {settings.showDivider && styles.divider?.show && (
        <div 
          style={{
            marginTop: `${menuData.layout.gap}px`,
            marginLeft: `${styles.divider.indent || 0}px`,
            marginRight: `${styles.divider.indent || 0}px`,
            height: `${styles.divider.thickness || 1}px`,
            backgroundColor: styles.divider.color || '#e0e0e0',
            borderTop: styles.divider.style === 'dashed' ? `${styles.divider.thickness || 1}px dashed ${styles.divider.color}` : 'none',
            borderBottom: styles.divider.style === 'dotted' ? `${styles.divider.thickness || 1}px dotted ${styles.divider.color}` : 'none',
          }}
        />
      )}
    </motion.div>
  );
};

/**
 * MenuBlock Canvas Renderer
 * Main rendering component for menu block with column layout
 */
export const MenuBlockCanvas = ({ menuData, zoomLevel = 100, isSelected = false, onSelect, onItemClick }) => {
  // Safety check: Ensure menuData has required structure
  if (!menuData || !menuData.layout || !menuData.styles || !menuData.items) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/10">
        <p className="text-muted-foreground text-sm">Invalid menu data</p>
      </div>
    );
  }

  const { layout, styles, items } = menuData;
  
  // Calculate items per column
  const itemsPerColumn = layout.itemsPerColumn || Math.ceil(items.length / layout.columns);
  
  // Split items into columns
  const columns = [];
  for (let i = 0; i < layout.columns; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    columns.push(items.slice(start, end));
  }

  // Background style
  const backgroundStyle = {};
  if (styles.background.type === 'color') {
    backgroundStyle.backgroundColor = styles.background.value;
  } else if (styles.background.type === 'gradient') {
    backgroundStyle.background = styles.background.value;
  } else if (styles.background.type === 'image') {
    backgroundStyle.backgroundImage = `url(${styles.background.value})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  }

  return (
    <div
      className={`menu-block-canvas relative w-full h-full overflow-auto ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        ...backgroundStyle,
        padding: `${layout.padding}px`,
      }}
      onClick={(e) => {
        // Only select if clicking the background, not an item
        if (e.target === e.currentTarget || e.target.classList.contains('menu-column')) {
          onSelect && onSelect(menuData.id);
        }
      }}
    >
      {/* Overlay layer for image backgrounds to ensure text readability */}
      {styles.background.overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: styles.background.overlay,
            zIndex: 1,
          }}
        />
      )}
      
      {/* Content layer */}
      <div 
        className="grid gap-8 relative"
        style={{
          gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
          gap: `${layout.gap * 2}px`,
          zIndex: 2,
        }}
      >
        {columns.map((columnItems, columnIndex) => (
          <div key={columnIndex} className="menu-column">
            {columnItems.map((item) => (
              <MenuItemRenderer 
                key={item.id} 
                item={item} 
                menuData={menuData} 
                zoomLevel={zoomLevel}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ zIndex: 3 }}>
          <Settings className="h-3 w-3" />
          Selected
        </div>
      )}
    </div>
  );
};

/**
 * Main MenuBlock Component
 * Wrapper component with all integration hooks
 */
export const MenuBlock = ({ 
  menuData: initialMenuData,
  zoomLevel = 100,
  isSelected = false,
  onSelect,
  onUpdate,
  onDrop,
  onExport,
  onItemClick
}) => {
  const [menuData, setMenuData] = useState(initialMenuData || createMenuBlockElement());

  useEffect(() => {
    if (initialMenuData) {
      setMenuData(initialMenuData);
    }
  }, [initialMenuData]);

  const handleUpdate = (newData) => {
    setMenuData(newData);
    if (onUpdate) {
      onUpdate(newData);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(menuData.id);
    }
  };

  return (
    <MenuBlockCanvas 
      menuData={menuData}
      zoomLevel={zoomLevel}
      isSelected={isSelected}
      onSelect={handleSelect}
      onItemClick={onItemClick}
    />
  );
};

/**
 * Export utilities
 */

// Export as JSON
export const exportAsJSON = (menuData) => {
  const dataStr = JSON.stringify(menuData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `menu-${menuData.id}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export as HTML
export const exportAsHTML = (menuData) => {
  const html = generateHTMLTemplate(menuData);
  const dataBlob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `menu-${menuData.id}.html`;
  link.click();
  URL.revokeObjectURL(url);
};

// Generate standalone HTML template
const generateHTMLTemplate = (menuData) => {
  const { styles, layout, items, settings } = menuData;
  
  const backgroundStyle = styles.background.type === 'color'
    ? `background-color: ${styles.background.value};`
    : styles.background.type === 'gradient'
    ? `background: ${styles.background.value};`
    : `background-image: url(${styles.background.value}); background-size: cover;`;

  const itemsHTML = items.map(item => {
    const priceFormatted = settings.priceDecimals === 0 
      ? Math.round(item.price).toString()
      : item.price.toFixed(settings.priceDecimals);
    
    const priceWithCurrency = settings.currencyPosition === 'before'
      ? `${styles.currency}${priceFormatted}`
      : `${priceFormatted}${styles.currency}`;

    return `
      <div class="menu-item">
        <div class="item-content">
          <div class="item-name">${item.name}</div>
          ${settings.showDescriptions && item.description ? `<div class="item-description">${item.description}</div>` : ''}
        </div>
        <div class="item-price">${priceWithCurrency}</div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menu - ${menuData.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${styles.font.family}, sans-serif;
      ${backgroundStyle}
      padding: ${layout.padding}px;
    }
    .menu-container {
      display: grid;
      grid-template-columns: repeat(${layout.columns}, 1fr);
      gap: ${layout.gap * 2}px;
      max-width: ${layout.width}px;
      margin: 0 auto;
    }
    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: ${layout.gap}px;
      ${settings.showDivider && styles.divider?.show ? `border-bottom: ${styles.divider.thickness}px ${styles.divider.style} ${styles.divider.color}; padding-bottom: ${layout.gap}px;` : ''}
    }
    .item-name {
      font-size: ${styles.font.headlineSize}px;
      font-weight: ${styles.font.weight};
      color: ${styles.font.headlineColor};
      line-height: 1.2;
    }
    .item-description {
      font-size: ${styles.font.bodySize}px;
      color: ${styles.font.bodyColor};
      margin-top: 4px;
      line-height: 1.4;
    }
    .item-price {
      font-size: ${styles.font.headlineSize}px;
      font-weight: 700;
      color: ${styles.font.priceColor || styles.accentColor};
      white-space: nowrap;
      margin-left: 20px;
    }
  </style>
</head>
<body>
  <div class="menu-container">
    ${itemsHTML}
  </div>
</body>
</html>`;
};

export default MenuBlock;

