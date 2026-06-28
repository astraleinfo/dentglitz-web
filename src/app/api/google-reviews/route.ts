import { NextResponse } from "next/server";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`,
      {
        headers: { "X-Goog-FieldMask": "reviews,rating,userRatingCount" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Google Places API error:", res.status, text);
      return NextResponse.json({ error: "Places API error" }, { status: 502 });
    }

    const data = await res.json();

    const reviews = (data.reviews ?? []).map(
      (r: {
        authorAttribution: { displayName: string; photoUri?: string };
        rating: number;
        text?: { text: string };
        relativePublishTimeDescription?: string;
      }) => ({
        name: r.authorAttribution.displayName,
        avatar: r.authorAttribution.photoUri ?? null,
        rating: r.rating,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      })
    );

    return NextResponse.json({
      rating: data.rating ?? null,
      totalReviews: data.userRatingCount ?? null,
      reviews,
    });
  } catch (err) {
    console.error("google-reviews route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
