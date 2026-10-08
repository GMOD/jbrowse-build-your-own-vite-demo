# vite with the JBrowse engine and your own UI

JBrowse 2's linear genome view engine with none of its stock chrome: this app
draws its own location box, zoom buttons and track checkboxes, and
`@jbrowse/display-ui/embed` draws the tracks. Built on the v5 prereleases
(`next` on npm) with [vite](https://vite.dev/).

- `useCreateViewState` from `@jbrowse/react-linear-genome-view2` builds the
  engine.
- `EmbedProvider`, `TrackStack`, `Scalebar`, `LocationBox` and `TrackToggle`
  from `@jbrowse/display-ui/embed` mount it.
- `src/config.ts` holds the assembly and tracks. Swap in your own files there.

## Usage

```bash
pnpm install
pnpm dev
```

`pnpm build` writes a static site to `dist`.

More examples, one per page: https://jbrowse.org/storybook/byo/
