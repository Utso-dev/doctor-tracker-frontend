import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="h-screen bg-bgColor text-center flex justify-center items-center p-4">
      <div className="space-y-4 max-w-md bg-whiteColor p-8 rounded-2xl border border-borderColor shadow-lg">
        <h2 className="text-3xl font-extrabold text-headerColor">404 - Not Found</h2>
        <p className="text-sm text-descriptionColor">Could not find requested resource or page.</p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-primaryColor text-whiteColor text-sm font-medium hover:opacity-95 shadow-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
