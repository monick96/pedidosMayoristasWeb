import { ConfigRuleRepositoryPort } from "../ports/ConfigRuleRepositoryPort";
import { Result } from "../../shared/Result";
import { AppRuleConfig } from "../../domain/entities/AppRuleConfig";

export class GetConfigRuleUseCase {
  constructor(private readonly repository: ConfigRuleRepositoryPort) {}

  async execute(): Promise<Result<AppRuleConfig>> {
    return await this.repository.getConfig();
  }
}