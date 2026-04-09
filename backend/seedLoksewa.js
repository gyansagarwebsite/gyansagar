import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

const questions = [
  // --- HISTORY (10) ---
  {
    questionText: "Who was the first King of the unified Nepal?",
    options: ["Prithvi Narayan Shah", "Pratap Malla", "Jayaprakash Malla", "Draya Shah"],
    correctAnswer: 0,
    category: "History",
    difficulty: "Easy",
    explanation: "Prithvi Narayan Shah unified Nepal in the late 18th century."
  },
  {
    questionText: "In which year was the Treaty of Sugauli signed between Nepal and the East India Company?",
    options: ["1814 AD", "1815 AD", "1816 AD", "1817 AD"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium",
    explanation: "Signed on March 4, 1816, ending the Anglo-Nepalese War."
  },
  {
    questionText: "Who was the first Prime Minister of Nepal after the 1951 revolution?",
    options: ["Tanka Prasad Acharya", "Matrika Prasad Koirala", "Bishweshwar Prasad Koirala", "Mohan Shumsher"],
    correctAnswer: 3,
    category: "History",
    difficulty: "Medium",
    explanation: "Mohan Shumsher was the first PM in the coalition govt of 2007 BS."
  },
  {
    questionText: "Which Malla King started the practice of keeping 'Kumari' in Nepal?",
    options: ["Ratna Malla", "Pratap Malla", "Gunakamadev", "Jayaprakash Malla"],
    correctAnswer: 3,
    category: "History",
    difficulty: "Hard"
  },
  {
    questionText: "How many Shah Kings have ruled Nepal in total?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium"
  },
  {
    questionText: "When did the 'Kot Massacre' occur in Nepal?",
    options: ["1903 BS", "1904 BS", "1905 BS", "1906 BS"],
    correctAnswer: 0,
    category: "History",
    difficulty: "Hard",
    explanation: "On Sept 14, 1846 AD (1903 BS), leading to Rana rule."
  },
  {
    questionText: "Who was the last King of the Rana dynasty to serve as PM?",
    options: ["Bhimsen Thapa", "Jung Bahadur Rana", "Mohan Shumsher", "Padma Shumsher"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium"
  },
  {
    questionText: "The 'Anglo-Nepal War' was fought during the reign of which King?",
    options: ["Prithvi Narayan Shah", "Girvan Yuddha Bikram Shah", "Surendra Bikram Shah", "Tribhuvan Shah"],
    correctAnswer: 1,
    category: "History",
    difficulty: "Hard"
  },
  {
    questionText: "Who is known as the 'National Hero' (Rastriya Bibhuti) in Nepal for his bravery in the Anglo-Nepal War?",
    options: ["Bhakti Thapa", "Amar Singh Thapa", "Balbhadra Kunwar", "All of the above"],
    correctAnswer: 3,
    category: "History",
    difficulty: "Easy"
  },
  {
    questionText: "When was the Republic of Nepal declared?",
    options: ["2063 Jestha 15", "2064 Jestha 15", "2065 Jestha 15", "2066 Jestha 15"],
    correctAnswer: 2,
    category: "History",
    difficulty: "Medium"
  },

  // --- GEOGRAPHY (10) ---
  {
    questionText: "What is the total area of Nepal in square kilometers?",
    options: ["147,181 sq. km", "147,516 sq. km", "147,816 sq. km", "147,616 sq. km"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Easy",
    explanation: "New official area including Limpiyadhura, Lipulekh, and Kalapani."
  },
  {
    questionText: "Which is the largest district of Nepal by area?",
    options: ["Humla", "Mugu", "Dolpa", "Taplejung"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "How many districts are there in Nepal currently?",
    options: ["75", "76", "77", "78"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "Which is the deepest river in Nepal?",
    options: ["Koshi", "Gandaki", "Karnali", "Narayani"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "Mount Everest is located in which district of Nepal?",
    options: ["Sankhuwasabha", "Solukhumbu", "Dolakha", "Okhaldhunga"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "What is the height of Mt. Everest (Sagarmatha) as officially updated recently?",
    options: ["8848 m", "8848.48 m", "8848.86 m", "8849 m"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the largest lake in Nepal?",
    options: ["Phewa Lake", "Rara Lake", "Shey-Phoksundo Lake", "Tilicho Lake"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "How many provinces are there in Nepal?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },
  {
    questionText: "Which district of Nepal is known as the 'Switzerland of Nepal'?",
    options: ["Mustang", "Jiri (Dolakha)", "Bandipur", "Ghandruk"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the smallest district of Nepal by area?",
    options: ["Kathmandu", "Lalitpur", "Bhaktapur", "Parbat"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "Easy"
  },

  // --- CONSTITUTION (10) ---
  {
    questionText: "What is the official name of the current Constitution of Nepal?",
    options: ["Constitution of Nepal 2072", "The Constitution of Nepal", "Interim Constitution of Nepal", "Federal Democratic Constitution"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Medium",
    explanation: "Officially named 'The Constitution of Nepal'."
  },
  {
    questionText: "How many Parts are there in the current Constitution of Nepal?",
    options: ["30", "35", "40", "45"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Medium"
  },
  {
    questionText: "How many Articles are there in the current Constitution of Nepal?",
    options: ["308", "305", "310", "315"],
    correctAnswer: 0,
    category: "Constitution",
    difficulty: "Medium"
  },
  {
    questionText: "How many Schedules (Anusuchi) are there in the current Constitution of Nepal?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 2,
    category: "Constitution",
    difficulty: "Medium"
  },
  {
    questionText: "Who was the President of Nepal when the 2072 Constitution was promulgated?",
    options: ["Ram Baran Yadav", "Bidya Devi Bhandari", "Ram Chandra Paudel", "Subash Chandra Nembang"],
    correctAnswer: 0,
    category: "Constitution",
    difficulty: "Easy"
  },
  {
    questionText: "Which part of the Constitution deals with 'Fundamental Rights and Duties'?",
    options: ["Part 2", "Part 3", "Part 4", "Part 5"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Medium"
  },
  {
    questionText: "How many Fundamental Rights are guaranteed by the current Constitution of Nepal?",
    options: ["21", "25", "30", "31"],
    correctAnswer: 3,
    category: "Constitution",
    difficulty: "Hard"
  },
  {
    questionText: "In which Article is the 'Right to Education' mentioned?",
    options: ["Article 30", "Article 31", "Article 32", "Article 33"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Hard"
  },
  {
    questionText: "When was the first amendment of the current Constitution of Nepal promulgated?",
    options: ["2072 Falgun 16", "2072 Magh 16", "2072 Chaitra 16", "2073 Magh 16"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Hard"
  },
  {
    questionText: "According to the Constitution, what is the term of office for the President?",
    options: ["4 years", "5 years", "6 years", "Until next election"],
    correctAnswer: 1,
    category: "Constitution",
    difficulty: "Easy"
  },

  // --- SCIENCE (10) ---
  {
    questionText: "What is the chemical symbol for Gold?",
    options: ["Gd", "Ag", "Au", "Pb"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the boiling point of pure water at sea level?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "Which gas is most abundant in the Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "What instrument is used to measure atmospheric pressure?",
    options: ["Thermometer", "Hygrometer", "Barometer", "Seismograph"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Medium"
  },
  {
    questionText: "Who discovered the theory of Relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the speed of light in a vacuum approximately?",
    options: ["3,000 km/s", "30,000 km/s", "300,000 km/s", "3,000,000 km/s"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Hard"
  },
  {
    questionText: "Which vitamin is synthesized by the help of sunlight in the human body?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "Easy"
  },

  // --- MATHEMATICS (10) ---
  {
    questionText: "What is the square root of 625?",
    options: ["15", "25", "35", "45"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "Solve: (25 * 4) + (50 / 2) = ?",
    options: ["100", "125", "150", "200"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "What is the value of Pi (π) approximately?",
    options: ["2.14", "3.14", "4.14", "5.14"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "If a car travels at 60 km/h, how far will it travel in 2.5 hours?",
    options: ["120 km", "150 km", "180 km", "200 km"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Medium"
  },
  {
    questionText: "What is the sum of internal angles of a triangle?",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "Find the median of the set: 2, 8, 4, 10, 6.",
    options: ["4", "6", "8", "10"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Medium",
    explanation: "Sorted order: 2, 4, 6, 8, 10. Middle is 6."
  },
  {
    questionText: "What is 15% of 200?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 3,
    category: "Mathematics",
    difficulty: "Medium"
  },
  {
    questionText: "Simplfy: (a+b)^2",
    options: ["a2 + b2", "a2 + 2ab + b2", "a2 - 2ab + b2", "a2 + ab + b2"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    questionText: "A cube has how many edges?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 3,
    category: "Mathematics",
    difficulty: "Medium"
  },
  {
    questionText: "If 5x = 45, what is x?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 2,
    category: "Mathematics",
    difficulty: "Easy"
  },

  // --- COMPUTER (10) ---
  {
    questionText: "What is the full form of RAM?",
    options: ["Read Access Memory", "Random Access Memory", "Ready Application Memory", "Real Action Memory"],
    correctAnswer: 1,
    category: "Computer",
    difficulty: "Easy"
  },
  {
    questionText: "Who is known as the Father of Computers?",
    options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"],
    correctAnswer: 1,
    category: "Computer",
    difficulty: "Easy"
  },
  {
    questionText: "Which is the smallest unit of data in a computer?",
    options: ["Bit", "Byte", "Kilobyte", "Megabyte"],
    correctAnswer: 0,
    category: "Computer",
    difficulty: "Easy"
  },
  {
    questionText: "What is the primary function of an Operating System?",
    options: ["Browsing internet", "Word processing", "Managing resources", "Graphic designing"],
    correctAnswer: 2,
    category: "Computer",
    difficulty: "Medium"
  },
  {
    questionText: "Which shortcut key is used to Undo an action?",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + Z", "Ctrl + S"],
    correctAnswer: 2,
    category: "Computer",
    difficulty: "Easy"
  },
  {
    questionText: "What does URL stand for?",
    options: ["Uniform Resource Locator", "Universal Resource Locator", "User Resource Link", "United Resource Locator"],
    correctAnswer: 0,
    category: "Computer",
    difficulty: "Medium"
  },
  {
    questionText: "Which part of the computer is called its 'Brain'?",
    options: ["RAM", "Hard Disk", "CPU", "Motherboard"],
    correctAnswer: 2,
    category: "Computer",
    difficulty: "Easy"
  },
  {
    questionText: "What type of storage device is a SSD?",
    options: ["Optical", "Magnetic", "Flash memory", "Volatile"],
    correctAnswer: 2,
    category: "Computer",
    difficulty: "Medium"
  },
  {
    questionText: "Which protocol is used for securing data transfer over the internet?",
    options: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correctAnswer: 1,
    category: "Computer",
    difficulty: "Medium"
  },
  {
    questionText: "Which company developed the Windows operating system?",
    options: ["Apple", "Google", "Microsoft", "Intel"],
    correctAnswer: 2,
    category: "Computer",
    difficulty: "Easy"
  },

  // --- LOKSEWA SPECIAL & GK (Mixed 10) ---
  {
    questionText: "In which year did Nepal enter the United Nations (UN)?",
    options: ["1945 AD", "1950 AD", "1955 AD", "1960 AD"],
    correctAnswer: 2,
    category: "Loksewa",
    difficulty: "Medium",
    explanation: "Nepal became a member of the UN on Dec 14, 1955."
  },
  {
    questionText: "What is the term for the head of SAARC Secretariat?",
    options: ["Chairman", "President", "Secretary General", "Director General"],
    correctAnswer: 2,
    category: "Loksewa",
    difficulty: "Easy"
  },
  {
    questionText: "Where is the headquarters of SAARC located?",
    options: ["New Delhi", "Dhaka", "Kathmandu", "Colombo"],
    correctAnswer: 2,
    category: "Loksewa",
    difficulty: "Easy"
  },
  {
    questionText: "Who was the first woman to climb Mt. Everest?",
    options: ["Pasang Lhamu Sherpa", "Junko Tabei", "Valentina Tereshkova", "Arunima Sinha"],
    correctAnswer: 1,
    category: "Loksewa",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the national bird of Nepal?",
    options: ["Peacock", "Danphe (Lophophorus)", "Parrot", "Munnal"],
    correctAnswer: 1,
    category: "GK",
    difficulty: "Easy"
  },
  {
    questionText: "How many districts are located in the Terai region of Nepal (after 77 districts)?",
    options: ["20", "21", "22", "23"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Hard"
  },
  {
    questionText: "Which is the largest province of Nepal by population (Census 2078)?",
    options: ["Bagmati", "Lumbini", "Madhesh", "Koshi"],
    correctAnswer: 0,
    category: "GK",
    difficulty: "Medium"
  },
  {
    questionText: "Nepal's standard time is based on which mountain?",
    options: ["Everest", "Gaurishankar", "Machhapuchhre", "Annapurna"],
    correctAnswer: 1,
    category: "GK",
    difficulty: "Medium"
  },
  {
    questionText: "Who was the first President of Nepal?",
    options: ["Ram Baran Yadav", "Parmanand Jha", "Girija Prasad Koirala", "Pushpa Kamal Dahal"],
    correctAnswer: 0,
    category: "Loksewa",
    difficulty: "Easy"
  },
  {
    questionText: "What is the national flower of Nepal?",
    options: ["Lotus", "Rose", "Lali-Guras (Rhododendron)", "Sun-Flower"],
    correctAnswer: 2,
    category: "GK",
    difficulty: "Easy"
  },

  // --- NEPAL ELECTRICITY (10) ---
  {
    questionText: "What is the full form of NEA?",
    options: ["Nepal Electricity Association", "Nepal Electricity Authority", "National Energy Agency", "Nepal Electrical Authority"],
    correctAnswer: 1,
    category: "Nepal Electricity",
    difficulty: "Easy"
  },
  {
    questionText: "Who is the current Managing Director of NEA as of 2024?",
    options: ["Kulman Ghising", "Hitendra Dev Shakya", "Devendra Bahadur Singh", "Arjun Prasad Jha"],
    correctAnswer: 0,
    category: "Nepal Electricity",
    difficulty: "Easy"
  },
  {
    questionText: "What is the standard voltage for domestic supply in Nepal?",
    options: ["110V", "220V", "230V", "440V"],
    correctAnswer: 2,
    category: "Nepal Electricity",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the first Hydropower Project of Nepal?",
    options: ["Pharping", "Panauti", "Sundarijal", "Devighat"],
    correctAnswer: 0,
    category: "Nepal Electricity",
    difficulty: "Medium"
  },
  {
    questionText: "In which year was NEA established?",
    options: ["1980 AD", "1985 AD", "1990 AD", "1995 AD"],
    correctAnswer: 1,
    category: "Nepal Electricity",
    difficulty: "Hard",
    explanation: "Established on Bhadra 1, 2042 BS (1985 AD)."
  },
  {
    questionText: "Which of the following is a renewable resource of energy?",
    options: ["Coal", "Natural Gas", "Hydro-power", "Nuclear Energy"],
    correctAnswer: 2,
    category: "Nepal Electricity",
    difficulty: "Easy"
  },
  {
    questionText: "What is the unit of Electric Current?",
    options: ["Volt", "Ampere", "Watt", "Ohm"],
    correctAnswer: 1,
    category: "Nepal Electricity",
    difficulty: "Easy"
  },
  {
    questionText: "Which device is used to step up or step down AC voltage?",
    options: ["Inverter", "Generator", "Transformer", "Motor"],
    correctAnswer: 2,
    category: "Nepal Electricity",
    difficulty: "Medium"
  },
  {
    questionText: "What is the current total installed capacity (Hydro) of Nepal approximately?",
    options: ["1000 MW", "2000 MW", "2500+ MW", "5000 MW"],
    correctAnswer: 2,
    category: "Nepal Electricity",
    difficulty: "Medium"
  },
  {
    questionText: "What type of energy conversion occurs in a hydropower plant?",
    options: ["Chemical to Electrical", "Thermal to Electrical", "Potential to Kinetic to Electrical", "Nuclear to Electrical"],
    correctAnswer: 2,
    category: "Nepal Electricity",
    difficulty: "Hard"
  },

  // --- COMPUTER OPERATOR (10) ---
  {
    questionText: "In Excel, what is the intersection of a row and a column called?",
    options: ["Table", "Box", "Cell", "Grid"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Easy"
  },
  {
    questionText: "Which function in Excel is used to add values in a range?",
    options: ["ADD()", "TOTAL()", "SUM()", "COUNT()"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Easy"
  },
  {
    questionText: "What is the file extension of a Word document (modern)?",
    options: [".txt", ".pdf", ".docx", ".xlsx"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Easy"
  },
  {
    questionText: "Which of the following is a pointing device?",
    options: ["Keyboard", "Printer", "Mouse", "CPU"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Easy"
  },
  {
    questionText: "In MS Word, which alignment is used to flush text with both margins?",
    options: ["Left", "Right", "Center", "Justified"],
    correctAnswer: 3,
    category: "Computer Operator",
    difficulty: "Medium"
  },
  {
    questionText: "What is the binary equivalent of decimal number 10?",
    options: ["1010", "1100", "1001", "1111"],
    correctAnswer: 0,
    category: "Computer Operator",
    difficulty: "Medium"
  },
  {
    questionText: "Which component is responsible for translating domain names to IP addresses?",
    options: ["HTTP", "IPX", "DNS", "TCP"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Hard"
  },
  {
    questionText: "What is the full form of SQL?",
    options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "Sequential Query Language"],
    correctAnswer: 1,
    category: "Computer Operator",
    difficulty: "Medium"
  },
  {
    questionText: "Which of the following is a non-volatile memory?",
    options: ["RAM", "Register", "ROM", "L1 Cache"],
    correctAnswer: 2,
    category: "Computer Operator",
    difficulty: "Medium"
  },
  {
    questionText: "What is the maximum number of rows in an Excel 2010 worksheet?",
    options: ["65,536", "1,048,576", "32,767", "Unlimited"],
    correctAnswer: 1,
    category: "Computer Operator",
    difficulty: "Hard"
  },

  // --- BANKING SECTOR (10) ---
  {
    questionText: "Which is the central bank of Nepal?",
    options: ["Nepal Bank Ltd", "Nepal Investment Bank", "Nepal Rastra Bank", "Rastriya Banijya Bank"],
    correctAnswer: 2,
    category: "Banking Sector",
    difficulty: "Easy"
  },
  {
    questionText: "When was the Nepal Rastra Bank (NRB) established?",
    options: ["1950 AD", "1954 AD", "1956 AD", "1960 AD"],
    correctAnswer: 2,
    category: "Banking Sector",
    difficulty: "Medium",
    explanation: "Established on Baisakh 14, 2013 BS (1956 AD)."
  },
  {
    questionText: "What is the full form of KYC in banking?",
    options: ["Know Your Company", "Know Your Customer", "Keep Your Cash", "Keep Your Check"],
    correctAnswer: 1,
    category: "Banking Sector",
    difficulty: "Easy"
  },
  {
    questionText: "What is the minimum capital requirement for 'A' class commercial banks in Nepal?",
    options: ["2 Billion", "5 Billion", "8 Billion", "10 Billion"],
    correctAnswer: 2,
    category: "Banking Sector",
    difficulty: "Hard"
  },
  {
    questionText: "Which of the following is NOT a public sector bank in Nepal?",
    options: ["Rastriya Banijya Bank", "Nepal Bank Ltd", "Agriculture Development Bank", "Nabil Bank"],
    correctAnswer: 3,
    category: "Banking Sector",
    difficulty: "Medium"
  },
  {
    questionText: "What does ATM stand for?",
    options: ["Automated Teller Machine", "Any Time Money", "Auto Transfer Machine", "Active Teller Machine"],
    correctAnswer: 0,
    category: "Banking Sector",
    difficulty: "Easy"
  },
  {
    questionText: "What is the main source of income for a bank?",
    options: ["Fees charged", "Interest margin", "Govt subsidy", "ATM charges"],
    correctAnswer: 1,
    category: "Banking Sector",
    difficulty: "Medium"
  },
  {
    questionText: "The 'Base Rate' of a bank is used to determine what?",
    options: ["Staff salary", "Interest rate on loans", "ATM fees", "Forex rates"],
    correctAnswer: 1,
    category: "Banking Sector",
    difficulty: "Medium"
  },
  {
    questionText: "Liquidity ratio (CRR) in Nepal is fixed by whom?",
    options: ["Ministry of Finance", "Nepal Rastra Bank", "Nepal Bank Association", "Individual Banks"],
    correctAnswer: 1,
    category: "Banking Sector",
    difficulty: "Medium"
  },
  {
    questionText: "Which bank is known as the 'Banker's Bank'?",
    options: ["World Bank", "Commercial Bank", "Central Bank", "Investment Bank"],
    correctAnswer: 2,
    category: "Banking Sector",
    difficulty: "Easy"
  },

  // --- HEALTH (नेपाल स्वास्थ्य) (10) ---
  {
    questionText: "What is the normal body temperature of a healthy human being?",
    options: ["36°C", "37°C", "38°C", "39°C"],
    correctAnswer: 1,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Easy"
  },
  {
    questionText: "Which organ produces insulin in the human body?",
    options: ["Liver", "Kidney", "Pancreas", "Spleen"],
    correctAnswer: 2,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Medium"
  },
  {
    questionText: "Dengue is transmitted by which type of mosquito?",
    options: ["Anopheles", "Aedes aegypti", "Culex", "Mansonia"],
    correctAnswer: 1,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Medium"
  },
  {
    questionText: "What is the primary cause of Tuberculosis (TB)?",
    options: ["Virus", "Fungus", "Bacteria", "Protozoa"],
    correctAnswer: 2,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Medium"
  },
  {
    questionText: "Which vitamin deficiency causes Scurvy?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctAnswer: 2,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Easy"
  },
  {
    questionText: "ORS (Oral Rehydration Solution) is mainly used for which condition?",
    options: ["Fever", "Cough", "Diarrhea", "Headache"],
    correctAnswer: 2,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Easy"
  },
  {
    questionText: "Where is the Ministry of Health and Population of Nepal located?",
    options: ["Singha Durbar", "Ramshah Path", "Tripureshwor", "Lazimpat"],
    correctAnswer: 1,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Hard"
  },
  {
    questionText: "Which vaccine is given at birth under the National Immunization Program?",
    options: ["DPT", "BCG", "Polio", "Measles"],
    correctAnswer: 1,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Medium"
  },
  {
    questionText: "What is the universal blood donor type?",
    options: ["A+", "B+", "AB+", "O-"],
    correctAnswer: 3,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Easy"
  },
  {
    questionText: "Night blindness is caused due to the deficiency of which vitamin?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctAnswer: 0,
    category: "नेपाल स्वास्थ्य",
    difficulty: "Easy"
  },

  // --- NEPAL POLICE (10) ---
  {
    questionText: "Who is the head of the Nepal Police?",
    options: ["IGP", "AIGP", "DIGP", "SSP"],
    correctAnswer: 0,
    category: "Nepal Police",
    difficulty: "Easy"
  },
  {
    questionText: "When was the Nepal Police formally established under the Police Act?",
    options: ["2007 BS", "2012 BS", "2015 BS", "2020 BS"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Medium"
  },
  {
    questionText: "What is the tagline/motto of Nepal Police?",
    options: ["Nation First", "Truth, Service, Security", "Unity and Discipline", "Peace and Justice"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Medium",
    explanation: "Satya Sewa Surakshanam (Truth, Service, Security)."
  },
  {
    questionText: "Where is the headquarters of Nepal Police located?",
    options: ["Singha Durbar", "Naxal", "Tripureshwor", "Tundikhel"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Easy"
  },
  {
    questionText: "Which organ of the state does the Police fall under?",
    options: ["Judiciary", "Executive", "Legislature", "Media"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Medium"
  },
  {
    questionText: "What is the lowest rank in Nepal Police among the following?",
    options: ["Constable", "Jawan", "Head Constable", "ASI"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Easy"
  },
  {
    questionText: "What is the emergency phone number for Nepal Police?",
    options: ["100", "101", "102", "103"],
    correctAnswer: 0,
    category: "Nepal Police",
    difficulty: "Easy"
  },
  {
    questionText: "In which year was the Armed Police Force (APF) of Nepal established?",
    options: ["2050 BS", "2055 BS", "2057 BS", "2060 BS"],
    correctAnswer: 2,
    category: "Nepal Police",
    difficulty: "Hard"
  },
  {
    questionText: "Under which Ministry does the Nepal Police operate?",
    options: ["Ministry of Defense", "Ministry of Home Affairs", "Ministry of Law", "Prime Minister's Office"],
    correctAnswer: 1,
    category: "Nepal Police",
    difficulty: "Easy"
  },
  {
    questionText: "Who appoints the Inspector General of Police (IGP)?",
    options: ["Home Minister", "President", "Council of Ministers", "Chief Justice"],
    correctAnswer: 2,
    category: "Nepal Police",
    difficulty: "Medium"
  },

  // --- NEPAL ARMY (10) ---
  {
    questionText: "Who is the Supreme Commander-in-Chief of the Nepal Army?",
    options: ["Prime Minister", "Defense Minister", "President", "Chief of Army Staff"],
    correctAnswer: 2,
    category: "Nepal Army",
    difficulty: "Easy"
  },
  {
    questionText: "Who was the first Chief of Army Staff (CoAS) of Nepal?",
    options: ["Jung Bahadur Rana", "Toran Shumsher JB Rana", "Prithvi Narayan Shah", "Amar Singh Thapa"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Hard"
  },
  {
    questionText: "In which year was the Nepal Army formally established as a standing army?",
    options: ["1763 AD", "1768 AD", "1814 AD", "1846 AD"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Medium"
  },
  {
    questionText: "What is the name of the Nepal Army headquarters?",
    options: ["Tundikhel", "Bhadrakali (Jangi Adda)", "Naxal", "Singha Durbar"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Easy"
  },
  {
    questionText: "What is the highest rank in the Nepal Army?",
    options: ["General (Maharathi)", "Lieutenant General", "Major General", "Brigadier General"],
    correctAnswer: 0,
    category: "Nepal Army",
    difficulty: "Easy"
  },
  {
    questionText: "Nepal Army's primary role in the UN is known as?",
    options: ["UN-Peacekeeping", "UN-Combat", "UN-Monitoring", "UN-Relief"],
    correctAnswer: 0,
    category: "Nepal Army",
    difficulty: "Medium"
  },
  {
    questionText: "Under which Ministry does the Nepal Army operate?",
    options: ["Home Ministry", "Defense Ministry", "Foreign Ministry", "Communication Ministry"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Easy"
  },
  {
    questionText: "Which of the following is a historical battle fought by the Nepal Army?",
    options: ["Karkala", "Sindhuli Garhi", "Nalapani", "All of the above"],
    correctAnswer: 3,
    category: "Nepal Army",
    difficulty: "Medium"
  },
  {
    questionText: "What is the rank of the Chief of Army Staff in Nepal?",
    options: ["3-star General", "4-star General", "5-star General", "Ambassador"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Medium"
  },
  {
    questionText: "Who is known as the 'Father of Nepal Army'?",
    options: ["Jung Bahadur Rana", "Prithvi Narayan Shah", "Bhimsen Thapa", "Amar Singh Thapa"],
    correctAnswer: 1,
    category: "Nepal Army",
    difficulty: "Medium"
  },

  // --- ADDITIONAL CATEGORIES TO ENSURE 180 (Remaining 20) ---
  // ... Adding some more Current Affairs, Sport, Literature, World GK ...
  {
    questionText: "Who is the current Secretary General of the United Nations?",
    options: ["Ban Ki-moon", "Kofi Annan", "Antonio Guterres", "Boutros-Ghali"],
    correctAnswer: 2,
    category: "Current Affairs",
    difficulty: "Easy"
  },
  {
    questionText: "In which year did the Russia-Ukraine conflict escalate into a full-scale war?",
    options: ["2020", "2021", "2022", "2023"],
    correctAnswer: 2,
    category: "Current Affairs",
    difficulty: "Easy"
  },
  {
    questionText: "Which country hosted the FIFA World Cup 2022?",
    options: ["Brazil", "Qatar", "France", "Argentina"],
    correctAnswer: 1,
    category: "Sport",
    difficulty: "Easy"
  },
  {
    questionText: "Who wrote the national anthem of Nepal?",
    options: ["Lekhnath Paudyal", "Pradeep Kumar Rai (Byakul Maila)", "Madhav Prasad Ghimire", "Laxmi Prasad Devkota"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "Easy"
  },
  {
    questionText: "Who is known as 'Mahakavi' in Nepali Literature?",
    options: ["Lekhnath Paudyal", "Madhav Prasad Ghimire", "Laxmi Prasad Devkota", "Bhanubhakta Acharya"],
    correctAnswer: 2,
    category: "Literature",
    difficulty: "Easy"
  },
  {
    questionText: "Who is known as 'Adikavi' of Nepal?",
    options: ["Bhanubhakta Acharya", "Motiram Bhatta", "Laxmi Prasad Devkota", "Gopal Prasad Rimal"],
    correctAnswer: 0,
    category: "Literature",
    difficulty: "Easy"
  },
  {
    questionText: "Which is the largest country in the world by area?",
    options: ["USA", "Canada", "Russia", "China"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "The 'Great Wall' is located in which country?",
    options: ["India", "Mongolia", "China", "Japan"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "Which planet is closest to the Sun?",
    options: ["Venus", "Earth", "Mars", "Mercury"],
    correctAnswer: 3,
    category: "Science",
    difficulty: "Easy"
  },
  {
    questionText: "What is the currency of Japan?",
    options: ["Won", "Yen", "Dollar", "Yuan"],
    correctAnswer: 1,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "The 2024 Olympic Games will be held in which city?",
    options: ["London", "Tokyo", "Paris", "New York"],
    correctAnswer: 2,
    category: "Sport",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "Who is the author of 'Muna Madan'?",
    options: ["Laxmi Prasad Devkota", "B.P. Koirala", "Parijat", "Jhamak Ghimire"],
    correctAnswer: 0,
    category: "Literature",
    difficulty: "Easy"
  },
  {
    questionText: "In which year was the first SAARC summit held?",
    options: ["1980", "1985", "1990", "1995"],
    correctAnswer: 1,
    category: "Loksewa",
    difficulty: "Hard"
  },
  {
    questionText: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "Which is the highest waterfall in the world?",
    options: ["Niagara Falls", "Victoria Falls", "Angel Falls", "Iguazu Falls"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Medium"
  },
  {
    questionText: "Who won the ICC Men's Cricket World Cup 2023?",
    options: ["India", "Australia", "South Africa", "England"],
    correctAnswer: 1,
    category: "Sport",
    difficulty: "Easy"
  },
  {
    questionText: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctAnswer: 1,
    category: "World GK",
    difficulty: "Medium"
  },
  {
    questionText: "Which is the largest continent in the world?",
    options: ["Africa", "Asia", "Europe", "North America"],
    correctAnswer: 1,
    category: "World GK",
    difficulty: "Easy"
  },
  {
    questionText: "What is the capital of Bhutan?",
    options: ["Paro", "Punakha", "Thimphu", "Wangdue"],
    correctAnswer: 2,
    category: "World GK",
    difficulty: "Easy"
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let addedCount = 0;
    let skipCount = 0;

    for (const q of questions) {
      const exists = await Question.findOne({ 
        questionText: { $regex: new RegExp(`^${q.questionText.trim()}$`, 'i') } 
      });

      if (!exists) {
        await Question.create(q);
        addedCount++;
      } else {
        skipCount++;
      }
    }

    console.log('\n--- Seeding Complete ---');
    console.log(`Added: ${addedCount}`);
    console.log(`Skipped (Duplicates): ${skipCount}`);
    console.log(`Total intended: ${questions.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedQuestions();
