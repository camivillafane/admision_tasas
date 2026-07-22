import { ConceptosService } from './conceptos.service';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';
export declare class ConceptosController {
    private readonly conceptosService;
    constructor(conceptosService: ConceptosService);
    create(dto: CreateConceptoDto): Promise<import("./entities/concepto.entity").Concepto>;
    findAll(): Promise<import("./entities/concepto.entity").Concepto[]>;
    findOne(id: string): Promise<import("./entities/concepto.entity").Concepto>;
    update(id: string, dto: UpdateConceptoDto): Promise<import("./entities/concepto.entity").Concepto>;
    remove(id: string): Promise<import("./entities/concepto.entity").Concepto>;
}
