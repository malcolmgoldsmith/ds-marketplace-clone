/**
 * Settings Page JavaScript
 * Lenovo UDS Marketplace
 *
 * Manages user settings with localStorage persistence:
 * - Email addresses (primary and alternate)
 * - Terms & Conditions acceptance
 * - Device registration
 */

// ===================================
// Data Structure & Constants
// ===================================

const STORAGE_KEYS = {
  PRIMARY_EMAIL: 'primaryEmail',
  ALTERNATE_EMAIL: 'alternateEmail',
  TERMS: 'termsAcceptance',
  DEVICES: 'devices'
};

// ===================================
// Initialize on Page Load
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  loadPrimaryEmail();
  loadAlternateEmail();
  loadTermsAcceptance();
  loadDevices();
});

// ===================================
// Email Management
// ===================================

/**
 * Load and display primary email
 */
function loadPrimaryEmail() {
  const primaryEmail = localStorage.getItem(STORAGE_KEYS.PRIMARY_EMAIL) || 'user@example.com';
  document.getElementById('primaryEmail').textContent = primaryEmail;

  // Set primary email if not exists (for demo purposes)
  if (!localStorage.getItem(STORAGE_KEYS.PRIMARY_EMAIL)) {
    localStorage.setItem(STORAGE_KEYS.PRIMARY_EMAIL, 'user@example.com');
  }
}

/**
 * Load and display alternate email
 */
function loadAlternateEmail() {
  const alternateEmail = localStorage.getItem(STORAGE_KEYS.ALTERNATE_EMAIL);
  const alternateEmailText = document.getElementById('alternateEmailText');
  const editBtn = document.getElementById('editAlternateBtn');

  if (alternateEmail) {
    alternateEmailText.textContent = alternateEmail;
    editBtn.textContent = 'Edit';
  } else {
    alternateEmailText.textContent = 'No alternate email set';
    editBtn.textContent = 'Add Email';
  }
}

/**
 * Toggle alternate email form visibility
 */
function toggleAlternateEmailForm() {
  const form = document.getElementById('alternateEmailForm');
  const display = document.getElementById('alternateEmailDisplay');
  const input = document.getElementById('alternateEmailInput');
  const error = document.getElementById('emailError');

  if (form.style.display === 'none') {
    // Show form
    form.style.display = 'block';
    display.style.display = 'none';

    // Pre-fill with existing value if available
    const existingEmail = localStorage.getItem(STORAGE_KEYS.ALTERNATE_EMAIL);
    input.value = existingEmail || '';
    input.focus();
    error.style.display = 'none';
  } else {
    // Hide form
    form.style.display = 'none';
    display.style.display = 'flex';
  }
}

/**
 * Save alternate email to localStorage
 */
function saveAlternateEmail() {
  const input = document.getElementById('alternateEmailInput');
  const error = document.getElementById('emailError');
  const email = input.value.trim();

  // Validate email
  if (!email) {
    error.textContent = 'Please enter an email address';
    error.style.display = 'block';
    return;
  }

  if (!isValidEmail(email)) {
    error.textContent = 'Please enter a valid email address';
    error.style.display = 'block';
    return;
  }

  // Check if same as primary email
  const primaryEmail = localStorage.getItem(STORAGE_KEYS.PRIMARY_EMAIL);
  if (email === primaryEmail) {
    error.textContent = 'Alternate email cannot be the same as primary email';
    error.style.display = 'block';
    return;
  }

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.ALTERNATE_EMAIL, email);

  // Update UI
  loadAlternateEmail();
  toggleAlternateEmailForm();

  // Clear input and error
  input.value = '';
  error.style.display = 'none';
}

/**
 * Cancel alternate email edit
 */
function cancelAlternateEmailEdit() {
  const input = document.getElementById('alternateEmailInput');
  const error = document.getElementById('emailError');

  input.value = '';
  error.style.display = 'none';
  toggleAlternateEmailForm();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===================================
// Terms & Conditions Management
// ===================================

/**
 * Load terms acceptance state from localStorage
 */
function loadTermsAcceptance() {
  const termsData = localStorage.getItem(STORAGE_KEYS.TERMS);
  const terms = termsData ? JSON.parse(termsData) : { lenovo: false, publisher: false };

  document.getElementById('lenovoTerms').checked = terms.lenovo;
  document.getElementById('publisherTerms').checked = terms.publisher;
}

/**
 * Handle terms checkbox change
 */
function handleTermsChange(type) {
  const termsData = localStorage.getItem(STORAGE_KEYS.TERMS);
  const terms = termsData ? JSON.parse(termsData) : { lenovo: false, publisher: false };

  // Update the specific term
  if (type === 'lenovo') {
    terms.lenovo = document.getElementById('lenovoTerms').checked;
  } else if (type === 'publisher') {
    terms.publisher = document.getElementById('publisherTerms').checked;
  }

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));

  // Show success message
  showTermsSuccess();
}

/**
 * Show terms acceptance success message
 */
function showTermsSuccess() {
  const successMsg = document.getElementById('termsSuccess');
  successMsg.style.display = 'flex';

  // Hide after 3 seconds
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);
}

// ===================================
// Device Management
// ===================================

/**
 * Load devices from localStorage and display
 */
function loadDevices() {
  const devicesData = localStorage.getItem(STORAGE_KEYS.DEVICES);
  const devices = devicesData ? JSON.parse(devicesData) : [];

  const deviceList = document.getElementById('deviceList');
  const emptyState = document.getElementById('emptyState');

  // Clear current list
  deviceList.innerHTML = '';

  if (devices.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    devices.forEach((device, index) => {
      const deviceItem = createDeviceElement(device, index);
      deviceList.appendChild(deviceItem);
    });
  }
}

