import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { LogIn, LogOut, User2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import axios from "axios"
import { USER_API_END_POINT } from "@/utils/constant"
import { setUser } from "../redux/authSlice"

const NavbarOne = () => {
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle logo click based on user role
    const handleLogoClick = () => {
        if (user && user.role === 'recruiter') {
            navigate('/admin/companies')
        } else {
            navigate('/')
        }
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/");
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div 
            className={`sticky top-0 z-50 bg-white ${scrolled ? 'shadow-md' : ''} transition-all duration-300`}
        >
            <div className='flex items-center justify-between mx-auto max-w-5xl h-16 px-4 md:px-6'>
                <div>
                    <div onClick={handleLogoClick} className="cursor-pointer">
                        <span className="text-2xl md:text-3xl font-semibold text-blue-400 tracking-wide">Job</span>
                        <span className="text-3xl md:text-4xl font-semibold text-purple-400 tracking-wide">Vista</span>
                    </div>
                </div>
                
                {/* Navigation - Always Visible */}
                <div className="flex items-center gap-8">
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <Link to="/admin/companies">
                                        <li className="hover:text-blue-500 transition-colors">Companies</li>
                                    </Link>
                                    <Link to="/admin/jobs">
                                        <li className="hover:text-blue-500 transition-colors">Jobs</li>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/">
                                        <li className="hover:text-blue-500 transition-colors">Home</li>
                                    </Link>
                                    <Link to="/jobs">
                                        <li className="hover:text-blue-500 transition-colors">Jobs</li>
                                    </Link>
                                    <Link to="/browse">
                                        <li className="hover:text-blue-500 transition-colors">Browse</li>
                                    </Link>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button className="bg-white text-black hover:bg-gray-100">
                                        Login<LogIn className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                                        SignUp
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="cursor-pointer">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" className="w-8 h-8 rounded-full" />
                                        </Avatar>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto">
                                    <div className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto}
                                                alt="@shadcn"
                                                className="w-8 h-8 rounded-full"
                                            />
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{user?.fullname}</h4>
                                            <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>

                                            <div className="flex flex-col gap-3 my-2">
                                                {
                                                    user && user.role === 'student' && (
                                                        <div className="flex flex-row gap-6">
                                                            <User2 className="flex" />
                                                            <Button variant="link" className="p-0 h-auto text-sm">
                                                                <Link to="/profile">View Profile</Link></Button>
                                                        </div>
                                                    )
                                                }

                                                <div className="flex flex-row gap-6">
                                                    <LogOut className="flex" />
                                                    <Button onClick={logoutHandler} variant="link" className="p-0 h-auto text-sm">Logout</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default NavbarOne