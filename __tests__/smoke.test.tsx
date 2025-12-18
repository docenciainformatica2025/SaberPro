import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Smoke Test', () => {
    it('should be able to run tests', () => {
        expect(1 + 1).toBe(2);
    });

    it('should be able to render a simple React component', () => {
        const TestComponent = () => <div>Hello Vitamin Test</div>;
        render(<TestComponent />);
        expect(screen.getByText('Hello Vitamin Test')).toBeInTheDocument();
    });
});
