# Project organization

- `app/`: Next.js pages, route layouts, and global styles. Route filenames stay in their required locations.
- `components/layout/`: home page composition and navigation.
- `components/sections/`: daily reasons and relationship counter.
- `components/letters/`: page letters, future letters, popup message, and lily animation with its styles.
- `components/gallery/`: album covers, photo cards, gallery grids, and memories.
- `components/backgrounds/`: drifting hearts and saved background previews with their styles.
- `components/welcome/`: password gate and welcome screen.
- `components/shared/`: name toast and the retained deferred-loading helper.
- `components/audio/`: retained voice-note component (not displayed on the site).
- `lib/gallery/`: database queries, editing actions, and retained caching helpers.
- `lib/services/`: Prisma and Cloudinary clients.
- `lib/config/site.ts`: site text and configuration.
- `lib/hooks/`: shared React hooks.
- `prisma/`: database schema.
- `tests/`: gallery action tests.
- `public/`: images, icons, and audio. Existing paths are preserved to keep asset URLs working.

Root configuration files, agent instructions, dependencies, and generated build folders remain in their standard locations. Unused components and alternate previews are retained.
