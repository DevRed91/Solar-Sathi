'use client';
import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_STYLE_DATA, STATE_DATA, STATE_NAME_DATA } from '@/data/constants';
import { useGetGeoJSONData } from '@/services/map-service';
import { LayerData } from '@/types';

const {
  focusWeight,
  focusColor,
  focusFillColor,
  focusFillOpacity,
  fillColor,
  weight,
  opacity,
  color,
  fillOpacity,
} = MAP_STYLE_DATA;

const LandingPageMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map>(null);

  const getIndiaGeoJSONDataQuery = useGetGeoJSONData({
    enabled: false,
    fileName: 'india',
  });

  let map: L.Map;

  function focusLayer(layer: L.GeoJSON) {
    layer.setStyle({
      weight: focusWeight,
      color: focusColor,
      fillColor: focusFillColor,
      fillOpacity: focusFillOpacity,
    });
    layer.bringToFront();
  }

  function createIndiaMarkers(latLng: [number, number]) {
    const markerIcon = L.divIcon({
      className: 'text-center',
      html: `
      <span class="relative flex size-10 items-center justify-center pointer-events-none">
        <span class="absolute inline-flex h-full w-full animate-[ping_2s_infinite] bg-secondary-500 rounded-full blur-[1px] opacity-30"></span>
        <span class="relative inline-flex size-4 bg-secondary-500 rounded-full opacity-80"></span>
      </span>`,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marker: any = L.marker(latLng, { icon: markerIcon });
    return marker;
  }

  const loadGeoJSONData = async (map: L.Map) => {
    const { data } = await getIndiaGeoJSONDataQuery.refetch();

    const styleFeature = () => ({
      fillColor: fillColor,
      weight: weight,
      opacity: opacity,
      color: color,
      fillOpacity: fillOpacity,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onEachFeature = (feature: any) => {
      const stateName = feature.properties.ST_NM;

      if (STATE_NAME_DATA.includes(stateName)) {
        const latLng = STATE_DATA[stateName].latLng;

        if (map) {
          const marker = createIndiaMarkers(latLng);
          marker.addTo(map);
        }
      }
    };

    const indiaGeoJsonLayer = L.geoJSON(data, {
      style: styleFeature,
      onEachFeature: onEachFeature,
    }).addTo(map);

    indiaGeoJsonLayer.getLayers().forEach((layer) => {
      if (
        layer instanceof L.GeoJSON &&
        (layer as LayerData).feature?.properties?.ST_NM &&
        STATE_NAME_DATA.includes(
          (layer as LayerData).feature.properties
            .ST_NM as (typeof STATE_NAME_DATA)[number]
        )
      ) {
        focusLayer(layer);
      }
    });

    // map.setMaxBounds(indiaGeoJsonLayer.getBounds().pad(0.1));
    map.fitBounds(indiaGeoJsonLayer.getBounds(), {
      padding: [150, 150],
      animate: false,
    });
    map.setZoom(5.3);
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapRef.current) return;

        // eslint-disable-next-line react-hooks/exhaustive-deps
        map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          dragging: false,
          preferCanvas: true,
          maxBoundsViscosity: 1.0,
          zoomSnap: 0.1,
        }).setView([20.5937, 78.9629], 5);

        mapInstanceRef.current = map;

        setTimeout(() => {
          if (map) {
            map.invalidateSize(true);
          }
        }, 100);

        await loadGeoJSONData(map);
      } catch (err) {
        console.error('Error initializing map: ', err);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="pointer-events-none h-screen overflow-hidden">
      <div ref={mapRef} className="!h-full !w-full"></div>
    </div>
  );
};

export default LandingPageMap;
