import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'

function Layout({ children }) {
  const isHomePage = useLocation().pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="w-full flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div
            className={`mx-auto w-full max-w-[1600px] ${isHomePage ? 'pb-8 pt-0' : 'py-8'}`}
          >
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
