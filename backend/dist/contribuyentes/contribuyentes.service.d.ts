import { Repository } from 'typeorm';
import { Contribuyente } from './entities/contribuyente.entity';
import { CreateContribuyenteDto } from './dto/create-contribuyente.dto';
import { UpdateContribuyenteDto } from './dto/update-contribuyente.dto';
export declare class ContribuyentesService {
    private readonly contribuyenteRepository;
    constructor(contribuyenteRepository: Repository<Contribuyente>);
    create(dto: CreateContribuyenteDto): Promise<Contribuyente>;
    findAll(query?: string): Promise<Contribuyente[]>;
    findOne(id: number): Promise<Contribuyente>;
    update(id: number, dto: UpdateContribuyenteDto): Promise<Contribuyente>;
    remove(id: number): Promise<Contribuyente>;
}
