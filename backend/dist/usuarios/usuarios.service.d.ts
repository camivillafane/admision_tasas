import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
export declare class UsuariosService {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    findByUsername(username: string): Promise<Usuario | null>;
}
