import { GlobalSummaryCategorySource } from "./category-source/global-summary-category-source";
import { GlobalSummaryCategoryTemporalYear } from "./temporal/global-summary-category-temporal-year";

export interface GlobalSummaryCategory {
    category: string; // Consumption category.
    carbonEmissions: number; // Total carbon emission in period.
    energyExpended: number; // Total energy used in period.
    consumptionsCount: number; // Number of consumptions
    activeUsers?: number; // Number of users included in period.
    categorySource: GlobalSummaryCategorySource[];
    temporal: GlobalSummaryCategoryTemporalYear[];
}
