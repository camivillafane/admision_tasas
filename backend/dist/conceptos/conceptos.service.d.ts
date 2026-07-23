import { Repository } from 'typeorm';
import { Concepto } from './entities/concepto.entity';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';
export declare class ConceptosService {
    private readonly conceptoRepository;
    constructor(conceptoRepository: Repository<Concepto>);
    create(dto: CreateConceptoDto): Promise<Concepto>;
    findAll(): Promise<Concepto[]>;
    findOne(id: number): Promise<Concepto>;
    update(id: number, dto: UpdateConceptoDto): Promise<Concepto>;
    remove(id: number): Promise<Concepto>;
}
