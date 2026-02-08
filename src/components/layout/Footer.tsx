import React from 'react';

export function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '3rem 0',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>© 2026 Pet Connect. All rights reserved.</p>
            </div>
        </footer>
    );
}
