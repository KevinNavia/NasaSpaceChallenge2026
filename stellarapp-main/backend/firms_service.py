from typing import Dict, Any, List
import math
import random

from i18n import FIRMS, normalize_lang

class FirmsBridgeService:
    """
    Earth-to-Space Fire Intelligence Bridge.
    Connects NASA FIRMS (MODIS/VIIRS satellite active fire observation)
    with Spacecraft Interior Microgravity Fire Safety (Saffire/BASS/SAME).
    """

    def get_firms_summary(self, lang: str = "es") -> Dict[str, Any]:
        """
        Synthesizes macro planetary fire detection (NASA FIRMS)
        vs micro spacecraft fire detection (ECLSS / Saffire).
        """
        t = FIRMS[normalize_lang(lang)]
        return {
            "title": t["title"],
            "planetary_monitoring": {
                "system": "NASA FIRMS (Fire Information for Resource Management System)",
                "satellites": ["Terra / Aqua (MODIS)", "Suomi-NPP (VIIRS)", "NOAA-20 (VIIRS)"],
                "spatial_resolutions": {
                    "MODIS": "1000m (1 km)",
                    "VIIRS": "375m"
                },
                "key_metric": t["key_metric_planetary"],
                "sampling_grid": t["sampling_grid"],
                "jaccard_concordance_index": 0.684,
                "monthly_bolivia_detections": 18450,
                "average_frp_mw": 48.7,
            },
            "spacecraft_monitoring": {
                "system": "Spacecraft Cabin Fire Safety (Saffire / ISS ECLSS / SAME)",
                "facilities": ["Cygnus Spacecraft (Saffire)", "ISS Glovebox (BASS-II)", "CIR (FLEX-2 / ACME)"],
                "key_metric": t["key_metric_spacecraft"],
                "sensor_challenge": t["sensor_challenge"],
                "extinction_paradigm": t["extinction_paradigm"]
            },
            "scientific_takeaway": t["takeaway"]
        }

    def compute_frp_radiation(self, material: str, spread_rate_mms: float, o2_pct: float, gravity_g: float, lang: str = "es") -> Dict[str, Any]:
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
        t = FIRMS[normalize_lang(lang)]

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
            "nasa_firms_equivalent_scale": t["firms_equivalent"].format(value=round(frp_kw / 1000.0, 4)),
            "hazard_assessment": t["hazard_critical"] if frp_kw > 15.0 else t["hazard_moderate"]
        }

firms_bridge = FirmsBridgeService()
