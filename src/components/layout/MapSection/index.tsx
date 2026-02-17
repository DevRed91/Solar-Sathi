'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_STYLE_DATA, STATE_DATA } from '@/data/constants';
import {
  formatNumWithUnits,
  getCityLatlng,
  getCoordinatesByPincode,
} from '@/lib/utils';
import { useGetGeoJSONData, useGetPincodeData } from '@/services/map-service';
import { useMapStateAndCityState, useSolarState } from '@/lib/store';
import {
  apiCityDataType,
  mapFeatureType,
  mapLayerType,
  PincodeDataType,
} from '@/types';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetExpCenter } from '@/services/exp-center-service';

// TODO: define types wherever used `any` as a type in this component

export interface CurrentLocationType {
  state: string | null;
  city: string | null;
  pincode: string | null;
}

const indiaMapMarkerData: Record<string, number> = {};

interface MapRefs {
  map: L.Map | null;
  indiaGeoJsonLayer: L.GeoJSON | null;
  stateGeoJsonLayer: L.GeoJSON | null;
  indiaMarkers: L.LayerGroup | null;
  stateMarkers: L.LayerGroup | null;
  cityMarkers: L.LayerGroup | null;
  roadwayLayer: L.LayerGroup | null;
  currentStateLayer: L.GeoJSON | null;
  stateLayers: L.Layer[];
}

