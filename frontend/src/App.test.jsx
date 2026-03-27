import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders grouped catalog sections and product descriptions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 100,
            name: 'Test Sink',
            shortDescription: 'Short sink description',
            detailedDescription: 'Detailed sink explanation for users.',
            designStyle: 'Modern',
            material: 'Steel',
            price: 300,
            imageUrl: 'https://example.com/sink.jpg',
            category: 'SINK'
          }
        ]
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sinks' })).toBeInTheDocument();
    });

    expect(screen.getByText('Test Sink')).toBeInTheDocument();
    expect(screen.getByText('Detailed sink explanation for users.')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
  });

  it('opens and closes product detail dialog from a catalog card', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 101,
            name: 'Detail Sink',
            shortDescription: 'Short detail description',
            detailedDescription: 'Long-form product detail description.',
            designStyle: 'Minimalist',
            material: 'Fireclay',
            price: 450,
            imageUrl: 'https://example.com/detail-sink.jpg',
            category: 'SINK'
          }
        ]
      })
    );

    render(<App />);

    const detailsButton = await screen.findByRole('button', { name: 'View details' });
    fireEvent.click(detailsButton);

    const dialog = screen.getByRole('dialog', { name: 'Detail Sink details' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Long-form product detail description.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    expect(screen.queryByRole('dialog', { name: 'Detail Sink details' })).not.toBeInTheDocument();
  });
});
