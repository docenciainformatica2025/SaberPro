import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuizEngine from '../components/simulation/QuizEngine';
import { Question } from '../types/question';

// Mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

const mockUser = {
    uid: 'test-user-123',
    displayName: 'Test User',
};

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        subscription: { plan: 'free' },
    }),
}));

vi.mock('@/lib/firebase', () => ({
    db: {},
}));

// Mock Firebase functions
const mockAddDoc = vi.fn();
// Mock other firestore methods as needed, or just mock the module generically
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: (...args: any[]) => mockAddDoc(...args),
    serverTimestamp: () => 'timestamp',
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn().mockResolvedValue({ empty: true }), // Mock no class found
    updateDoc: vi.fn(),
    arrayUnion: vi.fn(),
}));

const mockQuestions: Question[] = [
    {
        id: 'q1',
        module: 'competencias_ciudadanas',
        text: 'Question 1 Text',
        options: [
            { id: 'opt1', text: 'Option A' },
            { id: 'opt2', text: 'Option B' },
        ],
        correctAnswer: 'opt1',
        explanation: 'Exp 1',
        difficulty: 'baja',
    },
    {
        id: 'q2',
        module: 'competencias_ciudadanas',
        text: 'Question 2 Text',
        options: [
            { id: 'opt1', text: 'Option C' },
            { id: 'opt2', text: 'Option D' },
        ],
        correctAnswer: 'opt2',
        explanation: 'Exp 2',
        difficulty: 'media',
    },
];

describe('QuizEngine Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the first question correctly', () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        expect(screen.getByText('Question 1 Text')).toBeInTheDocument();
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('1 / 2')).toBeInTheDocument(); // Header progress
    });

    it('allows selecting an option and navigating to next question', () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        // Select option 1 for Question 1
        const optionA = screen.getByText('Option A');
        fireEvent.click(optionA);

        // Verify selection visual feedback (this depends on implementation details, usually checking class/style)
        // Here we can assume state updated.

        // Click Next
        const nextBtn = screen.getByText('Siguiente Pregunta');
        fireEvent.click(nextBtn);

        // Should see Question 2
        expect(screen.getByText('Question 2 Text')).toBeInTheDocument();
    });

    it('shows review screen after last question', () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        // Answer Q1
        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Siguiente Pregunta'));

        // Answer Q2 (Last)
        fireEvent.click(screen.getByText('Option D'));

        // Button should say "Finalizar Examen"
        const finishBtn = screen.getByText('Finalizar Examen');
        expect(finishBtn).toBeInTheDocument();
        fireEvent.click(finishBtn);

        // Should see Review Screen
        expect(screen.getByText('Resumen del Módulo')).toBeInTheDocument();
    });

    it('submits results correctly', async () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        // Fast forward to end
        // Q1 -> Correct
        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Siguiente Pregunta'));

        // Q2 -> Correct
        fireEvent.click(screen.getByText('Option D'));
        fireEvent.click(screen.getByText('Finalizar Examen'));

        // Review Screen -> Confirm
        const confirmBtn = screen.getByText('CONFIRMAR Y FINALIZAR');
        fireEvent.click(confirmBtn);

        // Wait for submission
        await waitFor(() => {
            expect(mockAddDoc).toHaveBeenCalled();
        });

        // Check if score was calculated correctly (2/2)
        const callArgs = mockAddDoc.mock.calls[0];
        const savedData = callArgs[1]; // Second arg is the data object
        expect(savedData.score).toBe(2);
        expect(savedData.module).toBe('test_module');
    });
});
