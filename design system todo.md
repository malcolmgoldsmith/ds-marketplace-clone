PROJECT: Create atomic design system documentation for existing Lenovo Software & Subscriptions portal

CONTEXT CLARIFICATION:
- I have a STATIC website cloning tool (using Firecrawl + Playwright)
- My site is currently vanilla HTML/CSS/JS from https://marketplace.uds.lenovo.com/
- NOT a React/Next.js/Vue project - it's static HTML
- The todo file incorrectly assumes a framework-based project
- Need to create design system that works with static site structure

USER STORIES / TASKS:

## Setup & Integration (Static Site Approach)
□ 1. Create design-system.html file in same folder as my cloned static site
□ 2. Create design-system subfolder for documentation assets
□ 3. Copy/reference existing CSS from cloned Lenovo site
□ 4. Add "Design System" link to the cloned homepage HTML
□ 5. Create design-system.js for component loading from static HTML
□ 6. Set up component extraction from existing static HTML files

## Analyze Existing Static Structure
□ 7. Identify all HTML components in the cloned marketplace site
□ 8. Extract inline styles and classes used in product cards
□ 9. Document which external stylesheets are being loaded
□ 10. Map out component HTML structures from static files
□ 11. Identify repeated patterns in the static HTML
□ 12. List all images/assets used in components

## Documentation Layout (Static HTML)
□ 13. Build design-system.html with sidebar navigation (pure HTML/CSS)
□ 14. Create tabbed sections for Atoms/Molecules/Organisms/Templates
□ 15. Implement component preview areas using iframes or div injection
□ 16. Add code display areas with HTML-escaped content
□ 17. Build copy-to-clipboard using vanilla JavaScript
□ 18. Create filter/search without framework (vanilla JS)

## Extract Components from Static Site
□ 19. Copy Special Offers card HTML from cloned site
□ 20. Copy Microsoft 365 card HTML structure
□ 21. Copy McAfee card HTML structure
□ 22. Copy Dropbox card HTML structure
□ 23. Copy Norton card HTML structure
□ 24. Copy CyberLink card HTML structure
□ 25. Copy Foxit card HTML structure
□ 26. Copy Absolute card HTML structure
□ 27. Extract navigation header HTML
□ 28. Document grid system from existing CSS

## Atoms Documentation (From Static Assets)
□ 29. Extract colors from existing CSS files
□ 30. Document font families and sizes from stylesheets
□ 31. Find and document all button styles in HTML
□ 32. Collect all icons/images used
□ 33. Extract form input styles if present
□ 34. Document spacing classes used

## Molecules Documentation (Static Patterns)
□ 35. Document filter tag HTML structure
□ 36. Extract card header patterns
□ 37. Document any dropdown HTML if present
□ 38. Find badge/label HTML patterns
□ 39. Document link styles and patterns

## Organisms Documentation (Complete Components)
□ 40. Create live preview of Special Offers card (embed actual HTML)
□ 41. Create live preview of each product card
□ 42. Show navigation header with all elements
□ 43. Display grid layouts using existing classes
□ 44. Show responsive behavior using existing CSS

## Code Display for Static Site
□ 45. Display raw HTML for each component
□ 46. Show relevant CSS classes and styles
□ 47. Include any inline JavaScript if present
□ 48. Add HTML syntax highlighting (Prism.js or highlight.js)
□ 49. Escape HTML properly for display
□ 50. Create collapsible code sections with vanilla JS

## Static Site Component Loading
□ 51. Load component HTML from separate files or inline templates
□ 52. Use vanilla JavaScript for all interactivity
□ 53. Implement component preview refresh without frameworks
□ 54. Create component variation switcher with vanilla JS
□ 55. Handle responsive previews with CSS only

## Search & Filter (Vanilla JS)
□ 56. Build component search with vanilla JavaScript
□ 57. Create category filters without framework
□ 58. Implement smooth scrolling to components
□ 59. Add keyboard navigation with vanilla JS
□ 60. Build component index/table of contents

## Study Cake Design System
□ 61. Use Playwright to analyze cake.lenovo.com structure
□ 62. Note how they organize static documentation
□ 63. Study their component categorization
□ 64. Analyze their code snippet presentation

## Integration with Cloned Site
□ 65. Ensure design system works alongside cloned site
□ 66. Link CSS files properly (no duplication)
□ 67. Test that both sites work from same local server
□ 68. Add instructions for updating when re-cloning site
□ 69. Create README explaining static site structure
□ 70. Document how to add new components from future clones

## Compatibility Checks
□ 71. Ensure it works with simple HTTP server (python -m http.server)
□ 72. Test with Live Server VS Code extension
□ 73. Verify no CORS issues with local files
□ 74. Check all asset paths are relative
□ 75. Test in multiple browsers

QUESTIONS TO RESOLVE:
□ Confirm: Is your site the static clone from marketplace.next.uds.lenovo.com?
□ Confirm: Are you using Firecrawl + Playwright for cloning?
□ Confirm: Do you want the design system as a separate static HTML file?
□ Check: What local server are you using to serve the files?
□ Verify: Should the design system reference the cloned CSS or duplicate it?

ACCEPTANCE CRITERIA:
- Design system is a static HTML file that works alongside cloned site
- Works with simple HTTP server or file:// protocol
- All components extracted from actual cloned HTML
- No framework dependencies (pure HTML/CSS/JS)
- Code snippets show actual HTML from cloned site
- Organization inspired by cake.lenovo.com
- Everything works with vanilla JavaScript only

PRIORITY ORDER:
- P0: Clarify project structure and approach
- P0: Setup static HTML design system file
- P1: Extract components from cloned site
- P1: Create static HTML documentation layout
- P2: Implement vanilla JS interactivity
- P2: Add code display and copying
- P3: Search, filters, and polish