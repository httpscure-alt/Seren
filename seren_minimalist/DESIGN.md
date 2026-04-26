```markdown
# Design System Document: High-End Editorial Dermatology

## 1. Overview & Creative North Star: "The Clinical Atelier"
This design system rejects the "app-like" rigidity of standard medical portals in favor of a high-end editorial experience. We are building **The Clinical Atelier**—a space that feels as professional as a high-end dermatology clinic and as breathable as a luxury lifestyle magazine.

The goal is to move beyond "standard UI." We achieve this through **Intentional Asymmetry** and **Tonal Depth**. Instead of boxing content into rigid rows, we use expansive white space and overlapping layers to guide the eye. This system treats the desktop screen as a canvas where "clinical" meets "human."

**Key Principles:**
*   **Lowercase Authority:** Use lowercase typography for headers to evoke a calm, approachable, yet sophisticated brand voice.
*   **Breath as Structure:** White space is not "empty"; it is a functional element that reduces cognitive load for patients.
*   **Tactile Digitalism:** Surfaces should feel like layered vellum or frosted glass, not flat digital pixels.

---

## 2. Colors & Surface Philosophy
The palette is rooted in warmth and muted clinical tones. We move away from "hospital white" toward a "gallery off-white."

### Palette Reference
*   **Surface (Background):** `#FAF9F6` (A warm, breathable base)
*   **Primary (Accent):** `#3D6374` (Muted blue for trust and action)
*   **On-Surface (Text):** `#2F3330` (A soft charcoal, avoiding harsh pure black)
*   **Tertiary:** `#4E6176` (Used for secondary clinical data or subtle highlights)

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. 
*   Boundaries must be created through **Background Color Shifts**. For example, a `surface-container-low` section should sit atop a `surface` background to create a "zone" without a hard line.
*   Use the **Surface Hierarchy**:
    *   `surface-container-lowest`: Use for the primary content cards to make them "pop" against the background.
    *   `surface-container-high`: Use for navigation bars or sidebars to create subtle structural separation.

### The "Glass & Gradient" Rule
To achieve a premium feel, floating elements (modals, dropdowns, sticky headers) must use **Glassmorphism**:
*   **Fill:** `surface` at 70% opacity.
*   **Effect:** Backdrop blur (20px - 40px).
*   **Signature Texture:** Main Call-to-Actions (CTAs) should use a subtle linear gradient from `primary` (#3D6374) to `primary-dim` (#305767) at a 135-degree angle to provide a "pearlized" finish.

---

## 3. Typography: Editorial Clarity
The interplay between the geometric **Manrope** and the functional **Inter** creates a balance between clinical precision and editorial style.

*   **Display & Headline (Manrope):** Large, airy, and primarily **lowercase**. This softens the medical context, making it feel like a personal consultation rather than a sterile diagnosis.
    *   *Letter Spacing:* -0.02em for headlines to keep them cohesive.
*   **Body & Labels (Inter):** High legibility with generous line heights (1.6x+).
    *   *Letter Spacing:* +0.01em to +0.03em for body text to increase "breathability."

**The Typography Hierarchy:**
*   **display-lg (3.5rem):** Reserved for hero welcome messages.
*   **headline-sm (1.5rem):** Use for section headers, always lowercase.
*   **body-lg (1rem):** The standard for patient notes and medical descriptions.

---

## 4. Elevation & Depth: Tonal Layering
We do not use elevation to "lift" objects off the page; we use it to "stack" them like fine stationery.

*   **The Layering Principle:** Depth is achieved by nesting. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** If a shadow is required for a floating state (e.g., a dragged element), use a "Tinted Shadow":
    *   *Blur:* 40px | *Y-Offset:* 12px | *Color:* `on-surface` at 5% opacity.
*   **The Ghost Border:** If a boundary is legally or functionally required, use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components: Soft & Purposeful
All components must adhere to the **xl (1.5rem / 24px)** or **lg (1rem / 16px)** corner radius to maintain the "Soft Minimalist" aesthetic.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-dim`), white text (`on-primary`), no border, 24px corner radius.
*   **Secondary:** `secondary-container` fill, `on-secondary-container` text.
*   **Tertiary (Editorial):** Text only in `primary`, lowercase, with a 2px underline offset by 4px.

### Cards & Lists
*   **Forbid Dividers:** Do not use horizontal lines between list items. Use 24px–32px of vertical padding to separate entries.
*   **Card Styling:** Use `surface-container-lowest` with a subtle `xl` corner radius. 

### Input Fields
*   **Style:** Minimalist. No "box" containers. Use a "Soft Underline" approach or a `surface-container-low` background with a subtle bottom-heavy radius.
*   **Focus State:** Shift background to `surface-container-highest` and animate the label color to `primary`.

### Specialized Clinical Components
*   **Dermal Map Pins:** Soft-pulsing glass circles used on anatomical diagrams.
*   **Prescription Chips:** Use `tertiary-container` for medical-grade information to differentiate it from lifestyle content.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use 80px+ margins on the 12-column grid to ensure the layout feels "premium."
*   **Do** lean into asymmetry. For example, align a header to column 2 while the body text starts at column 4.
*   **Do** use lowercase for UI labels like "save changes" or "view gallery" to maintain the brand tone.

### Don’t:
*   **Don’t** use pure black (#000000) for text. It breaks the "Warm Off-White" serenity. Use `on-surface`.
*   **Don’t** use standard Material Design "Drop Shadows." They look dated and "cheap" in an editorial context.
*   **Don’t** crowd the screen. If a section feels busy, double the padding. In this system, space equals trust.
*   **Don't** use sharp 90-degree corners. Everything must feel "human-centered" and soft to the touch.

---

**Director’s Final Note:** 
Always ask yourself: *"Does this look like a medical form, or does it look like a boutique skin-care editorial?"* If it feels like a form, add more whitespace and remove the borders.```