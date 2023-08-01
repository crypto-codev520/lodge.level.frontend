import robot from "../assests/img/robot.png";

function Introduction() {
  return (
     <div className="pl-20 pt-48 font-sans flex  lg:flex-row flex-col">
          <div className="py-28 px-24 text-left font-medium lg:w-1/2 w-full mr-10">
               <div className="text-orange-500 text-sm mb-8" style={{letterSpacing:"5px"}}> TRUST ARTIFICIAL INTELLIGENCE </div>
               <div className="text-lg mb-10 text-blue-950 font-bold"  style={{fontSize:"50px", lineHeight:"70px"}}> Trust AI is an ecosystem built on the Binance Blockchain with integrated AI.  </div>
               <div className="text-xs text-gray-500 mb-5"  style={{fontSize:"18px",lineHeight:"28px"}}> Trust AI is focused on helping developers, companies and even individuals with zero knowledge of coding or any other protocol to be able to create smart contracts, security reporting within minutes and also with Storage system Management. To achieve the “code-per-byte” granularity, each software could send out a language every few seconds.  </div>
               <div className="text-xs text-gray-500"  style={{fontSize:"18px",lineHeight:"28px"}}>               A very important aspect of the TRUST AI Ecosystem is the establishment and continuous refinement of processes to enable smooth data sharing between different AI systems and further enable smooth interactions.</div>         
          </div>
          <div>
               <img src={robot} />
          </div>
     </div>
  );
}

export default Introduction;
