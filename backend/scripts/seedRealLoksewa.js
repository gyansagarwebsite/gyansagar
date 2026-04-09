import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../src/utils/dnsSetup.js';
import Question from '../src/models/Question.js';
import dbConnect from '../src/config/db.js';

dotenv.config();

const questions = [
  // --- NEPAL ELECTRICITY AUTHORITY (NEA) ---
  {
    questionText: 'When was Nepal Electricity Authority (NEA) established?',
    options: ['Bhadra 1, 2042 BS', 'Asoj 1, 2042 BS', 'Bhadra 1, 2041 BS', 'Shrawan 1, 2042 BS'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the voltage of the primary distribution line of NEA?',
    options: ['11 kV', '33 kV', '66 kV', '132 kV'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who is the current Managing Director of NEA (2080 BS)?',
    options: ['Kulman Ghising', 'Hitendra Dev Shakya', 'Mukesh Raj Kafle', 'Arjun Kumar Karki'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Easy'
  },
  {
    questionText: 'In which year was the Nepal Electricity Authority Act passed?',
    options: ['2041 BS', '2042 BS', '2048 BS', '2050 BS'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which is the largest hydropower project in Nepal currently in operation?',
    options: ['Upper Tamakoshi', 'Kaligandaki A', 'Middle Marshyangdi', 'Kulekhani'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the frequency of electricity supply in Nepal?',
    options: ['50 Hz', '60 Hz', '45 Hz', '55 Hz'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Easy'
  },
  {
    questionText: 'What does "SCADA" stand for in power systems?',
    options: ['Supervisory Control and Data Acquisition', 'System Control and Data Analysis', 'Security Control and Data Automation', 'Supervisory Computing and Data Access'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Hard'
  },
  {
    questionText: 'The main function of a transformer is:',
    options: ['To change the voltage level', 'To change DC to AC', 'To generate electricity', 'To store energy'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which body is responsible for regulating the electricity tariff in Nepal?',
    options: ['Electricity Regulatory Commission', 'Ministry of Energy', 'NEA Board', 'Water and Energy Commission'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Medium'
  },
  {
    questionText: 'When is "Electricity Day" celebrated in Nepal?',
    options: ['Bhadra 1', 'Baisakh 1', 'Magh 1', 'Ashad 1'],
    correctAnswer: 0,
    category: 'Nepal Electricity',
    difficulty: 'Medium'
  },

  // --- COMPUTER OPERATOR ---
  {
    questionText: 'Which shortcut key is used to save a document in MS Word?',
    options: ['Ctrl + S', 'Ctrl + A', 'Ctrl + V', 'Ctrl + P'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the extension of MS Word 2007 and later versions?',
    options: ['.docx', '.doc', '.xlsx', '.txt'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'In MS Excel, how many rows are there in a single worksheet?',
    options: ['1,048,576', '65,536', '16,384', '256'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which function is used to add values in a range of cells in Excel?',
    options: ['SUM()', 'ADD()', 'PLUS()', 'TOTAL()'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which key is used to refresh a web page or file browser?',
    options: ['F5', 'F2', 'F12', 'F1'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the full form of HTTP?',
    options: ['Hypertext Transfer Protocol', 'Hyperlink Text Transfer Protocol', 'High Tech Transfer Process', 'Hypertext Transfer Page'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which part of the computer is known as its "Brain"?',
    options: ['CPU', 'RAM', 'Hard Disk', 'Motherboard'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: '1024 Megabytes (MB) is equal to:',
    options: ['1 Gigabyte (GB)', '1 Terabyte (TB)', '100 GB', '1 Petabyte'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which of the following is an Operating System?',
    options: ['Windows 11', 'MS Word', 'Google Chrome', 'VLC Player'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Easy'
  },
  {
    questionText: 'In MS Word, "Mail Merge" is used for:',
    options: ['Creating mass letters or labels', 'Sending emails', 'Formatting text', 'Checking spelling'],
    correctAnswer: 0,
    category: 'Computer Operator',
    difficulty: 'Medium'
  },

  // --- NEPAL POLICE ---
  {
    questionText: 'Who was the first Inspector General of Nepal Police?',
    options: ['Torbarna Shumsher JBR', 'Khila Nath Dahal', 'Upendra Kanta Aryal', 'Achyut Krishna Kharel'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the motto of Nepal Police?',
    options: ['Truth, Service, Security', 'Peace and Protection', 'Bravery and Loyalty', 'Service to Nation'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Easy'
  },
  {
    questionText: 'In which year was the Nepal Police Act published?',
    options: ['2012 BS', '2015 BS', '2007 BS', '2028 BS'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Medium'
  },
  {
    questionText: 'Where is the Nepal Police Headquarters located?',
    options: ['Naxal, Kathmandu', 'Singha Durbar', 'Tundikhel', 'Saneppa'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the highest rank in Nepal Police?',
    options: ['Inspector General (IGP)', 'Additional Inspector General (AIG)', 'Deputy Inspector General (DIG)', 'SSP'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Easy'
  },
  {
    questionText: 'What does INTERPOL stand for?',
    options: ['International Criminal Police Organization', 'International Policy Bureau', 'Internal Police Union', 'International Security Force'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Medium'
  },
  {
    questionText: 'How many regional police offices (now Provincial) are there in Nepal?',
    options: ['7', '5', '14', '77'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Easy'
  },
  {
    questionText: 'Who is the current Inspector General of Nepal Police (2080 BS)?',
    options: ['Basanta Bahadur Kunwar', 'Dheeraj Pratap Singh', 'Shailesh Thapa Chhetri', 'Sarvendra Khanal'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Medium'
  },
  {
    questionText: 'The Junior Police Officer ranks starts from:',
    options: ['Assistant Sub Inspector (ASI)', 'Police Inspector', 'Police Constable', 'SI'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Medium'
  },
  {
    questionText: 'What color is the badge of Nepal Police?',
    options: ['Crimson Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 0,
    category: 'Nepal Police',
    difficulty: 'Easy'
  },

  // --- NEPAL ARMY ---
  {
    questionText: 'Who is the Supreme Commander-in-Chief of Nepal Army according to the Constitution?',
    options: ['President of Nepal', 'Prime Minister', 'COAS', 'Defense Minister'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Medium'
  },
  {
    questionText: 'What is the highest rank in Nepal Army?',
    options: ['General (Maharathi)', 'Lieutenant General', 'Major General', 'COAS'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Easy'
  },
  {
    questionText: 'When is Nepal Army Day celebrated?',
    options: ['Maha Shivaratri', 'Dashain', 'Baisakh 1', 'Fagun 7'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who was the first Chief of Army Staff (COAS) from a commoner background?',
    options: ['Kirat Singh Khadka', 'Toran Shumsher', 'Dharmapal Barsingh Thapa', 'Satchit Shumsher'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Hard'
  },
  {
    questionText: 'Which organization is Nepal Army famous for serving in internationally?',
    options: ['UN Peacekeeping Force', 'NATO', 'Red Cross', 'SAARC Force'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Easy'
  },
  {
    questionText: 'Where is the Nepal Army War College located?',
    options: ['Nagarkot', 'Shivapuri', 'Pokhara', 'Charali'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Hard'
  },
  {
    questionText: 'What was Nepal Army called before 2063 BS?',
    options: ['Royal Nepalese Army', 'Gorkha Army', 'Nepal People Army', 'Hindu Army'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Easy'
  },
  {
    questionText: 'Who is the current COAS of Nepal Army (2080 BS)?',
    options: ['Prabhu Ram Sharma', 'Purna Chandra Thapa', 'Rajendra Chhetri', 'Gaurav Shumsher'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Medium'
  },
  {
    questionText: 'The famous "Gorkha War" was fought between Nepal and:',
    options: ['British East India Company', 'Tibet', 'China', 'Marathas'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which fort is famous for the bravery of Bhakti Thapa?',
    options: ['Deuthal', 'Nalapani', 'Jaitak', 'Almora'],
    correctAnswer: 0,
    category: 'Nepal Army',
    difficulty: 'Medium'
  },

  // --- BANKING SECTOR ---
  {
    questionText: 'Which is the central bank of Nepal?',
    options: ['Nepal Rastra Bank', 'Nepal Bank Limited', 'Rastriya Banijya Bank', 'Krishi Bikas Bank'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Easy'
  },
  {
    questionText: 'In which year was Nepal Rastra Bank established?',
    options: ['2013 BS', '2010 BS', '2020 BS', '2007 BS'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who is the first Governor of Nepal Rastra Bank?',
    options: ['Himalaya Shumsher JBR', 'Laxmi Nath Gautam', 'Yuvraj Khatiwada', 'Satyendra Pyara Shrestha'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Medium'
  },
  {
    questionText: 'What does "KYC" stand for in banking?',
    options: ['Know Your Customer', 'Keep Your Cash', 'Know Your Credit', 'Key Your Credentials'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which was the first commercial bank established in Nepal?',
    options: ['Nepal Bank Limited', 'Nepal Rastra Bank', 'Standard Chartered Bank', 'Nabil Bank'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the full form of "SWIFT" in banking?',
    options: ['Society for Worldwide Interbank Financial Telecommunication', 'Secure Worldwide Interbank Financial Transfer', 'System for World Interbank Fund Transfer', 'Simple Worldwide Interbank Finance Tool'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Hard'
  },
  {
    questionText: 'CRR stands for:',
    options: ['Cash Reserve Ratio', 'Credit Risk Rating', 'Cash Recovery Rate', 'Capital Reserve Ratio'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who appoints the Governor of Nepal Rastra Bank?',
    options: ['Nepal Government (Cabinet)', 'President of Nepal', 'Finance Minister', 'Public Service Commission'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which type of bank is known as "A" class bank in Nepal?',
    options: ['Commercial Bank', 'Development Bank', 'Finance Company', 'Microfinance'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Easy'
  },
  {
    questionText: 'The "BAFIA" Act 2073 is related to:',
    options: ['Banking and Financial Institutions', 'Agriculture Development', 'Police Administration', 'Electricity Regulation'],
    correctAnswer: 0,
    category: 'Banking Sector',
    difficulty: 'Medium'
  },

  // --- NEPAL HEALTH (नेपाल स्वास्थ्य) ---
  {
    questionText: 'What is the target of Sustainable Development Goal (SDG) 3?',
    options: ['Good Health and Well-being', 'Quality Education', 'No Poverty', 'Gender Equality'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which vitamin deficiency causes Scurvy?',
    options: ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin B12'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Easy'
  },
  {
    questionText: 'How many vertebrae are there in an adult human spine?',
    options: ['33 (infant) / 26 (adult)', '20', '50', '12'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Hard'
  },
  {
    questionText: 'When is World Health Day celebrated?',
    options: ['April 7', 'May 12', 'March 24', 'December 1'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Medium'
  },
  {
    questionText: 'ORS stands for:',
    options: ['Oral Rehydration Solution', 'Oral Recovery System', 'Oxygen Recovery Salt', 'Oral Relief Sugar'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Easy'
  },
  {
    questionText: 'Which is the largest organ of the human body?',
    options: ['Skin', 'Liver', 'Heart', 'Lungs'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Easy'
  },
  {
    questionText: 'What is the causative agent of Tuberculosis?',
    options: ['Mycobacterium tuberculosis', 'Vibrio cholerae', 'Influenza virus', 'Plasmodium'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Medium'
  },
  {
    questionText: 'In which year was the Nepal Health Service Act published?',
    options: ['2053 BS', '2063 BS', '2048 BS', '2072 BS'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Hard'
  },
  {
    questionText: 'The process of killing all microorganisms including spores is called:',
    options: ['Sterilization', 'Disinfection', 'Sanitization', 'Cleaning'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Medium'
  },
  {
    questionText: 'Which blood group is known as the "Universal Donor"?',
    options: ['O Negative', 'AB Positive', 'A Positive', 'B Negative'],
    correctAnswer: 0,
    category: 'नेपाल स्वास्थ्य',
    difficulty: 'Medium'
  },

  // --- GENERAL CATEGORIES (HISTORY) ---
  {
    questionText: 'Who is known as the "Father of the Nation" of Nepal?',
    options: ['Prithvi Narayan Shah', 'Tribhuvan Bir Bikram Shah', 'B.P. Koirala', 'Bhimsen Thapa'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Easy'
  },
  {
    questionText: 'When did the Kot Massacre take place?',
    options: ['Sept 14, 1846 (Ashwin 2, 1903)', '2007 BS', '1950 BS', '2017 BS'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who was the first Rana Prime Minister of Nepal?',
    options: ['Jung Bahadur Rana', 'Chandra Shumsher', 'Ranodip Singh', 'Bhim Shumsher'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Easy'
  },
  {
    questionText: 'The Sugauli Treaty was signed in which year?',
    options: ['1816 AD', '1814 AD', '1857 AD', '1923 AD'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who was the first woman to climb Mt. Everest?',
    options: ['Junko Tabei', 'Pasang Lhamu Sherpa', 'Tamae Watanabe', 'Lhakpa Sherpa'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },
  {
    questionText: 'The Lichhavi period is often called the:',
    options: ['Golden Age of Nepal', 'Dark Age', 'Medieval Age', 'Modern Age'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Easy'
  },
  {
    questionText: 'Who was the king of Nepal during the 2007 BS revolution?',
    options: ['King Tribhuvan', 'King Mahendra', 'King Birendra', 'King Gyanendra'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },
  {
    questionText: 'The Anglo-Nepal war started in:',
    options: ['1814 AD', '1816 AD', '1768 AD', '1846 AD'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Medium'
  },
  {
    questionText: 'Who built the 55-window palace of Bhaktapur?',
    options: ['Bhupatindra Malla', 'Pratap Malla', 'Jaya Prakash Malla', 'Yakshya Malla'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Hard'
  },
  {
    questionText: 'How many years did the Rana regime last in Nepal?',
    options: ['104 years', '100 years', '50 years', '200 years'],
    correctAnswer: 0,
    category: 'History',
    difficulty: 'Easy'
  }
];

const seedRealLoksewa = async () => {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    // Add slugs to questions
    const processedQuestions = questions.map(q => ({
      ...q,
      slug: q.questionText.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50)
    }));

    await Question.insertMany(processedQuestions);
    console.log(`🚀 Successfully seeded ${processedQuestions.length} real Loksewa questions!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error.message);
    process.exit(1);
  }
};

seedRealLoksewa();
