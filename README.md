# Interactive Wall Calendar Component

A highly polished, interactive React calendar component inspired by physical wall calendars. It translates a static design concept into a responsive, highly functional web component.

## Key Features & Requirements Addressed

### 1. Wall Calendar Aesthetic
The design closely emulates the provided inspiration image. It features a portrait layout with a prominent "hero" image at the top half, bound by a top spiral. The lower half elegantly segments into a Notes section and the Calendar grid. The calendar uses CSS clip-paths and dynamic theme variables to blend the image styling with the lower section seamlessly.

### 2. Day Range Selector
Select a start and an end date interactively. Visual states clearly delineate the `startDate` (radius right side flattened), the `endDate` (radius left side flattened), and the intermediate days (with an interactive `.in-range` style).

### 3. Integrated Notes Section
The notes section dynamically reacts to the user's selected date range. If a range is chosen (e.g., Apr 10 - Apr 15), notes written are bound to that specific duration. If no range is selected, the notes are bound to the generic month. All notes are persisted via `localStorage`.

### 4. Fully Responsive Design
On Desktop layout, the bottom section adopts a segmented side-by-side layout (Notes Left, Grid Right) conforming to the inspiration image. On Mobile layout (screens < 600px), everything stacks gracefully preventing layout breaks while remaining perfectly usable for touch interactions.

### 5. Creative Liberty (Bonus Features)
- **Flipping Animations:** Page flipping aesthetics applied with CSS keyframes & dynamic React state classes whenever the month cycles forward or backward.
- **Theme Switching:** The primary brand color palette (`--theme-color`) dynamically switches each month to correspond nicely with that month's loaded hero image.
- **Holiday Markers:** A small dot indicator shows on specific common holiday dates (e.g., Dec 25th, Jan 1st), adding to the component's utility. 
- **Today Indicator:** A subtle outline makes identifying "today" effortless.

---

## Technical Architecture & State Management
Built purely with Vite + React + TypeScript + `date-fns` for concise, reliable date manipulation.
- **Styling:** Vanilla CSS, focused on custom properties (`var`) for theming. 
- **Local Storage Manager:** React `useEffect` is effectively synchronized with the notes state via standard JSON serialization.

## Running Locally

1. Clone the repository.
2. Ensure you have Node.js installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Navigate to `http://localhost:5173` to interact with the component.
