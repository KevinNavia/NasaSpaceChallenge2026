export interface Experiment {
  id: string;
  mission: string;
  facility: string;
  material: string;
  material_type: string;
  gravity_g: number;
  environment: string;
  oxygen_concentration_pct: number;
  pressure_kpa: number;
  air_flow_velocity_cms: number;
  flame_spread_rate_mms: number;
  flame_shape: string;
  flame_temperature_k: number;
  soot_production: string;
  cool_flame_observed: boolean;
  limiting_oxygen_index_pct: number;
  extinction_limit_flow_cms: number;
  quenching_distance_mm: number;
  safety_risk_level: "Low" | "Moderate" | "Critical" | "Extreme";
  spacecraft_implication: string;
  recommended_suppression: string;
  nasa_reference: string;
}

export interface MetricsData {
  total_experiments: number;
  unique_materials_count: number;
  materials: string[];
  cool_flame_detections: number;
  max_flame_spread_rate_mms: number;
  critical_risk_count: number;
  missions_covered: string[];
}

export interface SimulationResult {
  input_parameters: {
    material: string;
    gravity_g: number;
    oxygen_concentration_pct: number;
    pressure_kpa: number;
    air_flow_velocity_cms: number;
  };
  predicted_risk_level: "Low" | "Moderate" | "Critical" | "Extreme";
  risk_score: number;
  estimated_flame_spread_mms: number;
  cool_flame_risk: boolean;
  extinction_strategy: string;
  compliance_note: string;
  material_loi?: number;
  toxic_hazard?: string;
  loi_exceeded?: boolean;
  psi_calibrated?: boolean;
  psi_sensor_context?: string;
  frp_radiation_analysis?: any;
}

export interface PsiMaterial {
  id: string;
  nombre: string;
  loi: number;
  toxicidad: string;
  notas: string;
}

export interface ThermalToleranceBand {
  entity: string;
  max_temp_c: number;
  ref_threshold: string;
  category: "Humano" | "Nave" | "Fuego";
  color: string;
}

export interface ThermalExcursionPoint {
  time_s: number;
  cabin_air_c: number;
  skin_absorbed_c: number;
  hull_temp_c: number;
  limit_human: number;
  limit_hull: number;
}

export interface ThermalLimitsResponse {
  thermal_tolerance_bands: ThermalToleranceBand[];
  thermal_excursion_timeline: ThermalExcursionPoint[];
  standards_referenced: string[];
  human_critical_temp_c: number;
  hull_yield_temp_c: number;
}

export interface PsiStudy {
  psi_id: string;
  title: string;
  description: string;
  submission_date?: string;
  public_release_date?: string;
  approach?: string;
  category: string;
  status: string;
  parameters?: PsiParameter[];
  documents_count?: number;
  documents?: any[];
  contacts?: any[];
}

export interface PsiParameter {
  id: number;
  psi_id: string;
  parameter_name: string;
  parameter_value: string;
  unit: string;
  condition?: string;
  source?: string;
  notes?: string;
}

export interface PsiOverview {
  metadata: {
    name: string;
    description: string;
    version: string;
    source: string;
  };
  total_studies: number;
  total_experimental_parameters: number;
  total_documents: number;
  total_contacts: number;
  total_publications: number;
  combustion_studies_count: number;
  combustion_studies: PsiStudy[];
}
