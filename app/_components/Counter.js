"use client";

import {useState} from "react";

export default function Counter({users}) {
  const [count, setCounter] = useState(0);

  return (
    <div>
      <p>There are {users.length} users</p>
      <button onClick={() => setCounter((c) => c + 1)}>{count}</button>
    </div>
  );
}
