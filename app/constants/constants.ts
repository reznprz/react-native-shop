// --------------------
// Error Messages
// --------------------
export const ERROR_MESSAGES = {
  CATEGORY_NOT_FOUND: 'Category not found, Unable to scroll to the selected category.',
  DATA_NOT_AVAILABLE: 'No data available',
  FOOD_DATA_NOT_AVAILABLE: 'No Food data available.',
  MENU_DATA_NOT_AVAILABLE: 'No Menu data available.',
  NETWORK_ERROR: 'Unable to connect. Please try again later.',
  GENERAL_ERROR: 'An error occurred.',
} as const;

// --------------------
// Payment Warn Messages
// --------------------
export const PAYMENT_WARN_MESSAGES = {
  REST_PAYMENTS: 'Payments type have been reset after Discount, Please add Payment type again!',
  PAYMENTS_TOTAL_INCORRECT:
    'Payments types total sum incorrect. Please revise Payment amount again!.',
  PAYMENTS_CONFORMATION:
    'Payments types total sum is less than totalAmount. Please click Yes to proccesd as it would be marked as unpaid!.',
} as const;

// --------------------
// Button Labels
// --------------------
export const BUTTON_LABELS = {
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  LOGIN: 'Login',
  SIGN_UP: 'Sign Up',
  GO_BACK: 'Go Back',
  // Add more button labels as needed
} as const;

// --------------------
// Text Messages
// --------------------
export const TEXT_MESSAGES = {
  WORK_IN_PROGRESS_SUBTITLE: "We're building this awesome feature. Stay tuned for updates!",
  FEATURE_COMING_SOON: 'Feature Coming Soon',
  LOADING: 'Loading, please wait...',
  NO_DATA: 'No data available.',
  // Add more text messages as needed
} as const;

// --------------------
// Placeholder Texts
// --------------------
export const PLACEHOLDERS = {
  EMAIL: 'Enter your email',
  PASSWORD: 'Enter your password',
  USERNAME: 'Enter your username',
  // Add more placeholders as needed
} as const;

// --------------------
// Other Constants
// --------------------
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  FETCH_USER: '/api/user',
  // Add more endpoints as needed
} as const;
