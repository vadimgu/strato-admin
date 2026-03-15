
import React from 'react';
import { useTranslate, useResourceDefinitions } from 'strato-core';
import { humanize } from 'inflection';

export interface FieldTitleProps {
  resource?: string;
  source?: string;
  label?: string;
  isRequired?: boolean;
}

export const FieldTitle = (props: FieldTitleProps) => {
  const { resource, source, label, isRequired } = props;
  const translate = useTranslate();
  const definitions = useResourceDefinitions();

  const labelString = React.useMemo(() => {
    if (label !== undefined) {
      return translate(label, { _: label });
    }
    if (!resource || !source) {
      return source ? humanize(source) : '';
    }

    const definition = definitions[resource] as any;
    const fieldDefinition = definition?.fields?.[source];
    const defaultLabel = fieldDefinition?.label
      ? translate(fieldDefinition.label, { _: fieldDefinition.label })
      : source
        ? humanize(source)
        : '';

    return translate(`resources.${resource}.fields.${source}`, {
      _: defaultLabel,
    });
  }, [label, translate, resource, source, definitions]);

  return (
    <span>
      {labelString}
      {!isRequired && (
        <span
          style={{ color: '#687078', fontWeight: 'normal', fontStyle: 'italic', fontSize: '12px', marginLeft: '4px' }}
        >
          (optional)
        </span>
      )}
    </span>
  );
};

export default FieldTitle;
