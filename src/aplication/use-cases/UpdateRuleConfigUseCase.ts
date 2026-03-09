import { ConfigRuleRepositoryPort } from "../ports/ConfigRuleRepositoryPort";
import { Result } from "../../shared/Result";
import { AppRuleConfig } from "../../domain/entities/AppRuleConfig";

export class UpdateRuleConfigUseCase {
  constructor(private readonly repository: ConfigRuleRepositoryPort) {}

  async execute(config: AppRuleConfig): Promise<Result<void>> {
    return await this.repository.updateConfig(config);
  }
}