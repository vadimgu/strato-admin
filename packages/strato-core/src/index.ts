export * from '@strato-admin/ra-core';
export * from './resource';
export * from './routing';

// Resolve ambiguity between ra-core and strato-core resource exports.
export { ResourceContext, Resource } from './resource';

// Resolve ambiguity for routing hooks
export { useCreatePath, useGetPathForRecord, type UseGetPathForRecordOptions } from './routing';
