"use client";

import { createContext, useContext, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifs, setNotifs] = useState([]);

  function addNotif(type, title, subtitle, message, options) {
    setNotifs((prev) => [...prev, { type, title, subtitle, message, options }]);
  }

  function removeNotif(type) {
    setNotifs((prev) => prev.filter((notif) => notif.type !== type));
  }

  return (
    // createContext lets you create a context that components can provide or read.
    // value is the value that you want to pass to all components reading this context inside this provider, no matter how deep. A component calling useContext(NotificationContext) inside of the provider receives the value of the innermost corresponding context provider above it.
    // https://react.dev/reference/react/createContext#provider

    <NotificationContext value={{ addNotif, removeNotif, notifs }}>
      <div className="w-full relative">
        {children}
        <div className="flex flex-col gap-4 absolute right-16 bottom-10">
          {notifs.map((notif) => {
            return (
              <Notification
                key={notif.type}
                {...notif}
                onClose={() => removeNotif(notif.type)}
              />
            );
          })}
        </div>
      </div>
    </NotificationContext>
  );
}

export function Notification({
  type,
  title,
  subtitle,
  message,
  options,
  onClose,
}) {
  if (type.includes("confirm")) {
    return (
      <div className="w-fit min-w-40 border-1 border-stroke-weak bg-white z-10 py-3 px-4 rounded flex flex-row gap-5 items-center">
        <div>
          <p className="font-bold text-lg text-text-strong">{title}</p>
          <p className="text-sm text-text-weak">{subtitle}</p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <button
            className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50 h-fit"
            onClick={options.onConfirm}
          >
            {options.confirmIcon}
          </button>
          <button
            className="flex items-center justify-between border-1 border-stroke-weak rounded p-2 cursor-pointer hover:bg-gray-50 h-fit"
            onClick={onClose}
          >
            {options.cancelIcon || (
              <XMarkIcon className="size-6 text-text-weak" />
            )}
          </button>
        </div>
      </div>
    );
  }
}

export function useNotification() {
  return useContext(NotificationContext);
}

export { NotificationContext };
