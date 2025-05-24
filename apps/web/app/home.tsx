import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-kidsafe-lightBg p-8">
      <div className="w-full max-w-5xl text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-kidsafe-violet mb-4">
            KidSafe YouTube
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A safe, parent-controlled YouTube experience for your children
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10">
            <Link href="/login">
              <Button size="lg" variant="kid" className="min-w-[200px]">
                Sign In
              </Button>
            </Link>
            <Link href="/login?signup=true">
              <Button 
                size="lg" 
                variant="outline" 
                className="min-w-[200px] border-kidsafe-violet text-kidsafe-violet"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-kidsafe-violet/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kidsafe-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Parent Control</h3>
            <p className="text-gray-600">Whitelist specific YouTube channels for your child to watch, giving you complete control over content.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-kidsafe-violet/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kidsafe-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">AI Filtering</h3>
            <p className="text-gray-600">Our smart AI automatically filters out loud, junky, or inappropriate videos, even from approved channels.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-kidsafe-violet/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kidsafe-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Kid-Friendly Interface</h3>
            <p className="text-gray-600">A fun, simple interface designed especially for children, with large touchable areas and visual navigation.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
