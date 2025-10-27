# MenuBlock Component System

A production-ready, fully-featured menu block component for digital signage with comprehensive customization options.

## Overview

MenuBlock is a standalone React component that integrates seamlessly with the existing template editor. It provides restaurant/cafe owners with a powerful tool to create, customize, and display digital menu boards with professional layouts and real-time editing.

## Features

- ✅ **Drag & Drop Integration** - Works with existing @dnd-kit/core setup
- ✅ **5 Pre-built Presets** - Classic, Modern, Minimal, Chalkboard, Bold
- ✅ **Multi-column Layouts** - 1, 2, or 3 column grid system
- ✅ **Rich Typography** - 10+ font families with full control
- ✅ **Item Management** - Add, edit, duplicate, delete menu items
- ✅ **CSV Import** - Bulk import items from spreadsheets
- ✅ **Icons & Badges** - 15+ SVG icons for veg/non-veg/spicy indicators
- ✅ **Export Options** - JSON, HTML, Image (PNG/JPG)
- ✅ **Real-time Preview** - Live updates as you customize
- ✅ **Responsive** - Adapts to different screen sizes
- ✅ **Accessible** - WCAG contrast checking and keyboard navigation

## Installation

### 1. File Structure

Ensure all MenuBlock files are in the correct location:

```
client/src/components/MenuBlock/
├── MenuBlock.jsx              # Main component
├── MenuBlockSidebar.jsx       # Settings panel
├── menuBlockSchema.json       # Data schema
├── icons.js                   # Icon library
├── presets.js                 # Style presets
├── MenuBlockIntegration.example.jsx  # Usage examples
└── README.md                  # This file
```

### 2. Dependencies

All required dependencies are already in your `package.json`:

```json
{
  "framer-motion": "^10.x.x",
  "@dnd-kit/core": "^6.x.x",
  "lucide-react": "^0.x.x"
}
```

## Quick Start

### Basic Integration (3 Steps)

#### 1. Add to Element Catalog

```javascript
import { createMenuBlockElement } from '@/components/MenuBlock/MenuBlock';
import { Menu } from 'lucide-react';

const ELEMENT_CATALOG = [
  // ... existing elements
  {
    id: "menu-block",
    name: "Menu Block",
    icon: Menu,
    category: "templates",
    description: "Restaurant/cafe menu layout",
    defaultProps: createMenuBlockElement(),
  }
];
```

#### 2. Render Draggable Card

```javascript
import { DraggableMenuBlockCard } from '@/components/MenuBlock/MenuBlock';

// In your sidebar templates section:
<DraggableMenuBlockCard element={menuBlockElement} showLarge={true} />
```

#### 3. Handle Drop & Open Sidebar

```javascript
import { MenuBlock } from '@/components/MenuBlock/MenuBlock';
import { MenuBlockSidebar } from '@/components/MenuBlock/MenuBlockSidebar';

const handleDragEnd = (event) => {
  if (event.active.data.element?.id === 'menu-block') {
    const newMenuBlock = createMenuBlockElement();
    // Add to slide
    // Open sidebar
    setMenuBlockPanelOpen(true);
    setMenuBlockData(newMenuBlock);
  }
};
```

See `MenuBlockIntegration.example.jsx` for complete working examples.

## API Reference

### MenuBlock Component

Main rendering component for menu display.

