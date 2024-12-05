# rnd-text-to-speech

## How to use

- Setup and seed local DB
  - `npx prisma migrate dev --name init`
  - `pnpm seed`
- Put session text in the `./sessions/<session-name>/source.txt` file
- Ensure each sentence is on a separate line

## Troubleshooting
