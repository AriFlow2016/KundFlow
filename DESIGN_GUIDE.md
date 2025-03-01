# KundFlow Design Guide

## Grundläggande Designprinciper

### Layout
- Använd alltid `min-h-screen` för huvudcontainern
- Bakgrundsfärg ska vara `bg-gray-100` för huvudinnehållet
- Sidebaren ska vara fast positionerad med `fixed inset-y-0 left-0 w-64`

### Sidebar
```html
<!-- Grundläggande sidebar-struktur -->
<div className="fixed inset-y-0 left-0 w-64 bg-gray-800">
  <div className="flex flex-col h-full">
    <!-- Header -->
    <div className="flex items-center justify-center h-16 bg-gray-900">
      <h1 className="text-white text-xl font-bold">KundFlow</h1>
    </div>
    <!-- Navigation -->
    <nav className="flex-1 px-2 py-4 space-y-1">
      <!-- Navigationslänkar -->
    </nav>
  </div>
</div>
```

### Navigationslänkar
- Aktiv länk:
  ```html
  <Link className="flex items-center px-4 py-2 text-white bg-gray-900 rounded-md">
  ```
- Inaktiv länk:
  ```html
  <Link className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md">
  ```
- Ikoner i länkar ska ha `mr-3` för korrekt mellanrum

### Huvudinnehåll
- Ska alltid ha `pl-64` för att kompensera för sidebaren
- Innehållscontainers ska använda `container mx-auto px-4 py-8`

### Kort och Paneler
- Använd `bg-white rounded-lg shadow` för kort
- Kortrubriker ska använda `text-2xl font-bold text-gray-900 mb-6`
- Underrubriker ska använda `text-lg font-medium text-gray-900`

### Formulär
- Inputfält ska ha `mt-1 block w-full rounded-md border-gray-300`
- Labels ska ha `block text-sm font-medium text-gray-700`
- Formulärgrupper ska ha `space-y-4` för konsekvent mellanrum

### Knappar
- Primär knapp:
  ```html
  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
  ```
- Sekundär knapp:
  ```html
  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
  ```

### Status och Taggar
```html
<span className={classNames(
  'px-3 py-1 rounded-full text-sm font-medium',
  status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
  status === 'VIP' ? 'bg-purple-100 text-purple-800' :
  status === 'PROSPECT' ? 'bg-blue-100 text-blue-800' :
  'bg-gray-100 text-gray-800'
)}>
```

### Tabbar och Paneler
- Använd @headlessui/react Tab-komponenter
- Tabblist ska ha `border-b border-gray-200`
- Aktiv tab ska ha `border-blue-500 text-blue-600`
- Inaktiv tab ska ha `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`

## Färgschema
- Primär: `blue-600` (#2563EB)
- Sekundär: `gray-800` (#1F2937)
- Bakgrund: `gray-100` (#F3F4F6)
- Text: 
  - Primär: `gray-900` (#111827)
  - Sekundär: `gray-500` (#6B7280)
  - Ljus: `gray-300` (#D1D5DB)

## Typografi
- Rubriker: 
  - H1: `text-2xl font-bold`
  - H2: `text-xl font-semibold`
  - H3: `text-lg font-medium`
- Brödtext: `text-sm`
- Länkar: `text-blue-600 hover:text-blue-800`

## Spacing
- Använd konsekvent spacing med Tailwinds inbyggda klasser
- Mellan sektioner: `space-y-6`
- Mellan formulärelement: `space-y-4`
- Mellan knappar: `space-x-3`
- Padding i kort: `p-6`

## Responsivitet
- Sidebaren ska alltid vara synlig på desktop
- Innehåll ska använda responsive grid-system:
  ```html
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  ```

## Ikoner
- Använd react-icons/fa för konsekvent ikondesign
- Ikoner i navigation ska ha `mr-3`
- Ikoner i knappar ska ha `mr-2`

## Animationer och Övergångar
- Hover-effekter ska använda `transition-colors`
- Modal-övergångar ska använda `transition-opacity`
- Dropdown-animationer ska använda `transition-transform`

## Tillgänglighet
- Alla interaktiva element ska ha tydligt fokustillstånd
- Använd `sr-only` för skärmläsartext
- Knappar och länkar ska ha beskrivande text
- Formulärfält ska ha associerade labels

## Best Practices
1. Använd alltid de fördefinierade klasserna ovan
2. Undvik inline styles
3. Följ BEM-namngivningskonventioner för anpassade CSS
4. Använd Tailwind's utility-klasser när möjligt
5. Håll komponenterna modulära och återanvändbara
