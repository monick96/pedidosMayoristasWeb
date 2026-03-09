import { Result } from "../../shared/Result";
import { AppRuleConfig } from "../../domain/entities/AppRuleConfig";

export interface ConfigRuleRepositoryPort {
  getConfig(): Promise<Result<AppRuleConfig>>;
  updateConfig(config: AppRuleConfig): Promise<Result<void>>;
}