import "../src/styles/style.scss"

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value: '#2a2a2a',
        },
      ]
    }
  },
};

export default preview;