/**
 * Create device HTML element
 */
function createDeviceElement(device, index) {
  const div = document.createElement('div');
  div.className = 'device-item';
  div.innerHTML = `
    <div class="device-info">
      <h4 class="device-name">Device ${index + 1}</h4>
      <p class="device-details">
        Product: ${escapeHtml(device.productNumber)} | Serial: ${escapeHtml(device.serialNumber)}
      </p>
    </div>
    <div class="device-actions">
      <button onclick="deleteDevice(${index})" class="btn-delete" aria-label="Delete device ${index + 1}">
        Delete
      </button>
    </div>
  `;
  return div;
}

/**
 * Show add device form
 */
function showAddDeviceForm() {
  const form = document.getElementById('addDeviceForm');
  const btn = document.getElementById('addDeviceBtn');
  const error = document.getElementById('deviceError');

  form.style.display = 'block';
  btn.style.display = 'none';
  error.style.display = 'none';

  // Clear inputs
  document.getElementById('productNumber').value = '';
  document.getElementById('serialNumber').value = '';

  // Focus first input
  document.getElementById('productNumber').focus();
}

/**
 * Cancel add device
 */
function cancelAddDevice() {
  const form = document.getElementById('addDeviceForm');
  const btn = document.getElementById('addDeviceBtn');
  const error = document.getElementById('deviceError');

  form.style.display = 'none';
  btn.style.display = 'inline-flex';
  error.style.display = 'none';

  // Clear inputs
  document.getElementById('productNumber').value = '';
  document.getElementById('serialNumber').value = '';
}

/**
 * Save device to localStorage
 */
function saveDevice() {
  const productNumber = document.getElementById('productNumber').value.trim();
  const serialNumber = document.getElementById('serialNumber').value.trim();
  const error = document.getElementById('deviceError');

  // Validate inputs
  if (!productNumber || !serialNumber) {
    error.textContent = 'Please fill in both product number and serial number';
    error.style.display = 'block';
    return;
  }

  if (productNumber.length < 5 || serialNumber.length < 5) {
    error.textContent = 'Product and serial numbers must be at least 5 characters';
    error.style.display = 'block';
    return;
  }

  // Get existing devices
  const devicesData = localStorage.getItem(STORAGE_KEYS.DEVICES);
  const devices = devicesData ? JSON.parse(devicesData) : [];

  // Check for duplicates
  const isDuplicate = devices.some(device =>
    device.productNumber.toLowerCase() === productNumber.toLowerCase() &&
    device.serialNumber.toLowerCase() === serialNumber.toLowerCase()
  );

  if (isDuplicate) {
    error.textContent = 'This device is already registered';
    error.style.display = 'block';
    return;
  }

  // Add new device
  const newDevice = {
    id: Date.now(),
    productNumber: productNumber,
    serialNumber: serialNumber,
    addedDate: new Date().toISOString()
  };

  devices.push(newDevice);

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));

  // Update UI
  loadDevices();
  cancelAddDevice();
}

/**
 * Delete device from localStorage
 */
function deleteDevice(index) {
  if (!confirm('Are you sure you want to remove this device?')) {
    return;
  }

  const devicesData = localStorage.getItem(STORAGE_KEYS.DEVICES);
  const devices = devicesData ? JSON.parse(devicesData) : [];

  // Remove device at index
  devices.splice(index, 1);

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));

  // Update UI
  loadDevices();
}

// ===================================
// How-To Guide Toggle
// ===================================

/**
 * Toggle how-to guide visibility
 */
function toggleHowToGuide() {
  const content = document.getElementById('howToContent');
  const toggle = document.querySelector('#howToToggle .toggle-icon');

  if (content.style.display === 'none') {
    content.style.display = 'block';
    toggle.classList.add('rotated');
  } else {
    content.style.display = 'none';
    toggle.classList.remove('rotated');
  }
}

// ===================================
// Utility Functions
// ===================================

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Export settings data (for debugging)
 */
function exportSettings() {
  const settings = {
    primaryEmail: localStorage.getItem(STORAGE_KEYS.PRIMARY_EMAIL),
    alternateEmail: localStorage.getItem(STORAGE_KEYS.ALTERNATE_EMAIL),
    terms: localStorage.getItem(STORAGE_KEYS.TERMS),
    devices: localStorage.getItem(STORAGE_KEYS.DEVICES)
  };

  console.log('Settings Data:', settings);
  return settings;
}

/**
 * Clear all settings (for debugging)
 */
function clearAllSettings() {
  if (confirm('Are you sure you want to clear all settings? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEYS.ALTERNATE_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.TERMS);
    localStorage.removeItem(STORAGE_KEYS.DEVICES);

    // Reload page to reflect changes
    window.location.reload();
  }
}

// Make functions available globally for inline onclick handlers
window.toggleAlternateEmailForm = toggleAlternateEmailForm;
window.saveAlternateEmail = saveAlternateEmail;
window.cancelAlternateEmailEdit = cancelAlternateEmailEdit;
window.handleTermsChange = handleTermsChange;
window.showAddDeviceForm = showAddDeviceForm;
window.saveDevice = saveDevice;
window.cancelAddDevice = cancelAddDevice;
window.deleteDevice = deleteDevice;
window.toggleHowToGuide = toggleHowToGuide;
window.exportSettings = exportSettings;
window.clearAllSettings = clearAllSettings;
