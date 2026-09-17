# 🐟 Fisheye FAQ for Framer

A tactile FAQ accordion for Framer that turns ordinary rows into a responsive fisheye interface. Move the pointer through the list and nearby rows gently magnify, lift, and react around the cursor. In Hover mode, the closest row can open automatically; Click mode gives you explicit control.

**Made with 💛 by Karim Saif**

## ✨ Preview

[Live Demo](https://fisheyefaq.framer.website/)

[Framer Community](https://www.framer.com/community/posts/FoCV9BjbEN51VL1wTV123p/)

## What makes it different

Fisheye FAQ is built around distance-based interaction rather than a conventional accordion layout.

- 🐟 Cursor-proximity fisheye magnification
- 🫧 Spring-based scaling and hover lift
- ⚡ Hover or Click activation modes
- 🎯 Nearest-row detection using cached row centers
- 🧩 Custom FAQ items with independent questions and answers
- 🔤 Framer Font controls for questions and answers
- ➕ Custom icon, size, color, and rotation
- 🌫️ Configurable answer blur transition
- ♿ Semantic button controls for accessible activation
- ⌨️ Keyboard activation with Enter and Space
- 👁️ Visible keyboard focus treatment
- 📱 Pointer/touch-friendly interaction
- 🧘 Reduced-motion support
- 🧱 Static renderer fallback for Framer
- 📐 Responsive width and layout controls

## 🎛️ Customize everything

The component exposes detailed Framer property controls so the interaction can match your site.

### Layout

Adjust maximum width, row spacing, horizontal and vertical padding, corner radius, and border thickness.

### Visuals

Customize inactive, hover, and active backgrounds; border colors; question and answer colors; icon color; and box shadow.

### Typography

Choose separate Framer fonts, sizes, weights, and answer line-height for questions and answers.

### Fisheye physics

Control whether magnification is enabled, how far the cursor influence reaches, the maximum scale, and the spring stiffness, damping, and mass.

### Accordion behavior

Choose **Hover** or **Click** activation, set an initially open row, and tune opening and closing duration and bounce.

### Icon

Show or hide the icon, change its character, size, and open-state rotation.

### Motion

Control hover lift, active scale, answer spacing, transition blur, and reduced-motion behavior.

### Accessibility

The FAQ uses semantic `<button>` controls for interactive rows. Keyboard users can activate rows with **Enter** or **Space**, and focus styling remains available. Hover mode still keeps the rows keyboard-accessible instead of making pointer interaction the only way to operate the accordion.

## 🧠 Interaction model

### Hover mode

Move your pointer through the accordion. The closest row becomes the active target and opens automatically. The surrounding rows respond to the cursor with distance-based magnification.

### Click mode

The fisheye interaction remains available while opening and closing is controlled by explicit activation.

### Reduced motion

When the user has enabled reduced motion and the component is configured to respect it, magnification, lifting, spring movement, and animated transitions are simplified.

## 🛠️ Performance details

The component avoids repeatedly measuring every row during pointer movement. Row centers are cached and refreshed when the layout, viewport, scroll position, or active/hovered state changes. Measurements are coalesced with `requestAnimationFrame`, while `ResizeObserver` keeps the cache current when row dimensions change.

Framer's static renderer gets a dedicated non-animated fallback, so the exported/static representation does not depend on live pointer effects or animation state.

## 📦 Installation

1. Open the component in Framer.
2. Add the component to your project.
3. Add or edit your FAQ items.
4. Choose Hover or Click activation.
5. Tune the fisheye and visual controls to match your design.

## 💳 Premium access

Get the premium version and support the project:

[Get Fisheye FAQ Premium](https://karimsaif.lemonsqueezy.com/checkout/buy/63239c76-5ff5-4b11-af6c-05d44025644c)

## 🔗 Links

- [Live Demo](https://fisheyefaq.framer.website/)
- [Framer Community Post](https://www.framer.com/community/posts/FoCV9BjbEN51VL1wTV123p/)
- [Premium Checkout](https://karimsaif.lemonsqueezy.com/checkout/buy/63239c76-5ff5-4b11-af6c-05d44025644c)
- [X / Karim Saif](https://x.com/karimsaif0)
- [Email](mailto:karimsaif010@gmail.com)

## 👤 Author

**Karim Saif**

Framer components, interactive UI experiments, and motion-driven web experiences.

## License

This repository contains the Fisheye FAQ Framer component. Review the repository's licensing terms before reusing or redistributing the source.
