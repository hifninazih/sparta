export const streetStyle =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export const satelliteStyle = {
  version: 8,
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 18,
      attribution:
        "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    // "terrain-source": {
    //   type: "raster-dem",
    //   tiles: [
    //     "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
    //   ],
    //   encoding: "terrarium",
    //   tileSize: 256,
    //   maxzoom: 15,
    // },
  },
  layers: [
    {
      id: "satellite-layer",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
  // terrain: {
  //   source: "terrain-source",
  //   exaggeration: 2,
  // },
};
