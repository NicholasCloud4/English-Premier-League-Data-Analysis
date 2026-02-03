import React from 'react'

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-[#38003c] mb-8">About This Project</h1>

            <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                    Welcome to my English Premier League Data Analysis project! This interactive dashboard was created
                    to explore and visualize key statistics from the English Premier League, offering insights
                    into team performance, player statistics, and match outcomes.
                </p>

                <h2 className="text-2xl font-semibold text-[#38003c] mt-8 mb-4">Why I Built This</h2>
                <p>
                    As a passionate football fan, I wanted to combine my love for
                    the beautiful game with my growing skills in data visualization and web development. The
                    Premier League generates an incredible amount of data every season, and I saw an opportunity
                    to make this information more accessible and visually engaging.
                </p>

                <p>
                    This project allowed me to tackle real-world challenges in data processing, API integration,
                    and creating interactive user experiences. From collecting and looking at data to designing intuitive
                    charts, every aspect of this dashboard represents a learning opportunity and a step forward
                    in my development journey.
                </p>

                <h2 className="text-2xl font-semibold text-[#38003c] mt-8 mb-4">What You'll Find</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Comprehensive team statistics including goals, assists, and defensive records</li>
                    <li>Fixture-level match data with detailed statistics for each finished game</li>
                    <li>Event timelines for each match (goals, cards, substitutions, and other key moments)</li>
                    <li>Interactive charts and visualizations for easy data exploration</li>
                    <li>Data for the chosen date range</li>
                </ul>

                <h2 className="text-2xl font-semibold text-[#38003c] mt-8 mb-4">My Goals</h2>
                <p>
                    Through this project, I aimed to demonstrate my ability to work with complex data,
                    create meaningful visualizations, and build a polished, user-friendly web application.
                    Whether you're a fellow football enthusiast, a recruiter looking at my portfolio, or
                    someone interested in sports analytics, I hope this dashboard provides valuable insights
                    and showcases the potential of data-driven storytelling in sports.
                </p>

                <p className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                    <strong>Data Source:</strong> All statistics are sourced from official Premier League APIs
                    and publicly available datasets. This is an independent project created for educational
                    and portfolio purposes.
                </p>
            </div>
        </div>
    );
}
