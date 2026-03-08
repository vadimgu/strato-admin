import React from 'react';
import Link from '@cloudscape-design/components/link';
import { useCreatePath, useResourceContext, useRecordContext, type RaRecord } from 'ra-core';
import { useNavigate } from 'react-router-dom';

export type FieldLinkType = 'edit' | 'show';

export interface FieldLinkProps {
  link?: FieldLinkType;
  children: React.ReactNode;
}

const FieldLink = ({ link, children }: FieldLinkProps) => {
  const resource = useResourceContext();
  const record = useRecordContext();
  const createPath = useCreatePath();
  const navigate = useNavigate();

  if (!link || !record || !resource) {
    return <>{children}</>;
  }

  const href = createPath({
    resource,
    id: record.id,
    type: link,
  });

  return (
    <Link
      href={href}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </Link>
  );
};

export default FieldLink;
