'use client';

import { useEffect, useRef } from 'react';

import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';

export type BranchLocation = {
    name: string;
    coords: [number, number];
};

type FocusRequest = {
    name: string;
    id: number;
};

type BranchMapProps = {
    focusRequest?: FocusRequest | null;
    branches?: BranchLocation[];
};

export const BranchMap = ({ focusRequest, branches = [] }: BranchMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const markersRef = useRef<Record<string, LeafletMarker>>({});

    useEffect(() => {
        let cancelled = false;
        let activeMap: LeafletMap | null = null;

        const initializeMap = async () => {
            const container = mapContainerRef.current;
            if (!container) return;

            const L = (await import('leaflet')).default;
            if (cancelled || !mapContainerRef.current) return;

            const branchPinIcon = L.divIcon({
                className: 'branch-pin-wrapper',
                html: "<span class='branch-pin'></span>",
                iconSize: [22, 30],
                iconAnchor: [11, 30],
                popupAnchor: [0, -28]
            });

            const map = L.map(container, {
                zoomControl: true,
                scrollWheelZoom: false
            }).setView([41.3775, 64.5853], 6);
            activeMap = map;
            mapRef.current = map;
            map.attributionControl.setPrefix(false);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const markerLayers = branches.map((branch) => {
                const marker = L.marker(branch.coords, { icon: branchPinIcon }).addTo(map);
                markersRef.current[branch.name] = marker;

                marker.bindPopup(`<strong>${branch.name}</strong>`);
                marker.on('click', () => {
                    map.stop();
                    map.flyTo(branch.coords, 11, { duration: 0.8 });
                });
                return marker;
            });

            if (markerLayers.length) {
                const group = L.featureGroup(markerLayers);
                map.fitBounds(group.getBounds().pad(0.25));
            }
        };

        void initializeMap();

        return () => {
            cancelled = true;
            activeMap?.stop();
            markersRef.current = {};
            mapRef.current = null;
            activeMap?.remove();
        };
    }, [branches]);

    useEffect(() => {
        if (!focusRequest) return;

        const map = mapRef.current;
        const marker = markersRef.current[focusRequest.name];
        if (!map || !marker) return;

        const latLng = marker.getLatLng();
        map.stop();
        map.flyTo(latLng, 11, { duration: 0.8 });
        marker.openPopup();
    }, [focusRequest]);

    return <div ref={mapContainerRef} className='h-full w-full rounded-2xl' />;
};
