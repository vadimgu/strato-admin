# The Data-Driven Dashboard

So far, all our views have been generated from `<ResourceSchema>`. But a real admin dashboard usually has a **home page** with KPI cards, charts, and summaries. In this chapter, we will build one using Strato Admin's headless data hooks and Cloudscape's chart components.

## The Headless Paradigm

Strato Admin separates **data fetching** from **rendering**. The same hooks that power `<List>` and `<Detail>` are available to you directly. This means you can build any custom UI while still benefiting from caching, loading states, and your configured data provider.

## Setting Up a Custom Dashboard

`<Admin>` accepts a `dashboard` prop — a React component that is rendered when the user navigates to `/`.

Create `src/Dashboard.tsx`:

```tsx title="src/Dashboard.tsx"
export const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>StratoShop Overview</h1>
      {/* We'll fill this in below */}
    </div>
  );
};
```

Register it in `App.tsx`:

```tsx title="src/App.tsx"
import { Dashboard } from './Dashboard';

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard}>
    {/* resources */}
  </Admin>
);
```

## Fetching Data with `useGetList`

The `useGetList` hook fetches a paginated, sorted, filtered list of records — the same way `<List>` does internally.

Let's fetch the 5 most recent orders to display in a summary table:

```tsx title="src/Dashboard.tsx"
import { useGetList } from '@strato-admin/admin';
import Table from '@cloudscape-design/components/table';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';

export const RecentOrders = () => {
  const { data: orders, isPending } = useGetList('orders', {
    sort: { field: 'date', order: 'DESC' },
    pagination: { page: 1, perPage: 5 },
  });

  if (isPending) return <Spinner />;

  return (
    <Table
      columnDefinitions={[
        { id: 'id', header: 'Order #', cell: (item) => item.id },
        { id: 'customer', header: 'Customer', cell: (item) => item.customer_id },
        { id: 'total', header: 'Total', cell: (item) => `$${item.total}` },
        { id: 'status', header: 'Status', cell: (item) => item.status },
      ]}
      items={orders ?? []}
      header={<Box variant="h2">Recent Orders</Box>}
    />
  );
};
```

## Adding a Chart

Cloudscape includes `BarChart` and `LineChart` components. Let's aggregate order totals by month to build a revenue chart.

```tsx title="src/Dashboard.tsx"
import { useGetList } from '@strato-admin/admin';
import BarChart from '@cloudscape-design/components/bar-chart';
import Box from '@cloudscape-design/components/box';
import Spinner from '@cloudscape-design/components/spinner';

const groupByMonth = (orders: any[]) => {
  const totals: Record<string, number> = {};
  for (const order of orders) {
    const month = new Date(order.date).toLocaleString('en', { month: 'short', year: '2-digit' });
    totals[month] = (totals[month] ?? 0) + order.total;
  }
  return Object.entries(totals).map(([x, y]) => ({ x, y }));
};

export const RevenueChart = () => {
  const { data: orders, isPending } = useGetList('orders', {
    sort: { field: 'date', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
  });

  if (isPending) return <Spinner />;

  const series = [{ title: 'Revenue', type: 'bar' as const, data: groupByMonth(orders ?? []) }];

  return <BarChart series={series} xTitle="Month" yTitle="Revenue ($)" height={300} empty={<Box>No data</Box>} />;
};
```

## Putting it Together

Compose both components in your `Dashboard`:

```tsx title="src/Dashboard.tsx"
import ContentLayout from '@cloudscape-design/components/content-layout';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';

export const Dashboard = () => (
  <ContentLayout header={<Header variant="h1">StratoShop Overview</Header>}>
    <Grid gridDefinition={[{ colspan: { default: 12, l: 8 } }, { colspan: { default: 12, l: 4 } }]}>
      <RevenueChart />
      <RecentOrders />
    </Grid>
  </ContentLayout>
);
```

## How it Works

- **`useGetList(resource, params)`** returns `{ data, total, isPending, error }`. It is backed by the same data provider and caching layer as the standard `<List>` component.
- **No schema required:** The dashboard doesn't use `<ResourceSchema>` at all. You get raw records and render them however you like.
- **Cloudscape components:** Any Cloudscape component can be used freely inside your dashboard. The design system handles spacing, colors, and responsive behavior.

## Summary

In this chapter, we've learned how to:

- Register a custom `dashboard` component with `<Admin>`.
- Use `useGetList` to fetch data without a standard List view.
- Transform raw records for use in Cloudscape chart components.

## Next Steps

In the next chapter, we will make StratoShop accessible to a global audience by adding **Internationalization (i18n)**.
