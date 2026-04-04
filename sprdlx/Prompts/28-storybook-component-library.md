# Prompt 28 — Storybook Component Library
# Category: Documentation
# Stack: React + Vite + TypeScript + Tailwind

Set up Storybook so every component in components/common/ has documented,
interactive stories. This becomes your living design system reference.

---

## INSTALL

npx storybook@latest init --builder vite
npm install --save-dev @storybook/addon-a11y @storybook/addon-docs

---

## .storybook/main.ts

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

---

## .storybook/preview.ts

```ts
import type { Preview } from '@storybook/react';
import '../src/styles/index.css'; // import Tailwind

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
  },
};

export default preview;
```

---

## STORY FILE TEMPLATE

Create a .stories.tsx for EVERY component in components/common/:

```tsx
// src/components/common/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],    // auto-generates docs from JSDoc + types
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Click me', variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
  args: { children: 'Cancel', variant: 'secondary', size: 'md' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger', size: 'md' },
};

export const Loading: Story = {
  args: { children: 'Saving...', variant: 'primary', isLoading: true },
};

export const Disabled: Story = {
  args: { children: 'Disabled', variant: 'primary', disabled: true },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">Small</Button>
      <Button variant="primary" size="md">Medium</Button>
      <Button variant="primary" size="lg">Large</Button>
    </div>
  ),
};
```

---

## STORIES TO CREATE

Write stories for ALL of these (or create the component + story if missing):

| Component | Stories to cover |
|---|---|
| Button | all variants, all sizes, loading, disabled |
| Input | default, with error, with hint, disabled, required |
| Modal | default, with footer actions, small, large |
| Badge | all variants (success, warning, danger, info) |
| Spinner | all sizes |
| Card | default, clickable, with image |
| EmptyState | with/without action button |
| ErrorState | with/without retry button |
| PageLoader | default |
| Toast | all types (success, error, info, warning) |
| Avatar | with image, initials fallback, sizes |
| Table | with data, loading, empty, with pagination |
| Dropdown | single select, multi-select |
| ThemeToggle | light mode, dark mode |

---

## package.json scripts

```json
{
  "scripts": {
    "storybook":       "storybook dev --port 6006",
    "storybook:build": "storybook build"
  }
}
```

---

## DELIVERY

1. .storybook/main.ts + preview.ts
2. A .stories.tsx file for every component in src/components/common/
3. Stories cover all meaningful states and variants
4. A11y addon enabled — every story passes accessibility checks
5. npm run storybook starts without errors
