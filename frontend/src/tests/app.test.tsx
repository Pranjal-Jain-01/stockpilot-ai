import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AppRoutes } from '../app/router';

function renderRoute(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('Phase 1 workspace', () => {
  it('shows loading, then dashboard counts from the fixture', async () => {
    renderRoute();
    expect(screen.getByRole('heading', { name: 'Loading your workspace' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Inventory health' })).toBeInTheDocument();
    expect(screen.getByText('8 stock records in the sample dataset')).toBeInTheDocument();
    expect(screen.getByText('2 high-priority risks need your attention')).toBeInTheDocument();
  });

  it.each([
    ['/inventory', 'Inventory'],
    ['/risks', 'Risk Center'],
    ['/recommendations', 'Recommendations'],
    ['/history', 'Decision History'],
  ])('renders the %s route with the shared navigation', async (path, title) => {
    renderRoute(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(navigation).getByRole('link', { name: title })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      await screen.findByText('Synthetic data. Procurement and transfers are simulated.'),
    ).toBeInTheDocument();
  });

  it('combines case-insensitive inventory search, store, and status filters and resets empty results', async () => {
    const user = userEvent.setup();
    renderRoute('/inventory');
    await screen.findByRole('table');
    await user.type(screen.getByLabelText('Search inventory'), 'SP-1001');
    await user.selectOptions(screen.getByLabelText('Location'), 'mumbai');
    await user.selectOptions(screen.getByLabelText('Risk status'), 'critical');
    expect(screen.getByText('1 of 8 records')).toBeInTheDocument();
    expect(screen.getByText('Everyday cotton tee')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Location'), 'pune');
    expect(screen.getByRole('heading', { name: 'No matching inventory' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('8 of 8 records')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search inventory'), 'CANVAS');
    expect(screen.getByText('Classic canvas sneakers')).toBeInTheDocument();
    expect(screen.getByText('1 of 8 records')).toBeInTheDocument();
  });

  it('preserves missing coverage rather than displaying zero', async () => {
    renderRoute('/inventory');
    const row = (await screen.findByText('Weekend duffel bag')).closest('tr')!;
    expect(within(row).getAllByText('Unavailable')).toHaveLength(2);
    expect(within(row).getByText('Unknown')).toBeInTheDocument();
  });

  it('opens a linked risk and displays missing supplier evidence', async () => {
    const user = userEvent.setup();
    renderRoute('/risks?risk=risk-3');
    expect(await screen.findByText('PO-DEMO-104')).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Risk type'), 'Stockout');
    await user.selectOptions(screen.getByLabelText('Priority'), 'low');
    expect(screen.getByRole('heading', { name: 'No matching risks' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('5 of 5 alerts')).toBeInTheDocument();
  });

  it('keeps recommendation decisions read-only and explains infeasibility', async () => {
    renderRoute('/recommendations');
    expect(await screen.findByText('No feasible option in this fixture')).toBeInTheDocument();
    expect(
      screen.getByText('No surplus remains after protecting donor stock.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /approve|reject/i })).not.toBeInTheDocument();
    expect(screen.getByText(/read-only/)).toBeInTheDocument();
  });

  it('shows seeded history with explicit simulation and IST labels', async () => {
    renderRoute('/history');
    expect(await screen.findByText('DEC-DEMO-002')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Decided at (IST)' })).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText(/does not save new decisions/)).toBeInTheDocument();
  });

  it.each(['/', '/inventory', '/risks', '/recommendations', '/history'])(
    'supports an empty dataset on %s',
    async (path) => {
      renderRoute(`${path}?state=empty`);
      expect(
        await screen.findByRole('heading', { name: 'No sample data to display' }),
      ).toBeInTheDocument();
    },
  );

  it('allows a failed mock load to recover through retry', async () => {
    const user = userEvent.setup();
    renderRoute('/?state=error');
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load the sample data');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Inventory health' })).toBeInTheDocument();
  });

  it('lets the preview selector exercise loading and restore the ready state', async () => {
    const user = userEvent.setup();
    renderRoute('/inventory?state=loading');
    expect(screen.getByRole('heading', { name: 'Loading your workspace' })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Preview state'), 'ready');
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('opens mobile navigation and navigates between pages', async () => {
    const user = userEvent.setup();
    renderRoute();
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    await user.click(
      within(screen.getByRole('navigation')).getByRole('link', { name: 'Inventory' }),
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Inventory' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('handles unknown routes without losing navigation', () => {
    renderRoute('/not-a-page');
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Dashboard' })).toHaveAttribute('href', '/');
  });
});
