

export const populateDefaultCategories = ({setCategories}) => {
    const defaultCategories = [
        {
            name: "Warm Up",
            activities: [
                { name: "Light Jogging", description: "Jog slowly for 5 minutes", duration: 5, category: "Warm Up" },
                { name: "Arm Circles", description: "Loosen shoulders and arms", duration: 3, category: "Warm Up" },
                { name: "High Knees", description: "Dynamic high knees warm up", duration: 3, category: "Warm Up" },
                { name: "Butt Kicks", description: "Jog with heels to glutes", duration: 3, category: "Warm Up" },
                { name: "Lunges", description: "Forward walking lunges", duration: 5, category: "Warm Up" },
                { name: "Leg Swings", description: "Hip mobility leg swings", duration: 3, category: "Warm Up" },
                { name: "Side Shuffles", description: "Lateral movement warm up", duration: 3, category: "Warm Up" },
                { name: "Jumping Jacks", description: "Full body activation", duration: 3, category: "Warm Up" },
                { name: "Dynamic Stretches", description: "Whole body dynamic stretching", duration: 5, category: "Warm Up" },
                { name: "Skipping", description: "Rope skipping to elevate heart rate", duration: 5, category: "Warm Up" }
            ]
        },
        {
            name: "Skills Practice",
            activities: [
                { name: "Short Passing", description: "Short accurate ground passes", duration: 15, category: "Skills Practice" },
                { name: "Long Passing", description: "Driven long passes across field", duration: 15, category: "Skills Practice" },
                { name: "First Touch Drills", description: "Control and settle incoming balls", duration: 15, category: "Skills Practice" },
                { name: "1v1 Dribbling", description: "Offensive dribbling against defender", duration: 10, category: "Skills Practice" },
                { name: "Cone Dribbling", description: "Close control around cones", duration: 10, category: "Skills Practice" },
                { name: "Shooting Drills", description: "Shots from different angles", duration: 20, category: "Skills Practice" },
                { name: "Crossing Practice", description: "Accurate crosses into box", duration: 15, category: "Skills Practice" },
                { name: "Volley Finishing", description: "First-time volley shots", duration: 10, category: "Skills Practice" },
                { name: "Heading Drills", description: "Offensive and defensive headers", duration: 10, category: "Skills Practice" },
                { name: "Penalty Kicks", description: "Spot kick practice", duration: 10, category: "Skills Practice" }
            ]
        },
        {
            name: "Games",
            activities: [
                { name: "Small-Sided Game", description: "4v4 small pitch", duration: 20, category: "Games" },
                { name: "Scrimmage", description: "Full team match", duration: 30, category: "Games" },
                { name: "Positional Game", description: "Maintain shape under pressure", duration: 20, category: "Games" },
                { name: "Attack vs Defense", description: "Offense vs defensive unit", duration: 20, category: "Games" },
                { name: "Counter Attack Game", description: "Quick transition play", duration: 20, category: "Games" },
                { name: "Finishing Game", description: "Focus on scoring goals", duration: 15, category: "Games" },
                { name: "First Touch Game", description: "Limit touches during play", duration: 15, category: "Games" },
                { name: "Keep Away", description: "Maintain possession under pressure", duration: 10, category: "Games" },
                { name: "Rondo", description: "Quick one-touch passing in circle", duration: 10, category: "Games" },
                { name: "Golden Goal", description: "Sudden death game", duration: 10, category: "Games" }
            ]
        },
        {
            name: "Conditioning",
            activities: [
                { name: "Sprints", description: "Short distance high intensity runs", duration: 10, category: "Conditioning" },
                { name: "Shuttle Runs", description: "Acceleration and direction changes", duration: 10, category: "Conditioning" },
                { name: "Interval Running", description: "Alternating sprint and jog", duration: 20, category: "Conditioning" },
                { name: "Beep Test", description: "Multi-stage fitness test", duration: 20, category: "Conditioning" },
                { name: "Hill Runs", description: "Uphill sprint training", duration: 15, category: "Conditioning" },
                { name: "Agility Ladder", description: "Foot speed & coordination", duration: 10, category: "Conditioning" },
                { name: "Box Jumps", description: "Explosive power training", duration: 10, category: "Conditioning" },
                { name: "Medicine Ball Throws", description: "Core power conditioning", duration: 10, category: "Conditioning" },
                { name: "Resistance Band Drills", description: "Speed and resistance", duration: 10, category: "Conditioning" },
                { name: "Stair Sprints", description: "Explosive stair running", duration: 10, category: "Conditioning" }
            ]
        },
        {
            name: "Tactics",
            activities: [
                { name: "Set Piece Practice", description: "Corners, free kicks, penalties", duration: 20, category: "Tactics" },
                { name: "Offside Trap", description: "Defensive line coordination", duration: 15, category: "Tactics" },
                { name: "Pressing System", description: "High press strategy", duration: 20, category: "Tactics" },
                { name: "Zonal Marking", description: "Defensive zone coverage", duration: 15, category: "Tactics" },
                { name: "Build-Up Play", description: "Slow controlled attack building", duration: 20, category: "Tactics" },
                { name: "Counter Press", description: "Immediate press after loss of ball", duration: 15, category: "Tactics" },
                { name: "Formation Drill", description: "Position-specific movement", duration: 20, category: "Tactics" },
                { name: "Switching Play", description: "Moving ball across field quickly", duration: 15, category: "Tactics" },
                { name: "Overlap Runs", description: "Full-back overlaps & crosses", duration: 15, category: "Tactics" },
                { name: "Defensive Shape", description: "Compact team defending", duration: 15, category: "Tactics" }
            ]
        }
    ];
    setCategories(defaultCategories);
}