# Claude Code Command Template for Feature Requirements

## ⚠️ CRITICAL CONSTRAINTS
1. **DO NOT MODIFY THE BASE PAGE** - The main marketplace site must remain completely intact as the plan of record. All features are additions, not modifications.
2. **STRICT DESIGN SYSTEM COMPLIANCE** - All UI/UX must 100% comply with `design-system.html`. No custom styling or random UI elements allowed.

## Initial Command Structure
```
claude "I need to add a new feature to my Lenovo UDS Marketplace site (running on localhost). 

FEATURE REQUIREMENT:
[Insert your specific feature requirement here]

CONTEXT:
- Base site: https://marketplace.uds.lenovo.com/ (MUST NOT BE MODIFIED)
- Design system reference: design-system.html (MUST BE FOLLOWED)
- Running locally for development
- Need 3 different implementation versions
- Each version should be accessible via navigation from the base site

Please follow the requirement capture process."
```

## Requirement Capture Process

### Phase 1: Initial Understanding
When you provide the feature requirement, Claude will:
1. Summarize the core functionality requested
2. Identify key technical components needed

### Phase 2: Clarifying Questions (2-3 targeted questions)
Claude will ask about:
- **User Experience**: "Who is the primary user for this feature and what's their main goal?"
- **Technical Constraints**: "Are there specific technologies/frameworks you're using (React, Vue, etc.) or APIs to integrate?"
- **Priority/Scope**: "What's the most critical aspect - performance, user-friendliness, or feature completeness?"

### Phase 3: Three Version Specifications

#### Version A: Minimal/MVP
- Core functionality only
- Simplest UI/UX
- Quick to implement
- Focus on proof of concept

#### Version B: Balanced/Standard
- Full feature set
- Professional UI/UX
- Good performance
- Production-ready approach

#### Version C: Enhanced/Premium
- Advanced features
- Polished UI with animations
- Optimized performance
- Additional nice-to-haves

## Implementation Structure

### Navigation Setup
```javascript
// Navigation component to add to your base site
const FeatureVersionNav = () => {
  return (
    <nav className="version-selector">
      <h3>Feature Versions</h3>
      <ul>
        <li><a href="/feature-v1">Version A: Minimal</a></li>
        <li><a href="/feature-v2">Version B: Standard</a></li>
        <li><a href="/feature-v3">Version C: Enhanced</a></li>
      </ul>
    </nav>
  );
};
```

### File Structure for Each Version
```
/src
  /features
    /[feature-name]
      /version-a
        - index.html
        - styles.css
        - script.js
      /version-b
        - index.html
        - styles.css
        - script.js
      /version-c
        - index.html
        - styles.css
        - script.js
      /shared
        - api.js
        - utils.js
```

## Output Format for Each Version

### For each version, Claude will provide:

1. **Overview**
   - Key characteristics
   - Time to implement estimate
   - Complexity level

2. **Technical Specification**
   - Components/modules needed
   - Data flow
   - API endpoints (if applicable)

3. **Code Implementation**
   - Complete HTML structure
   - CSS styling
   - JavaScript functionality
   - Integration points with existing site

4. **Testing Checklist**
   - Functionality tests
   - Edge cases
   - Performance considerations

## Example Usage

```
"I need to add a product comparison feature to my Lenovo UDS Marketplace site.

FEATURE REQUIREMENT:
Users should be able to select multiple products and compare their specifications side-by-side in a comparison table.

Please follow the requirement capture process."
```

## Next Steps

1. **Prepare your specific requirement** with as much detail as possible
2. **Run the command** with your requirement inserted
3. **Answer the clarifying questions** to refine the scope
4. **Review the 3 versions** and choose which to implement first
5. **Use the generated code** with your localhost setup

## Integration Checklist

- [ ] Update main navigation to include version selector
- [ ] Set up routing for each version
- [ ] Create feature branch in your repository
- [ ] Test each version independently
- [ ] Choose final version for production
- [ ] Document the chosen approach