import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login title', () => {
  render(<App />);
  const loginTitle = screen.getByText(/Login/i);
  expect(loginTitle).toBeInTheDocument();
});
