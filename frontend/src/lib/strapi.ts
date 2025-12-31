import qs from "qs";

export const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiURL(path = "") {
    return `${STRAPI_API_URL}${path}`;
}

export async function fetchAPI(
    path: string,
    urlParamsObject = {},
    options = {}
) {
    try {
        // Merge default and user options
        const mergedOptions = {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            },
            next: { revalidate: 60 }, // Default revalidation
            ...options,
        };

        // Build request URL
        const queryString = qs.stringify(urlParamsObject, {
            encodeValuesOnly: true, // prettify URL
        });
        const requestUrl = `${getStrapiURL(
            `/api${path}${queryString ? `?${queryString}` : ""}`
        )}`;

        console.log(`[Strapi Fetch] Fetching: ${requestUrl}`);

        // Trigger API call
        const response = await fetch(requestUrl, mergedOptions);

        console.log(`[Strapi Fetch] Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const text = await response.text();
            console.error(`[Strapi Fetch] Error Response (first 100 chars): ${text.substring(0, 100)}`);
            throw new Error(`API call failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`[Strapi Fetch] Catch Block Error:`, error);
        // Return null or empty array instead of throwing to avoid crashing the build
        // if it's the sitemap or feed routes
        if (path === "/articles" || path === "/categories") {
            return { data: [] };
        }
        throw error;
    }
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Otherwise prepend the Strapi URL
    return `${STRAPI_API_URL}${url}`;
}
