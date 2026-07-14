import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { getCorsOrigins } from "./config/env";

export const corsOption: CorsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
};
