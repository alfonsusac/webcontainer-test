import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // // Clone the request headers and set a new header `x-hello-from-middleware1`
  // const requestHeaders = new Headers(request.headers)
  // requestHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp')
  // requestHeaders.set('Cross-Origin-Opener-Policy', 'same-origin')
  // requestHeaders.set('Cross-Origin-Resource-Policy','cross-origin')

  // // You can also set request headers in NextResponse.rewrite
  // const response = NextResponse.next({
  //   request: {
  //     // New request headers
  //     headers: requestHeaders,
  //   },
  // })
  // return response
}


// export const config = {

//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// }