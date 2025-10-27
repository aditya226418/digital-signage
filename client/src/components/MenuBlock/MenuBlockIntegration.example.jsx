/**
 * MenuBlock Integration Example
 * Complete usage guide showing how to integrate MenuBlock into the template editor
 */

import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { 
  createMenuBlockElement, 
  DraggableMenuBlockCard,
  MenuBlock 
} from './MenuBlock';
import { MenuBlockSidebar } from './MenuBlockSidebar';

/**
 * STEP 1: Add MenuBlock to ELEMENT_CATALOG
 * 
 * In your existing TemplateSelectionModal.tsx or element catalog file,
 * add the MenuBlock entry to your ELEMENT_CATALOG array:
 */

// Import at the top of your file
import { createMenuBlockElement, DraggableMenuBlockCard } from '@/components/MenuBlock/MenuBlock';

// Add to ELEMENT_CATALOG array
const ELEMENT_CATALOG_EXAMPLE = [
  // ... existing elements (texts, labels, media, shapes, widgets)
  
  // Add MenuBlock to templates category
  {
    id: "menu-block",
    name: "Menu Block",
    icon: Menu, // from lucide-react
    category: "templates",
    description: "Restaurant/cafe menu layout with customizable items and styling",
    thumbnail: "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?w=160&h=100&fit=crop",
    defaultProps: createMenuBlockElement(),
  }
];

/**
 * STEP 2: Render MenuBlock Card in Sidebar
 * 
 * In your sidebar rendering logic (templates section), add the MenuBlock card:
 */

const SidebarTemplatesExample = () => {
  const menuBlockElement = ELEMENT_CATALOG_EXAMPLE.find(el => el.id === 'menu-block');
  
  return (
    <div className="p-4 space-y-4">
      <h4 className="text-sm font-semibold mb-3">Restaurant & Food</h4>
      
      {/* Render the draggable MenuBlock card */}
      <DraggableMenuBlockCard element={menuBlockElement} showLarge={true} />
      
      {/* ... other template cards */}
    </div>
  );
};

/**
 * STEP 3: Handle Drag & Drop
 * 
 * In your handleDragEnd function, add MenuBlock-specific logic:
 */

