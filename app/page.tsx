import { ArrowRightIcon } from "@heroicons/react/20/solid";

export default function SignIn() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col h-72 items-end gap-4 px-4 py-5 relative rounded-md border border-solid border-gray-200">
        <div className="flex w-64 flex-col gap-3 relative">
          <div>
            <p className="text-xs text-gray-500">
              Welcome to Assignment Tracking System...
            </p>
            <p className="font-bold">Sign In With Your Account</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs w-full">Account name</label>
              <input
                className="p-3 bg-gray-100 rounded-xs text-xs w-full"
                placeholder="Account name (e.g. s201401111)"
              ></input>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs w-full">Password</label>
              <input
                className="p-3 bg-gray-100 rounded-xs text-xs w-full"
                placeholder="password"
              ></input>
            </div>
          </div>

          <p className="text-xs text-gray-500">Forgot password?</p>
        </div>
        <ArrowRightIcon className="size-6" />
      </div>
    </div>
    // <div className="flex flex-col w-80 items-end gap-4 p-6 relative rounded-md border border-solid border-[#e7e7e7]">
    //   <div className="flex w-[270px] flex-col items-start gap-3 relative flex-[0_0_auto]">
    //     <div className="relative w-[252px] h-9">
    //       <p className="absolute w-[248px] top-[17px] left-0 [font-family:'Lato-Bold',Helvetica] font-bold text-[#403730] text-base tracking-[0] leading-[normal]">
    //         Sign In With Your Account
    //       </p>
    //       <p className="absolute top-0 left-0 [font-family:'Lato-Regular',Helvetica] font-normal text-[#87837b] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
    //         Welcome to Assignment Tracking System...
    //       </p>
    //     </div>
    //     <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
    //       <div className="relative w-[274px] h-[57px] mr-[-4.00px]">
    //         <div className="absolute w-[270px] h-[37px] top-5 left-0 bg-[#efefef] rounded-md">
    //           <div className="absolute top-2.5 left-[13px] [font-family:'Lato-Regular',Helvetica] font-normal text-[#b0ada8] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
    //             Account name (e.g. s201401111)
    //           </div>
    //         </div>
    //         <div className="absolute w-[174px] top-0 left-0 [font-family:'Lato-Regular',Helvetica] font-normal text-[#413730] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
    //           Account name
    //         </div>
    //       </div>
    //       <div className="relative w-[274px] h-[57px] mr-[-4.00px]">
    //         <div className="absolute w-[270px] h-[37px] top-5 left-0 bg-[#efefef] rounded-md">
    //           <div className="absolute top-2.5 left-[13px] [font-family:'Lato-Regular',Helvetica] font-normal text-[#b0ada8] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
    //             Password
    //           </div>
    //         </div>
    //         <div className="absolute w-[174px] top-0 left-0 [font-family:'Lato-Regular',Helvetica] font-normal text-[#413730] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
    //           Password
    //         </div>
    //       </div>
    //     </div>
    //     <div className="relative self-stretch [font-family:'Lato-Regular',Helvetica] font-normal text-[#87837b] text-xs tracking-[0] leading-[normal]">
    //       Forgot password?
    //     </div>
    //   </div>
    //   <ArrowRightIcon className="size-5" />
    // </div>
  );
}