```javascript
<MenuBlock
  menuData={menuData}           // Required: Menu configuration object
  zoomLevel={100}               // Optional: Zoom percentage (default: 100)
  isSelected={false}            // Optional: Selection state
  onSelect={(id) => {}}         // Optional: Selection callback
  onUpdate={(newData) => {}}    // Optional: Update callback
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `menuData` | `object` | Yes | - | Menu configuration matching schema |
| `zoomLevel` | `number` | No | `100` | Canvas zoom level (25-200) |
| `isSelected` | `boolean` | No | `false` | Whether element is selected |
| `onSelect` | `function` | No | - | Called when element is clicked |
| `onUpdate` | `function` | No | - | Called when data changes |

### MenuBlockSidebar Component

Settings panel with all customization controls.

```javascript
<MenuBlockSidebar
  menuData={menuData}           // Required: Menu configuration
  onUpdate={(newData) => {}}    // Required: Update callback
  onClose={() => {}}            // Required: Close callback
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `menuData` | `object` | Yes | Current menu configuration |
| `onUpdate` | `function` | Yes | Called on every change with new data |
| `onClose` | `function` | Yes | Called when sidebar should close |

### DraggableMenuBlockCard Component

Sidebar catalog item with drag support.

```javascript
<DraggableMenuBlockCard
  element={element}             // Required: Element configuration
  showLarge={true}              // Optional: Large card style
/>
```

### Helper Functions

#### createMenuBlockElement()

Creates a new menu block with default configuration.

```javascript
const newMenu = createMenuBlockElement();
// Returns schema-compliant menu object
```

#### exportAsJSON(menuData)

Downloads menu configuration as JSON file.

```javascript
exportAsJSON(menuData);
// Downloads: menu-{id}.json
```

#### exportAsHTML(menuData)

Generates and downloads standalone HTML template.

```javascript
exportAsHTML(menuData);
// Downloads: menu-{id}.html
```

#### applyPreset(menuData, presetName)

Applies a style preset to menu data.

```javascript
import { applyPreset } from '@/components/MenuBlock/presets';

const updatedMenu = applyPreset(menuData, 'modern');
```

## Data Schema

MenuBlock uses a canonical JSON schema for all menu data:

```json
{
  "id": "menu-uuid",
  "type": "menuBlock",
  "meta": {
    "preset": "modern",
    "theme": "dark",
    "createdAt": "2025-10-27T..."
  },
  "layout": {
    "width": 1920,
    "height": 1080,
    "columns": 2,
    "itemsPerColumn": null,
    "padding": 24,
    "gap": 12
  },
  "styles": {
    "preset": "modern",
    "background": {
      "type": "color",
      "value": "#212121"
    },
    "font": {
      "family": "Work Sans",
      "headlineSize": 56,
      "bodySize": 28,
      "weight": "600",
      "headlineColor": "#FFFFFF",
      "bodyColor": "#B0BEC5",
      "priceColor": "#E53935"
    },
    "accentColor": "#E53935",
    "priceAlign": "right",
    "currency": "₹",
    "icons": {
      "veg": "leaf",
      "nonveg": "chili"
    },
    "divider": {
      "show": true,
      "style": "solid",
      "thickness": 2,
      "color": "#E53935",
      "indent": 0
    }
  },
  "items": [
    {
      "id": "item-1",
      "name": "Veg Thali",
      "description": "Rice, Dal, 2 Veg Curries",
      "price": 199,
      "tag": "veg",
      "icon": "leaf",
      "spicy": false,
      "image": ""
    }
  ],
  "settings": {
    "showDescriptions": true,
    "showDivider": true,
    "priceDecimals": 0,
    "currencyPosition": "before",
    "showIcons": true,
    "imageForItem": false
  }
}
```

See `menuBlockSchema.json` for complete JSON schema definition.

## Sidebar Settings Reference

### Layout Section
- **Columns**: 1, 2, or 3 column layout
- **Padding**: Canvas padding (0-100px)
- **Gap**: Space between items (0-50px)

### Presets Section
- **5 Presets**: Classic, Modern, Minimal, Chalkboard, Bold
- **Save Custom**: Save your custom styling as preset

### Background Section
- **Type**: Color, Gradient, Image, Video
- **Color Picker**: Visual color selection
- **Gradient Editor**: CSS gradient input
- **Image Upload**: Background image support

