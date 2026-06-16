# Altair Platform - Modular Architecture Blueprint

This blueprint outlines the migration plan to transition the Altair dashboard into a highly scalable, decoupled, page-level modular design. Every component represents a single responsibility, adhering to a strict **100-line restriction** per file.

---

## 1. Directory Structure Blueprint `/app/modules`

Instead of a flat `/app/components` folder, each core page operates as a self-contained module:

```text
/app
  ├── api/              # Full-Stack Next.js API Routes (Prisma Client + Zod validation)
  ├── modules/          # Page-Level Self-Contained Modules
  │     ├── leads/
  │     │    ├── components/    # Dumb UI Components (< 100 lines each)
  │     │    │     ├── KanbanColumn.tsx
  │     │    │     ├── KanbanCard.tsx
  │     │    │     ├── DirectoryTable.tsx
  │     │    │     ├── MetricsHolder.tsx
  │     │    │     └── DetailsDrawer.tsx
  │     │    ├── hooks/         # Pure Behavioral Hooks (Logic & State Controllers)
  │     │    │     ├── useLeadsState.ts
  │     │    │     └── useKanbanDragDrop.ts
  │     │    ├── schemas/       # Zod Schemas for Validation
  │     │    │     └── lead.schema.ts
  │     │    └── leads.module.tsx # Main Module Entry Point
  │     ├── feed/
  │     ├── workspaces/
  │     └── messages/
  └── types/            # Shared Global Interfaces
```

---

## 2. Dynamic Technology Stack Integration

### A. Database Access: Prisma
Utilizes Prisma as the Object-Relational Mapping (ORM) framework to enforce schema-safe interactions with the application's native state database:
- **Location:** `/prisma/schema.prisma`
- **Models:**
  - `Lead`: Holds CRM entries, statuses, pipeline stages, custom metadata, and language statistics.
  - `Workspace`: Real-time operational groups, chat backlogs.
  - `ActivityLog`: Dynamic historical change log entries.

### B. Validation Engine: Zod
Enforces rigorous run-time shape-checking. Ensures that incoming payloads over RPC, WebSockets, or HTTP API requests strictly adhere to the defined schemas:
- Implements direct client-side form assertions.
- Safe-parses JSON requests inside Server-Side Next.js API Routes (`/api/*`).

### C. State Management
Rather than forcing heavy global context wrappers, each module holds isolated local state wrappers or lightweight React Context APIs:
- Minimizes redundant re-render pipelines.
- Supports immediate client-side optimistic updates matching database and socket triggers smoothly.

### D. Real-Time Sync: WebSockets
Establishes a bi-directional persistence pipeline. When components publish stage changes, delete items, or create new items:
- Client commits state instantly (Optimistic UI update).
- Client signals the WebSocket server.
- The Server updates DB records via Prisma, then broadcasts a message to other sessions.
- Connected sessions receive changes, reconciling state gracefully.

---

## 3. Implementation Process & Component Splitting (Under 100 Lines)

To strictly enforce the **100-line boundary**, standard components will be broken down:
1. **`LeadsKanbanView.tsx` (Current 100+ lines):** Split into:
   - `KanbanColumn.tsx` (~60 lines): Manages stage container UI & drag-drop drops.
   - `KanbanCard.tsx` (~50 lines): Render-specific lead meta data, labels & action handlers.
2. **`LeadsSection.tsx`:** Split into:
   - `MetricsGrid.tsx` (~50 lines): Renders the 5 KPI stat cards.
   - `HeaderControls.tsx` (~70 lines): Text search, layout controls.
3. **Logic Isolation:** All network requests and mutations go into modular custom hooks (e.g., `useLeadsActions`).
