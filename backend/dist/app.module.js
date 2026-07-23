"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const usuario_entity_1 = require("./usuarios/entities/usuario.entity");
const contribuyente_entity_1 = require("./contribuyentes/entities/contribuyente.entity");
const concepto_entity_1 = require("./conceptos/entities/concepto.entity");
const liquidacion_entity_1 = require("./liquidaciones/entities/liquidacion.entity");
const liquidacion_detalle_entity_1 = require("./liquidaciones/entities/liquidacion-detalle.entity");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const contribuyentes_module_1 = require("./contribuyentes/contribuyentes.module");
const conceptos_module_1 = require("./conceptos/conceptos.module");
const liquidaciones_module_1 = require("./liquidaciones/liquidaciones.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mssql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '1433', 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [usuario_entity_1.Usuario, contribuyente_entity_1.Contribuyente, concepto_entity_1.Concepto, liquidacion_entity_1.Liquidacion, liquidacion_detalle_entity_1.LiquidacionDetalle],
                synchronize: false,
                options: {
                    encrypt: false,
                    trustServerCertificate: true,
                },
            }),
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
            contribuyentes_module_1.ContribuyentesModule,
            conceptos_module_1.ConceptosModule,
            liquidaciones_module_1.LiquidacionesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map