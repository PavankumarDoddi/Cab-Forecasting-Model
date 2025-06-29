
from geopy.distance import geodesic

NODAL_POINTS = {
    "Guindy": (13.0074, 80.2206),
    "Velachery": (12.9791, 80.2214),
    "Adyar": (13.0067, 80.2559),
    "T Nagar": (13.0418, 80.2332),
    "Kodambakkam": (13.0507, 80.2289),
    "Anna Nagar": (13.0878, 80.2063),
    "Tambaram": (12.9246, 80.1271),
    "Saidapet": (13.0212, 80.2231),
    "Nungambakkam": (13.0604, 80.2418),
    "Mylapore": (13.0336, 80.2697),
    "Ashok Nagar": (13.0336, 80.2139),
    "K K Nagar": (13.0361, 80.2035),
    "Perambur": (13.1183, 80.2332),
    "Vadapalani": (13.0504, 80.2134),
    "Porur": (13.0313, 80.1588),
    "Chromepet": (12.9507, 80.1405),
    "Pallavaram": (12.9674, 80.1492),
    "Thiruvanmiyur": (12.9864, 80.2602),
    "Medavakkam": (12.9243, 80.1793),
    "Thoraipakkam": (12.9483, 80.2364)
}

def assign_nearest_nodal_point(lat: float, lon: float) -> str:
    min_dist = float("inf")
    nearest = None
    for point, coords in NODAL_POINTS.items():
        dist = geodesic((lat, lon), coords).km
        if dist < min_dist:
            min_dist = dist
            nearest = point
    return nearest
