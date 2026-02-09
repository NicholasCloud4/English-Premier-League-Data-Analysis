import React from 'react'

export default function Tools() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-[#38003c] mb-8">Technologies & Tools</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <p className="text-lg">
                    This project was built using modern web development technologies and data visualization
                    libraries to create a fast, responsive, and interactive user experience.
                </p>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#38003c] mb-4">Frontend Development</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">React</h3>
                            <p>
                                The entire application is built with React, leveraging component-based architecture
                                for maintainable and reusable code. React's virtual DOM ensures smooth performance
                                even when rendering complex data visualizations.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Vite</h3>
                            <p>
                                Using Vite as the build tool provides lightning-fast hot module replacement during
                                development and optimized production builds. This significantly improved my development
                                workflow and ensures the final application loads quickly.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">React Router DOM</h3>
                            <p>
                                React Router DOM handles client-side routing, enabling seamless navigation between different
                                sections of the dashboard without page refreshes, creating a smooth single-page
                                application experience.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Tailwind CSS</h3>
                            <p>
                                All styling is done with Tailwind CSS, a utility-first framework that allowed me to
                                quickly build a custom, responsive design matching the Premier League's brand identity.
                                The clean, professional look was achieved without writing custom CSS.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#38003c] mb-4">Data Visualization</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Chart.js / Recharts</h3>
                            <p>
                                Interactive charts and graphs are powered by Chart.js (or Recharts), providing dynamic
                                visualizations that update in real-time and respond to user interactions. These libraries
                                make complex statistical data easy to understand at a glance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#38003c] mb-4">Data Management</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Axios</h3>
                            <p>
                                Axios handles all HTTP requests to fetch Premier League data from external APIs.
                                Its promise-based architecture makes asynchronous data fetching clean and manageable.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">JavaScript/ES6+</h3>
                            <p>
                                Modern JavaScript features like async/await, arrow functions, destructuring, and array
                                methods are used throughout the codebase for data processing and transformation.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#38003c] mb-4">Development Tools</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Git & GitHub</h3>
                            <p>
                                Version control is managed with Git, and the project is hosted on GitHub, demonstrating
                                best practices in collaborative development and code management.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">VS Code</h3>
                            <p>
                                Visual Studio Code served as my primary development environment, with extensions for
                                React, Tailwind CSS, and ESLint ensuring code quality and productivity.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-2xl font-semibold text-[#38003c] mb-4">Why These Technologies?</h2>
                    <p>
                        Each tool was chosen for a specific reason: React for its component reusability and large
                        ecosystem, Vite for development speed, Tailwind for rapid styling, and Chart.js for
                        powerful yet easy-to-implement visualizations. Together, they create a modern, performant,
                        and maintainable application that showcases both my technical skills and understanding of
                        industry-standard tools.
                    </p>
                </div>
            </div>
        </div>
    )
}
