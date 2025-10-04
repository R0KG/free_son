# Interactive Map Component

## Overview

The InteractiveMap component provides a fully functional, interactive map showing plot locations with different statuses. It uses Leaflet maps with React integration for optimal performance and user experience.

## Features

### 🎯 Map Data

- **Realistic Demo Data**: 10 plots with realistic geographic coordinates
- **Multiple Status Types**:
  - 🟢 **Available** (Green) - Can be selected by users
  - 🟡 **Reserved** (Yellow) - In reservation process
  - 🔴 **Sold** (Red) - Already purchased

### 🗺️ Map Visualization

- **Custom Markers**: Color-coded circular markers with status icons
- **High Contrast**: Clear visual distinction between different statuses
- **No Overlapping**: Markers positioned to avoid overlap
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🖱️ User Interactions

- **Hover Tooltips**: Show basic plot information on mouse hover
- **Click Selection**: Click to select and view detailed information
- **Visual Feedback**: Smooth animations and transitions
- **Popup Details**: Rich popup with comprehensive plot information

### 📊 Legend & Information

- **Visible Legend**: Always-visible legend showing status meanings
- **Real-time Statistics**: Live count of plots by status
- **Map Information Panel**: Shows scale and navigation instructions

### 🎨 Visual Design

- **Modern UI**: Clean, professional appearance
- **Smooth Animations**: 300ms transitions for all interactions
- **Professional Colors**: Consistent color scheme throughout
- **Glassmorphism Effects**: Modern backdrop blur effects

## Usage

### Basic Usage

```tsx
import InteractiveMap from '@/components/InteractiveMap';

export default function MapPage() {
  const [selectedPlot, setSelectedPlot] = useState(null);

  const handlePlotSelect = (plot) => {
    setSelectedPlot(plot);
    // Handle plot selection
  };

  return (
    <InteractiveMap
      selectedPlot={selectedPlot}
      onPlotSelect={handlePlotSelect}
      className="h-[600px] w-full"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedPlot` | `string \| null` | `null` | ID of currently selected plot |
| `onPlotSelect` | `(plot: MapPlot) => void` | `undefined` | Callback when plot is selected |
| `className` | `string` | `''` | Additional CSS classes |

### Map Data Structure

Each plot has the following properties:

```typescript
interface MapPlot {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  status: 'available' | 'reserved' | 'sold';
  area: number;
  price: number;
  features: string[];
  description: string;
}
```

## Technical Implementation

### Dependencies

- `leaflet` - Core mapping library
- `react-leaflet` - React wrapper for Leaflet
- `@types/leaflet` - TypeScript definitions

### Key Features

1. **Custom Markers**: SVG-based circular markers with status icons
2. **Dynamic Styling**: Markers change size and appearance based on selection
3. **Responsive Popups**: Rich information display with formatted content
4. **Tooltip System**: Hover information without blocking interaction
5. **Legend System**: Always-visible status reference
6. **Statistics Panel**: Real-time plot count by status

### Performance Optimizations

- Dynamic imports to prevent SSR issues
- Optimized marker rendering
- Efficient event handling
- Smooth animations with CSS transitions

## Demo Data

The component includes realistic demo data with:

- **10 total plots** across different locations
- **5 available plots** for user selection
- **2 reserved plots** showing booking process
- **3 sold plots** indicating completed transactions
- **Realistic coordinates** in the Moscow metropolitan area
- **Varied pricing** from 2.1M to 3.6M RUB
- **Diverse features** including utilities, infrastructure, and amenities

## Accessibility

- **High Contrast**: All text meets WCAG guidelines
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators for interactive elements

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Responsiveness

- Touch-friendly marker sizes
- Optimized popup layouts for small screens
- Responsive legend and information panels
- Gesture-based navigation support

---

## Quick Start

1. Navigate to `/map` in the application
2. Use mouse/finger to explore the map
3. Hover over markers for quick information
4. Click markers for detailed plot information
5. Use the legend to understand status meanings
6. Check real-time statistics in the info panel

The interactive map provides an intuitive and visually appealing way to explore plot locations and their availability status.
