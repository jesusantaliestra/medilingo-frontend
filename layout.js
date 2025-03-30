import './globals.css';

export const metadata = {
  title: 'MediLingo',
  description: 'Practice medical English with real-time feedback',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
