# Pages CMS Guide - Data Structure & Schema

The Pages CMS data structure is designed to be highly flexible and recursive. This document defines the JSON structure used by the `PageEditor`.

## 📦 Page Object

The top-level object for a CMS page.

| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The user-visible title of the page. |
| `slug` | `string` | The URL path (e.g., `about-us`). |
| `isPublished` | `boolean` | Whether the page is publicly visible. |
| `metaTitle` | `string` | SEO Title (optional). |
| `metaDescription` | `string` | SEO Description (optional). |
| `content` | `PageBlock[]` | An array of sections that make up the page. |

---

## 🏗️ PageBlock (Section)

A container that organizes content into columns.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (math.random/uuid). |
| `type` | `"section"` | Specifies this is a layout container. |
| `adminTitle` | `string` | Internal name for the section (optional). |
| `layout` | `string` | `"grid-1"`, `"grid-2"`, `"grid-3"`, `"grid-4"`. |
| `columns` | `ContentItem[][]` | Array of column content arrays. |

---

## 🧩 ContentItem Types

All items must have an `id` and a `type`. Below are the specific properties for each type:

### 1. `heading`
- `level`: `"h1"` | `"h2"` | `"h3"` | `"h4"` | `"h5"` | `"h6"`
- `text`: `string`

### 2. `paragraph`
- `text`: `string`

### 3. `image`
- `url`: `string`
- `alt`: `string`

### 4. `button` (Multi-Button Array)
- `buttons`: `Array<ButtonObject>`
    - `id`: `string`
    - `label`: `string`
    - `actionType`: `"link"` | `"button"`
    - `link`: `string` (Optional, used if `actionType` is `"link"`)
    - `target`: `"_self"` | `"_blank"` (Optional, used if `actionType` is `"link"`)
    - `buttonType`: `"button"` | `"submit"` | `"reset"` (Optional, used if `actionType` is `"button"`)

### 5. `carousel` (Recursive Slides)
- `items`: `Array<SlideObject>`
    - `id`: `string`
    - `adminTitle`: `string` (Internal label)
    - `layout`: `string` (Slide layout, e.g., `"grid-1"`)
    - `columns`: `ContentItem[][]` (Recursive content array)

### 6. `cta`
- `title`: `string`
- `subtitle`: `string`
- `description`: `string`
- `buttonLabel`: `string`
- `buttonLink`: `string`

### 7. `cards`
- `items`: `Array<{ title: string, description: string, image: string, link: string }>`

### 8. `features`
- `items`: `Array<{ title: string, description: string }>`

### 9. `testimonial`
- `quote`: `string`
- `author`: `string`
- `role`: `string`
- `avatar`: `string`

### 10. `list`
- `items`: `string[]`

### 11. `section` (Sub-Section)
- Recursive - contains `layout` and `columns`.

## 🛠️ Schema Guidance for Agents

When updating the data model:
1.  **Initialize Defaults**: Always provide empty defaults in `SectionBlock.tsx` (`addContentElement`) to avoid `undefined` errors in the UI.
2.  **Maintain Flat IDs**: Each item, even if deeply nested, must have a unique `id`.
3.  **Migration-First**: If adding a new property, ensure the editor handles its absence gracefully (i.e., use `item.newProp || default`).
