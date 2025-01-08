import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800 p-8">
      <div className="text-center max-w-2xl">
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-4">Welcome to nepSWOR9</h1>
        <p className="text-lg mb-6">
          Collecting  speech data to evaluate Automatic Speech Recognition (ASR) for Nepali dialects.
        </p>

        {/* Collaboration Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-gray-600">With collaborative effort of</p>
          <hr className="my-4 border-t border-gray-300" />
          <div className="flex justify-center space-x-6">
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
        </div>

        {/* Proceed Button */}
        <Link href="/questionnaire">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all">
            Proceed
          </button>
        </Link>
      </div>
    </main>
  );
}
