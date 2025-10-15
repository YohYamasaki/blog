# Blog of Yohei Yamasaki

## Project Structure

This site is made with Astro.

```text
├── public/
└── src/
   ├── assets/
   ├── components/
   ├── content/
   ├── i18n/
   ├── layouts/
   └── pages/
   └── styles/
   └── utils/
```

### Update contents

#### Text-based contents

Most of the text content, i.e. news, publications, is stored in the appropriate
directory under `src/content/`. Within the category folders, English/Japanese
content should be stored separately as `.mdx` files.

Other short texts in the website should be stored in a `translations` object in
`src/i18n/ui.ts` to ensure localization.

#### Images

All images should be placed inside `src/assets/images/` to be optimized by
Astro. To display the images, use `DynamicPicture` component to dynamically
import the target image.

```typescript jsx
<DynamicPicture src="/src/assets/images/example.jpg" alt="example alt text" />
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `deno install`        | Installs dependencies                            |
| `deno task dev`       | Starts local dev server at `localhost:4321`      |
| `deno task build`     | Build your production site to `./dist/`          |
| `deno task preview`   | Preview your build locally, before deploying     |
| `deno task astro ...` | Run CLI commands like `astro add`, `astro check` |
