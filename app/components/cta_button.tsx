import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

interface CTAButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  buttonText?: string;
  link: string;
  color: string;
  onHover: string;
  handleButtonHover: Function;
}
export default function CTAButton({
  title,
  message,
  buttonText,
  link,
  color,
  onHover,
  handleButtonHover,
}: CTAButtonProps) {
  let callOnHover = (color: string) => {
    handleButtonHover(color);
  };

  return (
    <div
      className="m-1 group/hero-product flex flex-col items-center p-6 md:pr-10 md:pl-10 md:p-8 cursor-default bg-white/5 backdrop-blur transition rounded-lg first:rounded-l-[40px] last:rounded-r-[40px] hover:scale-[1.02] hover:bg-white/10"
      onMouseEnter={() => callOnHover(color)}
      onMouseLeave={() => callOnHover("bg-emerald-500")}
    >
      <h3 className="flex items-center gap-1 text-zinc-50 font-display text-2xl font-medium leading-none">
        <span>{title}</span>
      </h3>
      <p className="mt-2 opacity-60 text-zinc-300">{message}</p>
      <Link href={link}>
        <div
          className={`group/link-new inline-flex cursor-pointer items-center transition gap-1 px-5 py-2 rounded-full bg-zinc-50 ${onHover} hover:text-zinc-300 disabled:bg-white/5 disabled:text-zinc-50 mt-4  text-zinc-950`}
        >
          <span>{buttonText}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            className="inline-flex shrink-0 text-xl ml-auto opacity-60"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </Link>
    </div>
  );
}
