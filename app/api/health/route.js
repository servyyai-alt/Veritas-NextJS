export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    success: true,
    message: "Application is running",
    environment: process.env.NODE_ENV === "production" ? "production" : "development",
  }, { headers: { "Cache-Control": "no-store" } });
}
