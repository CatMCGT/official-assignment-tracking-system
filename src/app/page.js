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
  );
}