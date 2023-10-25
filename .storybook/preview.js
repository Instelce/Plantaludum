
import '../src/styles/index.scss';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'rgb(var(--color-background))',
        },
        {
          name: 'light',
          value: '#fff',
        }
      ]
    }
  },
};

export default preview;
