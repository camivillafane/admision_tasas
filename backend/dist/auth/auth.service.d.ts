import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usuarioRepository;
    private readonly jwtService;
    private readonly logger;
    constructor(usuarioRepository: Repository<Usuario>, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: number;
            username: string;
            nombre: string;
        };
    }>;
}
