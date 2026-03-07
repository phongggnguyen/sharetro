import { Metadata } from 'next';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: "Xem nhóm chia tiền",
        description: "Tham gia nhóm trên No Debt để xem chi tiết các khoản chi tiêu và chốt sổ nhanh chóng.",
        openGraph: {
            title: "Xem nhóm chia tiền | No Debt",
            description: "Tham gia nhóm trên No Debt để xem chi tiết các khoản chi tiêu và chốt sổ nhanh chóng.",
            url: `/group/${params.id}`,
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "No Debt Group",
                },
            ],
        },
    };
}

export default function GroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
