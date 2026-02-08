export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 4rem - 200px)', // Adjust for navbar/footer
            padding: '2rem'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {children}
            </div>
        </div>
    );
}
