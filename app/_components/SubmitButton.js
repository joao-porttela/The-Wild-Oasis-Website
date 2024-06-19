"use client";

import SpinnerMini from "./SpinnerMini";
import {useFormStatus} from "react-dom";

function SubmitButton({children, pendingCondition = false}) {
  const {pending} = useFormStatus();

  return (
    <div className="flex justify-end items-center gap-6">
      <button
        disabled={pending || pendingCondition}
        className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      >
        {pending ? <SpinnerMini /> : children}
      </button>
    </div>
  );
}

export default SubmitButton;
