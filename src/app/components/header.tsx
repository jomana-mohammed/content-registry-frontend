'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Upload, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/authContext'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user , loading , logout , isAuthenticated}= useAuth();

  const router = useRouter();

  const handleLogOut = () => {
    logout();
    router.push('/login');
  }

  return (
    <header className="bg-gray-900">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="inline-block text-2xl font-bold text-white">
              Content<span className="text-indigo-500">Registry</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        {
          isAuthenticated ? (
            <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                <Link
                  href="/upload"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:-translate-y-0.5"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <Link
                  href="login"
                  onClick={handleLogOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
            </PopoverGroup> 
              ) :
              (
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                  <Link
                href="login"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Login
              </Link>
                </PopoverGroup>
              )
        }
      </nav>

      {/* Mobile View */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block text-2xl font-bold text-white">
              Content<span className="text-indigo-500">Registry</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
            {
              isAuthenticated ? (
              <div className="space-y-2 py-6 mt-8">
                <Link
              href="/upload"
              className="flex mt-4 items-center gap-2 px-4 py-2 rounded-md bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Link>
            <Link
              href="/profile"
              className="flex items-center mt-8 gap-2 px-4 py-2 rounded-md text-[#111827] bg-[#F3F4F6] transition-colors"
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
             <Link
              href="login"
              className="flex items-center mt-8 gap-2 px-4 py-2 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors"
              onClick={handleLogOut}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
              </div>
              ) : (
                <Link
                href="login"
                className="mt-8 flex items-center gap-2 px-4 py-2 rounded-md text-[#EF4444] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Login
              </Link>
              )
            }
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

