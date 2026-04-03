# Pages CMS Guide - Visual Identity & Theme

The Pages CMS is built to deliver a **Premium Admin Experience**. All components must follow the project's design system, focusing on high-contrast colors, subtle depth, and extreme radius corners.

## 💎 Design Consistency Checklist

Agents and developers should use this checklist when building or modifying the CMS:
1.  **Extreme Radius**: Use `rounded-3xl` for main containers and `rounded-2xl` | `rounded-xl` for inner items.
2.  **Border Contrast**: Use `border-slate-100` for subtle boundaries and `border-slate-200` for more defined sections.
3.  **Typography**: Use `font-black uppercase tracking-widest` for labels and system information.
4.  **Accent Palette**: Stick to the `slate` color family (slate-900 for dark accents, slate-50 for backgrounds).
5.  **Micro-Interactions**: Use `hover:border-slate-300` and `transition-all` on all interactive cards.

---

## 🎨 Layout Tokens

| Element | Recommended Classes |
| :--- | :--- |
| **Main Card** | `bg-white rounded-3xl border border-slate-100 p-8 shadow-sm` |
| **Section Wrapper** | `rounded-3xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 border-l-slate-900` |
| **Content Card** | `bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all` |
| **Field Label** | `text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block` |
| **Help Box** | `bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200` |

---

## 📐 Enhancement Styling Patterns

### Button Arrays
- **Spacing**: Use `gap-3` or `gap-4` between buttons.
- **Radius**: Buttons should use `rounded-xl` to match the "Premium" curve.
- **Action Visuals**: Distinguish Link icons (`🔗`) from Action icons (`⚡`) in the editor UI.

### Carousel Slides
- **Contextual Depth**: Slides use `bg-slate-50/50` with a `border-slate-100` to create a "layered" effect.
- **Slide Headers**: Use high-contrast badges for slide numbers (e.g., `bg-slate-900 text-white`) to ensure navigation is clear.
- **Internal Padding**: Slides should maintain `p-4` to ensure nested content doesn't feel cramped.

---

## 🚀 Creating "Premium" Components

If you are tasked with adding a new content block type:
1.  **Avoid Default Shadcn Styling**: Don't use the default `Button` or `Input` styles without customization.
2.  **Use Glassmorphism Patterns**: For sub-containers like Card lists, use `bg-slate-50/50 p-3 rounded-xl border border-slate-100`.
3.  **Use High-Contrast Icons**: Use `lucide-react` icons with `size={14}` and wrap them in a `p-1.5 bg-slate-50 rounded-lg text-slate-400`.

## 🛠️ Code Styling Example

When building a new input field:

```tsx
<div className="space-y-4">
  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
    New Field Label
  </Label>
  <Input
    placeholder="e.g. Placeholder..."
    className="h-12 text-lg font-bold rounded-xl border-slate-200"
  />
</div>
```

**Avoid**: Small text, default `rounded-md` radius, or standard `blue-500` accents. The project uses **Slate-900** as its primary accent.
---
*Created by Antigravity (Advanced Agentic Coding)*
