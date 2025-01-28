import Navbar from '../navbar/navbar';
import Middle from '../middle/middle';
import Theory from '../theory/theory';
import Info from '../firstpageinfo/info';

export default function Home() {
  return (
    <div>
        <Navbar />
      <div className="h-[420px] w-full flex bg-gray-200 max-xl:h-[460px] max-lg:h-96 max-md:flex-col max-md:h-[600px] max-md:px-4 max-sm:h-[650px] max-sm:px-4">
         <Middle />
         <Info className="z-10" />
      </div>
      <Theory />
    </div>
  );
}
