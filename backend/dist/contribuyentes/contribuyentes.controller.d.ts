import { ContribuyentesService } from './contribuyentes.service';
import { CreateContribuyenteDto } from './dto/create-contribuyente.dto';
import { UpdateContribuyenteDto } from './dto/update-contribuyente.dto';
export declare class ContribuyentesController {
    private readonly contribuyentesService;
    constructor(contribuyentesService: ContribuyentesService);
    create(dto: CreateContribuyenteDto): Promise<import("./entities/contribuyente.entity").Contribuyente>;
    findAll(q?: string): Promise<import("./entities/contribuyente.entity").Contribuyente[]>;
    findOne(id: string): Promise<import("./entities/contribuyente.entity").Contribuyente>;
    update(id: string, dto: UpdateContribuyenteDto): Promise<import("./entities/contribuyente.entity").Contribuyente>;
    remove(id: string): Promise<import("./entities/contribuyente.entity").Contribuyente>;
}
