# Pages CMS Guide - Index

Welcome to the **Pages CMS** documentation. This suite is designed to guide developers and autonomous agents (LLMs) in building, modifying, and extending the CMS functionality within the Nestcraft project.

## 🚀 Overview

The Pages CMS is a highly flexible, recursive, and block-based system. It allows for:
- **Full Page Management**: Control over titles, slugs, and SEO metadata.
- **Multi-Column Layouts**: Nested grid systems with 1-4 columns.
- **Carousel Sliders**: Recursive slide system where each slide is a flexible layout container.
- **Multi-Button System**: Configurable button arrays with Link/Action differentiation.
- **Infinite Nesting**: Sections and Carousels can be nested inside each other for complex page structures.
- **Rich Content Blocks**: Support for headings, text, images, features, testimonials, and more.

## 📚 Documentation Sections

1.  **[Components Guide](file:///d:/projects/nestcraft-live/.agents/docs/pages/components.md)**
    - Breakdown of the core editor components: `PageEditor`, `SectionBlock`, and `ContentItem`.
    - Understanding the component hierarchy and prop interfaces.

2.  **[Data Structure & Schema](file:///d:/projects/nestcraft-live/.agents/docs/pages/data-structure.md)**
    - Detailed JSON schema for the `Page` object.
    - Specific properties for all 10+ content block types.

3.  **[Visual Identity & Theme Guide](file:///d:/projects/nestcraft-live/.agents/docs/pages/theme-guide.md)**
    - **CRITICAL**: How to build UI that matches the project's premium design system.
    - Standard design tokens (Tailwind classes) and styling principles.

## 🛠️ Quick Workflow for Agents

If you are tasked with adding a new feature to the CMS:
1.  **Reference the Schema**: Check `data-structure.md` to see where the new data fits.
2.  **Follow the Theme**: Use `theme-guide.md` to ensure your new UI looks "Premium" and matches the existing styles.
3.  **Implement Recursively**: If building a new block, ensure it can be placed within a `SectionBlock` or even a sub-section if required.

---
*Created by Antigravity (Advanced Agentic Coding)*
