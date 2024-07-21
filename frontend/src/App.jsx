import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import HomePage from "./pages/home/HomePage"
import Footer from "./components/Footer"
import SearchPage from "./pages/SearchPage"
import SearchPageHistory from "./pages/SearchPageHistory"
import NotFoundPage from "./pages/NotFoundPage"
import WatchPage from "./pages/WatchPage"

import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authUser"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Navigate, Route, Routes } from "react-router-dom"

function App() {

  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck])

  if (isCheckingAuth) {
    return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={!user ? <LoginPage/> : <Navigate to={'/'}/>}/>
        <Route path="/signup" element={!user ? <SignupPage/> : <Navigate to={'/'} />}/>
        <Route path="/watch/:id" element={ user ? <WatchPage /> : <Navigate to={'/login'} />}/>
        <Route path="/search" element={ user ? <SearchPage /> : <Navigate to={'/login'} />}/>
        <Route path="/history" element={ user ? <SearchPageHistory /> : <Navigate to={'/login'} />}/>
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
