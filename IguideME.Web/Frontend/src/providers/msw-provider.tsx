// 'use client';

// import { type ReactElement, type ReactNode, useEffect, useState } from 'react';

// export function MswProvider({
//   children,
// }: Readonly<{
//   children: ReactNode;
// }>): ReactElement | null {
//   const [mockingEnabled, setMockingEnabled] = useState<boolean>(false);

//   useEffect(() => {
//     async function enableApiMocking(): Promise<void> {
//       if (typeof window !== 'undefined') {
//         const { worker } = await import('@/mocks/workers/browser-worker');
//         await worker.start({
//           onUnhandledRequest: 'bypass',
//         });
//       }
//     }

//     if (process.env.NEXT_PUBLIC_ENABLE_MOCKING) {
//       enableApiMocking()
//         .then(() => {
//           setMockingEnabled(true);
//         })
//         .catch((error: unknown) => {
//           // eslint-disable-next-line no-console -- This log only ever appears in development
//           console.error('Failed to enable API mocking:', error);
//         });
//     }
//   }, []);

//   if (process.env.NEXT_PUBLIC_ENABLE_MOCKING && !mockingEnabled) return null;

//   return <>{children}</>;
// }
