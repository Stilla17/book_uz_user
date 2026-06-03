'use client';

import { useEffect, useRef } from 'react';

import L from 'leaflet';

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
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Record<string, L.Marker>>({});

    useEffect(() => {
        if (!mapContainerRef.current) return;
        const branchPinIcon = L.divIcon({
            className: 'branch-pin-wrapper',
            html: "<span class='branch-pin'></span>",
            iconSize: [22, 30],
            iconAnchor: [11, 30],
            popupAnchor: [0, -28]
        });

        const map = L.map(mapContainerRef.current, {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([41.3775, 64.5853], 6);
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
                map.flyTo(branch.coords, 11, { duration: 0.8 });
            });
            return marker;
        });

        if (markerLayers.length) {
            const group = L.featureGroup(markerLayers);
            map.fitBounds(group.getBounds().pad(0.25));
        }

        return () => {
            markersRef.current = {};
            mapRef.current = null;
            map.remove();
        };
    }, [branches]);

    useEffect(() => {
        if (!focusRequest) return;

        const map = mapRef.current;
        const marker = markersRef.current[focusRequest.name];
        if (!map || !marker) return;

        const latLng = marker.getLatLng();
        map.flyTo(latLng, 11, { duration: 0.8 });
        marker.openPopup();
    }, [focusRequest]);

    return <div ref={mapContainerRef} className='h-full w-full rounded-2xl' />;
};
