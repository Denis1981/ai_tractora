import './globals.css';
import { Sidebar } from '@/components/ui/sidebar';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body>
        <div className="app-shell">
            <div className="app-shell__sidebar">
                <Sidebar />
            </div>

            <main className="app-shell__main">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}