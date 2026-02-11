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
        profile: { gamification: { badges: [] } },
        subscription: { plan: 'free' },
        registerActivity: vi.fn(),
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
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText(/\/ 2/)).toBeInTheDocument();
    });

    it('allows selecting an option and navigating to next question', async () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        const optionA = screen.getByText('Option A');
        fireEvent.click(optionA);

        const nextBtn = screen.getByText('Siguiente Pregunta');
        fireEvent.click(nextBtn);

        expect(await screen.findByText('Question 2 Text')).toBeInTheDocument();
    });

    it('shows review screen after last question', async () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        fireEvent.click(screen.getByText('Siguiente Pregunta'));

        fireEvent.click(await screen.findByText('Option D'));

        const finishBtn = await screen.findByText('Finalizar Examen');
        expect(finishBtn).toBeInTheDocument();
        fireEvent.click(finishBtn);

        expect(screen.getByText('Resumen del Módulo')).toBeInTheDocument();
    });

    it('submits results correctly', async () => {
        render(<QuizEngine questions={mockQuestions} moduleName="test_module" />);

        // Q1
        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Siguiente Pregunta'));

        // Q2
        fireEvent.click(await screen.findByText('Option D'));
        fireEvent.click(await screen.findByText('Finalizar Examen'));

        // Review Screen
        const confirmBtn = await screen.findByText('CONFIRMAR Y FINALIZAR');

        vi.useFakeTimers();
        fireEvent.click(confirmBtn);

        // Advance timers for the 2s success animation + microtasks
        await vi.advanceTimersByTimeAsync(2500);

        expect(mockAddDoc).toHaveBeenCalled();

        const callArgs = mockAddDoc.mock.calls[0];
        const savedData = callArgs[1];
        expect(savedData.score).toBe(2);
        vi.useRealTimers();
    });
});
