import { UserProfile } from '@/types/domain/user';

/**
 * Service de Autenticação e Sessão (Estrutura Preparada)
 */
export class AuthService {
  public async getCurrentUser(): Promise<UserProfile | null> {
    // Abstração futura para autenticação
    return null;
  }

  public async login(): Promise<void> {
    throw new Error('Método login não implementado.');
  }

  public async logout(): Promise<void> {
    throw new Error('Método logout não implementado.');
  }
}

export const authService = new AuthService();
