
import logo from '../../public/subkitz.png'
import Image from "next/image";


const Navbar = async () => {

  return (
    <div className="fixed top-0 shadow-lg shadow-lime-500/20 z-50 flex items-center p-4 w-full bg-slate-900 h-16 bg-primary">
      <Image src={logo} alt="subkitz logo" width={100} height={100} />
      
    </div>
  );
};

export default Navbar;
