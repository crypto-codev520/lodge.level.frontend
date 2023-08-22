import logo from "../assests/img/Trust_Logo.png";

const navBtn = "h-11 px-6 py-2 lg:text-lg text-sm hover:text-white hover:bg-orange-500 transition-all cursor-pointer ";

function Navbar() {
  return (
     <div className="w-full flex lg:flex-row flex-col fixed h-28 top-0 left-0 py-5 pl-20 pr-16 justify-between">
         <div className="flex self-center flex-col items-center"> 
               <img src={logo} className="w-12 h-12"></img>
               <div style={{fontSize:"6px"}}> Artificial Intelligence</div> 
         </div>

         <div className="flex self-center items-center">
               <a className={navBtn+" bg-orange-500 text-white"}> Introduction </a>
               <a className={navBtn}> Create Contract </a>
               <a className={navBtn}> Storage </a>
               <a className={navBtn}> Roadmap </a>
               <a className={navBtn}> Whitepaper </a>
               <a className={navBtn}> Contact </a>

               <a className="ml-6 rounded-sm border-orange-500 border px-6 py-2 text-orange-500 cursor-pointer hover:border-black hover:text-black"> Docs </a>
         </div>
     </div>
  );
}

export default Navbar;
