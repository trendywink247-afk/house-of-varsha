import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * API Route for On-Demand Revalidation
 *
 * This endpoint allows triggering a cache refresh when Google Sheets data is updated.
 * Use this when you want changes to appear immediately without waiting for the
 * automatic 60-second revalidation.
 *
 * Usage:
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-secret": "your_secret" }
 *   Body: { "path": "/shop" } (optional - defaults to all pages)
 *
 * Or with query params:
 *   POST /api/revalidate?secret=your_secret&path=/shop
 *
 * You can trigger this from:
 *   - Google Sheets Apps Script (on edit trigger)
 *   - A manual button/link in your admin panel
 *   - Any HTTP client (curl, Postman, etc.)
 *
 * Example curl:
 *   curl -X POST "https://your-domain.com/api/revalidate?secret=your_secret"
 */

export async function POST(request: NextRequest) {
  try {
    // Get secret from header or query param
    const headerSecret = request.headers.get('x-revalidate-secret')
    const { searchParams } = new URL(request.url)
    const querySecret = searchParams.get('secret')
    const secret = headerSecret || querySecret

    // Validate secret
    const expectedSecret = process.env.REVALIDATION_SECRET

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Revalidation secret not configured on server' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid revalidation secret' },
        { status: 401 }
      )
    }

    // Get path to revalidate from body or query
    let pathToRevalidate = searchParams.get('path')

    if (!pathToRevalidate) {
      try {
        const body = await request.json()
        pathToRevalidate = body.path
      } catch {
        // No body provided, that's okay
      }
    }

    // Revalidate specified path or all product-related paths
    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate)
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${pathToRevalidate}`,
        timestamp: new Date().toISOString()
      })
    }

    // Revalidate all product-related paths
    const pathsToRevalidate = [
      '/',           // Homepage (featured products)
      '/shop',       // Shop page (all products)
      '/products',   // Product detail pages (layout)
    ]

    pathsToRevalidate.forEach(path => {
      revalidatePath(path)
    })

    // Also revalidate all dynamic product pages
    revalidatePath('/products/[id]', 'page')

    return NextResponse.json({
      success: true,
      message: 'Revalidated all product pages',
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Also support GET for easy testing (with secret in query)
export async function GET(request: NextRequest) {
  return POST(request)
}
