import React from 'react';
import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
  Link,
  Icon,
  ContentLayout,
  ColumnLayout,
} from '@cloudscape-design/components';
import { CodeView } from "@cloudscape-design/code-view";
import typescriptHighlight from "@cloudscape-design/code-view/highlight/typescript";
import { useDefaultTitle } from '@strato-admin/core';

/**
 * Default component to display when the admin has no resources.
 * This is a Cloudscape-themed replacement for the default react-admin Ready component.
 */
export const Ready = () => {
  const defaultTitle = useDefaultTitle();
  const appTitle = typeof defaultTitle === 'string' ? defaultTitle : 'Strato Admin';

  const codeSnippet = `import { Admin, ResourceSchema, TextField } from '@strato-admin/admin';

export const App = () => (
    <Admin dataProvider={...}>
        <ResourceSchema name="posts" >
          <TextField source="id" />
        </ResourceSchema>
    </Admin>
);`;

  return (
    <ContentLayout
      maxContentWidth={1040}
      headerVariant="high-contrast"
      header={
        <Box padding={{ vertical: 'xxxl' }} textAlign="center">
          <SpaceBetween size="l">
            <Header
              variant="h1"
              description="Your Strato Admin application is properly configured and ready to go."
            >
              Welcome to {appTitle}
            </Header>
            <Box variant="p">
              Strato Admin uses a <strong>Schema First</strong> approach to build admin interfaces efficiently.
              Start by defining your resources and let us handle the rest.
            </Box>
            <Box margin={{ top: 'm' }}>
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  href="https://strato-admin.dev/docs/getting-started/tutorial"
                  iconName="external"
                  iconAlign="right"
                >
                  Get started with the tutorial
                </Button>
                <Button
                  href="https://github.com/vadimgu/strato-admin"
                  iconName="external"
                  iconAlign="right"
                >
                  View on GitHub
                </Button>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="xxl">
        {/* Features / Details Section */}
        <SpaceBetween size="l">
          <Container
            header={
              <Header variant="h2">
                How to add your first resource
              </Header>
            }
          >
            <SpaceBetween size="m">
              <Box variant="p">
                Add a <code>&lt;ResourceSchema&gt;</code> component as a child of your <code>&lt;Admin&gt;</code> to define your data model.
              </Box>
              <CodeView
                content={codeSnippet}
                highlight={typescriptHighlight}
              />
            </SpaceBetween>
          </Container>

          <Container
            header={
              <Header variant="h2">Next steps</Header>
            }
          >
            <ColumnLayout columns={2} variant="text-grid">
              <div>
                <Box variant="h3" fontWeight="bold">
                  <Icon name="status-info" variant="link" /> Core Concepts
                </Box>
                <Box variant="p">
                  Learn how <Link href="https://strato-admin.dev/docs/core-concepts/schema" external>Schemas</Link> work to automate your UI.
                </Box>
              </div>
              <div>
                <Box variant="h3" fontWeight="bold">
                  <Icon name="star" variant="warning" /> Design System
                </Box>
                <Box variant="p">
                  Explore the <Link href="https://cloudscape.design/" external>Cloudscape design system</Link> components.
                </Box>
              </div>
            </ColumnLayout>
          </Container>
        </SpaceBetween>

        {/* Footer */}
        <Box textAlign="center" color="text-label" margin={{ top: 'xs' }} padding={{ bottom: 'xxxl' }}>
          Built with <Link href="https://www.strato-admin.dev" external>Strato Admin</Link>.
        </Box>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Ready;
