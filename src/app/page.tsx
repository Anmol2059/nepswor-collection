import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <h1 className="text-2xl font-bold mb-6 text-color-blue">
        nepSWOR9: Part of nepSWOR Project
      </h1>
      <p className="mb-8">
        Collecting data for ASR evaluation for Nepali dialects.
      </p>
      <div className="flex justify-center space-x-6 mb-8">
        <img
          src="/naamii_logo.svg"
          alt="Naamii Logo"
          className="w-24 h-auto"
        />
        <img
          src="/diyo_logo.png"
          alt="Diyo Logo"
          className="w-24 h-auto"
        />
      </div>
      <Link href="/questionnaire">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600">
          Proceed
        </button>
      </Link>
    </main>
  );
}
