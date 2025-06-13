"use client";

import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifs, setNotifs] = useState([]);

  function addNotif(title, message, content) {
    const id = Date.now();
    setNotifs((prev) => [...prev, { id, title, message, content }]);
  }

  function removeNotif(id) {
    setNotifs((prev) => prev.filter((notif) => notif.id !== id));
  }

  return (
    // createContext lets you create a context that components can provide or read.
    // value is the value that you want to pass to all components reading this context inside this provider, no matter how deep. A component calling useContext(NotificationContext) inside of the provider receives the value of the innermost corresponding context provider above it.
    // https://react.dev/reference/react/createContext#provider

    <NotificationContext value={{ addNotif, removeNotif, notifs }}>
      <div className="w-full relative">
        {children}
        <div>
          {notifs.map((notif) => {
            return (
              <Notification
                key={notif.id}
                {...notif}
                onClose={() => removeNotif(notif.id)}
              />
            );
          })}
        </div>
      </div>
    </NotificationContext>
  );
}

export function Notification({ title, message, content, onClose }) {
  return (
    <div className="w-fit min-w-40 absolute right-4 bottom-4 border-1 border-stroke-weak bg-white z-10 py-3 px-4 rounded">
      <div>
        <div>
          <p className="font-bold text-lg">{title}</p>
          <p className="text-sm text-text-weak">{message}</p>
        </div>
        <button onClick={onClose}>x</button>
      </div>
      {content}
    </div>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

export { NotificationContext };
