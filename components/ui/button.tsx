import type { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded bg-verticall-mid px-4 py-2 text-white hover:bg-verticall-dark ${props.className ?? ""}`}
    />
  );
}