const MapSection = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapRefsRef = useRef<MapRefs>({
    map: null,
    indiaGeoJsonLayer: null,
    stateGeoJsonLayer: null,
    indiaMarkers: null,
    stateMarkers: null,
    cityMarkers: null,
    roadwayLayer: null,
    currentStateLayer: null,
    stateLayers: [],
  });
  const keyboardListenerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const getExpCenterQuery = useGetExpCenter();
  const [currentLocationData, setCurrentLocationData] =
    useState<CurrentLocationType>({
      state: null,
      city: null,
      pincode: null,
    });
  const [currentStateName, setCurrentStateName] = useState<string | null>(null);
  const currStateName = useRef<string | null>(null);

  // Queries
  const getStateGeoJSONDataQuery = useGetGeoJSONData({
    enabled: false,
    fileName: currentLocationData.state,
  });
  const getIndiaGeoJSONDataQuery = useGetGeoJSONData({
    enabled: false,
    fileName: 'india',
  });

  const getRoadwaysGeoJSONDataQuery = useGetGeoJSONData({
    enabled: false,
    fileName: 'combined_railways_highways',
  });
  const getPincodeDataQuery = useGetPincodeData({ enabled: false });
  // Store actions
  const { setPincodeData } = useSolarState();
  const { backTos, reset } = useMapStateAndCityState();
  const { setParams } = useQueryParams();

  // Memoized style configurations
  const mapStyles = useMemo(
    () => ({
      focusStyle: {
        weight: MAP_STYLE_DATA.focusWeight,
        color: MAP_STYLE_DATA.focusColor,
        // fillColor: MAP_STYLE_DATA.fillOpacity,
        fillOpacity: MAP_STYLE_DATA.focusFillOpacity,
      },
      defaultStyle: {
        fillColor: MAP_STYLE_DATA.fillColor,
        weight: MAP_STYLE_DATA.weight,
        opacity: MAP_STYLE_DATA.opacity,
        color: MAP_STYLE_DATA.color,
        // fillOpacity: MAP_STYLE_DATA.fillOpacity,
      },
    }),
    []
  );

  // Update URL params when state/city/pincode changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (currentLocationData.state) params.state = currentLocationData.state;
    if (currentLocationData.city) params.city = currentLocationData.city;
    if (currentLocationData.pincode)
      params.pincode = currentLocationData.pincode;
    if (Object.keys(params).length > 0) setParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocationData]);

  // Utility functions
  const focusLayer = useCallback(
    (layer: L.GeoJSON) => {
      layer.setStyle(mapStyles.focusStyle);
      layer.bringToFront();
    },
    [mapStyles.focusStyle]
  );

  const unfocusMap = useCallback((layers: L.Layer[]) => {
    const { indiaGeoJsonLayer } = mapRefsRef.current;
    if (!indiaGeoJsonLayer) return;

    layers.forEach((layer) => {
      indiaGeoJsonLayer.resetStyle(layer);
    });
  }, []);

  // Marker creation functions
  const createMarkerIcon = useCallback(
    (content: string, label: string, size: [number, number] = [60, 80]) => {
      return L.divIcon({
        className: 'text-center',
        html: `
        <div class="flex flex-col items-center relative">
          ${content}
          <div class="mb-2.5">
            <img class="marker" src="/icons/marker.svg" alt="Marker" />
          </div>
          <div class="relative -top-3.5 w-auto rounded-[20px] bg-white p-1 text-xs font-normal font-dm-sans text-black whitespace-nowrap">${label}</div>
          ${label === 'Uttar pradesh' ? `<img src="/gifs/finger-click.gif" class="absolute -top-10 left-[50px] h-[250px] w-[125px] -translate-x-1/2 scale-[40%] -rotate-10" />` : ''}
        </div>
      `,
        iconSize: size,
      });
    },
    []
  );

  const createIndiaMarkers = useCallback(
    (
      stateName: string,
      houseCount: number,
      latLng: [number, number],
      layer: L.GeoJSON,
      pincodeData: PincodeDataType[]
    ) => {
      const content = `<div class="relative top-3.5 text-lg font-dm-sans font-bold text-white">${houseCount.toLocaleString()}</div>`;
      const markerIcon = createMarkerIcon(content, stateName);
      const marker = L.marker(latLng, { icon: markerIcon }) as L.Marker & {
        name: string;
      };
      marker.name = stateName;

      marker.on('click', () => {
        const { map, indiaMarkers, roadwayLayer } = mapRefsRef.current;
        if (!map || !indiaMarkers || !roadwayLayer) return;
        map.setMaxZoom(14);
        map.fitBounds(layer.getBounds(), { padding: [150, 150] });
        setTimeout(() => {
          const maxZoomOut = map.getBoundsZoom(layer.getBounds()) - 1;
          map.setMinZoom(maxZoomOut);
        }, 1000);
        unfocusMap(mapRefsRef.current.stateLayers);
        focusLayer(layer);
        mapRefsRef.current.currentStateLayer = layer;
        setCurrentLocationData({ state: stateName, city: null, pincode: null });
        setCurrentStateName(stateName);
        currStateName.current = stateName;
        addStateMarkers(stateName, pincodeData);
        map.removeLayer(indiaMarkers);
        map.removeLayer(roadwayLayer);
      });

      return marker;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createMarkerIcon, focusLayer, unfocusMap]
  );

  const createStateMarkers = useCallback(
    (
      cityName: string,
      houseCount: number,
      latLng: [number, number],
      pincodeData: PincodeDataType[]
    ) => {
      const content = `<div class="relative top-3.5 text-lg font-bold text-white">${houseCount.toLocaleString()}</div>`;
      const markerIcon = createMarkerIcon(content, cityName);
      // const latLng = getCoordinatesByPincode(parseInt(pincode), pincodeData);

      if (!latLng) return null;

      const marker = L.marker(latLng, {
        icon: markerIcon,
      }) as L.Marker & {
        name: string;
      };
      marker.name = cityName;

      marker.on('click', () => {
        addCityMarkers(cityName, pincodeData);
      });

      return marker;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createMarkerIcon, unfocusMap]
  );

  const createCityMarkers = useCallback(
    (
      pincode: string,
      latLng: [number, number] | undefined,
      pincodeData: PincodeDataType[],
      cityData: apiCityDataType
    ) => {
      const markerIcon = createMarkerIcon('', pincode.toString());

      const { map } = mapRefsRef.current;

      if (!latLng) return;
      if (latLng.length < 2) {
        latLng = getCoordinatesByPincode(parseInt(pincode), pincodeData);
      }

      const newLatLng: L.LatLng = latLng
        ? L.latLng(latLng[0], latLng[1])
        : L.latLng(-1, -1);

      if (!latLng) {
        console.warn(`Cannot find coordinates for pincode: ${pincode}`);
        return null;
      }

      const marker = L.marker(newLatLng, { icon: markerIcon }) as L.Marker & {
        name: number;
      };
      marker.name = parseInt(pincode);

      marker.on('click', () => {
        const entry = cityData.data.find((item) => item.pincode === pincode);
        if (!entry) return;
        const count = entry.count;
        const moneySaved = formatNumWithUnits({
          num: entry.lifetimeSavings,
          isRupees: true,
        });
        marker
          .unbindPopup()
          .bindPopup(
            `<div class="flex flex-col gap-3">
              <div class="flex justify-between leading-[34px] -tracking-[0.96px] font-dm-sans text-2xl">
                <div class="text-background-50 font-bold">${pincode}</div>
                <div class="text-background-400">${cityData.city}</div>
              </div>
              <div class="w-full h-px bg-[#49549D]"></div>
              <div class="grid grid-cols-2 gap-3 items-center">
                <div class="text-secondary-500 font-poppins text-7xl font-bold leading-[101px] -tracking-[1.44px] text-center">${count}</div>
                <div class="text-background-400 font-dm-sans font-semibold leading-[34px] -tracking-[0.96px] text-2xl text-left">SolarSquare homes</div>
              </div>
              <div class="bg-green-600 rounded-xl py-1 flex gap-1 font-dm-sans items-center justify-center">
                <div class="text-green-success-500 text-2xl font-bold leading-[34px] -tracking-[0.96px]">${moneySaved[0].text}${moneySaved[1] ? moneySaved[1].text : ''}</div>
                <div class="text-neutral-400 text-xl font-medium leading-7 -tracking-[0.8px]">Savings generated</div>
              </div>
            </div>`
          )
          .openPopup();
        if (!map) return;
        const zoomVal = map.getZoom();
        const markerLatLng = marker.getLatLng();
        const flyToPos = L.latLng(markerLatLng.lat + 0.05, markerLatLng.lng);
        map?.flyTo(flyToPos, zoomVal > 12 ? zoomVal : 12, {
          animate: zoomVal < 12,
        });
      });

      return marker;
    },
    [createMarkerIcon]
  );

  // Navigation functions
  const backToState = useCallback(() => {
    const {
      map,
      stateGeoJsonLayer,
      cityMarkers,
      stateMarkers,
      currentStateLayer,
      indiaGeoJsonLayer,
      roadwayLayer,
    } = mapRefsRef.current;
    if (
      !map ||
      !stateGeoJsonLayer ||
      !cityMarkers ||
      !stateMarkers ||
      !roadwayLayer
    )
      return;

    map.setMinZoom(5.2);
    map.setMaxBounds(indiaGeoJsonLayer?.getBounds().pad(0.2));
    map.fitBounds(stateGeoJsonLayer.getBounds(), { padding: [150, 150] });
    map.removeLayer(stateGeoJsonLayer);
    map.removeLayer(cityMarkers);
    map.removeLayer(roadwayLayer);
    stateMarkers.addTo(map);
    cityMarkers.clearLayers();

    if (currentStateLayer) {
      focusLayer(currentStateLayer);
    }
  }, [focusLayer]);

  const backToIndia = useCallback(() => {
    const {
      map,
      indiaGeoJsonLayer,
      stateGeoJsonLayer,
      cityMarkers,
      stateMarkers,
      indiaMarkers,
      roadwayLayer,
    } = mapRefsRef.current;

    if (!map || !indiaGeoJsonLayer || !indiaMarkers) return;

    map.setMinZoom(5.2);
    map.setMaxBounds(indiaGeoJsonLayer.getBounds().pad(0.2));
    map.fitBounds(indiaGeoJsonLayer.getBounds(), { padding: [150, 150] });
    map.setZoom(5.2);

    if (stateGeoJsonLayer && cityMarkers) {
      map.removeLayer(stateGeoJsonLayer);
      cityMarkers.clearLayers();
      map.removeLayer(cityMarkers);
    }
    if (roadwayLayer) map.removeLayer(roadwayLayer);

    if (stateMarkers) {
      map.removeLayer(stateMarkers);
      stateMarkers.clearLayers();
    }

    indiaMarkers.addTo(map);

    indiaGeoJsonLayer.getLayers().forEach((layer: L.Layer) => {
      if (
        Object.keys(indiaMapMarkerData).includes(
          (layer as mapLayerType).feature?.properties.ST_NM
        )
      ) {
        focusLayer(layer as L.GeoJSON);
      }
    });
  }, [focusLayer]);

  // Layer management functions
  const addCityMarkers = useCallback(
    (cityName: string, pincodeData: PincodeDataType[]) => {
      const { map, cityMarkers, stateMarkers, currentStateLayer } =
        mapRefsRef.current;
      if (!map || !cityMarkers) return;

      setCurrentLocationData((prev) => ({
        ...prev,
        city: cityName,
        pincode: null,
      }));
      cityMarkers.addTo(map);

      let avgLatLng = [0, 0];
      let count = 0;
      if (currStateName.current) {
        getExpCenterQuery.mutate(
          { state: currStateName.current, city: cityName },
          {
            onSuccess: (cityData: apiCityDataType) => {
              cityData.data.forEach((obj) => {
                const latLng = obj.lat_long.split(',');
                if (latLng.length > 1) {
                  count++;
                  avgLatLng = [
                    parseFloat(latLng[0]) + avgLatLng[0],
                    parseFloat(latLng[1]) + avgLatLng[1],
                  ];
                }
                const marker = createCityMarkers(
                  obj.pincode,
                  latLng as unknown as [number, number],
                  pincodeData,
                  cityData
                );
                if (marker) marker.addTo(cityMarkers);
              });
              if (!map || !stateMarkers || !currentStateLayer) return;
              map.removeLayer(stateMarkers);
              unfocusMap([currentStateLayer]);

              avgLatLng = [avgLatLng[0] / count, avgLatLng[1] / count];
              const latLng = new L.LatLng(avgLatLng[0], avgLatLng[1]);
              map.flyTo(latLng, 12);

              const latLngArr = getCityLatlng(cityName, pincodeData);
              const citylatLng = latLngArr
                ? L.latLng(latLngArr[0], latLngArr[1])
                : undefined;

              if (citylatLng) {
                loadStateGeoJSONData(cityName);
              }
            },
          }
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStateName, createCityMarkers]
  );

  const addStateMarkers = useCallback(
    (stateName: string, pincodeData: PincodeDataType[]) => {
      const { stateMarkers, map } = mapRefsRef.current;
      if (!stateMarkers || !map) return;

      console.log('Maps: ', map);

      stateMarkers.addTo(mapRefsRef.current.map!);

      getExpCenterQuery.mutate(
        { state: stateName },
        {
          onSuccess: (data) => {
            data.data.forEach((data: { city: string; count: number }) => {
              const marker = createStateMarkers(
                data.city,
                data.count,
                getCityLatlng(data.city, pincodeData),
                pincodeData
              );
              if (marker) marker.addTo(stateMarkers);
            });
          },
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createStateMarkers]
  );

  // GeoJSON loading functions
  const loadStateGeoJSONData = useCallback(
    async (cityName: string) => {
      const { map } = mapRefsRef.current;
      if (!map) return;

      try {
        const { data } = await getStateGeoJSONDataQuery.refetch();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onEachFeature = (feature: any, layer: L.GeoJSON) => {
          const distName = feature.properties.district;

          if (cityName === distName) {
            layer.setStyle({
              ...mapStyles.focusStyle,
              pane: 'highlightPane',
            });
            layer.bringToBack();
            const center = layer.getBounds().getCenter();
            center.lng += 0.1;

            // map.flyTo(center, 12);

            setTimeout(() => {
              loadRoadwaysGeoJSONData().then(() => {
                map.setMaxBounds(layer.getBounds().pad(2));
                const zoomVal = map.getBoundsZoom(layer.getBounds());
                map.setMinZoom(zoomVal - 1.5);
              });
            }, 500);
          }
        };

        mapRefsRef.current.stateGeoJsonLayer = L.geoJSON(data, {
          style: () => mapStyles.defaultStyle,
          onEachFeature,
        }).addTo(map);
      } catch (error) {
        console.error('Error loading state GeoJSON data:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getStateGeoJSONDataQuery, mapStyles]
  );

  const loadRoadwaysGeoJSONData = useCallback(async () => {
    const { map } = mapRefsRef.current;
    if (!map) return;

    try {
      const { data } = await getRoadwaysGeoJSONDataQuery.refetch();
      // Create and add GeoJSON layer to the map
      mapRefsRef.current.roadwayLayer = L.geoJSON(data, {
        style: () => mapStyles.defaultStyle,
      }).addTo(map);
    } catch (err) {
      console.error('Error loading state GeoJSON ', err);
    }
  }, [getRoadwaysGeoJSONDataQuery, mapRefsRef, mapStyles]);

  const loadGeoJSONData = useCallback(
    async (map: L.Map, pincodeData: PincodeDataType[]) => {
      try {
        const { data } = await getIndiaGeoJSONDataQuery.refetch();

        getExpCenterQuery.mutate(undefined, {
          onSuccess: (data) => {
            data.data.forEach(
              (data: { state: string | number; count: number }) => {
                indiaMapMarkerData[data.state] = data.count;
              }
            );
            loadMap();
          },
        });
        const onEachFeature = (feature: mapFeatureType, layer: L.Layer) => {
          const stateName = (feature as mapFeatureType).properties.ST_NM;

          if (Object.keys(indiaMapMarkerData).includes(stateName)) {
            const houseCount = indiaMapMarkerData[stateName];
            const latLng = STATE_DATA[stateName]?.latLng;

            if (!houseCount || !latLng) return;

            const marker = createIndiaMarkers(
              stateName,
              houseCount,
              latLng,
              layer as L.GeoJSON,
              pincodeData
            );

            if (mapRefsRef.current.indiaMarkers) {
              marker.addTo(mapRefsRef.current.indiaMarkers);
            }
            mapRefsRef.current.stateLayers.push(layer);
          }
        };

        const loadMap = () => {
          const indiaGeoJsonLayer = L.geoJSON(data, {
            style: () => mapStyles.defaultStyle,
            onEachFeature: (feature, layer) =>
              onEachFeature(feature as unknown as mapFeatureType, layer),
          }).addTo(map);

          mapRefsRef.current.indiaGeoJsonLayer = indiaGeoJsonLayer;

          indiaGeoJsonLayer.getLayers().forEach((layer: L.Layer) => {
            if (
              Object.keys(indiaMapMarkerData).includes(
                (layer as mapLayerType).feature?.properties.ST_NM
              )
            ) {
              focusLayer(layer as L.GeoJSON);
            }
          });

          map.setMaxBounds(indiaGeoJsonLayer.getBounds().pad(0.2));
          map.fitBounds(indiaGeoJsonLayer.getBounds(), { padding: [150, 150] });
          map.setZoom(5.2);
        };

        // Focus valid state layers
      } catch (error) {
        console.error('Error loading India GeoJSON data:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      getIndiaGeoJSONDataQuery,
      mapStyles.defaultStyle,
      createIndiaMarkers,
      focusLayer,
    ]
  );

  // Keyboard navigation setup
  const setupKeyboardNavigation = useCallback(() => {
    if (typeof window === 'undefined') return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'l') backToState();
      else if (e.key === 'k') backToIndia();
    };

    // Remove existing listener if any
    if (keyboardListenerRef.current) {
      window.removeEventListener('keydown', keyboardListenerRef.current);
    }

    window.addEventListener('keydown', handleKeydown);
    keyboardListenerRef.current = handleKeydown;
  }, [backToState, backToIndia]);

  // Map initialization
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      // Fetch data
      const [pincodeDataResponse] = await Promise.all([
        getPincodeDataQuery.refetch(),
      ]);

      const pincodeData = pincodeDataResponse?.data;

      if (!pincodeData) {
        console.error('Failed to fetch required data');
        return;
      }

      // Update store
      setPincodeData(pincodeData);

      // Create map
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        preferCanvas: true,
        minZoom: 5.2,
        maxZoom: 5.2,
        zoomSnap: 0.1,
        maxBoundsViscosity: 1.0,
      }).setView([20.5937, 78.9629], 5);

      // Create highlight pane
      map.createPane('highlightPane');
      map.getPane('highlightPane')!.style.zIndex = '550';

      // Initialize layer groups
      const indiaMarkers = L.layerGroup().addTo(map);
      const stateMarkers = L.layerGroup();
      const cityMarkers = L.layerGroup();
      const roadwayLayer = L.layerGroup();

      // Update refs
      mapInstanceRef.current = map;
      mapRefsRef.current = {
        map,
        indiaGeoJsonLayer: null,
        stateGeoJsonLayer: null,
        indiaMarkers,
        stateMarkers,
        cityMarkers,
        roadwayLayer,
        currentStateLayer: null,
        stateLayers: [],
      };

      // Force map resize
      setTimeout(() => {
        map.invalidateSize(true);
      }, 100);

      // Load GeoJSON data and setup keyboard navigation
      await loadGeoJSONData(map, pincodeData);
      setupKeyboardNavigation();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [
    getPincodeDataQuery,
    setPincodeData,
    loadGeoJSONData,
    setupKeyboardNavigation,
  ]);

  useEffect(() => {
    initializeMap();

    return () => {
      if (keyboardListenerRef.current) {
        window.removeEventListener('keydown', keyboardListenerRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (backTos.country) {
      backToIndia();
      reset();
    }
    if (backTos.state) {
      backToState();
      reset();
    }
  }, [backTos, backToIndia, backToState, reset]);

  return (
    <div className="bg-background-dark-500 h-screen overflow-hidden">
      <div ref={mapRef} className="!h-full !w-full" />
    </div>
  );
};

export default MapSection;
