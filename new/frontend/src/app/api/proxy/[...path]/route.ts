import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'https://localhost:7280/api/babymonitor';

if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Next.js 15+ Route Handler Signature: params is a Promise
async function proxyHandler(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    const path = params.path.join('/');
    const searchParams = req.nextUrl.search;
    const targetUrl = `${API_BASE_URL}/${path}${searchParams}`;

    try {
        const options: RequestInit = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (req.method !== 'GET' && req.method !== 'HEAD') {
            const body = await req.json().catch(() => null);
            if (body) {
                options.body = JSON.stringify(body);
            }
        }

        const response = await fetch(targetUrl, options);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`Proxy Error for ${targetUrl}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch from backend', details: String(error) },
            { status: 500 }
        );
    }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
