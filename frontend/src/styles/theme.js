import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#ffebee',
      500: '#D90404',
      600: '#b50303',
      700: '#910202',
    },
    primary: '#D90404',
    secondary: '#ff6d00',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;