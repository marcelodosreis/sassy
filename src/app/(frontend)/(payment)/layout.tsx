import { Suspense } from 'react'

type Props = {
    children: React.ReactNode;
}

export default async function PaymentsLayout({ children }: Props) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}
