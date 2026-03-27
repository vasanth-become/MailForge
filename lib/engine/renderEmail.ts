// renderEmail.ts — re-exports from the registry for backwards compatibility.
// All template logic now lives in lib/engine/templates/* and lib/engine/registry.ts
export { renderEmail, getTemplate, getTemplatesByCategory, TEMPLATE_REGISTRY } from "./registry";
export type { TemplateDefinition, TemplateCategory, TemplateLayout } from "./registry";