### Typography Section
- **Font Family**: 10+ curated fonts
- **Headline Size**: 12-120px
- **Body Size**: 10-80px
- **Weight**: 300-800
- **Colors**: Headline, body, and price colors

### Price & Currency Section
- **Currency**: ₹, $, €, £, ¥, etc.
- **Decimals**: 0, 1, or 2 decimal places
- **Position**: Before/after price
- **Alignment**: Left, right, or center

### Item Controls Section
- **Add Item**: Inline form with all fields
- **Edit Items**: Drag-to-reorder list
- **Duplicate/Delete**: Quick actions
- **CSV Import**: Bulk add from spreadsheet

### Icons & Badges Section
- **Icon Library**: 15+ SVG icons
- **Veg/Non-veg**: Automatic icon selection
- **Custom Upload**: Add your own icons
- **Badge Presets**: NEW, SPICY, CHEF'S CHOICE

### Dividers Section
- **Style**: Solid, dashed, dotted
- **Thickness**: 1-10px
- **Color**: Custom color picker
- **Indent**: Left/right indent (0-100px)

### Visibility Section
- **Show Descriptions**: Toggle item descriptions
- **Show Images**: Enable per-item images

### Accessibility Section
- **Locale**: IN, US, EU formatting
- **Contrast Check**: WCAG compliance warning
- **Font Scaling**: Accessibility multiplier

### Export Section
- **Preview**: Full-screen preview
- **Export JSON**: Download configuration
- **Export HTML**: Standalone template
- **Export Image**: PNG/JPG render
- **Save Template**: Save for reuse

## Presets

### Classic
- Warm, traditional restaurant style
- Serif fonts (Georgia)
- Left-aligned prices
- Neutral earth tones

### Modern
- Contemporary bold design
- Sans-serif (Work Sans)
- Right-aligned prices
- High contrast dark theme

### Minimal
- Clean, spacious layout
- Light colors
- Subtle dividers
- Lots of whitespace

### Chalkboard
- Hand-drawn aesthetic
- Textured dark background
- Chalk-style fonts (Caveat)
- Dashed dividers

### Bold
- Vibrant gradient backgrounds
- Large, impactful typography
- Bright accent colors
- No dividers

## CSV Import Format

Create a CSV file with these headers:

```csv
name,description,price,tag
Veg Thali,Rice and Dal,199,veg
Paneer Masala,House special,249,veg
Chicken Biryani,Aromatic rice,299,nonveg
```

**Supported columns:**
- `name` (required)
- `description` (optional)
- `price` (required, number)
- `tag` (optional: veg, nonveg, contains-nuts)

## Icons Library

Available icon categories:

**Veg Icons:**
- `leaf` - Circle with dot (default)
- `circle-leaf` - Filled circle
- `square-leaf` - Square variant

**Non-veg Icons:**
- `chili` - Triangle indicator
- `circle-chili` - Filled circle
- `square-chili` - Square variant

**Spicy Icons:**
- `flame` - Single flame
- `double-flame` - Double flame (extra spicy)

**Badges:**
- `star` - Star badge
- `ribbon` - Award ribbon
- `crown` - Premium/chef's choice
- `check` - Verified/recommended
- `new` - NEW badge
- `chef` - Chef's hat

**Allergen:**
- `nut` - Contains nuts
- `alert` - General warning

Use `getIcon(iconName, props)` to render icons programmatically.

## Event Handlers

### onUpdate

Called whenever menu data changes. Use for live preview and undo/redo.

```javascript
const handleUpdate = (newData) => {
  // Update local state
  setMenuData(newData);
  
  // Update in slides array
  updateSlideElement(currentSlideIndex, selectedElementId, newData);
  
  // Push to history for undo/redo
  pushHistory(newData);
};
```

### onSelect

Called when MenuBlock is clicked on canvas.

```javascript
const handleSelect = (menuId) => {
  setSelectedElementId(menuId);
  setMenuBlockPanelOpen(true);
};
```

### onDrop

