import React from 'react';
import { useDynamicImport } from 'docusaurus-plugin-react-docgen-typescript/useDynamicImport';

interface PropInfo {
  name: string;
  type: { name: string };
  defaultValue?: { value: string };
  description: string;
  required: boolean;
}

export const PropsTable = ({ name }: { name: string }) => {
  const props = useDynamicImport(name);

  if (!props) {
    return (
      <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
        <em>
          Prop metadata for "{name}" not found. Ensure the component is exported and the plugin is configured correctly.
        </em>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--ifm-contents-border-color)' }}>
            <th style={{ padding: '0.5rem' }}>Prop</th>
            <th style={{ padding: '0.5rem' }}>Type</th>
            <th style={{ padding: '0.5rem' }}>Default</th>
            <th style={{ padding: '0.5rem' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(props as Record<string, PropInfo>).map((prop) => (
            <tr key={prop.name} style={{ borderBottom: '1px solid var(--ifm-contents-border-color)' }}>
              <td style={{ padding: '0.5rem' }}>
                <code>{prop.name}</code>
                {prop.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
              </td>
              <td style={{ padding: '0.5rem' }}>
                <code style={{ fontSize: '0.85em', color: 'var(--ifm-color-secondary-darkest)' }}>
                  {prop.type.name}
                </code>
              </td>
              <td style={{ padding: '0.5rem' }}>
                {prop.defaultValue?.value ? (
                  <code>{prop.defaultValue.value}</code>
                ) : (
                  <em style={{ color: '#999' }}>-</em>
                )}
              </td>
              <td style={{ padding: '0.5rem', fontSize: '0.9em' }}>{prop.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropsTable;
