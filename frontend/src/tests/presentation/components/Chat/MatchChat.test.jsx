import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchChat from '../../../../presentation/components/Chat/MatchChat';
import { useAuth } from '../../../../presentation/context/AuthContext';
import { supabase } from '../../../../supabaseClient';

// Mock de useAuth
jest.mock('../../../../presentation/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock de supabase
jest.mock('../../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [{ id: '1', content: 'Hola', sender_id: 'user1', sender: { username: 'TestUser' }, created_at: '2023-01-01T12:00:00Z' }],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        error: null,
      })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
      })),
    })),
    removeChannel: jest.fn(),
  },
}));

describe('MatchChat', () => {
  const mockUser = { id: 'user1', username: 'TestUser' };
  const mockMatchId = 'match123';

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    // Resetear mocks de supabase antes de cada prueba
    supabase.from.mockClear();
    supabase.channel.mockClear();
    supabase.removeChannel.mockClear();
  });

  // 1. Prueba de uso esperado
  test('debería renderizar el chat y mostrar mensajes iniciales', async () => {
    render(<MatchChat matchId={mockMatchId} />);

    expect(screen.getByText('Chat del partido')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Hola')).toBeInTheDocument();
      expect(screen.getByText('TestUser')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
  });

  // 2. Caso periférico: Enviar un mensaje vacío
  test('no debería enviar un mensaje si el contenido está vacío', async () => {
    render(<MatchChat matchId={mockMatchId} />);

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: '   ' } }); // Espacios en blanco
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(supabase.from).not.toHaveBeenCalledWith('messages');
    });
  });

  // 3. Caso de fallo: Error al enviar mensaje
  test('debería manejar errores al enviar un mensaje', async () => {
    supabase.from.mockReturnValueOnce({
      insert: jest.fn(() => ({
        error: new Error('Error al insertar mensaje'),
      })),
    });

    render(<MatchChat matchId={mockMatchId} />);

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'Mensaje de prueba' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(supabase.from().insert).toHaveBeenCalledWith({
        content: 'Mensaje de prueba',
        match_id: mockMatchId,
        sender_id: mockUser.id,
      });
      // Aquí podrías añadir una aserción para verificar si se muestra un mensaje de error al usuario,
      // pero el componente actual no lo hace. Solo verifica que el error se maneja internamente.
    });
  });
});