Called when MenuBlock is dropped onto canvas.

```javascript
const handleDrop = (menuData) => {
  const newSlide = createSlideWithMenuBlock(menuData);
  setSlides([...slides, newSlide]);
};
```

### onExport

Called when export button is clicked.

```javascript
const handleExport = (menuId, format) => {
  if (format === 'json') exportAsJSON(menuData);
  if (format === 'html') exportAsHTML(menuData);
  if (format === 'image') exportAsImage(menuData);
};
```

## Customization Guide

### Adding Custom Presets

```javascript
// In presets.js
export const MENU_PRESETS = {
  // ... existing presets
  myCustomPreset: {
    name: 'My Preset',
    description: 'Custom description',
    styles: {
      preset: 'myCustomPreset',
      background: { type: 'color', value: '#FF5722' },
      font: { family: 'Inter', headlineSize: 48, bodySize: 24, weight: '600' },
      accentColor: '#FFC107',
      // ... more styles
    }
  }
};
```

### Adding Custom Icons

```javascript
// In icons.js
export const MyCustomIcon = ({ className, color }) => (
  <svg className={className} viewBox="0 0 24 24">
    {/* Your SVG path */}
  </svg>
);

// Add to ICON_MAP
export const ICON_MAP = {
  // ... existing icons
  'my-icon': MyCustomIcon
};
```

### Custom Font Families

```javascript
// In presets.js
export const FONT_FAMILIES = [
  // ... existing fonts
  { value: 'My Font', label: 'My Custom Font', category: 'sans-serif' }
];
```

## Troubleshooting

### MenuBlock not rendering

**Problem:** MenuBlock doesn't appear after drop.

**Solution:** Ensure `element.type === 'menuBlock'` in render logic:

```javascript
{slide.elements.map(element => {
  if (element.type === 'menuBlock') {
    return <MenuBlock key={element.id} menuData={element} />;
  }
})}
```

### Sidebar not opening

**Problem:** Settings sidebar doesn't open on selection.

**Solution:** Check that `setMenuBlockPanelOpen(true)` is called:

```javascript
onSelect={() => {
  setSelectedElementId(element.id);
  setMenuBlockPanelOpen(true);  // ← Make sure this is called
  setMenuBlockData(element);
}}
```

### Items not updating

**Problem:** Changes in sidebar don't reflect on canvas.

**Solution:** Ensure `onUpdate` callback updates parent state:

```javascript
const handleUpdate = (newData) => {
  setMenuBlockData(newData);  // Local state
  updateParentSlideData(newData);  // Parent state ← Important!
};
```

### CSV import not working

**Problem:** CSV file doesn't import items.

**Solution:** Check CSV format has required headers:

```csv
name,description,price,tag
Item 1,Description,99,veg
```

### Icons not showing

**Problem:** Icons don't render in menu.

**Solution:** Verify `settings.showIcons` is `true` and items have `icon` property:

```javascript
updateData('settings.showIcons', true);
```

## Performance Tips

1. **Memoize MenuBlock** - Use `React.memo()` for MenuBlock component
2. **Debounce Updates** - Debounce sidebar changes to reduce re-renders
3. **Lazy Load Images** - Use lazy loading for item images
4. **Virtualize Long Lists** - Use virtualization for 50+ items

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

To extend MenuBlock:

1. Add new preset in `presets.js`
2. Add new icon in `icons.js`
3. Add new sidebar section in `MenuBlockSidebar.jsx`
4. Update schema in `menuBlockSchema.json`
5. Document in this README

## License

Part of SignageDashboard project.

## Support

For issues or questions:
1. Check `MenuBlockIntegration.example.jsx` for usage patterns
2. Refer to this README for API documentation
3. Inspect `menuBlockSchema.json` for data structure

---

**Version:** 1.0.0  
**Last Updated:** October 27, 2025  
**Maintainer:** SignageDashboard Team

