# Design System Component Fixes

**Generated:** 2025-10-21
**Comparison:** Live Marketplace vs Local Design System
**Source:** verification/comparison/

---

## 📊 Comparison Summary

### ✅ Components Match (Count)
- **Product Cards**: 11 on both pages ✅
- **Buttons**: 6 on both pages ✅
- **Dropdowns**: Present on both pages ✅
- **Search Fields**: Present on both pages ✅
- **Breadcrumbs**: Present on both pages ✅
- **Header**: Present on both pages ✅

### 🎨 Visual Analysis Required

Based on screenshot comparison between live marketplace and design system documentation page:

---

## 🔧 Priority Fixes Needed

### **CRITICAL - Component Styling Issues**

#### 1. **Header Component**
- [ ] **Background color**: Live uses dark navy/charcoal (~#2b3a4a), design system may differ
- [ ] **Logo placement**: Red Lenovo logo in top-left
- [ ] **Top bar**: "Lenovo Subscription Portal" text with icon
- [ ] **Right-side elements**: Country dropdown + Search icon + Cart icon + Headphones icon + "Sign In" button
- [ ] **Layout**: Full-width header with proper spacing between elements
- [ ] **Icons sizing**: All header icons should be consistent size (~24px)

#### 2. **Product Cards**
- [ ] **Card variations**: Two distinct card types:
  - Featured cards (Special Offers, McAfee) - colored backgrounds with white text
  - Standard cards (Microsoft 365, Dropbox) - white backgrounds with logos
- [ ] **Special Offers card**: Purple background (#5d2661 or similar), white text, "Special Offers" title
- [ ] **McAfee card**: Red background (#c8102e), white McAfee logo, proper sizing
- [ ] **Image backgrounds**: Featured cards have solid color backgrounds, not just images
- [ ] **Card borders**: Standard cards have subtle borders, featured cards don't
- [ ] **Category chips**: Proper styling (light blue background, rounded)
- [ ] **Grid gap**: Verify 27px gap is correct
- [ ] **Card shadows**: Check if cards have drop shadows on hover

#### 3. **Dropdown Component**
- [ ] **Flag icon**: US flag should be 16×16px (currently verified as fixed)
- [ ] **Text alignment**: "United States" text properly aligned
- [ ] **Border color**: Should be rgb(106, 129, 158) - mercury-900
- [ ] **Hover state**: Border changes to blue on hover (verified)
- [ ] **Caret icon**: Down arrow properly sized (12×12px verified)

#### 4. **Search Field**
- [ ] **Icon placement**: Search icon on right side of input (verified as fixed)
- [ ] **Input styling**: White background, proper border
- [ ] **Placeholder text**: "Enter product name" or similar
- [ ] **Icon button**: 40×40px button size (verified)
- [ ] **Focus state**: Blue border on focus

#### 5. **Breadcrumbs**
- [ ] **Background**: Light gray background (#f7f9fa)
- [ ] **Text color**: Dark gray for "Home"
- [ ] **Font size**: 14px
- [ ] **Spacing**: Proper padding around breadcrumb

#### 6. **Buttons**
- [ ] **Primary button**: "Sign In" style - white text on dark background
- [ ] **Icon buttons**: Search, Cart, Headphones icons in header
- [ ] **Hover states**: Proper hover effects
- [ ] **Button sizing**: Consistent heights across all buttons

---

## 🎨 Design Token Verification

### Colors to Verify:
- [ ] **Primary Blue**: rgb(0, 102, 205) - midnight-40 ✅ Verified
- [ ] **Header Background**: Dark navy/charcoal color
- [ ] **Purple (Special Offers)**: ~#5d2661 or similar purple
- [ ] **Red (McAfee)**: ~#c8102e
- [ ] **Gray backgrounds**: Mercury shades for backgrounds
- [ ] **Text colors**: Verify carbon shades for text

### Typography to Verify:
- [ ] **Font family**: Lato, sans-serif (verified in CSS)
- [ ] **Heading sizes**: H1, H2 proper sizing
- [ ] **Body text**: 14px base size
- [ ] **Line heights**: Proper line-height ratios

---

## 🔍 Component-Specific Audits

### Header Component Audit:
```
Current Issues:
- Need to extract complete header with all icons
- Verify color scheme matches live site
- Ensure responsive behavior

Required Elements:
1. Top bar with subscription portal text
2. Lenovo logo (red)
3. Country dropdown (verified working)
4. Search icon button
5. Shopping cart icon button
6. Headphones/support icon button
7. "Sign In" button
```

### Product Cards Audit:
```
Current Issues:
- Missing "Special Offers" featured card styling
- Missing McAfee card with red background
- Need to verify card background colors

Required Variations:
1. Featured cards (colored backgrounds)
2. Standard cards (white backgrounds)
3. Proper category chip styling
4. Consistent card heights
```

### Breadcrumbs Audit:
```
Current Status: Component extracted
Need to verify:
- Background color matches live site
- Text styling correct
- Spacing/padding accurate
```

### Search Field Audit:
```
Current Status: Fixed (icon positioning corrected)
Verified:
✅ Icon on right side of input
✅ 40×40px button size
✅ Flex layout working
```

### Dropdown Audit:
```
Current Status: Fixed (sizing and structure corrected)
Verified:
✅ 170px width
✅ 40px height
✅ 16×16px flag icon
✅ 12×12px caret icon
✅ Proper text layout
```

---

## 📋 Implementation Priority

### Phase 1: Critical Fixes (Immediate)
1. ✅ Fix dropdown sizing and icon rendering
2. ✅ Fix search field icon positioning
3. [ ] Extract and style "Special Offers" card properly
4. [ ] Extract and style "McAfee" card with red background
5. [ ] Verify header component color scheme

### Phase 2: Enhancement (Secondary)
6. [ ] Add card hover effects
7. [ ] Verify all color tokens match live site
8. [ ] Add proper shadows and borders
9. [ ] Test responsive behavior of components

### Phase 3: Polish (Nice to Have)
10. [ ] Add component interaction states
11. [ ] Document all component variations
12. [ ] Create component usage examples
13. [ ] Add accessibility notes

---

## 🎯 Testing Checklist

After implementing fixes, verify:
- [ ] All components render at correct sizes
- [ ] Colors match live site exactly
- [ ] Typography sizes and weights are accurate
- [ ] Spacing and padding match live site
- [ ] Icons are properly sized and positioned
- [ ] Hover states work correctly
- [ ] Components are responsive
- [ ] No console errors
- [ ] Screenshots match between live and local

---

## 📝 Notes

- Product card count matches: 11 cards on both pages ✅
- Button count matches: 6 buttons on both pages ✅
- All major component types are present in design system ✅
- Main focus should be on styling accuracy, not component extraction

**Overall Assessment**: Component inventory is complete. Focus needed on:
1. Color accuracy (especially featured card backgrounds)
2. Header styling and layout
3. Card variations (featured vs standard)
4. Hover states and interactions
