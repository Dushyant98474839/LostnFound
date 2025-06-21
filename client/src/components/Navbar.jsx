import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import { UserOutlined, BellOutlined , PlusSquareOutlined, LogoutOutlined} from "@ant-design/icons";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function Navbar() {
    const [session, setSession] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data?.session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => listener?.subscription?.unsubscribe();
    }, []);

    const handleSignOut=async()=>{
        const {error} = await supabase.auth.signOut()
        navigate('/')
        
    }

    const navItems = session
        ? [
            { label: "Home", path: "/home" },
            // { label: "About", path: "/about" },
            // { label: "Contact", path:"/contact"},
            // { label: "Report Lost", path: "/report-lost" },
            // { label: "Report Found", path: "/report-found" },
            { label: "My posts", path: "/my-posts" },
        ]
        : [
            { label: "Home", path: "/home" },
            // { label: "About", path: "/about" },
            // { label: "Contact", path:"/contact"},
            { label: "Login", path: "/login" },
            { label: "Signup", path: "/signup" },
        ];

    return (
        <nav className="bg-black text-white px-8 py-3 flex justify-between items-center">
            <div className="text-2xl font-bold">
                <Link to="/">Retreiv</Link>
            </div>

            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <ul className="hidden lg:flex gap-6 items-center">
                <PlusSquareOutlined className="text-xl hover:cursor-pointer" onClick={()=>navigate('/createpost')}/>
                {navItems.map((item) => (
                    <li key={item.path}>
                        <Link to={item.path} className="hover:text-blue-400 transition">
                            {item.label}
                        </Link>
                    </li>
                ))}
                {session ?
                    <>
                    <BellOutlined className="hover:cursor-pointer" />
                    <UserOutlined className="hover:cursor-pointer" onClick={()=>navigate('/profile')} />
                        <LogoutOutlined className="hover:cursor-pointer"  onClick={handleSignOut}/>
                    </> : ""
                }
            </ul>


            {menuOpen && (
                <ul className="lg:hidden absolute top-14 shadow-2xl left-0 w-full z-10 bg-black px-8 py-4 flex flex-col gap-3">
                    <div className="flex flex-row gap-4">

                <PlusSquareOutlined className="text-xl hover:cursor-pointer" onClick={()=>navigate('/createpost')}/>
                    <BellOutlined className="hover:cursor-pointer" />
                    <UserOutlined className="hover:cursor-pointer" onClick={()=>navigate('/profile')} />
                        <LogoutOutlined className="hover:cursor-pointer"  onClick={handleSignOut}/>
                    </div>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link to={item.path} onClick={() => setMenuOpen(false)} className="block text-white hover:text-blue-400">
                                {item.label}
                            </Link>
                        </li>
                    ))}

                </ul>
            )}
        </nav>
    );
}
