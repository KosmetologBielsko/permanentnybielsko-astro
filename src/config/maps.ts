import { siteConfig } from './site';

// Verified against the Google Maps listing at Barlickiego 5/23.
const placeId = 'ChIJ-RfkM9-hFkcRoDQeFLxwpFc';
const place = `${siteConfig.businessName}, ${siteConfig.address.streetAddress}, ${siteConfig.address.postalCode} ${siteConfig.address.addressLocality}`;

export const googleMapsUrl = `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: place, query_place_id: placeId })}`;
export const googleDirectionsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: place, destination_place_id: placeId })}`;
