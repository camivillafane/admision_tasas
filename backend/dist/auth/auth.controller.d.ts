import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        usuario: {
            id: number;
            username: string;
            nombre: string;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        usuario: {
            id: number;
            username: string;
            nombre: string;
        };
    }>;
}
