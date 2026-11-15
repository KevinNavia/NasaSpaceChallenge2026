from typing import Dict, Any, List
import math
import random

class FirmsBridgeService:
    """
    Earth-to-Space Fire Intelligence Bridge.
    Connects NASA FIRMS (MODIS/VIIRS satellite active fire observation)
    with Spacecraft Interior Microgravity Fire Safety (Saffire/BASS/SAME).
    """

    def get_firms_summary(self) -> Dict[str, Any]:
        """
        Synthesizes macro planetary fire detection (NASA FIRMS)
        vs micro spacecraft fire detection (ECLSS / Saffire).
        """
        return {
            "title": "NASA Fire Intelligence: Earth-to-Space Bridge",
            "planetary_monitoring": {
                "system": "NASA FIRMS (Fire Information for Resource Management System)",
                "satellites": ["Terra / Aqua (MODIS)", "Suomi-NPP (VIIRS)", "NOAA-20 (VIIRS)"],
                "spatial_resolutions": {
                    "MODIS": "1000m (1 km)",
                    "VIIRS": "375m"
                },
                "key_metric": "Fire Radiative Power (FRP en MegaWatts)",
                "sampling_grid": "Equal-Area EPSG:6933 (10 km & 20 km celdas)",
                "jaccard_concordance_index": 0.684,
                "monthly_bolivia_detections": 18450,
                "average_frp_mw": 48.7,
            },
            "spacecraft_monitoring": {
                "system": "Spacecraft Cabin Fire Safety (Saffire / ISS ECLSS / SAME)",
                "facilities": ["Cygnus Spacecraft (Saffire)", "ISS Glovebox (BASS-II)", "CIR (FLEX-2 / ACME)"],
                "key_metric": "Tasa de propagación (mm/s) & Potencia Radiativa Esférica (kW/m²)",
                "sensor_challenge": "Aglomeración de hollín (estudio SAME) y fuegos fríos invisibles (ACME)",
                "extinction_paradigm": "Corte de ventilación forzada (< 1.2 cm/s) + Dilución inerte N2/CO2"
            },
            "scientific_takeaway": (
                "Mientras que en la Tierra el penacho térmico convectivo asciende y es detectado por satélites "
                "por su emisión de radiación infrarroja (FRP), en el espacio la ausencia de flotabilidad atrapa los "
                "productos de combustión en una capa límite difusiva, requiriendo espectroscopía de absorción láser "
                "y filtros de Kalman en lugar de sensores ópticos estándar."
            )
        }

    def compute_frp_radiation(self, material: str, spread_rate_mms: float, o2_pct: float, gravity_g: float) -> Dict[str, Any]:
        """
        Calculates equivalent thermal radiation and Fire Radiative Power (FRP)
        for a localized fire incident in a spacecraft habitat.
        """
        # Specific heat of combustion base approximations (MJ/kg)
        heat_values = {
            "PMMA": 25.0,
            "Nomex": 32.0,
            "Cotton": 17.5,
            "ETFE": 14.0,
            "Heptane": 44.6
        }
        dh_c = heat_values.get(material, 20.0)

        # In microgravity, radiative fraction is significantly higher because convective dissipation is near zero
        rad_fraction = 0.42 if gravity_g < 0.01 else 0.25

        # Estimated instantaneous Fire Radiative Power (kW) inside pressurized volume
        frp_kw = round((spread_rate_mms * 1.5) * (o2_pct / 21.0) * (dh_c / 10.0) * (1.0 + (0.3 if gravity_g < 0.01 else 0.0)), 2)

        return {
            "material": material,
            "estimated_frp_kw": frp_kw,
            "radiative_fraction_pct": round(rad_fraction * 100, 1),
            "heat_of_combustion_mj_kg": dh_c,
            "thermal_flux_kw_m2": round(frp_kw / 2.5, 2),
            "nasa_firms_equivalent_scale": f"{round(frp_kw / 1000.0, 4)} MW (Equivalente FIRMS)",
            "hazard_assessment": "Crítico: Elevada emisión radiativa superficial sin penacho de escape" if frp_kw > 15.0 else "Moderado / Manejable por ECLSS"
        }

firms_bridge = FirmsBridgeService()
