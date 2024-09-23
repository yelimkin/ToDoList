const { TextEncoder, TextDecoder } = require('text-encoding');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

require('@testing-library/jest-dom');