const EditorWithMenuBlockExample = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  
  // MenuBlock-specific state
  const [menuBlockPanelOpen, setMenuBlockPanelOpen] = useState(false);
  const [menuBlockData, setMenuBlockData] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Check if dropped element is a MenuBlock
    const elementData = active.data.current?.element;
    
    if (over?.id === 'canvas' && elementData) {
      
      // Handle MenuBlock specifically
      if (elementData.type === 'menuBlock' || elementData.id === 'menu-block') {
        const newMenuBlock = createMenuBlockElement();
        
        // Create a new slide with MenuBlock element
        const newSlide = {
          id: `slide-${Date.now()}`,
          thumbnail: 'menu-preview-thumbnail.jpg',
          duration: 10,
          transition: 'fade',
          elements: [{
            ...newMenuBlock,
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'menuBlock',
            position: { x: 0, y: 0 },
            size: { width: 960, height: 540 },
          }]
        };
        
        // Add slide and select it
        setSlides([...slides, newSlide]);
        setCurrentSlideIndex(slides.length);
        
        // Auto-select the MenuBlock element
        setSelectedElementId(newSlide.elements[0].id);
        
        // Open MenuBlock settings sidebar
        setMenuBlockPanelOpen(true);
        setMenuBlockData(newSlide.elements[0]);
        
        return;
      }
      
      // Handle other element types...
      // ... existing drag-and-drop logic
    }
  };

  // Update MenuBlock data when sidebar changes
  const handleMenuBlockUpdate = (newData) => {
    setMenuBlockData(newData);
    
    // Update in slides array
    setSlides(prevSlides => {
      const updatedSlides = [...prevSlides];
      const currentSlide = updatedSlides[currentSlideIndex];
      
      if (currentSlide) {
        currentSlide.elements = currentSlide.elements.map(el =>
          el.id === selectedElementId ? { ...el, ...newData } : el
        );
      }
      
      return updatedSlides;
    });
    
    // Optional: Push to undo/redo history
    // pushHistory(newData);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        {/* Left sidebar with element catalog */}
        <div className="w-80 border-r">
          {/* ... sidebar content */}
        </div>

        {/* Canvas area */}
        <div className="flex-1">
          {/* Render MenuBlock if it exists in current slide */}
          {slides[currentSlideIndex]?.elements.map(element => {
            if (element.type === 'menuBlock') {
              return (
                <MenuBlock
                  key={element.id}
                  menuData={element}
                  zoomLevel={100}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => {
                    setSelectedElementId(element.id);
                    setMenuBlockData(element);
                    setMenuBlockPanelOpen(true);
                  }}
                  onUpdate={handleMenuBlockUpdate}
                />
              );
            }
            // ... render other element types
            return null;
          })}
        </div>

        {/* MenuBlock Settings Sidebar */}
        <AnimatePresence>
          {menuBlockPanelOpen && menuBlockData && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-card flex flex-col overflow-hidden flex-shrink-0"
            >
              <MenuBlockSidebar 
                menuData={menuBlockData}
                onUpdate={handleMenuBlockUpdate}
                onClose={() => {
                  setMenuBlockPanelOpen(false);
                  setSelectedElementId(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
};

/**
 * STEP 4: Click-to-Add (Alternative to Drag-and-Drop)
 * 
 * Add a click handler to the MenuBlock card for users who prefer clicking:
 */

const ClickToAddExample = () => {
  const handleMenuBlockClick = () => {
    // Create new MenuBlock
    const newMenuBlock = createMenuBlockElement();
    
    // Add to canvas centered
    const newSlide = {
      id: `slide-${Date.now()}`,
      thumbnail: 'menu-preview-thumbnail.jpg',
      duration: 10,
      transition: 'fade',
      elements: [{
        ...newMenuBlock,
        id: `element-${Date.now()}`,
        position: { x: 0, y: 0 },
        size: { width: 960, height: 540 },
      }]
    };
    
    // Add and open settings
    // setSlides([...slides, newSlide]);
    // setMenuBlockPanelOpen(true);
    // setMenuBlockData(newSlide.elements[0]);
  };

  return (
    <button onClick={handleMenuBlockClick}>
      <DraggableMenuBlockCard 
        element={{ 
          id: 'menu-block', 
          name: 'Menu Block',
          category: 'templates'
        }} 
      />
    </button>
  );
};

/**
 * STEP 5: Export Handlers
 * 
 * Add export functionality to your app:
 */

import { exportAsJSON, exportAsHTML } from '@/components/MenuBlock/MenuBlock';

const ExportExample = ({ menuBlockData }) => {
  const handleExportJSON = () => {
    exportAsJSON(menuBlockData);
  };

  const handleExportHTML = () => {
    exportAsHTML(menuBlockData);
  };

  const handleExportImage = async () => {
    // Use html2canvas or similar library
    const element = document.getElementById('menu-canvas');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `menu-${menuBlockData.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div>
      <button onClick={handleExportJSON}>Export JSON</button>
      <button onClick={handleExportHTML}>Export HTML</button>
      <button onClick={handleExportImage}>Export Image</button>
    </div>
  );
};

/**
 * STEP 6: Undo/Redo Integration
 * 
 * Push MenuBlock changes to your undo/redo history:
 */

const UndoRedoExample = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (menuData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(menuData)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      return history[historyIndex - 1];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      return history[historyIndex + 1];
    }
  };

  return { pushHistory, undo, redo };
};

/**
 * STEP 7: Save MenuBlock with Composition
 * 
 * When saving the composition/template, MenuBlock data is already part of the slide:
 */

const SaveCompositionExample = ({ slides }) => {
  const saveComposition = async () => {
    const composition = {
      id: 'comp-123',
      name: 'My Restaurant Menu',
      slides: slides, // MenuBlock data is embedded in slide.elements
      createdAt: new Date().toISOString()
    };

    // Save to backend
    await fetch('/api/compositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(composition)
    });
  };

  return <button onClick={saveComposition}>Save Composition</button>;
};

/**
 * STEP 8: Load MenuBlock from Saved Data
 * 
 * When loading a composition with MenuBlock:
 */

const LoadCompositionExample = ({ compositionData }) => {
  const [slides, setSlides] = useState([]);

  const loadComposition = () => {
    // compositionData.slides contains MenuBlock elements
    setSlides(compositionData.slides);
    
    // MenuBlock elements will be rendered automatically
    // when you iterate through slide.elements
  };

  return (
    <div>
      {slides.map(slide => (
        <div key={slide.id}>
          {slide.elements.map(element => {
            if (element.type === 'menuBlock') {
              return (
                <MenuBlock
                  key={element.id}
                  menuData={element}
                  zoomLevel={100}
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

/**
 * COMPLETE INTEGRATION EXAMPLE
 * 
 * Full working example combining all steps:
 */

export const CompleteMenuBlockIntegration = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [menuBlockPanelOpen, setMenuBlockPanelOpen] = useState(false);
  const [menuBlockData, setMenuBlockData] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const elementData = active.data.current?.element;
    
    if (over?.id === 'canvas' && elementData?.id === 'menu-block') {
      const newMenuBlock = createMenuBlockElement();
      
      const newSlide = {
        id: `slide-${Date.now()}`,
        thumbnail: 'menu-preview.jpg',
        duration: 10,
        transition: 'fade',
        elements: [{
          ...newMenuBlock,
          id: `element-${Date.now()}`,
        }]
      };
      
      setSlides([...slides, newSlide]);
      setCurrentSlideIndex(slides.length);
      setSelectedElementId(newSlide.elements[0].id);
      setMenuBlockPanelOpen(true);
      setMenuBlockData(newSlide.elements[0]);
    }
  };

  const handleMenuBlockUpdate = (newData) => {
    setMenuBlockData(newData);
    setSlides(prevSlides => {
      const updatedSlides = [...prevSlides];
      if (updatedSlides[currentSlideIndex]) {
        updatedSlides[currentSlideIndex].elements = updatedSlides[currentSlideIndex].elements.map(el =>
          el.id === selectedElementId ? { ...el, ...newData } : el
        );
      }
      return updatedSlides;
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r">
          <DraggableMenuBlockCard 
            element={{ 
              id: 'menu-block', 
              name: 'Menu Block',
              defaultProps: createMenuBlockElement()
            }} 
          />
        </div>

        {/* Canvas */}
        <div className="flex-1">
          {slides[currentSlideIndex]?.elements.map(element => (
            element.type === 'menuBlock' && (
              <MenuBlock
                key={element.id}
                menuData={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => {
                  setSelectedElementId(element.id);
                  setMenuBlockData(element);
                  setMenuBlockPanelOpen(true);
                }}
                onUpdate={handleMenuBlockUpdate}
              />
            )
          ))}
        </div>

        {/* Settings Sidebar */}
        <AnimatePresence>
          {menuBlockPanelOpen && menuBlockData && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              className="border-l"
            >
              <MenuBlockSidebar 
                menuData={menuBlockData}
                onUpdate={handleMenuBlockUpdate}
                onClose={() => setMenuBlockPanelOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
};

export default CompleteMenuBlockIntegration;

