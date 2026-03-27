import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

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
});
