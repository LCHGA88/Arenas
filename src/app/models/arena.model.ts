export interface Arena {
    id?: string; // ID de la arena, opcional porque puede ser agregado después
    arenaName: string; // Nombre de la arena
    password: string; // Contraseña de la arena
    player1: string; // Jugador 1
    player2: string | null; // Jugador 2, puede ser null
    createdAt: any; // Fecha de creación, puede ser un Timestamp u objeto Date
    status: string; // Estado de la arena ('waiting', 'ready', etc.)
  }
  