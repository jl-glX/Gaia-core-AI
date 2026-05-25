# Technical Debt

## Known issues

- Review mixed legacy/new components.
- Review `baseUrl` warning before TypeScript 7.
- Check if `dist/` and `node_modules/` are ignored.
- Simplify duplicated frontend/backend config.
- Audit unused UI components.
- Review security layer before real AI provider integration.

## Rule

Do not add major features until `npm run ci` passes.