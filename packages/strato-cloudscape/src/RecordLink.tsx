import React from 'react';
import Link from '@cloudscape-design/components/link';
import { useCreatePath, useResourceContext, useRecordContext } from '@strato-admin/core';
import { useNavigate } from 'react-router-dom';

export type RecordLinkType = string | boolean | ((record: any, reference?: string) => string);

export interface RecordLinkProps {
  link?: RecordLinkType;
  resource?: string;
  children: React.ReactNode;
}

const RecordLinkImpl = ({ link, resource, children }: RecordLinkProps) => {
  const contextResource = useResourceContext();
  const record = useRecordContext();
  const createPath = useCreatePath();
  const navigate = useNavigate();

  const finalResource = resource ?? contextResource;

  if (!record || !finalResource) {
    return <>{children}</>;
  }

  let href = '';
  if (typeof link === 'function') {
    href = link(record, finalResource);
  } else if (link === true) {
    href = createPath({ resource: finalResource, id: record.id, type: 'edit' });
  } else if (link === 'edit' || link === 'show') {
    href = createPath({ resource: finalResource, id: record.id, type: link });
  } else if (typeof link === 'string') {
    href = link;
  }

  if (!href) {
    return <>{children}</>;
  }

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

const RecordLink = ({ link, resource, children }: RecordLinkProps) => {
  if (!link) {
    return <>{children}</>;
  }
  return (
    <RecordLinkImpl link={link} resource={resource}>
      {children}
    </RecordLinkImpl>
  );
};

export default RecordLink;
