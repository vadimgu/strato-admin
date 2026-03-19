---
'@strato-admin/cloudscape': minor
'@strato-admin/core': minor
---

Introduced useResourceSchema hook: A new hook in SchemaRegistry.tsx that
provides a single point of access for resource names, labels, definitions, and
both field/input schemas. It automatically falls back to the central
SchemaRegistry if no local schema is provided.
