"use client";

export default function Footer() {
    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-left dark:text-gray-400">
                    © 2023{" "}
                    <a
                        href="https://aurora-h2020.eu/"
                        className="hover:underline"
                    >
                        AURORA Project
                    </a>
                </span>
                <span className="text-sm text-gray-500 sm:text-left dark:text-gray-400 max-w-md">
                    This project has received funding from the European Union’s
                    Horizon 2020 research and innovation programme under grant
                    agreement No. 101036418.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a
                            href="/about"
                            className="mr-4 hover:underline md:mr-6 "
                        >
                            About
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}
